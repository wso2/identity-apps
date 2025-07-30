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

import Chip from "@oxygen-ui/react/Chip";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { FeatureStatus, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { userConfig } from "@wso2is/admin.extensions.v1/configs";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface,
    RealmConfigInterface,
    ServerConfigurationsConstants,
    getConnectorCategory,
    useServerConfigs
} from "@wso2is/admin.server-configurations.v1";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import {
    UserStoreItem,
    UserStoreListItem
} from "@wso2is/admin.userstores.v1/models/user-stores";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    ProfileSchemaInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DropdownChild } from "@wso2is/forms";
import {
    ConfirmationModal,
    DocumentationLink,
    EmptyPlaceholder,
    Link,
    ListLayout,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface,
    useDocumentation
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
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, Label, PaginationProps, TabProps } from "semantic-ui-react";
import { useUsersList } from "../api";
import AccountStatusFilterDropdown from "../components/AccountStatusFilterDropdown";
import { useGetParentOrgUserInvites } from "../components/guests/api/use-get-parent-org-user-invites";
import { UserInviteInterface } from "../components/guests/models/invite";
import { GuestUsersList } from "../components/guests/pages/guest-users-list";
import { UsersList } from "../components/users-list";
import { AddUserWizard } from "../components/wizard/add-user-wizard";
import { BulkImportUserWizard } from "../components/wizard/bulk-import-user-wizard";
import { InviteParentOrgUserWizard } from "../components/wizard/invite-parent-org-user-wizard";
import {
    USER_ACCOUNT_STATUS_FILTER_OPTIONS,
    UserAccountTypes,
    UserAccountTypesMain,
    UserAddOptionTypes,
    UserManagementConstants
} from "../constants";
import { InvitationStatus, UserListInterface } from "../models/user";
import "./users.scss";
import { resolveUserSearchAttributes } from "../utils/user-management-utils";

/**
 * Props for the Users page.
 */
