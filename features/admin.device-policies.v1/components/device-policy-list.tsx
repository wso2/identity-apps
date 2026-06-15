/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, SemanticICONS } from "semantic-ui-react";
import { deleteDevicePolicy } from "../api/device-policies";
import { PolicyListItemInterface } from "../models/device-policy";

interface DevicePolicyListPropsInterface extends IdentifiableComponentInterface {
    isLoading: boolean;
    list: PolicyListItemInterface[];
    onPolicyDelete: () => void;
    onSearchQueryClear?: () => void;
    searchQuery?: string;
}

const DevicePolicyList: FunctionComponent<DevicePolicyListPropsInterface> = (
    props: DevicePolicyListPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "device-policy-list",
        isLoading,
        list,
        onPolicyDelete,
        onSearchQueryClear,
        searchQuery
    } = props;

    const dispatch: ReturnType<typeof useDispatch> = useDispatch();
    const { t } = useTranslation();

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ deletingPolicy, setDeletingPolicy ] = useState<PolicyListItemInterface | null>(null);

    const handleRowClick = (_e: SyntheticEvent, policy: PolicyListItemInterface): void => {
        history.push(AppConstants.getPaths().get("DEVICE_POLICY_EDIT").replace(":id", policy.id));
    };

    const handleDeleteConfirm = (): void => {
        deleteDevicePolicy(deletingPolicy.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("devices:assurancePolicies.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devices:assurancePolicies.notifications.delete.success.message")
                }));
                onPolicyDelete();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("devices:assurancePolicies.notifications.delete.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("devices:assurancePolicies.notifications.delete.error.message")
                }));
            })
            .finally((): void => {
                setShowDeleteConfirmation(false);
                setDeletingPolicy(null);
            });
    };

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "name",
            id: "name",
            key: "name",
            render: (policy: PolicyListItemInterface): ReactNode => (
                <Header
                    image
                    as="h6"
                    className="header-with-icon"
                    data-componentid={ `${ componentId }-item-heading` }
                >
                    <AppAvatar
                        image={ (
                            <AnimatedAvatar
                                name={ policy.name }
                                size="mini"
                                data-componentid={ `${ componentId }-item-avatar` }
                            />
                        ) }
                        size="mini"
                        spaced="right"
                        data-componentid={ `${ componentId }-item-image` }
                    />
                    <Header.Content>
                        { policy.name }
                    </Header.Content>
                </Header>
            ),
            title: t("devices:assurancePolicies.list.columns.name")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("devices:assurancePolicies.list.columns.actions")
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${ componentId }-item-delete-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_e: SyntheticEvent, policy: PolicyListItemInterface): void => {
                setDeletingPolicy(policy);
                setShowDeleteConfirmation(true);
            },
            popupText: (): string => t("common:delete"),
            renderer: "semantic-icon"
        }
    ];

    const renderPlaceholder = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("devices:assurancePolicies.advancedSearch.emptyResults.clearButton") }
                        </LinkButton>
                    ) }
                    className="list-placeholder mr-0"
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    subtitle={ [
                        t("devices:assurancePolicies.advancedSearch.emptyResults.subtitles.0",
                            { query: searchQuery }),
                        t("devices:assurancePolicies.advancedSearch.emptyResults.subtitles.1")
                    ] }
                    title={ t("devices:assurancePolicies.advancedSearch.emptyResults.title") }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        return (
            <EmptyPlaceholder
                className="list-placeholder mr-0"
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                subtitle={ [ t("devices:assurancePolicies.placeholders.empty.subtitles.0") ] }
                title={ t("devices:assurancePolicies.placeholders.empty.title") }
                data-componentid={ `${ componentId }-empty-placeholder` }
            />
        );
    };

    return (
        <>
            <DataTable<PolicyListItemInterface>
                className="device-policies-table"
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ handleRowClick }
                placeholders={ renderPlaceholder() }
                selectable={ true }
                showHeader={ true }
                transparent={ !isLoading && (!list || list.length === 0) }
                data-componentid={ componentId }
            />

            { showDeleteConfirmation && (
                <ConfirmationModal
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmation(false) }
                    type="negative"
                    open={ showDeleteConfirmation }
                    assertionHint={ t("devices:assurancePolicies.list.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmation(false) }
                    onPrimaryActionClick={ handleDeleteConfirm }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("devices:assurancePolicies.list.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("devices:assurancePolicies.list.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("devices:assurancePolicies.list.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default DevicePolicyList;
