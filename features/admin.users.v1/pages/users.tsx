/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    ListLayout,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import {  DropdownProps, PaginationProps } from "semantic-ui-react";
import { useUsersList } from "../api/use-get-users-list";
import { UsersList } from "../components/users-list";
import { AddUserWizard } from "../components/wizard/add-user-wizard";
import { UserListInterface } from "../models/user";
import "./users.scss";

/**
 * Props for the Users page.
 */
type UsersPageInterface = IdentifiableComponentInterface & RouteComponentProps;


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
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch: Dispatch<any> = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ listOffset, setListOffset ] = useState<number>(1);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    // Get users list.
    const {
        data: originalUserList,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError,
        mutate: mutateUserListFetchRequest
    } = useUsersList();

    const usersList: UserListInterface = useMemo(() => originalUserList, [ originalUserList ]);

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
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery(null);
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
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset(((data.activePage as number - 1) * listItemLimit) + 1);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const onUserDelete = (): void => {
        mutateUserListFetchRequest();
    };

    /**
     * Renders an advanced search filter for users list and invitations list.
     *
     * @param isUserList - If `true`, allows filtering by other available attributes.
     *                     If `false`, allows filtering only by username (for invitation list).
     * @returns The search filter component.
     */
    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            onFilter={ handleUserFilter }
            filterAttributeOptions={ [] }
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


    return (
        <PageLayout
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
            action={ (
                <Button
                    data-componentid={ `${ componentId }-add-user-button` }
                    onClick={ () => {
                        setShowWizard(true);
                    } }
                    variant="contained"
                    size="small"
                    startIcon={ <PlusIcon /> }
                >
                    { t("extensions:manage.users.buttons.addUserBtn") }
                </Button>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <ListLayout
                className="sub-org-users-list"
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ usersList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ usersList?.totalResults }
                isLoading={ isUserListFetchRequestLoading }
            >
                <UsersList
                    usersList={ usersList }
                    onUserDelete={ onUserDelete }
                    userMetaListContent={ null }
                    realmConfigs={ null }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid="user-mgt-user-list"
                    featureConfig={ featureConfig }
                    isReadOnlyUserStore={ false }
                />
            </ListLayout>
            {
                showWizard && (
                    <AddUserWizard
                        data-componentid="add-user-wizard-modal"
                        closeWizard={ () => {
                            setShowWizard(false);
                        } }
                        onSuccessfulUserAddition={ (id: string) => {
                            mutateUserListFetchRequest();
                            history.push(AppConstants.getPaths().get("USER_EDIT").replace(":id", id));
                        } }
                    />
                )
            }
        </PageLayout>
    );
};

export default UsersPage;
