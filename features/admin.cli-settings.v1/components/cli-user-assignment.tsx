/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { FeatureAccessConfigInterface, FeatureStatus, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { useOrganizationConfigV2 } from "@wso2is/admin.administrators.v1/api/useOrganizationConfigV2";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useGetRoleById } from "@wso2is/admin.roles.v2/api/roles";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleUsersList } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-users";
import {
    IdentifiableComponentInterface,
    RoleListInterface,
    RolesInterface
} from "@wso2is/core/models";
import { EmptyPlaceholder } from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CLISettingsConstants } from "../constants/cli-settings-constants";

/**
 * Props interface of {@link CLIUserAssignment}
 */
interface CLIUserAssignmentPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the CLI application. Used to scope the CLI Administrator role lookup.
     */
    cliApplicationId: string;
    /**
     * Read only flag
     */
    readonly: boolean;
}

/**
 * Assigns/unassigns users to the "CLI Administrator" role. The UI mirrors the
 * user assignment tab of the Console Roles by reusing the same {@link RoleUsersList}.
 *
 * @param props - Props injected to the component.
 * @returns CLI user assignment component.
 */
const CLIUserAssignment: FunctionComponent<CLIUserAssignmentPropsInterface> = (
    props: CLIUserAssignmentPropsInterface
): ReactElement => {
    const {
        cliApplicationId,
        readonly,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const primaryUserStoreDomainName: string = useSelector(
        (state: AppState) => state?.config?.ui?.primaryUserStoreDomainName
    );
    const userRolesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles
    );
    const hasRolesUpdatePermissions: boolean = useRequiredScopes(userRolesFeatureConfig?.scopes?.update);

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consoleSettings
    );
    const isPrivilegedUsersInConsoleSettingsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes("consoleSettings.privilegedUsers");

    const [ activeUserStore, setActiveUserStore ] = useState<string>(primaryUserStoreDomainName);
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);

    const organizationName: string = store.getState().auth.tenantDomain;
    const productName: string = useSelector((state: AppState) => state.config.ui.productName);

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const {
        data: organizationConfig,
        isLoading: isOrgConfigRequestLoading,
        isValidating: isOrgConfigRequestRevalidating
    } = useOrganizationConfigV2(
        organizationName,
        { revalidateIfStale: true },
        saasFeatureStatus === FeatureStatus.ENABLED
    );

    useEffect(() => {
        setIsEnterpriseLoginEnabled(organizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading, isOrgConfigRequestRevalidating ]);

    const isPrivilegedUsersToggleVisible: boolean = isFirstLevelOrganization() &&
        isEnterpriseLoginEnabled &&
        isPrivilegedUsersInConsoleSettingsEnabled;

    const {
        data: rolesList,
        isLoading: isRolesListLoading
    } = useGetRolesList<RoleListInterface>(
        1,
        0,
        cliApplicationId
            ? CLISettingsConstants.getCLIAdministratorRoleFilter(cliApplicationId)
            : undefined,
        undefined,
        !!cliApplicationId
    );

    const cliAdministratorRoleId: string | undefined = rolesList?.Resources?.[0]?.id;

    const {
        data: cliAdministratorRole,
        isLoading: isRoleLoading,
        mutate: mutateRole
    } = useGetRoleById<RolesInterface>(cliAdministratorRoleId);

    const isLoading: boolean = isRolesListLoading || (!!cliAdministratorRoleId && isRoleLoading);
    const isRoleAvailable: boolean = !isRolesListLoading && !!cliAdministratorRoleId && !!cliAdministratorRole;

    if (isLoading) {
        return (
            <Box sx={ { display: "flex", justifyContent: "center", p: 5 } }>
                <CircularProgress data-componentid={ `${ componentId }-loading` } />
            </Box>
        );
    }

    if (!isRoleAvailable) {
        return (
            <EmptyPlaceholder
                title={ t("cliSettings:users.roleNotFound.title") }
                subtitle={ [
                    t("cliSettings:users.roleNotFound.description", {
                        roleName: CLISettingsConstants.CLI_ADMINISTRATOR_ROLE_NAME
                    }),
                    t("cliSettings:users.roleNotFound.subtitle")
                ] }
                data-componentid={ `${ componentId }-role-not-found-placeholder` }
            />
        );
    }

    return (
        <div data-componentid={ componentId }>
            { isPrivilegedUsersToggleVisible && (
                <RadioGroup
                    row
                    aria-labelledby="cli-users-userstore-radio-group"
                    className="multi-option-radio-group"
                    defaultValue={ primaryUserStoreDomainName }
                    name="cli-users-userstore-radio-group"
                    value={ activeUserStore }
                    onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => {
                        setActiveUserStore(value);
                    } }
                >
                    <FormControlLabel
                        control={ <Radio /> }
                        data-componentid={ `${ componentId }-radio-group-administrators` }
                        label={ productName }
                        value={ primaryUserStoreDomainName }
                    />
                    <FormControlLabel
                        control={ <Radio /> }
                        data-componentid={ `${ componentId }-radio-group-privileged-users` }
                        label={ t("common:organizationName", { orgName: organizationName }) }
                        value={ "DEFAULT" }
                    />
                </RadioGroup>
            ) }

            <RoleUsersList
                title={ t("cliSettings:users.title") }
                subtitle={ t("cliSettings:users.subtitle") }
                isPrivilegedUsersToggleVisible={ isPrivilegedUsersToggleVisible }
                isReadOnly={ readonly || !hasRolesUpdatePermissions }
                role={ cliAdministratorRole }
                onRoleUpdate={ (): void => {
                    mutateRole();
                } }
                activeUserStore={
                    activeUserStore !== userstoresConfig?.primaryUserstoreName
                    && isPrivilegedUsersInConsoleSettingsEnabled
                    && isFirstLevelOrganization()
                        ? activeUserStore
                        : null
                }
                tabIndex={ 0 }
            />
        </div>
    );
};

CLIUserAssignment.defaultProps = {
    "data-componentid": "cli-user-assignment"
};

export default CLIUserAssignment;
