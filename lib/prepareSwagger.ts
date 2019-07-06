type JsonValue = string | number | object | string[] | number[] | object[];
const prepare = (swagger: { [key: string]: JsonValue}) => ({
  ...swagger,
  paths: Object.entries(swagger.paths as { [key: string]: JsonValue }).reduce((acc, [path, operations]) => {
    acc.push(
      ...Object.entries(operations as  { [key: string]: JsonValue }).map(([method, operation]) => ({
        ...operation as object,
        method: method.toUpperCase(),
        path: path,
      }))
    );
    return acc;
  }, [])
});

export default prepare;


// "/admin/billing/plans": {
//   "get": {
//     "summary": "Gets a list of billing plans",
//     "tags": [
//       "Plans"
//     ],
//     "operationId": "adminListBillingPlans",
//     "parameters": [