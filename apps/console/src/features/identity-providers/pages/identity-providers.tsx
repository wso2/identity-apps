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

import { TestableComponentInterface } from "@wso2is/core/models";
import { GridLayout, PageLayout, PrimaryButton, SearchWithFilterLabels } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { identityProviderConfig } from "../../../extensions/configs";
import { AdvancedSearchWithBasicFilters, AppConstants, UIConstants, history } from "../../core";
import { getIdentityProviderList } from "../api";
import { IdentityProviderGrid, handleGetIDPListCallError } from "../components";
import { GenericAuthenticatorInterface, IdentityProviderListResponseInterface } from "../models";
import { IdentityProviderManagementUtils } from "../utils";

/**
 * Proptypes for the IDP edit page component.
 */
type IDPPropsInterface = TestableComponentInterface;

/**
 * Identity Providers listing page component.
 *
 * @param {IDPPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const IdentityProvidersPage: FunctionComponent<IDPPropsInterface> = (
    props: IDPPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ hasNextPage, setHasNextPage ] = useState<boolean>(undefined);
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ localAuthenticators, setLocalAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(undefined);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(undefined);
    const [
        isAuthenticatorFetchRequestRequestLoading,
        setIsAuthenticatorFetchRequestRequestLoading
    ] = useState<boolean>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    /**
     * Fetches the local authenticators and stores them in the internal state.
     */
    useEffect(() => {

        setIsAuthenticatorFetchRequestRequestLoading(true);

        IdentityProviderManagementUtils.getAllAuthenticators(true)
            .then((authenticators: GenericAuthenticatorInterface[][]) => {

                const localAuthenticators: GenericAuthenticatorInterface[] = [];

                if (authenticators
                    && authenticators[0]
                    && Array.isArray(authenticators[0])
                    && authenticators[0].length > 0) {

                    authenticators[0].filter((authenticator: GenericAuthenticatorInterface) => {
                        if (!identityProviderConfig.utils.isConfigurableAuthenticator(authenticator.id)) {
                            return;
                        }

                        localAuthenticators.push(authenticator);
                    });
                }

                setLocalAuthenticators(localAuthenticators);
                setListItemLimit(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT - authenticators[0].length);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIsAuthenticatorFetchRequestRequestLoading(false);
            });
    }, []);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        
        if (!listItemLimit) {
            return;
        }

        getIdPList(listItemLimit, listOffset, null, false);
    }, [ listItemLimit ]);

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

        getIdentityProviderList(limit, offset, filter, "federatedAuthenticators")
            .then((response: IdentityProviderListResponseInterface) => {

                setHasNextPage(response?.links
                    && Array.isArray(response.links)
                    && response.links[ 0 ]
                    && response.links[ 0 ].rel === "next");

                if (append) {
                    response.identityProviders = [ ...idpList.identityProviders, ...response.identityProviders ];
                } else {
                    response.identityProviders = [ ...response.identityProviders, ...localAuthenticators ];
                }

                setIdPList(response);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    /**
     * Handles the `onFilter` callback action from the
     * identity provider search component.
     *
     * @param {string} query - Search query.
     */
    const handleIdentityProviderFilter = (query: string): void => {

        setSearchQuery(query);
        getIdPList(listItemLimit, listOffset, query, false);
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
        getIdPList(listItemLimit, listOffset, null, false);
        setTriggerClearQuery(!triggerClearQuery);
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

    return (
        <PageLayout
            action={
                (isIdPListRequestLoading
                    || isAuthenticatorFetchRequestRequestLoading
                    || !(!searchQuery && idpList?.totalResults <= 0)) && (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                        } }
                        data-testid={ `${ testId }-add-button` }
                    >
                        <Icon name="add"/>{ t("console:develop.features.authenticationProvider.buttons.addIDP") }
                    </PrimaryButton>
                )
            }
            title={ t("console:develop.pages.authenticationProvider.title") }
            description={ t("console:develop.pages.authenticationProvider.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <GridLayout
                search={ (
                    <SearchWithFilterLabels
                        searchInput={ (
                            <AdvancedSearchWithBasicFilters
                                fill="white"
                                onFilter={ handleIdentityProviderFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:develop.features.authenticationProvider.advancedSearch.form.inputs." +
                                        "filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:develop.features.authenticationProvider.advancedSearch.form.inputs." +
                                        "filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:develop.features.authenticationProvider.advancedSearch.form.inputs." +
                                        "filterValue.placeholder")
                                }
                                placeholder={
                                    t("console:develop.features.authenticationProvider.advancedSearch.placeholder")
                                }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advance-search` }
                            />
                        ) }
                        filterLabels={ [] }
                        data-testid={ `${ testId }-search` }
                    />
                ) }
                paginate={ () => handlePagination() }
            >
                <IdentityProviderGrid
                    isLoading={ isAuthenticatorFetchRequestRequestLoading || isIdPListRequestLoading }
                    list={ idpList }
                    onEmptyListPlaceholderActionClick={
                        () => history.push(AppConstants.getPaths().get("IDP_TEMPLATES"))
                    }
                    onIdentityProviderDelete={ handleIdentityProviderDelete }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid={ `${ testId }-list` }
                />
            </GridLayout>
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
