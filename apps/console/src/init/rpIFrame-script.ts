/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
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

import "core-js/stable";
import "regenerator-runtime/runtime";

const getItemFromSessionStorage = (key: string): string => {
    try {
        return sessionStorage.getItem(key);
    } catch {
        return "";
    }
};

const config = window.parent["AppUtils"]?.getConfig();
const clientId = config?.clientID;
const redirectUri = config?.loginCallbackURL;

function checkSession() {
    const targetOrigin = getItemFromSessionStorage("oidc_session_iframe_endpoint");
    const sessionState = getItemFromSessionStorage("session_state");
    const mes = clientId + " " + sessionState;
    if (isNotNull(clientId) && isNotNull(sessionState)) {
        const opIframe: HTMLIFrameElement = document.getElementById("opIFrame") as HTMLIFrameElement;
        const win: Window = opIframe.contentWindow;
        win.postMessage(mes, targetOrigin);
    }
}

function isNotNull(value) {
    return value !== null && value.length !== 0 && value !== "null";
}

function setTimer() {
    const targetOrigin = getItemFromSessionStorage("oidc_session_iframe_endpoint");

    if (!targetOrigin || !clientId || !redirectUri) {
        return;
    }

    const opIframe: HTMLIFrameElement = document.getElementById("opIFrame") as HTMLIFrameElement;
    opIframe.src = targetOrigin + "?client_id=" + clientId + "&redirect_uri=" + redirectUri;
    checkSession();
    let checkSessionInterval = 3;
    if (
        config.session != null &&
        config.session.checkSessionInterval != null &&
        config.session.checkSessionInterval > 1
    ) {
        checkSessionInterval = config.session.checkSessionInterval;
    }
    setInterval(checkSession, checkSessionInterval * 1000);
}

window.addEventListener("message", receiveMessage, false);

function getRandomPKCEChallenge() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz-_";
    const stringLength = 43;
    let randomString = "";
    for (let i = 0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}

function receiveMessage(e) {
    const targetOrigin = getItemFromSessionStorage("oidc_session_iframe_endpoint");

    if (e.data === "loadTimer" && e.origin === location.origin) {
        setTimer();
        return;
    }

    if (!targetOrigin || targetOrigin?.indexOf(e.origin) < 0) {
        return;
    }

    if (e.data === "unchanged") {
        // [RP] session state has not changed
    } else {
        // [RP] session state has changed. Sending prompt=none request...
        const promptNoneIFrame: HTMLIFrameElement = document.getElementById("promptNoneIFrame") as HTMLIFrameElement;
        const tenantName = window.parent["AppUtils"]?.getTenantName();
        promptNoneIFrame.src =
            getItemFromSessionStorage("authorization_endpoint") +
            "?response_type=code" +
            "&client_id=" +
            clientId +
            "&scope=openid" +
            "&redirect_uri=" +
            redirectUri +
            "&state=Y2hlY2tTZXNzaW9u" +
            "&prompt=none" +
            "&code_challenge_method=S256&code_challenge=" +
            getRandomPKCEChallenge() +
            "&t=" + tenantName;
    }
}
