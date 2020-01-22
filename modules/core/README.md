# WSO2 Identity Server - Core module for Identity apps.

Commonly used configs, schemas, utilities and low level services for WSO2 Identity Server frontend apps.

## Install
Add following dependency in your package.json file.
`"@wso2is/core": "<VERSION>"`

## Sub modules

The following sub modules are available for use and can be imported in to the projects.

1. api - Contains common API requests (`wso2is/core/api`)
2. configs - Common configs such as endpoints etc. (`wso2is/core/configs`)
3. constants - Common Constants (`wso2is/core/constants`)
4. helpers - Helper functions such as history, parsers etc. (`wso2is/core/helpers`)
5. hooks - Contains reusable react hooks. (`wso2is/core/hooks`)
6. models - Commonly used models and schemas. (`wso2is/core/models`)
7. store - Common redux actions, types and reducers (`wso2is/core/store`)
8. utils - Common utils (`wso2is/core/utils`)

## Notes

If TSLint starts detecting submodule imports such as `wso2is/core/utils` as an error, you can edit `no-submodule-imports` rule in the TSLint configuration to whitelist them.

```json
{
"no-submodule-imports": [ true, "@wso2is/core/*" ]
}
``` 

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.

