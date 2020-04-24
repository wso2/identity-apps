/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { EmptyPlaceholder } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DropdownProps, PaginationProps } from "semantic-ui-react";
import { listClientCertificates } from "../api";
import { AddUserStore, CertificatesList, CertificatesTruststoreSearch } from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";
import { UserConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertLevels, Certificate } from "../models";
import { addAlert } from "../store/actions";
import { filterList, sortList } from "../utils";

/**
 * This renders the Userstores page.
 *
 * @return {ReactElement}
 */
export const CertificatesTruststore: FunctionComponent< {} > = (): ReactElement => {

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: "Alias",
            value: "alias"
        }
    ];

    const [ certificatesTruststore, setCertificatesTruststore ] = useState<Certificate[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ openModal, setOpenModal ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ filteredCertificatesTruststore, setFilteredCertificatesTruststore ] = useState<Certificate[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);

    const dispatch = useDispatch();

    /**
     * Fetches all certificates.
     *
     * @param {number} limit.
     * @param {string} sort.
     * @param {number} offset.
     * @param {string} filter.
     */
    const fetchCertificatesTruststore = () => {
        setIsLoading(true);
        listClientCertificates().then(response => {
            setCertificatesTruststore(response);
            setFilteredCertificatesTruststore(response);
            setIsLoading(false);
        }).catch(error => {
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
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        fetchCertificatesTruststore();
    }, []);

    useEffect(() => {
        setFilteredCertificatesTruststore((sortList(filteredCertificatesTruststore, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices and returns a portion of the list.
     *
     * @param {number} list.
     * @param {number} limit.
     * @param {number} offset.
     *
     * @return {Certificate[]} Paginated list.
     */
    const paginate = (list: Certificate[], limit: number, offset: number): Certificate[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {DropdownProps} data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * This paginates.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {PaginationProps} data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles sort order change.
     *
     * @param {boolean} isAscending.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handle sort strategy change.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event.
     * @param {DropdownProps} data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    return (
        <>
            {
                openModal
                && (
                    <AddUserStore
                        open={ openModal }
                        onClose={ () => {
                            setOpenModal(false)
                        } }
                    />
                )
            }
            <PageLayout
                title="Certificates in the Truststore"
                description="Create and manage certificates in the truststore"
                showBottomDivider={ true }
            >
                {
                    filteredCertificatesTruststore?.length > 0
                        ? (<ListLayout
                            advancedSearch={
                                <CertificatesTruststoreSearch
                                    onFilter={ (query) => {
                                        // TODO: Implement once the API is ready
                                        //  fetchCertificatesTruststore(null, null, null, query);
                                        setFilteredCertificatesTruststore(
                                            filterList(certificatesTruststore, query, "alias", true)
                                        );

                                    } }
                                />
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
                        >
                            <CertificatesList
                                list={ paginate(filteredCertificatesTruststore, listItemLimit, offset) }
                                update={ fetchCertificatesTruststore }
                                type="truststore"
                            />
                        </ListLayout>
                        )
                        : !isLoading && (
                            <EmptyPlaceholder
                                title="No Certificate"
                                subtitle={ [ "Currently, there are no certificates available." ] }
                                image={ EmptyPlaceholderIllustrations.emptyList }
                                imageSize="tiny"
                            />
                        )
                }
            </PageLayout>
        </>
    );
};
