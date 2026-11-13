// Additive generation preserves the published client's existing transport/API.
// Usage: node scripts/generate-eventbrite.cjs path/to/Rails/swagger/v1/swagger.json
const fs = require('fs');
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const operations = Object.entries(spec.paths).flatMap(([path, item]) => Object.entries(item)
  .filter(([method, op]) => ['get', 'put'].includes(method) && op.tags?.includes('Eventbrite'))
  .map(([method, op]) => ({ path, method, op })));
function type(s = {}) {
  let result;
  if (s.$ref) result = s.$ref.split('/').pop();
  else if (s.type === 'array') result = `Array<${type(s.items)}>`;
  else if (s.type === 'object' || s.properties) result = s.properties
    ? `{ ${Object.entries(s.properties).map(([k, v]) => `${JSON.stringify(k)}${s.required?.includes(k) ? '' : '?'}: ${type(v)};`).join(' ')} }`
    : '{ [key: string]: unknown }';
  else result = ({ integer: 'number', number: 'number', boolean: 'boolean', string: 'string' })[s.type] || 'unknown';
  return s.nullable ? `${result} | null` : result;
}
const source = spec.paths['/signup_source'].put.requestBody.content['application/json'].schema;
const signupEvent = spec.paths['/signup_events'].get.responses['200'].content['application/json'].schema.items;
let output = '// Generated from Rails OpenAPI by scripts/generate-eventbrite.cjs.\n';
output += "import { makeRequest, ApiDataResponse, Member } from './apiClient';\n\n";
output += `export type SignupAttribution = ${type(source)};\n`;
output += `export type SignupEvent = ${type(signupEvent)};\n`;
output += `export type EventbriteRecord = ${type(spec.components.schemas.EventbriteRecord)};\n\n`;
for (const { path, method, op } of operations) {
  const params = op.parameters || [];
  const body = op.requestBody?.content?.['application/json']?.schema;
  const fields = params.map(p => `${JSON.stringify(p.name)}${p.required ? '' : '?'}: ${type(p.schema)};`);
  if (body) fields.push('body?: SignupAttribution;');
  const signature = fields.length ? `params: { ${fields.join(' ')} }` : '';
  const result = type(op.responses['200'].content['application/json'].schema);
  const pathExpression = JSON.stringify(path) + params.filter(p => p.in === 'path').map(p => `.replace(${JSON.stringify(`{${p.name}}`)}, encodeURIComponent(params[${JSON.stringify(p.name)}]))`).join('');
  const query = params.filter(p => p.in === 'query');
  const payload = body ? 'params.body' : query.length ? `{ ${query.map(p => `${JSON.stringify(p.name)}: params[${JSON.stringify(p.name)}]`).join(', ')} }` : 'undefined';
  output += `export function ${op.operationId}(${signature}): Promise<ApiDataResponse<${result}>> {\n  return makeRequest<${result}>(${JSON.stringify(method.toUpperCase())}, ${pathExpression}, ${payload});\n}\n\n`;
}
fs.writeFileSync('lib/eventbrite.ts', output);
let base = fs.readFileSync('lib/apiClient.ts', 'utf8');
if (!base.includes("import { SignupAttribution }")) {
  base = "import { SignupAttribution } from './eventbrite';\n" + base;
  base = base.replace('export interface NewMember extends BaseMember {', 'export interface NewMember extends BaseMember, SignupAttribution {');
  base = base.replace('export interface Member extends NewMember {', 'export interface Member extends NewMember {\n    signupSourcePromptPending?: boolean;\n    signupEventbriteEventSnapshot?: { name: string; startsAt: string; timezone: string };');
  base += "\nexport * from './eventbrite';\n";
  fs.writeFileSync('lib/apiClient.ts', base);
}
