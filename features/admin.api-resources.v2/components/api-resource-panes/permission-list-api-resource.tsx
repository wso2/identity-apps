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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import {
    DataTable, EmptyPlaceholder, LinkButton, PrimaryButton, TableActionsInterface, TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { FeatureConfigInterface, getEmptyPlaceholderIllustrations } from "../../../admin.core.v1";
import { APIResourcePanesCommonPropsInterface, APIResourcePermissionInterface } from "../../models";

/**
 * Prop-types for the API resources page component.
 */
interface PermissionListAPIResourceInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface, APIResourcePanesCommonPropsInterface {
    /**
     * List of API resource permissions
     */
    permissionList: APIResourcePermissionInterface[];
    /**
     * Search results for API resources permissions
     */
    serachedPermissionList: APIResourcePermissionInterface[]
    /**
     * Clear the search query.
     */
    clearSearchPermission: () => void;
    /**
     * Set the permission to be removed.
     */
    setRemovePermission: (permission: APIResourcePermissionInterface) => void;
    /**
     * Open add permission modal.
     */
    setTriggerAddAPIResourcePermissionModal: () => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const PermissionListAPIResource: FunctionComponent<PermissionListAPIResourceInterface> = (
    props: PermissionListAPIResourceInterface
): ReactElement => {

    const {
        permissionList,
        serachedPermissionList,
        isAPIResourceDataLoading,
        isSubmitting,
        isReadOnly,
        clearSearchPermission,
        setRemovePermission,
        setTriggerAddAPIResourcePermissionModal,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ clickedPermission, setClickedPermission ] = useState<APIResourcePermissionInterface>(undefined);

    /**
     * Resolves data table actions.
     *
     * @returns `TableActionsInterface[]`
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": `${componentId}-item-copy-button`,
                icon: (): SemanticICONS => "copy",
                onClick: (e: SyntheticEvent, permission: APIResourcePermissionInterface): void => {
                    copyValueToClipboard(e, permission);
                },
                popupText: (permission: APIResourcePermissionInterface): string => {
                    return clickedPermission?.name === permission.name
                        ? t("apiResources:tabs.scopes.copiedPopupText")
                        : t("apiResources:tabs.scopes.copyPopupText");
                },
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${componentId}-item-delete-button`,
                hidden: () => isReadOnly,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, permission: APIResourcePermissionInterface): void => {
                    removePermission(permission);
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
                                    <Label.Detail className="ml-0">{ permission.name }</Label.Detail>
                                </Label>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("extensions:develop.apiResource.tabs.permissions.form.fields.permission.label"),
                width: 3
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
                title: t("extensions:develop.apiResource.tabs.permissions.form.fields.permission.label")
            }
        ];
    };

    /**
     * Empty placeholder for the API resource permissions list.
     *
     * @returns `ReactElement`
     */
    const showPlaceholders = (): ReactElement => {
        if (permissionList?.length === 0) {
            return (
                <EmptyPlaceholder
                    subtitle = { [ t("apiResources:tabs.scopes.empty.subTitle") ] }
                    title={ t("apiResources:tabs.scopes.empty.title") }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    action={
                        (
                            <PrimaryButton
                                data-componentid= { `${componentId}-add-permission-button` }
                                onClick={ setTriggerAddAPIResourcePermissionModal }>
                                <Icon name="add" />
                                { t("apiResources:tabs.scopes.button") }
                            </PrimaryButton>
                        )
                    }
                    imageSize="tiny"
                />
            );
        }
        if (serachedPermissionList?.length === 0) {
            return (
                <EmptyPlaceholder
                    subtitle={ [ t("apiResources:tabs.scopes.emptySearch.subTitle.0"),
                        t("apiResources:tabs.scopes.emptySearch.subTitle.1") ] }
                    title={ t("apiResources:tabs.scopes.emptySearch.title") }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={
                        (<LinkButton onClick={ clearSearchPermission }>
                            { t("apiResources:tabs.scopes.emptySearch.viewAll") }
                        </LinkButton>)
                    }
                    imageSize="tiny"
                />
            );
        }

        return null;
    };

    /**
     * Handels the remove permission action.
     *
     * @param permission - `APIResourcePermissionInterface`
     */
    const removePermission = (permission: APIResourcePermissionInterface): void => {
        setRemovePermission(permission);
    };

    /**
     * Copies the value to the users clipboard.
     *
     * @param event - `MouseEvent<HTMLButtonElement>`
     * @param permission - `APIResourcePermissionInterface`
     */
    const copyValueToClipboard = async (event: SyntheticEvent, permission: APIResourcePermissionInterface) => {
        event.stopPropagation();
        await CommonUtils.copyTextToClipboard(permission.name);

        // Set the clicked permission.
        setClickedPermission(permission);
    };

    return (
        <DataTable<APIResourcePermissionInterface>
            className="oidc-scopes-table"
            columnCount={ 3 }
            isLoading={ isAPIResourceDataLoading || isSubmitting }
            loadingStateOptions={ {
                count: 10,
                imageType: "square"
            } }
            onRowClick={ copyValueToClipboard }
            showHeader={ false }
            placeholders={ showPlaceholders() }
            transparent={ permissionList?.length === 0 || serachedPermissionList?.length === 0 }
            data-testid={ componentId }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ serachedPermissionList }
        />
    );
};

/**
 * Default props for the component.
 */
PermissionListAPIResource.defaultProps = {
    "data-componentid": "permission-list-api-resource"
};
