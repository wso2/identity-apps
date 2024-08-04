/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    filterList,
    history,
    sortList
} from "@wso2is/admin.core.v1";
import { attributeConfig } from "@wso2is/admin.extensions.v1";
import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { DocumentationLink, ListLayout, PageLayout, PrimaryButton, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getADialect } from "../api";
import { AddLocalClaims, ClaimsList, ListType } from "../components";

/**
 * Props for the Local Claims page.
 */
type LocalClaimsPageInterface = TestableComponentInterface;

/**
 * This returns the list of local claims.
 *
 * @param props - Props injected to the component.
 *
 * @returns local claims page.
 */
const LocalClaimsPage: FunctionComponent<LocalClaimsPageInterface> = (
    props: LocalClaimsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    /**
     * Sets the attributes by which the list can be sorted
     */
    const SORT_BY: {
        key: number;
        text: string;
        value: string;
    }[] = [
        {
            key: 0,
            text: t("common:name"),
            value: "displayName"
        },
        {
            key: 1,
            text: t("claims:local.attributes.attributeURI"),
            value: "claimURI"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const [ claims, setClaims ] = useState<Claim[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ openModal, setOpenModal ] = useState(false);
    const [ claimURIBase, setClaimURIBase ] = useState("");
    const [ filteredClaims, setFilteredClaims ] = useState<Claim[]>(null);
    const [ sortBy, setSortBy ] = useState<DropdownItemProps>(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ resetPagination, setResetPagination ] = useTrigger();

    const dispatch: Dispatch = useDispatch();

    const initialRender: MutableRefObject<boolean> = useRef(true);


    /**
 * Fetches all the local claims.
 *
 * @param limit - Maximum Limit.
 * @param offset - Offset.
 * @param sort - Sort Order.
 * @param filter - Search Filter.
 */
    const getLocalClaims = (limit?: number, sort?: string, offset?: number, filter?: string,
        excludeIdentity: boolean = !enableIdentityClaims) => {
        setIsLoading(true);
        const params: ClaimsGetParams = {
            "exclude-identity-claims": excludeIdentity,
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
        };

        getAllLocalClaims(params).then((response: Claim[]) => {
            setClaims(response);
            setFilteredClaims(sortList(response, sortBy.value as string, sortOrder));
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("claims:local.notifications.getClaims.genericError.message")
                }
            ));
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            setFilteredClaims(sortList(filteredClaims, sortBy.value as string, sortOrder));
        }
    }, [ sortBy, sortOrder ]);

    useEffect(() => {
        getLocalClaims(null, null, null, null, !enableIdentityClaims);
        getADialect("local").then((response: any) => {
            setClaimURIBase(response.dialectURI);
        }).catch((error: IdentityAppsError) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("claims:local.notifications.getLocalDialect.genericError.message"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:local.notifications.getLocalDialect.genericError.message")
                }
            ));
        });
    }, []);

    /**
 * This slices a portion of the list to display.
     *
 * @param list - List of claims.
 * @param limit - Maximum Limit.
 * @param offset - Offset.
     *
 * @returns Paginated List.
 */
    const paginate = (list: Claim[], limit: number, offset: number): Claim[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param event - React.MouseEvent<HTMLAnchorElement>.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * This paginates.
     *
     * @param event - React.MouseEvent<HTMLAnchorElement>.
     * @param data - Pagination props.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handle sort strategy change.
     *
     * @param event - Dropdown event.
     * @param  data - Dropdown data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter((option: DropdownProps) => option.value === data.value)[ 0 ]);
    };

    /**
 * Handles sort order change.
 *
 * @param isAscending - Flag to determine the order.
 */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handles the `onFilter` callback action from the
     * advanced search component.
     *
     * @param query - Search query.
     */
    const handleLocalClaimsFilter = (query: string): void => {
        const filteredClaims: Claim[] = filterList(claims, query, sortBy.value as string, sortOrder);

        setFilteredClaims(filteredClaims);
        setSearchQuery(buildSearchQuery(query));
        setOffset(0);
        setResetPagination();
    };

    /**
     * A util function to build a user friendly seach query
     * for display purpose.
     *
     * @param defaultQuery - generated
     * @returns
     */
    const buildSearchQuery = (defaultQuery: string): string => {
        const queryElements: string[] = defaultQuery?.split(" ");
        let UserFriendlyQuery: string = "";

        if (queryElements) {
            switch (queryElements[ 1 ]) {
                case "eq":
                    UserFriendlyQuery = `${ queryElements[ 0 ] } equals to ${ queryElements[ 2 ] }`;

                    break;
                case "co":
                    UserFriendlyQuery = `${ queryElements[ 0 ] } containing ${ queryElements[ 2 ] }`;

                    break;
                case "sw":
                    UserFriendlyQuery = `${ queryElements[ 0 ] } starting with ${ queryElements[ 2 ] }`;

                    break;
                case "ew":
                    UserFriendlyQuery = `${ queryElements[ 0 ] } ending with ${ queryElements[ 2 ] }`;

                    break;

                default:
                    break;
            }
        }

        return UserFriendlyQuery;
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredClaims(claims);
    };

    return (
        <>
            {
                openModal
                    ? (
                        <AddLocalClaims
                            open={ openModal }
                            onClose={ () => { setOpenModal(false); } }
                            update={ getLocalClaims }
                            claimURIBase={ claimURIBase }
                            data-testid={ `${ testId }-add-local-claims-wizard` }
                        />
                    ) : null
            }
            <PageLayout
                action={
                    (isLoading || !(!searchQuery && filteredClaims?.length <= 0))
                    && attributeConfig.attributes.addAttribute && (
                        <Show
                            when={ featureConfig?.attributeDialects?.scopes?.create }
                        >
                            <PrimaryButton
                                onClick={ () => {
                                    setOpenModal(true);
                                } }
                                data-testid={ `${ testId }-list-layout-add-button` }
                            >
                                <Icon name="add" />
                                { t("claims:local.pageLayout.local.action") }
                            </PrimaryButton>
                        </Show>
                    )
                }
                isLoading={ isLoading }
                title={ t("claims:local.pageLayout.local.title") }
                pageTitle={ t("claims:local.pageLayout.local.title") }
                description={ (
                    <>
                        { t(attributeConfig.attributes.description) }
                        <DocumentationLink
                            link={ getLink("manage.attributes.attributes.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>
                ) }
                backButton={ {
                    onClick: () => { history.push(AppConstants.getPaths().get("CLAIM_DIALECTS")); },
                    text: t("claims:local.pageLayout.local.back")
                } }
                data-testid={ `${ testId }-page-layout` }
            >
                <ListLayout
                    resetPagination={ resetPagination }
                    advancedSearch={ (
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleLocalClaimsFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "displayName"
                                },
                                {
                                    key: 1,
                                    text: t("claims:local.attributes.attributeURI"),
                                    value: "claimURI"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("claims:local.advancedSearch.form." +
                                    "inputs.filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("claims:local.advancedSearch.form." +
                                    "inputs.filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("claims:local.advancedSearch.form.inputs." +
                                    "filterValue.placeholder")
                            }
                            placeholder={ t("claims:local.advancedSearch.placeholder") }
                            defaultSearchAttribute="displayName"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-list-advanced-search` }
                        />
                    ) }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleSortStrategyChange }
                    leftActionPanel={ null }
                    showPagination={ true }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    showTopActionPanel={ isLoading || !(!searchQuery && filteredClaims?.length <= 0) }
                    totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
                    totalListSize={ filteredClaims?.length }
                    onSortOrderChange={ handleSortOrderChange }
                    data-testid={ `${ testId }-list-layout` }
                >
                    <ClaimsList
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleLocalClaimsFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "displayName"
                                    },
                                    {
                                        key: 1,
                                        text: t("claims:local.attributes.attributeURI"),
                                        value: "claimURI"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("claims:local.advancedSearch.form." +
                                        "inputs.filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("claims:local.advancedSearch.form." +
                                        "inputs.filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("claims:local.advancedSearch.form.inputs." +
                                        "filterValue.placeholder")
                                }
                                placeholder={ t("claims:local.advancedSearch.placeholder") }
                                defaultSearchAttribute="displayName"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-list-advanced-search` }
                            />
                        ) }
                        showTableHeaders={ true }
                        isLoading={ isLoading }
                        list={ paginate(filteredClaims, listItemLimit, offset) }
                        localClaim={ ListType.LOCAL }
                        update={ getLocalClaims }
                        onEmptyListPlaceholderActionClick={ () => setOpenModal(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                        featureConfig={ featureConfig }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
LocalClaimsPage.defaultProps = {
    "data-testid": "local-claims"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default LocalClaimsPage;
