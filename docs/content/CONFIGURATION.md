# Configurations

* [Overview](#overview)
* [Common Configs](#common-configs)
* [Console Specific Configs](#console-specific-configs)

## Overview

The portals i.e. Console & My Account are configurable using the `deployment.toml` when they are hosted inside the Identity Server.
The Jinja 2 template files which can be found in `features/org.wso2.identity.apps.{$appName}.server.feature/resources/deployment.config.json.j2` are used to template the configuration file i.e. `deploymemnt.config.json` which can be found at the root of the webapp.

**Note**: If the portals are to be hosted outside, the aforementioned `deployment.config.json` file has to be modified accordingly.

To learn more abut the new configuration model, click [here](https://is.docs.wso2.com/en/latest/references/new-configuration-model/).

## Common Configs

The following sections contain the common configs that are needed to configure/override the existing behaviour of the `Console` or `My Account` application.

### `app_base_name`

> :white_check_mark: Default JSON value - `"console"` | `"myaccount"`

This configuration is needed if you want to change app base name from `console` or `myaccount` to something else.

**Note**: Changing just the bellow config will not be enough to achieve the desired results. You will have to manually rename the application in `<IS_HOME>/repository/deployment/server/webapps`.
And also you will have to refactor the paths(links to the theme, rpIframe etc.) in `index.jsp` at the root of the `console` webapp.

**Supported Values -** Any string value

```toml
[console]
app_base_name = "custom-console"
```

**Note for Developers**: If you want to build the application with a different basename, change this config in `<REPO_ROOT>/apps/console/src/public/deployment.config.json`.
[Webapack](https://webpack.js.org/) will use this value during build time to put all the build files.

### `app_base_name_for_history_api`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/"`

Base name used by the browser history API. For the default SaaS behaviour `/` has been used due to limitations in history API. See https://github.com/ReactTraining/history/issues/644.
This config was added to enable support for none SaaS apps so that they can easily history push.

**Supported Values -** Any path with a leading forward slash.

```toml
[console]
app_base_name_for_history_api = "/console"
```

### `client_id`

> :white_check_mark: Default JSON value - `"CONSOLE"` | `"MY_ACCOUNT"`

Client ID of the application.

**Supported Values -** Any string value. Check the [OIDC configurations section](https://is.docs.wso2.com/en/latest/learn/configuring-oauth2-openid-connect-single-sign-on/) of the application to retrieve the correct value.

```toml
[console]
client_id = "CONSOLE"
```

### `debug`

> :white_check_mark: Default JSON value - `false`

Enable debug logs for certain features such as `i18n` etc.

**Supported Values -** `true` | `false`

```toml
[console]
debug.enable = true
```

### `idp_configs`

Configs for the [authentication SDK](https://github.com/asgardio/asgardio-js-oidc-sdk).

#### `enablePKCE`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `true`

The Proof Key for Code Exchange (PKCE) is a specification supported by WSO2 Identity Server to mitigate code interception attacks.
[See Mitigating Authorization Code Interception Attacks](https://is.docs.wso2.com/en/latest/administer/mitigating-authorization-code-interception-attacks) to configure PKCE for an OAuth application.

**Supported Values -** true | false

```toml
[console]
idp_configs.enablePKCE = true
```

#### `clockTolerance`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - 60 Seconds (Declared in SDK)

Allowed leeway when validating the id_token. Required to address possible time mismatches between the client and the server.
[Check the Specification](https://tools.ietf.org/html/rfc7519#page-10)

**Supported Values -** Any number (in Seconds)

```toml
[console]
idp_configs.clockTolerance = 120
```

#### `responseMode`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"form_post"`

How the result of the authorization request is formatted.

**Supported Values -** `"form_post"` | `"query"`

```toml
[console]
idp_configs.responseMode = "form_post"
```

#### `scope`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `[ "SYSTEM" ]`

Scopes requested when the token request is made.

**Supported Values -** String array

```toml
[console]
idp_configs.scope = [ "internal_login", "internal_identity_mgt_view" ]
```

#### `serverOrigin`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"https://localhost:9443"`

The origin of the Identity Provider. eg: https://localhost:9443

**Supported Values -** Any URL.

```toml
[console]
idp_configs.serverOrigin = "https://localhost:9443"
```

#### `storage`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"webWorker"`

The storage medium where the session information such as the access token should be stored.

**Supported Values -** `"sessionStorage"` | `"webWorker"` | `"localStorage"`

```toml
[console]
idp_configs.storage = "webWorker"
```

#### `authorizeEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oauth2/authorize"`

The endpoint to send the authorization request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.authorizeEndpointURL = "/oauth2/authorize"
```

#### `jwksEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oauth2/jwks"`

The endpoint from which the JSON Web Keyset can be obtained.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.jwksEndpointURL = "/oauth2/jwks"
```

#### `logoutEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oidc/logout"`

The endpoint to send the logout request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.logoutEndpointURL = "/oidc/checksession"
```

#### `oidcSessionIFrameEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oidc/checksession"`

The URL of the OIDC session iframe.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.oidcSessionIFrameEndpointURL = "/oidc/checksession"
```

#### `tokenRevocationEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oauth2/revoke"`

The endpoint to send the revoke-access-token request to..

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.tokenRevocationEndpointURL = "/oauth2/revoke"
```

#### `tokenEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oauth2/token"`

The endpoint to send the token request to.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.tokenEndpointURL = "/oauth2/token"
```

#### `tokenEndpointURL`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"/oauth2/oidcdiscovery/.well-known/openid-configuration"`

The endpoint to receive the OIDC endpoints from.

**Supported Values -** Any relative URL.

```toml
[console]
idp_configs.wellKnownEndpointURL = "/oauth2/oidcdiscovery/.well-known/openid-configuration"
```

### `session`

OIDC Session management configs.

#### `userIdleTimeOut`

> :white_check_mark: Default JSON value - `600`

Idle session timeout interval.

**Supported Values -** Any numerical value. (in seconds)

```toml
[console]
session.params.userIdleTimeOut = 600
```

#### `userIdleWarningTimeOut`

> :white_check_mark: Default JSON value - `580`

When will the warning modal appear to warn about idle timeout.

**Supported Values -** Any numerical value. (in seconds and should be less than `userIdleTimeOut`)

```toml
[console]
session.params.userIdleWarningTimeOut = 580
```

#### `sessionRefreshTimeOut`

> :white_check_mark: Default JSON value - `300`

When to send the session extension request.

**Supported Values -** Any numerical value. (in seconds)

```toml
[console]
session.params.sessionRefreshTimeOut = 300
```

#### `checkSessionInterval`

> :white_check_mark: Default JSON value - `3`

At what interval should the app poll for session state.

**Supported Values -** Any numerical value. (in seconds)

```toml
[console]
session.params.checkSessionInterval = 3
```

### `tenantResolutionStrategy`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"id_token"`

How is the tenant resolved after the user is logged in.
In SaaS mode, the tenant will be extracted from the logged in users ID token. Otherwise, the tenant can be obtained by reading the URL.

**Supported Values -** `"location"` | `"id_token"`

```toml
[console]
tenantResolutionStrategy = "id_token"
```

### `server_origin`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - URL will be taken from IdentityUtil.getServerURL()

Server Origin URL to be used for API requests etc.
URL will be taken from [getServerURL()](https://github.com/wso2-attic/carbon-identity/blob/master/components/identity-core/org.wso2.carbon.identity.core/src/main/java/org/wso2/carbon/identity/core/util/IdentityUtil.java#L298) method in IdentityUtil when the app is deployed inside IS.

**Supported Values -** Any URL.

```toml
[console]
server_origin = "https://localhost:9443"
```

### `route_paths`

App route paths.

#### `home`

> :white_check_mark: Default JSON value - `"/develop/applications"` (for Console) | `"/overview"` (for My Account)

Where to route the users when the app is loaded.

**Supported Values -** Any path defined in the app.

```toml
[console]
route_paths.home = "/manage/users"
```

#### `login`

> :white_check_mark: Default JSON value - `"/login"` (for Console) | `"/login"` (for My Account)

Where to route the users on login.

**Supported Values -** Any path defined in the app.

```toml
[console]
route_paths.login = "/login"
```

#### `logout`

> :white_check_mark: Default JSON value - `"/logout"` (for Console) | `"/logout"` (for My Account)

Where to route the users on logout.

**Supported Values -** Any path defined in the app.

```toml
[console]
route_paths.logout = "/logout"
```

### `ui`

UI configurations.

#### `announcements`

Announcements to be displayed on the banner. Configured as an array.

##### `color`

> :bulb: No value defined in Default JSON

Color of the Announcements banner.

**Supported Values -** [`SemanticCOLORS`](https://semantic-ui.com/usage/theming.html#sitewide-defaults) | `"primary"` | `"secondary"`

```toml
[[console.ui.announcements]]
color = "primary"
```

##### `order`

> :bulb: No value defined in Default JSON

Order of the Announcement.

**Supported Values -** number

```toml
[[console.ui.announcements]]
order = 1.0
```

##### `expire`

> :bulb: No value defined in Default JSON

Announcement expiry time.

**Supported Values -** Time stamp.

```toml
[[console.ui.announcements]]
expire = "1593475200"
```

##### `id`

> :bulb: No value defined in Default JSON

Unique ID for the Announcement.

**Supported Values -** Any string. Preferably a GUID.

```toml
[[console.ui.announcements]]
id = "d47a8201-3d58-43ae-b1a9-1ac653814f4e"
```

##### `message`

> :bulb: No value defined in Default JSON

Main message for the Announcement.

**Supported Values -** Any string.

```toml
[[console.ui.announcements]]
message = "Regular maintenance work will be carried out and the service will be unavailable for few hours."
```

#### `app_copyright`

> :white_check_mark: Default JSON value - `"WSO2 Identity Server"`

App copyright to be displayed on footer.

**Supported Values -** Any string.

```toml
[console]
ui.app_copyright = "WSO2 Identity Server"
```

#### `app_title`

> :white_check_mark: Default JSON value - `"Console | WSO2 Identity Server"` (for Console) | `"My Account | WSO2 Identity Server"` (for My Account)

Browser tab title.

**Supported Values -** Any string.

```toml
[console]
ui.app_title = "Console | WSO2 Identity Server"
```

#### `app_name`

> :white_check_mark: Default JSON value - `"Console"` (for Console) | `"My Account"` (for My Account)

Display name of the app.

**Supported Values -** Any string.

```toml
[console]
ui.app_name = "Console"
```

#### `app_logo_path`

> :white_check_mark: Default JSON value - `"/assets/images/logo.svg"`

Path of the app logo.

**Supported Values -** Relative paths (will be resolved from the resource bundle) | Hosted Images | Data URLs

```toml
[console]
ui.app_logo_path = "https://cdn.wso2.is.com/assets/images/logo.svg"
```

#### `gravatar.configs`

Gravatar configs.

##### `fallback`

> :white_check_mark: Default JSON value - `"404"`

Fallback types for gravatar images.

**Supported Values -** `"404"` | `"default"` | `"mp"` | `"identicon"` | `"monsterid"` | `"wavatar"` | `"retro"` | `"robohash"` | `"blank"`

```toml
[console]
ui.gravatar.configs.fallback = "404"
```

##### `defaultImage`

> :bulb: No value defined in Default JSON

Custom fallback image URL if Gravatar is not found.

**Supported Values -** Any image URL.

```toml
[console]
ui.gravatar.configs.defaultImage = "https://cdn.wso2.is.com/assets/images/gravatar-fallback.png"
```

##### `size`

> :bulb: No value defined in Default JSON

Gravatar image size.

**Supported Values -** Any number. See http://en.gravatar.com/site/implement/images/#size.

```toml
[console]
ui.gravatar.configs.size = 200
```

#### `product_name`

> :white_check_mark: Default JSON value - `"Identity Server"`

Product name.

**Supported Values -** Any string.

```toml
[console]
ui.product_name = "Identity Server"
```

### `product_version.configs`

Configurations for customizing the product version label.

#### `allowSnapshot`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `false`

Shows the snapshot label if present in product version.

**Supported Values -** `true` | `false`

```toml
[console]
product_version.configs.allowSnapshot = false
```

#### `productVersion`

> :bulb: No value defined in Default JSON

Overrides the version number. Use "" if version should be hidden. Drop the attribute if no change to version number is required.

**Supported Values -** Any string or ""

```toml
[console]
product_version.configs.productVersion = "ALPHA"
```

#### `textCase`

> :bulb: No value defined in Default JSON

Text case for the  version.

**Supported Values -** `"lowercase"` | `"uppercase"`

```toml
[console]
product_version.configs.textCase = "uppercase"
```

#### `labelColor`

> :bulb: No value defined in Default JSON

> :checkered_flag: Fallback Value - `"primary"`

Color of the label.

**Supported Values -** `"auto"` | `"primary"` | `"secondary"` | [`SemanticCOLORS`](https://semantic-ui.com/usage/theming.html#sitewide-defaults)

```toml
[console]
product_version.configs.labelColor = "primary"
```

### `theme`

Theme configurations.

#### `name`

> :white_check_mark: Default JSON value - `"default"`

Name of the app theme.

**Supported Values -** Any string.

```toml
[console]
theme = "default"
```

## Console Specific Configs

The following sections contain `Console` specific configs that cann be used to configure/override the existing behaviour of the `Console` application.

### `applications`

Different configurations for applications that are used inside the `Console`.

#### `account_app`

My Account app configurations.

```toml
[console]
applications.account_app.configs.origin = "<MY_ACCOUNT_ORIGIN>" # Defaults to the server URL (ex: https://localhost:9443).
applications.account_app.configs.path = "<PATH>" # Relative path(without tenant) to navigate when the My Account link is clicked on the user dropdown. Defaults to `/myaccount/overview`.
```

#### `admin_app`

Console app's **Manage** section configs.

```toml
[console]
applications.admin_app.configs.basePath = "<BASE_PATH>" # Defaults to the `/manage`.
applications.admin_app.configs.displayName = "<DISPLAY_NAME>" # Name to displayed in the tab. Defaults to the `Manage`.
applications.admin_app.configs.path = "<PATH>" # Path to navigate the users when the manage tab is clicked. Defaults to the `/manage/users`.
```

#### `developer_app`

Console app's **Develop** section configs.

```toml
[console]
applications.developer_app.configs.basePath = "<BASE_PATH>" # Defaults to the `/develop`.
applications.developer_app.configs.displayName = "<DISPLAY_NAME>" # Name to displayed in the tab. Defaults to the `Develop`.
applications.developer_app.configs.path = "<PATH>" # Path to navigate the users when the manage tab is clicked. Defaults to the `/develop/applications`.
```

### `extensions`

> :negative_squared_cross_mark: No value defined in Default JSON

App extensions configuration.

#### `connectors`

> :bulb: No value defined in Default JSON

Add UI metadata for the connectors you add to the Identity Server instance.

> 📖 For more information, read through [Connectors guide](./CONNECTORS.md).


The following configuration adds UI metadata for the LinkedIn connector.

```toml
[[console.extensions.connectors]]
authenticatorId="TGlua2VkSW4"
description="Login users with existing LinkedIn accounts"
displayName="LinkedIn"
icon="https://brand.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
```
