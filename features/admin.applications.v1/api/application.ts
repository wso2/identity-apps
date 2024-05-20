/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AsgardeoSPAClient, HttpClientInstance, HttpRequestConfig } from "@asgardeo/auth-react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { ApplicationManagementConstants } from "../constants";
import {
    AdaptiveAuthTemplateCategoryListItemInterface,
    AdaptiveAuthTemplatesListInterface,
    ApplicationBasicInterface,
    ApplicationInterface,
    ApplicationListInterface,
    ApplicationTemplateInterface,
    ApplicationTemplateListInterface,
    AuthProtocolMetaListItemInterface,
    MainApplicationInterface,
    MyAccountPortalStatusInterface,
    OIDCApplicationConfigurationInterface,
    OIDCDataInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes,
    UpdateClaimConfiguration
} from "../models";
import { ApplicationManagementUtils } from "../utils/application-management-utils";

/**
 * TODO: move the error messages to a constant file.
 */

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

const httpClientAll: (config: HttpRequestConfig[]) => Promise<AxiosResponse[]> = AsgardeoSPAClient.getInstance()
    .httpRequestAll.bind(AsgardeoSPAClient.getInstance());

/**
 * Gets the basic information about the application.
 *
 * @deprecated Use `useGetApplication` SWR hook instead.
 * @param id - ID of the application.
 * @returns A promise containing the response.
 */
