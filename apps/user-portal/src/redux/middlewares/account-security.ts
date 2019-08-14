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
import { apiRequest, CHANGE_PASSWORD } from "../actions";

const SCHEMAS = ["urn:ietf:params:scim:api:messages:2.0:PatchOp"];

const changePassword = ({dispatch}) => (next) => (action) => {
    if (action.type !== CHANGE_PASSWORD) {
        return next(action);
    }

    const { currentPassword, newPassword } = action.payload;
    const requestConfig = {
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
            schemas: SCHEMAS
        },
        dispatcher: CHANGE_PASSWORD,
        headers: {
            "Content-Type": "application/json"
        },
        method: "PATCH",
        onError: (error) => console.log("middleware error", error),
        onSuccess: (response) => console.log("middleware response", response),
        url: ServiceResourcesEndpoint.me
    };

    dispatch(apiRequest(requestConfig));
};

export const accountSecurityMiddleware = [changePassword];
