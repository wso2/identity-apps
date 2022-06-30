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
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, AppState, FeatureConfigInterface, UIConstants } from "../../core";
import { getOrganizationRoles } from "../api/organization-role";
import { OrganizationRoleList } from "../components";
import { OrganizationRoleListItemInterface, OrganizationRoleListResponseInterface } from "../models";

const ORGANIZATION_ROLES_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 0,
        text: I18n.instance.t("common:name"),
        value: "name"
    }
];

/**
 * Props for the Organizatio roles page.
 */
type OrganizationRolesPageInterface = IdentifiableComponentInterface;

const OrganizationRoles: FunctionComponent<OrganizationRolesPageInterface> = (
    props: OrganizationRolesPageInterface
): ReactElement => {

    const { ["data-componentid"]: testId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const currentOrganizationId = "4ed70bfe-7710-44be-8a41-8fc2c9ad1666";
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATION_ROLES_LIST_SORTING_OPTIONS[0]
    );

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isOrganizationRoleListRequestLoading, setOrganizationRoleListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isOrganizationRolesNextPageAvailable, setIsOrganizationRolesNextPageAvailable ] = useState<boolean>(
        undefined
    );
    const [ organizationRoles, setOrganizationRoles ] = useState<Array<OrganizationRoleListItemInterface>>();
    const [ after, setAfter ] = useState<string>("");
    const [ before, setBefore ] = useState<string>("");
    const [ activePage, setActivePage ] = useState<number>(1);

    const [ paginationReset, triggerResetPagination ] = useTrigger();

    const resetPagination = (): void => {
        setActivePage(1);
        triggerResetPagination();
    };

    /**
     * Retrieves the list of organization roles.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     * @param {string} after - After link for cursor based pagination
     * @param {string} before - Before link for cursor based pagination
     */
    const getOrganizationRoleLists = useCallback(
        (limit?: number, filter?: string, after?: string, before?: string): void => {
            setOrganizationRoleListRequestLoading(true);

            getOrganizationRoles(
                currentOrganizationId,
                filter,
                limit,
                after,
                before)
                .then((response: OrganizationRoleListResponseInterface) => {
                    handleNextButtonVisibility(response);
                    setOrganizationRoles(response.roles);
                })
                .catch((error) => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizations.notifications." + // ToDo
                                    "getOrganizationList.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizations.notifications.getOrganizationList" + // ToDo
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications." + // ToDo
                                "getOrganizationList.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setOrganizationRoleListRequestLoading(false);
                    setLoading(false);
                });
        },
        [ dispatch, t ]
    );

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            find(ORGANIZATION_ROLES_LIST_SORTING_OPTIONS, (option) => {
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
    const handleNextButtonVisibility = (list: OrganizationRoleListResponseInterface): void => {
        if (!list.links) {
            setIsOrganizationRolesNextPageAvailable(false);

            return;
        }

        list.links?.forEach((link) => {
            link.rel === "next"
                ? setIsOrganizationRolesNextPageAvailable(true)
                : setIsOrganizationRolesNextPageAvailable(false);
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * organization role search component.
     *
     * @param {string} query - Search query.
     */
    const handleOrganizationRoleFilter = (query: string): void => {
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
            getOrganizationRoleLists(listItemLimit, searchQuery, after, null);
        } else if (newPage < activePage) {
            getOrganizationRoleLists(listItemLimit, searchQuery, null, before);
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
     * Handles organization role delete action.
     */
    const handleOrganizationDelete = (): void => {
        getOrganizationRoleLists(listItemLimit, searchQuery, after, before);
    };

    /**
     * Handles organization list update action.
     */
    const handleOrganizationListUpdate = (): void => {
        getOrganizationRoleLists(listItemLimit, searchQuery, after, before);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        resetPagination();
        setTriggerClearQuery(!triggerClearQuery);
    };

    const handleListItemClick = (_e, organizationRole: OrganizationRoleListItemInterface): void => {
        console.log(`Role ${organizationRole.displayName} clicked`);
    };

    useEffect(() => {
        getOrganizationRoleLists(listItemLimit, searchQuery, null, null);
    }, [ listItemLimit, getOrganizationRoleLists, searchQuery ]);

    return (
        <>
            <PageLayout
                action={
                    !isLoading &&
                    !(!searchQuery && (isEmpty(organizationRoles) || organizationRoles.length <= 0)) && (
                        <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                            <PrimaryButton
                                disabled={ isOrganizationRoleListRequestLoading }
                                loading={ isOrganizationRoleListRequestLoading }
                                onClick={ (): void => {
                                    // eventPublisher.publish("organization-click-new-organization-button");
                                    setShowWizard(true);
                                } }
                                data-testid={ `${testId}-list-layout-add-button` }
                            >
                                <Icon name="add"/>
                                { /*ToDo*/ }
                                { t("console:manage.features.organizations.list.actions.add") }
                            </PrimaryButton>
                        </Show>
                    )
                }
                // ToDo
                title={ "Organization Roles" }
                description={ "Manage organization roles here" }
                data-testid={ `${testId}-page-layout` }
                titleAs="h3"
            >
                { !isLoading ? (
                    <>
                        <ListLayout
                            advancedSearch={
                                (<AdvancedSearchWithBasicFilters
                                    onFilter={ handleOrganizationRoleFilter }
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
                                    data-testid={ `${testId}-list-advanced-search` }
                                />)
                            }
                            currentListSize={ organizationRoles?.length }
                            listItemLimit={ listItemLimit }
                            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                            onPageChange={ handlePaginationChange }
                            onSortStrategyChange={ handleListSortingStrategyOnChange }
                            showPagination={ true }
                            showTopActionPanel={
                                isOrganizationRoleListRequestLoading ||
                                !(!searchQuery && organizationRoles?.length <= 0)
                            }
                            sortOptions={ ORGANIZATION_ROLES_LIST_SORTING_OPTIONS }
                            sortStrategy={ listSortingStrategy }
                            totalPages={ after ? activePage + 1 : 1 }
                            totalListSize={ organizationRoles?.length }
                            paginationOptions={ {
                                disableNextButton: !isOrganizationRolesNextPageAvailable
                            } }
                            data-testid={ `${testId}-list-layout` }
                            resetPagination={ paginationReset }
                        >
                            <OrganizationRoleList
                                advancedSearch={
                                    (<AdvancedSearchWithBasicFilters
                                        onFilter={ handleOrganizationRoleFilter }
                                        filterAttributeOptions={ [
                                            {
                                                key: 0,
                                                text: t("common:name"),
                                                value: "name"
                                            }
                                        ] }
                                        filterAttributePlaceholder={ t(
                                            "console:manage.features.organizations.advancedSearch." +
                                            "form.inputs.filterAttribute.placeholder"
                                        ) }
                                        filterConditionsPlaceholder={ t(
                                            "console:manage.features.organizations.advancedSearch." +
                                            "form.inputs.filterCondition.placeholder"
                                        ) }
                                        filterValuePlaceholder={ t(
                                            "console:manage.features.organizations.advancedSearch." +
                                            "form.inputs.filterValue.placeholder"
                                        ) }
                                        placeholder={ t(
                                            "console:manage.features.organizations.advancedSearch.placeholder"
                                        ) }
                                        defaultSearchAttribute="name"
                                        defaultSearchOperator="co"
                                        triggerClearQuery={ triggerClearQuery }
                                        data-testid={ `${testId}-list-advanced-search` }
                                    />)
                                }
                                featureConfig={ featureConfig }
                                isLoading={ isOrganizationRoleListRequestLoading }
                                list={ organizationRoles }
                                onOrganizationRoleDelete={ handleOrganizationDelete }
                                onEmptyListPlaceholderActionClick={ () => {
                                    setShowWizard(true);
                                } }
                                onSearchQueryClear={ handleSearchQueryClear }
                                organizationId={ currentOrganizationId }
                                searchQuery={ searchQuery }
                                data-testid={ `${testId}-list` }
                                data-componentid="organization"
                                onListItemClick={ handleListItemClick }
                            />
                        </ListLayout>
                        { showWizard && (
                            <div>123</div>
                            // <AddOrganizationModal
                            //     onUpdate={ handleOrganizationListUpdate }
                            //     closeWizard={ () => setShowWizard(false) }
                            //     parent={ parent }
                            // />
                        ) }
                    </>
                ) : (
                    <GridLayout isLoading={ isLoading }/>
                ) }
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
OrganizationRoles.defaultProps = {
    "data-componentid": "organizations-roles"
};

export default OrganizationRoles;
