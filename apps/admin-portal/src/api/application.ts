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
 */

import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import {
    ApplicationBasicInterface,
    ApplicationInterface,
    ApplicationListInterface,
    AuthProtocolMetadataInterface,
    Claim,
    ClaimDialect,
    ExternalClaim,
    HttpMethods,
    OIDCDataInterface,
    OIDCMetadataInterface
} from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve claims in local dialect.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getLocalClaims = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.claims + "/local/claims"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get local claims from: "));
            }
            return Promise.resolve(response.data as Claim);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve claims dialects.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getClaimDialect = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.claims
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get claim dialect from: "));
            }
            return Promise.resolve(response.data as ClaimDialect);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets claims in other dialects.
 *
 * @param dialectID Selected dialectID.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getExternalClaims = (dialectID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.claims + "/" + dialectID + "/claims"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get external claims: "));
            }
            return Promise.resolve(response.data as ExternalClaim);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the basic information about the application.
 *
 * @param id ID of the application.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getApplicationDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.applications + "/" + id
    };

    return httpClient.get(requestConfig.url, { headers: requestConfig.headers })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get app from: "));
            }
            return Promise.resolve(response.data as ApplicationBasicInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Deletes an application when the relevant id is passed in.
 *
 * @param id ID of the application.
 * @return {Promise<any>} A promise containing the response.
 */
export const deleteApplication = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: ServiceResourcesEndpoint.applications + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the application."));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the application with basic details.
 *
 * @param app Basic info about the application.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const updateApplicationDetails = (app: ApplicationInterface): Promise<any> => {

    const { id, ...rest } = app;

    const requestConfig = {
        data: rest,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.applications + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update application from: "));
            }
            return Promise.resolve(response.data as ApplicationBasicInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the application list with limit and offset.
 *
 * @param limit Maximum Limit of the application List.
 * @param offset Offset for get to start.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getApplicationList = (limit: number, offset: number): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.applications + "?limit=" + limit + "&offset=" + offset
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get application list from: "));
            }
            return Promise.resolve(response.data as ApplicationListInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the available inbound protocols.
 *
 * @param customOnly If true only returns custom protocols.
 */
export const getAvailableInboundProtocols = (customOnly: boolean): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.applications + "/meta/inbound-protocols?customOnly=" + customOnly
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get Inbound protocols from: "));
            }
            return Promise.resolve(response.data as AuthProtocolMetadataInterface[]);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the OIDC protocol's meta data.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getOIDCMetadata = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.applications + "/meta/inbound-protocols/oidc"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status === 404) {
                return Promise.reject(new Error("Inbound protocol not configured"));
            } else if (response.status !== 200) {
                return Promise.reject(new Error("Failed get OIDC meta data from: "));
            }
            return Promise.resolve(response.data as OIDCMetadataInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the application's OIDC data.
 *
 * @param id Application ID
 */
export const getOIDCData = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.applications + "/" + id + "/inbound-protocols/oidc"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed retrieve OIDC data from: "));
            }
            return Promise.resolve(response.data as OIDCDataInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Generic function to get the relevant inbound protocol config
 * when the path provided in the `self` attribute of the application
 * response is passed in.
 *
 * @param {string} endpoint - Resource endpoint.
 * @return {Promise<OIDCDataInterface>}
 */
export const getInboundProtocolConfig = (endpoint: string) => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.base + endpoint
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed retrieve the inbound protocol config."));
            }
            return Promise.resolve(response.data);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the OIDC configuration.
 *
 * @param id Application ID
 * @param OIDC OIDC configuration data.
 */
export const updateOIDCData = (id: string, OIDC: object): Promise<any> => {
    const requestConfig = {
        data: OIDC,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: ServiceResourcesEndpoint.applications + "/" + id + "/inbound-protocols/oidc"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed update inbound configuration"));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the application configuration.
 *
 * @param id Application ID
 * @param advancedConfigs Application's advanced configurations.
 */
export const updateAdvanceConfigurations = (id: string, advancedConfigs: object): Promise<any> => {
    const requestConfig = {
        data: advancedConfigs,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.applications + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed update advance configuration"));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Creates a new application.
 *
 * @param application Application settings data.
 */
export const createApplication = (application: object): Promise<any> => {
    const requestConfig = {
        data: application,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.applications
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if ((response.status !== 201)) {
                return Promise.reject(new Error("Failed create the application."));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
