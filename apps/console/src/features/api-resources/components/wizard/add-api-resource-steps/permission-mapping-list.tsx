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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import {
    DataTable, EmptyPlaceholder, TableActionsInterface, TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Header, Label, SemanticICONS } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../core";
import { APIResourcePermissionInterface, PermissionMappingInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
type PermissionMappingListInterface = SBACInterface<FeatureConfigInterface> &
    IdentifiableComponentInterface & PermissionMappingInterface;

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const PermissionMappingList: FunctionComponent<PermissionMappingListInterface> = (
    props: PermissionMappingListInterface
): ReactElement => {

    const {
        addedPermissions,
        updatePermissions,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ permissionsList, setPermissionsList ] = useState<APIResourcePermissionInterface[]>(null);

    /**
     * Set the added permissions to the state.
     */
    useEffect(() => {
        setPermissionsList([ ...addedPermissions.values() ].reverse());
    }, [ addedPermissions ]);

    /**
     * Resolves data table actions.
     *
     * @returns `TableActionsInterface[]`
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, permission: APIResourcePermissionInterface): void => {
                    removeAddedPermission(permission);
                },
                popupText: (): string => t("apiResources:tabs.scopes.removeScopePopupText"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    /**
     * Resolves data table columns.
     * First column is the permission name and the second column is the description.
     *
     * @returns `TableColumnInterface[]`
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "displayName",
                id: "displayName",
                key: "displayName",
                render: (permission: APIResourcePermissionInterface): ReactNode => (
                    <Header as="h6" data-testid={ `${componentId}-permission-display-name` }>
                        <Header.Content>
                            { permission.displayName }
                            <Header.Subheader>
                                <Label size="medium" className="ml-0 mt-2">
                                    { permission.name }
                                </Label>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("apiResources:tabs.scopes.form.fields.permission.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "description",
                id: "description",
                key: "description",
                render: (permission: APIResourcePermissionInterface): ReactNode => (
                    <Header as="h6" data-testid={ `${componentId}-description` }>
                        <Header.Content>
                            <Header.Subheader>
                                { permission.description }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("apiResources:tabs.scopes.form.fields.description.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("apiResources:tabs.scopes.form.fields.permission.label"),
                width: 1
            }
        ];
    };

    /**
     * Empty placeholder for the permissions list.
     *
     * @returns `ReactElement`
     */
    const showPlaceholders = (): ReactElement => {
        if (permissionsList?.length === 0) {
            return (
                <>
                    <Divider className="mb-1" hidden />
                    <EmptyPlaceholder
                        subtitle={ [ t("apiResources:tabs.scopes.empty.title") ] }
                    />
                    <Divider className="mt-1" hidden />
                </>
            );
        }

        return null;
    };

    /**
     * Handles the remove permission action.
     *
     * @param permission - `APIResourcePermissionInterface`
     */
    const removeAddedPermission = (permission: APIResourcePermissionInterface): void => {
        updatePermissions(permission, "delete");
    };

    return (
        <DataTable<APIResourcePermissionInterface>
            className="oidc-scopes-table"
            columnCount={ 3 }
            loadingStateOptions={ {
                count: 10,
                imageType: "square"
            } }
            onRowClick={ ()=>null }
            showHeader={ false }
            placeholders={ showPlaceholders() }
            transparent={ permissionsList?.length === 0 }
            data-testid={ componentId }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ permissionsList }
        />
    );
};

/**
 * Default props for the component.
 */
PermissionMappingList.defaultProps = {
    "data-componentid": "permission-list-api-resource"
};
