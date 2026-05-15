/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import {
    ConsentInterface,
    ConsentListItemInterface,
    CreatePurposeRequestInterface,
    CreatePurposeVersionRequestInterface,
    ElementDTOInterface,
    PolicyConsentDetailInterface,
    PolicyConsentListResponseInterface,
    PurposeDTOInterface,
    PurposeElementDTOInterface,
    PurposeSummaryDTOInterface,
    PurposeVersionDTOInterface
} from "../models/consents";

/**
 * Group used when creating new purposes.
 */
const CONSENT_MGT_GROUP: string = "Policy";

/**
 * Description used when creating the policy consent element.
 */
const POLICY_CONSENT_ELEMENT_DESCRIPTION: string = "Policy consent element";

/**
 * Prefix used for policy URL elements.
 */
const POLICY_URL_ELEMENT_PREFIX: string = "policy_url";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

interface PurposeListResponseInterface {
    Purposes?: PurposeSummaryDTOInterface[];
}

/**
 * Checks if a policy name is available (not already in use).
 *
 * @param name - The policy name to check.
 * @returns A promise that resolves to true if the name is available, false otherwise.
 */
export const isPolicyNameAvailable = (name: string): Promise<boolean> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.consentMgtPurposes }?filter=name+eq+${ encodeURIComponent(`'${name}'`) }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeListResponseInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to check policy name availability.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return (response.data.Purposes ?? []).length === 0;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

interface ElementListResponseInterface {
    Elements?: ElementDTOInterface[];
}

/**
 * Maps a PurposeSummaryDTOInterface to a ConsentListItemInterface.
 *
 * @param purpose - Purpose summary from the API.
 * @returns Mapped consent list item.
 */
export const mapPurposeSummaryToListItem = (purpose: PurposeSummaryDTOInterface): ConsentListItemInterface => ({
    description: purpose.description,
    id: purpose.id,
    name: purpose.name,
    type: purpose.type
});

/**
 * Maps a PurposeDTOInterface to a ConsentInterface.
 *
 * @param purpose - Full purpose DTO from the API.
 * @returns Mapped consent.
 */
export const mapPurposeDTOToConsent = (purpose: PurposeDTOInterface): ConsentInterface => {
    const elements: PurposeElementDTOInterface[] = purpose.elements ?? [];

    const mandatoryElement: PurposeElementDTOInterface | undefined = elements.find(
        (element: PurposeElementDTOInterface) => element.name === CONSENT_MGT_GROUP
    );

    return {
        description: purpose.description,
        displayName: purpose.name,
        id: purpose.id,
        mandatory: mandatoryElement?.mandatory ?? false,
        name: purpose.name,
        policyUrl:
            purpose.properties?.policyUrl
            ?? elements.find(
                (element: PurposeElementDTOInterface) =>
                    element.name.startsWith(`${ POLICY_URL_ELEMENT_PREFIX }:`)
            )?.displayName,
        type: purpose.type,
        version: purpose.latestVersion?.version,
        versionId: purpose.latestVersion?.id
    };
};

/**
 * Gets the list of purposes.
 *
 * @returns A promise containing the list of purposes mapped to consent items.
 */
export const getPurposes = (): Promise<ConsentListItemInterface[]> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.consentMgtPurposes
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeListResponseInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to retrieve purposes list.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return (response.data.Purposes ?? []).map(mapPurposeSummaryToListItem);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Gets a purpose by ID.
 *
 * @param id - ID of the purpose.
 * @returns A promise containing the purpose mapped to consent interface.
 */
