/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AxiosHttpClient } from "@wso2is/http";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * This returns the list of certificate aliases.
 * 
 * @param {string} filter The filter query. Accepts the SCIM format.
 * 
 * @return {Promise<any>} List of Certificate Aliases.
 */
export const listCertificateAliases = (filter?: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter
        },
        url: store.getState().config.endpoints.certificates
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            Promise.reject(error?.response?.data);
        });
};

/**
 * This is used to download the specified certificate from the keystore.
 * 
 * @param {string} alias Alias ID.
 * @param {boolean} encode Specifies if teh certificate should be encoded or not.
 * 
 * @return {Promise<any>} The specified certificate alias
 */
export const retrieveCertificateAlias = (alias: string, encode?: boolean): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        params: {
            alias,
            encode
        },
        url: store.getState().config.endpoints.certificates
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * This allows you to download the specified public certificate from the keystore. 
 * 
 * @param {boolean} encode Specifies if the certificate should be encoded or not.
 * 
 * @return {Promise<any>} The specified public certificate.
 */
export const retrievePublicCertificate = (encode?: boolean): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        params: {
            encode
        },
        url: store.getState().config.endpoints.publicCertificates
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * This returns the list of certificate aliases from the truststore.
 * 
 * @param {string} filter The filter query. Accepts the SCIM format.
 * 
 * @return {Promise<any>} The list certificate aliases from teh client truststore.
 */
export const listClientCertificates = (filter?: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        params: {
            filter
        },
        url: store.getState().config.endpoints.clientCertificates
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * This lets you download the specified client certificate from the client truststore.
 * 
 * @param {string} alias The alias ID.
 * @param {boolean} encode Specifies if the certificate should be encoded or not.
 * 
 * @return {Promise<any>} The specified client certificate from the truststore.
 */
export const retrieveClientCertificate = (alias: string, encode?: boolean): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        params: {
            alias,
            encode
        },
        url: store.getState().config.endpoints.clientCertificates
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};
