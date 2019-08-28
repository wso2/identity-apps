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

import {Error} from "tslint/lib/error";
import axios from "axios";
import {getSessionParameter, removeSessionParameter, setSessionParameter} from "./session";
import {
    AUTHORIZATION_ENDPOINT,
    END_SESSION_ENDPOINT,
    JWKS_ENDPOINT,
    OP_CONFIG_INITIATED,
    REVOKE_TOKEN_ENDPOINT,
    TOKEN_ENDPOINT
} from "../constants";

export const initOPConfiguration = (wellKnownEndpoint: string, forceInit: boolean): Promise<any> => {
    if (!forceInit && isOPConfigInitiated()) {
        return Promise.resolve("success");
    }

    if (!wellKnownEndpoint || wellKnownEndpoint.trim().length == 0) {
        return Promise.reject(new Error("OpenID provider configuration endpoint is not defined."));
    }

    return axios.get(wellKnownEndpoint)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to load OpenID provider configuration from: "
                    + wellKnownEndpoint));
            }
            setSessionParameter(AUTHORIZATION_ENDPOINT, response.data.authorization_endpoint);
            setSessionParameter(TOKEN_ENDPOINT, response.data.token_endpoint);
            setSessionParameter(END_SESSION_ENDPOINT, response.data.end_session_endpoint);
            setSessionParameter(JWKS_ENDPOINT, response.data.jwks_uri);
            setSessionParameter(REVOKE_TOKEN_ENDPOINT, response.data.token_endpoint
                .substring(0, response.data.token_endpoint.lastIndexOf("token")) + "revoke");
            setSessionParameter(OP_CONFIG_INITIATED, "true");
            return Promise.resolve("success");
        }).catch((error) => {
            return Promise.reject(error);
        });
};

export const resetOPConfiguration = () => {
    removeSessionParameter(AUTHORIZATION_ENDPOINT);
    removeSessionParameter(TOKEN_ENDPOINT);
    removeSessionParameter(END_SESSION_ENDPOINT);
    removeSessionParameter(JWKS_ENDPOINT);
    removeSessionParameter(REVOKE_TOKEN_ENDPOINT);
    removeSessionParameter(OP_CONFIG_INITIATED);
};

export const getAuthorizeEndpoint = () => {
    return getSessionParameter(AUTHORIZATION_ENDPOINT);
};

export const setAuthorizeEndpoint = (authorizationEndpoint: string) => {
    setSessionParameter(AUTHORIZATION_ENDPOINT, authorizationEndpoint);
};

export const getTokenEndpoint = () => {
    return getSessionParameter(TOKEN_ENDPOINT);
};

export const setTokenEndpoint = (tokenEndpoint: string) => {
    setSessionParameter(TOKEN_ENDPOINT, tokenEndpoint);
};

export const getRevokeTokenEndpoint = () => {
    return getSessionParameter(REVOKE_TOKEN_ENDPOINT);
};

export const setRevokeTokenEndpoint = (revokeTokenEndpoint: string) => {
    setSessionParameter(REVOKE_TOKEN_ENDPOINT, revokeTokenEndpoint);
};

export const getEndSessionEndpoint = () => {
    return getSessionParameter(END_SESSION_ENDPOINT);
};

export const setEndSessionEndpoint = (endSessionEndpoint: string) => {
    setSessionParameter(END_SESSION_ENDPOINT, endSessionEndpoint);
};

export const getJwksUri = () => {
    return getSessionParameter(JWKS_ENDPOINT);
};

export const setJwksUri = (jwksEndpoint) => {
    setSessionParameter(JWKS_ENDPOINT, jwksEndpoint);
};

export const isOPConfigInitiated = (): boolean => {
    return getSessionParameter(OP_CONFIG_INITIATED) && "true" === getSessionParameter(OP_CONFIG_INITIATED);
};

export const setOPConfigInitiated = () => {
    setSessionParameter(OP_CONFIG_INITIATED, "true");
};
