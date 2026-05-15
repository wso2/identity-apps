/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ConsentListItemInterface } from "@wso2is/common.consents.v1";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";

/**
 * Props interface for the Policy Consents list component.
 */
interface PolicyConsentsListProps extends IdentifiableComponentInterface {
    /**
     * Advanced search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Is the list loading.
     */
    isLoading?: boolean;
    /**
     * Consent list.
     */
    list: ConsentListItemInterface[];
    /**
     * Callback for when the add consent button is clicked.
     */
    onAddConsentClick: () => void;
    /**
     * Callback for when a consent is clicked for editing.
     */
    onEditConsentClick: (consent: ConsentListItemInterface) => void;
    /**
     * Callback for when a consent is clicked for deletion.
     */
    onDeleteConsentClick: (consent: ConsentListItemInterface) => void;
}

/**
 * Policy Consents list component.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consents list component.
 */
export const PolicyConsentsList = (props: PolicyConsentsListProps): ReactElement => {
    const {
        advancedSearch,
        isLoading,
        list,
        onAddConsentClick,
        onEditConsentClick,
        onDeleteConsentClick,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const hasCreatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.create);
    const hasReadPermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.read);
    const hasUpdatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.update);
    const hasDeletePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.delete);

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-testid": `${componentId}-item-view-button`,
                hidden: (): boolean => hasUpdatePermission || !hasReadPermission,
                icon: (): SemanticICONS => "eye",
                onClick: (_e: SyntheticEvent, consent: ConsentListItemInterface): void =>
                    onEditConsentClick(consent),
                popupText: (): string => t("common:view"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${componentId}-item-edit-button`,
                hidden: (): boolean => !hasUpdatePermission,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, consent: ConsentListItemInterface): void =>
                    onEditConsentClick(consent),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${componentId}-item-delete-button`,
                hidden: (): boolean => !hasDeletePermission,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, consent: ConsentListItemInterface): void =>
                    onDeleteConsentClick(consent),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (consent: ConsentListItemInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${componentId}-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ consent.name }
                                        size="mini"
                                        data-testid={ `${componentId}-item-display-name-avatar` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-item-display-name` }
                            />

                            <Header.Content>
                                { consent.name }
                            </Header.Content>
                        </Header>
                    );
                },
                title: null
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement | null => {
        if (!list || list?.length === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={ hasCreatePermission && (
                        <PrimaryButton
                            data-testid={ `${componentId}-empty-placeholder-add-policy-button` }
                            onClick={ onAddConsentClick }
                        >
                            <Icon name="add" />
                            { t("consents:list.emptyPlaceholder.addPolicy") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("consents:list.emptyPlaceholder.subtitle")
                    ] }
                    data-testid={ `${componentId}-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <DataTable<ConsentListItemInterface>
            className="consents-table"
            externalSearch={ advancedSearch }
            isLoading={ isLoading }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ list }
            onRowClick={ (_e: SyntheticEvent, consent: ConsentListItemInterface): void => {
                if (consent.id !== null) {
                    onEditConsentClick(consent);
                }
            } }
            placeholders={ showPlaceholders() }
            selectable={ true }
            showHeader={ false }
            transparent={
                !(isLoading)
                && (showPlaceholders() !== null)
            }
            data-testid={ componentId }
        />
    );
};
