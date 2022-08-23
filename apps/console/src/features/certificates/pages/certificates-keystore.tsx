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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, Certificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    filterList,
    sortList
} from "../../core";
import { listCertificateAliases } from "../api";
import { CertificatesList, ImportCertificate } from "../components";

/**
 * Props for the Certificates Keystore page.
 */
type CertificatesKeystorePageInterface = TestableComponentInterface

/**
 * This renders the Certificates Keystore page.
 *
 * @param {CertificatesKeystorePageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const CertificatesKeystore: FunctionComponent<CertificatesKeystorePageInterface> = (
    props: CertificatesKeystorePageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: t("console:manage.features.certificates.keystore.attributes.alias"),
            value: "alias"
        }
    ];

    const [ certificatesKeystore, setCertificatesKeystore ] = useState<Certificate[]>([]);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ openModal, setOpenModal ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ filteredCertificatesKeystore, setFilteredCertificatesKeystore ] = useState<Certificate[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ isSuper, setIsSuper ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const tenantDomain: string = useSelector<AppState, string>((state: AppState) => state.config.deployment.tenant);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ resetPagination, setResetPagination ] = useTrigger();

    const dispatch = useDispatch();

    useEffect(() => {
        if (tenantDomain === "carbon.super") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }, [ tenantDomain ]);

    /**
     * Fetches all certificates.
     */
    const fetchCertificatesKeystore = () => {
        setIsLoading(true);
        listCertificateAliases()
            .then(response => {
                setCertificatesKeystore(response);
                setFilteredCertificatesKeystore(response);
            })
            .catch(error => {
                setIsLoading(false);
                dispatch(addAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.certificates.keystore.notifications." +
                                "getCertificates.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.certificates.keystore.notifications." +
                                "getCertificates.genericError.message")
                    }
                ));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCertificatesKeystore();
    }, []);

    useEffect(() => {
        setFilteredCertificatesKeystore((sortList(filteredCertificatesKeystore, sortBy.value, sortOrder)));
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

    /**
     * Handles the `onFilter` callback action from the search component.
     *
     * @param {string} query - Search query.
     */
    const handleKeystoreFilter = (query: string): void => {
        // TODO: Implement once the API is ready
        // fetchCertificatesKeystore(null, null, null, searchQuery);
        setFilteredCertificatesKeystore(filterList(certificatesKeystore, query, "alias", true));
        setSearchQuery(query);
        setOffset(0);
        setResetPagination();
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredCertificatesKeystore(certificatesKeystore);
    };

    return (
        <>
            {
                openModal
                && (
                    <ImportCertificate
                        open={ openModal }
                        onClose={ () => setOpenModal(false) }
                        update={ fetchCertificatesKeystore }
                        data-testid={ `${ testId }-import-wizard` }
                    />
                )
            }
            <PageLayout
                action={
                    (isLoading || !(!searchQuery && certificatesKeystore?.length <= 0))
                    && hasRequiredScopes(featureConfig?.certificates, featureConfig?.certificates?.scopes?.create,
                        allowedScopes)
                    && !isSuper && (
                        <PrimaryButton
                            onClick={ () => {
                                setOpenModal(true);
                            } }
                            data-testid={ `${ testId }-list-layout-upload-button` }
                        >
                            <Icon name="cloud upload" />
                            { t("console:manage.features.certificates.keystore.pageLayout.primaryAction") }
                        </PrimaryButton>
                    )
                }
                isLoading={ isLoading }
                title={ t("console:manage.features.certificates.keystore.pageLayout.title") }
                pageTitle={ t("console:manage.features.certificates.keystore.pageLayout.title") }
                description={ t("console:manage.features.certificates.keystore.pageLayout.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                <ListLayout
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
                            onFilter={ handleKeystoreFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: "Alias",
                                    value: "alias"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                    ".filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                    ".filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                    ".filterValue.placeholder")
                            }
                            placeholder={
                                t("console:manage.features.certificates.keystore.advancedSearch.placeholder")
                            }
                            defaultSearchAttribute="alias"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advanced-search` }
                        />)
                    }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleSortStrategyChange }
                    onSortOrderChange={ handleSortOrderChange }
                    resetPagination={ resetPagination }
                    leftActionPanel={ null }
                    showPagination={ true }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    showTopActionPanel={ isLoading || !(!searchQuery && certificatesKeystore?.length <= 0) }
                    totalPages={ Math.ceil(filteredCertificatesKeystore?.length / listItemLimit) }
                    totalListSize={ filteredCertificatesKeystore?.length }
                    data-testid={ `${ testId }-list-layout` }
                >
                    <CertificatesList
                        advancedSearch={
                            (<AdvancedSearchWithBasicFilters
                                onFilter={ handleKeystoreFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: "Alias",
                                        value: "alias"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                        ".filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                        ".filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:manage.features.certificates.keystore.advancedSearch.form.inputs" +
                                        ".filterValue.placeholder")
                                }
                                placeholder={
                                    t("console:manage.features.certificates.keystore.advancedSearch.placeholder")
                                }
                                defaultSearchAttribute="alias"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advanced-search` }
                            />)
                        }
                        isLoading={ isLoading }
                        list={ paginate(filteredCertificatesKeystore, listItemLimit, offset) }
                        onEmptyListPlaceholderActionClick={ () => setOpenModal(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        update={ fetchCertificatesKeystore }
                        type="keystore"
                        featureConfig={ featureConfig }
                        data-testid={ `${ testId }-list` }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
CertificatesKeystore.defaultProps = {
    "data-testid": "certificate-keystore"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CertificatesKeystore;
