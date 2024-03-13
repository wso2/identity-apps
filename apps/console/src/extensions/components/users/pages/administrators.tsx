/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AccessControlConstants, FeatureStatus, Show, useCheckFeatureStatus } from "@wso2is/access-control";
import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { MultiValueAttributeInterface } from "@wso2is/core/src/models";
import { addAlert } from "@wso2is/core/store";
import {
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    ListLayout,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import {
    Button,
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    PaginationProps,
    TabProps
} from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    UserBasicInterface,
    UserRoleInterface,
    UserStoreDetails,
    history,
    store
} from "../../../../features/core";
import { getRoleById, searchRoleList } from "../../../../features/roles/api/roles";
import { SearchRoleInterface } from "../../../../features/roles/models/roles";
import { useServerConfigs } from "../../../../features/server-configurations";
import { useUsersList } from "../../../../features/users/api";
import { AddUserWizard } from "../../../../features/users/components/wizard/add-user-wizard";
import { InternalAdminUserListInterface, UserListInterface } from "../../../../features/users/models";
import { UserManagementUtils } from "../../../../features/users/utils";
import { administratorConfig } from "../../../configs/administrator";
import { SCIMConfigs } from "../../../configs/scim";
import { FeatureGateConstants } from "../../feature-gate/constants/feature-gate";
import { TenantInfo } from "../../tenants/models";
import { getAssociationType } from "../../tenants/utils/tenants";
import { getAgentConnections } from "../../user-stores/api";
import { AgentConnectionInterface } from "../../user-stores/models";
import { getUserStores, useInvitedUsersList } from "../api";
import { useOrganizationConfig } from "../api/organization";
import { GuestUsersList, OnboardedGuestUsersList } from "../components";
import {
    ADVANCED_USER_MGT,
    AdminAccountTypes,
    CONSUMER_USERSTORE,
    PRIMARY_USERSTORE,
    UserAccountTypes,
    UsersConstants
} from "../constants";
import { InvitationStatus, UserInviteInterface } from "../models";
import { AddUserWizard as AddUserEmailInviteWizard } from "../wizard";

/**
 * Props for the Users page.
 */
type CollaboratorsPageInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @typeParam TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET - Temporary resource limit offset.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * enum for admin tab index.
 */
enum TabIndex {
    EXTERNAL_ADMINS = 0,
    INTERNAL_ADMINS = 1,
}

/**
 * Users listing page.
 *
 * @param props - Props injected to the component.
 * @returns Administrator page react component.
 */
