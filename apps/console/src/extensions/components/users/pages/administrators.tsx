/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    CopyInputField,
    DocumentationLink,
    GridLayout,
    ListLayout,
    Message,
    PageLayout,
    PrimaryButton,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dropdown, DropdownProps, Grid, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    UserBasicInterface
} from "../../../../features/core";
import { RealmConfigInterface, getServerConfigs } from "../../../../features/server-configurations";
import { UserListInterface, getUsersList } from "../../../../features/users";
import { PRIMARY_USERSTORE } from "../../../../features/userstores";
import { SCIMConfigs } from "../../../configs/scim";
import { getInvitedUserList } from "../api";
import { GuestUsersList, OnboardedGuestUsersList } from "../components";
import { ADVANCED_USER_MGT, AdminAccountTypes, UserAccountTypes, UsersConstants } from "../constants";
import { InvitationStatus, UserInviteInterface } from "../models";
import { AddUserWizard } from "../wizard";

/**
 * Props for the Users page.
 */
type CollaboratorsPageInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @type {number}
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Users listing page.
 *
 * @param {CollaboratorsPageInterface} props - Props injected to the component.
 * @return {React.ReactElement}
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
    const dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const tenantedConsoleUrl: string = useSelector((state: AppState) => state?.config?.deployment?.clientHost);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    const [ isGuestUsersNextPageAvailable, setIsGuestUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ showExtenalAdminWizard, setShowExtenalAdminWizard ] = useState<boolean>(false);
    const [ rolesList ] = useState([]);

    const [ guestsList, setGuestsList ] = useState<UserInviteInterface[]>([]);
    const [ onboardedGuestUserList, setOnboardedGuestUserList ] = useState<UserListInterface>({});
    const [ invitationStatusOption, setInvitationStatusOption ] = useState<string>(InvitationStatus.ACCEPTED);
    const [ isInvitationStatusOptionChanged, setIsInvitationStatusOptionChanged ] = useState<boolean>(false);
    const [ isOnboardedGuestUsersListRequestLoading, setOnboardedGuestUsersListRequestLoading ]
        = useState<boolean>(false);
    const [ isGuestUsersListRequestLoading, setGuestUsersListRequestLoading ] = useState<boolean>(true);
    const [ realmConfigs, setRealmConfigs ] = useState<RealmConfigInterface>(undefined);

    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ paginatedGuestList, setPaginateGuestList ] = useState<UserInviteInterface[]>([]);
    const [ finalGuestList, setFinalGuestList ] = useState<UserInviteInterface[]>([]);
    const [ filterGuestList, setFilterGuestList ] = useState<UserInviteInterface[]>([]);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ isAdvancedUserManagementDisabled, setAdvancedUserManagementDisabled ] = useState<boolean>(true);
    const [ selectedAddAdminType, setSelectedAddAdminType ] = useState<AdminAccountTypes>(AdminAccountTypes.INTERNAL);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            return;
        }

        setListOffset(0);
        if (searchQuery === "email co " || searchQuery === "" || searchQuery === null) {
            setPaginateGuestList(guestsList);
            setFilterGuestList([]);

            return;
        } else if (searchQuery) {
            let searchList: UserInviteInterface[] = guestsList;

            if (filterGuestList.length > 0) {
                searchList = filterGuestList;
            }
            if (searchQuery.includes("email sw ")) {
                const searchValue = searchQuery.split("sw ")[1];

                searchList = searchList.filter((invite) => {
                    return invite.email.startsWith(searchValue);
                });
            } else if (searchQuery.includes("email ew ")) {
                const searchValue = searchQuery.split("ew ")[1];

                searchList = searchList.filter((invite) => {
                    return invite.email.endsWith(searchValue);
                });
            } else if (searchQuery.includes("email eq ")) {
                const searchValue = searchQuery.split("eq ")[1];

                searchList = searchList.filter((invite) => {
                    return (invite.email === searchValue);
                });
            } else if (searchQuery.includes("email co ")) {
                const searchValue = searchQuery.split("co ")[1];

                searchList = searchList.filter((invite) => {
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
            (invitation) => invitation.status === invitationStatusOption.toUpperCase());

        if (finalInvitations.length > listItemLimit) {
            finalInvitations = finalInvitations.slice(listOffset, listOffset + listItemLimit);
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(finalInvitations.length === listItemLimit);
        } else {
            setFinalGuestList(finalInvitations);
            setIsNextPageAvailable(false);
        }
    }, [ paginatedGuestList, listOffset, listItemLimit, isInvitationStatusOptionChanged ]);

    useEffect(() => {
        setPaginateGuestList(guestsList);
    }, [ guestsList ]);

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

    useEffect(() => {
        if (invitationStatusOption !== InvitationStatus.ACCEPTED) {
            return;
        }

        if (searchQuery == undefined || searchQuery == "") {
            getUserList(listItemLimit, listOffset + 1, null, null);
        } else  {
            getUserList(listItemLimit, listOffset + 1, searchQuery, null);
        }
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        getGuestUsersList();
        getAdminUser();
        checkAdvancedUserManagementStatus();
        // Default value of invitationStatusOption is ACCEPTED. This webhook logic needs to be ignored if the
        // invitationStatusOption has been manually set externally.
        if (InvitationStatus.ACCEPTED.toUpperCase() === invitationStatusOption.toUpperCase()) {
            if (!onboardedGuestUserList || onboardedGuestUserList.totalResults == 0) {
                if (guestsList.filter((invitation) =>
                    invitation.status === InvitationStatus.PENDING.toUpperCase()).length > 0) {
                    setInvitationStatusOption(InvitationStatus.PENDING);
                    setIsInvitationStatusOptionChanged(true);
                } else if (guestsList.filter((invitation) =>
                    invitation.status === InvitationStatus.EXPIRED.toUpperCase()).length > 0) {
                    setInvitationStatusOption(InvitationStatus.EXPIRED);
                    setIsInvitationStatusOptionChanged(true);
                }
            }
        }
        // Reset invitationStatusOption to default value when unmounting this component.

        return () => {
            setInvitationStatusOption(InvitationStatus.ACCEPTED);
            setIsInvitationStatusOptionChanged(true);
        };
    }, []);

    useEffect(() => {
        if (!isListUpdated) {
            return;
        }

        if (hasRequiredScopes(featureConfig?.guestUser,
            featureConfig?.guestUser?.scopes?.read, allowedScopes)) {
            getGuestUsersList();
        }
        setListUpdated(false);
    }, [ isListUpdated ]);

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

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps)
        : void => {
        setListItemLimit(data.value as number);
    };

    const invitationStatusOptions = [
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
     * Checks whether administrator role is present in the user.
     */
    const isAdminUser = (user: UserBasicInterface): boolean => {
        return user.roles.some((role) => role.display === UserAccountTypes.ADMINISTRATOR);
    };

    /**
     * Util method to get super admin
     */
    const getAdminUser = (): void => {
        getServerConfigs()
            .then((response) => {
                setRealmConfigs(response?.realmConfig);
            }).catch((error) => {
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
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError. " +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));

            });
    };

    /**
     * Fetch the guest users list.
     */
    const getGuestUsersList = (): void => {
        setGuestUsersListRequestLoading(true);

        getInvitedUserList()
            .then((response) => {
                const data = [ ...response.data ];
                const invitations = data as UserInviteInterface[];
                const finalInvitations: UserInviteInterface[] = [];

                invitations.map((ele) => {
                    const invite: UserInviteInterface = {
                        email: ele.email,
                        id: ele.id,
                        roles: ele.roles,
                        status: ele.status
                    };

                    finalInvitations.push(invite);
                });

                setGuestsList(finalInvitations);
            }).catch((error) => {
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
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError. " +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));

            })
            .finally(() => {
                setGuestUsersListRequestLoading(false);
            });
    };

    const getUserList = (limit: number, offset: number, filter: string, attribute: string): void => {

        setOnboardedGuestUsersListRequestLoading(true);

        const modifiedLimit = limit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;
        // Excluding groups from getUserList API call to improve performance.
        const excludedAttributes = UsersConstants.GROUPS_ATTRIBUTE;
        let modifiedFilter = "groups eq Administrator";

        if (filter !== null) {
            modifiedFilter = filter;
        }

        getUsersList(modifiedLimit, offset, modifiedFilter, attribute, null, excludedAttributes)
            .then((response) => {
                const data = { ...response };
                const processedUserList = [];

                data.Resources = data?.Resources?.map((resource) => {
                    // Filter out users belong to groups named "Administrator"
                    if (!isAdminUser(resource)) {
                        return null;
                    }

                    if (isOwner(resource) && isMyself(resource)) {
                        processedUserList[0] = resource;
                        
                        return null;
                    } else {
                        if (isMyself(resource)) {
                            processedUserList[0] = resource;

                            return null;
                        }
                        if (isOwner(resource)) {
                            processedUserList[1] = resource;

                            return null;
                        }
                    }

                    let email: string = null;

                    if (resource?.emails instanceof Array) {
                        const emailElement = resource?.emails[0];

                        if (typeof emailElement === "string") {
                            email = emailElement;
                        } else {
                            email = emailElement?.value;
                        }
                    }

                    resource.emails = [ email ];

                    return resource;
                });

                data.Resources = processedUserList.concat(data.Resources);

                setOnboardedGuestUserList(moderateUsersList(data, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET));
            }).catch((error) => {
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

                setOnboardedGuestUserList({
                    Resources: [],
                    itemsPerPage: 10,
                    links: [],
                    startIndex: 1,
                    totalResults: 0
                });

                return;
            })
            .finally(() => {
                setOnboardedGuestUsersListRequestLoading(false);
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
     * @param {UserListInterface} list - Users list retrieved from the API.
     * @param {number} requestedLimit - Requested item limit.
     * @param {number} popCount - Tempt count used which will be removed after figuring out if next page is available.
     * @return {UserListInterface}
     */
    const moderateUsersList = (list: UserListInterface, requestedLimit: number,
        popCount: number = 1): UserListInterface => {

        const moderated: UserListInterface = list;

        if (moderated.itemsPerPage === requestedLimit) {
            moderated.Resources.splice(-1, popCount);
            setIsGuestUsersNextPageAvailable(true);
        } else {
            setIsGuestUsersNextPageAvailable(false);
        }

        return moderated;
    };

    const isMyself = (user: UserBasicInterface):boolean => {
        if (authenticatedUser?.split("@").length < 3) {
            return null;
        }
        // Extracting the current username from authenticatedUser.
        const username: string = authenticatedUser?.split("@").slice(0,2).join("@");  

        return username === user?.userName;
    };

    const isOwner = (user: UserBasicInterface):boolean => {
        return (user[ SCIMConfigs.scim.enterpriseSchema ]?.userAccountType === UserAccountTypes.OWNER);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
        if (invitationStatusOption === InvitationStatus.ACCEPTED) {
            if (query === "userName sw ") {
                getUserList(listItemLimit, listOffset, null, null);

                return;
            }
            getUserList(listItemLimit, listOffset, query, null);
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
        const disabledUserFeatures = featureConfig.users.disabledFeatures;

        setAdvancedUserManagementDisabled(disabledUserFeatures?.includes(ADVANCED_USER_MGT));
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
                            <p>  { t("extensions:manage.users.collaboratorAccounts.consoleInfo") } </p>
                        </Text>
                    </Grid.Column>
                    <Grid.Column floated="right" width={ 6 }>
                        <CopyInputField
                            value={ tenantedConsoleUrl }
                            className="consumer-url-input"
                            data-componentid={ `${ componentId }-tenanted-console-link` }
                        />
                    </Grid.Column>
                </Grid>
            );
        };

        return (
            <div className="mt-0 mb-5">
                {
                    <Message
                        content={ generateContent() }
                    />
                }
            </div>
        );
    };

    const addAdminDropdown = (
        <PrimaryButton
            data-componentid={ `${ componentId }-add-admin-button` }
            onClick={ () => {
                eventPublisher.publish("admins-click-add-new-button");
            } }
        >
            <Icon name="add"/>
            { t("extensions:manage.users.buttons.addCollaboratorBtn") }
            <Icon name="dropdown" className="ml-3 mr-0"/>
        </PrimaryButton>
    );

    const addUserOptions = [
        { 
            "data-componentid": "admins-add-external-admin", 
            key: 1, 
            text: "Invite external admins", 
            value: AdminAccountTypes.EXTERNAL
        },
        { 
            "data-componentid": "admins-add-internal-admin", 
            disabled: true,
            key: 2, 
            text: "Assign existing users (Coming Soon)", 
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

    return (
        <PageLayout
            action={
                !isGuestUsersListRequestLoading && (
                    <Show when={ AccessControlConstants.USER_WRITE }>
                        <Dropdown
                            data-componentid={ `${ componentId }-add-admin-dropdown` }
                            direction="left"
                            floating
                            fluid
                            icon={ null }
                            trigger={ addAdminDropdown }
                        >
                            <Dropdown.Menu >
                                { addUserOptions.map((option) => (
                                    <Dropdown.Item
                                        key={ option.value }
                                        onClick={ ()=> handleDropdownItemChange(option.value) }
                                        { ...option }
                                    />
                                )) }
                            </Dropdown.Menu>
                        </Dropdown>
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
        >
            <GridLayout
                isLoading={ isGuestUsersListRequestLoading }
                showTopActionPanel={ false }
            >
                { renderTenantedConsoleLink() }
                <ListLayout
                    // TODO add sorting functionality.
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
                        invitationStatusOption === InvitationStatus.ACCEPTED ?
                            onboardedGuestUserList?.totalResults : finalGuestList?.length }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    data-componentid={ `${ componentId }-list-layout` }
                    onPageChange={ handlePaginationChange }
                    showPagination={ true }
                    showTopActionPanel={ true }
                    totalPages={ invitationStatusOption === InvitationStatus.ACCEPTED ?
                        Math.ceil(onboardedGuestUserList?.totalResults / listItemLimit) :
                        Math.ceil(paginatedGuestList?.length / listItemLimit) }
                    totalListSize={ invitationStatusOption === InvitationStatus.ACCEPTED ?
                        onboardedGuestUserList?.totalResults : paginatedGuestList?.length }
                    onSearchQueryClear={ handleSearchQueryClear }
                    paginationOptions={ {
                        disableNextButton: invitationStatusOption === InvitationStatus.ACCEPTED ?
                            !isGuestUsersNextPageAvailable : !isNextPageAvailable,
                        disablePreviousButton: (listOffset < 1)
                    } }
                    leftActionPanel={
                        (
                            <Dropdown
                                data-componentid={ `${ componentId }-list-userstore-dropdown` }
                                selection
                                options={ invitationStatusOptions && invitationStatusOptions }
                                onChange={ handleAccountStatusChange }
                                text={ `Filter by: ${ invitationStatusOption }` }
                            />
                        )
                    }
                >
                    {
                        (invitationStatusOption === InvitationStatus.ACCEPTED) &&
                        (<OnboardedGuestUsersList
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
                            ) }
                            onboardedGuestUsersList={ onboardedGuestUserList }
                            userMetaListContent={ null }
                            isLoading={ isOnboardedGuestUsersListRequestLoading }
                            realmConfigs={ realmConfigs }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-componentid={ `${ componentId }-list` }
                            readOnlyUserStores={ null }
                            featureConfig={ featureConfig }
                            onUserDelete={ () =>
                                getUserList(listItemLimit, listOffset, null, null)
                            }
                        />)
                    }
                    {
                        (invitationStatusOption === InvitationStatus.PENDING) &&
                        (<GuestUsersList
                            invitationStatusOption={ invitationStatusOption }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onboardedGuestUserList={ onboardedGuestUserList }
                            onSearchQueryClear={ handleSearchQueryClear }
                            guestUsersList={ finalGuestList }
                            getGuestUsersList={ () => getGuestUsersList() }
                            isGuestUsersRequestLoading={ isGuestUsersListRequestLoading }
                            searchQuery={ searchQuery }
                        />)
                    }
                    {
                        (invitationStatusOption === InvitationStatus.EXPIRED) &&
                        (<GuestUsersList
                            invitationStatusOption={ invitationStatusOption }
                            onEmptyListPlaceholderActionClick={ () => setShowExtenalAdminWizard(true) }
                            onboardedGuestUserList={ onboardedGuestUserList }
                            onSearchQueryClear={ handleSearchQueryClear }
                            guestUsersList={ finalGuestList?.filter(
                                (invitation) => invitation.status === InvitationStatus.EXPIRED.toUpperCase()) }
                            getGuestUsersList={ () => getGuestUsersList() }
                            isGuestUsersRequestLoading={ isGuestUsersListRequestLoading }
                            searchQuery={ searchQuery }
                        />)
                    }

                </ListLayout>
            </GridLayout>
            {
                showExtenalAdminWizard && (
                    <AddUserWizard
                        data-componentid={ `${ componentId }-add-admin-wizard-modal` }
                        closeWizard={ () => {
                            setShowExtenalAdminWizard(false);
                        } }
                        updateList={ () => setListUpdated(true) }
                        rolesList={ rolesList }
                        emailVerificationEnabled={ true }
                        onInvitationSendSuccessful={ () => {
                            eventPublisher.publish("manage-users-finish-creating-collaborator-user");
                            setListUpdated(true);
                            setInvitationStatusOption(InvitationStatus.PENDING);
                            setIsInvitationStatusOptionChanged(true);
                        } }
                        defaultUserTypeSelection={ UserAccountTypes.ADMINISTRATOR }
                        adminTypeSelection={ selectedAddAdminType }
                    />
                )
            }
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
