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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { Decode, Encode } from "../helpers/base64-utils";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve FIDO meta data
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getMetaData = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.fidoMetaData
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get meta info from: ${store.getState().config.endpoints.fidoMetaData}`)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve FIDO metadata - ${error}`);
        });
};

/**
 * Updates FIDO device name
 * @param credentialId
 * @param deviceName
 */
export const updateDeviceName = (credentialId: string, deviceName: string): Promise<any> => {
    const requestConfig = {
        data: [ {
            operation: "REPLACE",
            path: "/displayName",
            value: deviceName
        } ],
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.fidoMetaData}/${credentialId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed update device name from: ${store.getState().config.endpoints.fidoMetaData}`)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update FIDO device name - ${error}`);
        });
};

/**
 * Delete the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const deleteDevice = (credentialId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.fidoMetaData}/${credentialId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to delete FIDO device - ${error}`);
        });
};

/**
 * This functions receive the response from the start-registration endpoint
 * and convert the values of the attributes of response object
 * from byte array to base64url format.
 *
 * @param {object} response
 */
const responseToObject = (response): Record<string, any> => {
    if (response.u2fResponse) {
        return response;
    } else {
        let clientExtensionResults = {};

        try {
            clientExtensionResults = response.getClientExtensionResults();
        } catch (e) {
            // No need to show UI errors here.
            // Add debug logs here one a logger is added.
            // Tracked here https://github.com/wso2/product-is/issues/11650.
        }

        if (response.response.attestationObject) {
            return {
                // tslint:disable-next-line:object-literal-sort-keys
                clientExtensionResults,
                id: response.id,
                response: {
                    attestationObject: Encode(response.response.attestationObject),
                    clientDataJSON: Encode(response.response.clientDataJSON)
                },
                type: response.type
            };
        } else {
            return {
                // tslint:disable-next-line:object-literal-sort-keys
                clientExtensionResults,
                id: response.id,
                response: {
                    authenticatorData: Encode(response.response.authenticatorData),
                    clientDataJSON: Encode(response.response.clientDataJSON),
                    signature: Encode(response.response.signature),
                    userHandle: response.response.userHandle && Encode(response.response.userHandle)
                },
                type: response.type
            };
        }
    }
};

/**
 * Finish registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const endFidoFlow = (clientResponse: string): Promise<any> => {
    const requestConfig = {
        data: clientResponse,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.fidoEnd
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to end registration flow at: ${store.getState().config.endpoints.fidoEnd}`)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to finish the FIDO registration - ${error}`);
        });
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
export const connectToDevice = (requestId, credentialCreationOptions): Promise<any> => {
    return navigator.credentials
        .create({ publicKey: credentialCreationOptions })
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
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * This function receives the response from start-registration endpoint and converts the user attributes
 * and the challenge attribute from base64url to a buffer array.
 *
 * @param request
 *
 * @return {object} excludeCredentials
 */
export const decodePublicKeyCredentialCreationOptions = (request): Record<string, any> => {
    const excludeCredentials = request.excludeCredentials.map((credential) => {
        return { ...credential, id: Decode(credential.id) };
    });

    return {
        ...request,
        attestation: "direct",
        challenge: Decode(request.challenge),
        excludeCredentials,
        user: {
            ...request.user,
            id: Decode(request.user.id)
        }
    };
};

/**
 * Start registration flow of the FIDO device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const startFidoFlow = (): Promise<any> => {
    const data = new URLSearchParams();

    data.append("appId", window.location.origin);

    const requestConfig = {
        data: data.toString(),
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.fidoStart
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to start registration flow at: ${store.getState().config.endpoints.fidoStart}`)
                );
            }

            return Promise.resolve(response?.data);
        })
        .catch((error) => {
            return Promise.reject(`FIDO connection terminated - ${error}`);
        });
};

/**
 * Start registration flow of the FIDO device which supports usernameless flow
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const startFidoUsernamelessFlow = (): Promise<any> => {
    const data = new URLSearchParams();

    data.append("appId", window.location.origin);

    const requestConfig = {
        data: data.toString(),
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.fidoStartUsernameless
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed to start registration flow at:
                    ${store.getState().config.endpoints.fidoStartUsernameless}`)
                );
            }

            return Promise.resolve(response?.data);
        })
        .catch((error) => {
            return Promise.reject(`FIDO connection terminated - ${error}`);
        });
};
