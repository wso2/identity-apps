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

import { GearIcon } from "@oxygen-ui/react-icons";
import {
    FeatureAccessConfigInterface,
    FeatureStatus,
    Show,
    useCheckFeatureStatus
} from "@wso2is/access-control";
import { useOrganizationConfigV2 } from "@wso2is/admin.administrators.v1/api/useOrganizationConfigV2";
import { GuestUsersList } from "@wso2is/admin.administrators.v1/components/guests/guest-users-list";
import { AdministratorConstants } from "@wso2is/admin.administrators.v1/constants/users";
import { UseOrganizationConfigType } from "@wso2is/admin.administrators.v1/models/organization";
import { AddAdministratorWizard } from "@wso2is/admin.administrators.v1/wizard/add-administrator-wizard";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { UserBasicInterface, UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { deleteGuestUser } from "@wso2is/admin.users.v1/api";
import { useInvitedUsersList } from "@wso2is/admin.users.v1/api/invite";
import { UserInviteInterface } from "@wso2is/admin.users.v1/components/guests/models/invite";
import { AdminAccountTypes, InvitationStatus, UserManagementConstants } from "@wso2is/admin.users.v1/constants";
import { resolveUserSearchAttributes } from "@wso2is/admin.users.v1/utils";
import { UserStoreDropdownItem } from "@wso2is/admin.userstores.v1/models";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DropdownChild } from "@wso2is/forms";
import { Button, EmptyPlaceholder, ListLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import AdministratorsTable from "./administrators-table";
import { ConsoleAdministratorOnboardingConstants } from "../../../constants/console-administrator-onboarding-constants";
import useAdministrators from "../../../hooks/use-administrators";
import useBulkAssignAdministratorRoles from "../../../hooks/use-bulk-assign-user-roles";
import AddExistingUserWizard from "../add-existing-user-wizard/add-existing-user-wizard";
import InviteNewAdministratorWizard from "../invite-new-administrator-wizard/invite-new-administrator-wizard";

/**
 * Props interface of {@link AdministratorsList}
 */
interface AdministratorsListProps extends IdentifiableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * List of available user stores
     */
    availableUserStores: UserStoreDropdownItem[];
    /**
     * Selected administrator user group.
     */
    selectedAdministratorGroup: string;
}

/**
 * Enum for add administrator modes.
 */
enum AddAdministratorModes {
    /**
     * To add an existing user as an administrator.
     */
    AddExisting = "addExistingUser",
    /**
     * To invite a new user as an administrator.
     */
    InviteParentUser = "inviteParentUser",
    /**
     * To invite an external user as an administrator.
     */
    AddExternal = "addExternalAdmin"
}

/**
 * Component to list and manage administrators.
 *
 * @param props - Props injected to the component.
 * @returns Administrators list component.
 */
