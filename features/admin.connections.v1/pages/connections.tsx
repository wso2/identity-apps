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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
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
import { SearchInputsInterface, useGetCombinedConnectionList } from "../hooks/use-get-combined-connection-list";
import { AuthenticatorMeta } from "../meta/authenticator-meta";

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
    const isIdVPFeatureEnabled: boolean = featureConfig?.identityVerificationProviders?.enabled;

    const hasIdVPReadPermissions: boolean = useRequiredScopes(
        featureConfig?.identityVerificationProviders?.scopes?.read);

    const [ searchInputs, setSearchInputs ] = useState<SearchInputsInterface>({
        filterTags: [],
        searchQuery: ""
    });
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ isFiltering, setIsFiltering ] = useState<boolean>(false);

    const isPaginating: boolean = false;
    const listItemLimit: number = UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT;

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
    } = useGetCombinedConnectionList(
        listItemLimit,
        listOffset,
        searchInputs,
        true,
        isIdVPFeatureEnabled && hasIdVPReadPermissions
    );

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
        setSearchInputs({
            filterTags: [],
            searchQuery: ""
        });
        setTriggerClearQuery(!triggerClearQuery);
        setIsFiltering(false);
    };

    const handleSearchQueryChange = (query: string): void => {
        setSearchInputs((prevSearchInputs: SearchInputsInterface) => {
            return {
                ...prevSearchInputs,
                searchQuery: query
            };
        });
        setListOffset(0);
        setIsFiltering(true);
    };

    const handleFilterTagsChange = (selectedFilters: string[]): void => {
        setSearchInputs((prevSearchInputs: SearchInputsInterface) => {
            return {
                ...prevSearchInputs,
                filterTags: selectedFilters
            };
        });
        setListOffset(0);
        setIsFiltering(true);
    };

    /**
     * Handles the `onUpdate` callback action.
     */
    const onUpdate = (): void => {
        mutateCombinedConnectionListFetchRequest();
    };

    return (
        <PageLayout
            pageTitle="Connections"
            action={ (
                (!isCombinedConnectionListFetchRequestLoading) &&
                !(!searchInputs?.searchQuery && combinedConnectionList?.length <= 0)) &&
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
                                    handleSearchQueryChange(query);
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
                            handleFilterTagsChange(selectedFilters);
                        } }
                        data-testid={ `${ testId }-search` }
                    />
                ) }
                isPaginating={ isPaginating }
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
                    isFiltering={ isFiltering }
                    isPaginating={ isPaginating }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchInputs?.searchQuery }
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
