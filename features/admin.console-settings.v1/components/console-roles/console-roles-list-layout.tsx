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

import { FeatureAccessConfigInterface, Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { deleteRoleById } from "@wso2is/admin.roles.v2/api/roles";
import { AlertLevels, IdentifiableComponentInterface, RoleListInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import ConsoleRolesTable from "./console-role-table";

/**
 * Props interface of {@link ConsoleRolesListLayout}
 */
export interface ConsoleRolesListLayoutPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the user a sub org user.
     */
    isSubOrg: boolean;
    rolesList: RoleListInterface;
    isRolesListLoading: boolean;
    searchQuery: string;
    onMutateRolesList: () => void;
    onListOffsetChange: (offset: number) => void;
    onListItemLimitChange: (limit: number) => void;
    onSearchQueryChange: (query: string) => void;
    onRoleCreate: () => void;
    listItemLimit: number;
}

/**
 * Layout for the Roles page.
 *
 * @param props - Props injected to the component.
 * @returns Roles layout component.
 */
const ConsoleRolesListLayout: FunctionComponent<ConsoleRolesListLayoutPropsInterface> = (
    props: ConsoleRolesListLayoutPropsInterface
): ReactElement => {

    const {
        isSubOrg,
        rolesList,
        onMutateRolesList,
        isRolesListLoading,
        listItemLimit,
        searchQuery,
        onListOffsetChange,
        onListItemLimitChange,
        onSearchQueryChange,
        onRoleCreate,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const userRolesV3FeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3
    );
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const consoleSettingsFeatureConfig : FeatureAccessConfigInterface =
        useSelector((state: AppState) => state.config.ui.features.consoleSettings);
    const isConsoleRolesEditable: boolean = !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
        "consoleSettings.editableConsoleRoles"
    );

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

        onListOffsetChange(offsetValue);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        onListItemLimitChange(data.value as number);
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
                dispatch(addAlert(({
                    description: t("roles:notifications.deleteRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("roles:notifications.deleteRole.success.message")
                })));

                onMutateRolesList();
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert(({
                        description: error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.deleteRole.error.message")
                    })));

                    return;
                }

                dispatch(addAlert(({
                    description: t("roles:notifications.deleteRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.deleteRole.genericError.message")
                })));
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
            onMutateRolesList();

            return;
        }

        onSearchQueryChange(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        onSearchQueryChange(null);
    };

    const handleRoleEdit = (role: RolesInterface) => {
        history.push(AppConstants.getPaths().get("CONSOLE_ROLES_EDIT").replace(":id", role?.id));
    };

    return (
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
            showTopActionPanel={ (rolesList?.totalResults > 0 || searchQuery?.length !== 0) }
            topActionPanelExtension={
                !isSubOrganization() &&
                isConsoleRolesEditable &&
                (
                    <Show
                        when={
                            userRolesV3FeatureEnabled
                                ? userRolesV3FeatureConfig?.scopes?.create
                                : featureConfig?.userRoles?.scopes?.create
                        }
                    >
                        <PrimaryButton
                            data-componentid={ `${componentId}-add-button` }
                            onClick={ () => onRoleCreate() }
                        >
                            <Icon
                                data-componentid={ `${componentId}-add-button-icon` }
                                name="add"
                            />
                            { t("roles:list.buttons.addButton", { type: "Role" }) }
                        </PrimaryButton>
                    </Show>
                ) }
            showPagination={ true }
            totalPages={ Math.ceil(rolesList?.totalResults / listItemLimit) }
            totalListSize={ rolesList?.totalResults }
            isLoading={ isRolesListLoading }
            className="console-roles-list-layout"
        >
            <ConsoleRolesTable
                onRoleDelete={ handleOnDelete }
                onRoleEdit={ handleRoleEdit }
                onEmptyListPlaceholderActionClick={ () => onRoleCreate() }
                onSearchQueryClear={ handleSearchQueryClear }
                roleList={ rolesList }
                searchQuery={ searchQuery }
                isSubOrg={ isSubOrg }
            />
        </ListLayout>
    );
};

/**
 * Default props for the component.
 */
ConsoleRolesListLayout.defaultProps = {
    "data-componentid": "console-roles-list-layout"
};

export default ConsoleRolesListLayout;
