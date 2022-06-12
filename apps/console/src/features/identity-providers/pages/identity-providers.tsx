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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    GridLayout,
    ListLayout,
    PageLayout,
    PrimaryButton,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AuthenticatorExtensionsConfigInterface, identityProviderConfig } from "../../../extensions/configs";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    UIConstants,
    history
} from "../../core";
import { getAuthenticatorTags, getAuthenticators, getIdentityProviderList } from "../api";
import { AuthenticatorGrid, IdentityProviderList, handleGetIDPListCallError } from "../components";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorMeta } from "../meta";
import {
    AuthenticatorInterface,
    AuthenticatorLabels,
    AuthenticatorTypes,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface
} from "../models";
import { IdentityProviderManagementUtils } from "../utils";

/**
 * Proptypes for the IDP edit page component.
 */
type IDPPropsInterface = TestableComponentInterface;

const IDENTITY_PROVIDER_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
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

/**
 * Identity Providers listing page component.
 *
 * @param {IDPPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const IdentityProvidersPage: FunctionComponent<IDPPropsInterface> = (props: IDPPropsInterface): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        IDENTITY_PROVIDER_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ hasNextPage, setHasNextPage ] = useState<boolean>(undefined);
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ authenticators, setAuthenticators ] = useState<AuthenticatorInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<AuthenticatorInterface[]>([]);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(undefined);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(undefined);
    const [
        isAuthenticatorFetchRequestRequestLoading,
        setIsAuthenticatorFetchRequestRequestLoading ] = useState<boolean>(
            undefined
        );
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ filterTags, setFilterTags ] = useState<string[]>([]);
    const [ selectedFilterTags, setSelectedFilterTags ] = useState<string[]>([]);
    const [ showFilteredList, setShowFilteredList ] = useState<boolean>(false);
    const [ isPaginating, setIsPaginating ] = useState<boolean>(false);
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Checks if the listing view defined in the config is the new connections view.
     */
    useEffect(() => {
        if (useNewConnectionsView !== undefined) {
            return;
        }

        // Set the list item limit if legacy view is used.
        if (!identityProviderConfig.useNewConnectionsView) {
            setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        }

        setUseNewConnectionsView(identityProviderConfig.useNewConnectionsView);
    }, [ identityProviderConfig ]);

    /**
     * Fetches the local authenticators and stores them in the internal state.
     */
    useEffect(() => {
        // If the listing view is legacy (list) view, no need to fetch local authenticators.
        if (useNewConnectionsView !== true) {
            return;
        }

        setIsAuthenticatorFetchRequestRequestLoading(true);

        getAuthenticators(null, AuthenticatorTypes.LOCAL)
            .then((response: AuthenticatorInterface[]) => {
                const moderated: AuthenticatorInterface[] = [];

                response.forEach((authenticator: AuthenticatorInterface) => {
                    // If type is not local return.
                    if (authenticator.type !== AuthenticatorTypes.LOCAL) {
                        return;
                    }

                    // Removes hidden authenticators.
                    if (config?.ui?.hiddenAuthenticators?.includes(authenticator.name)) {
                        return;
                    }

                    if (authenticator.id === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID) {
                        authenticator.tags = [ ...identityProviderConfig.filterFidoTags(authenticator?.tags) ];
                    }

                    if (authenticator.id === IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID) {
                        authenticator.tags = [ AuthenticatorLabels.PASSWORDLESS ];
                    }

                    const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                        identityProviderConfig.authenticators,
                        authenticator.id
                    );

                    // If authenticator is configurable, evaluate...
                    if (authenticatorConfig && authenticatorConfig.isEnabled) {
                        // If configurations are not available for the moment, push to the end of the array.
                        if (authenticatorConfig.isComingSoon) {
                            moderated.push(authenticator);

                            return;
                        }

                        // If configs are available, keep at the beginning of array.
                        moderated.unshift(authenticator);
                    }
                });

                setLocalAuthenticators(moderated);
                setListItemLimit(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT - moderated.length);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIsAuthenticatorFetchRequestRequestLoading(false);
            });
    }, [ useNewConnectionsView ]);

    /**
     * Fetches the available filter tags from the authenticators meta API.
     */
    useEffect(() => {
        // If the listing view is legacy (list) view, no need to fetch filter tags.
        if (useNewConnectionsView !== true || !isEmpty(filterTags)) {
            return;
        }

        getAuthenticatorTags()
            .then((response: string[]) => {
                setFilterTags(response.filter((tag: string) => AuthenticatorMeta.getAllowedFilterTags().includes(tag)));
            })
            .catch(() => {
                // No need to show UI errors here.
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            });
    }, [ useNewConnectionsView ]);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        if (!listItemLimit) {
            return;
        }

        getIdPList(listItemLimit, listOffset, null, false);
    }, [ listOffset, listItemLimit ]);

    /**
     * Get all authenticators in the server from `Authenticators API`.
     *
     * @param {string} filter - Search filter.
     */
    const getAllAuthenticators = (filter?: string): void => {
        setIsAuthenticatorFetchRequestRequestLoading(true);

        getAuthenticators(filter)
            .then((response: AuthenticatorInterface[]) => {
                setAuthenticators(
                    response.filter((authenticator: AuthenticatorInterface) => {
                        // Removes hidden authenticators.
                        if (config?.ui?.hiddenAuthenticators?.includes(authenticator.name)) {
                            return;
                        }

                        if (authenticator.id === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID) {
                            authenticator.tags = [ ...identityProviderConfig.filterFidoTags(authenticator?.tags) ];
                        }

                        if (authenticator.id === IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID) {
                            authenticator.tags = [ AuthenticatorLabels.PASSWORDLESS ];
                        }

                        // Filter out authenticators whose tags weren't in the filter query.
                        // This is done since some of the authenticators like FIDO have tags modified by code.
                        let tagFound = false;

                        for (const tag of authenticator?.tags) {
                            if (filter.includes(`tag eq ${ tag }`)) {
                                tagFound = true;

                                break;
                            }
                        }

                        if (!tagFound) {
                            return;
                        }

                        if (authenticator.type === AuthenticatorTypes.LOCAL) {
                            const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                                identityProviderConfig.authenticators,
                                authenticator.id
                            );

                            if (!authenticatorConfig) {
                                return false;
                            }

                            return authenticatorConfig.isEnabled;
                        }

                        return true;
                    })
                );
            })
            .finally(() => {
                setIsAuthenticatorFetchRequestRequestLoading(false);
            });
    };

    /**
     * Retrieves the list of identity providers.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     * @param {boolean} append - Should append items to the end?.
     */
    const getIdPList = (limit: number, offset: number, filter: string, append: boolean): void => {
        setIdPListRequestLoading(true);

        if (append) {
            setIsPaginating(true);
        }

        getIdentityProviderList(limit, offset, filter, "federatedAuthenticators")
            .then((response: IdentityProviderListResponseInterface) => {
                setHasNextPage(
                    response?.links &&
                    Array.isArray(response.links) &&
                    response.links[ 0 ] &&
                    response.links[ 0 ].rel === "next"
                );

                const oldIdPList: IdentityProviderInterface[] =
                    idpList?.identityProviders &&
                        Array.isArray(idpList.identityProviders) &&
                        idpList.identityProviders.length > 0
                        ? idpList.identityProviders
                        : [];

                const idpListFromResponse: IdentityProviderInterface[] = response?.identityProviders
                    ? response.identityProviders
                    : [];

                if (append) {
                    response.identityProviders = [ ...oldIdPList, ...idpListFromResponse ];
                } else {
                    response.identityProviders = [ ...localAuthenticators, ...idpListFromResponse ];
                }

                setIdPList(response);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
                setIsPaginating(false);
            });
    };

    /**
     * Handles identity provider delete action.
     */
    const handleIdentityProviderDelete = (): void => {
        getIdPList(listItemLimit, listOffset, null, false);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setFilterTags([]);
        getIdPList(listItemLimit, listOffset, null, false);
        setTriggerClearQuery(!triggerClearQuery);
        setShowFilteredList(false);
    };

    /**
     * Handles Connection grid filter.
     *
     * @param {string} query - Search query.
     * @param {string[]} selectedFilters - Selected filters.
     */
    const handleConnectionGridFilter = (query: string, selectedFilters: string[]): void => {
        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Update the state of selected filters.
        setSelectedFilterTags(selectedFilters);
        // Filter out the templates.
        getAllAuthenticators(IdentityProviderManagementUtils.buildAuthenticatorsFilterQuery(query, selectedFilters));

        if (isEmpty(query) && isEmpty(selectedFilters)) {
            setShowFilteredList(false);
        } else {
            setShowFilteredList(true);
        }
    };

    /**
     * Handles the `onUpdate` callback action.
     */
    const onUpdate = (): void => {
        getAllAuthenticators(
            IdentityProviderManagementUtils.buildAuthenticatorsFilterQuery(searchQuery, selectedFilterTags)
        );
    };

    /**
     * Handles Grid pagination.
     */
    const handlePagination = (): void => {
        if (!hasNextPage) {
            return;
        }

        getIdPList(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT, listItemLimit, null, true);
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            IDENTITY_PROVIDER_LIST_SORTING_OPTIONS.find((option) => {
                return data.value === option.value;
            })
        );
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the `onFilter` callback action from the
     * identity provider search component.
     *
     * @param {string} query - Search query.
     */
    const handleIdentityProviderListFilter = (query: string): void => {
        setSearchQuery(query);
        getIdPList(listItemLimit, listOffset, query, false);
    };

    return (
        <PageLayout
            pageTitle="Connections"
            action={
                (isIdPListRequestLoading ||
                    isAuthenticatorFetchRequestRequestLoading ||
                    !(!searchQuery && idpList?.identityProviders?.length <= 0)) &&
                useNewConnectionsView !== undefined && (
                    <Show when={ AccessControlConstants.IDP_WRITE }>
                        <PrimaryButton
                            onClick={ (): void => {
                                eventPublisher.publish("connections-click-new-connection-button");
                                history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-add-button` }
                        >
                            <Icon name="add" />
                            { useNewConnectionsView
                                ? t("console:develop.features.authenticationProvider.buttons.addIDP")
                                : t("console:develop.features.idp.buttons.addIDP") }
                        </PrimaryButton>
                    </Show>
                )
            }
            isLoading={ useNewConnectionsView === undefined }
            title={
                useNewConnectionsView
                    ? t("console:develop.pages.authenticationProvider.title")
                    : t("console:develop.pages.idp.title")
            }
            description={
                useNewConnectionsView ? (
                    <>
                        { t("console:develop.pages.authenticationProvider.subTitle") }
                        <DocumentationLink link={ getLink("develop.connections.learnMore") }>
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>
                ) : (
                    t("console:develop.pages.idp.subTitle")
                )
            }
            data-testid={ `${ testId }-page-layout` }
            actionColumnWidth={ 4 }
            headingColumnWidth={ 12 }
        >
            { useNewConnectionsView ? (
                <GridLayout
                    search={
                        (<SearchWithFilterLabels
                            searchInput={
                                (<AdvancedSearchWithBasicFilters
                                    fill="white"
                                    onFilter={ (query: string) => {
                                        handleConnectionGridFilter(query, []);
                                    } }
                                    filterAttributeOptions={ [
                                        {
                                            key: 0,
                                            text: t("common:name"),
                                            value: "name"
                                        }
                                    ] }
                                    // Only 'eq' and 'sw operations are supported in Authenticators API.
                                    filterConditionOptions={ [
                                        {
                                            key: 0,
                                            text: t("common:startsWith"),
                                            value: "sw"
                                        },
                                        {
                                            key: 1,
                                            text: t("common:equals"),
                                            value: "eq"
                                        }
                                    ] }
                                    filterAttributePlaceholder={ t(
                                        "console:develop.features.authenticationProvider" +
                                        ".advancedSearch.form.inputs.filterAttribute.placeholder"
                                    ) }
                                    filterConditionsPlaceholder={ t(
                                        "console:develop.features.authenticationProvider" +
                                        ".advancedSearch.form.inputs.filterCondition.placeholder"
                                    ) }
                                    filterValuePlaceholder={ t(
                                        "console:develop.features.authenticationProvider" +
                                        ".advancedSearch.form.inputs.filterValue.placeholder"
                                    ) }
                                    placeholder={ t(
                                        "console:develop.features.authenticationProvider" +
                                        ".advancedSearch.placeholder"
                                    ) }
                                    defaultSearchAttribute="name"
                                    defaultSearchOperator="sw"
                                    triggerClearQuery={ triggerClearQuery }
                                    data-testid={ `${ testId }-advance-search` }
                                />)
                            }
                            filterLabels={ filterTags }
                            onFilter={ (_, selectedFilters: string[]) => {
                                handleConnectionGridFilter(searchQuery, selectedFilters);
                            } }
                            data-testid={ `${ testId }-search` }
                        />)
                    }
                    isPaginating={ isPaginating }
                    paginate={ () => handlePagination() }
                    isLoading={
                        isAuthenticatorFetchRequestRequestLoading === undefined || isIdPListRequestLoading === undefined
                    }
                    translations={ {
                        loading: t("common:loading")
                    } }
                >
                    <AuthenticatorGrid
                        isLoading={
                            !isPaginating && (isAuthenticatorFetchRequestRequestLoading || isIdPListRequestLoading)
                        }
                        authenticators={ showFilteredList ? authenticators : idpList?.identityProviders }
                        onEmptyListPlaceholderActionClick={ () => {
                            eventPublisher.publish("connections-click-new-connection-button");
                            history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                        } }
                        isFiltering={ showFilteredList }
                        isPaginating={ isPaginating }
                        onIdentityProviderDelete={ handleIdentityProviderDelete }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        onUpdate={ onUpdate }
                        data-testid={ `${ testId }-list` }
                    />
                </GridLayout>
            ) : (
                <ListLayout
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
                            onFilter={ handleIdentityProviderListFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={ t(
                                "console:develop.features.authenticationProvider" +
                                ".advancedSearch.form.inputs.filterAttribute.placeholder"
                            ) }
                            filterConditionsPlaceholder={ t(
                                "console:develop.features.authenticationProvider" +
                                ".advancedSearch.form.inputs.filterCondition.placeholder"
                            ) }
                            filterValuePlaceholder={ t(
                                "console:develop.features.authenticationProvider" +
                                ".advancedSearch.form.inputs.filterValue.placeholder"
                            ) }
                            placeholder={ t(
                                "console:develop.features.authenticationProvider" + ".advancedSearch.placeholder"
                            ) }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advance-search` }
                        />)
                    }
                    currentListSize={ idpList.count }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    showPagination={ true }
                    showTopActionPanel={
                        useNewConnectionsView !== undefined &&
                        (isIdPListRequestLoading || !(!searchQuery && idpList?.totalResults <= 0))
                    }
                    sortOptions={ IDENTITY_PROVIDER_LIST_SORTING_OPTIONS }
                    sortStrategy={ listSortingStrategy }
                    totalPages={ Math.ceil(idpList.totalResults / listItemLimit) }
                    totalListSize={ idpList.totalResults }
                    data-testid={ `${ testId }-list-layout` }
                >
                    <IdentityProviderList
                        advancedSearch={
                            (<AdvancedSearchWithBasicFilters
                                onFilter={ handleIdentityProviderListFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    }
                                ] }
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
                                    "console:develop.features.authenticationProvider." + "advancedSearch.placeholder"
                                ) }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advance-search` }
                            />)
                        }
                        isLoading={ useNewConnectionsView === undefined && isIdPListRequestLoading }
                        list={ idpList }
                        onEmptyListPlaceholderActionClick={ () =>
                            history.push(AppConstants.getPaths().get("IDP_TEMPLATES"))
                        }
                        onIdentityProviderDelete={ handleIdentityProviderDelete }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                    />
                </ListLayout>
            ) }
        </PageLayout>
    );
};

/**
 * Default proptypes for the IDP component.
 */
IdentityProvidersPage.defaultProps = {
    "data-testid": "idp"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityProvidersPage;
