/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { ListLayout, PrimaryButton } from "@wso2is/react-components";
import find from "lodash-es/find";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import DiscoverableOrganizationsList from "./discoverable-organizations-list";
import { OrganizationListWithDiscoveryInterface } from "../models/organization-discovery";
import "./discoverable-organizations-list-layout.scss";

/**
 * Props interface of {@link DiscoverableOrganizationsListLayout}
 */
export interface DiscoverableOrganizationsListLayoutPropsInterface extends IdentifiableComponentInterface {
    discoverableOrganizations: OrganizationListWithDiscoveryInterface
    listItemLimit: number;
    isDiscoverableOrganizationsFetchRequestLoading: boolean;
    featureConfig: FeatureConfigInterface;
    searchQuery: string;
    onListItemLimitChange: (limit: number) => void;
    onListOffsetChange: (offset: number) => void;
    onSearchQueryChange: (query: string) => void;
}

/**
 * Layout for the discoverable organizations list.
 *
 * @param props - Props injected to the component.
 * @returns Discoverable organization list layout component.
 */
const DiscoverableOrganizationsListLayout: FunctionComponent<DiscoverableOrganizationsListLayoutPropsInterface> = ({
    discoverableOrganizations,
    listItemLimit,
    isDiscoverableOrganizationsFetchRequestLoading,
    featureConfig,
    searchQuery,
    onListItemLimitChange,
    onListOffsetChange,
    onSearchQueryChange,
    ["data-componentid"]: componentId = "discoverable-organizations-list-layout"
}: DiscoverableOrganizationsListLayoutPropsInterface): ReactElement => {

    const ORGANIZATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
        {
            key: 0,
            text: I18n.instance.t("organizationDiscovery:advancedSearch." +
            "form.dropdown.filterAttributeOptions.organizationName") as ReactNode,
            value: "organizationName"
        }
    ];

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const { t } = useTranslation();
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );

    /**
     * Handles the `onFilter` callback action from the
     * organization search component.
     *
     * @param query - Search query.
     */
    const handleOrganizationFilter: (query: string) => void = useCallback(
        (query: string): void => {
            onSearchQueryChange(query);
        },
        [ onSearchQueryChange ]
    );

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear: () => void = useCallback((): void => {
        setTriggerClearQuery(!triggerClearQuery);
        onSearchQueryChange("");
    }, [ onSearchQueryChange, triggerClearQuery ]);

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        onListItemLimitChange(data.value as number);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = ((data.activePage as number) - 1) * listItemLimit;

        onListOffsetChange(offsetValue);
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            find(ORGANIZATIONS_LIST_SORTING_OPTIONS, (option: DropdownItemProps) => {
                return data.value === option.value;
            })
        );
    };

    /**
     * Checks if the `Next` page nav button should be shown.
     *
     * @param orgList - List of discoverable organizations.
     * @returns `true` if `Next` page nav button should be shown.
     */
    const shouldShowNextPageNavigation = (orgList: OrganizationListWithDiscoveryInterface): boolean => {
        return orgList?.startIndex + orgList?.count !== orgList?.totalResults + 1;
    };

    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleOrganizationFilter }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("organizationDiscovery:advancedSearch." +
                            "form.dropdown.filterAttributeOptions.organizationName"),
                            value: "organizationName"
                        }
                    ] }
                    filterAttributePlaceholder={ t(
                        "organizationDiscovery:advancedSearch.form" +
                                ".inputs.filterAttribute.placeholder"
                    ) }
                    filterConditionsPlaceholder={ t(
                        "organizationDiscovery:advancedSearch.form" +
                                ".inputs.filterCondition.placeholder"
                    ) }
                    filterValuePlaceholder={ t(
                        "organizationDiscovery:advancedSearch.form" +
                        ".inputs.filterValue.placeholder"
                    ) }
                    placeholder={ t(
                        "organizationDiscovery:advancedSearch.placeholder"
                    ) }
                    defaultSearchAttribute="organizationName"
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                    data-componentid={ `${ componentId }-list-advanced-search` }
                />
            ) }
            currentListSize={ discoverableOrganizations?.organizations?.length }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            onSortStrategyChange={ handleListSortingStrategyOnChange }
            showTopActionPanel={
                isDiscoverableOrganizationsFetchRequestLoading ||
                        !(!searchQuery && discoverableOrganizations?.organizations?.length <= 0)
            }
            sortOptions={ ORGANIZATIONS_LIST_SORTING_OPTIONS }
            sortStrategy={ listSortingStrategy }
            topActionPanelExtension={
                (
                    <Show when={ featureConfig?.organizationDiscovery?.scopes?.create }>
                        <PrimaryButton
                            disabled={ isDiscoverableOrganizationsFetchRequestLoading }
                            loading={ isDiscoverableOrganizationsFetchRequestLoading }
                            onClick={ () => {
                                eventPublisher.publish("organization-click-assign-email-domain-button");
                                history.push(
                                    AppConstants.getPaths().get("ASSIGN_ORGANIZATION_DISCOVERY_DOMAINS")
                                );
                            } }
                            data-componentid={ `${ componentId }-assign-button` }
                        >
                            <Icon name="add" />
                            { t("organizationDiscovery:emailDomains.actions.assign") }
                        </PrimaryButton>
                    </Show>
                ) }
            totalPages={ 10 }
            totalListSize={ discoverableOrganizations?.organizations?.length }
            isLoading={ isDiscoverableOrganizationsFetchRequestLoading }
            paginationOptions={ {
                disableNextButton: !shouldShowNextPageNavigation(discoverableOrganizations)
            } }
            data-componentid={ `${ componentId }-list-layout` }
            className="discoverable-organizations-list-layout"
            showPagination
        >
            <DiscoverableOrganizationsList
                list={ discoverableOrganizations }
                onEmptyListPlaceholderActionClick={ () => {
                    history.push(AppConstants.getPaths().get("ASSIGN_ORGANIZATION_DISCOVERY_DOMAINS"));
                } }
                onSearchQueryClear={ handleSearchQueryClear }
                searchQuery={ searchQuery }
                data-componentid="organization-list-with-discovery"
            />
        </ListLayout>
    );
};

export default DiscoverableOrganizationsListLayout;
