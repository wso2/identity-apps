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

import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps, TabProps } from "semantic-ui-react";
import { userstoresConfig } from "../../admin-extensions-v1";
import { FeatureGateConstants } from "../../admin-extensions-v1/components/feature-gate/constants/feature-gate";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    UIConstants,
    UserBasicInterface,
    getAUserStore,
    getEmptyPlaceholderIllustrations,
    history
} from "../../admin.core.v1";
import { useGetCurrentOrganizationType } from "../../admin-organizations-v1/hooks/use-get-organization-type";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface,
    RealmConfigInterface,
    ServerConfigurationsConstants,
    getConnectorCategory,
    useServerConfigs
} from "../../admin-server-configurations-v1";
import { useUserStores } from "../../admin-userstores-v1/api";
import {
    UserStoreItem,
    UserStoreListItem,
    UserStorePostData,
    UserStoreProperty
} from "../../admin-userstores-v1/models/user-stores";
import { useUsersList } from "../api";
import { useGetParentOrgUserInvites } from "../components/guests/api/use-get-parent-org-user-invites";
import { UserInviteInterface } from "../components/guests/models/invite";
import { GuestUsersList } from "../components/guests/pages/guest-users-list";
import { UsersList } from "../components/users-list";
import { AddUserWizard } from "../components/wizard/add-user-wizard";
import { BulkImportUserWizard } from "../components/wizard/bulk-import-user-wizard";
import { InviteParentOrgUserWizard } from "../components/wizard/invite-parent-org-user-wizard";
import {
    UserAccountTypes,
    UserAccountTypesMain,
    UserAddOptionTypes,
    UserManagementConstants
} from "../constants";
import { InvitationStatus, UserListInterface } from "../models";

/**
 * Props for the Users page.
 */
type UsersPageInterface = IdentifiableComponentInterface & RouteComponentProps & TestableComponentInterface;

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;
const NUMBER_OF_PAGES_FOR_LDAP: number = 100;

