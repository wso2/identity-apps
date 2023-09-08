/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
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

export const reactSDKInitialisationCode = (SDKInitConfig: SDKInitConfig): string => {

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

export default App;`
    );
};

export const reactSDKIntegrationCode = (): string => {

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
