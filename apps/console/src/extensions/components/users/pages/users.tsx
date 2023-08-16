/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface, UIConstants, UserStoreDetails, UserStoreProperty, getEmptyPlaceholderIllustrations, history
} from "../../../../features/core";
import { deleteUser, useUsersList } from "../../../../features/users/api/users";
import { UserBasicInterface, UserListInterface } from "../../../../features/users/models/user";
import { CONSUMER_USERSTORE } from "../../users/constants";
import { getUserStores } from "../api";
import { UsersList } from "../components";
import { UserAccountTypes, UsersConstants } from "../constants";
import { AddUserWizard } from "../wizard";

/**
 * Props for the Users page.
 */
type UsersPageInterface = IdentifiableComponentInterface & TestableComponentInterface & RouteComponentProps;

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Users listing page.
 *
 * @param props - Props injected to the component.
 * @returns Users Page component
 */
const UsersPage: FunctionComponent<UsersPageInterface> = (
    props: UsersPageInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId,
        [ "data-testid"]: testId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ selectedAddUserType ] = useState<UserAccountTypes>(UserAccountTypes.USER);
    const [ isUsersNextPageAvailable, setIsUsersNextPageAvailable ] = useState<boolean>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ userStoreError, setUserStoreError ] = useState(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ rolesList ] = useState([]);
    const [ userListMetaContent ] = useState(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ readOnlyUserStoresList , setReadOnlyUserStoresList ] = useState<string[]>([]);
    const [ userStoreList, setUserStoreList ] = useState<DropdownItemProps[]>([]);
    const [ isUserStoreListLoading, setUserStoreListLoading ] = useState<boolean>(false);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(CONSUMER_USERSTORE);
    const [ isSelectedUserStoreReadOnly, setSelectedUserStoreReadOnly ] = useState<boolean>(false);
    const [ isUserStoreDropdownDisabled, setUserStoreDropdownDisabled ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const modifiedLimit: number = listItemLimit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;
    // Excluding groups and roles from getUserList API call to improve performance.
    const excludedAttributes: string = UsersConstants.GROUPS_AND_ROLES_ATTRIBUTE;

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

    /**
     * Dispatches error notifications if user fetch request fails.
     */
    useEffect(() => {
        if (!userListFetchRequestError) {
            return;
        }

        if (userListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: userListFetchRequestError?.response?.data?.description
                    ?? userListFetchRequestError?.response?.data?.detail
                        ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: userListFetchRequestError?.response?.data?.message
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
    }, [ userListFetchRequestError ]);

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
            type: "user"
        });
        setShowWizard(true);
    }, [ urlSearchParams.get(UsersConstants.USER_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Fetch userstores at the initial loading.
     */
    useEffect(() => {
        getUserStoreList();
    }, []);

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

        setUserStoreError(false);

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
         * @returns Moderated users list.
         */
        const moderateUsersList = (list: UserListInterface, requestedLimit: number,
            popCount: number = 1): UserListInterface => {

            const moderated: UserListInterface = list;

            if (moderated.itemsPerPage === requestedLimit) {
                moderated.Resources.splice(-1, popCount);
                setIsUsersNextPageAvailable(true);
            } else {
                setIsUsersNextPageAvailable(false);
            }

            return moderated;
        };

        return moderateUsersList(clonedUserList, modifiedLimit, TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET);
    };

    const usersList: UserListInterface = useMemo(() => transformUserList(originalUserList), [ originalUserList ]);

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === "userName sw ") {
            mutateUserListFetchRequest();

            return;
        }

        setSearchQuery(query);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit + 1);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps)
        : void => {
        setListItemLimit(data.value as number);
    };

    const handleUserDelete = (userId: string): Promise<void> => {
        return deleteUser(userId)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.users.notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.notifications.deleteUser.success.message"
                    )
                });

                mutateUserListFetchRequest();
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
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Check the given user store is ReadOnly
     *
     * @param userStore - Userstore
     * @returns If the given userstore is read only or not
     */
    const checkReadOnlyUserStore = (userStore: UserStoreDetails): boolean => {
        if( userStore.typeName === UsersConstants.DEFAULT_USERSTORE_TYPE_NAME ) {
            return false;
        } else {
            return userStore.properties.filter(
                (property: UserStoreProperty)=>
                    property.name===UsersConstants.USER_STORE_PROPERTY_READ_ONLY)[0].value==="true";
        }
    };

    const getUserStoreList = (): void => {
        setUserStoreListLoading(true);

        getUserStores()
            .then((response: UserStoreDetails[]) => {
                const readOnlyUserStoreArray: string[] = [];
                const userStoreArray: DropdownItemProps[] = response?.map((item: UserStoreDetails, index: number) => {
                    // Set readOnly userstores based on the ReadOnly property.
                    if (checkReadOnlyUserStore(item)) {
                        readOnlyUserStoreArray.push(item.name.toUpperCase());
                    }

                    return {
                        key: index,
                        text: item.name.toUpperCase(),
                        value: item.name.toUpperCase()
                    };
                });

                setUserStoreError(false);
                setUserStoreList(userStoreArray);
                setReadOnlyUserStoresList(readOnlyUserStoreArray);
                setUserStoreDropdownDisabled(userStoreArray.length <= 1);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.users.notifications.fetchUserStores.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.users.notifications.fetchUserStores.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUserStores.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUserStores.genericError.message")
                }));

                setUserStoreError(true);

                return;
            })
            .finally(() => {
                setUserStoreListLoading(false);
            });
    };

    const handleUserStoreChange = (event: SyntheticEvent, data: DropdownProps): void => {
        setSelectedUserStore(data.value as string);
        setSelectedUserStoreReadOnly(readOnlyUserStoresList?.includes(data.value.toString().toUpperCase()));

        // Reset pagination values
        setListOffset(0);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    };

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
                t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute.placeholder")
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
            defaultSearchAttribute="emails"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
        />
    );

    return (
        <PageLayout
            pageTitle="Users"
            action={
                !isUserListFetchRequestLoading
                && originalUserList?.totalResults > 0
                && (
                    <Show when={ AccessControlConstants.USER_WRITE }>
                        <PrimaryButton
                            data-componentid={ `${ componentId }-add-user-button` }
                            data-testid={ `${ testId }-add-user-button` }
                            onClick={ () => {
                                eventPublisher.publish("manage-users-click-create-new", {
                                    type: "user"
                                });
                                setShowWizard(true);
                            } }
                        >
                            <Icon name="add"/>
                            { t("extensions:manage.users.buttons.addUserBtn") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("extensions:manage.users.usersTitle") }
            description={ (
                <>
                    { t("extensions:manage.users.usersSubTitle") }
                    <DocumentationLink
                        link={ getLink("manage.users.customerAccounts.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            data-testid={ `${ testId }-page-layout` }
            headingColumnWidth="11"
            actionColumnWidth="5"
        >
            <ListLayout
                // TODO add sorting functionality.
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ usersList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid="user-mgt-user-list-layout"
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(usersList?.totalResults / listItemLimit) }
                totalListSize={ usersList?.totalResults }
                isLoading={ isUserListFetchRequestLoading }
                paginationOptions={ {
                    disableNextButton: !isUsersNextPageAvailable
                } }
                showPaginationPageLimit={ !isSelectedUserStoreReadOnly }
                leftActionPanel={
                    (
                        <Dropdown
                            data-componentid="user-mgt-user-list-userstore-dropdown"
                            data-testid="user-mgt-user-list-userstore-dropdown"
                            selection
                            options={ userStoreList }
                            onChange={ handleUserStoreChange }
                            text={ selectedUserStore }
                            loading={ isUserStoreListLoading }
                            disabled={ isUserStoreDropdownDisabled }
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
                            <UsersList
                                advancedSearch={ advancedSearchFilter() }
                                usersList={ usersList }
                                handleUserDelete={ handleUserDelete }
                                userMetaListContent={ userListMetaContent }
                                onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                                onSearchQueryClear={ handleSearchQueryClear }
                                searchQuery={ searchQuery }
                                data-componentid="user-mgt-user-list"
                                data-testid="user-mgt-user-list"
                                readOnlyUserStores={ readOnlyUserStoresList }
                                featureConfig={ featureConfig }
                                userEditPath={ UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH") }
                            />
                        )
                }
            </ListLayout>
            {
                showWizard && (
                    <AddUserWizard
                        data-componentid="user-mgt-add-user-wizard-modal"
                        data-testid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => {
                            setShowWizard(false);
                        } }
                        rolesList={ rolesList }
                        emailVerificationEnabled={ true }
                        onSuccessfulUserAddition={ (id: string) => {
                            eventPublisher.publish("manage-users-finish-creating-user");
                            history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH")
                                .replace(":id", id));
                        } }
                        defaultUserTypeSelection={ selectedAddUserType }
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
    "data-componentid": "asgardeo-users",
    "data-testid": "asgardeo-users"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UsersPage;
