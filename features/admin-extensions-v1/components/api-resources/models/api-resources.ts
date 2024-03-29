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

import { LinkInterface } from "@wso2is/core/models";
import { FunctionComponent, SVGProps } from "react";

/**
 *  Captures API resources list properties.
 */
export interface APIResourcesListInterface {
    /**
     * List of roles in API resources.
     */
    roles?: APIResourceRoleInterface[];
    /**
     * List of API resources.
     */
    apiResources: APIResourceInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}

/**
 *  Basic details of an API resource role
 */
export interface APIResourceRoleInterface {
    /**
     * Name of the API resource role
     */
    name: string,
    /**
     * List of permissions associated with the API resource role
     */
    permissions: APIResourcePermissionInterface[]
}

/**
 *  Details of an API resource
 */
export interface APIResourceInterface {
    /**
     * ID of the API resource
     */
    id?: string;
    /**
     * Display name of the API resource
     */
    displayName: string;
    /**
     * Identifier of the API resource [Usually this is an API endpoint]
     */
    identifier: string;
    /**
     * Required authorization
     */
    requiresAuthorization?: boolean;
    /**
     * Gateway name of the API resource
     */
    gwName?: string;
    /**
     * List of permissions associate with the API resource
     */
    permissions: APIResourcePermissionInterface[],
    /**
     * List of applications associate with the API resource
     */
    applications?: string[];
    /**
     * Subdirectory of the API resource
     */
    self?: string;
}

/**
 *  Basic details of an API resource
 */
export interface BasicAPIResourceInterface {
    /**
     * Display name of the API resource
     */
    displayName: string;
    /**
     * Identifier of the API resource [Usually this is an API endpoint]
     */
    identifier: string;
}

/**
 * Authorization details of an API resource
 */
export interface AuthorizationAPIResourceInterface {
    /**
     * Required authorization
     */
    authorization: boolean;
}

/**
 * Details of an API resource permission
 */
export interface APIResourcePermissionInterface {
    /**
     * id of the API resource permission
     */
    id?: string;
    /**
     * Display name of the API resource permission
     */
    displayName: string;
    /**
     * Name of the API resource role
     */
    name: string;
    /**
     * Description of the API resource permission
     */
    description?: string;
}

/**
 *  Captures body of the updated API resource.
 */
export interface UpdatedAPIResourceInterface {
    /**
     * Display name of the API resource
     */
    displayName?: string;
    /**
     * Identifier of the API resource [Usually this is an API endpoint]
     */
    identifier?: string;
    /**
     * Gateway name of the API resource
     */
    gwName?: string;
    /**
     * List of permissions associate with the API resource
     */
    addedPermissions?: APIResourcePermissionInterface[],
    /**
     * List of permissions that need to remove from the API resource
     */
    deletedPermissions?: string[],
}

/**
 * Captures body of the updated API resource.
 */
export interface GeneralUpdateAPIResourceInterface {
    /**
     * Updated display name of the API resource
     */
    displayName?: string;
    /**
     * Identifier of the API resource [Usually this is an API endpoint]
     */
    identifier?: string;
    /**
     * Gateway name of the API resource
     */
    gwName?: string;
}

/**
 * Captures body of the updated API resource.
 */
export interface GeneralErrorAPIResourceInterface {
    /**
     * Error message of display name of the API resource
     */
    displayName?: string;
    /**
     * Error message of identifier of the API resource
     */
    identifier?: string;
}

/**
 * Captures the common props of the API resource panes.
 */
export interface APIResourcePanesCommonPropsInterface {
    /**
     * List of API Resources
     */
    apiResourceData?: APIResourceInterface;
    /**
     * show if API resources list is still loading
     */
    isAPIResourceDataLoading: boolean;
    /**
     * Specifies if the `APIResourceInterface` is updating.
     */
    isSubmitting?: boolean;
    /**
     * Specifies if the API resource is read only.
     */
    isReadOnly?: boolean;
    /**
     * Specifies if the API resource is managed by Choreo.
     */
    isManagedByChoreo?: boolean;
    /**
     * Function to handle the API resource update.
     */
    handleUpdateAPIResource?: (updatedAPIResource: UpdatedAPIResourceInterface, callback?: () => void) => void;
}

/**
 * Enum for wizard steps form types.
 */
export enum AddAPIResourceWizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    AUTHORIZATION = "Authorization",
    PERMISSIONS= "Permission",
}

/**
 * Captures the parameters of the steps of the API resource wizard.
 */
export interface APIResourceWizardStepInterface {
    /**
     * Content of the step.
     */
    content: JSX.Element,
    /**
     * Icon of the step.
     */
    icon: FunctionComponent<SVGProps<SVGSVGElement>>,
    /**
     * Title of the step.
     */
    title: string
    /**
     * Add API resource wizard steps form type of the step.
     */
    addAPIResourceWizardStepsFormType: AddAPIResourceWizardStepsFormTypes
}
/**
 * Capture the parameters of the components of `AddAPIResourcePermissions`
 */
export interface PermissionMappingInterface {
    /**
     * List of API resource permissions
     */
    addedPermissions: Map<string,APIResourcePermissionInterface>;
    /**
     * Update the permissions map
     */
    updatePermissions: (permission: APIResourcePermissionInterface, action : "set" | "delete") => void
}