/**
 * Users info page.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
const UsersPage: FunctionComponent<UsersPageInterface> = (
    props: UsersPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const { isSubOrganization, isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showBulkImportWizard, setShowBulkImportWizard ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>([]);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ emailVerificationEnabled, setEmailVerificationEnabled ] = useState<boolean>(undefined);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(undefined);
    const [ selectedAddUserType ] = useState<UserAccountTypes>(UserAccountTypes.USER);
    const [ userType, setUserType ] = useState<string>();
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(userstoresConfig.primaryUserstoreName);
    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>(InvitationStatus.PENDING);
    const [ isUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ isSelectedUserStoreReadOnly ] = useState<boolean>(false);
    const [ isInvitationStatusOptionChanged, setIsInvitationStatusOptionChanged ] = useState<boolean>(false);
    const [ filterGuestList, setFilterGuestList ] = useState<UserInviteInterface[]>();
    const [ finalGuestList, setFinalGuestList ] = useState<UserInviteInterface[]>([]);
    const [ paginatedGuestList, setPaginateGuestList ] = useState<UserInviteInterface[]>([]);
    const [ showMultipleInviteConfirmationModal, setShowMultipleInviteConfirmationModal ] = useState<boolean>(false);
    const [ connectorConfigLoading, setConnecterConfigLoading ] = useState<boolean>(false);
    const [ showInviteParentUserWizard, setShowInviteParentUserWizard ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const invitationStatusOptions: DropdownItemProps[] = [
        {
            key: 2,
            text: t("parentOrgInvitations:searchdropdown.pendingLabel"),
            value: "Pending"
        },
        {
            key: 3,
            text: t("parentOrgInvitations:searchdropdown.expiredLabel"),
            value: "Expired"
        }
    ];
    const modifiedLimit: number = listItemLimit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;
    // Excluding groups and roles from getUserList API call to improve performance.
    const excludedAttributes: string = UserManagementConstants.GROUPS_AND_ROLES_ATTRIBUTE;

    // Hook to get parent organization user invites.
    // Only available for sub organizations.
    const {
        data: parentOrgUserInviteList,
        isLoading: isParentOrgUserInviteListLoading,
        mutate: mutateParentOrgUserInviteList
    } = useGetParentOrgUserInvites(
        isSubOrganization()
    );

    // Hook to get the server configurations.
    const {
        data: originalServerConfigs
    } = useServerConfigs(
        saasFeatureStatus === FeatureStatus.ENABLED &&
        !isSubOrganization()
    );

    // Get users list.
    const {
        data: originalUserList,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError,
        mutate: mutateUserListFetchRequest
    } = useUsersList(
        modifiedLimit,
        listOffset,
        searchQuery === "" ? null : searchQuery,
        null,
        selectedUserStore,
        excludedAttributes
    );

    // Get userstores list.
    const {
        data: orginalUserStoreList,
        isLoading: isUserStoreListFetchRequestLoading,
        isValidating: isUserStoreListFetchRequestValidating,
        error: userStoreListFetchRequestError
    } = useUserStores(
        null,
        !isSubOrganization()
    );

    const realmConfigs: RealmConfigInterface = useMemo(() => originalServerConfigs?.realmConfig,
        [ originalServerConfigs ]);

    /**
     * Set userstore list to the state.
     */
    const userStoreOptions: UserStoreItem[] = useMemo(() => {
        const storeOptions: UserStoreItem[] = [
            {
                key: -1,
                text: userstoresConfig.primaryUserstoreName,
                value: userstoresConfig.primaryUserstoreName
            }
        ];

        if (orginalUserStoreList?.length > 0) {
            orginalUserStoreList.map((store: UserStoreListItem, index: number) => {
                if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName) {
                    getAUserStore(store.id).then((response: UserStorePostData) => {
                        const isDisabled: boolean = response.properties.find(
                            (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                        if (!isDisabled) {
                            const storeOption: UserStoreItem = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };

                            storeOptions.push(storeOption);
                        }
                    });
                }
            });
        }

        return storeOptions;
    }, [ orginalUserStoreList ]);

    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        if (readOnlyUserStoresList?.includes(selectedUserStore)) {
            return true;
        }

        return false;
    }, [ selectedUserStore ]);

    /**
     * Get read-only user stores from the user store list.
     */
    useEffect(() => {
        if (isUserStoreListFetchRequestValidating || isUserStoreListFetchRequestLoading ||
             !orginalUserStoreList || orginalUserStoreList.length < 1) {
            return;
        }

        getReadOnlyUserStoresList(orginalUserStoreList);
    }, [ orginalUserStoreList ]);

    /**
     * Handles the user list fetch request error.
     */
    useEffect(() => {
        if (!userListFetchRequestError) {
            return;
        }

        if (userListFetchRequestError.response
            && userListFetchRequestError.response.data
            && userListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: userListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications." +
                    "fetchUsers.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
        }));
    }, [ userListFetchRequestError ]);

    /**
     * Handles the userstore list fetch request error.
     */
    useEffect(() => {
        if (!userStoreListFetchRequestError) {
            return;
        }

        if (userStoreListFetchRequestError.response
            && userStoreListFetchRequestError.response.data
            && userStoreListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: userStoreListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications." +
                    "fetchUsers.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.users.notifications.fetchUserstores.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.users.notifications.fetchUserstores.genericError.message")
        }));
    }, [ userStoreListFetchRequestError ]);

    /**
     * Handles the parent user invitations search query changes.
     */
    useEffect(() => {
        if (!isSubOrganization()) {
            return;
        }

        setListOffset(0);
        if (searchQuery === "userName co " || searchQuery === "" || searchQuery === null) {
            setPaginateGuestList(parentOrgUserInviteList?.invitations);
            setFilterGuestList([]);

            return;
        } else if (searchQuery) {
            let searchList: UserInviteInterface[] = parentOrgUserInviteList?.invitations;

            if (filterGuestList?.length > 0) {
                searchList = filterGuestList;
            }
            if (searchQuery.includes("userName sw ")) {
                const searchValue: string = searchQuery.split("sw ")[1];

                searchList = searchList?.filter((invite: UserInviteInterface) => {
                    return invite?.username.startsWith(searchValue);
                });
            } else if (searchQuery.includes("userName ew ")) {
                const searchValue: string = searchQuery.split("ew ")[1];

                searchList = searchList?.filter((invite: UserInviteInterface) => {
                    return invite?.username.endsWith(searchValue);
                });
            } else if (searchQuery.includes("userName eq ")) {
                const searchValue: string = searchQuery.split("eq ")[1];

                searchList = searchList?.filter((invite: UserInviteInterface) => {
                    return (invite?.username === searchValue);
                });
            } else if (searchQuery.includes("userName co ")) {
                const searchValue: string = searchQuery.split("co ")[1];

                searchList = searchList?.filter((invite: UserInviteInterface) => {
                    return invite?.username.includes(searchValue);
                });
            }
            setPaginateGuestList(searchList);
            setFilterGuestList(searchList);
        }
    }, [ searchQuery ]);

    useEffect(() => {
        setShowMultipleInviteConfirmationModal(
            showBulkImportWizard
            && !connectorConfigLoading
            && !emailVerificationEnabled
        );
    }, [ showBulkImportWizard, connectorConfigLoading ]);

    /**
     * Handles parent user invitation pagination.
     */
    useEffect(() => {
        setFinalGuestList(parentOrgUserInviteList?.invitations?.filter((invitation: UserInviteInterface) =>
            invitation.status === InvitationStatus.PENDING.toUpperCase()));

    }, [ parentOrgUserInviteList?.invitations ]);

    /**
     * User effect to handle Pagination for pending/expired Guest.
     */
    useEffect(() => {
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            return;
        }

        let finalInvitations: UserInviteInterface[] = paginatedGuestList?.filter(
            (invitation: UserInviteInterface) => invitation.status === invitationStatusOption.toUpperCase());

        if (finalInvitations?.length > listItemLimit) {
            finalInvitations = finalInvitations.slice(listOffset, listOffset + listItemLimit);
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(finalInvitations.length === listItemLimit);
        } else {
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(false);
        }
    }, [ paginatedGuestList, listOffset, listItemLimit, isInvitationStatusOptionChanged, invitationStatusOption ]);

    /**
     * Returns a moderated users list.
     *
     * @remarks There is no proper way to count the total entries in the userstore with LDAP. So as a workaround, when
     * fetching users, we request an extra entry to figure out if there is a next page.
     * TODO: Remove this function and other related variables once there is a proper fix for LDAP pagination.
     * @see {@link https://github.com/wso2/product-is/issues/7320}
     *
     * @param list - Users list retrieved from the API.
     * @param requestedLimit - Requested item limit.
     * @param popCount - Tempt count used which will be removed after figuring out if next page is available.
     * @returns UserListInterface
     */
    const moderateUsersList = (list: UserListInterface, requestedLimit: number,
        popCount: number = 1): UserListInterface => {

        const moderated: UserListInterface = list;

        if (moderated.itemsPerPage === requestedLimit) {
            moderated.Resources.splice(-1, popCount);
            setIsNextPageAvailable(true);
        } else {
            setIsNextPageAvailable(false);
        }

        return moderated;
    };

    /**
     * Transform the original users list response from the API.
     *
     * @param usersList - User list from the API.
     * @returns Moderated List.
     */
    const transformUserList = (usersList: UserListInterface) => {
        if (!usersList) {
            return;
        }

        const clonedUserList: UserListInterface = cloneDeep(usersList);

        clonedUserList.Resources = clonedUserList?.Resources?.map((resource: UserBasicInterface) => {
            const userStore: string = resource.userName.split("/").length > 1
                ? resource.userName.split("/")[0]
                : userstoresConfig.primaryUserstoreName;

            if (userStore !== userstoresConfig.primaryUserstoreName) {
                let email: string = null;

                if (resource?.emails instanceof Array) {
                    const emailElement: string | MultiValueAttributeInterface = resource?.emails[0];

                    if (typeof emailElement === "string") {
                        email = emailElement;
                    } else {
                        email = emailElement?.value;
                    }
                }

                resource.emails = [ email ];

                return resource;
            }

            return resource;
        });

        return moderateUsersList(clonedUserList, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET);
    };

    const usersList: UserListInterface = useMemo(() => transformUserList(originalUserList), [ originalUserList ]);

    /**
     * Fetches the read-only user stores.
     *
     * @param userstore - Userstore list.
     */
    const getReadOnlyUserStoresList = (userstore: UserStoreListItem[]): void => {
        SharedUserStoreUtils.getReadOnlyUserStores(userstore).then((response: string[]) => {
            setReadOnlyUserStoresList(response);
        });
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
        setListOffset(0);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === "all") {
            setSelectedUserStore(null);
        } else {
            setSelectedUserStore(data.value as string);
        }
    };

    const onUserDelete = (): void => {
        mutateUserListFetchRequest();
    };

    /**
     * Handles the click event of the create new user button.
     */
    const handleAddNewUserWizardClick = (): void => {
        setConnecterConfigLoading(true);
        getConnectorCategory(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
            .then((response: GovernanceConnectorCategoryInterface) => {
                const connectors: GovernanceConnectorInterface[]  = response?.connectors;
                const userOnboardingConnector: GovernanceConnectorInterface = connectors.find(
                    (connector: GovernanceConnectorInterface) => connector.id
                        === ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID
                );

                const emailVerification: ConnectorPropertyInterface = userOnboardingConnector.properties.find(
                    (property: ConnectorPropertyInterface) =>
                        property.name === ServerConfigurationsConstants.EMAIL_VERIFICATION_ENABLED);

                setEmailVerificationEnabled(emailVerification.value === "true");
            }).catch((error: AxiosError) => {
                handleAlerts({
                    description: error?.response?.data?.description ?? t(
                        "governanceConnectors:notifications." +
                        "getConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message ?? t(
                        "governanceConnectors:notifications." +
                        "getConnector.genericError.message"
                    )
                });
            }).finally(() => setConnecterConfigLoading(false));
    };

    const addUserDropdownTrigger: ReactElement = (
        <PrimaryButton
            data-componentid={ `${ testId }-add-user-button` }
            data-testid={ `${ testId }-add-user-button` }
        >
            <Icon name="add"/>
            { t("extensions:manage.users.buttons.addUserBtn") }
            <Icon name="dropdown" className="ml-3 mr-0"/>
        </PrimaryButton>
    );


    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            onFilter={ handleUserFilter }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: t("users:advancedSearch.form.dropdown." +
                        "filterAttributeOptions.username"),
                    value: "userName"
                },
                {
                    key: 1,
                    text: t("users:advancedSearch.form.dropdown." +
                        "filterAttributeOptions.email"),
                    value: "emails"
                },
                {
                    key: 2,
                    text: "First Name",
                    value: "name.givenName"
                },
                {
                    key: 3,
                    text: "Last Name",
                    value: "name.familyName"
                }
            ] }
            filterAttributePlaceholder={
                t("users:advancedSearch.form.inputs.filterAttribute" +
                    ".placeholder")
            }
            filterConditionsPlaceholder={
                t("users:advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("users:advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("users:advancedSearch.placeholder") }
            defaultSearchAttribute="userName"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
            disableSearchAndFilterOptions={ usersList?.totalResults <= 0 && !searchQuery }
        />
    );

    /**
     * Handles the `onClose` callback action from the bulk import wizard.
     */
    const handleBulkImportWizardClose = (): void => {
        setShowBulkImportWizard(false);
        mutateUserListFetchRequest();
    };

    const renderUsersList = (): ReactElement => {
        return (
            <ListLayout
                // TODO add sorting functionality.
                className="sub-org-users-list"
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ usersList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    isFirstLevelOrganization() || isSuperOrganization()
                        ? (<Dropdown
                            data-testid="user-mgt-user-list-userstore-dropdown"
                            selection
                            options={ userStoreOptions }
                            onChange={ handleDomainChange }
                            defaultValue={ userstoresConfig.primaryUserstoreName }
                            loading={ isUserStoreListFetchRequestLoading }
                            readonly={ userStoreOptions.length <= 1 }
                        />) : null
                }
                showPagination={ true }
                totalPages={ Math.ceil(usersList?.totalResults / listItemLimit) }
                totalListSize={ usersList?.totalResults }
                paginationOptions={ {
                    disableNextButton: !isNextPageAvailable
                } }
                isLoading={ isUserListFetchRequestLoading }
            >
                { userStoreListFetchRequestError
                    ? (<EmptyPlaceholder
                        subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                            t("users:placeholders.userstoreError.subtitles.1")     ] }
                        title={ t("users:placeholders.userstoreError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />)
                    : (<UsersList
                        advancedSearch={ advancedSearchFilter() }
                        usersList={ usersList }
                        onUserDelete={ onUserDelete }
                        userMetaListContent={ null }
                        realmConfigs={ realmConfigs }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid="user-mgt-user-list"
                        readOnlyUserStores={ readOnlyUserStoresList }
                        featureConfig={ featureConfig }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                    />)
                }
            </ListLayout>
        );
    };

    const getAddUserOptions = (): DropdownItemProps[] => {
        const dropDownOptions: DropdownItemProps[] = [];

        if (hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.create, allowedScopes)) {
            dropDownOptions.push({
                "data-componentid": `${componentId}-add-user-dropdown-item`,
                key: 1,
                text: t("users:addUserDropDown.addNewUser"),
                value: UserAccountTypesMain.EXTERNAL
            });
        }
        if (hasRequiredScopes(
            featureConfig?.bulkUserImport,
            featureConfig?.bulkUserImport?.scopes?.create,
            allowedScopes)) {
            dropDownOptions.push({
                "data-componentid": `${testId}-bulk-import-users-dropdown-item`,
                "data-testid": `${testId}-bulk-import-users-dropdown-item`,
                key: 2,
                text: t("users:addUserDropDown.bulkImport"),
                value: UserAddOptionTypes.BULK_IMPORT
            });
        }
        if (isSubOrganization() &&
            featureConfig?.guestUser?.enabled &&
            hasRequiredScopes(featureConfig?.guestUser, featureConfig?.guestUser?.scopes?.create, allowedScopes)) {
            dropDownOptions.push({
                "data-componentid": `${componentId}-invite-parent-user`,
                key: 3,
                text: t("parentOrgInvitations:addUserWizard.heading"),
                value: UserAccountTypesMain.INTERNAL
            });
        }

        return dropDownOptions;
    };

    const handleDropdownItemChange = (value: string): void => {
        handleAddNewUserWizardClick();
        switch (value) {
            case UserAccountTypesMain.EXTERNAL:
                eventPublisher.publish("manage-users-click-create-new", {
                    type: "user"
                });
                setShowWizard(true);
                setUserType(UserAccountTypesMain.EXTERNAL);

                break;
            case UserAddOptionTypes.BULK_IMPORT:
                setShowBulkImportWizard(true);

                break;
            case UserAccountTypesMain.INTERNAL:
                eventPublisher.publish("manage-users-click-invite-new", {
                    type: "user"
                });
                setShowInviteParentUserWizard(true);

                break;
        }
    };

    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        handleSearchQueryClear();
        if (data.activeIndex === 0) {
            setUserType(UserAccountTypesMain.INTERNAL);
        } else if (data.activeIndex === 1) {
            setUserType(UserAccountTypesMain.EXTERNAL);
        }
    };

    const renderUserDropDown = (): ReactElement => {
        return (
            <Dropdown
                data-componentid={ `${ componentId }-add-user-dropdown` }
                direction="left"
                floating
                icon={ null }
                trigger={ addUserDropdownTrigger }
            >
                <Dropdown.Menu >
                    { getAddUserOptions().map((option: {
                        "data-componentid": string;
                        key: number;
                        text: string;
                        value: UserAccountTypes;
                    }) => (
                        <Dropdown.Item
                            key={ option.value }
                            onClick={ ()=> handleDropdownItemChange(option.value) }
                            { ...option }
                        />
                    )) }
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const resolveAdminTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];

        panes.push({
            componentId: "users",
            menuItem: t("parentOrgInvitations:tab.usersTab"),
            render: renderUsersList
        });

        panes.push({
            componentId: "invitations",
            menuItem: t("parentOrgInvitations:tab.invitationsTab"),
            render: renderInvitationsList
        });

        return panes;
    };

    const renderInvitationsList = (): ReactElement => {
        return (
            <ListLayout
                className="sub-org-users-list"
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ usersList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-user-mgt-user-list-layout` }
                data-testid={ `${ testId }-user-mgt-user-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ usersList?.totalResults }
                isLoading={
                    isUserListFetchRequestLoading
                    || isParentOrgUserInviteListLoading
                }
                paginationOptions={ {
                    disableNextButton: !isUsersNextPageAvailable,
                    showItemsPerPageDropdown: selectedUserStore === userstoresConfig.primaryUserstoreName
                        ? true
                        : false
                } }
                showPaginationPageLimit={ !isSelectedUserStoreReadOnly }
                leftActionPanel={
                    (
                        <Dropdown
                            data-componentid={ `${ componentId }-list-userstore-dropdown` }
                            selection
                            options={ invitationStatusOptions }
                            onChange={ handleAccountStatusChange }
                            text={
                                t("parentOrgInvitations:filterLabel")
                                +  invitationStatusOption
                            }
                            disabled={
                                isParentOrgUserInviteListLoading
                            }
                        />
                    )
                }
            >
                {
                    userStoreListFetchRequestError
                        ? (
                            <EmptyPlaceholder
                                subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                                    t("users:placeholders.userstoreError.subtitles.1") ] }
                                title={ t("users:placeholders.userstoreError.title") }
                                image={ getEmptyPlaceholderIllustrations().genericError }
                                imageSize="tiny"
                            />
                        )
                        : (
                            <GuestUsersList
                                invitationStatusOption={ null }
                                onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                                onboardedGuestUserList={ usersList }
                                onSearchQueryClear={ handleSearchQueryClear }
                                guestUsersList={ finalGuestList }
                                getGuestUsersList={ () => mutateParentOrgUserInviteList() }
                                searchQuery={ searchQuery }
                                userTypeSelection={ UserAccountTypesMain.EXTERNAL }
                                data-testid={ testId }
                            />
                        )
                }
            </ListLayout>
        );
    };

    const handleAccountStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setInvitationStatusOption(data.value as string);
        setIsInvitationStatusOptionChanged(true);
    };

    const resolveTotalPages = (): number => {
        if (selectedUserStore === userstoresConfig.primaryUserstoreName) {
            return Math.ceil(usersList?.totalResults / listItemLimit);
        } else {
            /** Response from the LDAP only contains the total items per page.
             * No way to resolve the total number of items. So a large value will be set here and the
             * next button will be disabled if there are no more items to fetch.
            */
            return NUMBER_OF_PAGES_FOR_LDAP;
        }
    };

    const renderMultipleInviteConfirmationModel = (): ReactElement => {
        return (
            <ConfirmationModal
                data-componentid={ `${componentId}-select-multiple-invite-confirmation-modal` }
                onClose={ (): void => {
                    setShowMultipleInviteConfirmationModal(false);
                    setShowBulkImportWizard(false);
                } }
                type="warning"
                open={ showMultipleInviteConfirmationModal }
                primaryAction={ t("common:close") }
                onPrimaryActionClick={ (): void => {
                    setShowMultipleInviteConfirmationModal(false);
                    setShowBulkImportWizard(false);
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("users:confirmations.addMultipleUser.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("users:confirmations.addMultipleUser.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("users:confirmations.addMultipleUser.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    const handleInviteParentUserWizardClose = (): void => {
        setShowInviteParentUserWizard(false);
        mutateParentOrgUserInviteList();
    };

    return (
        <PageLayout
            action={
                hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.create, allowedScopes)
                && !isUserListFetchRequestLoading
                && (!isSubOrganization() || !isParentOrgUserInviteListLoading)
                && !isReadOnlyUserStore
                && renderUserDropDown()
            }
            title={ t("pages:users.title") }
            pageTitle={ t("pages:users.title") }
            description={ t("extensions:manage.users.usersSubTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            { isSubOrganization()
                ? (
                    <ResourceTab
                        activeIndex= { activeTabIndex }
                        data-testid= { `${ testId }-administrator-tabs` }
                        defaultActiveIndex={ 0 }
                        onTabChange={ handleTabChange }
                        panes= { resolveAdminTabPanes() }
                    />
                ) : renderUsersList()
            }
            {
                showWizard && (
                    <AddUserWizard
                        data-componentid={ "user-mgt-add-user-wizard-modal" }
                        data-testid={ "user-mgt-add-user-wizard-modal" }
                        isSubOrg={ isSubOrganization() }
                        closeWizard={ () => {
                            setShowWizard(false);
                            setEmailVerificationEnabled(undefined);
                        } }
                        emailVerificationEnabled={ emailVerificationEnabled }
                        onSuccessfulUserAddition={ (id: string) => {
                            mutateParentOrgUserInviteList();
                            mutateUserListFetchRequest();
                            eventPublisher.publish("manage-users-finish-creating-user");
                            history.push(AppConstants.getPaths().get("USER_EDIT").replace(":id", id));
                        } }
                        defaultUserTypeSelection={ selectedAddUserType }
                        userTypeSelection={ userType }
                        listOffset={ listOffset }
                        listItemLimit={ listItemLimit }
                        updateList={ () => mutateUserListFetchRequest() }
                        userStore= { selectedUserStore }
                    />
                )
            }
            {
                showBulkImportWizard
                && !connectorConfigLoading
                && emailVerificationEnabled
                && (
                    <BulkImportUserWizard
                        data-componentid="user-mgt-bulk-import-user-wizard-modal"
                        closeWizard={ handleBulkImportWizardClose }
                        userstore={ userstoresConfig.primaryUserstoreName }
                    />
                )
            }
            {
                showMultipleInviteConfirmationModal &&
                    renderMultipleInviteConfirmationModel()
            }
            {
                showInviteParentUserWizard && (
                    <InviteParentOrgUserWizard
                        closeWizard={ handleInviteParentUserWizardClose }
                        onUserInviteSuccess={ () => mutateParentOrgUserInviteList() }
                        data-componentid="user-mgt-invite-parent-user-wizard-modal"
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
UsersPage.defaultProps = {
    "data-componentid": "users",
    "data-testid": "users"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UsersPage;
