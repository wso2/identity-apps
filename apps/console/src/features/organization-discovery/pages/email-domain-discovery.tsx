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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
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
import { useDispatch } from "react-redux";
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
import { AdvancedSearchWithBasicFilters, AppConstants, EventPublisher, UIConstants, history } from "../../core";
import { addOrganizationDiscoveryConfig, 
    deleteOrganizationDiscoveryConfig, 
    getOrganizationDiscovery, 
    getOrganizationDiscoveryConfig 
} from "../api";
import { OrganizationListWithDiscovery } from "../components";
import {
    OrganizationDiscoveryConfigInterface,
    OrganizationDiscoveryConfigPropertyInterface,
    OrganizationListWithDiscoveryInterface
} from "../models";

const ORGANIZATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 0,
        text: I18n.instance.t("console:manage.features.organizationDiscovery.advancedSearch." +
        "form.dropdown.filterAttributeOptions.organizationName") as ReactNode,
        value: "organizationName"
    }
];

/**
 * Props for the Email Domain Discovery page.
 */
type EmailDomainDiscoveryPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const EmailDomainDiscoveryPage: FunctionComponent<EmailDomainDiscoveryPageInterface> = (
    props: EmailDomainDiscoveryPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ organizationList, setOrganizationList ] = useState<OrganizationListWithDiscoveryInterface>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ isOrganizationListRequestLoading, setOrganizationListRequestLoading ] = useState<boolean>(true);
    const [ organizationDiscoveryEnabled, setOrganizationDiscoveryEnabled ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const filterQuery: string = useMemo(() => {
        let filterQuery: string = "";

        filterQuery = searchQuery;

        return filterQuery;
    }, [ searchQuery ]);

    /**
     * Retrieves the list of organizations.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param filter - Search query.
     */
    const getOrganizationListWithDiscovery: (
        limit?: number,
        offset?: number,
        filter?: string
        ) => void = useCallback(
            (limit?: number, offset?: number, filter?: string): void => {
                setOrganizationListRequestLoading(true);
                getOrganizationDiscovery(filter, offset, limit)
                    .then((response:  OrganizationListWithDiscoveryInterface) => {
                        setOrganizationList(response);
                    })
                    .catch((error: any) => {
                        if (error?.description) {
                            dispatch(
                                addAlert({
                                    description: error.description,
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "console:manage.features.organizationDiscovery.notifications." +
                                    "getOrganizationListWithDiscovery.error.message"
                                    )
                                })
                            );

                            return;
                        }

                        dispatch(
                            addAlert({
                                description: t(
                                    "console:manage.features.organizationDiscovery.notifications." +
                                    "getOrganizationListWithDiscovery.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizationDiscovery.notifications." +
                                "getOrganizationListWithDiscovery.genericError.message"
                                )
                            })
                        );
                    })
                    .finally(() => {
                        setOrganizationListRequestLoading(false);
                    });
            },
            [ getOrganizationDiscovery, dispatch, t, setOrganizationList, setOrganizationListRequestLoading ]
        );

    useEffect(() => {
        getOrganizationListWithDiscovery(listItemLimit, listOffset, filterQuery);
    }, [ listItemLimit, getOrganizationListWithDiscovery, listOffset, filterQuery ]);

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
    const handleOrganizationFilter: (
        query: string
        ) => void = useCallback((query: string): void => {
            setSearchQuery(query);
        }, [ setSearchQuery ]);

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange: (
        event: MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
        ) => void = useCallback((
            event: MouseEvent<HTMLAnchorElement>,
            data: PaginationProps
        ): void => {
            const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

            setListOffset(offsetValue);
            getOrganizationListWithDiscovery(listItemLimit, listOffset, filterQuery);
        }, [ getOrganizationListWithDiscovery, filterQuery, listOffset, listItemLimit ]);

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange: (
        event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
        ) => void = useCallback((
            event: MouseEvent<HTMLAnchorElement>,
            data: DropdownProps
        ): void => {
            setListItemLimit(data.value as number);
        }, [ setListItemLimit ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear: () => void = useCallback((): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    }, [ setSearchQuery, triggerClearQuery ]);

    /**
     * Update organization discovery enabled state based on existing data.
     */
    useEffect(() => {
        getOrganizationDiscoveryConfig()
            .then((response: OrganizationDiscoveryConfigInterface) => {
                response?.properties?.forEach((property:OrganizationDiscoveryConfigPropertyInterface) => {
                    if (property.key === "emailDomain.enable") {
                        setOrganizationDiscoveryEnabled(property.value);
                    }
                });
            })
            .catch((error: AxiosError) => {
                if (error.response.status == 404) {
                    setOrganizationDiscoveryEnabled(false);
                
                    return;
                }
                if (error.response && error.response.data && error.response.data.detail) {
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
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "getEmailDomainDiscovery.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "getEmailDomainDiscovery.genericError.message"
                            )
                        })
                    );
                }
            });
    }, []);

    /**
     * This is called when the enable toggle changes.
     *
     * @param e - Event object
     * @param data -  The data object.
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps): void => {

        setOrganizationDiscoveryEnabled(data.checked);

        if (data.checked == true) {

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
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.data && error.response.data.detail) {
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
                    } else {
                        // Generic error message
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:manage.features.organizationDiscovery.notifications." +
                                    "enableEmailDomainDiscovery.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizationDiscovery.notifications." +
                                    "enableEmailDomainDiscovery.genericError.message"
                                )
                            })
                        );
                    }
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
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
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
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "disableEmailDomainDiscovery.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizationDiscovery.notifications." +
                                "disableEmailDomainDiscovery.genericError.message"
                            )
                        })
                    );
                }
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
                checked={ organizationDiscoveryEnabled }
                data-testId={ `${ testId }-enable-toggle` }
            />
        );
    };

    return (
        <>
            <PageLayout
                action={
                    !isOrganizationListRequestLoading && organizationDiscoveryEnabled &&
                    !(!searchQuery && (isEmpty(organizationList) || organizationList?.organizations?.length <= 0)) &&
                    (
                        <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                            <PrimaryButton
                                disabled={ isOrganizationListRequestLoading }
                                loading={ isOrganizationListRequestLoading }
                                onClick={ () => {
                                    eventPublisher.publish("organization-click-assign-email-domain-button");
                                    history.push(AppConstants.getPaths().get("EMAIL_DOMAIN_ASSIGN"));
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
            >
                { discoveryToggle() }
                <Divider hidden />
                { organizationDiscoveryEnabled && (
                    <ListLayout
                        advancedSearch={
                            (<AdvancedSearchWithBasicFilters
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
                            />)
                        }
                        currentListSize={ organizationList?.organizations?.length }
                        listItemLimit={ listItemLimit }
                        onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                        onPageChange={ handlePaginationChange }
                        onSortStrategyChange={ handleListSortingStrategyOnChange }
                        showPagination={ true }
                        showTopActionPanel={
                            isOrganizationListRequestLoading ||
                                    !(!searchQuery && organizationList?.organizations?.length <= 0)
                        }
                        sortOptions={ ORGANIZATIONS_LIST_SORTING_OPTIONS }
                        sortStrategy={ listSortingStrategy }
                        totalPages={ 10 }
                        totalListSize={ organizationList?.organizations?.length }
                        isLoading={ isOrganizationListRequestLoading }
                        data-componentid={ `${ testId }-list-layout` }
                    >
                        <OrganizationListWithDiscovery
                            list={ organizationList }
                            onEmptyListPlaceholderActionClick={ () => {
                                () => history.push(AppConstants.getPaths().get("EMAIL_DOMAIN_ASSIGN"));
                            } }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-componentid="organization-list-with-discovery"
                        />
                    </ListLayout>
                ) }
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
EmailDomainDiscoveryPage.defaultProps = {
    "data-componentid": "email-domain-discovery-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailDomainDiscoveryPage;
