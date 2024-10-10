/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { DynamicFormInterface } from "@wso2is/admin.template-core.v1/models/dynamic-fields";

/**
 * Interface that represent the response returned by the list IDVPs GET request.
 */
export interface IdVPListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    identityVerificationProviders?: IdentityVerificationProviderInterface[];
}

export interface IdVPConfigPropertiesInterface {
    key: string;
    value: string | boolean;
}

/**
 * Interface that represent a claim (attribute) mapping in the IDVP context. This is
 * the claims mapping format expected by the IDVP backend APIs.This is mostly used
 * outside the attribute management components
 */
export interface IdVPClaimsInterface {
    localClaim: string;
    idvpClaim: string;
}

/**
 * Interface that represent a local claim in the IDVP context.
 */
export interface IdVPLocalClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

/**
 * Like the {@link IDVPClaimsInterface} this represents a claim mapping, but this model
 * contains a bit more information about the local claim and used in attribute management components.
 */
export interface IdVPClaimMappingInterface {
    localClaim: IdVPLocalClaimInterface;
    idvpClaim: string;
}

/**
 * Interface for representing an identity verification provider.
 */
export interface IdentityVerificationProviderInterface {
    id?: string;
    name: string;
    type?: string;
    description?: string;
    isEnabled: boolean;
    image?: string;
    templateId?: string;
    tags?: string[];
    claims?: IdVPClaimsInterface[];
    configProperties?: IdVPConfigPropertiesInterface[];
}

/**
 * Possible Content Types for IdVP editing tabs.
 */
export enum IdVPEditTabContentType {
    FORM = "form",
    GUIDE = "guide"
}

export enum IdVPEditTabIDs {
    GUIDE = "setup-guide",
    GENERAL = "general",
    SETTINGS = "settings",
    ATTRIBUTES = "attributes"
}

/**
 * Interface to generate a tab in the IdVP editing section.
 */
export interface IdVPEditTabMetadataInterface {
    /**
     * Unique identifier for the tab.
     */
    id: string;
    /**
     * Display name of the tab.
     */
    displayName?: string;
    /**
     * Content Types for current tab.
     */
    contentType?: IdVPEditTabContentType;
    /**
     * Dynamic input fields which should be rendered in the current tab.
     */
    form?: DynamicFormInterface;
    /**
     * Guide content for application editing section.
     */
    guide?: string;
    /**
     * Component IDs that need to be hidden from a predefined tab.
     * This is only effective if the `contentType` is not defined.
     */
    hiddenComponents?: string[];
}

export interface IdVPTemplateMetadataInterface {
    /**
     * Creation related metadata.
     */
    create?: {
        /**
         * Dynamic input fields should be rendered in the create wizard.
         */
        form?: DynamicFormInterface;
        /**
         * IdVP creation guide metadata.
         */
        guide?: string[];
    },
    /**
     * Editing section related metadata.
     */
    edit?: {
        /**
         * The metadata for tabs needs to be rendered on the edit page.
         */
        tabs: IdVPEditTabMetadataInterface[],
        /**
         * Tab id of the default active tab.
         */
        defaultActiveTabId?: string;
    }
};

/**
 * Interface for IdVP template payload.
 */
export interface IdVPTemplateInterface {
    /**
     * Payload of the IdVP creation.
     */
    payload: IdentityVerificationProviderInterface;
}

export interface IdVPTemplateResponseInterface {
    payload: {
        Name: string;
        Type?: string;
        description?: string;
        isEnabled: boolean;
        image?: string;
        templateId?: string;
        claims?: IdVPClaimsInterface[];
        configProperties?: IdVPConfigPropertiesInterface[];
    }
}

export enum IdVPTemplateTags {
    IDENTITY_VERIFICATION = "Identity-Verification"
};

/**
 * Interface for representing the resource endpoints of an identity verification provider.
 */
export interface IdVPResourceEndpointsInterface {
    identityVerificationProviders: string;
    IDVPExtensionEndpoint: string;
}
