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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { DropdownItemProps } from "semantic-ui-react";
import { APIResourceCategories, APIResourcesConstants } from "../constants/api-resources-constants";
import { Property } from "../models/api-resources";

export class APIResourceUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Check whether the API resource read is allowed.
     *
     * @param featureConfig - Feature config.
     * @param allowedScopes - Allowed scopes.
     * @returns True if the API resource read is allowed.
     */
    public static isAPIResourceReadAllowed(featureConfig: FeatureConfigInterface,
        allowedScopes: string): boolean {

        return hasRequiredScopes(featureConfig?.apiResources,
            featureConfig?.apiResources?.scopes?.read, allowedScopes);
    }

    /**
     * Check whether the API resource update is allowed.
     *
     * @param featureConfig - Feature config.
     * @param allowedScopes - Allowed scopes.
     * @returns True if the API resource update is allowed.
     */
    public static isAPIResourceUpdateAllowed(featureConfig: FeatureConfigInterface,
        allowedScopes: string): boolean {

        return hasRequiredScopes(featureConfig?.apiResources,
            featureConfig?.apiResources?.scopes?.update, allowedScopes);
    }

    /**
     * Check whether the API resource create is allowed.
     *
     * @param featureConfig - Feature config.
     * @param allowedScopes - Allowed scopes.
     * @returns True if the API resource create is allowed.
     */
    public static isAPIResourceCreateAllowed(featureConfig: FeatureConfigInterface,
        allowedScopes: string): boolean {

        return hasRequiredScopes(featureConfig?.apiResources,
            featureConfig?.apiResources?.scopes?.create, allowedScopes);
    }

    /**
     * Check whether the API resource delete is allowed.
     *
     * @param featureConfig - Feature config.
     * @param allowedScopes - Allowed scopes.
     * @returns True if the API resource delete is allowed.
     */
    public static isAPIResourceDeleteAllowed(featureConfig: FeatureConfigInterface,
        allowedScopes: string): boolean {

        return hasRequiredScopes(featureConfig?.apiResources,
            featureConfig?.apiResources?.scopes?.delete, allowedScopes);
    }

    /**
     * Check whether the API resource is a system API.
     *
     * @param type - API Resource type.
     * @returns True if the API resource is a system API.
     */
    public static isSystemAPI(type: string): boolean {

        return type !== APIResourcesConstants.BUSINESS && type !== APIResourcesConstants.MCP;
    }

    public static resolveApiResourceGroup = (groupName: string): string => {
        switch (groupName) {
            case APIResourceCategories.TENANT:
                return "Management APIs";
            case APIResourceCategories.ORGANIZATION:
                return "Organization APIs";
            case APIResourceCategories.BUSINESS:
                return "Business APIs";
            case APIResourceCategories.MCP:
                return "MCP (Model Context Protocol) Servers";
            default:
                return groupName;
        }
    };

    public static resolveApiResourceGroupDisplayName = (groupName: string): string => {
        switch (groupName) {
            case APIResourceCategories.ORGANIZATION:
                return "Organization API";
            case APIResourceCategories.TENANT:
                return "Management API";
            case APIResourceCategories.CONSOLE_FEATURE:
                return "Console Feature";
            case APIResourceCategories.BUSINESS:
                return "Business API";
            default:
                return groupName;
        }
    };

    public static resolveApiResourceGroupDescription = (groupName: string): string => {
        switch (groupName) {
            case APIResourceCategories.ORGANIZATION:
                return "extensions:develop.apiResource.organizationAPI.description";
            case APIResourceCategories.TENANT:
                return "extensions:develop.apiResource.managementAPI.description";
            case APIResourceCategories.CONSOLE_FEATURE:
                return "extensions:develop.apiResource.consoleFeature.description";
            case APIResourceCategories.BUSINESS:
                return "extensions:develop.apiResource.businessAPI.description";
            default:
                return groupName;
        }
    };

    /**
     * Checks if the API resource is managed by Choreo.
     *
     * @param properties - API resource properties.
     * @returns - `true` if the API resource is managed by Choreo and `false` otherwise.
     */
    public static checkIfAPIResourcePropertyManaged = (properties: Property[]): boolean => {
        if (properties && properties?.length > 0) {
            const isChoreoAPIProperty: Property =
            properties.find((property: Property) => property?.name === APIResourcesConstants.IS_CHOREO_API);

            return isChoreoAPIProperty ? isChoreoAPIProperty?.value === "true" : false;
        }

        return false;
    };

    public static sortApiResourceTypes = (firstItem: DropdownItemProps, secondItem: DropdownItemProps) => {
        const apiResourceSortingOrder: APIResourceCategories[] = [
            APIResourceCategories.BUSINESS,
            APIResourceCategories.MCP,
            APIResourceCategories.TENANT,
            APIResourceCategories.ORGANIZATION
        ];
        const aIndex: number = apiResourceSortingOrder.indexOf(firstItem?.type);
        const bIndex: number = apiResourceSortingOrder.indexOf(secondItem?.type);

        return (aIndex === -1 ? apiResourceSortingOrder.length : aIndex)
                - (bIndex === -1 ? apiResourceSortingOrder.length : bIndex);
    };
}
