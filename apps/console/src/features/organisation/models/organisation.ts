/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable sort-keys */
/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { LinkInterface, NameInterface } from "@wso2is/core/models";

/**
 * Captures meta details of the user.
 */
export interface OrganisationMetaInterface {
    created: string;
    location: string;
    lastModified: string;
    resourceType: string;
}

/**
 *  Captures the basic details of the user.
 */
export interface OrganisationBasicInterface {
    id: string;
    name: string;
    organisationName: string;
    parentOrganisationName: string;
    meta: OrganisationMetaInterface;
    organisationStatus: string;
    certifiedUserLogin: string;
    displayName?: string;
    userName?: string;
    userType?: string;  
}


/**
 *  Captures the basic details of the user.
 */
export interface AttributeInterface {
    key: string;
    value: string;
}

/**
 *  Captures application list properties.
 */
export interface UserListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of applications.
     */
    Resources?: OrganisationBasicInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];

    displayName?: string;
}

export interface OrganisationListInterface {
    /**
     * Number of results that match the listing operation.
     */
    limit?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    offset?: number;
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of applications.
     */
    Resources?: OrganisationBasicInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];

    length?: number;

    /**
     * organisation attributes.
     */
    attributes?: AttributeInterface[];
}

/**
 * Basic user details for add user wizard
 */
export interface AddOrganizationDetails {
    name: string;
    displayName: string;
    Type: string;
    status: string;
    description: string;
    country: string;
    segment: string;
    locale: string;
    source?: string;
    parentId: string;
}

/**
 * Basic user details for add user wizard
 */
export interface BasicUserOptional {
    department: string;
    employeeNumber: string;
    manager: string;
    costCenter: string;
    streetAddress: string;
    locality: string;
    postalCode: string;
    // region: string;
    title: string;
    userType: string;
}

/**
 *  User details for add user wizard.
 */
export interface AddUserWizardStateInterface {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    newPassword: string;
    confirmPassword: string;
    passwordOption: string;
    phoneWork: string;
    phoneMobile: string;
    country: string;
    organization: string;
    title: string;
    userRole: string;
    userType: string;
    previousEmailAddress: string;
    preferredLanguage: string;
    department: string;
    employeeNumber: string;
    timezone: string;
    manager: string;
    costCenter: string;
    activeStartDate: string;
    welcomeEmail: string;
    streetAddress: string;
    locality: string;
    postalCode: string;
    // region: string;
    displayName: string;
    emailotp_disabled: string;
    smsotp_disabled: string;
    status: string;
    
}

/**
 * Interface for emails in user details
 */
export interface EmailsInterface {
    primary: boolean;
    value: string;
    type: string;
}

/**
 * Interface for Phone in user details
 */
export interface PhoneInterface {
    value: string;
    type: string;
}

/**
 * Interface for Address in user details
 */
export interface AddressInterface {
    country: string;
    postalCode: string;
    locality: string;
    streetAddress: string;
    // region: string;
}

/**
 * Interface for Manager in user details
 */
export interface ManagerInterface {
    displayName: string;
}

/**
 * Captures user details
 */
export interface UserDetailsInterface {
    emails: EmailsInterface[];
    phoneNumbers: PhoneInterface[];
    name: NameInterface;
    userName: string;
    password: string;
    timezone: string;
    title: string;
    welcomeEmail: string;
    displayName: string;
    preferredLanguage: string;
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"?: {
        askPassword: string;
        country: string;
        organization: string;
        userRole: string;
        department: string;
        employeeNumber: string;
        costCenter: string;
        addresses: AddressInterface;
        emailotp_disabled: string;
        smsotp_disabled: string;
        activeStartDate: string;
        manager: ManagerInterface;
    };
    // profileUrl: string;
    status: string;
    userType: string;
}

/**
 * The following function creates an empty user details object
 */
export const createEmptyUserDetails = (): UserDetailsInterface => ({
    emails: [{
        primary: true,
        value: "",
        type: "work"
    },{
        primary: false,
        value: "",
        type: "other"
    }],
    phoneNumbers: [
        {
          value: "",
          type: "work"
        },
        {
          value: "",
          type: "mobile"
        }
      ],
    name: {
        familyName: "",
        givenName: ""
    },
    password: "",
    title: "",
    preferredLanguage: "",
    timezone: "",
    // profileUrl: "",
    welcomeEmail: "",
    displayName: "",
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
        askPassword: "",
        country: "",
        organization: "",
        userRole: "",
        department: "",
        employeeNumber: "",
        costCenter: "",
        emailotp_disabled: "",
        smsotp_disabled: "",
        activeStartDate: "",
        manager:{
            displayName: ""
        },
        addresses: {
            country: "",
            postalCode: "",
            locality: "",
            streetAddress: ""
            // region: ""
        }
    },
    userName: "",
    status: "",
    userType: ""
});

/**
 * The following function creates an empty add user wizard object
 */
export const createEmptyUserBasicWizard = (): AddUserWizardStateInterface => ({
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    newPassword: "",
    passwordOption: "",
    phoneWork: "",
    phoneMobile: "",
    country: "",
    organization: "",
    title: "",
    userRole: "",
    userType: "",
    preferredLanguage:"",
    department: "",
    previousEmailAddress: "",
    emailotp_disabled: "",
    smsotp_disabled: "",
    employeeNumber: "",
    timezone: "",
    manager: "",
    costCenter: "",
    activeStartDate: "",
    streetAddress: "",
    locality: "",
    postalCode: "",
    displayName: "",
    welcomeEmail: "",
    status: "",
    userName: ""
});
