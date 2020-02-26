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
 *
 */

import { AxiosHttpClient } from "@wso2is/http";

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
    private constructor() { }

    /**
     * Set up the http client by registering the callback functions.
     *
     * @example
     * Example usage.
     * ```
     * import { HttpUtils } from "@wso2is/core/utils";
     *
     * HttpUtils.setupHttpClient(
     *  true,
     *  onHttpRequestStart,
     *  onHttpRequestSuccess,
     *  onHttpRequestError,
     *  onHttpRequestFinish);
     *
     * ```
     *
     * @param {boolean} isHandlerEnabled - Flag to toggle handler enablement.
     * @param {() => void} requestStartCallback - Callback function to be triggered on request start.
     * @param {(response: any) => void} requestSuccessCallback - Callback function to be triggered on request success.
     * @param {(error: any) => void} requestErrorCallback - Callback function to be triggered on request error.
     * @param {() => void} requestFinishCallback - Callback function to be triggered on request error.
     */
    public static setupHttpClient(isHandlerEnabled: boolean = true,
                                  requestStartCallback: () => void,
                                  requestSuccessCallback: (response: any) => void,
                                  requestErrorCallback: (error: any) => void,
                                  requestFinishCallback: () => void): void {

        const httpClient = AxiosHttpClient.getInstance();

        httpClient.init(
            isHandlerEnabled,
            requestStartCallback,
            requestSuccessCallback,
            requestErrorCallback,
            requestFinishCallback
        );
    }
}
