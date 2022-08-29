# WSO2 Identity Server - Front-End Access Control Module

A module which will render front end components based on user permissions.

## Insight
This module will govern the front end component rendering with the context built using the user permissions  retrieved while the login process. The module builds a front end related permission mapping based on the scopes recieved from the backend. The `access-control-context-provider.tsx` will define the required permission object which will be later used on evaluating components prior to render.

## Install
Add following dependency in your package.json file.
`"@wso2is/access-control": "<VERSION>"`

## Build
```bash
pnpm build
```

## Usage
### Render Component based on Permission
In order to do this we need to import `Show` and `AccessControlConstants` components from the module.

```
import { AccessControlConstants, Show } from "@wso2is/access-control";

<Show when={ AccessControlConstants.PERMISSION }> //Permission requred for successful render
    <Component></Component>
</Show>
```

### Adding a new permission mapping
1. The new permission should be mapped in the `access-control-constants` file which will consist all the front end related permissions.

    ```
    public static readonly NEW_PERMISSION: string = "scope:delete"; // define a suitable permission string
    ```
2. Add new entries the permissions object in `access-control-context-provider` file.

    ```
        [ AccessControlConstants.NEW_PERMISSION ] : hasRequiredScopes(featureConfig.newFeature,featureConfig.newFeature.scopes.permission, allowedScopes)
    ```

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](../../LICENSE)), You may not use this file except in compliance with the License.
