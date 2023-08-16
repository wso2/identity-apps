/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import {
    DataTable, EmptyPlaceholder, TableActionsInterface, TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Header, Label, SemanticICONS } from "semantic-ui-react";
import { ExtendedFeatureConfigInterface } from "../../../../../configs/models";
import { APIResourcePermissionInterface, PermissionMappingInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
type PermissionMappingListInterface = SBACInterface<ExtendedFeatureConfigInterface> &
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
                    removeAdddedPermission(permission);
                },
                popupText: (): string => t("extensions:develop.apiResource.tabs.permissions.removePermissionPopupText"),
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
                title: t("extensions:develop.apiResource.tabs.permissions.form.fields.permission.label")
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
                title: t("extensions:develop.apiResource.tabs.permissions.form.fields.description.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("extensions:develop.apiResource.tabs.permissions.form.fields.permission.label"),
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
                    <Divider className="mb-1"r hidden />
                    <EmptyPlaceholder
                        subtitle={ [  t("extensions:develop.apiResource.tabs.permissions.empty.title") ] }
                    />
                    <Divider className="mt-1" hidden />
                </>
            );
        }
        
        return null;
    };

    /**
     * Handels the remove permission action.
     *
     * @param permission - `APIResourcePermissionInterface`
     */
    const removeAdddedPermission = (permission: APIResourcePermissionInterface): void => {
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
