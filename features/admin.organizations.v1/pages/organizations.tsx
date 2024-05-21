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
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants
} from "@wso2is/admin.core.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Breadcrumb,
    Divider,
    DropdownItemProps,
    DropdownProps,
    Header,
    Icon,
    PaginationProps
} from "semantic-ui-react";
import { getOrganization, getOrganizations, useAuthorizedOrganizationsList } from "../api";
import { AddOrganizationModal, OrganizationList } from "../components";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface,
    OrganizationResponseInterface
} from "../models";

const ORGANIZATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 0,
        text: I18n.instance.t("common:name") as ReactNode,
        value: "name"
    }
];

/**
 * Props for the Organizations page.
 */
type OrganizationsPageInterface = IdentifiableComponentInterface;

/**
 * Organizations page.
 *
 * @param props - Props injected to the component.
 * @returns Organizations page component.
 */
const OrganizationsPage: FunctionComponent<OrganizationsPageInterface> = (
    props: OrganizationsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ organizationList, setOrganizationList ] = useState<OrganizationListInterface>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isOrganizationListRequestLoading, setOrganizationListRequestLoading ] = useState<boolean>(true);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isOrganizationsNextPageAvailable, setIsOrganizationsNextPageAvailable ] = useState<boolean>(undefined);
    const [ isOrganizationsPrevPageAvailable, setIsOrganizationsPrevPageAvailable ] = useState<boolean>(undefined);
    const [ parent, setParent ] = useState<OrganizationInterface>(null);
    const [ organizations, setOrganizations ] = useState<OrganizationInterface[]>([]);
    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>(null);
    const [ after, setAfter ] = useState<string>("");
    const [ before, setBefore ] = useState<string>("");
    const [ authorizedListPrevCursor, setAuthorizedListPrevCursor ] = useState<string>("");
    const [ authorizedListNextCursor, setAuthorizedListNextCursor ] = useState<string>("");
    const [ activePage, setActivePage ] = useState<number>(1);

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const [ paginationReset, triggerResetPagination ] = useTrigger();


    useEffect(() => {
        let nextFound: boolean = false;
        let prevFound: boolean = false;

        organizationList?.links?.forEach((link: OrganizationLinkInterface) => {
            if (link.rel === "next") {
                const afterID: string = link.href.split("after=")[ 1 ];

                setAfter(afterID);
                setIsOrganizationsNextPageAvailable(true);
                nextFound = true;
            }

            if (link.rel === "previous") {
                const beforeID: string = link.href.split("before=")[ 1 ];

                setBefore(beforeID);
                setIsOrganizationsPrevPageAvailable(true);
                prevFound = true;
            }
        });

        if (!nextFound) {
            setAfter("");
            setIsOrganizationsNextPageAvailable(false);
        }

        if (!prevFound) {
            setBefore("");
            setIsOrganizationsPrevPageAvailable(false);
        }
    }, [ organizationList ]);

    const resetPagination: () => void = useCallback((): void => {
        setActivePage(1);
        triggerResetPagination();
    }, [ setActivePage, triggerResetPagination ]);

    useEffect(() => {
        if (!parent || isEmpty(parent)) {
            return;
        }

        getOrganization(parent.id)
            .then((organization: OrganizationResponseInterface) => {
                setOrganization(organization);
            })
            .catch((error: any) => {
                if (error?.description) {
                    dispatch(
                        addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "organizations:notifications." +
                                "fetchOrganization.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "organizations:notifications.fetchOrganization" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "organizations:notifications." +
                            "fetchOrganization.genericError.message"
                        )
                    })
                );
            });
    }, [ parent, dispatch, t ]);

    const filterQuery: string = useMemo(() => {
        let filterQuery: string = "";

        if (!parent || isEmpty(parent)) {
            filterQuery = searchQuery;
        } else {
            filterQuery = `${ searchQuery ? searchQuery + " and " : "" }parentId eq ${ parent.id }`;
        }

        return filterQuery;
    }, [ searchQuery, parent ]);

    /**
     * Retrieves the list of organizations.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param filter - Search query.
     */
    const getOrganizationLists: (
        limit?: number,
        filter?: string,
        after?: string,
        before?: string,
        _recursive?: boolean
        ) => void = useCallback(
            (limit?: number, filter?: string, after?: string, before?: string, _recursive?: boolean): void => {
                if (!hasRequiredScopes(featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.read, allowedScopes)) {
                    // If the user does not have the required scopes, do not proceed.
                    // This is to avoid unnecessary requests to the when performing the org switch.
                    return;
                }

                setOrganizationListRequestLoading(true);
                getOrganizations(filter, limit, after, before, false)
                    .then((response: OrganizationListInterface) => {
                        setOrganizationList(response);
                    })
                    .catch((error: any) => {
                        setOrganizationList(null);

                        if (error?.description) {
                            dispatch(
                                addAlert({
                                    description: error.description,
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        "organizations:notifications." +
                                    "getOrganizationList.error.message"
                                    )
                                })
                            );

                            return;
                        }

                        dispatch(
                            addAlert({
                                description: t(
                                    "organizations:notifications.getOrganizationList" +
                                ".genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "organizations:notifications." +
                                "getOrganizationList.genericError.message"
                                )
                            })
                        );
                    })
                    .finally(() => {
                        setOrganizationListRequestLoading(false);
                    });
            },
            [ getOrganizations, dispatch, t, setOrganizationList, setOrganizationListRequestLoading ]
        );

    useEffect(() => {
        getOrganizationLists(listItemLimit, filterQuery, null, null);
    }, [ listItemLimit, getOrganizationLists, filterQuery ]);

    /**
     * Retrieves the list of authorized organizations.
     */
    const {
        data: authorizedOrganizationList,
        isLoading: isAuthorizedOrganizationListRequestLoading,
        error: authorizedListFetchRequestError,
        mutate: updateAuthorizedList
    } = useAuthorizedOrganizationsList(
        filterQuery,
        listItemLimit,
        authorizedListNextCursor,
        authorizedListPrevCursor,
        ApplicationManagementConstants.CONSOLE_APP_NAME,
        false
    );

    /**
     * Handles the authorized list fetch request error.
     */
    useEffect(() => {
        if (!authorizedListFetchRequestError) {
            return;
        }

        handleGetAuthoriziedListCallError(authorizedListFetchRequestError);
    }, [ authorizedListFetchRequestError ]);

    const handleGetAuthoriziedListCallError = (error: AxiosError) => {
        if (error?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: error?.response?.data?.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "organizations:notifications." +
                        "getOrganizationList.error.message"
                    )
                })
            );

            return;
        }
        dispatch(
            addAlert({
                description: t(
                    "organizations:notifications.getOrganizationList" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "organizations:notifications." +
                    "getOrganizationList.genericError.message"
                )
            })
        );

        return;
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
     * Handles the `onFilter` callback action from the
     * organization search component.
     *
     * @param query - Search query.
     */
    const handleOrganizationFilter: (
        query: string
        ) => void = useCallback((query: string): void => {
            resetPagination();
            setSearchQuery(query);
        }, [ resetPagination, setSearchQuery ]);

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
            const newPage: number = parseInt(data?.activePage as string);

            if (newPage > activePage) {
                getOrganizationLists(listItemLimit, filterQuery, after, null);
                setAuthorizedListNextCursor(after);
                setAuthorizedListPrevCursor(null);
            } else if (newPage < activePage) {
                getOrganizationLists(listItemLimit, filterQuery, null, before);
                setAuthorizedListNextCursor(null);
                setAuthorizedListPrevCursor(before);
            }

            setActivePage(newPage);
        }, [ getOrganizationLists, activePage, filterQuery, listItemLimit, after, before ]);

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
            resetPagination();
        }, [ setListItemLimit, resetPagination ]);

    /**
     * Handles organization delete action.
     */
    const handleOrganizationDelete = (): void => {
        getOrganizationLists(listItemLimit, filterQuery, after, before);
    };

    /**
     * Handles organization list update action.
     */
    const handleOrganizationListUpdate = (): void => {
        getOrganizationLists(listItemLimit, filterQuery, after, before);
        updateAuthorizedList();
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear: () => void = useCallback((): void => {
        setSearchQuery("");
        resetPagination();
    }, [ setSearchQuery, resetPagination ]);

    const handleBreadCrumbClick = (organization: OrganizationInterface, index: number): void => {
        const newOrganizations: OrganizationInterface[] = [ ...organizations ];

        newOrganizations.splice(index + 1);
        setOrganizations(newOrganizations);

        setParent(organization);
        resetPagination();

        if (!organization) {
            setOrganization(null);
        }
    };

    const handleListItemClick = (
        _e: SyntheticEvent<Element, Event>,
        organization: OrganizationInterface
    ): void => {
        if (organizations.find((org: OrganizationInterface) => org.id === organization.id)) {
            return;
        }

        handleSearchQueryClear();
        setParent(organization);
        resetPagination();

        const newOrganizations: OrganizationInterface[] = [ ...organizations ];

        newOrganizations.push(organization);
        setOrganizations(newOrganizations);
    };

    return (
        <>
            <PageLayout
                action={
                    !isOrganizationListRequestLoading && !isAuthorizedOrganizationListRequestLoading &&
                    !(!searchQuery && (isEmpty(organizationList) || organizationList?.organizations?.length <= 0)) &&
                    (
                        <Show when={ featureConfig?.organizations?.scopes?.create }>
                            <PrimaryButton
                                disabled={ isOrganizationListRequestLoading }
                                loading={ isOrganizationListRequestLoading }
                                onClick={ (): void => {
                                    eventPublisher.publish("organization-click-new-organization-button");
                                    setShowWizard(true);
                                } }
                                data-componentid={ `${ testId }-list-layout-add-button` }
                            >
                                <Icon name="add" />
                                { t("organizations:list.actions.add") }
                            </PrimaryButton>
                        </Show>
                    )
                }
                pageTitle={ t("pages:organizations.title") }
                title={
                    isOrganizationListRequestLoading
                        ? null
                        : organization
                            ? organization.name
                            : t("organizations:homeList.name")
                }
                description={
                    (<p>
                        { isOrganizationListRequestLoading
                            ? null
                            : organization
                                ? organization.description
                                : null }
                    </p>)
                }
                data-componentid={ `${ testId }-page-layout` }
                titleAs="h3"
                componentAbovePageHeader={
                    (<>
                        <Header as="h1" data-componentid={ `${ testId }-organization-header` }>
                            { t("pages:organizations.title") }
                            <Header.Subheader
                                data-componentid={ `${ testId }-sub-title` }
                            >
                                { t("pages:organizations.subTitle") }
                            </Header.Subheader>
                        </Header>
                        <Divider hidden />
                        { parent && organizations.length > 0 && (
                            <Breadcrumb className="margined" data-componentid={ `${ testId }-breadcrumb` }>
                                <Breadcrumb.Section
                                    onClick={ () => {
                                        handleBreadCrumbClick(null, -1);
                                    } }
                                >
                                    <span data-componentid={ `${ testId }-breadcrumb-home` }>
                                        { currentOrganization.name }
                                    </span>
                                </Breadcrumb.Section>
                                { organizations?.map((organization: OrganizationInterface, index: number) => {
                                    return (
                                        <React.Fragment key={ index }>
                                            <Breadcrumb.Divider icon="right chevron" />
                                            <Breadcrumb.Section
                                                active={ index === organizations.length - 1 }
                                                link={ index !== organizations.length - 1 }
                                                onClick={
                                                    index !== organizations.length - 1
                                                        ? () => handleBreadCrumbClick(organization, index)
                                                        : null
                                                }
                                            >
                                                { organization.name }
                                            </Breadcrumb.Section>
                                        </React.Fragment>
                                    );
                                }) }
                            </Breadcrumb>
                        ) }{ " " }
                    </>)
                }
            >
                <ListLayout
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
                            onFilter={ handleOrganizationFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={ t(
                                "organizations:advancedSearch.form" +
                                        ".inputs.filterAttribute.placeholder"
                            ) }
                            filterConditionsPlaceholder={ t(
                                "organizations:advancedSearch.form" +
                                        ".inputs.filterCondition.placeholder"
                            ) }
                            filterValuePlaceholder={ t(
                                "organizations:advancedSearch.form.inputs.filterValue" +
                                        ".placeholder"
                            ) }
                            placeholder={ t(
                                "organizations:" + "advancedSearch.placeholder"
                            ) }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
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
                    paginationOptions={ {
                        disableNextButton: !isOrganizationsNextPageAvailable,
                        disablePreviousButton: !isOrganizationsPrevPageAvailable
                    } }
                    isLoading={ isOrganizationListRequestLoading }
                    data-componentid={ `${ testId }-list-layout` }
                    resetPagination={ paginationReset }
                    activePage={ activePage }
                >
                    <OrganizationList
                        list={ organizationList }
                        authorizedList={ authorizedOrganizationList }
                        onOrganizationDelete={ handleOrganizationDelete }
                        onEmptyListPlaceholderActionClick={ () => {
                            setShowWizard(true);
                        } }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-componentid="organization-list"
                        onListItemClick={ handleListItemClick }
                        parentOrganization={ parent }
                        onListMutate={ handleOrganizationListUpdate }
                    />
                </ListLayout>
                { showWizard && (
                    <AddOrganizationModal
                        onUpdate={ handleOrganizationListUpdate }
                        closeWizard={ () => setShowWizard(false) }
                        parent={ parent }
                    />
                ) }
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
OrganizationsPage.defaultProps = {
    "data-componentid": "organizations"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganizationsPage;