const AdministratorsList: FunctionComponent<AdministratorsListProps> = (
    props: AdministratorsListProps
): ReactElement => {
    const {
        defaultListItemLimit,
        showMetaContent,
        readOnlyUserStores,
        selection,
        showListItemActions,
        selectedAdministratorGroup,
        availableUserStores,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.consoleSettings
    );
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);
    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state?.profile?.profileSchemas);

    const isPrivilegedUsersInConsoleSettingsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
            "consoleSettings.privilegedUsers"
        );
    const isInvitedAdminInConsoleSettingsEnabled: boolean = !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
        "consoleSettings.invitedExternalAdmins"
    );

    const { isSubOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const { unassignAdministratorRoles } = useBulkAssignAdministratorRoles();

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ showAddExistingUserWizard, setShowAddExistingUserWizard ] = useState<boolean>(false);
    const [ showInviteNewAdministratorModal, setShowInviteNewAdministratorModal ] = useState<boolean>(false);
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);
    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>(InvitationStatus.ACCEPTED);

    const [ showAddExternalAdminWizard, setShowAddExternalAdminWizard ] = useState(false);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(undefined);

    useEffect(() => {
        setSelectedUserStore(
            isPrivilegedUsersInConsoleSettingsEnabled && selectedAdministratorGroup === "administrators"
                ? primaryUserStoreDomainName
                : userstoresConfig?.primaryUserstoreName
        );
        // Resets the invitation status option when the selected administrator group changes.
        setInvitationStatusOption(InvitationStatus.ACCEPTED);
    },[ isPrivilegedUsersInConsoleSettingsEnabled, selectedAdministratorGroup ]);

    const {
        administrators,
        isNextPageAvailable,
        isAdministratorsListFetchRequestLoading,
        mutateAdministratorsListFetchRequest,
        adminUserListFetchError
    } = useAdministrators(
        listItemLimit,
        listOffset,
        searchQuery,
        null,
        selectedUserStore,
        UserManagementConstants.GROUPS_ATTRIBUTE
    );

    const useOrgConfig: UseOrganizationConfigType = useOrganizationConfigV2;

    const organizationName: string = store.getState().auth.tenantDomain;

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const isCentralDeploymentEnabled: boolean = useSelector((state: AppState) => {
        return state?.config?.deployment?.centralDeploymentEnabled;
    });

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

    const {
        data: guestUserList,
        isLoading: isGuestUserListFetchRequestLoading,
        mutate: mutateGuestUserListFetchRequest
    } = useInvitedUsersList(administratorConfig.enableAdminInvite);

    const invitationStatusOptions: DropdownItemProps[] = [
        {
            key: 1,
            text: t("consoleSettings:invitations.filterOptions.accepted"),
            value: "Accepted"
        },
        {
            key: 2,
            text: t("consoleSettings:invitations.filterOptions.pending"),
            value: "Pending"
        },
        {
            key: 3,
            text: t("consoleSettings:invitations.filterOptions.expired"),
            value: "Expired"
        }
    ];

    const [ loading, setLoading ] = useState(false);

    const adminActionPermissionScopes: string[] = useMemo(() => {
        const userRoleUpdateScopes: string[] = userRolesV3FeatureEnabled
            ? [ AdministratorConstants.INTERNAL_ROLE_MGT_USERS_UPDATE_PERMISSION ]
            : featureConfig?.userRoles?.scopes?.update;

        return [
            ...featureConfig?.users?.scopes?.create,
            ...userRoleUpdateScopes
        ];
    }, [ userRolesV3FeatureEnabled, featureConfig ]);

    /**
     * Resolves the attributes by which the users can be searched.
     */
    const userSearchAttributes: DropdownChild[] = useMemo(() => {
        return resolveUserSearchAttributes(profileSchemas);
    }, [ profileSchemas ]);

    useEffect(() => {
        setIsEnterpriseLoginEnabled(OrganizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading, isOrgConfigRequestRevalidating ]);

    const handleUserEdit = (user: UserBasicInterface) => {
        history.push(
            AppConstants.getPaths()
                .get("CONSOLE_ADMINISTRATORS_EDIT")
                .replace(":id", user.id)
        );
    };

    const handleUserDelete = (user: UserBasicInterface & UserRoleInterface, onComplete: () => void): void => {
        unassignAdministratorRoles(
            user,
            () => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "users:notifications.revokeAdmin.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.revokeAdmin.genericError.message")
                    })
                );
            },
            () => {
                mutateAdministratorsListFetchRequest();
                onComplete();
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("users:notifications.revokeAdmin.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("users:notifications.revokeAdmin.success.message")
                    })
                );
            }
        );
    };

    const handleGuestUserDelete = (user: UserBasicInterface & UserRoleInterface, onComplete: () => void): void => {
        deleteGuestUser(user.id).then(() => {
            onComplete();
            mutateGuestUserListFetchRequest();
            dispatch(
                addAlert<AlertInterface>({
                    description: t("users:notifications.revokeAdmin.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("users:notifications.revokeAdmin.success.message")
                })
            );
        }
        ).catch(() => {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("users:notifications.revokeAdmin.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.revokeAdmin.genericError.message")
                })
            );
        });
    };

    const handleAccountStatusChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setInvitationStatusOption(data.value as string);
    };

    const handleSelectedUserStoreChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setSelectedUserStore(data.value as string);
    };

    const handleListFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (
        event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    const resolveFilterAttributeOptions = (): DropdownChild[] => {
        const filterAttributeOptions: DropdownChild[] = [
            {
                key: 0,
                text: t("users:advancedSearch.form.dropdown." + "filterAttributeOptions.username"),
                value: "userName"
            },
            ...userSearchAttributes
        ];

        return filterAttributeOptions;
    };

    const renderAdministratorAddOptions = (): ReactElement => {

        const isCurrentOrgSubOrganization: boolean = isSubOrganization();

        const addAdminOptions: any = [];

        if (!isCurrentOrgSubOrganization && isInvitedAdminInConsoleSettingsEnabled) {
            addAdminOptions.push({
                "data-componentid": `${componentId}-add-external-admin-dropdown-item`,
                key: 1,
                text: t("consoleSettings:administrators.add.options.addExternalUser"),
                value: AddAdministratorModes.AddExternal
            });
        }

        if (isEnterpriseLoginEnabled || isCurrentOrgSubOrganization) {
            addAdminOptions.push({
                "data-componentid": `${componentId}-add-existing-user-dropdown-item`,
                key: 1,
                text: t("consoleSettings:administrators.add.options.addExistingUser"),
                value: AddAdministratorModes.AddExisting
            });
        }

        if (isCurrentOrgSubOrganization) {
            addAdminOptions.push({
                "data-componentid": `${componentId}-invite-new-user-dropdown-item`,
                key: 2,
                text: t("consoleSettings:administrators.add.options.inviteParentUser"),
                value: AddAdministratorModes.InviteParentUser
            });
        };

        if (addAdminOptions.length > 1) {
            return (
                <Dropdown
                    data-componentid={ `${componentId}-add-administrator-dropdown` }
                    direction="left"
                    floating
                    icon={ null }
                    trigger={ (
                        <PrimaryButton
                            data-componentid={ `${componentId}-add-button` }
                            className="add-administrator-dropdown-trigger"
                        >
                            <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                            { t("consoleSettings:administrators.add.action") }
                            <Icon name="dropdown" className="add-administrator-dropdown-chevron" />
                        </PrimaryButton>
                    ) }
                >
                    <Dropdown.Menu>
                        { addAdminOptions.map((option: DropdownItemProps) => (
                            <Dropdown.Item
                                key={ option.value as string }
                                onClick={ () => {
                                    if (option.value === AddAdministratorModes.AddExisting) {
                                        setShowAddExistingUserWizard(true);
                                    } else if (option.value === AddAdministratorModes.AddExternal) {
                                        setShowAddExternalAdminWizard(true);
                                    } else {
                                        setShowInviteNewAdministratorModal(true);
                                    }
                                } }
                                { ...option }
                            />
                        )) }
                    </Dropdown.Menu>
                </Dropdown>
            );
        } else if (addAdminOptions.length === 1) {
            return (
                <PrimaryButton
                    data-componentid={ `${componentId}-add-button` }
                    onClick={ () => setShowAddExternalAdminWizard(true) }
                >
                    <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                    { t("consoleSettings:administrators.add.action") }
                </PrimaryButton>
            );
        } else {
            return (
                <PrimaryButton
                    data-componentid={ `${componentId}-add-button` }
                    onClick={ () => setShowAddExistingUserWizard(true) }
                >
                    <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                    { t("consoleSettings:administrators.add.action") }
                </PrimaryButton>
            );
        }
    };

    const handleSettingsButton = () => {
        history.push(AdministratorConstants.getPaths().get("COLLABORATOR_SETTINGS_EDIT_PATH"));
    };

    const renderRightActionPanel = () => {
        if (
            isPrivilegedUsersInConsoleSettingsEnabled &&
            isFirstLevelOrganization() &&
            administratorConfig.enableAdminInvite &&
            selectedAdministratorGroup === "administrators"
        ) {
            return (
                <Dropdown
                    data-componentid={ `${componentId}-list-userstore-dropdown` }
                    selection
                    options={ invitationStatusOptions }
                    onChange={ handleAccountStatusChange }
                    text={ `Filter by: ${invitationStatusOption}` }
                    disabled={
                        (invitationStatusOption === InvitationStatus.ACCEPTED &&
                            isAdministratorsListFetchRequestLoading) ||
                        (administratorConfig.enableAdminInvite && isGuestUserListFetchRequestLoading)
                    }
                />
            );
        }

        return (
            <Dropdown
                data-testid="user-mgt-user-list-userstore-dropdown"
                selection
                options={ availableUserStores }
                onChange={ handleSelectedUserStoreChange }
                value={ selectedUserStore }
                defaultValue={ primaryUserStoreDomainName }
            />
        );
    };

    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleListFilter }
                    filterAttributeOptions={ resolveFilterAttributeOptions() }
                    filterAttributePlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterAttribute. " + "placeholder"
                    ) }
                    filterConditionsPlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterCondition" + ".placeholder"
                    ) }
                    filterValuePlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterValue" + ".placeholder"
                    ) }
                    placeholder={ "Search by Username" }
                    defaultSearchAttribute={ "userName" }
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                />
            ) }
            currentListSize={ administrators?.Resources?.length }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            data-componentid={ `${componentId}-list-layout` }
            onPageChange={ handlePaginationChange }
            showPagination={ true }
            showTopActionPanel={ true }
            showPaginationPageLimit={ true }
            totalPages={ Math.ceil(administrators?.totalResults / listItemLimit) }
            totalListSize={ administrators?.totalResults }
            isLoading={ isAdministratorsListFetchRequestLoading }
            onSearchQueryClear={ handleSearchQueryClear }
            paginationOptions={ {
                disableNextButton: !isNextPageAvailable
            } }
            rightActionPanel={ renderRightActionPanel() }
            topActionPanelExtension={ (
                isFeatureEnabled(consoleSettingsFeatureConfig,
                    ConsoleAdministratorOnboardingConstants.FEATURE_DICTIONARY
                        .get("CONSOLE_SETTINGS_ADD_ADMINISTRATOR")) && (<Show
                    when={ adminActionPermissionScopes }>
                    { !isSubOrganization() && isPrivilegedUsersInConsoleSettingsEnabled && (
                        <Button
                            data-componentid={ `${componentId}-admin-settings-button` }
                            icon={ GearIcon }
                            onClick={ handleSettingsButton }
                        >
                        </Button>
                    ) }
                    { renderAdministratorAddOptions() }
                </Show>)
            ) }
        >
            { invitationStatusOption === InvitationStatus.ACCEPTED ? adminUserListFetchError ? (
                <EmptyPlaceholder
                    subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                        t("users:placeholders.userstoreError.subtitles.1") ] }
                    title={ t("users:placeholders.userstoreError.title") }
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                />
            ) : (
                <AdministratorsTable
                    defaultListItemLimit={ defaultListItemLimit }
                    administrators={ administrators }
                    onUserEdit={ handleUserEdit }
                    onUserDelete={ isCentralDeploymentEnabled &&
                        selectedUserStore !== userstoresConfig?.primaryUserstoreName  ?
                        handleGuestUserDelete : handleUserDelete }
                    isLoading={ loading }
                    readOnlyUserStores={ readOnlyUserStores }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    triggerClearQuery={ triggerClearQuery }
                    onEmptyListPlaceholderActionClick={ () => null }
                    onIsLoading={ setLoading }
                    selection={ selection }
                    showListItemActions={ showListItemActions }
                    showMetaContent={ showMetaContent }
                    data-componentid={ `${componentId}-table` }
                />
            ) : null }
            { invitationStatusOption === InvitationStatus.PENDING && (
                <GuestUsersList
                    invitationStatusOption={ invitationStatusOption }
                    onEmptyListPlaceholderActionClick={ () => setShowAddExternalAdminWizard(true) }
                    onboardedGuestUserList={ administrators }
                    onSearchQueryClear={ handleSearchQueryClear }
                    guestUsersList={ guestUserList?.filter(
                        (invitation: UserInviteInterface) =>
                            invitation.status === InvitationStatus.PENDING.toUpperCase()
                    ) }
                    getGuestUsersList={ () => mutateGuestUserListFetchRequest() }
                    searchQuery={ searchQuery }
                />
            ) }
            { invitationStatusOption === InvitationStatus.EXPIRED && (
                <GuestUsersList
                    invitationStatusOption={ invitationStatusOption }
                    onEmptyListPlaceholderActionClick={ () => setShowAddExternalAdminWizard(true) }
                    onboardedGuestUserList={ administrators }
                    onSearchQueryClear={ handleSearchQueryClear }
                    guestUsersList={ guestUserList?.filter(
                        (invitation: UserInviteInterface) =>
                            invitation.status === InvitationStatus.EXPIRED.toUpperCase()
                    ) }
                    getGuestUsersList={ () => mutateGuestUserListFetchRequest() }
                    searchQuery={ searchQuery }
                />
            ) }
            { showAddExistingUserWizard && (
                <AddExistingUserWizard
                    onSuccess={ () => mutateAdministratorsListFetchRequest() }
                    onClose={ () => setShowAddExistingUserWizard(false) }
                    selectedUserStore={ selectedUserStore }
                />
            ) }
            { showInviteNewAdministratorModal && (
                <InviteNewAdministratorWizard
                    onClose={ () => setShowInviteNewAdministratorModal(false) }
                />
            ) }
            { showAddExternalAdminWizard && (
                <AddAdministratorWizard
                    data-componentid={ `${ componentId }-add-admin-wizard-modal` }
                    closeWizard={ () => {
                        setShowAddExternalAdminWizard(false);
                    } }
                    onInvitationSendSuccessful={ () => {
                        mutateGuestUserListFetchRequest();
                        eventPublisher.publish("manage-users-finish-creating-collaborator-user");
                    } }
                    adminTypeSelection={ AdminAccountTypes.EXTERNAL }
                    onUserUpdate={ () => {
                        mutateAdministratorsListFetchRequest();
                    } }
                />
            )
            }
        </ListLayout>
    );
};

AdministratorsList.defaultProps = {
    "data-componentid": "administrators",
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};

export default AdministratorsList;
