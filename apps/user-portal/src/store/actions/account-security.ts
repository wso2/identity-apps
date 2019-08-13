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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authenticate";
import { ServiceResourcesEndpoint } from "../../configs";
import { apiRequestAction } from "./api";
import { CHANGE_PASSWORD } from "./types";

export function changePassword(currentPassword: string, newPassword: string) {
    const config = {
        auth: {
            password: currentPassword,
            username: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME)
        },
        data: {
            Operations: [
                {
                    op: "add",
                    value: {
                        password: newPassword
                    }
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: "PATCH",
        onError: (error) => console.log("middleware error", error),
        onSuccess: (response) => console.log("middleware response", response),
        url: ServiceResourcesEndpoint.me
    };

    const meta = {
        dispatcher: CHANGE_PASSWORD
    };

    return apiRequestAction(config, meta);
}
