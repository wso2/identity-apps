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

import Alert from "@oxygen-ui/react/Alert";
import { Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import find from "lodash-es/find";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Checkbox,
    CheckboxProps,
    Divider,
    DropdownItemProps,
    DropdownProps,
    Icon,
    PaginationProps
} from "semantic-ui-react";
import { AccessControlConstants } from "../../access-control/constants/access-control";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import addOrganizationDiscoveryConfig from "../api/add-organization-discovery-config";
import deleteOrganizationDiscoveryConfig from "../api/delete-organization-discovery-config";
import useGetOrganizationDiscovery from "../api/use-get-organization-discovery";
import useGetOrganizationDiscoveryConfig from "../api/use-get-organization-discovery-config";
import DiscoverableOrganizationsList from "../components/discoverable-organizations-list";
import {
    OrganizationDiscoveryConfigInterface,
    OrganizationListWithDiscoveryInterface
} from "../models/organization-discovery";

const ORGANIZATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 0,
        text: I18n.instance.t("console:manage.features.organizationDiscovery.advancedSearch." +
        "form.dropdown.filterAttributeOptions.organizationName") as ReactNode,
        value: "organizationName"
    }
];

/**
 * Props interface of {@link OrganizationDiscoveryDomainsPage}
 */
type OrganizationDiscoveryDomainsPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const OrganizationDiscoveryDomainsPage: FunctionComponent<OrganizationDiscoveryDomainsPageInterface> = (
    props: OrganizationDiscoveryDomainsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const filterQuery: string = useMemo(() => {
        let filterQuery: string = "";

        filterQuery = searchQuery;

        return filterQuery;
    }, [ searchQuery ]);

    const {
        data: organizationDiscoveryConfig,
        error: organizationDiscoveryConfigFetchRequestError,
        isLoading: isOrganizationDiscoveryConfigFetchRequestLoading,
        mutate: mutateOrganizationDiscoveryConfigFetchRequest
    } = useGetOrganizationDiscoveryConfig();

    const {
        data: discoverableOrganizations,
        error: discoverableOrganizationsFetchRequestError,
        isLoading: isDiscoverableOrganizationsFetchRequestLoading
    } = useGetOrganizationDiscovery(true, filterQuery, listOffset, listItemLimit);

    const { isOrganizationDiscoveryEnabled } = organizationDiscoveryConfig;

    /**
     * Handle error scenarios of the organization discovery config fetch request.
     */
    useEffect(() => {
        if (!organizationDiscoveryConfigFetchRequestError) {
            return;
        }

        if (organizationDiscoveryConfigFetchRequestError.response?.status === 404) {
            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "console:manage.features.organizationDiscovery.notifications." +
                            "getEmailDomainDiscovery.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.organizationDiscovery.notifications." +
                            "getEmailDomainDiscovery.error.message"
                )
            })
        );
    }, [ organizationDiscoveryConfigFetchRequestError ]);

    /**
     * Handle error scenarios of the discoverable organizations fetch request.
     */
    useEffect(() => {
        if (!discoverableOrganizationsFetchRequestError) {
            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "console:manage.features.organizationDiscovery.notifications." +
                    "getOrganizationListWithDiscovery.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.organizationDiscovery.notifications." +
                "getOrganizationListWithDiscovery.error.message"
                )
            })
        );
    }, [ discoverableOrganizationsFetchRequestError ]);

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
     * Handles the `onFilter` callback action from the
     * organization search component.
     *
     * @param query - Search query.
     */
    const handleOrganizationFilter: (query: string) => void = useCallback(
        (query: string): void => {
            setSearchQuery(query);
        },
        [ setSearchQuery ]
    );

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = ((data.activePage as number) - 1) * listItemLimit;

        setListOffset(offsetValue);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear: () => void = useCallback((): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    }, [ setSearchQuery, triggerClearQuery ]);

    /**
     * This is called when the enable toggle changes.
     *
     * @param e - Event object
     * @param data -  The data object.
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps): void => {
        if (data.checked === true) {
            const updateData: OrganizationDiscoveryConfigInterface = {
                properties: []
            };

            updateData.properties.push({
                key: "emailDomain.enable",
                value: true
            });

            addOrganizationDiscoveryConfig(updateData)
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "enableEmailDomainDiscovery.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "enableEmailDomainDiscovery.success.message"
                            )
                        })
                    );

                    mutateOrganizationDiscoveryConfigFetchRequest();
                })
                .catch(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "enableEmailDomainDiscovery.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "enableEmailDomainDiscovery.error.message"
                            )
                        })
                    );
                });

            return;
        }

        deleteOrganizationDiscoveryConfig()
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "disableEmailDomainDiscovery.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "disableEmailDomainDiscovery.success.message"
                        )
                    })
                );

                mutateOrganizationDiscoveryConfigFetchRequest();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "disableEmailDomainDiscovery.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                            "disableEmailDomainDiscovery.error.message"
                        )
                    })
                );
            });
    };

    /**
     * This renders the enable toggle.
     */
    const discoveryToggle = (): ReactElement => {
        return (
            <Checkbox
                label={ t("console:manage.features.organizationDiscovery." +
                    "emailDomains.actions.enable") }
                toggle
                onChange={ handleToggle }
                checked={ isOrganizationDiscoveryEnabled }
                data-testId={ `${ testId }-enable-toggle` }
                readOnly={ isReadOnly }
            />
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

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    return (
        <PageLayout
            action={
                !isOrganizationDiscoveryConfigFetchRequestLoading
                && isOrganizationDiscoveryEnabled
                && !(!searchQuery
                    && (
                        isEmpty(discoverableOrganizations)
                        || discoverableOrganizations?.totalResults <= 0
                    )
                ) && (
                    <Show when={ AccessControlConstants.ORGANIZATION_DISCOVERY_WRITE }>
                        <PrimaryButton
                            disabled={ isDiscoverableOrganizationsFetchRequestLoading }
                            loading={ isDiscoverableOrganizationsFetchRequestLoading }
                            onClick={ () => {
                                eventPublisher.publish("organization-click-assign-email-domain-button");
                                history.push(
                                    AppConstants.getPaths().get("ASSIGN_ORGANIZATION_DISCOVERY_DOMAINS")
                                );
                            } }
                            data-componentid={ `${ testId }-list-layout-assign-button` }
                        >
                            <Icon name="add" />
                            { t("console:manage.features.organizationDiscovery.emailDomains.actions.assign") }
                        </PrimaryButton>
                    </Show>
                )
            }
            pageTitle={ t("console:manage.pages.emailDomainDiscovery.title") }
            title={ t("console:manage.pages.emailDomainDiscovery.title") }
            description={ t("console:manage.pages.emailDomainDiscovery.subTitle") }
            data-componentid={ `${ testId }-page-layout` }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:manage.features.governanceConnectors.goBackLoginAndRegistration")
            } }
        >
            { discoveryToggle() }
            <Divider hidden />
            <Alert severity="info">
                { t("console:manage.features.organizationDiscovery.message") }
            </Alert>
            <Divider hidden />
            { isOrganizationDiscoveryEnabled && (
                <ListLayout
                    advancedSearch={ (
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleOrganizationFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("console:manage.features.organizationDiscovery.advancedSearch." +
                                    "form.dropdown.filterAttributeOptions.organizationName"),
                                    value: "organizationName"
                                }
                            ] }
                            filterAttributePlaceholder={ t(
                                "console:manage.features.organizationDiscovery.advancedSearch.form" +
                                        ".inputs.filterAttribute.placeholder"
                            ) }
                            filterConditionsPlaceholder={ t(
                                "console:manage.features.organizationDiscovery.advancedSearch.form" +
                                        ".inputs.filterCondition.placeholder"
                            ) }
                            filterValuePlaceholder={ t(
                                "console:manage.features.organizationDiscovery.advancedSearch.form" +
                                ".inputs.filterValue.placeholder"
                            ) }
                            placeholder={ t(
                                "console:manage.features.organizationDiscovery.advancedSearch.placeholder"
                            ) }
                            defaultSearchAttribute="organizationName"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-componentid={ `${ testId }-list-advanced-search` }
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
                    totalPages={ 10 }
                    totalListSize={ discoverableOrganizations?.organizations?.length }
                    isLoading={ isDiscoverableOrganizationsFetchRequestLoading }
                    paginationOptions={ {
                        disableNextButton: !shouldShowNextPageNavigation(discoverableOrganizations)
                    } }
                    data-componentid={ `${ testId }-list-layout` }
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
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OrganizationDiscoveryDomainsPage.defaultProps = {
    "data-componentid": "organization-discovery-domains-page"
};

export default OrganizationDiscoveryDomainsPage;
