# Configurations

* [Overview](#overview)
* [Console Configs](#console-configs)
  * [idp_configs](#idp_configs)
* [My Account Configs](#my-account-configs)

## Overview

The portals i.e. Console & My Account are configurable using the `deployment.toml` when they are hosted inside the Identity Server.

To learn more abut the new configuration model, click [here](https://is.docs.wso2.com/en/latest/references/new-configuration-model/).

## Console Configs

The following sections contain all the necessary configs that are needed to configure/override the existing behaviour of the `Console` application.

#### `applications`

Different configurations for applications that are used inside the `Console`.

##### `account_app`

My Account app configurations.

```toml
[console]
applications.account_app.configs.origin = "<MY_ACCOUNT_ORIGIN>" # Defaults to the server URL (ex: https://localhost:9443).
applications.account_app.configs.path = "<PATH>" # Relative path(without tenant) to navigate when the My Account link is clicked on the user dropdown. Defaults to `/myaccount/overview`.
```

##### `admin_app`

Console app's **Manage** section configs.

```toml
[console]
applications.admin_app.configs.basePath = "<BASE_PATH>" # Defaults to the `/manage`.
applications.admin_app.configs.displayName = "<DISPLAY_NAME>" # Name to displayed in the tab. Defaults to the `Manage`.
applications.admin_app.configs.path = "<PATH>" # Path to navigate the users when the manage tab is clicked. Defaults to the `/manage/users`.
```

##### `developer_app`

Console app's **Develop** section configs.

```toml
[console]
applications.developer_app.configs.basePath = "<BASE_PATH>" # Defaults to the `/develop`.
applications.developer_app.configs.displayName = "<DISPLAY_NAME>" # Name to displayed in the tab. Defaults to the `Develop`.
applications.developer_app.configs.path = "<PATH>" # Path to navigate the users when the manage tab is clicked. Defaults to the `/develop/applications`.
```

#### `app_base_name`

> :white_check_mark: Default - console

Base name of the application.
This configuration is needed if you want to change app base name from `console` to something else.

NOTE: Changing just the bellow config will not be enough to achieve the desired results. You will have to manually rename the application in `<IS_HOME>/repository/deployment/server/webapps`.
And also you will have to refactor the paths(links to the theme, rpIframe etc.) in `index.jsp` at the root of the `console` webapp.

**Supported Values -** Any string value

```toml
[console]
app_base_name = "custom-console"
```

NOTE FOR DEVS: If you want to build the application with a different basename, change this config in `<REPO_ROOT>/apps/console/src/public/deployment.config.json`.
[Webapack](https://webpack.js.org/) will use this value during build time to put all the build files.

#### `app_base_name_for_history_api`

> :white_check_mark: Default - "/"

Base name used by the browser history API.

**Supported Values -** Any path with a leading forward slash.

```toml
[console]
app_base_name_for_history_api = "/console"
```

#### `client_id`

> :white_check_mark: Default - "CONSOLE"

Client ID of the application.

**Supported Values -** Any string value. Check the [OIDC configurations section](https://is.docs.wso2.com/en/latest/learn/configuring-oauth2-openid-connect-single-sign-on/) of the application to retrieve the correct value.

```toml
[console]
app_base_name_for_history_api = "CONSOLE"
```

#### `debug`

> :white_check_mark: Default - false

Enable debug logs for certain features such as `i18n` etc.

**Supported Values -** true | false

```toml
[console]
debug.enable = true
```

### `idp_configs`

Configs for the [authentication SDK](https://github.com/asgardio/asgardio-js-oidc-sdk).

##### `enablePKCE`

> :white_check_mark: Default - true

The Proof Key for Code Exchange (PKCE) is a specification supported by WSO2 Identity Server to mitigate code interception attacks.
[See Mitigating Authorization Code Interception Attacks](https://is.docs.wso2.com/en/latest/administer/mitigating-authorization-code-interception-attacks) to configure PKCE for an OAuth application.

**Supported Values -** true | false

```toml
[console]
idp_configs.enablePKCE = true
```

##### `responseMode`

> :white_check_mark: Default - "form_post"

How the result of the authorization request is formatted.

**Supported Values -** "form_post" | "query"

```toml
[console]
idp_configs.responseMode = "form_post"
```

##### `scope`

> :white_check_mark: Default - [ "SYSTEM" ]

Scopes requested when the token request is made.

**Supported Values -** string array

```toml
[console]
idp_configs.scope = [ "internal_login", "internal_identity_mgt_view" ]
```

##### `serverOrigin`

> :white_check_mark: Default - https://localhost:9443

The origin of the Identity Provider. eg: https://localhost:9443

**Supported Values -** Any URL

```toml
[console]
idp_configs.serverOrigin = "https://localhost:9443"
```

##### `storage`

> :white_check_mark: Default - webWorker

The storage medium where the session information such as the access token should be stored.

**Supported Values -** "sessionStorage" | "webWorker" | "localStorage"

```toml
[console]
idp_configs.storage = "webWorker"
```

##### `authorizeEndpointURL`

> :white_check_mark: Default - "/oauth2/authorize"

The endpoint to send the authorization request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.authorizeEndpointURL = "/oauth2/authorize"
```

##### `jwksEndpointURL`

> :white_check_mark: Default - "/oauth2/jwks"

The endpoint from which the JSON Web Keyset can be obtained.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.jwksEndpointURL = "/oauth2/jwks"
```

##### `logoutEndpointURL`

> :white_check_mark: Default - "/oidc/logout"

The endpoint to send the logout request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.logoutEndpointURL = "/oidc/checksession"
```

##### `oidcSessionIFrameEndpointURL`

> :white_check_mark: Default - "/oidc/checksession"

The URL of the OIDC session iframe.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.oidcSessionIFrameEndpointURL = "/oidc/checksession"
```

##### `tokenRevocationEndpointURL`

> :white_check_mark: Default - "/oauth2/revoke"

The endpoint to send the revoke-access-token request to..

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.tokenRevocationEndpointURL = "/oauth2/revoke"
```

##### `tokenEndpointURL`

> :white_check_mark: Default - "/oauth2/token"

The endpoint to send the token request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.tokenEndpointURL = "/oauth2/token"
```

##### `tokenEndpointURL`

> :white_check_mark: Default - "/oauth2/oidcdiscovery/.well-known/openid-configuration"

The endpoint to receive the OIDC endpoints from.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.wellKnownEndpointURL = "/oauth2/oidcdiscovery/.well-known/openid-configuration"
```

### `session`

OIDC Session management configs.

##### `userIdleTimeOut`

> :white_check_mark: Default - 600 seconds

Idle timeout interval.

**Supported Values -** Any numerical value. (in seconds) 

```toml
[console]
session.params.userIdleTimeOut = 600
```

##### `userIdleWarningTimeOut`

> :white_check_mark: Default - 580 seconds

When will the warning modal appear to warn about idle timeout.

**Supported Values -** Any numerical value. (in seconds and should be less than `userIdleTimeOut`) 

```toml
[console]
session.params.userIdleWarningTimeOut = 580
```

##### `sessionRefreshTimeOut`

> :white_check_mark: Default - 300 seconds

When to send the session extension request.

**Supported Values -** Any numerical value. (in seconds) 

```toml
[console]
session.params.sessionRefreshTimeOut = 300
```

##### `checkSessionInterval`

> :white_check_mark: Default - 3 seconds

At what interval should the app poll for session state.

**Supported Values -** Any numerical value. (in seconds) 

```toml
[console]
session.params.checkSessionInterval = 3
```

#### `tenantResolutionStrategy`

> :white_check_mark: Default - id_token

How is the tenant resolved after the user is logged in.
In SaaS mode, the tenant will be extracted from the logged in users ID token. Otherwise, the tenant can be obtained by reading the URL.

**Supported Values -** "location" | "id_token"

```toml
[console]
tenantResolutionStrategy = "id_token"
```
