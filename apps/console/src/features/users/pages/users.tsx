/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { CommonHelpers, hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import { UsersConstants } from "apps/console/src/extensions/components/users/constants";
import { InvitationStatus } from "apps/console/src/extensions/components/users/models";
import { AxiosError, AxiosResponse } from "axios";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps, TabProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    UIConstants,
    UserBasicInterface,
    getAUserStore,
    getEmptyPlaceholderIllustrations,
    history,
    store
} from "../../core";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface,
    RealmConfigInterface,
    ServerConfigurationsConstants,
    ServerConfigurationsInterface,
    getConnectorCategory,
    getServerConfigs
} from "../../server-configurations";
import { getUserStoreList } from "../../userstores/api";
import { CONSUMER_USERSTORE, PRIMARY_USERSTORE } from "../../userstores/constants/user-store-constants";
import { UserStoreListItem, UserStorePostData, UserStoreProperty } from "../../userstores/models/user-stores";
import { getUsersList } from "../api";
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
import { UserListInterface } from "../models";

interface UserStoreItem {
    key: number;
    text: string;
    value: string;
}

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

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showBulkImportWizard, setShowBulkImportWizard ] = useState<boolean>(false);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState<string>(PRIMARY_USERSTORE.toLocaleLowerCase());
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ userStoreError, setUserStoreError ] = useState(false);
    const [ emailVerificationEnabled, setEmailVerificationEnabled ] = useState<boolean>(undefined);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(undefined);
    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);
    const [ selectedAddUserType ] = useState<UserAccountTypes>(UserAccountTypes.USER);
    const [ userType, setUserType ] = useState<string>();
    const [ selectedUserStore ] = useState<string>(CONSUMER_USERSTORE);
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

    const { isSubOrganization, isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const tenantName: string = store.getState().config.deployment.tenant;
    const tenantSettings: Record<string, any> = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const invitationStatusOptions: DropdownItemProps[] = [
        {
            key: 2,
            text: t("console:manage.features.parentOrgInvitations.searchdropdown.pendingLabel"),
            value: "Pending"
        },
        {
            key: 3,
            text: t("console:manage.features.parentOrgInvitations.searchdropdown.expiredLabel"),
            value: "Expired"
        }
    ];

    const {
        data: parentOrgUserInviteList,
        isLoading: isParentOrgUserInviteListLoading,
        mutate: mutateParentOrgUserInviteList
    } = useGetParentOrgUserInvites();

    /**
     * Fetch the list of available userstores.
     */
    useEffect(() => {
        if (isSubOrganization()) {
            return;
        }

        if (CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings: Record<string, any> = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences: Record<string, any> = userSettings[1];
            const tempColumns: Map<string, string> = new Map<string, string> ();

            if (userPreferences.identityAppsSettings.userPreferences.userListColumns.length < 1) {
                const metaColumns: string[] = UserManagementConstants.DEFAULT_USER_LIST_ATTRIBUTES;

                setUserMetaColumns(metaColumns);
                metaColumns.map((column: string) => {
                    if (column === "id") {
                        tempColumns.set(column, "");
                    } else {
                        tempColumns.set(column, column);
                    }
                });
                setUserListMetaContent(tempColumns);
            }
            userPreferences.identityAppsSettings.userPreferences.userListColumns.map((column: any) => {
                tempColumns.set(column, column);
            });
            setUserListMetaContent(tempColumns);
        }

        getUserStores();
        getReadOnlyUserStoresList();
        getAdminUser();
    }, []);

    useEffect(() => {
        const attributes: string = userListMetaContent ? generateAttributesString(userListMetaContent?.values()) : null;

        getList(listItemLimit, listOffset, null, attributes, userStore);
    }, [ listItemLimit, listOffset, userStore ]);

    /**
     * Handles the parent user invitations search query changes.
     */
    useEffect(() => {
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
        if (!isListUpdated) {
            return;
        }
        const attributes: string = generateAttributesString(userListMetaContent?.values());

        getList(listItemLimit, listOffset, null, attributes, userStore);
        setListUpdated(false);
    }, [ isListUpdated ]);

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

    const getReadOnlyUserStoresList = (): void => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response: string[]) => {
            setReadOnlyUserStoresList(response);
        });
    };

    //TODO: Use the useUsersList SWR hook to fetch the user data.
    const getList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
        setUserListRequestLoading(true);

        const modifiedLimit : number = limit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;

        getUsersList(modifiedLimit, offset, filter, attribute, domain, "groups,roles")
            .then((response: UserListInterface) => {
                const data: UserListInterface = { ...response };

                data.Resources = data?.Resources?.map((resource: UserBasicInterface) => {
                    const userStore: string = resource.userName.split("/").length > 1
                        ? resource.userName.split("/")[0]
                        : "Primary";

                    if (userStore !== CONSUMER_USERSTORE) {
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
                    } else {
                        const resources: UserBasicInterface[] = [ ...data.Resources ];

                        resources.splice(resources.indexOf(resource), 1);
                        data.Resources = resources;
                    }
                });

                setUsersList(moderateUsersList(data, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET));
                setUserStoreError(false);
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));

                setUserStoreError(true);
                setUsersList({
                    Resources: [],
                    itemsPerPage: 10,
                    links: [],
                    startIndex: 1,
                    totalResults: 0
                });
            })
            .finally(() => {
                setUserListRequestLoading(false);
            });
    };

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
     * The following function fetch the userstore list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions: UserStoreItem[] = [
            {
                key: -1,
                text: t("console:manage.features.users.userstores.userstoreOptions.primary"),
                value: "primary"
            }
        ];

        let storeOption: UserStoreItem = {
            key: null,
            text: "",
            value: ""
        };

        getUserStoreList()
            .then((response: AxiosResponse<UserStoreListItem[]>) => {
                if (storeOptions.length === 0) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store: UserStoreListItem, index: number) => {
                    if (store.name !== CONSUMER_USERSTORE) {
                        getAUserStore(store.id).then((response: UserStorePostData) => {
                            const isDisabled: boolean = response.properties.find(
                                (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                            if (!isDisabled) {
                                storeOption = {
                                    key: index,
                                    text: store.name,
                                    value: store.name
                                };
                                storeOptions.push(storeOption);
                            }
                        });
                    }
                }
                );
                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @returns string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray: any[] = [];

        if (attributeMap) {
            const iterator1: IterableIterator<string> = attributeMap[Symbol.iterator]();

            for (const attribute of iterator1) {
                if (attribute !== "") {
                    attArray.push(attribute);
                }
            }
        }

        if (!attArray.includes(UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"))) {
            attArray.push(UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"));
        }

        return attArray.toString();
    };

    /**
     * Util method to get super admin
     */
    const getAdminUser = () => {
        getServerConfigs()
            .then((response: ServerConfigurationsInterface) => {
                setRealmConfigs(response?.realmConfig);
            });
    };

    /**
     * The following method set the user preferred columns to the local storage.
     *
     * @param metaColumns - string[]
     */
    const setUserMetaColumns = (metaColumns: string[]) => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings: Record<string, any> = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences: Record<string, any> = userSettings[1];

            const newUserSettings: Record<string, any> = {
                ...tenantSettings,
                [ username ]: {
                    ...userPreferences,
                    identityAppsSettings: {
                        ...userPreferences.identityAppsSettings,
                        userPreferences: {
                            ...userPreferences.identityAppsSettings.userPreferences,
                            userListColumns: metaColumns
                        }
                    }
                }
            };

            LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify(newUserSettings));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getList(listItemLimit, listOffset, null, null, userStore);
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
        const attributes: string = generateAttributesString(userListMetaContent?.values());

        if (query === "userName sw ") {
            getList(listItemLimit, listOffset, null, attributes, userStore);

            return;
        }

        setSearchQuery(query);
        setListOffset(0);
        getList(listItemLimit, listOffset, query, attributes, userStore);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === "all") {
            setUserStore(null);
        } else {
            setUserStore(data.value as string);
        }
    };

    const onUserDelete = (): void => {
        setListUpdated(true);
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
                        "console:manage.features.governanceConnectors.notifications." +
                        "getConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message ?? t(
                        "console:manage.features.governanceConnectors.notifications." +
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
                    text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                        "filterAttributeOptions.username"),
                    value: "userName"
                },
                {
                    key: 1,
                    text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                        "filterAttributeOptions.email"),
                    value: "emails"
                }
            ] }
            filterAttributePlaceholder={
                t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute" +
                    ".placeholder")
            }
            filterConditionsPlaceholder={
                t("console:manage.features.users.advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("console:manage.features.users.advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("console:manage.features.users.advancedSearch.placeholder") }
            defaultSearchAttribute="userName"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
        />
    );

    /**
     * Handles the `onClose` callback action from the bulk import wizard.
     */
    const handleBulkImportWizardClose = (): void => {
        setShowBulkImportWizard(false);
        getList(listItemLimit, listOffset, null, null, userStore);
    };

    const renderUsersList = (): ReactElement => {
        return (
            <ListLayout
                // TODO add sorting functionality.
                className="sub-org-users-list"
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ usersList.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    isFirstLevelOrganization() || isSuperOrganization()
                        ? (<Dropdown
                            data-testid="user-mgt-user-list-userstore-dropdown"
                            selection
                            options={ userStoreOptions && userStoreOptions }
                            onChange={ handleDomainChange }
                            defaultValue={ PRIMARY_USERSTORE.toLocaleLowerCase() }
                        />) : null
                }
                showPagination={ true }
                showTopActionPanel={ isUserListRequestLoading
                    || !(!searchQuery
                        && !userStoreError
                        && userStoreOptions.length < 3
                        && usersList?.totalResults <= 0) }
                totalPages={ Math.ceil(usersList.totalResults / listItemLimit) }
                totalListSize={ usersList.totalResults }
                paginationOptions={ {
                    disableNextButton: !isNextPageAvailable
                } }
                isLoading={ isUserListRequestLoading }
            >
                { userStoreError
                    ? (<EmptyPlaceholder
                        subtitle={ [ t("console:manage.features.users.placeholders.userstoreError.subtitles.0"),
                            t("console:manage.features.users.placeholders.userstoreError.subtitles.1")     ] }
                        title={ t("console:manage.features.users.placeholders.userstoreError.title") }
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
                    />)
                }
            </ListLayout>
        );
    };

    const getAddUserOptions = (): DropdownItemProps[] => {
        const dropDownOptions: DropdownItemProps[] = [];

        if (hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.create, allowedScopes)) {
            dropDownOptions.push({
                "data-componentid": `${componentId}-add-user`,
                key: 1,
                text: t("console:manage.features.users.addUserDropDown.addNewUser"),
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
                text: t("console:manage.features.users.addUserDropDown.bulkImport"),
                value: UserAddOptionTypes.BULK_IMPORT
            });
        }
        if (isSubOrganization() &&
            featureConfig?.guestUser?.enabled &&
            hasRequiredScopes(featureConfig?.guestUser, featureConfig?.guestUser?.scopes?.create, allowedScopes)) {
            dropDownOptions.push({
                "data-componentid": `${componentId}-invite-parent-user`,
                key: 3,
                text: t("console:manage.features.parentOrgInvitations.addUserWizard.heading"),
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

    const showUserWizard = (): ReactElement => {
        return (
            <AddUserWizard
                data-componentid={ `${ componentId }-user-mgt-add-user-wizard-modal` }
                data-testid={ `${ testId }-user-mgt-add-user-wizard-modal` }
                isSubOrg={ isSubOrg }
                closeWizard={ () => {
                    setShowWizard(false);
                    setEmailVerificationEnabled(undefined);
                } }
                emailVerificationEnabled={ emailVerificationEnabled }
                onSuccessfulUserAddition={ (id: string) => {
                    mutateParentOrgUserInviteList();
                    eventPublisher.publish("manage-users-finish-creating-user");
                    history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH")
                        .replace(":id", id));
                } }
                defaultUserTypeSelection={ selectedAddUserType }
                userTypeSelection={ userType }
                listOffset={ listOffset }
                listItemLimit={ listItemLimit }
                updateList={ () => setListUpdated(true) }
                userStore= { userStore }
            />
        );
    };

    const resolveAdminTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];

        panes.push({
            componentId: "users",
            menuItem: t("console:manage.features.parentOrgInvitations.tab.usersTab"),
            render: renderUsersList
        });

        panes.push({
            componentId: "invitations",
            menuItem: t("console:manage.features.parentOrgInvitations.tab.invitationsTab"),
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
                    isUserListRequestLoading
                    || isParentOrgUserInviteListLoading
                }
                paginationOptions={ {
                    disableNextButton: !isUsersNextPageAvailable,
                    showItemsPerPageDropdown: selectedUserStore === CONSUMER_USERSTORE
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
                                t("console:manage.features.parentOrgInvitations.filterLabel")
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
                    userStoreError
                        ? (
                            <EmptyPlaceholder
                                subtitle={ [ t("console:manage.features.users.placeholders.userstoreError.subtitles.0"),
                                    t("console:manage.features.users.placeholders.userstoreError.subtitles.1") ] }
                                title={ t("console:manage.features.users.placeholders.userstoreError.title") }
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
        if (selectedUserStore === CONSUMER_USERSTORE) {
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
                    { t("console:manage.features.users.confirmations.addMultipleUser.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("console:manage.features.users.confirmations.addMultipleUser.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("console:manage.features.users.confirmations.addMultipleUser.content") }
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
                !isUserListRequestLoading
                && !isParentOrgUserInviteListLoading
                && (
                    <Show when={ AccessControlConstants.USER_WRITE }>
                        { renderUserDropDown() }
                    </Show>
                )
            }
            title={ t("console:manage.pages.users.title") }
            pageTitle={ t("console:manage.pages.users.title") }
            description={ t("extensions:manage.users.usersSubTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            { isSubOrg
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
                showWizard && showUserWizard()
            }
            {
                showBulkImportWizard
                && !connectorConfigLoading
                && emailVerificationEnabled
                && (
                    <BulkImportUserWizard
                        data-componentid="user-mgt-bulk-import-user-wizard-modal"
                        closeWizard={ handleBulkImportWizardClose }
                        userstore={ PRIMARY_USERSTORE }
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
