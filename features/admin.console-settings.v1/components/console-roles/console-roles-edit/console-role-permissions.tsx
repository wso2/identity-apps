/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
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
import flatMap from "lodash-es/flatMap";
import fromPairs from "lodash-es/fromPairs";
import isEmpty from "lodash-es/isEmpty";
import mapValues from "lodash-es/mapValues";
import omit from "lodash-es/omit";
import values from "lodash-es/values";
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
import getEligibilityScopeNames from "../../../utils/get-eligibility-scope-names";
import isPermissionLevelActionable from "../../../utils/is-permission-level-actionable";
import transformResourceCollectionToPermissions from "../../../utils/transform-resource-collection-to-permissions";
import CreateConsoleRoleWizardPermissionsForm from
    "../create-console-role-wizard/create-console-role-wizard-permissions-form";

/**
 * Props interface of {@link ConsoleRolePermissions}
 */
interface ConsoleRolePermissionsProps extends LoadableComponentInterface, IdentifiableComponentInterface {
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

    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.consoleSettings?.disabledFeatures);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const enabledFeatureOverridesInConsoleRolePermissions: string[] = useSelector(
        (state: AppState) => state.config.ui.enabledFeatureOverridesInConsoleRolePermissions);

    /**
     * Switches the permissions evaluation between the legacy and the granular mode.
     */
    const useGranularConsolePermissions: boolean = !disabledFeatures?.includes(
        ConsoleRolesOnboardingConstants.GRANULAR_CONSOLE_PERMISSIONS_FEATURE_KEY);
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

    const flattenedFeatureConfig: FeatureConfigInterface = useMemo(() => {
        const topLevelFeatures: Record<string, Omit<FeatureAccessConfigInterface, "subFeatures">> = mapValues(
            featureConfig,
            (feature: FeatureAccessConfigInterface) => omit(feature, [ "subFeatures" ])
        );

        const subLevelFeatures: Record<string, Omit<FeatureAccessConfigInterface, "subFeatures">> = fromPairs(
            flatMap(values(featureConfig), (feature: FeatureAccessConfigInterface) => {
                return Object.entries(feature.subFeatures || {});
            })
        );

        return {
            ...topLevelFeatures,
            ...subLevelFeatures
        } as FeatureConfigInterface;
    }, [ featureConfig ]);

    const filteredTenantAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!tenantAPIResourceCollections) {
            return null;
        }

        const filteringAPIResourceCollectionNames: string[] = [];

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        const clonedTenantAPIResourceCollections: APIResourceCollectionResponseInterface =
            cloneDeep(tenantAPIResourceCollections);

        clonedTenantAPIResourceCollections.apiResourceCollections =
            clonedTenantAPIResourceCollections?.apiResourceCollections?.filter(
                (item: APIResourceCollectionInterface) =>
                    !filteringAPIResourceCollectionNames.includes(item?.name) &&
                    (!useGranularConsolePermissions || (
                        enabledFeatureOverridesInConsoleRolePermissions?.includes(item?.name)
                        || flattenedFeatureConfig?.[item?.name]?.enabled
                        || flattenedFeatureConfig?.[UIConstants.CONSOLE_FEATURE_MAP[item?.name]]?.enabled
                    ))
            );

        return clonedTenantAPIResourceCollections;
    }, [ tenantAPIResourceCollections, flattenedFeatureConfig, enabledFeatureOverridesInConsoleRolePermissions,
        useGranularConsolePermissions ]);

    const filteredOrganizationAPIResourceCollections: APIResourceCollectionResponseInterface = useMemo(() => {

        if (!organizationAPIResourceCollections) {
            return null;
        }

        const filteringAPIResourceCollectionNames: string[] = [];

        filteringAPIResourceCollectionNames.push(
            ConsoleRolesOnboardingConstants.ORG_ROLE_V1_API_RESOURCES_COLLECTION_NAME);

        const clonedOrganizationAPIResourceCollections: APIResourceCollectionResponseInterface =
            cloneDeep(organizationAPIResourceCollections);

        clonedOrganizationAPIResourceCollections.apiResourceCollections =
            clonedOrganizationAPIResourceCollections?.apiResourceCollections?.filter(
                (item: APIResourceCollectionInterface) => {
                    const itemName: string = item?.name ?? "";
                    const featureNameWithoutOrgPrefix: string = itemName.startsWith(
                        ConsoleRolesOnboardingConstants.ORG_PREFIX)
                        ? itemName.substring(ConsoleRolesOnboardingConstants.ORG_PREFIX.length)
                        : itemName;

                    return !filteringAPIResourceCollectionNames.includes(itemName) &&
                        (!useGranularConsolePermissions || (
                            enabledFeatureOverridesInConsoleRolePermissions?.includes(featureNameWithoutOrgPrefix)
                            || flattenedFeatureConfig?.[featureNameWithoutOrgPrefix]?.enabled
                            || flattenedFeatureConfig?.[UIConstants.CONSOLE_FEATURE_MAP[
                                featureNameWithoutOrgPrefix]]?.enabled
                        ));
                }
            );

        return clonedOrganizationAPIResourceCollections;
    }, [ organizationAPIResourceCollections, flattenedFeatureConfig, enabledFeatureOverridesInConsoleRolePermissions,
        useGranularConsolePermissions ]);

    /**
     * Extracts all scope names from a permission-category array.
     * Returns an empty array when the category array is absent or empty.
     */
    const extractScopeNames = (
        categories: APIResourceCollectionPermissionCategoryInterface[] | undefined
    ): string[] => {
        if (!categories || categories.length === 0) {
            return [];
        }

        return categories.flatMap(
            (resource: APIResourceCollectionPermissionCategoryInterface) =>
                resource.scopes.map((scope: APIResourceCollectionPermissionScopeInterface) => scope.name)
        );
    };

    /**
     * Checks whether every scope in `categories` appears in `selectedFeatures`.
     * An empty (or absent) category is treated as "not selected".
     *
     * In granular mode (`useEligibilityScopes`), the per-action feature scopes
     * (`console:<feature>_create/_update/_delete`) are dropped from the check so a level backed
     * by the same management scope as another (e.g. Branding's create/update/delete, all resolving
     * to `internal_branding_preference_update`) is reported as selected whenever that shared scope
     * is granted — keeping the loaded role's checkbox state consistent with the live form. The
     * legacy read/write path keeps evaluating the raw scope names.
     */
    const allScopesSelected = (
        categories: APIResourceCollectionPermissionCategoryInterface[] | undefined,
        selectedFeatures: string[],
        useEligibilityScopes: boolean = false
    ): boolean => {
        const names: string[] = useEligibilityScopes
            ? getEligibilityScopeNames(extractScopeNames(categories))
            : extractScopeNames(categories);

        return names.length > 0 && names.every((name: string) => selectedFeatures.includes(name));
    };

    /**
     * Process the collection and return the selected permissions.
     *
     * Legacy mode  (useGranularConsolePermissions === false):
     *   Evaluates `read` and `write` categories. If `write` is fully covered it takes
     *   precedence — `read` is then marked false and only write scopes are stored.
     *
     * Granular mode (useGranularConsolePermissions === true):
     *   Evaluates `read`, `create`, `update`, and `delete` independently.
     *   The `write` field from the API response is ignored entirely.
     *   Each flag is set to `true` only when all of its scopes are present in the role.
     *   Any combination of flags is valid; there is no precedence between them.
     *
     * @param collection - API resource collection.
     * @param selectedFeatures - Scope names already assigned to the role.
     * @returns Populated SelectedPermissionCategoryInterface, or null if nothing is selected.
     */
    const processCollection = (
        collection: APIResourceCollectionInterface,
        selectedFeatures: string[]
    ): SelectedPermissionCategoryInterface | null => {
        if (useGranularConsolePermissions) {
            // Granular mode. Evaluate eligibility on the management scopes, ignoring the per-action
            // feature scopes, so levels resolving to the same management scope load together.
            //
            // A create / update / delete level that carries no action scope of its own (only its
            // per-action feature scope — e.g. Approvals) is not actionable: its cell is read-only in
            // the form, so it must never be reported as selected here. Gate each write level on
            // `isPermissionLevelActionable` before testing its scopes, otherwise — because the bucket
            // is a cumulative superset of read and the feature scope is stripped by the eligibility
            // check — it would falsely light up whenever read is granted. `read` is always actionable.
            const hasRead: boolean = allScopesSelected(collection.apiResources.read, selectedFeatures, true);
            const hasCreate: boolean = isPermissionLevelActionable(collection, "create")
                && allScopesSelected(collection.apiResources.create, selectedFeatures, true);
            const hasUpdate: boolean = isPermissionLevelActionable(collection, "update")
                && allScopesSelected(collection.apiResources.update, selectedFeatures, true);
            const hasDelete: boolean = isPermissionLevelActionable(collection, "delete")
                && allScopesSelected(collection.apiResources.delete, selectedFeatures, true);

            if (!hasRead && !hasCreate && !hasUpdate && !hasDelete) {
                return null;
            }

            // Collect scopes for every checked level and deduplicate.
            const activeCategories: APIResourceCollectionPermissionCategoryInterface[] = [
                ...(hasRead ? (collection.apiResources.read ?? []) : []),
                ...(hasCreate ? (collection.apiResources.create ?? []) : []),
                ...(hasUpdate ? (collection.apiResources.update ?? []) : []),
                ...(hasDelete ? (collection.apiResources.delete ?? []) : [])
            ];

            return {
                create: hasCreate,
                delete: hasDelete,
                permissions: transformResourceCollectionToPermissions(activeCategories),
                read: hasRead,
                update: hasUpdate,
                write: false
            };
        }

        // Legacy mode.
        const hasReadPermission: boolean = allScopesSelected(collection.apiResources.read, selectedFeatures);
        const hasWritePermission: boolean = allScopesSelected(collection.apiResources.write, selectedFeatures);

        if (!hasReadPermission && !hasWritePermission) {
            return null;
        }

        const legacyCategories: APIResourceCollectionPermissionCategoryInterface[] =
            (hasWritePermission ? collection.apiResources.write : undefined) ?? collection.apiResources.read;

        return {
            permissions: transformResourceCollectionToPermissions(legacyCategories),
            read: !hasWritePermission && hasReadPermission,
            write: hasWritePermission
        };
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
    }, [ role, filteredTenantAPIResourceCollections, filteredOrganizationAPIResourceCollections,
        useGranularConsolePermissions ]);

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
