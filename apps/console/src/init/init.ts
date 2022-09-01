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

import { UAParser } from "ua-parser-js";
import { AppUtils } from "./app-utils";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TimerWorker from "@wso2is/core/src/workers/timer.worker";
// DO NOT SHORTEN THE IMPORT PATH as it could lead to circular dependencies.
import { commonConfig } from "../extensions/configs/common";
import { OrganizationUtils } from "../features/organizations/utils";
import { SignInMethodUtils } from "../features/applications";


if (!window["AppUtils"] || !window["AppUtils"]?.getConfig()) {
    AppUtils.init({
        accountAppOrigin: process.env.NODE_ENV === "production" ? undefined : "https://localhost:9000",
        contextPath: contextPathGlobal,
        isAdaptiveAuthenticationAvailable: isAdaptiveAuthenticationAvailable || 
        window["AppUtils"]?.getConfig()?.ui?.isAdaptiveAuthenticationAvailable,
        isOrganizationManagementEnabled: isOrganizationManagementEnabled || 
        window["AppUtils"]?.getConfig()?.ui?.isOrganizationManagementEnabled,
        serverOrigin: serverOriginGlobal,
        superTenant: superTenantGlobal,
        tenantPrefix: tenantPrefixGlobal
    });

    window["AppUtils"] = AppUtils;
}

function handleTimeOut(_idleSecondsCounter: number, _sessionAgeCounter: number,
                SESSION_REFRESH_TIMEOUT: number, IDLE_TIMEOUT: number, IDLE_WARNING_TIMEOUT: number): number {

    if (_idleSecondsCounter === IDLE_WARNING_TIMEOUT || _idleSecondsCounter >= IDLE_TIMEOUT) {
        const warningSearchParamKey = "session_timeout_warning";
        const currentURL = new URL(window.location.href);

        // If the URL already has the timeout warning search para, delete it first.
        if (currentURL && currentURL.searchParams && currentURL.searchParams.get(warningSearchParamKey) !== null) {
            currentURL.searchParams.delete(warningSearchParamKey);
        }

        const existingSearchParams = currentURL.search;

        // NOTE: This variable is used for push state.
        // If already other search params are available simply append using `&`,
        // otherwise just add the param using `?`.
        const searchParam =
            existingSearchParams + (existingSearchParams ? "&" : "?") + warningSearchParamKey + "=" + "true";

        // Append the search param to the URL object.
        currentURL.searchParams.append(warningSearchParamKey, "true");

        const state = {
            idleTimeout: IDLE_TIMEOUT,
            idleWarningTimeout: IDLE_WARNING_TIMEOUT,
            url: currentURL.href
        };

        window.history.pushState(state, null, searchParam);

        dispatchEvent(new MessageEvent("session-timeout", { data: state }));
    }

    return _sessionAgeCounter;
}

const config = window["AppUtils"]?.getConfig();

// Tracking user interactions
let IDLE_TIMEOUT = 600;
if (config?.session != null && config.session.userIdleTimeOut != null && config.session.userIdleTimeOut > 1) {
    IDLE_TIMEOUT = config.session.userIdleTimeOut;
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

// Run the timer in main thread if the browser is Internet Explorer.
if (new UAParser().getBrowser().name === "IE") {
    window.setInterval(() => {
        _idleSecondsCounter++;
        _sessionAgeCounter++;
        _sessionAgeCounter = handleTimeOut(
            _idleSecondsCounter,
            _sessionAgeCounter,
            SESSION_REFRESH_TIMEOUT,
            IDLE_TIMEOUT,
            IDLE_WARNING_TIMEOUT
        );
    }, 1000);
} else {
    const worker = new TimerWorker();
    worker.onmessage = () => {
        _idleSecondsCounter++;
        _sessionAgeCounter++;
        _sessionAgeCounter = handleTimeOut(
            _idleSecondsCounter,
            _sessionAgeCounter,
            SESSION_REFRESH_TIMEOUT,
            IDLE_TIMEOUT,
            IDLE_WARNING_TIMEOUT
        );
    };
}
