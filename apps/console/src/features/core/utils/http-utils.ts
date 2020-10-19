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

import { hideAJAXTopLoadingBar, showAJAXTopLoadingBar } from "@wso2is/core/store";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { AppConstants } from "../constants";
import { history } from "../helpers";
import { store } from "../store";

/**
 * Utility class for http operations.
 */
export class HttpUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Callback to be fired on every Http request start.
     */
    public static onHttpRequestStart(): void {
        store.dispatch(showAJAXTopLoadingBar());
    }

    /**
     * Callback to be fired on every Http request success.
     */
    public static onHttpRequestSuccess(): void {
        // TODO: Handle any conditions required on request success.
    }

    /**
     * Callback to be fired on every Http request error. The error
     * codes are evaluated necessary actions are being taken.
     *
     * @remarks
     * Axios throws a generic `Network Error` for 401 errors.
     * As a temporary solution, a check to see if an error code
     * is available has be used.
     * @see {@link https://github.com/axios/axios/issues/383}
     *
     * @param error - Http error.
     */
    public static onHttpRequestError(error: any): void {
        // Terminate the session if the token endpoint returns a bad request(400)
        // The token binding feature will return a 400 status code when the session
        // times out.
        if (
            error.response &&
            error.response.request &&
            error.response.request.responseURL &&
            error.response.request.responseURL === sessionStorage.getItem("token_endpoint")
        ) {
            if (error.response.status === 400) {
                history.push(window["AppUtils"].getConfig().routes.logout);
                return;
            }
        }

        // If the user doesn't have login permission, redirect to login error page.
        if (!AuthenticateUtils.hasLoginPermission(store.getState()?.auth?.scope)) {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search: "?error=" + AppConstants.LOGIN_ERRORS.get("NO_LOGIN_PERMISSION")
            });
            return;
        }

        // Terminate the session if the requests returns an un-authorized status code (401)
        // NOTE: Axios is unable to handle 401 errors. `!error.response` will usually catch
        // the `401` error. Check the link in the doc comment.
        if (!error.response || error.response.status === 401) {
            history.push(window["AppUtils"].getConfig().routes.logout);
        }
    }

    /**
     * Callback to be fired on every Http request finish.
     */
    public static onHttpRequestFinish(): void {
        store.dispatch(hideAJAXTopLoadingBar());
    }
}
