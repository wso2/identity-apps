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

import { AppState } from "@wso2is/admin.core.v1/store";
import { updateRoleDetails } from "@wso2is/admin.roles.v2/api/roles";
import { Schemas } from "@wso2is/admin.roles.v2/constants/role-constants";
import { CreateRolePermissionInterface, PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    RolePermissionInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmphasizedSegment,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetAPIResourceCollections from "../../../api/use-get-api-resource-collections";
import { ConsoleRolesOnboardingConstants } from "../../../constants/console-roles-onboarding-constants";
import {
    APIResourceCollectionInterface,
    APIResourceCollectionPermissionCategoryInterface,
    APIResourceCollectionPermissionScopeInterface,
    APIResourceCollectionResponseInterface
} from "../../../models/console-roles";
import { SelectedPermissionCategoryInterface, SelectedPermissionsInterface } from "../../../models/permissions-ui";
import transformResourceCollectionToPermissions from "../../../utils/transform-resource-collection-to-permissions";
import CreateConsoleRoleWizardPermissionsForm from
    "../create-console-role-wizard/create-console-role-wizard-permissions-form";

/**
 * Props interface of {@link ConsoleRolePermissions}
 */
export interface ConsoleRolePermissionsProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Is read only.
     */
    isReadOnly?: boolean;
    /**
     * Whether the organization is a sub organization or not.
     */
    isSubOrganization?: boolean;
    /**
     * All the details about the role.
     */
    role: RolesInterface;
    /**
     * Handle role update callback.
     */
    onRoleUpdate: (activeTabIndex: number) => void;
    /**
     * Tab index
     */
    tabIndex: number;
}

/**
 * Component to render the tenant & organization permission trees.
 *
 * @param props - Props injected to the component.
 * @returns ConsoleRolePermissions component.
 */
