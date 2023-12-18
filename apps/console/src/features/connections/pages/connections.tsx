/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    GridLayout,
    PageLayout,
    PrimaryButton,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FC,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import {
    AuthenticatorExtensionsConfigInterface,
    identityProviderConfig
} from "../../../extensions/configs";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    UIConstants,
    history
} from "../../core";
import { OrganizationType } from "../../organizations/constants";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { useGetAuthenticatorTags, useGetAuthenticators } from "../api/authenticators";
import { useGetConnections } from "../api/connections";
import { AuthenticatorGrid } from "../components/authenticator-grid";
import { getAuthenticatorList } from "../components/common";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import {
    AuthenticatorInterface,
    AuthenticatorLabels,
    AuthenticatorTypes
} from "../models/authenticators";
import {
    ConnectionInterface,
    ConnectionListResponseInterface
} from "../models/connection";
import {
    ConnectionsManagementUtils,
    handleGetAuthenticatorTagsError,
    handleGetConnectionListCallError
} from "../utils/connection-utils";

/**
 * Proptypes for the Connections page component.
 */
type ConnectionsPropsInterface = TestableComponentInterface;

/**
 * Connections listing page component.
 *
 * @param props - Props injected to the component.
 *
 * @returns React Element
 */
const ConnectionsPage: FC<ConnectionsPropsInterface> = (props: ConnectionsPropsInterface): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { organizationType } = useGetCurrentOrganizationType();
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ hasNextPage, setHasNextPage ] = useState<boolean>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ filterTags, setFilterTags ] = useState<string[]>([]);
    const [ selectedFilterTags, setSelectedFilterTags ] = useState<string[]>([]);
    const [ showFilteredList, setShowFilteredList ] = useState<boolean>(false);
    const [ connectionsList, setConnectionsList ] = useState<ConnectionListResponseInterface>({});
    const [ authenticatorList, setAuththenticatorList ] = useState<AuthenticatorInterface[]>([]);
    const [ localAuthenticatorList, setLocalAuthenticatorList ] = useState<AuthenticatorInterface[]>([]);
    const [ filteredAuthenticatorList, setFilteredAuthenticatorList ] = useState<AuthenticatorInterface[]>([]);
    const [ filter, setFilter ] = useState<string>(null);
    const [ filterAuthenticatorsOnly, setFilterAuthenticatorsOnly ] = useState<boolean>(false);
    const [ appendConnections, setAppendConnections ] = useState<boolean>(false);
    const isPaginating: boolean = false;

    const {
        data: authenticators,
        isLoading: isAuthenticatorsFetchRequestLoading,
        error: authenticatorsFetchRequestError,
        mutate: mutateAuthenticatorsFetchRequest
    } = useGetAuthenticators(filter);

    const {
        data: connections,
        isLoading: isConnectionsFetchRequestLoading,
        error: connectionsFetchRequestError,
        mutate: mutateConnectionsFetchRequest
    } = useGetConnections(
        listItemLimit,
        listOffset,
        filter,
        "federatedAuthenticators",
        !filterAuthenticatorsOnly,
        filterAuthenticatorsOnly
    );

    const {
        data: authenticatorTags,
        isLoading: isAuthenticatorTagsFetchRequestLoading,
        error: authenticatorTagsFetchRequestError
    } = useGetAuthenticatorTags();

    useEffect(() => {
        if (!connections) {

            return;
        }

        if (!localAuthenticatorList || localAuthenticatorList?.length === 0) {

            return;
        }

        if (connectionsFetchRequestError) {
            handleGetConnectionListCallError(connectionsFetchRequestError);

            return;
        }

        const initialConnectionsList: ConnectionListResponseInterface = {};

        setHasNextPage(
            connections?.links &&
            Array.isArray(connections.links) &&
            connections?.links[ 0 ] &&
            connections?.links[ 0 ].rel === "next"
        );

        const oldConnectionsList: ConnectionInterface[] =
            connectionsList?.identityProviders &&
                Array.isArray(connectionsList.identityProviders) &&
                connectionsList.identityProviders.length > 0
                ? connectionsList.identityProviders
                : [];

        const connectionsData: ConnectionInterface[] = connections?.identityProviders
            ? connections.identityProviders
            : [];

        if (appendConnections) {
            initialConnectionsList.identityProviders = [ ...oldConnectionsList, ...connectionsData ];
        } else {
            initialConnectionsList.identityProviders = [ ...localAuthenticatorList, ...connectionsData ];
        }

        setConnectionsList(initialConnectionsList);
    }, [ connections ]);

    /**
     * Moderates the response of the request to get authenticators.
     */
    useEffect(() => {

        if (!authenticators) {
            return;
        }

        setAuththenticatorList(authenticators);

        // Handle the authenticator list fetch request error.
        if (authenticatorsFetchRequestError) {
            handleGetConnectionListCallError(authenticatorsFetchRequestError);
        }

        const moderated: AuthenticatorInterface[] = [];

        authenticators.forEach((authenticator: AuthenticatorInterface) => {

            // If type is not local return.
            if (authenticator.type !== AuthenticatorTypes.LOCAL) {
                return;
            }

            // Set the FIDO authenticator display name and tags.
            if (authenticator.id === AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID) {
                authenticator.displayName = "Passkey";
            }

            // Set the magic link authenticator tags.
            if (authenticator.id === AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID) {
                authenticator.tags = [ AuthenticatorLabels.API_AUTHENTICATION, AuthenticatorLabels.PASSWORDLESS ];
            }

            // Hide the SMS OTP authenticator for sub organizations.
            if (authenticator.id === AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID &&
                organizationType === OrganizationType.SUBORGANIZATION &&
                identityProviderConfig?.disableSMSOTPInSubOrgs) {
                return false;
            }

            const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                getAuthenticatorList(),
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

        setLocalAuthenticatorList(moderated);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT - moderated.length);
    }, [ authenticators ]);

    /**
     * Filters the filtered authenticator list based on the configurable local authenticator list.
     */
    useEffect(() => {
        const filtered: AuthenticatorInterface[] = authenticatorList.filter((authenticator: AuthenticatorInterface) => {

            // Filtered authenticator list should only contain local authenticators that are configurable.
            if (authenticator.type === AuthenticatorTypes.LOCAL) {

                return localAuthenticatorList.some((localAuthenticator: AuthenticatorInterface) => {
                    return localAuthenticator.id === authenticator.id;
                });
            }

            return true;
        });

        setFilteredAuthenticatorList(filtered);
    }, [ authenticatorList, localAuthenticatorList ]);

    /**
     * Fetches the local authenticators and stores them in the internal state.
     */
    useEffect(() => {
        if (authenticators?.length > 0) {
            const moderated: AuthenticatorInterface[] = [];

            authenticators.forEach((authenticator: AuthenticatorInterface) => {
                // If type is not local return.
                if (authenticator.type !== AuthenticatorTypes.LOCAL) {
                    return;
                }

                // Removes hidden authenticators.
                if (config?.ui?.hiddenAuthenticators?.includes(authenticator.name)) {
                    return;
                }

                if (authenticator.id === AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID) {
                    authenticator.displayName = identityProviderConfig.getOverriddenAuthenticatorDisplayName(
                        authenticator.id, authenticator.displayName);
                }

                if (authenticator.id === AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID) {
                    authenticator.tags = [ AuthenticatorLabels.API_AUTHENTICATION, AuthenticatorLabels.PASSWORDLESS ];
                }

                if (authenticator.id === AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID &&
                    organizationType === OrganizationType.SUBORGANIZATION &&
                    identityProviderConfig?.disableSMSOTPInSubOrgs) {
                    return false;
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



            setLocalAuthenticatorList(moderated);
            setListItemLimit(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT - moderated.length);
        }
    }, [ authenticators ]);

    /**
     * Fetches the available filter tags from the authenticators meta API.
     */
    useEffect(() => {
        if (isAuthenticatorTagsFetchRequestLoading || !authenticatorTags) {
            return;
        }

        if (authenticatorTagsFetchRequestError) {
            handleGetAuthenticatorTagsError(authenticatorTagsFetchRequestError);
            setFilterTags([]);

            return;
        }

        setFilterTags(authenticatorTags.filter((tag: string) =>
            AuthenticatorMeta.getAllowedFilterTags().includes(tag))
        );
    }, [ authenticatorTags ]);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        if (!listItemLimit) {
            return;
        }

        mutateConnectionsFetchRequest();
    }, [ listOffset, listItemLimit ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setFilterTags([]);
        setTriggerClearQuery(!triggerClearQuery);
        setShowFilteredList(false);
    };

    /**
     * Handles Connection grid filter.
     *
     * @param query - Search query.
     * @param selectedFilters - Selected filters.
     */
    const handleConnectionGridFilter = (query: string, selectedFilters: string[]): void => {
        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        setListOffset(0);

        // Update the state of selected filterTags.
        const filterTags: string[] = selectedFilters || selectedFilterTags;

        setSelectedFilterTags(filterTags);
        setFilter(ConnectionsManagementUtils.buildAuthenticatorsFilterQuery(query, filterTags));
        setFilterAuthenticatorsOnly(filterTags && filterTags.length > 0);

        if (isEmpty(query) && isEmpty(filterTags)) {
            setShowFilteredList(false);
        } else {
            setShowFilteredList(true);
        }
    };

    /**
     * Handles the `onUpdate` callback action.
     */
    const onUpdate = (): void => {
        mutateAuthenticatorsFetchRequest();
        mutateConnectionsFetchRequest();
    };

    /**
     * Handles Grid pagination.
     */
    const handlePagination = (): void => {
        if (!hasNextPage) {
            return;
        }

        setAppendConnections(true);
    };

    return (
        <PageLayout
            pageTitle="Connections"
            action={ (
                (!isConnectionsFetchRequestLoading || !isAuthenticatorsFetchRequestLoading) &&
                !(!searchQuery && connectionsList?.identityProviders?.length <= 0)) &&
                identityProviderConfig.useNewConnectionsView !== undefined &&
                (
                    <Show when={ AccessControlConstants.IDP_WRITE }>
                        <PrimaryButton
                            onClick={ (): void => {
                                eventPublisher.publish("connections-click-new-connection-button");
                                history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-add-button` }
                        >
                            <Icon name="add" />
                            { identityProviderConfig.useNewConnectionsView
                                ? t("console:develop.features.authenticationProvider.buttons.addIDP")
                                : t("console:develop.features.idp.buttons.addIDP") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={
                identityProviderConfig.useNewConnectionsView
                    ? t("console:develop.pages.authenticationProvider.title")
                    : t("console:develop.pages.idp.title")
            }
            description={
                (<>
                    { t("console:develop.pages.authenticationProvider.subTitle") }
                    <DocumentationLink link={ getLink("develop.connections.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-testid={ `${ testId }-page-layout` }
            actionColumnWidth={ 4 }
            headingColumnWidth={ 12 }
        >
            <GridLayout
                search={ (
                    <SearchWithFilterLabels
                        isLoading= { isConnectionsFetchRequestLoading || isAuthenticatorsFetchRequestLoading }
                        searchInput={ (
                            <AdvancedSearchWithBasicFilters
                                fill="white"
                                onFilter={ (query: string) => {
                                    handleConnectionGridFilter(query, null);
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
                            />
                        ) }
                        filterLabels={ filterTags }
                        onFilter={ (_: string, selectedFilters: string[]) => {
                            handleConnectionGridFilter(searchQuery, selectedFilters);
                        } }
                        data-testid={ `${ testId }-search` }
                    />
                ) }
                isPaginating={ isPaginating }
                paginate={ () => handlePagination() }
                translations={ {
                    loading: t("common:loading")
                } }
            >
                <AuthenticatorGrid
                    isLoading= { isConnectionsFetchRequestLoading || isAuthenticatorsFetchRequestLoading }
                    authenticators={ showFilteredList ? filteredAuthenticatorList : connectionsList?.identityProviders }
                    onEmptyListPlaceholderActionClick={ () => {
                        eventPublisher.publish("connections-click-new-connection-button");
                        history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                    } }
                    isFiltering={ showFilteredList }
                    isPaginating={ isPaginating }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    onConnectionUpdate={ onUpdate }
                    data-testid={ `${ testId }-list` }
                />
            </GridLayout>
        </PageLayout>
    );
};

/**
 * Default proptypes for the IDP component.
 */
ConnectionsPage.defaultProps = {
    "data-testid": "idp"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionsPage;
