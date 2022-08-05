/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SDKInitConfig } from "../../../../shared";

export const reactSDKProviderImportCode = (): string => {

    return (
        "import { AuthProvider } from \"@asgardeo/auth-react\";"
    );
};

export const reactSDKContextImportCode = (): string => {

    return (
        "import { useAuthContext } from \"@asgardeo/auth-react\";"
    );
};

export const reactSDKInitialisationCode = (SDKInitConfig: SDKInitConfig) => {

    const scopesForDisplay = (): string => {

        return `[ ${
            SDKInitConfig?.scope?.map((item: string) => {
                return `"${ item }"`;
            })
        } ]`;
    };

    return (
        `import React from "react";
import { render } from "react-dom";
import { AuthProvider } from "@asgardeo/auth-react";

const Index = () => (
    <AuthProvider
        config={ {
            signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
            signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
            clientID: "${ SDKInitConfig.clientID }",
            baseUrl: "${ SDKInitConfig.baseUrl }",
            scope: ${ scopesForDisplay() }
        } }
    >
        { /* Rest of your application.  */ }
    </AuthProvider>
);

render((<Index />), document.getElementById("root"));`
    );
};

export const reactSDKContextAccessCode = (): string => {

    return (
        "const { state, signIn, signOut } = useAuthContext();"
    );
};

export const reactSDKLoginButtonCode = (): string => {

    return (
        "<button onClick={ () => signIn() }>Login</button>"
    );
};

export const reactSDKLogoutButtonCode = (): string => {

    return (
        "<button onClick={ () => signOut() }>Logout</button>"
    );
};

export const reactSDKAuthenticatedStateCode = (): string => {

    return (
        `import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function App() {

  const { state, signIn, signOut } = useAuthContext();

  return (
    <div className="App">
      {
        state.isAuthenticated
          ? (
            <div>
              <ul>
                <li>{state.username}</li>
              </ul>

              <button onClick={() => signOut()}>Logout</button>
            </div>
          )
          : <button onClick={() => signIn()}>Login</button>
      }
    </div>
  );
}

export default App;
`
    );
};

export const reactSDKIntegrationCode = () => {

    return `import { useAuthContext } from "@asgardeo/auth-react";
import React from "react";

const LandingPage = () => {

    // Use useAuthContext() custom react hook to access auth state and function.
    const { state, signIn, signOut } = useAuthContext();

    return (
        <div>
            <h3>The basic details retrieved from the server upon successful login.</h3>
            <div>
                <ul className="details">
                    <li><b>Name:</b> { state.displayName }</li>
                    <li><b>Username:</b> { state.username }</li>
                    <li><b>Email:</b> { state.email }</li>
                </ul>
            </div>
            <button onClick={ () => signIn() }>Login</button>
            <button onClick={ () => signOut() }>Logout</button>
        </div>
    );
};

export default LandingPage;`;
};