export const getPurpose = (id: string): Promise<ConsentInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.consentMgtPurposes }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeDTOInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to retrieve purpose.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return mapPurposeDTOToConsent(response.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Fetches the shared policy consent element by name, creating it if it doesn't exist.
 *
 * @returns A promise resolving to the elementId of the shared element.
 */
const getOrCreatePolicyConsentElement = async (): Promise<string> => {
    const elementsUrl: string = store.getState().config.endpoints.consentMgtElements;
    const listConfig: RequestConfigInterface = {
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        method: HttpMethods.GET,
        params: { filter: `name eq ${ CONSENT_MGT_GROUP }` },
        url: elementsUrl
    };

    const listResponse: AxiosResponse<ElementListResponseInterface> = await httpClient(listConfig);
    const existingItems: ElementDTOInterface[] = listResponse.data?.Elements ?? [];

    if (existingItems.length > 0) {
        return existingItems[0].id;
    }

    try {
        const createResponse: AxiosResponse<ElementDTOInterface> = await httpClient({
            data: {
                description: POLICY_CONSENT_ELEMENT_DESCRIPTION,
                displayName: CONSENT_MGT_GROUP,
                name: CONSENT_MGT_GROUP
            },
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            method: HttpMethods.POST,
            url: elementsUrl
        });

        return createResponse.data.id;
    } catch (error: unknown) {
        const axiosError: AxiosError<HttpErrorResponseDataInterface> =
            error as AxiosError<HttpErrorResponseDataInterface>;

        // Another concurrent request already created the element — re-fetch to get its ID.
        if (axiosError.response?.status === 409) {
            const retryResponse: AxiosResponse<ElementListResponseInterface> = await httpClient(listConfig);
            const items: ElementDTOInterface[] = retryResponse.data?.Elements ?? [];

            if (items.length > 0) {
                return items[0].id;
            }
        }

        throw error;
    }
};

/**
 * Creates a new purpose (consent) with an inline policy URL element.
 *
 * @param name - Name of the purpose.
 * @param policyUrl - Policy URL stored in the version properties.
 * @param description - Optional description of the purpose.
 * @param mandatory - Whether this policy is mandatory (blocks login until accepted).
 * @returns A promise containing the created purpose DTO.
 */
export const createPurpose = async (
    name: string,
    policyUrl: string,
    description?: string,
    mandatory?: boolean
): Promise<PurposeDTOInterface> => {
    const policyConsentElementId: string = await getOrCreatePolicyConsentElement();

    const body: CreatePurposeRequestInterface = {
        description,
        elements: [
            { id: policyConsentElementId, mandatory: mandatory ?? false }
        ],
        name,
        properties: { policyUrl },
        type: CONSENT_MGT_GROUP,
        version: "1"
    };

    const requestConfig: RequestConfigInterface = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.consentMgtPurposes
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeDTOInterface>) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Failed to create purpose.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response.data;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Deletes a purpose by ID.
 *
 * @param id - ID of the purpose to delete.
 * @returns A promise that resolves when deletion succeeds.
 */
export const deletePurpose = (id: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.consentMgtPurposes }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    "Failed to delete purpose.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Creates a new version for an existing purpose, promoted as latest in a single call.
 *
 * @param purposeId - ID of the purpose.
 * @param versionLabel - Version label (e.g. "2").
 * @param description - Description for this version.
 * @param policyUrl - Policy URL stored in the version properties.
 * @param mandatory - Whether this policy is mandatory (blocks login until accepted).
 * @returns A promise containing the created version DTO.
 */
export const createPurposeVersion = async (
    purposeId: string,
    versionLabel: string,
    description: string,
    policyUrl: string,
    mandatory?: boolean
): Promise<PurposeVersionDTOInterface> => {
    const policyConsentElementId: string = await getOrCreatePolicyConsentElement();

    const body: CreatePurposeVersionRequestInterface = {
        description,
        elements: [
            { id: policyConsentElementId, mandatory: mandatory ?? false }
        ],
        properties: { policyUrl },
        setAsLatest: true,
        version: versionLabel
    };

    const requestConfig: RequestConfigInterface = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.consentMgtPurposes }/${ purposeId }/versions`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeVersionDTOInterface>) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Failed to create purpose version.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response.data;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Retrieves the list of user consent records from the v2 consents API.
 * Accepts the base URL as a parameter to remain store-agnostic and
 * usable from both the admin console and the MyAccount portal.
 *
 * @param consentsBaseUrl - Base URL for the v2 consents endpoint.
 * @param subjectId - Username of the subject to filter consents.
 * @param state - Consent state filter (defaults to "ACTIVE").
 * @returns A promise containing the paginated consent list response.
 */
export const getConsentsBySubject = (
    consentsBaseUrl: string,
    subjectId: string,
    state: string = "ACTIVE"
): Promise<PolicyConsentListResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: { state, subjectId },
        url: consentsBaseUrl
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PolicyConsentListResponseInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to retrieve consents.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response.data;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Retrieves the full details of a single user consent record from the v2 consents API.
 *
 * @param consentsBaseUrl - Base URL for the v2 consents endpoint.
 * @param consentId - ID of the consent record to retrieve.
 * @returns A promise containing the full consent detail.
 */
export const getConsentById = (
    consentsBaseUrl: string,
    consentId: string
): Promise<PolicyConsentDetailInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ consentsBaseUrl }/${ consentId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PolicyConsentDetailInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to retrieve consent details.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response.data;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Retrieves a specific purpose version from the v2 purposes API.
 * Used to resolve the policy URL stored in the version's properties.
 *
 * @param purposesBaseUrl - Base URL for the v2 purposes endpoint.
 * @param purposeId - ID of the purpose.
 * @param versionId - ID of the version.
 * @returns A promise containing the purpose version DTO.
 */
export const getPurposeVersionById = (
    purposesBaseUrl: string,
    purposeId: string,
    versionId: string
): Promise<PurposeVersionDTOInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ purposesBaseUrl }/${ purposeId }/versions/${ versionId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<PurposeVersionDTOInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to retrieve purpose version.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response.data;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Revokes a user consent record via the v2 consents API.
 *
 * @param consentsBaseUrl - Base URL for the v2 consents endpoint.
 * @param consentId - ID of the consent record to revoke.
 * @returns A promise that resolves when the revocation succeeds.
 */
export const revokeConsentById = (
    consentsBaseUrl: string,
    consentId: string
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ consentsBaseUrl }/${ consentId }/revoke`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    "Failed to revoke consent.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};
