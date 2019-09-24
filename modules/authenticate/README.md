# WSO2 Identity Server - Authentication SDK for Javascript Applications

Provide OpenID Connect (OIDC) and OAuth2 protocol support for JavaScript client applications.

## Install
Add following dependency in your package.json file.
`"@wso2is/authenticate": "^0.1.0"`

## Usage

#### OPConfigurationUtil.initOPConfiguration(wellKnownEndpoint, forceInit)
Initiate the authentication module using openid provider configuration endpoint.
* `wellKnownEndpoint` well known endpoint.
* `forceInit` whether to re-initiate the configuration.

#### OPConfigurationUtil.resetOPConfiguration()
Reset the configuration acquired from openid provider.

#### SignInUtil.sendAuthorizationRequest(requestParams)
Sends the OAuth2 authorization code request to the IdP based on the provided request params.

`requestParams` is type of `OIDCRequestParamsInterface`
```js
interface OIDCRequestParamsInterface {
    clientId: string;
    clientHost: string;
    clientSecret?: string;
    enablePKCE: boolean;
    redirectUri: string;
   scope?: string[];
}
```
* `clientId` Client id of the application.
* `clientHost` Client host name.
* `clientSecret` Client secret of the application. If not provided, it will considered as a public client.
* `enablePKCE` Enable PKCE for the authorization grant type.
* `redirectUri` Callback url of the application.

#### SignInUtil.hasAuthorizationCode()
Check whether the current url contains the OAuth2 authorization code.

#### SignInUtil.sendTokenRequest(requestParams)
Sends the OAuth2 token request and returns a Promise with token response. Also validate the signature of the id_token.

`requestParams` is type of `OIDCRequestParamsInterface` as explained above.

Response will be a `Promise<TokenResponseInterface>`.

```js
interface TokenResponseInterface {
    accessToken: string;
    idToken: string;
    expiresIn: string;
    scope: string;
    refreshToken: string;
    tokenType: string;
}
```
* `accessToken` access token.
* `idToken` id_token value.
* `expiresIn`validity period.
* `scope` scope returned.
* `refreshToken` refresh token.
* `tokenType` token type.

#### SignInUtil.getAuthenticatedUser(idToken)
This will extract the authenticated user from the id_token.

Response will be in `AuthenticatedUserInterface`.

```js
interface AuthenticatedUserInterface {
    displayName?: string;
    email?: string;
    username: string;
}
```
* `displayName` display name of the user.
* `email` email of the user.
* `username` username.

#### AuthenticateSessionUtil.initUserSession(tokenResponse, authenticatedUser)
This will initiate the user session using the attributes in tokenResponse and authenticatedUser.

tokenResponse is type of `TokenResponseInterface` and authenticatedUser is type of `AuthenticatedUserInterface`.

#### AuthenticateSessionUtil.getAccessToken()
This will returns a Promise containing the OAuth2 access_token. Also it will refresh the access_token if it is expired.

Response will be a `Promise<string>`.

#### SignOutUtil.sendSignOutRequest(redirectUri)
Sends the logout request the openid provider. Requires the redirect uri of the application.


#### AuthenticateSessionUtil.endAuthenticatedSession()
Terminates the user session and clears the session attributes.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.

