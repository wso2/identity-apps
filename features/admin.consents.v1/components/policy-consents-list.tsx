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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
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
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Label, SemanticICONS } from "semantic-ui-react";

/**
 * Extends the base list item with UI-only fields for default policy synthesis.
 */
export interface PolicyConsentListItemInterface extends ConsentListItemInterface {
    displayName?: string;
    isDefault?: boolean;
    slug?: string;
}

/**
 * Props interface for the Policy Consents list component.
 */
interface PolicyConsentsListProps extends IdentifiableComponentInterface {
    /**
     * Advanced search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Whether branding is enabled for the tenant. When false, view/edit actions are hidden for default policies.
     */
    isBrandingEnabled?: boolean;
    /**
     * Is the list loading.
     */
    isLoading?: boolean;
    /**
     * Consent list.
     */
    list: PolicyConsentListItemInterface[];
    /**
     * Callback for when the add consent button is clicked.
     */
    onAddConsentClick: () => void;
    /**
     * Callback for when a consent is clicked for editing.
     */
    onEditConsentClick: (consent: PolicyConsentListItemInterface) => void;
    /**
     * Callback for when a consent is clicked for deletion.
     */
    onDeleteConsentClick: (consent: PolicyConsentListItemInterface) => void;
    /**
     * Callback to clear the active search query.
     */
    onSearchQueryClear?: () => void;
    /**
     * Active search query. When set and the list is empty, shows an empty search result placeholder.
     */
    searchQuery?: string;
}

/**
 * Policy Consents list component.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consents list component.
 */
export const PolicyConsentsList: FunctionComponent<PolicyConsentsListProps> = (
    props: PolicyConsentsListProps
): ReactElement => {
    const {
        advancedSearch,
        isBrandingEnabled = true,
        isLoading,
        list,
        onAddConsentClick,
        onEditConsentClick,
        onDeleteConsentClick,
        onSearchQueryClear,
        searchQuery,
        ["data-componentid"]: componentId
    } = props;

    type ListItem = PolicyConsentListItemInterface;

    const { t } = useTranslation();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const currentTenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const hasCreatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.create);
    const hasReadPermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.read);
    const hasUpdatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.update);
    const hasDeletePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.delete);

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const isCrossTenant = (item: ListItem): boolean =>
        !!item.tenantDomain && item.tenantDomain !== currentTenantDomain;

    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${componentId}-item-view-button`,
                hidden: (item: ListItem): boolean =>
                    !hasReadPermission || (hasUpdatePermission && (!item.isDefault || isBrandingEnabled)),
                icon: (): SemanticICONS => "eye",
                onClick: (_e: SyntheticEvent, consent: ListItem): void =>
                    onEditConsentClick(consent),
                popupText: (): string => t("common:view"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${componentId}-item-edit-button`,
                hidden: (item: ListItem): boolean =>
                    !hasUpdatePermission || (!!item.isDefault && !isBrandingEnabled),
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, consent: ListItem): void =>
                    onEditConsentClick(consent),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${componentId}-item-delete-button`,
                hidden: (item: ListItem): boolean =>
                    !hasDeletePermission || isCrossTenant(item) || !!item.isDefault,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, consent: ListItem): void =>
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
                render: (consent: ListItem): ReactNode => {
                    return (
                        <Box
                            alignItems="center"
                            display="flex"
                            data-componentid={ `${componentId}-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ consent.name }
                                        size="mini"
                                        data-componentid={ `${componentId}-item-display-name-avatar` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-componentid={ `${componentId}-item-display-name` }
                            />
                            <Typography variant="body1">
                                { consent.displayName ?? consent.name }
                            </Typography>
                            { isCrossTenant(consent) && (
                                <Label size="mini" className="ml-2">
                                    { t("consents:policyConsents.list.labels.sharedPolicy") }
                                </Label>
                            ) }
                            { consent.isDefault && (
                                <Label size="mini" className="ml-2">
                                    { t("consents:policyConsents.list.labels.defaultPolicy") }
                                </Label>
                            ) }
                            { consent.isDefault && !consent.id && (
                                <Label size="mini" className="ml-2">
                                    { t("consents:policyConsents.list.labels.notConfigured") }
                                </Label>
                            ) }
                        </Box>
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
            if (searchQuery) {
                return (
                    <EmptyPlaceholder
                        action={ (
                            <LinkButton
                                data-componentid={ `${componentId}-empty-search-placeholder-clear-button` }
                                onClick={ onSearchQueryClear }
                            >
                                { t("consents:policyConsents.list.emptySearchPlaceholder.action") }
                            </LinkButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().emptySearch }
                        imageSize="tiny"
                        title={ t("consents:policyConsents.list.emptySearchPlaceholder.title") }
                        subtitle={ [
                            t("consents:policyConsents.list.emptySearchPlaceholder.subtitle")
                        ] }
                        data-componentid={ `${componentId}-empty-search-placeholder` }
                    />
                );
            }

            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={ hasCreatePermission && (
                        <PrimaryButton
                            data-componentid={ `${componentId}-empty-placeholder-add-policy-button` }
                            onClick={ onAddConsentClick }
                        >
                            <PlusIcon />
                            { t("consents:policyConsents.list.emptyPlaceholder.addPolicy") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("consents:policyConsents.list.emptyPlaceholder.subtitle")
                    ] }
                    data-componentid={ `${componentId}-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <DataTable<ListItem>
            className="consents-table"
            externalSearch={ advancedSearch }
            isLoading={ isLoading }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ list }
            onRowClick={ (_e: SyntheticEvent, consent: ListItem): void => {
                if (consent.isDefault && !consent.id) {
                    onEditConsentClick(consent);

                    return;
                }
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
            data-componentid={ componentId }
        />
    );
};
