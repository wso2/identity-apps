# CONFIGURATIONS

* [Overview](#overview)
* [Available Configs](#available-configs)
  * [Console Configs](#console-configs)
    * [idp_configs](#idp_configs)
  * [My Account Configs](#my-account-configs)

## Overview

## Available Configs

### Console Configs

### `idp_configs`

##### `enable_pkce`

> :white_check_mark: Default - true

The Proof Key for Code Exchange (PKCE) is a specification supported by WSO2 Identity Server to mitigate code interception attacks.
[See Mitigating Authorization Code Interception Attacks](https://is.docs.wso2.com/en/latest/administer/mitigating-authorization-code-interception-attacks) to configure PKCE for an OAuth application.

**Supported Values -** true | false

```toml
[console]
idp_configs.enable_pkce = true
```

##### `response_mode`

> :white_check_mark: Default - "form_post"

How the result of the authorization request is formatted.

**Supported Values -** "form_post" | "query"

```toml
[console]
idp_configs.response_mode = "form_post"
```

##### `scope`

> :white_check_mark: Default - [ "SYSTEM" ]

Scopes requested when the token request is made.

**Supported Values -** string array

```toml
[console]
idp_configs.scope = [ "internal_login", "internal_identity_mgt_view" ]
```
