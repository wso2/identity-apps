/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, ReactElement, SVGProps } from "react";

/**
 * API DTO for an element linked to a purpose version.
 */
export interface PurposeElementDTOInterface {
    description: string;
    displayName: string;
    id: string;
    mandatory: boolean;
    name: string;
}

/**
 * API DTO for a purpose version.
 */
export interface PurposeVersionDTOInterface {
    description: string;
    elements: PurposeElementDTOInterface[];
    id: string;
    properties?: {
        policyUrl?: string;
        promptOnLogin?: boolean;
    };
    version: string;
}

/**
 * API DTO for a purpose version summary in list responses.
 */
export interface PurposeVersionSummaryDTOInterface {
    description: string;
    id: string;
    version: string;
}

/**
 * API DTO for a purpose in list responses.
 */
export interface PurposeSummaryDTOInterface {
    description: string;
    id: string;
    latestVersion: {
        id: string;
        version: string;
    } | null;
    name: string;
    type: string;
}

/**
 * API DTO for pagination links.
 */
export interface PaginationLinkInterface {
    rel: "next" | "previous";
    href: string;
}

/**
 * API DTO for the purpose list response.
 */
export interface PurposeListResponseDTOInterface {
    Purposes: PurposeSummaryDTOInterface[];
    links?: PaginationLinkInterface[];
    totalResults: number;
}

/**
 * API DTO for purpose versions list response.
 */
export interface PurposeVersionListResponseDTOInterface {
    Versions: PurposeVersionSummaryDTOInterface[];
    links?: PaginationLinkInterface[];
    totalResults: number;
}

/**
 * Paginated list response for user consent records.
 */
export interface PolicyConsentListResponseInterface {
    Consents: PolicyConsentSummaryInterface[];
    links?: PaginationLinkInterface[];
    totalResults: number;
}

/**
 * API DTO for a full purpose with latest version details.
 */
export interface PurposeDTOInterface {
    description: string;
    elements: PurposeElementDTOInterface[];
    id: string;
    latestVersion: {
        id: string;
        version: string;
    } | null;
    name: string;
    properties?: {
        policyUrl?: string;
        promptOnLogin?: boolean;
    };
    type: string;
}

/**
 * API DTO for an element.
 */
export interface ElementDTOInterface {
    description: string;
    displayName: string;
    id: string;
    name: string;
}

/**
 * API DTO for the element list response.
 */
export interface ElementListResponseDTOInterface {
    Elements: ElementDTOInterface[];
    totalResults: number;
}

/**
 * Request body for creating a consent element.
 */
export interface CreateElementRequestInterface {
    description?: string;
    displayName?: string;
    name: string;
}

/**
 * Inline element to create and bind in a single request.
 */
export interface NewElementBindingInterface {
    displayName?: string;
    mandatory?: boolean;
    name: string;
}

/**
 * Request body for creating a purpose.
 */
export interface CreatePurposeRequestInterface {
    description?: string;
    elements?: Array<{ id: string; mandatory?: boolean }>;
    name: string;
    newElements?: NewElementBindingInterface[];
    properties?: {
        policyUrl: string;
        promptOnLogin?: boolean;
    };
    type: string;
    version?: string;
}

/**
 * Request body for creating a purpose version.
 */
export interface CreatePurposeVersionRequestInterface {
    description?: string;
    elements?: Array<{ id: string; mandatory?: boolean }>;
    newElements?: NewElementBindingInterface[];
    properties?: {
        policyUrl: string;
        promptOnLogin?: boolean;
    };
    setAsLatest?: boolean;
    version: string;
}

/**
 * Request body for setting the latest purpose version.
 */
export interface SetLatestVersionRequestInterface {
    id: string;
}

/**
 * App-level consent interface (mapped from PurposeDTOInterface).
 */
export interface ConsentInterface {
    description: string;
    displayName: string;
    id: string;
    mandatory?: boolean;
    name: string;
    policyUrl?: string;
    promptOnLogin?: boolean;
    type: string;
    /**
     * Version label, e.g. "v1".
     */
    version: string;
    /**
     * UUID of the latest version — needed for set-latest-version API.
     */
    versionId: string;
}

/**
 * App-level consent list item interface (mapped from PurposeSummaryDTOInterface).
 */
export interface ConsentListItemInterface {
    description: string;
    id: string;
    name: string;
    type: string;
}

/**
 * Consent type interface.
 */
export interface ConsentTypeInterface {
    id: string;
    name: string;
}

/**
 * Enum for Consent types.
 */
export enum ConsentType {
    POLICY = "Policy"
}

/**
 * Interface for wizard step.
 */
export interface WizardStepInterface {
    icon: FunctionComponent<SVGProps<SVGSVGElement>> | ReactElement;
    name: string;
    title: string;
}

/**
 * Summary of a user consent record returned from GET /consents list.
 */
export interface PolicyConsentSummaryInterface {
    id: string;
    serviceId: string;
    state: string;
    subjectId: string;
    timestamp: number;
    validityTime: number | null;
}

/**
 * A data element within a consented purpose.
 */
export interface ConsentedElementInterface {
    displayName: string;
    id: string;
    name: string;
}

/**
 * A purpose within a full user consent record.
 */
export interface ConsentedPurposeInterface {
    elements: ConsentedElementInterface[];
    id: string;
    name: string;
    purposeVersionId: string;
    version: string | null;
}

/**
 * Full user consent record returned from GET /consents/{consentId}.
 */
export interface PolicyConsentDetailInterface {
    id: string;
    language: string;
    properties?: Record<string, string>;
    purposes: ConsentedPurposeInterface[];
    serviceId: string;
    state: string;
    subjectId: string;
    timestamp: number;
    validityTime: number | null;
}

/**
 * UI-level flat item representing a single policy a user has consented to.
 */
export interface PolicyConsentItemInterface {
    consentId: string;
    policyUrl: string | null;
    purposeId: string;
    purposeName: string;
    purposeVersionId: string;
    timestamp: number;
    version: string | null;
}
