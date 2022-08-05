/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SDKInitConfig } from "../../../../shared";

export const javascriptSDKInitialisationCode = (SDKInitConfig: SDKInitConfig): string => {

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

export const javascriptSDKIntegrationCode = () => {

    return `
<div>
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
