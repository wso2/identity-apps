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

import { AppUtils } from "./app-utils";
import "core-js/stable";
import "regenerator-runtime/runtime";

AppUtils.init({
    serverOrigin: "https://localhost:9443",
    superTenant: "carbon.super",
    tenantPrefix: "t"
});

window[ "AppUtils" ] = AppUtils;

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

function sendPromptNoneRequest() {
    const rpIFrame: HTMLIFrameElement = document.getElementById("rpIFrame") as HTMLIFrameElement;
    const promptNoneIFrame: HTMLIFrameElement = rpIFrame.contentWindow.document.getElementById(
        "promptNoneIFrame"
    ) as HTMLIFrameElement;
    const config = window.parent["AppUtils"].getConfig();
    promptNoneIFrame.src =
        sessionStorage.getItem("authorization_endpoint") +
        "?response_type=code" +
        "&client_id=" +
        config.clientID +
        "&scope=openid" +
        "&redirect_uri=" +
        config.loginCallbackURL +
        "&state=Y2hlY2tTZXNzaW9u" +
        "&prompt=none" +
        "&code_challenge_method=S256&code_challenge=" +
        getRandomPKCEChallenge();
}

const config = window["AppUtils"]?.getConfig();

const state = new URL(window.location.href).searchParams.get("state");
if (state !== null && state === "Y2hlY2tTZXNzaW9u") {
    // Prompt none response.
    const code = new URL(window.location.href).searchParams.get("code");

    if (code !== null && code.length !== 0) {
        const newSessionState = new URL(window.location.href).searchParams.get("session_state");

        sessionStorage.setItem("session_state", newSessionState);

        // Stop loading rest of the page inside the iFrame
        if (navigator.appName === "Microsoft Internet Explorer") {
            document.execCommand("Stop");
        } else {
            window.stop();
        }
    } else {
        window.top.location.href = config.clientOrigin + config.appBaseWithTenant + config.routes.logout;
    }
} else {
    // Tracking user interactions
    let IDLE_TIMEOUT = 600;
    if (config?.session != null && config.session.userIdconstimeOut != null && config.session.userIdconstimeOut > 1) {
        IDLE_TIMEOUT = config.session.userIdconstimeOut;
    }
    let IDLE_WARNING_TIMEOUT = 580;
    if (
        config?.session != null &&
        config.session.userIdleWarningTimeOut != null &&
        config.session.userIdleWarningTimeOut > 1
    ) {
        IDLE_WARNING_TIMEOUT = config.session.userIdleWarningTimeOut;
    }
    let SESSION_REFRESH_TIMEOUT = 300;
    if (
        config?.session != null &&
        config.session.sessionRefreshTimeOut != null &&
        config.session.sessionRefreshTimeOut > 1
    ) {
        SESSION_REFRESH_TIMEOUT = config.session.sessionRefreshTimeOut;
    }

    let _idleSecondsCounter = 0;
    let _sessionAgeCounter = 0;

    document.onclick = function() {
        _idleSecondsCounter = 0;
    };
    document.onmousemove = function() {
        _idleSecondsCounter = 0;
    };
    document.onkeypress = function() {
        _idleSecondsCounter = 0;
    };

    window.setInterval(() => {
        {
            _idleSecondsCounter++;
            _sessionAgeCounter++;

            // Logout user if idle
            if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                window.top.location.href = config.clientOrigin + config.appBaseWithTenant + config.routes.logout;
            } else if (_idleSecondsCounter === IDLE_WARNING_TIMEOUT) {
                // eslint-disable-next-line no-console
                console.log(
                    "You will be logged out of the system after " +
                        (IDLE_TIMEOUT - IDLE_WARNING_TIMEOUT) +
                        " seconds! Click OK to stay logged in."
                );
            }

            // Keep user session intact if the user is active
            if (_sessionAgeCounter > SESSION_REFRESH_TIMEOUT) {
                if (_sessionAgeCounter > _idleSecondsCounter) {
                    sendPromptNoneRequest();
                }
                _sessionAgeCounter = 0;
            }
        }
    }, 1000);
}
