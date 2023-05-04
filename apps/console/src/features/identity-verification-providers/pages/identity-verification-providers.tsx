/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, AppConstants, EventPublisher, UIConstants, history } from "../../core";
import { useIdentityVerificationProviderList } from "../api";
import { IdentityVerificationProviderList } from "../components";


type IDVPPropsInterface = IdentifiableComponentInterface;

const IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 2,
        text: "Type",
        value: "type"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

const IdentityVerificationProvidersPage: FunctionComponent<IDVPPropsInterface> = (props: IDVPPropsInterface) => {


    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const [ hasNextPage, setHasNextPage ] = useState<boolean>(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    // const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listItemLimit, setListItemLimit ] = useState<number>(1);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemFilter, setListItemFilter ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS[0]
    );
    const {
        data: idvpList,
        isLoading: isIDVPListRequestLoading,
        error: idvpListFetchRequestError,
        mutate: idvpListMutator
    } = useIdentityVerificationProviderList(listItemLimit, listOffset, listItemFilter);
    const dispatch = useDispatch();


    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Displays an error alert when there is a failure in the identity verification provider list fetch request.
     */
    const handleIdvpFetchRequestError = () => {
        if (!idvpListFetchRequestError) {
            return;
        }
        if (idvpListFetchRequestError?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.idvp.notifications.getIDVPList.error.description",
                        { description: idvpListFetchRequestError.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idvp.notifications.getIDVPList.error.message")
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "console:develop.features.idvp.notifications.getIDVPList.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:develop.features.idvp.notifications.getIDVPList.genericError.message"
                )
            })
        );

        return;
    };

    useEffect( handleIdvpFetchRequestError , [ idvpListFetchRequestError ]);

    /**
     * Handles the `onFilter` callback action from the search component of identity verification provider.
     * @param query - Search query.
     */
    const handleIdentityVerificationProviderListFilter = (query: string) => {
        setSearchQuery(query);
        setListItemFilter(query);
    };

    /**
     * Handles item per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: SyntheticEvent, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * Sets the sorting strategy for identity verification provider list.
     *
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS.find((option: DropdownItemProps) => {
                return data.value === option.value;
            })
        );
    };

    /**
     * Triggers a re-fetch for the identity verification provider list after deleting an identity verification provider.
     */
    const onIdentityVerificationProviderDelete = async () => {
        await idvpListMutator();
    };

    const handleSearchQueryClear = () => {
        console.log("handleSearchQueryClear");
    };

    const getAdvancedSearchWithBasicFilters = () => {

        return (
            <AdvancedSearchWithBasicFilters
                onFilter={ handleIdentityVerificationProviderListFilter }
                filterAttributeOptions={ [
                    {
                        key: 0,
                        text: t("common:name"),
                        value: "name"
                    }
                ] }
                // TODO: Make this IDVP instead of Auth provider
                filterAttributePlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterAttribute" +
                    ".placeholder"
                ) }
                filterConditionsPlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterCondition" +
                    ".placeholder"
                ) }
                filterValuePlaceholder={ t(
                    "console:develop.features.authenticationProvider.advancedSearch." +
                    "form.inputs.filterValue" +
                    ".placeholder"
                ) }
                placeholder={ t(
                    "console:develop.features.authenticationProvider." +
                    "advancedSearch.placeholder"
                ) }
                defaultSearchAttribute="name"
                defaultSearchOperator="co"
                triggerClearQuery={ triggerClearQuery }
                data-componentid={ `${ componentId }-advance-search` }
            />
        );
    };

    return (
        <PageLayout
            pageTitle="Identity Verification Providers"
            action={
                (!isIDVPListRequestLoading && (searchQuery || idvpList?.identityVerificationProviders?.length > 0)) &&
                (
                    // TODO: Make this IDVP instead of IDP
                    <Show when={ AccessControlConstants.IDP_WRITE }>
                        <PrimaryButton
                            onClick={ (): void => {
                                eventPublisher.publish("connections-click-new-connection-button");
                                history.push(AppConstants.getPaths().get("IDVP_TEMPLATES"));
                            } }
                            data-componentid={ `${ componentId }-add-button` }
                        >
                            <Icon name="add"/> { t("console:develop.features.idvp.buttons.addIDVP") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:develop.pages.idvp.title") }
            description={ t("console:develop.pages.idp.subTitle") }
            data-componentid={ `${ componentId }-page-layout` }
            actionColumnWidth={ 6 }
            headingColumnWidth={ 10 }
        >
            <ListLayout
                isLoading={ isIDVPListRequestLoading }
                advancedSearch={ getAdvancedSearchWithBasicFilters() }
                currentListSize={ idvpList?.count ?? 0 }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ true }
                showTopActionPanel={ isIDVPListRequestLoading || !(!searchQuery && idvpList?.totalResults <= 0) }
                sortOptions={ IDENTITY_VERIFICATION_PROVIDER_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={
                    Math.ceil((idvpList?.totalResults ?? 1) / listItemLimit)
                }
                totalListSize={ idvpList?.totalResults ?? 0 }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <IdentityVerificationProviderList
                    advancedSearch={ getAdvancedSearchWithBasicFilters() }
                    isLoading={ isIDVPListRequestLoading }
                    list={ idvpList }
                    onEmptyListPlaceholderActionClick={ () =>
                        history.push(AppConstants.getPaths().get("IDP_TEMPLATES"))
                    }
                    onIdentityVerificationProviderDelete={ onIdentityVerificationProviderDelete }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
        </PageLayout>);
};

export default IdentityVerificationProvidersPage;
