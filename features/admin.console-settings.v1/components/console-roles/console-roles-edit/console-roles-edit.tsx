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

import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { FeatureStatus, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { useOrganizationConfigV2 } from "@wso2is/admin.administrators.v1/api/useOrganizationConfigV2";
import { UseOrganizationConfigType } from "@wso2is/admin.administrators.v1/models";
import { AppState, OrganizationType, store } from "@wso2is/admin.core.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { BasicRoleDetails } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-basic";
import { RoleConnectedApps } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-connected-apps";
import { RoleGroupsList } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-groups";
import { RoleUsersList } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-users";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RoleConstants } from "@wso2is/core/constants";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ConsoleRolePermissions from "./console-role-permissions";
import "./console-roles-edit.scss";

/**
 * Captures props needed for edit role component
 */
interface ConsoleRolesEditPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the data loading.
     */
    isLoading?: boolean;
    /**
     * Role object to be edited.
     */
    roleObject: RolesInterface;
    /**
     * Callback to update the list of roles.
     */
    onRoleUpdate: (activeTabIndex: number) => void;
    /**
     * Default active tab index.
     */
    defaultActiveIndex?: number;
}

/**
 * Component which will allow editing of a selected role.
 *
 * @param props - contains role details to be edited.
 */
const ConsoleRolesEdit: FunctionComponent<ConsoleRolesEditPropsInterface> = (
    props: ConsoleRolesEditPropsInterface
): ReactElement => {
    const { isLoading, roleObject, onRoleUpdate, defaultActiveIndex } = props;

    const { t } = useTranslation();
    const { isSuperOrganization, isFirstLevelOrganization, isSubOrganization, organizationType } =
        useGetCurrentOrganizationType();

    const userRolesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles
    );
    const hasRolesUpdatePermissions: boolean = useRequiredScopes(userRolesFeatureConfig?.scopes?.update);

    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName
    );

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consoleSettings
    );
    const isConsoleRolesEditable: boolean = !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
        "consoleSettings.editableConsoleRoles"
    );
    const isPrivilegedUsersInConsoleSettingsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
            "consoleSettings.privilegedUsers"
        );

    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);
    const [ activeUserStore, setActiveUserStore ] = useState<string>("PRIMARY");

    const organizationName: string = store.getState().auth.tenantDomain;

    const useOrgConfig: UseOrganizationConfigType = useOrganizationConfigV2;

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const {
        data: OrganizationConfig,
        isLoading: isOrgConfigRequestLoading,
        isValidating: isOrgConfigRequestRevalidating
    } = useOrgConfig(
        organizationName,
        {
            revalidateIfStale: true
        },
        saasFeatureStatus === FeatureStatus.ENABLED
    );

    useEffect(() => {
        setIsEnterpriseLoginEnabled(OrganizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading, isOrgConfigRequestRevalidating ]);

    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if (roleObject) {
            setIsAdminRole(
                roleObject.displayName === RoleConstants.ADMIN_ROLE ||
                    roleObject?.displayName === RoleConstants.ADMIN_GROUP ||
                    roleObject?.displayName === administratorRoleDisplayName
            );
        }
    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={
                                isSubOrg || isAdminRole || !isConsoleRolesEditable || !hasRolesUpdatePermissions
                            }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 0 }
                            enableDeleteErrorConnetedAppsModal={ false }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <ConsoleRolePermissions
                            isReadOnly={
                                isSubOrg || isAdminRole || !isConsoleRolesEditable || !hasRolesUpdatePermissions
                            }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 1 }
                            isSubOrganization={ isSubOrg }
                        />
                    </ResourceTab.Pane>
                )
            },
            (
                isSuperOrganization() ||
                (isFirstLevelOrganization() && !isPrivilegedUsersInConsoleSettingsEnabled)
                || isSubOrganization()
            ) && {
                menuItem: t("roles:edit.menuItems.groups"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleGroupsList
                            isReadOnly={ !hasRolesUpdatePermissions }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 2 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        { isFirstLevelOrganization() &&
                            isEnterpriseLoginEnabled &&
                            isPrivilegedUsersInConsoleSettingsEnabled && (
                            <RadioGroup
                                row
                                aria-labelledby="console-administrators-radio-group"
                                className="multi-option-radio-group"
                                defaultValue="PRIMARY"
                                name="console-administrators-radio-group-2"
                                value={ activeUserStore }
                                onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => {
                                    setActiveUserStore(value);
                                } }
                            >
                                <FormControlLabel value="PRIMARY" control={ <Radio /> } label="Asgardeo" />
                                <FormControlLabel
                                    value="DEFAULT"
                                    control={ <Radio /> }
                                    label={ organizationName + " organization" }
                                />
                            </RadioGroup>
                        ) }

                        <RoleUsersList
                            isReadOnly={ !hasRolesUpdatePermissions }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            activeUserStore={
                                isPrivilegedUsersInConsoleSettingsEnabled && isFirstLevelOrganization()
                                    ? activeUserStore
                                    : null
                            }
                            tabIndex={ 3 }
                        />
                    </ResourceTab.Pane>
                )
            },
            // Hide connected apps tab if the audience is application.
            roleObject?.audience?.type === RoleAudienceTypes.ORGANIZATION.toLocaleLowerCase()
                ? {
                    menuItem: t("roles:edit.menuItems.connectedApps"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <RoleConnectedApps
                                isReadOnly={ !hasRolesUpdatePermissions }
                                role={ roleObject }
                                onRoleUpdate={ onRoleUpdate }
                                tabIndex={ 4 }
                            />
                        </ResourceTab.Pane>
                    )
                }
                : null
        ];

        return panes;
    };

    return (<ResourceTab
        isLoading={ isLoading }
        defaultActiveIndex={ defaultActiveIndex }
        panes={ resolveResourcePanes() } />
    );
};

ConsoleRolesEdit.defaultProps = {
    defaultActiveIndex: 0
};

export default ConsoleRolesEdit;
