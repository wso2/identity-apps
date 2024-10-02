/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    history
} from "@wso2is/admin.core.v1";
import {
    IdVPTemplateTags
} from "@wso2is/admin.identity-verification-providers.v1/models/identity-verification-providers";
import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    GridLayout,
    PageLayout,
    PrimaryButton,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FC,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { useGetAuthenticatorTags } from "../api/authenticators";
import { AuthenticatorGrid } from "../components/authenticator-grid";
import { useGetCombinedConnectionList } from "../hooks/use-get-combined-connection-list";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import {
    AuthenticatorInterface,
    AuthenticatorTypes
} from "../models/authenticators";
import { ConnectionListResponseInterface } from "../models/connection";
import { ConnectionsManagementUtils } from "../utils/connection-utils";

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
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ hasNextPage, setHasNextPage ] = useState<boolean>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
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

    // const {
    //     data: authenticators,
    //     isLoading: isAuthenticatorsFetchRequestLoading,
    //     error: authenticatorsFetchRequestError,
    //     mutate: mutateAuthenticatorsFetchRequest
    // } = useGetAuthenticators(filter, false);

    // const {
    //     data: connections,
    //     isLoading: isConnectionsFetchRequestLoading,
    //     error: connectionsFetchRequestError,
    //     mutate: mutateConnectionsFetchRequest
    // } = useGetConnections(
    //     listItemLimit,
    //     listOffset,
    //     filter,
    //     "federatedAuthenticators",
    //     false,
    //     filterAuthenticatorsOnly
    // );

    const {
        data: fetchedAuthenticatorTags,
        isLoading: isAuthenticatorTagsFetchRequestLoading,
        error: authenticatorTagsFetchRequestError
    } = useGetAuthenticatorTags();

    const {
        data: combinedConnectionList,
        isLoading: isCombinedConnectionListFetchRequestLoading,
        error: combinedConnectionListFetchRequestError,
        mutate: mutateCombinedConnectionListFetchRequest
    } = useGetCombinedConnectionList(listItemLimit, listOffset);

    /**
     * Handle the error alert of the get connection list request.
     */
    useEffect(() => {
        if (combinedConnectionListFetchRequestError) {
            dispatch(
                addAlert<AlertInterface>({
                    description: combinedConnectionListFetchRequestError?.response?.data?.description
                        ?? t("authenticationProvider:notifications.getIDPList.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.getIDPList.genericError.message")
                })
            );
        }
    }, [ combinedConnectionListFetchRequestError ]);

    /**
     * Handle the error alert of the get authenticator tags request.
     */
    useEffect(() => {
        if (authenticatorTagsFetchRequestError) {
            dispatch(
                addAlert<AlertInterface>({
                    description: authenticatorTagsFetchRequestError?.response?.data?.description
                        ?? t("authenticationProvider:notifications.getAuthenticatorTags.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.getAuthenticatorTags.genericError.description")
                })
            );
        }
    }, [ authenticatorTagsFetchRequestError ]);

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
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        if (!listItemLimit) {
            return;
        }

        console.log("Mutating");
        // mutateConnectionsFetchRequest();
    }, [ listOffset, listItemLimit ]);

    /**
     * Filters the available authenticator tags from the fetched authenticator tags.
     */
    const availableFilterTags: string[] = useMemo(() => {
        if (isAuthenticatorTagsFetchRequestLoading || authenticatorTagsFetchRequestError || !fetchedAuthenticatorTags) {
            return [];
        }

        const _filteredTags: string[] = fetchedAuthenticatorTags.filter((tag: string) => {
            if (Object.values(IdVPTemplateTags).includes(tag as IdVPTemplateTags)) {
                return true;
            };

            return AuthenticatorMeta.getAllowedFilterTags().includes(tag);
        });

        return _filteredTags;
    }, [ isAuthenticatorTagsFetchRequestLoading ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
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
        mutateCombinedConnectionListFetchRequest();
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
                (!isCombinedConnectionListFetchRequestLoading) &&
                !(!searchQuery && connectionsList?.identityProviders?.length <= 0)) &&
                (
                    <Show when={ featureConfig?.identityProviders?.scopes?.create }>
                        <PrimaryButton
                            onClick={ (): void => {
                                eventPublisher.publish("connections-click-new-connection-button");
                                history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-add-button` }
                        >
                            <Icon name="add" />
                            { t("authenticationProvider:buttons.addIDP") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:develop.pages.authenticationProvider.title") }
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
                        isLoading= { isCombinedConnectionListFetchRequestLoading }
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
                                    "authenticationProvider:" +
                                    "advancedSearch.form.inputs.filterAttribute.placeholder"
                                ) }
                                filterConditionsPlaceholder={ t(
                                    "authenticationProvider:" +
                                    "advancedSearch.form.inputs.filterCondition.placeholder"
                                ) }
                                filterValuePlaceholder={ t(
                                    "authenticationProvider:" +
                                    "advancedSearch.form.inputs.filterValue.placeholder"
                                ) }
                                placeholder={ t(
                                    "authenticationProvider:" +
                                    "advancedSearch.placeholder"
                                ) }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="sw"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advance-search` }
                            />
                        ) }
                        filterLabels={ availableFilterTags }
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
                    isLoading= { isCombinedConnectionListFetchRequestLoading }
                    authenticators={ combinedConnectionList }
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