type UsersPageInterface = IdentifiableComponentInterface & RouteComponentProps & TestableComponentInterface;

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

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
    const { getLink } = useDocumentation();

    const dispatch: Dispatch<any> = useDispatch();

    const showStatusLabelForNewAuthzRuntimeFeatures: boolean =
        window["AppUtils"]?.getConfig()?.ui?.showStatusLabelForNewAuthzRuntimeFeatures;

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const {
        isLoading: isUserStoreListFetchRequestLoading,
        isUserStoreReadOnly,
        mutateUserStoreList,
        readOnlyUserStoreNamesList,
        userStoresList
    } = useUserStores();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasUsersCreatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.create
    );
    const hasBulkUserImportCreatePermissions: boolean = useRequiredScopes(
        featureConfig?.bulkUserImport?.scopes?.create
    );
    const hasGuestUserCreatePermissions: boolean = useRequiredScopes(
        featureConfig?.guestUser?.scopes?.create
    );

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(1);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showBulkImportWizard, setShowBulkImportWizard ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ emailVerificationEnabled, setEmailVerificationEnabled ] = useState<boolean>(undefined);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(undefined);
    const [ isInvitedUsersNextPageAvailable, setIsInvitedUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ selectedAddUserType ] = useState<UserAccountTypes>(UserAccountTypes.USER);
    const [ userType, setUserType ] = useState<string>();
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(userstoresConfig.primaryUserstoreName);
    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>(InvitationStatus.PENDING);
    const [ isSelectedUserStoreReadOnly ] = useState<boolean>(false);
    const [ isInvitationStatusOptionChanged, setIsInvitationStatusOptionChanged ] = useState<boolean>(false);
    const [ finalGuestList, setFinalGuestList ] = useState<UserInviteInterface[]>([]);
    const [ paginatedGuestList, setPaginateGuestList ] = useState<UserInviteInterface[]>([]);
    const [ showMultipleInviteConfirmationModal, setShowMultipleInviteConfirmationModal ] = useState<boolean>(false);
    const [ connectorConfigLoading, setConnecterConfigLoading ] = useState<boolean>(false);
    const [ showInviteParentUserWizard, setShowInviteParentUserWizard ] = useState<boolean>(false);
    const [ invitedUserListItemLimit, setInvitedUserListItemLimit ]
        = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ invitedUserListOffset, setInvitedUserListOffset ] = useState<number>(1);
    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state?.profile?.profileSchemas);
    const systemReservedUserStores: string[] =
        useSelector((state: AppState) => state?.config?.ui?.systemReservedUserStores);

    const [ selectedAccountStatusFilters, setSelectedAccountStatusFilters ] = useState<string[]>([]);

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

    // Combine the search query and account status filters query.
    const combinedUserFilter: string = useMemo(() => {
        let baseFilter: string | null = searchQuery === "" ? null : searchQuery;

        if (selectedAccountStatusFilters.length > 0) {
            const scimFilterExpressions: string[] = selectedAccountStatusFilters.map((filterKey: string) => {
                const filterOption: DropdownChild = USER_ACCOUNT_STATUS_FILTER_OPTIONS.find(
                    (option: DropdownChild) => option.key === filterKey);

                return filterOption ? filterOption.value : "";
            }).filter((scimFilterExpression: string) => scimFilterExpression !== "");

            if (scimFilterExpressions.length > 0) {
                const accountStatusFilter: string = scimFilterExpressions.join(" and ");

                if (baseFilter) {
                    baseFilter = `${baseFilter} and ${accountStatusFilter}`;
                } else {
                    baseFilter = accountStatusFilter;
                }
            }
        }

        return baseFilter;
    }, [ searchQuery, selectedAccountStatusFilters ]);

    // Get users list.
    const {
        data: originalUserList,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError,
        mutate: mutateUserListFetchRequest
    } = useUsersList(
        modifiedLimit,
        listOffset,
        combinedUserFilter,
        null,
        selectedUserStore,
        excludedAttributes
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

        if (userStoresList?.length > 0) {
            userStoresList.forEach((store: UserStoreListItem, index: number) => {
                if (
                    store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName
                        && store.enabled
                        && !systemReservedUserStores?.includes(store.name)
                ) {
                    const storeOption: UserStoreItem = {
                        disabled: store.typeName === RemoteUserStoreManagerType.RemoteUserStoreManager,
                        key: index,
                        text: store.name,
                        value: store.name
                    };

                    storeOptions.push(storeOption);
                }
            });
        }

        return storeOptions;
    }, [ userStoresList ]);

    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        return isUserStoreReadOnly(selectedUserStore);
    }, [ selectedUserStore, readOnlyUserStoreNamesList ]);

    /**
     * As there is a delay in updating user stores,
     * user stores list needs be mutated in page load to avoid stale data.
     */
    useEffect(() => {
        mutateUserStoreList();
    }, []);

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
     * Handles the parent user invitations search query changes.
     */
    useEffect(() => {
        if (!isSubOrganization()) {
            return;
        }

        setInvitedUserListOffset(1);
        if (searchQuery === "userName co " || searchQuery === "" || searchQuery === null) {
            setPaginateGuestList(parentOrgUserInviteList?.invitations);

            return;
        } else if (searchQuery) {
            let searchList: UserInviteInterface[] = parentOrgUserInviteList?.invitations;

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
        setPaginateGuestList(parentOrgUserInviteList?.invitations?.filter((invitation: UserInviteInterface) =>
            invitation.status === InvitationStatus.PENDING.toUpperCase()));

    }, [ parentOrgUserInviteList?.invitations ]);

    /**
     * Handles pagination for pending/expired Guest as the API does not support pagination.
     */
    useEffect(() => {
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            return;
        }

        let finalInvitations: UserInviteInterface[] = paginatedGuestList?.filter(
            (invitation: UserInviteInterface) => invitation.status === invitationStatusOption.toUpperCase());

        if (finalInvitations?.length > invitedUserListItemLimit) {
            const _startIndex: number = invitedUserListOffset - 1;

            finalInvitations = finalInvitations.slice(_startIndex, _startIndex + invitedUserListItemLimit);
            setFinalGuestList(finalInvitations);
            setIsInvitedUsersNextPageAvailable(finalInvitations.length === invitedUserListItemLimit);
        } else {
            setFinalGuestList(finalInvitations);
            setIsInvitedUsersNextPageAvailable(false);
        }
    }, [ paginatedGuestList, invitedUserListOffset, invitedUserListItemLimit, isInvitationStatusOptionChanged,
        invitationStatusOption ]);

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
     * Resolves the attributes by which the users can be searched.
     */
    const userSearchAttributes: DropdownChild[] = useMemo(() => {
        return resolveUserSearchAttributes(profileSchemas);
    }, [ profileSchemas ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setSelectedAccountStatusFilters([]);
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
        setListOffset(1);
        setInvitedUserListOffset(1);
    };

    const handleSelectedAccountStatusFiltersChange = (statuses: string[]): void => {
        setSelectedAccountStatusFilters(statuses);
        setListOffset(1);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset(((data.activePage as number - 1) * listItemLimit) + 1);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleInvitedUserPaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setInvitedUserListOffset(((data.activePage as number - 1) * invitedUserListItemLimit) + 1);
    };

    const handleInvitedUserItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => {
        setInvitedUserListItemLimit(data.value as number);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === "all") {
            setSelectedUserStore(null);
        } else {
            setSelectedUserStore(data.value as string);
        }
        setListOffset(1);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    };

    const onUserDelete = (): void => {
        mutateUserListFetchRequest();
    };

    const resolveFilterAttributeOptions = (useConsoleAttributeList: boolean): DropdownChild[] => {
        let filterAttributeOptions: DropdownChild[] = [
            {
                key: 0,
                text: t("users:advancedSearch.form.dropdown." + "filterAttributeOptions.username"),
                value: "userName"
            }
        ];

        if (useConsoleAttributeList) {
            filterAttributeOptions = filterAttributeOptions.concat(userSearchAttributes);
        }

        return filterAttributeOptions;
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

    /**
     * Renders an advanced search filter for users list and invitations list.
     *
     * @param isUserList - If `true`, allows filtering by other available attributes.
     *                     If `false`, allows filtering only by username (for invitation list).
     * @returns The search filter component.
     */
    const advancedSearchFilter = (isUserList: boolean): ReactElement => (
        <AdvancedSearchWithBasicFilters
            onFilter={ handleUserFilter }
            filterAttributeOptions={ resolveFilterAttributeOptions(isUserList) }
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
     * Renders the account status filter component.
     *
     * @returns The account status filter component.
     */
    const accountStatusFilter = (): ReactElement => ((
        <AccountStatusFilterDropdown
            selectedFilters={ selectedAccountStatusFilters }
            onChange={ handleSelectedAccountStatusFiltersChange }
        />
    ));

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
                advancedSearch={ (
                    <>
                        { advancedSearchFilter(true) }
                        { accountStatusFilter() }
                    </>
                ) }
                currentListSize={ usersList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    (<Dropdown
                        data-testid="user-mgt-user-list-userstore-dropdown"
                        selection
                        options={ userStoreOptions }
                        onChange={ handleDomainChange }
                        defaultValue={ userstoresConfig.primaryUserstoreName }
                        loading={ isUserStoreListFetchRequestLoading }
                        readonly={ userStoreOptions.length <= 1 }
                    />)
                }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ usersList?.totalResults }
                paginationOptions={ {
                    disableNextButton: !isNextPageAvailable,
                    showItemsPerPageDropdown:
                        !userConfig?.hiddenItemsPerPageRemoteUserStoreDropdown
                        || selectedUserStore === userstoresConfig.primaryUserstoreName
                } }
                isLoading={ isUserListFetchRequestLoading }
            >
                { selectedAccountStatusFilters.length > 0 && (
                    <Label.Group>
                        { selectedAccountStatusFilters.map((filterKey: string) => {
                            const filterOption: DropdownChild =
                                USER_ACCOUNT_STATUS_FILTER_OPTIONS
                                    .find((option: DropdownChild) => option.key === filterKey);

                            if (!filterOption) {
                                return null;
                            }

                            return (
                                <Label
                                    key={ filterKey }
                                    className="filter-label active basic"
                                    as="a"
                                    onClick={ () => handleAccountStatusFilterRemove(filterKey) }
                                    data-componentid={
                                        `${componentId}-account-status-filter-label-${filterKey}` }
                                >
                                    { t(filterOption.text as string) }
                                    <XMarkIcon className="filter-label-close-icon" />
                                </Label>
                            );
                        }) }
                    </Label.Group>
                ) }
                { !isUserStoreListFetchRequestLoading && userStoreOptions?.length === 0
                    ? (<EmptyPlaceholder
                        subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                            t("users:placeholders.userstoreError.subtitles.1")     ] }
                        title={ t("users:placeholders.userstoreError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />)
                    : (<UsersList
                        advancedSearch={ advancedSearchFilter(true) }
                        usersList={ usersList }
                        onUserDelete={ onUserDelete }
                        userMetaListContent={ null }
                        realmConfigs={ realmConfigs }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ combinedUserFilter }
                        data-testid="user-mgt-user-list"
                        featureConfig={ featureConfig }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                    />)
                }
            </ListLayout>
        );
    };

    const getAddUserOptions = (): DropdownItemProps[] => {
        const dropDownOptions: DropdownItemProps[] = [];

        if (hasUsersCreatePermissions) {
            dropDownOptions.push({
                "data-componentid": `${componentId}-add-user-dropdown-item`,
                key: 1,
                text: t("users:addUserDropDown.addNewUser"),
                value: UserAccountTypesMain.EXTERNAL
            });
        }
        if (hasBulkUserImportCreatePermissions) {
            dropDownOptions.push({
                "data-componentid": `${testId}-bulk-import-users-dropdown-item`,
                "data-testid": `${testId}-bulk-import-users-dropdown-item`,
                key: 2,
                text: t("users:addUserDropDown.bulkImport"),
                value: UserAddOptionTypes.BULK_IMPORT
            });
        }
        if (isSubOrganization() &&
            featureConfig?.parentUserInvitation?.enabled &&
            hasGuestUserCreatePermissions) {
            dropDownOptions.push({
                className: "users-invite-parent-user",
                "data-componentid": `${componentId}-invite-parent-user`,
                key: 3,
                text: <>
                    { t("parentOrgInvitations:addUserWizard.heading") }
                    { showStatusLabelForNewAuthzRuntimeFeatures
                      && (
                          <Chip
                              size="small"
                              label={ t(FeatureStatusLabel.NEW) }
                              className="oxygen-chip-new"
                          />
                      ) }
                </>,
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

        if (featureConfig?.parentUserInvitation?.enabled) {
            panes.push({
                componentId: "invitations",
                menuItem: t("parentOrgInvitations:tab.invitationsTab"),
                render: renderInvitationsList
            });
        }

        return panes;
    };

    const renderInvitationsList = (): ReactElement => {
        return (
            <ListLayout
                className="sub-org-users-list"
                advancedSearch={ advancedSearchFilter(false) }
                currentListSize={ parentOrgUserInviteList?.invitations?.length || null }
                listItemLimit={ invitedUserListItemLimit }
                onItemsPerPageDropdownChange={ handleInvitedUserItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-user-mgt-user-list-layout` }
                data-testid={ `${ testId }-user-mgt-user-list-layout` }
                onPageChange={ handleInvitedUserPaginationChange }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ finalGuestList?.length }
                isLoading={
                    isUserListFetchRequestLoading
                    || isParentOrgUserInviteListLoading
                }
                paginationOptions={ {
                    disableNextButton: !isInvitedUsersNextPageAvailable,
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
                    !isUserStoreListFetchRequestLoading && userStoreOptions?.length === 0
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

        /**
         * The total number of pages is required for the pagination component.
         *
         * Based on the listOffset and listItemLimit, we can calculate the current page number.
         * Setting the total number of pages to current page number + 1 ensures that the
         * Next button in the pagination component is functioning properly.
         */
        return ((listOffset - 1) / listItemLimit) + 2;
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
                    <Trans i18nKey="users:confirmations.addMultipleUser.content">
                        Invite User to Set Password should be enabled to add multiple users.
                        Please enable email invitations for user password setup from
                        <Link
                            onClick={ () => history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                                .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                                .replace(":connectorId", ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID)) }
                            external={ false }>
                            Login & Registration settings
                        </Link>
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    const handleInviteParentUserWizardClose = (): void => {
        setShowInviteParentUserWizard(false);
        mutateParentOrgUserInviteList();
    };

    /**
     * Handles removing a account status filter.
     *
     * @param filterKey - The key of the filter to remove
     */
    const handleAccountStatusFilterRemove = (filterKey: string): void => {
        setSelectedAccountStatusFilters(
            (statusFilterKeys: string[]) =>
                statusFilterKeys.filter(
                    (statusFilterKey: string) =>
                        statusFilterKey !== filterKey
                ));
        setListOffset(1);
    };

    return (
        <PageLayout
            action={
                hasUsersCreatePermissions
                && !isUserListFetchRequestLoading
                && (!isSubOrganization() || !isParentOrgUserInviteListLoading)
                && !isReadOnlyUserStore
                && renderUserDropDown()
            }
            title={ t("pages:users.title") }
            pageTitle={ t("pages:users.title") }
            description={ (
                <>
                    { t("extensions:manage.users.usersSubTitle") }
                    <DocumentationLink
                        link={ getLink("manage.users.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
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
                            if (!id) {
                                history.push(AppConstants.getPaths().get("USERS"));

                                return;
                            }

                            mutateParentOrgUserInviteList();
                            mutateUserListFetchRequest();
                            eventPublisher.publish("manage-users-finish-creating-user");

                            history.push(AppConstants.getPaths().get("USER_EDIT")?.replace(":id", id));
                        } }

                        defaultUserTypeSelection={ selectedAddUserType }
                        userTypeSelection={ userType }
                        listOffset={ listOffset }
                        listItemLimit={ listItemLimit }
                        updateList={ () => mutateUserListFetchRequest() }
                        userStore= { selectedUserStore ?? userstoresConfig.primaryUserstoreName }
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
                        userstore={ selectedUserStore ?? userstoresConfig.primaryUserstoreName }
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