export const getApplicationDetails = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get app from: "));
            }

            return Promise.resolve(response.data as ApplicationBasicInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Deletes an application when the relevant id is passed in.
 *
 * @param id - ID of the application.
 * @returns A promise containing the response.
 */
export const deleteApplication = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.applications + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the application."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the application with basic details.
 *
 * @param app - Basic info about the application.
 * @param skipEmptyPayloads - Skip empty payloads.
 *
 * @returns A promise containing the response.
 */
export const updateApplicationDetails = (
    app: ApplicationInterface,
    skipEmptyPayloads?: boolean
): Promise<ApplicationBasicInterface | void> => {
    const { id, ...rest } = app;

    if (skipEmptyPayloads && isEmpty(rest)) {
        return Promise.resolve();
    }

    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update application from: "));
            }

            return Promise.resolve(response.data as ApplicationBasicInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the application list with limit and offset.
 *
 * @param limit - Maximum Limit of the application List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns A promise containing the response.
 */
export const getApplicationList = (limit: number, offset: number,
    filter: string): Promise<ApplicationListInterface> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get application list from: "));
            }

            return Promise.resolve(response.data as ApplicationListInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Hook to get the applications list with limit and offset.
 *
 * @param limit - Maximum Limit of the application List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @returns Response as a promise.
 */
export const useApplicationList = <Data = ApplicationListInterface, Error = RequestErrorInterface>(
    attributes?: string,
    limit?: number,
    offset?: number,
    filter?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = shouldFetch
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                attributes,
                filter,
                limit,
                offset
            },
            url: store.getState().config.endpoints.applications
        }
        : null;

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export const getApplicationsByIds = async (
    ids: Set<string>
): Promise<AxiosResponse<ApplicationInterface>[]> => {

    const requests: AxiosRequestConfig[] = [];

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
        const responses: Array<AxiosResponse> = await httpClientAll(requests);

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
 * Hook to get the My Account application details.
 *
 * @returns My Account application data as the first element of the applications array.
 */
export const useMyAccountApplicationData = <Data = ApplicationListInterface, Error = RequestErrorInterface>(
    attributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const FILTERES: string = `name eq ${ ApplicationManagementConstants.MY_ACCOUNT_APP_NAME }`;
    const LIMIT: number = 1;
    const OFFSET: number = 0;

    const requestConfig: AxiosRequestConfig = shouldFetch
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                attributes,
                filter: FILTERES,
                limit: LIMIT,
                offset: OFFSET
            },
            url: store.getState().config.endpoints.applications
        }
        : null;

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Gets the available inbound protocols.
 *
 * @param customOnly - If true only returns custom protocols.
 */
export const getAvailableInboundProtocols = (customOnly: boolean): Promise<AuthProtocolMetaListItemInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/meta/inbound-protocols?customOnly=" + customOnly
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get Inbound protocols from: "));
            }

            return Promise.resolve(response.data as AuthProtocolMetaListItemInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the metadata related to the passed in auth protocol.
 *
 * @param protocol - The protocol to get the meta.
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getAuthProtocolMetadata = <T>(protocol: string): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications }/meta/inbound-protocols/${ protocol }`
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
 * @param id - Application ID
 */
export const getOIDCData = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications + "/" + id + "/inbound-protocols/oidc"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to retrieve OIDC data from: "));
            }

            return Promise.resolve(response.data as OIDCDataInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Generic function to get the relevant inbound protocol config
 * when the path provided in the `self` attribute of the application
 * response is passed in.
 *
 * @deprecated Use `useGetApplicationInboundConfigs` SWR hook instead.
 *
 * @param applicationId - ID of the application.
 * @param inboundProtocolId - Protocol ID.
 * @returns Response as a promise.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getInboundProtocolConfig = (applicationId: string, inboundProtocolId: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to retrieve the inbound protocol config."));
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the OIDC configuration.
 * TODO: Migrate to `updateAuthProtocolConfig` generic function.
 *
 * @param id - Application ID
 * @param OIDC - OIDC configuration data.
 *
 * @returns Response as a promise.
 */
export const updateOIDCData = (id: string, OIDC: Record<string, unknown>): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update inbound configuration"));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Generic function to update the authentication protocol config of an application.
 *
 * @param id - Application ID.
 * @param config - Protocol config.
 * @param protocol - The protocol to be updated.
 *
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
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

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.applications }/${ id }/inbound-protocols/${ protocol }`
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
 * @param id - Application ID.
 * @param protocol - The protocol to be deleted.
 *
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const deleteProtocol = <T>(id: string, protocol: string): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.applications }/${ id }/inbound-protocols/${ protocol }`
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
 * @param id - Application ID
 * @param configs - Application configurations.
 * @returns Response as a promise.
 */
export const updateApplicationConfigurations = (id: string, configs: Record<string, unknown>): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update advance configuration"));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Creates a new application.
 *
 * @param application - Application settings data.
 * @returns Response as a promise.
 */
export const createApplication = (application: MainApplicationInterface): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if ((response.status !== 201)) {
                return Promise.reject(new Error("Failed to create the application."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Updates Authentication sequence of the application.
 * @param id - ID of the application
 * @param Authentication - Configurations of the application.
 * @returns Response as a promise.
 */
export const updateAuthenticationSequence = (id: string, data: Record<string, unknown>): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update authentication sequence"));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Updates Authentication sequence of the application.
 *
 * @param id - ID of the application.
 * @param Claim - Configurations of the application.
 * @returns Response as a promise.
 */
export const updateClaimConfiguration = (id: string, data: UpdateClaimConfiguration): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update claim configuration"));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Regenerates the client secret.
 * Used only in OIDC flow.
 *
 * @param appId - Application Id.
 * @returns Response as a promise.
 */
export const regenerateClientSecret = (appId: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to regenerate the application secret."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Revoke the client secret of application
 * Used only in OIDC flow.
 *
 * @param appId - Application ID.
 * @returns Response as a promise.
 */
export const revokeClientSecret = (appId: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.applications + "/" + appId + "/inbound-protocols/oidc/revoke"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to revoke the application secret."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the sample adaptive authentication templates.
 *
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getAdaptiveAuthTemplates = (): Promise<AdaptiveAuthTemplatesListInterface> => {
    const requestConfig: AxiosRequestConfig = {
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
 * Hook to get the adaptive templates.
 *
 * @returns Adaptive auth template GET hook.
 */
export const useGetAdaptiveAuthTemplates = <
    Data = AdaptiveAuthTemplateCategoryListItemInterface,
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.applications}/meta/adaptive-auth-templates`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig);

    let parsed: Data | undefined = undefined;

    if ((data as AdaptiveAuthTemplatesListInterface)?.templatesJSON) {
        try {
            parsed = JSON.parse((data as any).templatesJSON);
        } catch(e) {
            parsed = undefined;
        }
    }

    return {
        data: parsed,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Get Application Template data.
 *
 * @param templateId - Template Id of the application.
 *
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const getApplicationTemplateData = (templateId: string): Promise<ApplicationTemplateInterface> => {
    const requestConfig: AxiosRequestConfig = {
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
 * @param limit - Maximum Limit of the application template List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const getApplicationTemplateList = (limit?: number, offset?: number,
    filter?: string): Promise<ApplicationTemplateListInterface> => {
    const requestConfig: AxiosRequestConfig = {
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
 * @returns A promise containing the oidc configurations.
 * @throws IdentityAppsApiException
 */
export const getOIDCApplicationConfigurations = (): Promise<OIDCApplicationConfigurationInterface> => {
    const requestConfig: AxiosRequestConfig = {
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

            const oidcConfigs: OIDCApplicationConfigurationInterface = {
                authorizeEndpoint: response.data.authorization_endpoint,
                dynamicClientRegistrationEndpoint: response.data.registration_endpoint,
                endSessionEndpoint: response.data.end_session_endpoint,
                introspectionEndpoint: response.data.introspection_endpoint,
                jwksEndpoint: response.data.jwks_uri,
                mtlsPushedAuthorizationRequestEndpoint:
                    response.data.mtls_endpoint_aliases?.pushed_authorization_request_endpoint,
                mtlsTokenEndpoint: response.data.mtls_endpoint_aliases?.token_endpoint,
                pushedAuthorizationRequestEndpoint: response.data.pushed_authorization_request_endpoint,
                sessionIframeEndpoint: response.data.check_session_iframe,
                tokenEndpoint: response.data.token_endpoint,
                tokenRevocationEndpoint: response.data.revocation_endpoint,
                userEndpoint: response.data.userinfo_endpoint,
                webFingerEndpoint: response.data.webfinger_endpoint,
                wellKnownEndpoint: `${ response.data.token_endpoint }/.well-known/openid-configuration`
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
 * @returns A promise containing the meta data.
 * @throws IdentityAppsApiException
 */
export const getSAMLApplicationConfigurations = (): Promise<SAMLApplicationConfigurationInterface> => {
    const requestConfig: AxiosRequestConfig = {
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
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const getRequestPathAuthenticators = (): Promise<any> => {

    const requestConfig: AxiosRequestConfig = {
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

/**
 * Function to add/update My Account portal status.
 *
 * @param status - My Account portal status.
 *
 * @returns Promise of response of the My Account status update request.
 * @throws IdentityAppsApiException
 */
export const updateMyAccountStatus = (status: boolean): Promise<MyAccountPortalStatusInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            attributes: [
                {
                    key: "enable",
                    value: status
                }
            ],
            name: "status"
        },
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.myAccountConfigMgt
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as MyAccountPortalStatusInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.MYACCOUNT_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the status of the My Account Portal.
 *
 * @returns Response of the My Account status retrieval request.
 */
export const useMyAccountStatus = <Data = MyAccountPortalStatusInterface, Error = RequestErrorInterface>(
    shouldSendRequest: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: shouldSendRequest ? store.getState().config.endpoints.myAccountConfigMgt + "/status/enable" : ""
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    if (error && !shouldSendRequest) {
        return {
            data: null,
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: null
        };
    }

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};
