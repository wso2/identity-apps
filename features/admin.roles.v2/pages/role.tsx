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
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { OrganizationType } from "@wso2is/admin.core.v1/constants/organization-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, ListLayout, PageLayout, PrimaryButton, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteRoleById } from "../api";
import useGetRolesList from "../api/use-get-roles-list";
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
    const { getLink } = useDocumentation();

    const { organizationType } = useGetCurrentOrganizationType();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const userRolesV3FeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3);
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ filterBy, setFilterBy ] = useState<string>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;
    const { data: consoleApplicationFilter } = useApplicationList(null, null, null, "name eq Console");

    const roleCreationScope: string[] = useMemo(() => {
        return userRolesV3FeatureEnabled
            ? userRolesV3FeatureConfig?.scopes?.create
            : featureConfig?.userRoles?.scopes?.create;
    }, [ userRolesV3FeatureEnabled, userRolesV3FeatureConfig, featureConfig ]);

    const consoleId: string = useMemo(() => {
        return consoleApplicationFilter?.applications[0]?.id;
    }, [ consoleApplicationFilter ]);

    /**
     * Generates the final filter string to obtain the filtered roles list.
     *
     * @param filterBy - filter string.
     */
    const useRolesListFilterBy = (filterBy: string) => {
        return `audience.value ne ${consoleId}${ filterBy ? ` and ${ filterBy }` : "" }`;
    };

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        error: rolesListError,
        mutate: mutateRolesList
    } = useGetRolesList(
        listItemLimit,
        listOffset,
        useRolesListFilterBy(filterBy),
        "users,groups,permissions,associatedApplications"
    );

    /**
     * Filter options for the roles list.
     */
    const filterOptions: DropdownItemProps[] = [
        {
            key: undefined,
            text: t("roles:list.filterOptions.all"),
            value: undefined
        },
        {
            key: RoleConstants.ROLE_AUDIENCE_APPLICATION_FILTER,
            text: t("roles:list.filterOptions.applicationRoles"),
            value: RoleConstants.ROLE_AUDIENCE_APPLICATION_FILTER
        },
        {
            key: RoleConstants.ROLE_AUDIENCE_ORGANIZATION_FILTER,
            text: t("roles:list.filterOptions.organizationRoles"),
            value: RoleConstants.ROLE_AUDIENCE_ORGANIZATION_FILTER
        }
    ];

    /**
     * The following useEffect is used to handle if any error occurs while fetching the roles list.
     */
    useEffect(() => {
        if (rolesListError) {
            handleAlerts({
                description: t("roles:notifications.fetchRoles.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("roles:notifications.fetchRoles.genericError.message")
            });
        }
    }, [ rolesListError ]);


    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = ((data.activePage as number - 1) * listItemLimit) + 1;

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
                    description: t("roles:notifications.deleteRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("roles:notifications.deleteRole.success.message")
                });
                mutateRolesList();
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    handleAlerts({
                        description: error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.deleteRole.error.message")
                    });

                    return;
                }

                handleAlerts({
                    description: t("roles:notifications.deleteRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.deleteRole.genericError.message")
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
                (
                    !isRolesListLoading && (rolesList?.totalResults > 0)
                        ? (
                            <Show when={ roleCreationScope }>
                                <PrimaryButton
                                    data-componentid={ `${componentId}-add-button` }
                                    onClick={ () => handleCreateRole() }
                                >
                                    <Icon
                                        data-componentid={ `${componentId}-add-button-icon` }
                                        name="add"
                                    />
                                    { t("roles:list.buttons.addButton", { type: "Role" }) }
                                </PrimaryButton>
                            </Show>
                        ): null
                )
            }
            title={ t("pages:roles.title") }
            pageTitle={ t("pages:roles.title") }
            description={
                (
                    <>
                        { t("pages:roles.subTitle") }
                        <DocumentationLink
                            link={ getLink("develop.applications.roles.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>
                )
            }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-componentid={ `${componentId}-list-advanced-search` }
                        onFilter={ handleRolesFilter  }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("roles:list.filterAttirbutes.name"),
                                value: "displayName"
                            },
                            {
                                key: 1,
                                text: t("roles:list.filterAttirbutes.audience"),
                                value: "audience.type"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("roles:advancedSearch.form.inputs.filterAttribute." +
                                "placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("roles:advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("roles:advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("roles:advancedSearch.placeholder") }
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
                            placeholder= { t("roles:list.buttons.filterDropdown") }
                            onChange={ handleFilterChange }
                        />
                    )
                }
                showPagination={ true }
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
