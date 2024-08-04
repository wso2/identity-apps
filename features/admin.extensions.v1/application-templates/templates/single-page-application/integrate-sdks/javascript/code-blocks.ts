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

export const javascriptSDKInitialisationCode: any = (SDKInitConfig: SDKInitConfig): string => {

    const scopesForDisplay = (): string => {

        return `[ ${
            SDKInitConfig?.scope?.map((item: string) => {
                return `"${ item }"`;
            })
        } ]`;
    };

    return `<script>
    var auth = AsgardeoAuth.AsgardeoSPAClient.getInstance();

    auth.initialize({
        signInRedirectURL: "${ SDKInitConfig.signInRedirectURL }",
        signOutRedirectURL: "${ SDKInitConfig.signOutRedirectURL }",
        clientID: "${ SDKInitConfig.clientID }",
        baseUrl: "${ SDKInitConfig.baseUrl }",
        scope: ${ scopesForDisplay() }
    });
</script>`;
};

export const loginButtonCode = (): string => {

    return "<button onClick=\"auth.signIn()\">Log In</button>";
};

export const javascriptSDKIntegrationCode = (): string => {

    return `<div>
    <!-- Authenticated View --->
    <div id="authenticated-view" style="display: none;">
        <ul>
            <li id="username"></li>
        </ul>
        <button onClick="auth.signOut()">Log Out</button>
    </div>
    <!-- Un-Authenticated View --->
    <div id="unauthenticated-view" style="display: none;">
        <button onClick="auth.signIn()">Log In</button>
    </div>
</div>

<script>
    (async () => {
        let user = undefined;

        // If there are auth search params i.e code, session_state, automatically trigger login.
        // Else, try to see if there's a session.
        if (AsgardeoAuth.SPAUtils.hasAuthSearchParamsInURL()) {
            user = await auth.signIn({ callOnlyOnRedirect: true });
        } else {
            user = await auth.trySignInSilently();
        }

        // Update the UI accordingly.
        if (user) {
            document.getElementById("authenticated-view").style.display = "block";
            document.getElementById("unauthenticated-view").style.display = "none";
            document.getElementById("username").innerHTML = user.username;
        } else {
            document.getElementById("authenticated-view").style.display = "none";
            document.getElementById("unauthenticated-view").style.display = "block";
        }
    })();
</script>`;
};
