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
import axios from "axios";
import { ServiceResourcesEndpoint } from "../configs";
import { decode, encode } from "../helpers/base64Utils";
/**
 * Retrieve FIDO meta data
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getMetaData = (): Promise<any> => {
    const user = AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME);
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return axios.get(ServiceResourcesEndpoint.fidoMetaData, {params: {username: user}, headers: header})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed get meta info from: "
                        + ServiceResourcesEndpoint.fidoMetaData));
                }
                return Promise.resolve(response);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Start registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const startFidoFlow = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return axios.get(ServiceResourcesEndpoint.fidoStart,
            {params: {appId: window.location.origin}, headers: header})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to start registration flow at: "
                        + ServiceResourcesEndpoint.fidoStart));
                }
                connectToDevice(response.data.requestId,
                    decodePublicKeyCredentialCreationOptions(response.data.publicKeyCredentialCreationOptions));
                return Promise.resolve(response);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Finish registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const endFidoFlow = (clientResponse): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        return axios.post(ServiceResourcesEndpoint.fidoEnd, clientResponse, {headers: header})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to end registration flow at: "
                        + ServiceResourcesEndpoint.fidoEnd));
                }
                return Promise.resolve(response);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * This functions receive the response from the start-registration endpoint
 * and convert the values of the attributes of response object
 * from byte array to base64url format.
 *
 * @param {object} response
 */
const responseToObject = (response) => {
    if (response.u2fResponse) {
        return response;
    } else {
        let clientExtensionResults = {};

        try {
            clientExtensionResults = response.getClientExtensionResults();
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error("getClientExtensionResults failed", e);
        }

        if (response.response.attestationObject) {
            return {
                id: response.id,
                response: {
                    attestationObject: encode(response.response.attestationObject),
                    clientDataJSON: encode(response.response.clientDataJSON)
                },
                // tslint:disable-next-line:object-literal-sort-keys
                clientExtensionResults,
                type: response.type
            };
        } else {
            return {
                id: response.id,
                response: {
                    authenticatorData: encode(response.response.authenticatorData),
                    clientDataJSON: encode(response.response.clientDataJSON),
                    signature: encode(response.response.signature),
                    userHandle: response.response.userHandle && encode(response.response.userHandle)
                },
                // tslint:disable-next-line:object-literal-sort-keys
                clientExtensionResults,
                type: response.type
            };
        }
    }
};

/**
 * This function stores the credentialCreationOptions received from the registration endpoint
 * to the credential store as a publicKey.
 *
 * @param requestId
 * @param credentialCreationOptions
 *
 * @return {Promise<any>} a promise containing the response.
 */
const connectToDevice = (requestId, credentialCreationOptions) => {
    navigator.credentials.create({ publicKey: credentialCreationOptions })
        .then((credential) => {
            const payload = {
                credential: {},
                requestId: ""
            };
            payload.requestId = requestId;
            payload.credential = responseToObject(credential);
            endFidoFlow(JSON.stringify(payload))
                .then((response) => {
                    if (response.status !== 200) {
                        return Promise.reject(new Error("Failed get user info from"));
                    }
                    return Promise.resolve(response);
                }).catch((error) => {
                return Promise.reject(error);
            });
        }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * This function receive the response from start-registration endpoint and convert the user attributes
 * and the challenge attribute from base64url to a buffer array.
 *
 * @param request
 *
 * @return {object} excludeCredentials
 */
const decodePublicKeyCredentialCreationOptions = (request) => {
    const excludeCredentials = request.excludeCredentials.map((credential) => {
        return { ...credential, id: decode(credential.id)};
    });

    return {
        ...request,
        attestation: "direct",
        user: {
            ...request.user,
            id: decode(request.user.id),
        },
        // tslint:disable-next-line:object-literal-sort-keys
        challenge: decode(request.challenge),
        excludeCredentials,
    };
};
