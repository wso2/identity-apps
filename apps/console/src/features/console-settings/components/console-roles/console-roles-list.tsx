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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import ConsoleRolesListLayout from "./console-roles-list-layout";
import CreateConsoleRoleWizard from "./create-console-role-wizard/create-console-role-wizard";
import { UIConstants } from "../../../core/constants/ui-constants";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import useConsoleRoles from "../../hooks/use-console-roles";

/**
 * Props interface of {@link ConsoleRolesList}
 */
type ConsoleRolesListInterface = IdentifiableComponentInterface;

/**
 * Component to render the roles list.
 *
 * @param props - Props injected to the component.
 * @returns Console roles list component.
 */
const ConsoleRolesList: FunctionComponent<ConsoleRolesListInterface> = (
    props: ConsoleRolesListInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ showCreateConsoleRoleWizard, setShowCreateConsoleRoleWizard ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ searchQuery, setSearchQuery ] = useState<string>(undefined);

    const {
        consoleRoles,
        consoleRolesFetchRequestError,
        mutateConsoleRolesFetchRequest,
        isConsoleRolesFetchRequestLoading
    } = useConsoleRoles(true, listItemLimit, listOffset, searchQuery);

    const { isSubOrganization } = useGetCurrentOrganizationType();

    /**
     * The following useEffect is used to handle if any error occurs while fetching the roles list.
     */
    useEffect(() => {
        if (consoleRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("console:manage.features.roles.notifications.fetchRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.fetchRoles.genericError.message")
                })
            );
        }
    }, [ consoleRolesFetchRequestError ]);

    const handleCreateRole = () => {
        setShowCreateConsoleRoleWizard(true);
    };

    return (
        <>
            <ConsoleRolesListLayout
                data-componentid={ `${ componentId }-layout` }
                isSubOrg={ isSubOrganization() }
                rolesList={ consoleRoles }
                onMutateRolesList={ mutateConsoleRolesFetchRequest }
                isRolesListLoading={ isConsoleRolesFetchRequestLoading }
                listItemLimit={ listItemLimit }
                searchQuery={ searchQuery }
                onListOffsetChange={ setListOffset }
                onListItemLimitChange={ setListItemLimit }
                onSearchQueryChange={ setSearchQuery }
                onRoleCreate={ handleCreateRole }
            />
            { showCreateConsoleRoleWizard && (
                <CreateConsoleRoleWizard
                    onClose={ () => {
                        setShowCreateConsoleRoleWizard(false);
                        mutateConsoleRolesFetchRequest();
                    } }
                />
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
ConsoleRolesList.defaultProps = {
    "data-componentid": "console-roles-list"
};

export default ConsoleRolesList;
