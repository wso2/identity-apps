/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { store } from "../store";
import { hideGlobalLoader, showGlobalLoader } from "../store/actions";

/**
 * Callback to be fired on every Http request start.
 */
export const onHttpRequestStart = () => {
    store.dispatch(showGlobalLoader());
};

/**
 * Callback to be fired on every Http request success.
 *
 * @param response - Http response.
 */
export const onHttpRequestSuccess = (response: any) => {
    // TODO: Handle any conditions required on request success.
};

/**
 * Callback to be fired on every Http request error.
 *
 * @param error - Http error.
 */
export const onHttpRequestError = (error: any) => {
    // TODO: Handle error codes.
};

/**
 * Callback to be fired on every Http request finish.
 */
export const onHttpRequestFinish = () => {
    store.dispatch(hideGlobalLoader());
};
