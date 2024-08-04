/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { UserAgentParser } from "@wso2is/core/helpers";
import TimerWorker from "@wso2is/core/workers/timer.worker";
import { AppUtils } from "./app-utils";

if (!window["AppUtils"] || !window["AppUtils"]?.getConfig()) {
    AppUtils.init({
        consoleAppOrigin: process.env.NODE_ENV === "production" ? undefined : "https://localhost:9001",
        contextPath: contextPathGlobal,
        isAdaptiveAuthenticationAvailable: isAdaptiveAuthenticationAvailable,
        isOrganizationManagementEnabled: isOrganizationManagementEnabled,
        serverOrigin: serverOriginGlobal,
        superTenant: superTenantGlobal,
        tenantPrefix: tenantPrefixGlobal
    });

    window["AppUtils"] = AppUtils;
}

function handleTimeOut(
    _idleSecondsCounter: number,
    _sessionAgeCounter: number,
    SESSION_REFRESH_TIMEOUT: number,
    IDLE_TIMEOUT: number,
    IDLE_WARNING_TIMEOUT: number
): number {
    if (_idleSecondsCounter >= IDLE_TIMEOUT || _idleSecondsCounter === IDLE_WARNING_TIMEOUT) {
        const warningSearchParamKey: string = "session_timeout_warning";
        const currentURL: URL = new URL(window.location.href);

        // If the URL already has the timeout warning search para, delete it first.
        if (currentURL && currentURL.searchParams && currentURL.searchParams.get(warningSearchParamKey) !== null) {
            currentURL.searchParams.delete(warningSearchParamKey);
        }

        const existingSearchParams: string = currentURL.search;

        // NOTE: This variable is used for push state.
        // If already other search params are available simply append using `&`,
        // otherwise just add the param using `?`.
        const searchParam: string =
            existingSearchParams + (existingSearchParams ? "&" : "?") + warningSearchParamKey + "=" + "true";

        // Append the search param to the URL object.
        currentURL.searchParams.append(warningSearchParamKey, "true");

        const state: {
            idleTimeout: number;
            idleWarningTimeout: number;
            url: string;
        } = {
            idleTimeout: IDLE_TIMEOUT,
            idleWarningTimeout: IDLE_WARNING_TIMEOUT,
            url: currentURL.href
        };

        window.history.pushState(state, null, searchParam);

        dispatchEvent(new MessageEvent("session-timeout", { data: state }));
    }

    return _sessionAgeCounter;
}

const config: any = window["AppUtils"]?.getConfig();

// Tracking user interactions
let IDLE_TIMEOUT: number = 600;

if (config?.session != null && config.session.userIdleTimeOut != null && config.session.userIdleTimeOut > 1) {
    IDLE_TIMEOUT = config.session.userIdleTimeOut;
}

let IDLE_WARNING_TIMEOUT: number = 580;

if (
    config?.session != null &&
    config.session.userIdleWarningTimeOut != null &&
    config.session.userIdleWarningTimeOut > 1
) {
    IDLE_WARNING_TIMEOUT = config.session.userIdleWarningTimeOut;
}

let SESSION_REFRESH_TIMEOUT: number = 300;

if (
    config?.session != null &&
    config.session.sessionRefreshTimeOut != null &&
    config.session.sessionRefreshTimeOut > 1
) {
    SESSION_REFRESH_TIMEOUT = config.session.sessionRefreshTimeOut;
}

let _idleSecondsCounter: number = 0;
let _sessionAgeCounter: number = 0;

document.onclick = function() {
    _idleSecondsCounter = 0;
};
document.onmousemove = function() {
    _idleSecondsCounter = 0;
};
document.onkeypress = function() {
    _idleSecondsCounter = 0;
};

// Run the timer in main thread if the browser is Internet Explorer, and using a web worker otherwise.
if (new UserAgentParser().browser.name === "IE") {
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
    const worker: any = new TimerWorker();

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
