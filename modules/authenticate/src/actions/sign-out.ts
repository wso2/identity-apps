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
 */

// tslint:disable-next-line:no-submodule-imports
import { Error } from "tslint/lib/error";
import { ID_TOKEN } from "../constants";
import { getEndSessionEndpoint } from "./op-config";
import { getSessionParameter } from "./session";

/**
 * Handle user sign out.
 *
 * @returns {}
 */
export const sendSignOutRequest =  (redirectUri: string): Promise<any> => {
    const logoutEndpoint = getEndSessionEndpoint();
    if (!logoutEndpoint || logoutEndpoint.trim().length === 0) {
        return Promise.reject(new Error("Invalid logout endpoint found."));
    }
    const idToken = getSessionParameter(ID_TOKEN);
    if (!idToken || idToken.trim().length === 0) {
        return Promise.reject(new Error("Invalid id_token found."));
    }

    window.location.href = `${logoutEndpoint}?` + `id_token_hint=${idToken}` +
        `&post_logout_redirect_uri=${redirectUri}`;
    return Promise.resolve("success");
};
