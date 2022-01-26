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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core";
import { ApplicationManagementConstants } from "../constants";
import {
    AdaptiveAuthTemplatesListInterface,
    ApplicationBasicInterface,
    ApplicationInterface,
    ApplicationListInterface,
    ApplicationTemplateInterface,
    ApplicationTemplateListInterface,
    AuthProtocolMetaListItemInterface,
    MainApplicationInterface,
    OIDCApplicationConfigurationInterface,
    OIDCDataInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes
} from "../models";
import { ApplicationManagementUtils } from "../utils";

/**
 * TODO: move the error messages to a constant file.
 */

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

const httpClientAll = AsgardeoSPAClient.getInstance()
    .httpRequestAll.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get app from: "));
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
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
 * @param {number} limit - Maximum Limit of the application List.
 * @param {number} offset - Offset for get to start.
 * @param {string} filter - Search filter.
 *
 * @return {Promise<ApplicationListInterface>} A promise containing the response.
 */
export const getApplicationList = (limit: number, offset: number,
    filter: string): Promise<ApplicationListInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.applications
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get application list from: "));
            }

            return Promise.resolve(response.data as ApplicationListInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

export const getApplicationsByIds = async (
    ids: Set<string>
): Promise<AxiosResponse<ApplicationInterface>[]> => {

    const requests = [];

    for (const id of ids) {
        requests.push({
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.applications + "/" + id
        });
    }

    try {
        const responses = await httpClientAll(requests);

        return Promise.resolve<AxiosResponse<ApplicationInterface>[]>(responses);
    } catch (error: AxiosError | any) {
        return Promise.reject(
            new IdentityAppsApiException(
                ApplicationManagementConstants.UNABLE_FETCH_APPLICATIONS,
                error?.stack,
                error?.code,
                error?.request,
                error?.response,
                error?.config
            )
        );
    }

};

/**
 * Gets the available inbound protocols.
 *
 * @param customOnly If true only returns custom protocols.
 */
export const getAvailableInboundProtocols = (customOnly: boolean): Promise<AuthProtocolMetaListItemInterface[]> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/meta/inbound-protocols?customOnly=" + customOnly
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get Inbound protocols from: "));
            }

            return Promise.resolve(response.data as AuthProtocolMetaListItemInterface[]);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the metadata related to the passed in auth protocol.
 *
 * @param {string} protocol - The protocol to get the meta.
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const getAuthProtocolMetadata = <T>(protocol: string): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications}/meta/inbound-protocols/${ protocol }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/" + id + "/inbound-protocols/oidc"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to retrieve OIDC data from: "));
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
 * @param {string} applicationId - ID of the application.
 * @param {string} inboundProtocolId - Protocol ID.
 * @return {Promise<OIDCDataInterface>}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getInboundProtocolConfig = (applicationId: string, inboundProtocolId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications }/${ applicationId }/inbound-protocols/${
            inboundProtocolId }`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to retrieve the inbound protocol config."));
            }

            return Promise.resolve(response.data);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the OIDC configuration.
 * TODO: Migrate to `updateAuthProtocolConfig` generic function.
 *
 * @param {string} id - Application ID
 * @param {Record<string, unknown>} OIDC - OIDC configuration data.
 * @return {Promise<any>}
 */
export const updateOIDCData = (id: string, OIDC: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data: OIDC,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.applications + "/" + id + "/inbound-protocols/oidc"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update inbound configuration"));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Generic function to update the authentication protocol config of an application.
 *
 * @param {string} id - Application ID.
 * @param {T} config - Protocol config.
 * @param {string} protocol - The protocol to be updated.
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const updateAuthProtocolConfig = <T>(id: string, config: T,
    protocol: string): Promise<T> => {

    /**
     * On template level we use {@link SupportedAuthProtocolTypes.OAUTH2_OIDC}
     * to determine custom oidc applications. But for the API "oauth2-oidc" is
     * an unknown protocol. We manually switch out the protocol or re-correct
     * in this API call to avoid unattended PUT errors.
     */
    if (SupportedAuthProtocolTypes.OAUTH2_OIDC === protocol) {
        protocol = SupportedAuthProtocolTypes.OIDC;
    }

    const requestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.applications}/${ id }/inbound-protocols/${ protocol }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.AUTH_PROTOCOL_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.AUTH_PROTOCOL_CONFIG_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Generic function to delete the authentication protocol config of an application.
 *
 * @param {string} id - Application ID.
 * @param {string} protocol - The protocol to be deleted.
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const deleteProtocol = <T>(id: string, protocol: string): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.applications}/${ id }/inbound-protocols/${ protocol }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APP_PROTOCOL_DELETE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APP_PROTOCOL_DELETE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Updates the application configuration.
 *
 * @param {string} id - Application ID
 * @param {Record<string, unknown>} configs - Application configurations.
 * @return {Promise<any>}
 */
export const updateApplicationConfigurations = (id: string, configs: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update advance configuration"));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Creates a new application.
 *
 * @param {MainApplicationInterface} application - Application settings data.
 * @return {Promise<any>}
 */
export const createApplication = (application: MainApplicationInterface): Promise<any> => {
    const requestConfig = {
        data: application,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.applications
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 201)) {
                return Promise.reject(new Error("Failed to create the application."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates Authentication sequence of the application.
 * @param {string} id - ID of the application
 * @param {Record<string, unknown>} data - Authentication configurations of the application.
 * @return {Promise<any>}
 */
export const updateAuthenticationSequence = (id: string, data: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update authentication sequence"));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates Authentication sequence of the application.
 *
 * @param {string} id - ID of the application.
 * @param {Record<string, unknown>} data - Claim configurations of the application.
 * @return {Promise<any>}
 */
export const updateClaimConfiguration = (id: string, data: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update claim configuration"));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Regenerates the client secret.
 * Used only in OIDC flow.
 *
 * @param {string} appId - application Id.
 * @return {Promise<any>}
 */
export const regenerateClientSecret = (appId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.applications + "/" + appId +
            "/inbound-protocols/oidc/regenerate-secret"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to regenerate the application secret."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Revoke the client secret of application
 * Used only in OIDC flow.
 *
 * @param {string} appId - application ID.
 * @return {Promise<any>}
 */
export const revokeClientSecret = (appId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.applications + "/" + appId + "/inbound-protocols/oidc/revoke"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to revoke the application secret."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the sample adaptive authentication templates.
 *
 * @return {Promise<AdaptiveAuthTemplatesListInterface>} Response as a promise.
 * @throws {IdentityAppsApiException}
 */
export const getAdaptiveAuthTemplates = (): Promise<AdaptiveAuthTemplatesListInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications }/meta/adaptive-auth-templates`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.ADAPTIVE_AUTH_TEMPLATES_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve({
                templatesJSON: JSON.parse(response?.data?.templatesJSON)
            } as AdaptiveAuthTemplatesListInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.ADAPTIVE_AUTH_TEMPLATES_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get Application Template data.
 *
 * @param templateId Template Id of the application.
 *
 * @return {Promise<ApplicationTemplateInterface>} A promise containing the response.
 * @throws {IdentityAppsApiException}
 */
export const getApplicationTemplateData = (templateId: string): Promise<ApplicationTemplateInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/templates/" + templateId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ApplicationTemplateInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_TEMPLATE_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the application template list with limit and offset.
 *
 * @param {number} limit - Maximum Limit of the application template List.
 * @param {number} offset - Offset for get to start.
 * @param {string} filter - Search filter.
 *
 * @return {Promise<ApplicationTemplateListInterface>} A promise containing the response.
 * @throws {IdentityAppsApiException}
 */
export const getApplicationTemplateList = (limit?: number, offset?: number,
    filter?: string): Promise<ApplicationTemplateListInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.applications + "/templates"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ApplicationTemplateListInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_TEMPLATES_LIST_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the OIDC application configurations.
 *
 * @return {Promise<OIDCApplicationConfigurationInterface>} A promise containing the oidc configurations.
 * @throws {IdentityAppsApiException}
 */
export const getOIDCApplicationConfigurations = (): Promise<OIDCApplicationConfigurationInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.wellKnown
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.OIDC_CONFIGURATIONS_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            const oidcConfigs = {
                authorizeEndpoint: response.data.authorization_endpoint,
                endSessionEndpoint: response.data.end_session_endpoint,
                introspectionEndpoint: response.data.introspection_endpoint,
                jwksEndpoint: response.data.jwks_uri,
                tokenEndpoint: response.data.token_endpoint,
                tokenRevocationEndpoint: response.data.revocation_endpoint,
                userEndpoint: response.data.userinfo_endpoint,
                wellKnownEndpoint: store.getState().config.endpoints.wellKnown
            };

            return Promise.resolve(oidcConfigs);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_OIDC_CONFIGURATIONS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the SAML application configurations.
 *
 * @return {Promise<SAMLApplicationConfigurationInterface>} A promise containing the meta data.
 * @throws {IdentityAppsApiException}
 */
export const getSAMLApplicationConfigurations = (): Promise<SAMLApplicationConfigurationInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.saml2Meta
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.SAML_CONFIGURATIONS_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(ApplicationManagementUtils.getIDPDetailsFromMetaXML(response.data));
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_SAML_CONFIGURATIONS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Retrieve available request path authenticators.
 *
 * @returns {Promise<any>} a promise containing the response.
 * @throws {IdentityAppsApiException}
 */
export const getRequestPathAuthenticators = (): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.requestPathAuthenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.REQUEST_PATH_AUTHENTICATORS_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.REQUEST_PATH_AUTHENTICATORS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
