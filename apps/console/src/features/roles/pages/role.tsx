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
import { OrganizationType } from "@wso2is/common";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, AppConstants, UIConstants } from "../../core";
import { history } from "../../core/helpers";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { deleteRoleById, useRolesList } from "../api";
import { RoleList } from "../components/role-list";
import { RoleConstants } from "../constants";

type RolesPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * React component to list User Roles.
 *
 * @returns Roles page component.
 */
const RolesPage: FunctionComponent<RolesPagePropsInterface> = (
    props: RolesPagePropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { organizationType } = useGetCurrentOrganizationType();

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ filterBy, setFilterBy ] = useState<string>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        mutate: mutateRolesList
    } = useRolesList(
        listItemLimit,
        listOffset,
        filterBy,
        "users,groups,permissions,associatedApplications"
    );

    /**
     * Filter options for the roles list.
     */
    const filterOptions: DropdownItemProps[] = [
        {
            key: undefined,
            text: t("console:manage.features.roles.list.filterOptions.all"),
            value: undefined
        },
        {
            key: RoleConstants.ROLE_AUDIENCE_APPLICATION_FILTER,
            text: t("console:manage.features.roles.list.filterOptions.applicationRoles"),
            value: RoleConstants.ROLE_AUDIENCE_APPLICATION_FILTER
        },
        {
            key: RoleConstants.ROLE_AUDIENCE_ORGANIZATION_FILTER,
            text: t("console:manage.features.roles.list.filterOptions.organizationRoles"),
            value: RoleConstants.ROLE_AUDIENCE_ORGANIZATION_FILTER
        }
    ];

    /**
     * The following useEffect is used to handle if any error occurs while fetching the roles list.
     */
    useEffect(() => {
        if (rolesListError) {
            handleAlerts({
                description: t("console:manage.features.roles.notifications.fetchRoles.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.roles.notifications.fetchRoles.genericError.message")
            });
        }
    }, [ rolesListError ]);


    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

        setListOffset(offsetValue);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setFilterBy(data.value as string);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param role - Role ID which needs to be deleted
     * TODO: Delete function need to be updated once the delete function is ready in the backend.
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id)
            .then(() => {
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.deleteRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.roles.notifications.deleteRole.success.message")
                });
                mutateRolesList();
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    handleAlerts({
                        description: error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.deleteRole.error.message")
                    });

                    return;
                }

                handleAlerts({
                    description: t("console:manage.features.roles.notifications.deleteRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.deleteRole.genericError.message")
                });
            });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param query - Search query.
     */
    const handleRolesFilter = (query: string): void => {
        if (query === "displayName sw ") {
            mutateRolesList();

            return;
        }

        setFilterBy(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setFilterBy(null);
    };

    const handleCreateRole = () => {
        history.push(AppConstants.getPaths().get("ROLE_CREATE"));
    };

    return (
        <PageLayout
            action={
                !isSubOrg && !isRolesListLoading && (rolesList?.totalResults > 0)
                    ? (
                        <Show when={ AccessControlConstants.ROLE_WRITE }>
                            <PrimaryButton
                                data-componentid={ `${componentId}-add-button` }
                                onClick={ () => handleCreateRole() }
                            >
                                <Icon
                                    data-componentid={ `${componentId}-add-button-icon` }
                                    name="add"
                                />
                                { t("console:manage.features.roles.list.buttons.addButton", { type: "Role" }) }
                            </PrimaryButton>
                        </Show>
                    ) : null
            }
            title={ t("console:manage.pages.roles.title") }
            pageTitle={ t("console:manage.pages.roles.title") }
            description={ isSubOrg
                ? t("console:manage.pages.roles.alternateSubTitle")
                : t("console:manage.pages.roles.subTitle") }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-componentid={ `${componentId}-list-advanced-search` }
                        onFilter={ handleRolesFilter  }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("console:manage.features.roles.list.filterAttirbutes.name"),
                                value: "displayName"
                            },
                            {
                                key: 1,
                                text: t("console:manage.features.roles.list.filterAttirbutes.audience"),
                                value: "audience.type"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("console:manage.features.roles.advancedSearch.form.inputs.filterAttribute." +
                                "placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("console:manage.features.roles.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("console:manage.features.roles.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("console:manage.features.roles.advancedSearch.placeholder") }
                        defaultSearchAttribute="displayName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ rolesList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showTopActionPanel={ (rolesList?.totalResults > 0 || filterBy?.length !== 0) }
                rightActionPanel={
                    (
                        <Dropdown
                            data-componentid={ `${componentId}-list-filters-dropdown` }
                            selection
                            options={ filterOptions }
                            placeholder= { t("console:manage.features.roles.list.buttons.filterDropdown") }
                            onChange={ handleFilterChange }
                        />
                    )
                }
                showPagination={ rolesList?.totalResults > 0 }
                totalPages={ Math.ceil(rolesList?.totalResults / listItemLimit) }
                totalListSize={ rolesList?.totalResults }
                isLoading={ isRolesListLoading }
            >
                <RoleList
                    handleRoleDelete={ handleOnDelete }
                    onEmptyListPlaceholderActionClick={ () => handleCreateRole() }
                    onSearchQueryClear={ handleSearchQueryClear }
                    roleList={ rolesList }
                    searchQuery={ filterBy }
                    isSubOrg={ isSubOrg }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
RolesPage.defaultProps = {
    "data-componentid": "roles-mgt"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RolesPage;
