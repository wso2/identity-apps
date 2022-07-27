/**
* Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { OrganizationManagementConstants } from "../constants";

export const addOrganizationMockResponse = {
    attributes: [],
    created: "2022-01-01T00:00:00.000Z",
    description: "This is a test organization.",
    domain: "organization.one",
    id: "organization-one",
    lastModified: "2022-01-01T00:00:00.000Z",
    name: "Organization One",
    parent: {
        id: OrganizationManagementConstants.ROOT_ORGANIZATION_ID,
        ref: "root/ref"
    },
    status: "ACTIVE",
    type: "TENANT"
};

export const getOrganizationsFilterMockResponse = {
    links: [ {
        href: "org.url?after=organization-two",
        rel: "next"
    } ],
    organizations: [
        {
            id: "organization-one",
            name: "Organization One",
            ref: "organizations-one"
        }
    ]
};

export const getOrganizationsOneMockResponse = {
    links: [ {
        href: "org.url?before=organization-two",
        rel: "previous"
    } ],
    organizations: [
        {
            id: "organization-two",
            name: "Organization Two",
            ref: "organizations-two"
        }
    ]
};

export const getOrganizationsTwoMockResponse = {
    links: [ ],
    organizations: [
        {
            id: "organization-three",
            name: "Organization Three",
            ref: "organizations-three"
        }
    ]
};

export const getOrganizationsEmptyMockResponse = {
    links: [],
    organizations: []
};

export const getOrganizationsPageOneMockResponse = {
    links: [ {
        href: "org.url?after=organization-two",
        rel: "next"
    } ],
    organizations: [
        {
            id: "organization-one",
            name: "Organization One",
            ref: "organizations-one"
        } ,
        {
            id: "organization-two",
            name: "Organization Two",
            ref: "organizations-two"
        },
        {
            id: "organization-three",
            name: "Organization Three",
            ref: "organizations-three"
        },
        {
            id: "organization-four",
            name: "Organization Four",
            ref: "organizations-four"
        },
        {
            id: "organization-five",
            name: "Organization Five",
            ref: "organizations-five"
        },
        {
            id: "organization-six",
            name: "Organization Six",
            ref: "organizations-six"
        },
        {
            id: "organization-seven",
            name: "Organization Seven",
            ref: "organizations-seven"
        }
    ]
};

export const organizationTwoMockResponse = {
    attributes: [],
    created: "2022-01-01T00:00:00.000Z",
    description: "This is a test organization.",
    domain: "organization.two",
    id: "organization-two",
    lastModified: "2022-01-01T00:00:00.000Z",
    name: "Organization Two",
    parent: {
        id: "organization-one",
        ref: "root/ref"
    },
    status: "ACTIVE",
    type: "TENANT"
};

export const organizationThreeMockResponse = {
    attributes: [],
    created: "2022-01-01T00:00:00.000Z",
    description: "This is a test organization.",
    domain: "organization.three",
    id: "organization-three",
    lastModified: "2022-01-01T00:00:00.000Z",
    name: "Organization Three",
    parent: {
        id: "organization-two",
        ref: "root/ref"
    },
    status: "ACTIVE",
    type: "TENANT"
};
