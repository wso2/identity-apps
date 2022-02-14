# WSO2 Identity Server - Core module for Identity apps.

Commonly used configs, schemas, utilities and low level services for WSO2 Identity Server frontend apps.

## Install
Add following dependency in your package.json file.
`"@wso2is/core": "<VERSION>"`

## Sub modules

The following sub modules are available for use and can be imported in to the projects.

1. api - Contains common API requests (`wso2is/core/api`)
2. configs - Common configs such as endpoints etc. (`wso2is/core/configs`)
3. constants - Common constants (`wso2is/core/constants`)
4. exceptions - Common exceptions (`wso2is/core/exceptions`)
5. helpers - Helper functions such as history, parsers etc. (`wso2is/core/helpers`)
6. hooks - Contains reusable react hooks. (`wso2is/core/hooks`)
7. models - Commonly used models and schemas. (`wso2is/core/models`)
8. store - Common redux actions, types and reducers (`wso2is/core/store`)
9. utils - Common utils (`wso2is/core/utils`)
9. workers - Contains used web workers (`wso2is/core/workers`)

## Notes

1. If TSLint starts detecting submodule imports such as `wso2is/core/utils` as an error, you can edit `no-submodule-imports` rule in the TSLint configuration to whitelist them.

```json
{
    "rules": {
        "no-submodule-imports": [
            true,
            "@wso2is/core/api",
            "@wso2is/core/configs",
            "@wso2is/core/constants",
            "@wso2is/core/exceptions",
            "@wso2is/core/helpers",
            "@wso2is/core/hooks",
            "@wso2is/core/models",
            "@wso2is/core/store",
            "@wso2is/core/utils",
            "@wso2is/core/workers"
        ]
    }
}
``` 

2. Oftentimes, sub modules are not properly resolved. Specially type detection and intelligence will not work as expected unless the submodule paths are explicitly declared in the Typescript config file.  

Please declare the following paths inside the `tsconfig.json` of your application.

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@wso2is/core/api": [ "node_modules/@wso2is/core/dist/types/api" ],
            "@wso2is/core/configs": [ "node_modules/@wso2is/core/dist/types/configs" ],
            "@wso2is/core/constants": [ "node_modules/@wso2is/core/dist/types/constants" ],
            "@wso2is/core/exceptions": [ "node_modules/@wso2is/core/dist/types/exceptions" ],
            "@wso2is/core/helpers": [ "node_modules/@wso2is/core/dist/types/helpers" ],
            "@wso2is/core/hooks": [ "node_modules/@wso2is/core/dist/types/hooks" ],
            "@wso2is/core/models": [ "node_modules/@wso2is/core/dist/types/models" ],
            "@wso2is/core/store": [ "node_modules/@wso2is/core/dist/types/store" ],
            "@wso2is/core/utils": [ "node_modules/@wso2is/core/dist/types/utils" ],
            "@wso2is/core/workers": [ "node_modules/@wso2is/core/dist/types/workers" ]
        }
    }
}
```


## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.

