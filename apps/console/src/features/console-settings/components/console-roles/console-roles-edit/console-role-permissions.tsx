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
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateRoleDetails } from "../../../../roles/api/roles";
import { Schemas } from "../../../../roles/constants/role-constants";
import { CreateRolePermissionInterface, PatchRoleDataInterface } from "../../../../roles/models/roles";
import useGetAPIResourceCollections from "../../../api/use-get-api-resource-collections";
import {
    APIResourceCollectionInterface,
    APIResourceCollectionPermissionCategoryInterface,
    APIResourceCollectionPermissionScopeInterface
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

    const { data: tenantAPIResourceCollections } = useGetAPIResourceCollections(true, "type eq tenant", "apiResources");

    const { data: organizationAPIResourceCollections } = useGetAPIResourceCollections(
        true,
        "type eq organization",
        "apiResources"
    );

    const [ permissions, setPermissions ] = useState<CreateRolePermissionInterface[]>(undefined);

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

        const hasReadPermissions: boolean = readPermissions.every((scope: string) =>
            selectedFeatures.includes(scope)
        );
        const hasWritePermissions: boolean = writePermissions.every((scope: string) =>
            selectedFeatures.includes(scope)
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

        tenantAPIResourceCollections?.apiResourceCollections?.forEach((collection: APIResourceCollectionInterface) => {
            const processedCollection: SelectedPermissionCategoryInterface = processCollection(
                collection,
                selectedFeatures
            );

            if (processedCollection) {
                permissions.tenant[collection.id] = processedCollection;
            }
        });

        organizationAPIResourceCollections?.apiResourceCollections?.forEach(
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
    }, [ role, tenantAPIResourceCollections, organizationAPIResourceCollections ]);

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
                        description: t("console:manage.features.roles.notifications.updateRole.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.roles.notifications.updateRole.success.message")
                    })
                );
            })
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.roles.notifications.updateRole.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.updateRole.genericError.message")
                    })
                );
            });
    };

    return (
        <EmphasizedSegment padded="very" className="console-role-permissions">
            <div className="section-heading">
                <Heading as="h4">
                    { t("console:manage.features.roles.edit.permissions.heading") }
                </Heading>
                <Heading as="h6" color="grey" subHeading>
                    {
                        isReadOnly
                            ? t("console:manage.features.roles.edit.permissions.readOnlySubHeading")
                            : t("console:manage.features.roles.edit.permissions.subHeading")
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
