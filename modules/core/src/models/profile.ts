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

import { RolesMemberInterface } from "./roles";

/**
 * Multi-valued attribute schema
 */
export interface MultiValueAttributeInterface {
    /**
     * Attribute type
     */
    type: string;
    /**
     * Attribute value
     */
    value: string;
}

/**
 * Name attribute schema
 */
export interface NameInterface {
    /**
     * User's first name
     */
    givenName: string;
    /**
     * User's surname
     */
    familyName: string;
}

/**
 * Profile information schema
 */
export interface ProfileInfoInterface {
    /**
     * Emails ex.work, mobile
     */
     active?: boolean;
    /**
     * Emails ex.work, mobile
     */
    emails: string[] | MultiValueAttributeInterface[];
    /**
     * Default email address of the user.
     */
    email?: string;
    /**
     * Phone numbers associated to the user.
     */
    phoneNumbers?: MultiValueAttributeInterface[];
    /**
     * Organisation set in the profile.
     */
    organisation?: string;
    /**
     * Response status of the profile info API call.
     */
    responseStatus?: number;
    /**
     * Roles assigned to the user.
     */
    roles?: RolesMemberInterface[];
    /**
     * Name of the user.
     */
    name: NameInterface;
    /**
     * Profile image URL.
     */
    profileUrl?: string;
    /**
     * User image of the user.
     */
    userImage?: string;
    /**
     * Username of the user.
     */
    userName: string;
    /**
     * Any key value pair.
     */
    [key: string]: any;
}

/**
 * Linked account interface.
 */
export interface LinkedAccountInterface {
    /**
     * Associated user's email address.
     */
    email: string;
    /**
     * Associated user's last name.
     */
    lastName: string;
    /**
     * Tenant domain.
     */
    tenantDomain: string;
    /**
     * ID of the associated user.
     */
    userId: string;
    /**
     * User store domain.
     */
    userStoreDomain: string;
    /**
     * Username of the associated user.
     */
    username: string;
}

/**
 * Profile schema interface.
 */
export interface ProfileSchemaInterface {
    /**
     * Claim value.
     */
    claimValue: string;
    /**
     * Flag for uniqueness.
     */
    uniqueness: string;
    /**
     * Display name of the attribute.
     */
    displayName: string;
    /**
     * Name of the attribute.
     */
    name: string;
    /**
     * Order to display.
     */
    displayOrder: string;
    /**
     * Description of the attribute.
     */
    description: string;
    /**
     * Flag to set mutability.
     */
    mutability: string;
    /**
     * Type of the attribute.
     */
    type: string;
    /**
     * Flag to set if the attribute is multivalued.
     */
    multiValued: boolean;
    /**
     * Flag to set if the text case should be exact or not.
     */
    caseExact: boolean;
    /**
     * Returned type ex. DEFAULT
     */
    returned: string;
    /**
     * Flag to set if the attribute is required.
     */
    required: boolean;
    /**
     * Array of sub attributes.
     */
    subAttributes?: ProfileSchemaInterface[];
    /**
     * Flag to set if the attribute is extended.
     */
    extended?: boolean;
    /**
     * Store ID to identify schema of the attribute
     */
    schemaId?: string;
    /**
     * Regular expression to validate field.
     */
    regEx?: string;
}

/**
 * Empty profile info object.
 *
 * @return {ProfileInfoInterface}
 */
export const emptyProfileInfo = (): ProfileInfoInterface => ({
    email: "",
    emails: [],
    isSecurity: false,
    name: { givenName: "", familyName: "" },
    organisation: "",
    phoneNumbers: [],
    profileUrl: "",
    responseStatus: null,
    roles: [],
    userImage: "",
    userName: ""
});

/**
 * Fallback types for gravatar images.
 */
export type GravatarFallbackTypes =
    "404"
    | "default"
    | "mp"
    | "identicon"
    | "monsterid"
    | "wavatar"
    | "retro"
    | "robohash"
    | "blank";

/**
 * Configuration for Gravatar.
 */
export interface GravatarConfig {
    /**
     * Image Sizee.
     */
    size?: number;
    /**
     * Custom fallback image URL.
     */
    defaultImage?: string;
    /**
     * Fallback types.
     */
    fallback?: GravatarFallbackTypes;
}
