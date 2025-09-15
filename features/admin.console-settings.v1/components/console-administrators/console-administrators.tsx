/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { FeatureAccessConfigInterface, FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { useOrganizationConfigV2 } from "@wso2is/admin.administrators.v1/api/useOrganizationConfigV2";
import { UseOrganizationConfigType } from "@wso2is/admin.administrators.v1/models/organization";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreDropdownItem, UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AdministratorsList from "./administrators-list/administrators-list";
import InvitedAdministratorsList from "./invited-administrators/invited-administrators-list";

/**
 * Props interface of {@link ConsoleAdministrators}
 */
type ConsoleAdministratorsInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleAdministrators: FunctionComponent<ConsoleAdministratorsInterface> = (
    props: ConsoleAdministratorsInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { isFirstLevelOrganization, isSubOrganization } = useGetCurrentOrganizationType();
    const { t } = useTranslation();

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.consoleSettings);
    const isPrivilegedUsersInConsoleSettingsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
            "consoleSettings.privilegedUsers"
        );

    const [ activeAdministratorGroup, setActiveAdministratorGroup ] =
        useState(isSubOrganization() ? "activeUsers" : "administrators");
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);

    const organizationName: string = store.getState().auth.tenantDomain;
    const productName: string = useSelector((state: AppState) => state.config.ui.productName);
    const systemReservedUserStores: string[] = useSelector(
        (state: AppState) => state?.config?.ui?.systemReservedUserStores);

    const useOrgConfig: UseOrganizationConfigType = useOrganizationConfigV2;

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

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

    const {
        isLoading: isUserStoreListFetchRequestLoading,
        mutateUserStoreList,
        userStoresList
    } = useUserStores();

    const availableUserStores: UserStoreDropdownItem[] = useMemo(() => {
        const storeOptions: UserStoreDropdownItem[] = [
            {
                key: -1,
                text: userstoresConfig?.primaryUserstoreName,
                value: userstoresConfig?.primaryUserstoreName
            }
        ];

        if (userStoresList && !isUserStoreListFetchRequestLoading) {
            userStoresList?.forEach((store: UserStoreListItem, index: number) => {
                // Skip the remote user store in administrators listing as it is not supporting user listing.
                if (
                    store?.typeName === RemoteUserStoreManagerType.RemoteUserStoreManager ||
                    systemReservedUserStores?.includes(store?.name)
                ) {
                    return;
                }

                if (store?.name?.toUpperCase() !== userstoresConfig?.primaryUserstoreName) {
                    if (store.enabled) {
                        const storeOption: UserStoreDropdownItem = {
                            key: index,
                            text: store.name,
                            value: store.name
                        };

                        storeOptions.push(storeOption);
                    }
                }
            });
        }

        return storeOptions;
    }, [ userStoresList, isUserStoreListFetchRequestLoading ]);

    useEffect(() => {
        mutateUserStoreList();
    }, []);

    const renderSelectedAdministratorGroup = (): ReactElement => {
        switch (activeAdministratorGroup) {
            case "activeUsers":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "administrators":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "privilegedUsers":
                return (
                    <AdministratorsList
                        selectedAdministratorGroup={ activeAdministratorGroup }
                        availableUserStores={ availableUserStores }
                    />
                );
            case "pendingInvitations":
                return (
                    <InvitedAdministratorsList
                        availableUserStores={ availableUserStores }
                    />
                );
            default:
                return null;
        }
    };

    const renderActiveAdministratorGroups = (): ReactElement => {
        if (
            isFirstLevelOrganization()
            && isEnterpriseLoginEnabled
            && isPrivilegedUsersInConsoleSettingsEnabled
        ) {
            return (
                <RadioGroup
                    row
                    aria-labelledby="console-administrators-radio-group"
                    className="multi-option-radio-group"
                    defaultValue="administrators"
                    name="console-administrators-radio-group"
                    value={ activeAdministratorGroup }
                    onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveAdministratorGroup(value) }
                >
                    <FormControlLabel
                        data-componentid={ `${ componentId }-radio-group-administrators` }
                        value="administrators"
                        control={ <Radio /> }
                        label={ productName }
                    />
                    <FormControlLabel
                        data-componentid={ `${ componentId }-radio-group-privileged-users` }
                        value="privilegedUsers"
                        control={ <Radio /> }
                        label={ t("common:organizationName", { orgName: organizationName }) }
                    />
                </RadioGroup>
            );
        }

        if (isSubOrganization()) {
            return (
                <RadioGroup
                    row
                    aria-labelledby="console-administrators-radio-group"
                    className="multi-option-radio-group"
                    defaultValue="login"
                    name="console-administrators-radio-group"
                    value={ activeAdministratorGroup }
                    onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveAdministratorGroup(value) }
                >
                    <FormControlLabel value="activeUsers" control={ <Radio /> } label="Active Members" />
                    <FormControlLabel value="pendingInvitations" control={ <Radio /> } label="Pending Invitations" />
                </RadioGroup>
            );
        }
    };

    return (
        <div className="console-administrators" data-componentid={ componentId }>
            { renderActiveAdministratorGroups() }
            { renderSelectedAdministratorGroup() }
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleAdministrators.defaultProps = {
    "data-componentid": "console-administrators"
};

export default ConsoleAdministrators;
