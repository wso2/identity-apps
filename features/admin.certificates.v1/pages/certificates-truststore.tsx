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

import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, Certificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, UIConstants, filterList, sortList } from "@wso2is/admin.core.v1";
import { listClientCertificates } from "../api";
import { CertificatesList } from "../components";

/**
 * Props for the Certificates Truststore page.
 */
type CertificatesTruststorePageInterface = TestableComponentInterface

/**
 * This renders the Certificates Truststore page.
 *
 * @param CertificatesTruststorePageInterface - props Props injected to the component.
 */
const CertificatesTruststore: FunctionComponent<CertificatesTruststorePageInterface> = (
    props: CertificatesTruststorePageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

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
            text: "Alias",
            value: "alias"
        }
    ];

    const [ certificatesTruststore, setCertificatesTruststore ] = useState<Certificate[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ filteredCertificatesTruststore, setFilteredCertificatesTruststore ] = useState<Certificate[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches all certificates.
     */
    const fetchCertificatesTruststore = () => {
        setIsLoading(true);
        listClientCertificates().then((response:any) => {
            setCertificatesTruststore(response);
            setFilteredCertificatesTruststore(response);
            setIsLoading(false);
        }).catch((error: IdentityAppsError) => {
            setIsLoading(false);
            dispatch(addAlert(
                {
                    description: error?.description || "An error occurred while fetching certificates",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    };

    useEffect(() => {
        fetchCertificatesTruststore();
    }, []);

    useEffect(() => {
        setFilteredCertificatesTruststore((sortList(filteredCertificatesTruststore, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices and returns a portion of the list.
     *
     * @param list - List of items.
     * @param limit - Items per page.
     * @param offset - Offset.
     */
    const paginate = (list: Certificate[], limit: number, offset: number): Certificate[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param event -  React.MouseEvent<HTMLAnchorElement>.
     * @param data -  DropdownProps.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * This paginates.
     *
     * @param event - React.MouseEvent<HTMLAnchorElement>.
     * @param data - PaginationProps.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles sort order change.
     *
     * @param isAscending - boolean.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handle sort strategy change.
     *
     * @param event - React.SyntheticEvent<HTMLElement> .
     * @param data - DropdownProps.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter((option: any )=> option.value === data.value)[ 0 ]);
    };

    /**
     * Handles the `onFilter` callback action from the search component.
     *
     * @param query - Search query.
     */
    const handleTruststoreFilter = (query: string): void => {
        // TODO: Implement once the API is ready
        // fetchCertificatesTruststore(null, null, null, query);
        setFilteredCertificatesTruststore(filterList(certificatesTruststore, query, "alias", true));
        setSearchQuery(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredCertificatesTruststore(certificatesTruststore);
    };

    return (
        <PageLayout
            title="Certificates in the Truststore"
            pageTitle="Certificates in the Truststore"
            description="Create and manage certificates in the truststore"
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                advancedSearch={
                    (<AdvancedSearchWithBasicFilters
                        onFilter={ handleTruststoreFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: "Alias",
                                value: "alias"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("certificates:truststore.advancedSearch.form.inputs" +
                                ".filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("certificates:truststore.advancedSearch.form.inputs" +
                                ".filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("certificates:truststore.advancedSearch.form.inputs" +
                                ".filterValue.placeholder")
                        }
                        placeholder={
                            t("certificates:truststore.advancedSearch.placeholder")
                        }
                        defaultSearchAttribute="alias"
                        defaultSearchOperator="co"
                        data-testid={ `${ testId }-advanced-search` }
                    />)
                }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleSortStrategyChange }
                onSortOrderChange={ handleSortOrderChange }
                leftActionPanel={ null }
                showPagination={ true }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
                totalPages={ Math.ceil(filteredCertificatesTruststore?.length / listItemLimit) }
                totalListSize={ filteredCertificatesTruststore?.length }
                data-testid={ `${ testId }-list-layout` }
            >
                <CertificatesList
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
                            onFilter={ handleTruststoreFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: "Alias",
                                    value: "alias"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("certificates:truststore.advancedSearch.form.inputs" +
                                    ".filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("certificates:truststore.advancedSearch.form.inputs" +
                                    ".filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("certificates:truststore.advancedSearch.form.inputs" +
                                    ".filterValue.placeholder")
                            }
                            placeholder={
                                t("certificates:truststore.advancedSearch.placeholder")
                            }
                            defaultSearchAttribute="alias"
                            defaultSearchOperator="co"
                            data-testid={ `${ testId }-advanced-search` }
                        />)
                    }
                    isLoading={ isLoading }
                    list={ paginate(filteredCertificatesTruststore, listItemLimit, offset) }
                    update={ fetchCertificatesTruststore }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    type="truststore"
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
CertificatesTruststore.defaultProps = {
    "data-testid": "certificate-truststore"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CertificatesTruststore;
