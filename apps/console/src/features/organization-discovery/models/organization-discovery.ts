/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

export interface OrganizationInterface {
    id: string;
    name: string;
    ref: string;
    status: "ACTIVE" | "DISABLED"
}

export interface OrganizationDiscoveryConfigInterface {
    properties: OrganizationDiscoveryConfigPropertyInterface[];
}

export interface OrganizationDiscoveryInterface {
    organizationId: string;
    organizationName: string;
    attributes: OrganizationDiscoveryAttributesInterface[];
}

export interface OrganizationDiscoveryAttributeDataInterface {
    attributes: OrganizationDiscoveryAttributesInterface[];
}

export interface OrganizationLinkInterface {
    href: string;
    rel: string;
}

export interface OrganizationListInterface {
    links: OrganizationLinkInterface[];
    organizations: OrganizationInterface[];
}

export interface OrganizationListWithDiscoveryInterface {
    links: OrganizationLinkInterface[];
    organizations: OrganizationDiscoveryInterface[];
}

export interface OrganizationAttributesInterface {
    key: string;
    value: string;
}

export interface OrganizationDiscoveryConfigPropertyInterface {
    key: string;
    value: boolean;
}

export interface OrganizationDiscoveryAttributesInterface {
    type: string;
    values: Array<string>;
}

export interface OrganizationResponseInterface {
    id: string;
    name: string;
    description: string;
    status: string;
    created: string;
    lastModified: string;
    type: string;
    domain: string;
    parent: {
        id: string;
        ref: string;
    };
    attributes: OrganizationAttributesInterface[];
}
