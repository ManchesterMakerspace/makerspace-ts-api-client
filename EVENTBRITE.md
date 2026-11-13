# Eventbrite contracts

Version 2.10.0 preserves the published 2.9.0 transport and existing operations,
adding generated signup and restricted staff operations. Regenerate the additive
module with `npm run generate:eventbrite -- /path/to/swagger/v1/swagger.json`,
then run `npm run build` and `npm pack`. The private webhook receiver is deliberately
not a browser-client operation.

The old full generator cannot consume the current Rails schema (nullable numeric
enums, duplicate enum names and outdated request-template signatures). This
additive generator avoids changing unrelated contracts. A full generator upgrade
is separate work. Its source is the committed Rails OpenAPI artifact.

Publish 2.10.0 only after the additive Rails contracts are deployed, then update
React from its tested local package to the registry release. npm authentication
is required. Do not publish the wiki instructions until the feature is deployed.
