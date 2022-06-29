/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { GridLayout, ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import find from "lodash-es/find";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Breadcrumb,
    Divider,
    DropdownItemProps,
    DropdownProps,
    Header,
    Icon,
    PaginationProps
} from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants
} from "../../core";
import { getOrganization, getOrganizations } from "../api";
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
        text: I18n.instance.t("common:name"),
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
 * @param {OrganizationsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OrganizationsPage: FunctionComponent<OrganizationsPageInterface> = (
    props: OrganizationsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ organizationList, setOrganizationList ] = useState<OrganizationListInterface>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isOrganizationListRequestLoading, setOrganizationListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isOrganizationsNextPageAvailable, setIsOrganizationsNextPageAvailable ] = useState<boolean>(undefined);
    const [ parent, setParent ] = useState<OrganizationInterface>(null);
    const [ organizations, setOrganizations ] = useState<OrganizationInterface[]>([]);
    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>(null);
    const [ after, setAfter ] = useState<string>("");
    const [ before, setBefore ] = useState<string>("");
    const [ activePage, setActivePage ] = useState<number>(1);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const [ paginationReset, triggerResetPagination ] = useTrigger();

    useEffect(() => {
        let nextFound: boolean = false;
        let prevFound: boolean = false;

        organizationList?.links?.forEach((link: OrganizationLinkInterface) => {
            if (link.rel === "next") {
                const afterID = link.href.split("after=")[ 1 ];

                setAfter(afterID);
                nextFound = true;
            }

            if (link.rel === "prev") {
                const beforeID = link.href.split("before=")[ 1 ];

                setBefore(beforeID);
                prevFound = true;
            }
        });

        if (!nextFound) {
            setAfter("");
        }

        if (!prevFound) {
            setBefore("");
        }
    }, [ organizationList ]);

    const resetPagination = (): void => {
        setActivePage(1);
        triggerResetPagination();
    };

    useEffect(() => {
        if (!parent || isEmpty(parent)) {
            return;
        }

        getOrganization(parent.id)
            .then((organization: OrganizationResponseInterface) => {
                setOrganization(organization);
            })
            .catch((error) => {
                if (error?.description) {
                    dispatch(
                        addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications."
                                + "fetchOrganization.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.fetchOrganization" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications." +
                            "fetchOrganization.genericError.message"
                        )
                    })
                );
            });
    }, [ parent, dispatch, t ]);

    const filterQuery = useMemo(() => {
        let filterQuery: string = "";

        if (!parent || isEmpty(parent)) {
            filterQuery = searchQuery;
        } else {
            filterQuery = `${ searchQuery ? searchQuery + " and" : "" } parentId eq ${ parent.id }`;
        }

        return filterQuery;
    }, [ searchQuery, parent ]);

    /**
     * Retrieves the list of organizations.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getOrganizationLists = useCallback(
        (limit?: number, filter?: string, after?: string, before?: string, recursive?: boolean): void => {
            setOrganizationListRequestLoading(true);

            getOrganizations(filter, limit, after, before, true)
                .then((response: OrganizationListInterface) => {
                    handleNextButtonVisibility(response);
                    setOrganizationList(response);
                })
                .catch((error) => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizations.notifications." +
                                    "getOrganizationList.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizations.notifications.getOrganizationList" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications." +
                                "getOrganizationList.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setOrganizationListRequestLoading(false);
                    setLoading(false);
                });
        },
        [ dispatch, t ]
    );

    useEffect(() => {
        getOrganizationLists(listItemLimit, filterQuery, null, null);
    }, [ listItemLimit, getOrganizationLists, filterQuery ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            find(ORGANIZATIONS_LIST_SORTING_OPTIONS, (option) => {
                return data.value === option.value;
            })
        );
    };

    /**
     *
     * Sets the Next button visibility.
     *
     * @param {OrganizationListInterface} list - List of organizations.
     */
    const handleNextButtonVisibility = (list: OrganizationListInterface): void => {
        if (!list.links) {
            setIsOrganizationsNextPageAvailable(false);

            return;
        }

        list.links?.forEach((link) => {
            link.rel === "next"
                ? setIsOrganizationsNextPageAvailable(true)
                : setIsOrganizationsNextPageAvailable(false);
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * organization search component.
     *
     * @param {string} query - Search query.
     */
    const handleOrganizationFilter = (query: string): void => {
        resetPagination();
        setSearchQuery(query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const newPage = parseInt(data?.activePage as string);

        if (newPage > activePage) {
            getOrganizationLists(listItemLimit, filterQuery, after, null);
        } else if (newPage < activePage) {
            getOrganizationLists(listItemLimit, filterQuery, null, before);
        }
        setActivePage(newPage);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        resetPagination();
    };

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
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        resetPagination();
        setTriggerClearQuery(!triggerClearQuery);
    };

    const handleBreadCrumbClick = (organization: OrganizationInterface, index: number): void => {
        const newOrganizations = [ ...organizations ];

        newOrganizations.splice(index + 1);
        setOrganizations(newOrganizations);

        setParent(organization);
        resetPagination();

        if (!organization) {
            setOrganization(null);
        }
    };

    const handleListItemClick = (_e, organization: OrganizationInterface): void => {
        if (organizations.find((org: OrganizationInterface) => org.id === organization.id)) {
            return;
        }

        handleSearchQueryClear();
        setParent(organization);
        resetPagination();

        const newOrganizations = [ ...organizations ];

        newOrganizations.push(organization);
        setOrganizations(newOrganizations);
    };

    return (
        <>
            <PageLayout
                action={
                    !isLoading &&
                    !(!searchQuery && (isEmpty(organizationList) || organizationList?.organizations?.length <= 0)) && (
                        <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                            <PrimaryButton
                                disabled={ isOrganizationListRequestLoading }
                                loading={ isOrganizationListRequestLoading }
                                onClick={ (): void => {
                                    eventPublisher.publish("organization-click-new-organization-button");
                                    setShowWizard(true);
                                } }
                                data-testid={ `${ testId }-list-layout-add-button` }
                            >
                                <Icon name="add" />
                                { t("console:manage.features.organizations.list.actions.add") }
                            </PrimaryButton>
                        </Show>
                    )
                }
                title={ isOrganizationListRequestLoading
                    ? null
                    : organization ? organization.name : t("console:manage.features.organizations.homeList.name") }
                description={
                    (<p>
                        { isOrganizationListRequestLoading
                            ? null
                            : organization
                                ? organization.description
                                : t("console:manage.features.organizations.homeList.description")
                        }
                    </p>)
                }
                data-testid={ `${ testId }-page-layout` }
                titleAs="h3"
                componentAbovePageHeader={
                    (<>
                        <Header as="h1">
                            { t("console:manage.pages.organizations.title") }
                            <Header.Subheader
                                data-componentid={ "organization-sub-title" }
                                data-testid={ `${ testId }-sub-title` }
                            >
                                { t("console:manage.pages.organizations.subTitle") }
                            </Header.Subheader>
                        </Header>
                        <Divider hidden />
                        { parent && organizations.length > 0 && (
                            <Breadcrumb className="margined">
                                <Breadcrumb.Section
                                    onClick={ () => {
                                        handleBreadCrumbClick(null, -1);
                                    } }
                                >
                                    <Icon name="home" />
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
                { !isLoading ? (
                    <>
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
                                        "console:manage.features.organizations.advancedSearch.form" +
                                        ".inputs.filterAttribute.placeholder"
                                    ) }
                                    filterConditionsPlaceholder={ t(
                                        "console:manage.features.organizations.advancedSearch.form" +
                                        ".inputs.filterCondition.placeholder"
                                    ) }
                                    filterValuePlaceholder={ t(
                                        "console:manage.features.organizations.advancedSearch.form.inputs.filterValue" +
                                        ".placeholder"
                                    ) }
                                    placeholder={ t(
                                        "console:manage.features.organizations." + "advancedSearch.placeholder"
                                    ) }
                                    defaultSearchAttribute="name"
                                    defaultSearchOperator="co"
                                    triggerClearQuery={ triggerClearQuery }
                                    data-testid={ `${ testId }-list-advanced-search` }
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
                            totalPages={ after ? activePage + 1 : 1 }
                            totalListSize={ organizationList?.organizations?.length }
                            paginationOptions={ {
                                disableNextButton: !isOrganizationsNextPageAvailable
                            } }
                            data-testid={ `${ testId }-list-layout` }
                            resetPagination={ paginationReset }
                        >
                            <OrganizationList
                                isLoading={ isOrganizationListRequestLoading }
                                list={ organizationList }
                                onOrganizationDelete={ handleOrganizationDelete }
                                onEmptyListPlaceholderActionClick={ () => {
                                    setShowWizard(true);
                                } }
                                onSearchQueryClear={ handleSearchQueryClear }
                                searchQuery={ searchQuery }
                                data-componentid="organization-list"
                                onListItemClick={ handleListItemClick }
                            />
                        </ListLayout>
                        { showWizard && (
                            <AddOrganizationModal
                                onUpdate={ handleOrganizationListUpdate }
                                closeWizard={ () => setShowWizard(false) }
                                parent={ parent }
                            />
                        ) }
                    </>
                ) : (
                    <GridLayout isLoading={ isLoading } />
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