const ConsoleRolePermissions: FunctionComponent<ConsoleRolePermissionsProps> = (
    props: ConsoleRolePermissionsProps
): ReactElement => {
    const {
        isReadOnly,
        role,
        onRoleUpdate,
        tabIndex,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const { data: tenantAPIResourceCollections } = useGetAPIResourceCollections(
        true,
        "type eq tenant",
        "apiResources"
    );

    const { data: organizationAPIResourceCollections } = useGetAPIResourceCollections(
        true,
        "type eq organization",
        "apiResources"
    );

    const [ permissions, setPermissions ] = useState<CreateRolePermissionInterface[]>(undefined);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const filteredTenantAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!tenantAPIResourceCollections) {
            return null;
        }

        const clonedTenantAPIResourceCollections: APIResourceCollectionResponseInterface =
            cloneDeep(tenantAPIResourceCollections);
        const filteringAPIResourceCollectionNames: string[] = [];

        if(!userRolesV3FeatureEnabled) {
            filteringAPIResourceCollectionNames.push(
                ConsoleRolesOnboardingConstants.ROLE_ASSIGNMENTS_ROLE_ID);
        }

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        clonedTenantAPIResourceCollections.apiResourceCollections =
                clonedTenantAPIResourceCollections?.apiResourceCollections?.filter(
                    (item: APIResourceCollectionInterface) =>
                        !filteringAPIResourceCollectionNames.includes(item?.name)
                );

        return clonedTenantAPIResourceCollections;
    }, [ tenantAPIResourceCollections ]);

    const filteredOrganizationAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!organizationAPIResourceCollections) {
            return null;
        }

        const clonedOrganizationAPIResourceCollections: APIResourceCollectionResponseInterface =
            cloneDeep(organizationAPIResourceCollections);
        const filteringAPIResourceCollectionNames: string[] = [];

        if(!userRolesV3FeatureEnabled) {
            filteringAPIResourceCollectionNames.push(
                ConsoleRolesOnboardingConstants.ORG_ROLE_ASSIGNMENTS_ROLE_ID);

        }

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ORG_ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        clonedOrganizationAPIResourceCollections.apiResourceCollections =
                clonedOrganizationAPIResourceCollections?.apiResourceCollections?.filter(
                    (item: APIResourceCollectionInterface) =>
                        !filteringAPIResourceCollectionNames.includes(item?.name)
                );

        return clonedOrganizationAPIResourceCollections;
    }, [ organizationAPIResourceCollections ]);

    /**
     * Process the collection and return the selected permissions.
     *
     * @param collection - API resource collection.
     * @param selectedFeatures - Selected features.
     * @returns Selected permissions.
     */
    const processCollection = (
        collection: APIResourceCollectionInterface,
        selectedFeatures: string[]
    ): SelectedPermissionCategoryInterface | null => {
        const readPermissions: string[] = collection.apiResources.read.flatMap(
            (resource: APIResourceCollectionPermissionCategoryInterface) =>
                resource.scopes.map((scope: APIResourceCollectionPermissionScopeInterface) => scope.name)
        );

        const writePermissions: string[] = collection.apiResources.write.flatMap(
            (resource: APIResourceCollectionPermissionCategoryInterface) =>
                resource.scopes.map((scope: APIResourceCollectionPermissionScopeInterface) => scope.name)
        );

        const hasReadPermissions: boolean = readPermissions.every((permission: string) =>
            selectedFeatures.includes(permission)
        );
        const hasWritePermissions: boolean = writePermissions.every((permission: string) =>
            selectedFeatures.includes(permission)
        );

        if (hasReadPermissions || hasWritePermissions) {
            return {
                permissions: transformResourceCollectionToPermissions(
                    collection.apiResources[hasWritePermissions ? "write" : "read"]
                ),
                read: hasWritePermissions ? false : hasReadPermissions,
                write: hasWritePermissions
            };
        }

        return null;
    };

    /**
     * Initial values for the permission form.
     */
    const permissionFormInitialValues: SelectedPermissionsInterface = useMemo(() => {
        const selectedFeatures: string[] = (role?.permissions as RolePermissionInterface[])?.map(
            (permission: RolePermissionInterface) => {
                return permission.value;
            }
        );

        const permissions: SelectedPermissionsInterface = {
            organization: {},
            tenant: {}
        };

        filteredTenantAPIResourceCollections?.apiResourceCollections?.forEach(
            (collection: APIResourceCollectionInterface) => {
                const processedCollection: SelectedPermissionCategoryInterface = processCollection(
                    collection,
                    selectedFeatures
                );

                if (processedCollection) {
                    permissions.tenant[collection.id] = processedCollection;
                }
            }
        );

        filteredOrganizationAPIResourceCollections?.apiResourceCollections?.forEach(
            (collection: APIResourceCollectionInterface) => {
                const processedCollection: SelectedPermissionCategoryInterface = processCollection(
                    collection,
                    selectedFeatures
                );

                if (processedCollection) {
                    permissions.organization[collection.id] = processedCollection;
                }
            }
        );

        return permissions;
    }, [ role, filteredTenantAPIResourceCollections, filteredOrganizationAPIResourceCollections ]);

    /**
     * Update the role permissions.
     *
     * @param permissions - Permissions to be updated.
     */
    const updateRolePermissions = (permissions: CreateRolePermissionInterface[]): void => {
        const _permissions: CreateRolePermissionInterface[] | RolePermissionInterface[] =
            permissions ?? (role?.permissions as RolePermissionInterface[]);

        const roleData: PatchRoleDataInterface = {
            Operations: [
                {
                    op: "replace",
                    value: {
                        permissions: _permissions?.map(
                            (permission: CreateRolePermissionInterface | RolePermissionInterface) => {
                                return {
                                    value: permission.value
                                };
                            }
                        )
                    }
                }
            ],
            schemas: [ Schemas.PATCH_OP ]
        };

        updateRoleDetails(role.id, roleData)
            .then(() => {
                onRoleUpdate(tabIndex);

                dispatch(
                    addAlert<AlertInterface>({
                        description: t("roles:notifications.updateRole.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("roles:notifications.updateRole.success.message")
                    })
                );
            })
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "roles:notifications.updateRole.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.updateRole.genericError.message")
                    })
                );
            });
    };

    return (
        <EmphasizedSegment padded="very" className="console-role-permissions">
            <div className="section-heading">
                <Heading as="h4">
                    { t("roles:edit.permissions.heading") }
                </Heading>
                <Heading as="h6" color="grey" subHeading>
                    {
                        isReadOnly
                            ? t("roles:edit.permissions.readOnlySubHeading")
                            : t("roles:edit.permissions.subHeading")
                    }
                </Heading>
            </div>
            <CreateConsoleRoleWizardPermissionsForm
                defaultExpandedIfPermissionsAreSelected
                isReadOnly={ isReadOnly }
                initialValues={ permissionFormInitialValues }
                onPermissionsChange={ setPermissions }
            />
            {
                !isReadOnly && (
                    <PrimaryButton
                        className="submit-button"
                        variant="contained"
                        size="small"
                        loading={ false }
                        disabled={ isEmpty(role?.permissions) || (permissions && isEmpty(permissions)) }
                        onClick={ () => {
                            updateRolePermissions(permissions);
                        } }
                        data-componentid={ `${ componentId }-update-button` }
                    >
                        { t("common:update") }
                    </PrimaryButton>
                )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for {@link ConsoleRolePermissions}
 */
ConsoleRolePermissions.defaultProps = {
    "data-componentid": "console-roles-table"
};

export default ConsoleRolePermissions;
