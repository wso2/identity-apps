/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { sortList } from "@wso2is/admin.core.v1/utils/sort-list";
import { UserStoresList } from "@wso2is/admin.userstores.v1/components";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { TestableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, ListLayout, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PaginationProps } from "semantic-ui-react";
import { RemoteUserStoreConstants } from "../constants/remote-user-stores-constants";

/**
 * Props for the Userstore page.
 */
type RemoteUserStoresPagePropsInterface = TestableComponentInterface;

/**
 * This renders the Remote Userstores page.
 *
 * @param props - Props injected to the component.
 * @returns Remote Userstores page component.
 */
const RemoteUserStoresPage: FunctionComponent<RemoteUserStoresPagePropsInterface> = (
    props: RemoteUserStoresPagePropsInterface
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
    const systemReservedUserStores: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.systemReservedUserStores);

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

    const {
        isLoading: isUserStoreListFetchRequestLoading,
        userStoresList: originalUserStoreList,
        mutateUserStoreList: mutateUserStoreListFetchRequest
    } = useUserStores();

    useEffect(() => {
        mutateUserStoreListFetchRequest();
    }, []);

    /**
     * Moderate Userstores list fetch response from the API.
     */
    useEffect(() => {
        if (!originalUserStoreList) {
            return;
        }

        const userStores: UserStoreListItem[] = originalUserStoreList.filter(
            (userStore: UserStoreListItem) =>
                userStore.id !== RemoteUserStoreConstants.CUSTOMER_USERSTORE_ID &&
                !systemReservedUserStores?.includes(userStore?.name)
        );

        setUserStores(userStores);
        setFilteredUserStores(userStores);
    }, [ originalUserStoreList ]);

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
                        { t("common:learnMore") }
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
RemoteUserStoresPage.defaultProps = {
    "data-testid": "userstores"
};

export default RemoteUserStoresPage;
