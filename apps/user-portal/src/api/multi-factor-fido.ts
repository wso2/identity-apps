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

import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { Decode, Encode } from "../helpers/base64-utils";
import { HttpMethods } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve FIDO meta data
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getMetaData = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.fidoMetaData
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get meta info from: ${ ServiceResourcesEndpoint.fidoMetaData }`)
                );
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(`Failed to retrieve FIDO metadata - ${ error }`);
        });
};

/**
 * Delete the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const deleteDevice = (credentialId): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost
        },
        method: HttpMethods.DELETE,
        url: `${ ServiceResourcesEndpoint.fidoMetaData }/${ credentialId }`
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(`Failed to delete FIDO device - ${ error }`);
        });
};

/**
 * Start registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const startFidoFlow = (): Promise<any> => {
    const requestConfig = {
        data: { appId: window.location.origin },
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.fidoStart
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to start registration flow at: ${ ServiceResourcesEndpoint.fidoStart }`)
                );
            }
            return connectToDevice(response.data.requestId,
                decodePublicKeyCredentialCreationOptions(response.data.publicKeyCredentialCreationOptions))
                .then(() => {
                    return Promise.resolve(response);
                }).catch((error) => {
                    return Promise.reject(`Failed to connect to device - ${ error }`);
                });
        }).catch((error) => {
            return Promise.reject(`FIDO connection terminated - ${ error }`);
        });
};

/**
 * Start registration flow of the FIDO device which suppports usernameless flow
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const startFidoUsernamelessFlow = (): Promise<any> => {
    const requestConfig = {
        data: { appId: window.location.origin },
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.fidoStartUsernameless
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to start registration flow at:
                    ${ ServiceResourcesEndpoint.fidoStartUsernameless }`)
                );
            }
            return connectToDevice(response.data.requestId,
                decodePublicKeyCredentialCreationOptions(response.data.publicKeyCredentialCreationOptions))
                .then(() => {
                    return Promise.resolve(response);
                }).catch((error) => {
                    return Promise.reject(`Failed to connect to device - ${ error }`);
                });
        }).catch((error) => {
            return Promise.reject(`FIDO connection terminated - ${ error }`);
        });
};

/**
 * Finish registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const endFidoFlow = (clientResponse): Promise<any> => {
    const requestConfig = {
        data: clientResponse,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.fidoEnd
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to end registration flow at: ${ ServiceResourcesEndpoint.fidoEnd }`)
                );
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(`Failed to finish the FIDO registration - ${ error }`);
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
                    attestationObject: Encode(response.response.attestationObject),
                    clientDataJSON: Encode(response.response.clientDataJSON)
                },
                // tslint:disable-next-line:object-literal-sort-keys
                clientExtensionResults,
                type: response.type
            };
        } else {
            return {
                id: response.id,
                response: {
                    authenticatorData: Encode(response.response.authenticatorData),
                    clientDataJSON: Encode(response.response.clientDataJSON),
                    signature: Encode(response.response.signature),
                    userHandle: response.response.userHandle && Encode(response.response.userHandle)
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
    return navigator.credentials.create({ publicKey: credentialCreationOptions })
        .then((credential) => {
            const payload = {
                credential: {},
                requestId: ""
            };
            payload.requestId = requestId;
            payload.credential = responseToObject(credential);
            return endFidoFlow(JSON.stringify(payload))
                .then((response) => {
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
        return { ...credential, id: Decode(credential.id) };
    });

    return {
        ...request,
        attestation: "direct",
        user: {
            ...request.user,
            id: Decode(request.user.id),
        },
        // tslint:disable-next-line:object-literal-sort-keys
        challenge: Decode(request.challenge),
        excludeCredentials,
    };
};
