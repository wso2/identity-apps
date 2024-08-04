/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
    FeatureConfigInterface,
    UIConstants,
    history
} from "@wso2is/admin.core.v1";
import { CreateGroupMemberInterface } from "@wso2is/admin.groups.v1/models";
import { CreateRoleInterface, CreateRoleMemberInterface } from "@wso2is/admin.roles.v2/models/roles";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { I18n } from "@wso2is/i18n";
import { GridLayout, ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
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
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { createOrganizationRole, getOrganizationRoles } from "../api/organization-role";
import { OrganizationRoleList } from "../components";
import { AddOrganizationRoleWizard } from "../components/add-organization-role-wizard";
import {
    OrganizationResponseInterface,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "../models";

const ORGANIZATION_ROLES_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 0,
        text: I18n.instance.t("common:name") as ReactNode,
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

    const dispatch: Dispatch = useDispatch();

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
    const [ cursor, setCursor ] = useState(null);
    const [ activePage, setActivePage ] = useState<number>(1);

    const [ paginationReset, triggerResetPagination ] = useTrigger();
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const resetPagination = (): void => {
        setActivePage(1);
        triggerResetPagination();
    };

    /**
     * Retrieves the list of organization roles.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param filter - Search query.
     * @param after - After link for cursor based pagination
     * @param before - Before link for cursor based pagination
     */
    const getOrganizationRoleLists: (
        limit?: number,
        filter?: string,
        after?: string,
    ) => void = useCallback(
        (limit?: number, filter?: string, cursor?: string): void => {
            setOrganizationRoleListRequestLoading(true);

            getOrganizationRoles(
                currentOrganization.id,
                filter,
                limit,
                cursor)
                .then((response: OrganizationRoleListResponseInterface) => {
                    handleCursorPagination(response.nextCursor, response.previousCursor);
                    setOrganizationRoles(response.Resources);
                })
                .catch((error: IdentityAppsError) => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "organizations:notifications." + // ToDo
                                    "getOrganizationList.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "organizations:notifications.getOrganizationList" + // ToDo
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "organizations:notifications." + // ToDo
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
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            find(ORGANIZATION_ROLES_LIST_SORTING_OPTIONS, (option: DropdownItemProps) => {
                return data.value === option.value;
            })
        );
    };

    /**
     * Sets the Next button visibility.
     *
     * @param nextCursor - Next item.
     * @param previousCursor - Previous item.
     */
    const handleCursorPagination = (nextCursor: string | undefined, previousCursor: string | undefined): void => {
        setCursor(null);
        setAfter(undefined);
        setBefore(undefined);

        if (nextCursor) {
            setAfter(nextCursor);
        }

        if (previousCursor) {
            setBefore(previousCursor);
        }

        setIsOrganizationRolesNextPageAvailable(!!nextCursor);
    };

    /**
     * Handles the `onFilter` callback action from the
     * organization role search component.
     *
     * @param query - Search query.
     */
    const handleOrganizationRoleFilter = (query: string): void => {
        resetPagination();
        setSearchQuery(query);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const newPage: number = parseInt(data?.activePage as string);

        if (newPage > activePage) {
            setCursor(after);
            getOrganizationRoleLists(listItemLimit, searchQuery, after);
        } else if (newPage < activePage) {
            setCursor(before);
            getOrganizationRoleLists(listItemLimit, searchQuery, before);
        }
        setActivePage(newPage);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        resetPagination();
    };

    /**
     * Handles organization role delete action.
     */
    const handleOrganizationRoleDelete = (): void => {
        getOrganizationRoleLists(listItemLimit, searchQuery, cursor);
    };

    /**
     * Handles organization list update action.
     */
    const handleOrganizationRoleListUpdate = (): void => {
        getOrganizationRoleLists(listItemLimit, searchQuery, cursor);
    };

    /**
     * Handles the organization role create action.
     */
    const handleOrganizationRoleCreate: (roleData: CreateRoleInterface)
    => void = useCallback((roleData: CreateRoleInterface) => {
        // Setting up the data model for organization role creation (temp)
        roleData.groups.forEach((group: CreateGroupMemberInterface) => {
            delete(group.display);
        });

        roleData.users.forEach((user: CreateRoleMemberInterface) => {
            delete(user.display);
        });

        delete(roleData.schemas);

        createOrganizationRole(currentOrganization.id, roleData).then((response: AxiosResponse) => {
            if (response.status === 201) {
                dispatch(
                    addAlert({
                        description: t("roles:notifications.createRole." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("roles:notifications.createRole.success.message")
                    })
                );

                setShowWizard(false);
                history.push(AppConstants.getPaths().get("ORGANIZATION_ROLE_UPDATE").replace(":id", response.data.id));
            }

        }).catch((error: AxiosError) => {
            if (!error.response || error.response.status === 401) {
                setShowWizard(false);
                dispatch(
                    addAlert({
                        description: t("roles:notifications.createRole.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.createRole.error.message")
                    })
                );
            } else if (error.response && error.response.data.detail) {
                setShowWizard(false);
                dispatch(
                    addAlert({
                        description: t("roles:notifications.createRole.error.description",
                            { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.createRole.error.message")
                    })
                );
            } else {
                setShowWizard(false);
                dispatch(addAlert({
                    description: t("roles:notifications.createRole." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.createRole.genericError.message")
                }));
            }
        }).finally(() => {
            setLoading(false);
        });
    }, [ setShowWizard, setLoading, dispatch, currentOrganization, t ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        resetPagination();
        setTriggerClearQuery(!triggerClearQuery);
    };

    const handleListItemClick = (_e: SyntheticEvent, organizationRole: OrganizationRoleListItemInterface): void => {
        history.push(
            AppConstants.getPaths().get("ORGANIZATION_ROLE_UPDATE").replace(":id", organizationRole.id)
        );
    };

    useEffect(() => {
        getOrganizationRoleLists(listItemLimit, searchQuery, cursor);
    }, [ listItemLimit, getOrganizationRoleLists, searchQuery ]);

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("ROLES"));
    };

    return (
        <>
            <PageLayout
                action={
                    !isLoading &&
                    !(!searchQuery && (isEmpty(organizationRoles) || organizationRoles.length <= 0)) && (
                        <Show when={ featureConfig?.organizations?.scopes?.create }>
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
                                { t("Add Organization Role") }
                            </PrimaryButton>
                        </Show>
                    )
                }
                // ToDo
                title={ "Organization Roles" }
                pageTitle="Organization Roles"
                description={ "Manage organization roles here" }
                data-testid={ `${testId}-page-layout` }
                backButton={ {
                    onClick: handleBackButtonClick,
                    text: t("extensions:console.applicationRoles.roles.goBackToRoles")
                } }
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
                            data-testid={ `${ testId }-list-layout` }
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
                                            "organizations:advancedSearch." +
                                            "form.inputs.filterAttribute.placeholder"
                                        ) }
                                        filterConditionsPlaceholder={ t(
                                            "organizations:advancedSearch." +
                                            "form.inputs.filterCondition.placeholder"
                                        ) }
                                        filterValuePlaceholder={ t(
                                            "organizations:advancedSearch." +
                                            "form.inputs.filterValue.placeholder"
                                        ) }
                                        placeholder={ t(
                                            "organizations:advancedSearch.placeholder"
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
                                onOrganizationRoleDelete={ handleOrganizationRoleDelete }
                                onEmptyListPlaceholderActionClick={ () => {
                                    setShowWizard(true);
                                } }
                                onSearchQueryClear={ handleSearchQueryClear }
                                organizationId={ currentOrganization.id }
                                searchQuery={ searchQuery }
                                data-testid={ `${testId}-list` }
                                data-componentid="organization"
                                onListItemClick={ handleListItemClick }
                            />
                        </ListLayout>
                        { showWizard && (
                            <AddOrganizationRoleWizard
                                data-testid="org-role-mgt-add-role-wizard"
                                isAddGroup={ false }
                                closeWizard={ () => setShowWizard(false) }
                                updateList={ () => handleOrganizationRoleListUpdate() }
                                onCreateRoleRequested={ handleOrganizationRoleCreate }
                            />
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