const CollaboratorsPage: FunctionComponent<CollaboratorsPageInterface> = (
    props: CollaboratorsPageInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid"]: componentId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(
        FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const tenantedConsoleUrl: string = useSelector((state: AppState) => state?.config?.deployment?.clientHost);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);
    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);
    const authUserTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);

    const [ isGuestUsersNextPageAvailable, setIsGuestUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ searchInternalAdminQuery, setSearchInternalAdminQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ showExtenalAdminWizard, setShowExtenalAdminWizard ] = useState<boolean>(false);
    const [ rolesList ] = useState([]);

    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>(InvitationStatus.ACCEPTED);
    const [ isInvitationStatusOptionChanged, setIsInvitationStatusOptionChanged ] = useState<boolean>(false);

    const [ paginatedGuestList, setPaginateGuestList ] = useState<UserInviteInterface[]>([]);
    const [ finalGuestList, setFinalGuestList ] = useState<UserInviteInterface[]>([]);
    const [ filterGuestList, setFilterGuestList ] = useState<UserInviteInterface[]>([]);
    const [ readOnlyUserStoresList , setReadOnlyUserStoresList ] = useState<string[]>([]);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ isAdvancedUserManagementDisabled, setAdvancedUserManagementDisabled ] = useState<boolean>(true);
    const [ selectedAddAdminType, setSelectedAddAdminType ] = useState<AdminAccountTypes>(AdminAccountTypes.INTERNAL);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(CONSUMER_USERSTORE);
    const [ remoteUserStoreId, setRemoteUserStoreId ] = useState<string>(null);
    const [ remoteUserStoreConnectionStatus, setRemoteUserStoreConnectionStatus ] = useState<boolean>(false);
    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);
    const [ isUserStoreListLoading, setUserStoreListLoading ] = useState<boolean>(false);
    const [ isUserStoreDropdownDisabled, setUserStoreDropdownDisabled ] = useState<boolean>(false);
    const [ isSelectedUserStoreReadOnly, setSelectedUserStoreReadOnly ] = useState<boolean>(false);
    const [ isUserStoreChanged, setUserStoreChanged ] = useState<boolean>(false);
    const [ isInternalAdminUserListFetchRequestLoading, setInternalAdminUserListFetchRequestLoading ] =
        useState<boolean>(false);
    const [ isInternalAdminsNextPageAvailable, setInternalAdminsNextPageAvailable ] = useState<boolean>(false);
    const [ userStoreError, setUserStoreError ] = useState(false);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(TabIndex.EXTERNAL_ADMINS);
    const [ userStoreList, setUserStoreList ] = useState<DropdownItemProps[]>([]);
    const [ adminRoleId, setAdminRoleId ] = useState<string>("");
    const [ associationType, setAssociationType ] = useState<string>("");
    const [ internalDefaultAdminList, setInternalDefaultAdminList ] = useState<InternalAdminUserListInterface>({});
    const [ internalRemoteAdminList, setInternalRemoteAdminList ] = useState<InternalAdminUserListInterface>({
        Resources: [],
        itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        startIndex: 0,
        totalResults: 0
    });
    const [ resolvedInternalAdminList, setResolvedInternalAdminList ] = useState<InternalAdminUserListInterface>({
        Resources: [],
        itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        startIndex: 0,
        totalResults: 0
    });

    const organizationName: string = store.getState().auth.tenantDomain;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const modifiedLimit: number = listItemLimit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;
    // Excluding groups and roles from getUserList API call to improve performance.
    const excludedAttributes: string = UsersConstants.GROUPS_ATTRIBUTE;

    const {
        data: OrganizationConfig,
        isLoading: isOrgConfigRequestLoading,
        isValidating: isOrgConfigRequestRevalidating,
        error: orgConfigFetchRequestError
    } = useOrganizationConfig(
        organizationName,
        {
            revalidateIfStale: true
        },
        saasFeatureStatus === FeatureStatus.ENABLED
    );

    // Used to retrive Asgardeo admins from Primary userstore.
    // Add +1 to the listOffset to convert it into a 1-based startIndex.
    const {
        data: originalAdminUserList,
        isLoading: isAdminUserListFetchRequestLoading,
        error: adminUserListFetchRequestError,
        mutate: mutateAdminUserListFetchRequest
    } = useUsersList(
        modifiedLimit,
        listOffset + 1,
        (
            searchQuery === ""
                ? null
                : searchQuery
        ),
        null,
        PRIMARY_USERSTORE,
        excludedAttributes,
        !administratorConfig.enableAdminInvite || invitationStatusOption === InvitationStatus.ACCEPTED
    );

    const {
        data: guestUserList,
        isLoading: isGuestUserListFetchRequestLoading,
        error: guestUserListFetchRequestError,
        mutate: mutateGuestUserListFetchRequest
    } = useInvitedUsersList(
        administratorConfig.enableAdminInvite
    );

    const {
        data: serverConfigs,
        error: serverConfigsFetchRequestError
    } = useServerConfigs();

    /**
     * Handles the invitation status option changes.
     */
    useEffect(() => {
        checkAdvancedUserManagementStatus();
        getUserStoreList();
        getAdminRoleId();
        setAssociationType(getAssociationType(authUserTenants, currentOrganization));

        // Default value of invitationStatusOption is ACCEPTED. This webhook logic needs to be ignored if the
        // invitationStatusOption has been manually set externally.
        if (InvitationStatus.ACCEPTED.toUpperCase() === invitationStatusOption.toUpperCase()) {
            if (!adminUserList || adminUserList.totalResults == 0) {
                if (guestUserList?.filter((invitation: UserInviteInterface) =>
                    invitation.status === InvitationStatus.PENDING.toUpperCase()).length > 0) {
                    setInvitationStatusOption(InvitationStatus.PENDING);
                    setIsInvitationStatusOptionChanged(true);
                } else if (guestUserList?.filter((invitation: UserInviteInterface) =>
                    invitation.status === InvitationStatus.EXPIRED.toUpperCase()).length > 0) {
                    setInvitationStatusOption(InvitationStatus.EXPIRED);
                    setIsInvitationStatusOptionChanged(true);
                }
            }
        }

        return () => {
            setInvitationStatusOption(InvitationStatus.ACCEPTED);
            setIsInvitationStatusOptionChanged(true);
        };
    }, []);

    useEffect(() => {
        setIsEnterpriseLoginEnabled(OrganizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading, isOrgConfigRequestRevalidating ]);

    /**
     * Dispatches error notifications if Admin user fetch request fails.
     */
    useEffect(() => {
        if (!adminUserListFetchRequestError) {
            return;
        }

        if (adminUserListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: adminUserListFetchRequestError?.response?.data?.description
                    ?? adminUserListFetchRequestError?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: adminUserListFetchRequestError?.response?.data?.message
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
    }, [ adminUserListFetchRequestError ]);

    /**
     * Dispatches error notifications if Guest user fetch request fails.
     */
    useEffect(() => {
        if (!guestUserListFetchRequestError) {
            return;
        }

        if (guestUserListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: guestUserListFetchRequestError?.response?.data?.description
                    ?? guestUserListFetchRequestError?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: guestUserListFetchRequestError?.response?.data?.message
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
    }, [ guestUserListFetchRequestError ]);

    /**
     * Dispatches error notifications if server configs fetch request fails.
     */
    useEffect(() => {
        if (!serverConfigsFetchRequestError) {
            return;
        }

        if (serverConfigsFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: serverConfigsFetchRequestError?.response?.data?.description
                    ?? serverConfigsFetchRequestError?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: serverConfigsFetchRequestError?.response?.data?.message
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
    }, [ serverConfigsFetchRequestError ]);

    /**
     * Dispatches error notifications if Organization config fetch request fails.
     */
    useEffect(() => {
        if (!orgConfigFetchRequestError) {
            return;
        }

        if (orgConfigFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: orgConfigFetchRequestError?.response?.data?.description
                    ?? orgConfigFetchRequestError?.response?.data?.detail
                        ?? t("extensions:manage.users.administratorSettings.error.description"),
                level: AlertLevels.ERROR,
                message: orgConfigFetchRequestError?.response?.data?.message
                    ?? t("extensions:manage.users.administratorSettings.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("extensions:manage.users.administratorSettings.genericError." +
                        "description"),
            level: AlertLevels.ERROR,
            message: t("extensions:manage.users.administratorSettings.genericError.message")
        }));
    }, [ orgConfigFetchRequestError ]);

    /**
     * Handles the search query changes.
     */
    useEffect(() => {
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            return;
        }

        setListOffset(0);
        if (searchQuery === "email co " || searchQuery === "" || searchQuery === null) {
            setPaginateGuestList(guestUserList);
            setFilterGuestList([]);

            return;
        } else if (searchQuery) {
            let searchList: UserInviteInterface[] = guestUserList;

            if (filterGuestList.length > 0) {
                searchList = filterGuestList;
            }
            if (searchQuery.includes("email sw ")) {
                const searchValue: string = searchQuery.split("sw ")[1];

                searchList = searchList.filter((invite: UserInviteInterface) => {
                    return invite.email.startsWith(searchValue);
                });
            } else if (searchQuery.includes("email ew ")) {
                const searchValue: string = searchQuery.split("ew ")[1];

                searchList = searchList.filter((invite: UserInviteInterface) => {
                    return invite.email.endsWith(searchValue);
                });
            } else if (searchQuery.includes("email eq ")) {
                const searchValue: string = searchQuery.split("eq ")[1];

                searchList = searchList.filter((invite: UserInviteInterface) => {
                    return (invite.email === searchValue);
                });
            } else if (searchQuery.includes("email co ")) {
                const searchValue: string = searchQuery.split("co ")[1];

                searchList = searchList.filter((invite: UserInviteInterface) => {
                    return invite.email.includes(searchValue);
                });
            }
            setPaginateGuestList(searchList);
            setFilterGuestList(searchList);
        }
    }, [ searchQuery ]);

    /**
     * User effect to handle Pagination for pending/expired Guest.
     */
    useEffect(() => {
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            return;
        }

        let finalInvitations: UserInviteInterface[] = paginatedGuestList?.filter(
            (invitation: UserInviteInterface) => invitation.status === invitationStatusOption.toUpperCase());

        if (finalInvitations.length > listItemLimit) {
            finalInvitations = finalInvitations.slice(listOffset, listOffset + listItemLimit);
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(finalInvitations.length === listItemLimit);
        } else {
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(false);
        }
    }, [ paginatedGuestList, listOffset, listItemLimit, isInvitationStatusOptionChanged ]);

    /**
     * Handles guest user pagination.
     */
    useEffect(() => {
        setPaginateGuestList(guestUserList);
    }, [ guestUserList ]);

    /**
     * Set default value for offset & item limit.
     */
    useEffect(() => {
        if (!isInvitationStatusOptionChanged) {
            return;
        }
        setListOffset(0);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        handleSearchQueryClear();
        setIsInvitationStatusOptionChanged(false);
    }, [ isInvitationStatusOptionChanged ]);

    /**
     * Subscribe to the URS search params to check for User create wizard triggers.
     * @example
     * If the URL contains a search param `?open=Customer`, it'll open up the user create wizard.
     */
    useEffect(() => {

        if (!urlSearchParams.get(UsersConstants.USER_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        eventPublisher.publish("manage-users-click-create-new", {
            type: "collaborator"
        });
        setShowExtenalAdminWizard(true);
    }, [ urlSearchParams.get(UsersConstants.USER_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    useEffect(() => {
        if (activeTabIndex === TabIndex.INTERNAL_ADMINS) {
            getInternalAdmins();
        }
    }, [ activeTabIndex, adminRoleId, remoteUserStoreConnectionStatus ]);

    useEffect(() => {
        getRemoteUserStoreConnectionStatus();
    }, [ remoteUserStoreId ]);

    useEffect(() => {
        let adminList: InternalAdminUserListInterface = { ...internalDefaultAdminList };

        if (selectedUserStore !== CONSUMER_USERSTORE) {
            adminList = { ...internalRemoteAdminList };
        }

        if (!isEmpty(searchInternalAdminQuery)) {
            adminList.Resources = adminList?.Resources.filter((element: UserRoleInterface) => {
                const username: string = element?.display?.split("/")[1];

                // Returns -1 when substring does not exist.
                return username.indexOf(searchInternalAdminQuery) !== -1;
            });
        }

        const results: UserRoleInterface[] =
            adminList?.Resources?.slice(listOffset, listOffset + listItemLimit);

        if (activeTabIndex !== TabIndex.EXTERNAL_ADMINS && isEmpty(results)) {
            setListOffset(0);
        }

        setInternalAdminsNextPageAvailable(
            adminList?.Resources?.length > (listOffset + listItemLimit));

        setResolvedInternalAdminList({
            Resources: results,
            itemsPerPage: listItemLimit,
            startIndex: listOffset,
            totalResults: adminList?.Resources?.length
        });

        setUserStoreChanged(false);
    }, [
        internalDefaultAdminList,
        internalRemoteAdminList,
        listOffset,
        listItemLimit,
        selectedUserStore,
        searchInternalAdminQuery
    ]);

    /**
     * Transform the original users list response from the API.
     *
     * @param usersList - User list from the API.
     * @returns Processed list of users.
     */
    const transformUserList = (usersList: UserListInterface): UserListInterface => {
        if (!usersList) {
            return;
        }

        const clonedUserList: UserListInterface = cloneDeep(usersList);
        const processedUserList: UserBasicInterface[] = [];

        /**
         * Checks whether administrator role is present in the user.
         */
        const isAdminUser = (user: UserBasicInterface): boolean => {
            return user?.roles?.some((role: UserRoleInterface) =>
                role.display === administratorConfig.adminRoleName
            );
        };

        const isOwner = (user: UserBasicInterface):boolean => {
            return (user[ SCIMConfigs.scim.enterpriseSchema ]?.userAccountType === UserAccountTypes.OWNER);
        };

        clonedUserList.Resources = clonedUserList?.Resources?.map((resource: UserBasicInterface) => {
            // Filter out users belong to groups named "Administrator"
            if (!isAdminUser(resource)) {
                return null;
            }

            if (isOwner(resource) && UserManagementUtils.isAuthenticatedUser(authenticatedUser, resource?.userName)) {
                processedUserList[0] = resource;

                return null;
            } else {
                if ( UserManagementUtils.isAuthenticatedUser(authenticatedUser, resource?.userName)) {
                    processedUserList[0] = resource;

                    return null;
                }
                if (isOwner(resource)) {
                    processedUserList[1] = resource;

                    return null;
                }
            }

            let email: string | null = null;

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
        });

        /**
         * Returns a moderated users list.
         *
         * @remarks There is no proper way to count the total entries in the userstore with LDAP.
         *  So as a workaround, when
         * fetching users, we request an extra entry to figure out if there is a next page.
         * TODO: Remove this function and other related variables once there is a proper fix for LDAP pagination.
         * @see {@link https://github.com/wso2/product-is/issues/7320}
         *
         * @param list - Users list retrieved from the API.
         * @param requestedLimit - Requested item limit.
         * @param popCount - Tempt count used which will be removed after figuring out if
         *  next page is available.
         * @returns moderated users list with proper pagination.
         */
        const moderateUsersList = (list: UserListInterface, requestedLimit: number,
            popCount: number = 1): UserListInterface => {

            const moderated: UserListInterface = list;

            if (moderated.Resources?.length === requestedLimit) {
                moderated.Resources?.splice(-1, popCount);
                setIsGuestUsersNextPageAvailable(true);
            } else {
                setIsGuestUsersNextPageAvailable(false);
            }

            return moderated;
        };

        clonedUserList.Resources = processedUserList.concat(clonedUserList.Resources)
            .filter((user: UserBasicInterface) => user != null);

        return moderateUsersList(clonedUserList, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET);
    };

    const getUserStoreList = (): void => {
        setUserStoreListLoading(true);

        getUserStores()
            .then((response: UserStoreDetails[]) => {
                const readOnlyUserStoreArray: string[] = [];
                const userStoreArray: DropdownItemProps[] = response?.filter(
                    (item: UserStoreDetails) => item.enabled).map(
                    (item: UserStoreDetails, index: number) => {
                        // Set readOnly userstores based on the type.
                        if (item.typeName === UsersConstants.READONLY_USERSTORE_TYPE_NAME) {
                            readOnlyUserStoreArray.push(item.name.toUpperCase());
                            setRemoteUserStoreId(item.id);
                        }

                        return {
                            key: index,
                            text: item.name.toUpperCase(),
                            value: item.name.toUpperCase()
                        };
                    }
                );

                setUserStoreError(false);
                setUserStoreList(userStoreArray);
                setReadOnlyUserStoresList(readOnlyUserStoreArray);
                setUserStoreDropdownDisabled(userStoreArray.length <= 1);
            }).catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.userstores.notifications.fetchUserstores.genericError." +
                                "description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.userstores.notifications.fetchUserstores.genericError." +
                                "message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.userstores.notifications.fetchUserstores.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }));

                setUserStoreError(true);

                return;
            })
            .finally(() => {
                setUserStoreListLoading(false);
            });
    };

    /**
     * Fetches the admin role id from database.
     */
    const getAdminRoleId = () => {
        const searchData:SearchRoleInterface = {
            filter: "displayName eq " + administratorConfig.adminRoleName,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:SearchRequest" ],
            startIndex: 0
        };

        searchRoleList(searchData)
            .then((response: AxiosResponse) => {
                if (response?.data?.Resources.length > 0) {
                    const adminId: string = response?.data?.Resources[0]?.id;

                    setAdminRoleId(adminId);
                }
            }).catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users.notifications.getAdminRole.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.getAdminRole." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.getAdminRole.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Fetches remote userstore connection status if available.
     */
    const getRemoteUserStoreConnectionStatus = () => {
        if (isEmpty(remoteUserStoreId)) {
            return;
        }

        getAgentConnections(remoteUserStoreId)
            .then((response: AgentConnectionInterface[]) => {
                response.forEach((connection: AgentConnectionInterface) => {
                    if(connection.connected) {
                        setRemoteUserStoreConnectionStatus(true);
                    }
                });
            }).catch((error: IdentityAppsError) => {
                dispatch(addAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                                ".description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                                ".message")
                    }
                ));
            });
    };

    const handleUserStoreChange = (event:  SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
        setSelectedUserStore(data.value as string);
        setSelectedUserStoreReadOnly(readOnlyUserStoresList?.includes(data.value.toString().toUpperCase()));

        // Reset pagination values
        setListOffset(0);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setUserStoreChanged(true);
    };

    const adminUserList: UserListInterface = useMemo(() => {
        return transformUserList(originalAdminUserList);
    }, [ originalAdminUserList ]);

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps)
        : void => {
        setListItemLimit(data.value as number);
    };

    const invitationStatusOptions: DropdownItemProps[] = [
        {
            key: 1,
            text: "Accepted",
            value: "Accepted"
        },
        {
            key: 2,
            text: "Pending",
            value: "Pending"
        },
        {
            key: 3,
            text: "Expired",
            value: "Expired"
        }
    ];

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setSearchInternalAdminQuery("");
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param query - Search query for filtering users.
     */
    const handleUserFilter = (query: string): void => {
        if (activeTabIndex === TabIndex.INTERNAL_ADMINS) {
            setSearchInternalAdminQuery(query?.trim());

            return;
        }

        setSearchQuery(query);

        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            if (query === "userName sw ") {
                setSearchQuery(null);

                return;
            }

            setSearchQuery(query);
        }
    };

    const handleAccountStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setInvitationStatusOption(data.value as string);
        setIsInvitationStatusOptionChanged(true);
    };

    /**
     * Set the disabled/enabled status for advanced user management features.
     */
    const checkAdvancedUserManagementStatus = ():void => {
        const disabledUserFeatures: string[] = featureConfig.users.disabledFeatures;

        setAdvancedUserManagementDisabled(disabledUserFeatures?.includes(ADVANCED_USER_MGT));
    };

    const getInternalAdmins = (): void => {
        const defaultUserStoreAdmins: UserRoleInterface[] = [];
        const remoteUserStoreAdmins: UserRoleInterface[] = [];

        setInternalAdminUserListFetchRequestLoading(true);

        if (isEmpty(adminRoleId)) {
            return;
        }

        setInternalDefaultAdminList({
            Resources: [],
            itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            startIndex: 0,
            totalResults: 0
        });
        setInternalRemoteAdminList({
            Resources: [],
            itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            startIndex: 0,
            totalResults: 0
        });

        getRoleById(adminRoleId).then((response: AxiosResponse) => {
            const adminList: UserRoleInterface[] = response?.data?.users;

            adminList.forEach((user: UserRoleInterface) => {
                const displayNameArray: string[] = user.display.split("/");

                if (displayNameArray.length > 1) {
                    displayNameArray[0] === CONSUMER_USERSTORE ?
                        defaultUserStoreAdmins.push(user) : remoteUserStoreAdmins.push(user);
                }
            });

            setInternalDefaultAdminList({
                Resources: defaultUserStoreAdmins,
                itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                startIndex: 0,
                totalResults: defaultUserStoreAdmins.length
            });

            if (remoteUserStoreConnectionStatus) {
                setInternalRemoteAdminList({
                    Resources: remoteUserStoreAdmins,
                    itemsPerPage: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    startIndex: 0,
                    totalResults: remoteUserStoreAdmins.length
                });
            }

            setInternalAdminUserListFetchRequestLoading(true);
        }).catch((error: IdentityAppsApiException) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? error?.response?.data?.detail
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
        }).finally(() => {
            setInternalAdminUserListFetchRequestLoading(false);
        });
    };

    /**
     * Show the message about the tenanted console URL.
     */
    const renderTenantedConsoleLink = () => {
        const generateContent = () => {
            return (
                <Grid verticalAlign="middle">
                    <Grid.Column floated="left" width={ 9 }>
                        <Text className="message-info-text">
                            <p> { t("extensions:manage.users.collaboratorAccounts.consoleInfo") } </p>
                        </Text>
                    </Grid.Column>
                    <Grid.Column floated="right" width={ 6 }>
                        <CopyInputField
                            value={ tenantedConsoleUrl }
                            data-componentid={ `${ componentId }-tenanted-console-link` }
                        />
                    </Grid.Column>
                </Grid>
            );
        };

        return (
            <EmphasizedSegment className="mt-0 mb-5">
                { generateContent() }
            </EmphasizedSegment>
        );
    };

    const addAdminDropdown: ReactElement = (
        <>
            <PrimaryButton
                data-componentid={ `${ componentId }-add-admin-button` }
                onClick={ () => {
                    eventPublisher.publish("admins-click-add-new-button");
                } }
                className="tablet or lower hidden"
            >
                <Icon name="add"/>
                { t("extensions:manage.users.buttons.addCollaboratorBtn") }
                <Icon name="dropdown" className="ml-3 mr-0"/>
            </PrimaryButton>
            <Button
                data-componentid={ `${ componentId }-add-admin-button` }
                icon="add"
                onClick={ () => {
                    eventPublisher.publish("admins-click-add-new-button");
                } }
                className="mobile only tablet only"
                primary
            >
            </Button>
        </>
    );

    const addUserOptions: DropdownItemProps[] = [
        {
            "data-componentid": "admins-add-external-admin",
            key: 1,
            text: "Invite admins to Asgardeo",
            value: AdminAccountTypes.EXTERNAL
        },
        {
            "data-componentid": "admins-add-internal-admin",
            key: 2,
            text: "Assign admins from users",
            value: AdminAccountTypes.INTERNAL
        }
    ];

    if (hasRequiredScopes(featureConfig?.guestUser, featureConfig?.guestUser?.scopes?.create, allowedScopes)) {
        addUserOptions.push();
    }

    const handleDropdownItemChange = (value: string): void => {
        if (!isAdvancedUserManagementDisabled && value === AdminAccountTypes.INTERNAL) {
            eventPublisher.publish("admins-click-create-new", {
                type: "internal admin"
            });
            setSelectedAddAdminType(AdminAccountTypes.INTERNAL);
            setShowExtenalAdminWizard(true);
        } else if (value === AdminAccountTypes.EXTERNAL) {
            eventPublisher.publish("admins-click-create-new", {
                type: "external admin"
            });
            setSelectedAddAdminType(AdminAccountTypes.EXTERNAL);
            setShowExtenalAdminWizard(true);
        }
    };

    const handleSettingsButton = () => {
        history.push(UsersConstants.getPaths().get("COLLABORATOR_SETTINGS_EDIT_PATH"));
    };

    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        setInvitationStatusOption(InvitationStatus.ACCEPTED);
        setActiveTabIndex(data.activeIndex as number);
        handleSearchQueryClear();
        setInternalAdminUserListFetchRequestLoading(true);
    };

    const resolveAdminTabPanes = (): any[] => {
        const panes: any[] = [];

        panes.push({
            componentId: "external-admins",
            menuItem: {
                content: "Asgardeo"
            },
            render: renderExtenalAdminsList
        });

        panes.push({
            componentId: "internal-admins",
            menuItem: {
                content: currentOrganization + " organization"
            },
            render: renderInternalAdminsList
        });

        return panes;
    };

    const renderAdministratorList = (): ReactElement => {
        if (isEnterpriseLoginEnabled && !isAdvancedUserManagementDisabled) {
            return (
                <ResourceTab
                    activeIndex= { activeTabIndex }
                    data-testid= { `${componentId}-administrator-tabs` }
                    defaultActiveIndex={ 0 }
                    onTabChange={ handleTabChange }
                    panes= { resolveAdminTabPanes() }
                />
            );
        }

        return renderExtenalAdminsList();
    };

    const renderExtenalAdminsList = (): ReactElement => {
        return (
            <ListLayout
                // TODO add sorting functionality.
                className="mt-5"
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleUserFilter }
                        filterAttributeOptions={ (invitationStatusOption === InvitationStatus.ACCEPTED) ? [
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
                        ]:
                            [
                                {
                                    key: 0,
                                    text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                        "filterAttributeOptions.email"),
                                    value: "email"
                                }
                            ]
                        }
                        filterAttributePlaceholder={
                            t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute. " +
                                "placeholder")
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
                        defaultSearchAttribute={ (invitationStatusOption === InvitationStatus.ACCEPTED)
                            ? "userName": "email" }
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={
                    invitationStatusOption === InvitationStatus.ACCEPTED
                        ? adminUserList?.Resources?.length
                        : finalGuestList?.length
                }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ true }
                showPaginationPageLimit={ !isSelectedUserStoreReadOnly }
                totalPages={ invitationStatusOption === InvitationStatus.ACCEPTED ?
                    Math.ceil(adminUserList?.totalResults / listItemLimit) :
                    Math.ceil(paginatedGuestList?.length / listItemLimit) }
                totalListSize={ invitationStatusOption === InvitationStatus.ACCEPTED ?
                    adminUserList?.totalResults : paginatedGuestList?.length }
                isLoading={
                    (invitationStatusOption === InvitationStatus.ACCEPTED && isAdminUserListFetchRequestLoading) ||
                    (administratorConfig.enableAdminInvite && isGuestUserListFetchRequestLoading)
                }
                onSearchQueryClear={ handleSearchQueryClear }
                resetPagination={ isInvitationStatusOptionChanged }
                paginationOptions={ {
                    disableNextButton: invitationStatusOption === InvitationStatus.ACCEPTED
                        ? !isGuestUsersNextPageAvailable
                        : !isNextPageAvailable
                } }
                disableRightActionPanel={ true }
                leftActionPanel={ administratorConfig.enableAdminInvite && (
                    <Dropdown
                        data-componentid={ `${ componentId }-list-userstore-dropdown` }
                        selection
                        options={ invitationStatusOptions && invitationStatusOptions }
                        onChange={ handleAccountStatusChange }
                        text={ `Filter by: ${ invitationStatusOption }` }
                        disabled={
                            (invitationStatusOption === InvitationStatus.ACCEPTED &&
                                isAdminUserListFetchRequestLoading) ||
                                (administratorConfig.enableAdminInvite && isGuestUserListFetchRequestLoading)
                        }
                    />
                ) }
            >
                {
                    (invitationStatusOption === InvitationStatus.ACCEPTED) && (
                        <OnboardedGuestUsersList
                            advancedSearch={ (
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
                                        t("console:manage.features.users.advancedSearch.form.inputs" +
                                            ".filterAttribute.placeholder")
                                    }
                                    filterConditionsPlaceholder={
                                        t("console:manage.features.users.advancedSearch.form.inputs" +
                                            ".filterCondition.placeholder")
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
                            ) }
                            onboardedGuestUsersList={ adminUserList }
                            userMetaListContent={ null }
                            realmConfigs={ serverConfigs?.realmConfig }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-componentid={ `${ componentId }-list` }
                            readOnlyUserStores={ null }
                            featureConfig={ featureConfig }
                            onUserDelete={ () => {
                                mutateAdminUserListFetchRequest();
                            } }
                            adminType={ AdminAccountTypes.EXTERNAL }
                            adminRoleId={ adminRoleId }
                        />
                    )
                }
                {
                    (invitationStatusOption === InvitationStatus.PENDING) && (
                        <GuestUsersList
                            invitationStatusOption={ invitationStatusOption }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onboardedGuestUserList={ adminUserList }
                            onSearchQueryClear={ handleSearchQueryClear }
                            guestUsersList={ finalGuestList }
                            getGuestUsersList={ () => mutateGuestUserListFetchRequest() }
                            searchQuery={ searchQuery }
                        />
                    )
                }
                {
                    (invitationStatusOption === InvitationStatus.EXPIRED) && (
                        <GuestUsersList
                            invitationStatusOption={ invitationStatusOption }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onboardedGuestUserList={ adminUserList }
                            onSearchQueryClear={ handleSearchQueryClear }
                            guestUsersList={ finalGuestList?.filter(
                                (invitation: UserInviteInterface) =>
                                    invitation.status === InvitationStatus.EXPIRED.toUpperCase()) }
                            getGuestUsersList={ () => mutateGuestUserListFetchRequest() }
                            searchQuery={ searchQuery }
                        />
                    )
                }
            </ListLayout>
        );
    };

    const renderInternalAdminsList = (): ReactElement => {
        return (
            <ListLayout
                // TODO add sorting functionality.
                className="mt-5"
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        disableSearchFilterDropdown={ true }
                        onFilter={ handleUserFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.email"),
                                value: "emails"
                            }
                        ] }
                        placeholder={ t("console:manage.features.users.advancedSearch.placeholder") }
                        defaultSearchAttribute=""
                        defaultSearchOperator=""
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ resolvedInternalAdminList?.Resources?.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ true }
                showPaginationPageLimit={ !isSelectedUserStoreReadOnly }
                totalPages={ Math.ceil(resolvedInternalAdminList?.totalResults / listItemLimit) }
                totalListSize={ resolvedInternalAdminList?.totalResults }
                isLoading={ isInternalAdminUserListFetchRequestLoading }
                onSearchQueryClear={ handleSearchQueryClear }
                resetPagination={ isUserStoreChanged }
                paginationOptions={ { disableNextButton: !isInternalAdminsNextPageAvailable } }
                leftActionPanel={
                    !isUserStoreDropdownDisabled
                        ? (
                            <Dropdown
                                data-componentid={ `${ componentId }-userstore-dropdown` }
                                selection
                                options={ userStoreList }
                                onChange={ handleUserStoreChange }
                                text={ selectedUserStore }
                                loading={ isUserStoreListLoading }
                                disabled={ userStoreError }
                            />
                        ) : null
                }
            >
                <OnboardedGuestUsersList
                    onboardedGuestUsersList={ resolvedInternalAdminList }
                    userMetaListContent={ null }
                    realmConfigs={ serverConfigs?.realmConfig }
                    onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchInternalAdminQuery }
                    data-componentid={ `${ componentId }-list` }
                    readOnlyUserStores={ null }
                    featureConfig={ featureConfig }
                    onUserDelete={ () => {
                        getInternalAdmins();
                    } }
                    adminType={ AdminAccountTypes.INTERNAL }
                    adminRoleId={ adminRoleId }
                    associationType={ associationType }
                />
            </ListLayout>
        );
    };

    const resolveAddAdminWizard = (): ReactElement => {
        if (showExtenalAdminWizard) {

            if (administratorConfig.enableAdminInvite) {
                // Returns the add user wizard with email invitation.
                return (
                    <AddUserEmailInviteWizard
                        data-componentid={ `${ componentId }-add-admin-wizard-modal` }
                        closeWizard={ () => {
                            setShowExtenalAdminWizard(false);
                        } }
                        updateList={ () => mutateGuestUserListFetchRequest() }
                        rolesList={ rolesList }
                        emailVerificationEnabled={ true }
                        onInvitationSendSuccessful={ () => {
                            mutateGuestUserListFetchRequest();
                            eventPublisher.publish("manage-users-finish-creating-collaborator-user");
                            if (selectedAddAdminType === AdminAccountTypes.EXTERNAL) {
                                setInvitationStatusOption(InvitationStatus.PENDING);
                                setActiveTabIndex(TabIndex.EXTERNAL_ADMINS);
                            }
                            if (selectedAddAdminType === AdminAccountTypes.INTERNAL) {
                                setInvitationStatusOption(InvitationStatus.ACCEPTED);
                                setActiveTabIndex(TabIndex.INTERNAL_ADMINS);
                            }
                            setIsInvitationStatusOptionChanged(true);
                        } }
                        defaultUserTypeSelection={ administratorConfig.adminRoleName }
                        adminTypeSelection={ selectedAddAdminType }
                        onUserUpdate={ () => {
                            if (selectedAddAdminType === AdminAccountTypes.EXTERNAL) {
                                setActiveTabIndex(TabIndex.EXTERNAL_ADMINS);
                                mutateAdminUserListFetchRequest();
                            }
                            if (selectedAddAdminType === AdminAccountTypes.INTERNAL) {
                                setInvitationStatusOption(InvitationStatus.ACCEPTED);
                                setActiveTabIndex(TabIndex.INTERNAL_ADMINS);
                                getInternalAdmins();
                            }
                        } }
                    />
                );
            }

            return (
                <AddUserWizard
                    data-componentid={ `${ componentId }-add-admin-wizard-modal` }
                    closeWizard={ () => {
                        setShowExtenalAdminWizard(false);
                    } }
                    listOffset={ listOffset }
                    listItemLimit={ listItemLimit }
                    updateList={ () => mutateGuestUserListFetchRequest() }
                    rolesList={ rolesList }
                    emailVerificationEnabled={ false }
                    isAdminUser={ true }
                    defaultUserTypeSelection={ UserAccountTypes.ADMINISTRATOR }
                />
            );
        }

        return null;
    };

    //TODO: Refactor once unnecessary loading dependencies are removed.
    const getButtonLoadingState = (): boolean => {
        return (administratorConfig.enableAdminInvite && isGuestUserListFetchRequestLoading)
        || (saasFeatureStatus === FeatureStatus.ENABLED
        && (isOrgConfigRequestRevalidating || isOrgConfigRequestLoading));
    };

    return (
        <PageLayout
            pageTitle="Administrators"
            action={
                saasFeatureStatus === FeatureStatus.ENABLED && isOrgConfigRequestLoading
                    ? <div />
                    : (
                        <Show when={ AccessControlConstants.USER_WRITE }>
                            { saasFeatureStatus === FeatureStatus.ENABLED && !isAdvancedUserManagementDisabled &&
                                (
                                    <Button
                                        data-componentid={ `${ componentId }-admin-settings-button` }
                                        icon="setting"
                                        onClick={ handleSettingsButton }
                                    >
                                    </Button>
                                )
                            }
                            { (isEnterpriseLoginEnabled && !isAdvancedUserManagementDisabled)
                                ? (
                                    <Dropdown
                                        loading={ getButtonLoadingState() }
                                        disabled={ getButtonLoadingState() }
                                        data-componentid={ `${ componentId }-add-admin-dropdown` }
                                        direction="left"
                                        floating
                                        icon={ null }
                                        trigger={ addAdminDropdown }
                                    >
                                        <Dropdown.Menu >
                                            { addUserOptions.map((option: {
                                    "data-componentid": string;
                                    key: number;
                                    text: string;
                                    value: AdminAccountTypes;
                                }) => (
                                                <Dropdown.Item
                                                    key={ option.value }
                                                    onClick={ ()=> handleDropdownItemChange(option.value) }
                                                    { ...option }
                                                    disabled= { !isEnterpriseLoginEnabled }
                                                />
                                            )) }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ) : (
                                    <>
                                        <PrimaryButton
                                            loading={ getButtonLoadingState() }
                                            disabled={ getButtonLoadingState() }
                                            data-componentid={ `${ componentId }-add-admin-button` }
                                            onClick={ () => {
                                                eventPublisher.publish("admins-click-add-new-button");
                                                setSelectedAddAdminType(AdminAccountTypes.EXTERNAL);
                                                setShowExtenalAdminWizard(true);
                                            } }
                                            className="tablet or lower hidden"
                                        >
                                            <Icon name="add"/>
                                            { t("extensions:manage.users.buttons.addCollaboratorBtn") }
                                        </PrimaryButton>
                                        <Button
                                            loading={ getButtonLoadingState() }
                                            disabled={ getButtonLoadingState() }
                                            data-componentid={ `${ componentId }-add-admin-button` }
                                            icon="add"
                                            onClick={ () => {
                                                eventPublisher.publish("admins-click-add-new-button");
                                                setSelectedAddAdminType(AdminAccountTypes.EXTERNAL);
                                                setShowExtenalAdminWizard(true);
                                            } }
                                            className="mobile only tablet only"
                                            primary
                                        >
                                        </Button>
                                    </>
                                ) }
                        </Show>
                    )
            }
            title={ t("extensions:manage.users.collaboratorsTitle") }
            description={ (
                <>
                    { t("extensions:manage.users.collaboratorsSubTitle") }
                    <DocumentationLink
                        link={ getLink("manage.users.collaboratorAccounts.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
            contentTopMargin={ false }
            data-componentid={ `${ componentId }-page-layout` }
            actionColumnWidth={ 8 }
            headingColumnWidth={ 8 }
        >
            { renderTenantedConsoleLink() }
            { renderAdministratorList() }
            { resolveAddAdminWizard() }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
CollaboratorsPage.defaultProps = {
    "data-componentid": "asgardeo-administrators"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CollaboratorsPage;
