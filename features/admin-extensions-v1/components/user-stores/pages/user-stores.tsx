/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, ListLayout, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { PaginationProps } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    UIConstants,
    history,
    sortList
} from "../../../../admin-core-v1";
import { useUserStores } from "../../../../admin-userstores-v1/api";
import { UserStoresList } from "../../../../admin-userstores-v1/components";
import { UserStoreManagementConstants } from "../../../../admin-userstores-v1/constants";
import { UserStoreListItem } from "../../../../admin-userstores-v1/models/user-stores";
import { RemoteUserStoreConstants } from "../constants";

/**
 * Props for the Userstore page.
 */
type UserStoresPageInterface = TestableComponentInterface;

/**
 * This renders the Userstores page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Userstores page.
 */
const UserStores: FunctionComponent<UserStoresPageInterface> = (
    props: UserStoresPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY: {
        key: number;
        text: string;
        value: string;
    }[] = [
        {
            key: 0,
            text: t("common:name"),
            value: "name"
        },
        {
            key: 1,
            text: t("common:description"),
            value: "description"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);
    const [ offset, setOffset ] = useState(0);
    // TODO: Verify and remove unnecessary state variable usages.
    // https://github.com/wso2-enterprise/asgardeo-product/issues/16362
    const [ listItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ filteredUserStores, setFilteredUserStores ] = useState<UserStoreListItem[]>(undefined);
    const [ sortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const {
        data: originalUserStoreList,
        isLoading: isUserStoreListFetchRequestLoading,
        error: userStoreListFetchRequestError,
        mutate: mutateUserStoreListFetchRequest
    } = useUserStores({ filter: null, limit: null, offset: null, sort: null });

    /**
     * Moderate Userstores list fetch response from the API.
     */
    useEffect(() => {
        if (!originalUserStoreList) {
            return;
        }

        const userStores: UserStoreListItem[] = originalUserStoreList.filter(
            (userStore: UserStoreListItem) => userStore.id !== RemoteUserStoreConstants.CUSTOMER_USERSTORE_ID
        );

        setUserStores(userStores);
        setFilteredUserStores(userStores);
    }, [ originalUserStoreList ]);

    /**
     * Handles Userstore fetch request error.
     */
    useEffect(() => {
        if (!userStoreListFetchRequestError) {
            return;
        }

        // Ignore resource not found errors.
        if (userStoreListFetchRequestError?.response?.data?.message
            === UserStoreManagementConstants.RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
            return;
        }

        dispatch(addAlert({
            description: userStoreListFetchRequestError?.response?.data?.description
                || t("userstores:notifications.fetchUserstores.genericError" +
                    ".description"),
            level: AlertLevels.ERROR,
            message: userStoreListFetchRequestError?.response?.data?.message
                || t("userstores:notifications.fetchUserstores.genericError.message")
        }));
    }, [ userStoreListFetchRequestError ]);

    useEffect(() => {
        setFilteredUserStores((sortList(filteredUserStores, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices and returns a portion of the list.
     *
     * @param list - List to be paginated.
     * @param limit - Limit per page.
     * @param offset - Offset value.
     *
     * @returns Paginated list.
     */
    const paginate = (list: UserStoreListItem[], limit: number, offset: number): UserStoreListItem[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * This paginates.
     *
     * @param event - Click event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredUserStores(userStores);
    };

    return (
        <PageLayout
            pageTitle="User Stores"
            title={ t("extensions:manage.features.userStores.list.title") }
            description={ (
                <>
                    { t("extensions:manage.features.userStores.list.subTitle") }
                    <DocumentationLink
                        link={ getLink("manage.userStores.userStoresList.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onPageChange={ handlePaginationChange }
                leftActionPanel={ null }
                showPagination={ false }
                showTopActionPanel={ false }
                totalPages={ 1 }
                totalListSize={ filteredUserStores?.length }
                isLoading={ isUserStoreListFetchRequestLoading || filteredUserStores === undefined }
                data-testid={ `${ testId }-list-layout` }
            >
                <UserStoresList
                    list={ paginate(filteredUserStores, listItemLimit, offset) }
                    onEmptyListPlaceholderActionClick={ () =>
                        history.push(RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE"))
                    }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    update={ () => mutateUserStoreListFetchRequest() }
                    featureConfig={ featureConfig }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
UserStores.defaultProps = {
    "data-testid": "userstores"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserStores;
