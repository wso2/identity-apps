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

import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, SemanticICONS } from "semantic-ui-react";
import deleteDevicePolicy from "../api/delete-device-policy";
import { DevicePolicyListItemInterface } from "../models/device-policy";

/**
 * Props interface of {@link DevicePolicyList}
 */
interface DevicePolicyListPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the list is loading.
     */
    isLoading: boolean;
    /**
     * Device policies to show.
     */
    list: DevicePolicyListItemInterface[];
    /**
     * Callback to add a policy. The empty list offers no add action when not given.
     */
    onPolicyAdd?: () => void;
    /**
     * Callback to run after a policy is deleted.
     */
    onPolicyDelete: () => void;
    /**
     * Callback to clear the search query.
     */
    onSearchQueryClear: () => void;
    /**
     * Current search query.
     */
    searchQuery?: string;
}

/**
 * List of device assurance policies.
 *
 * @param props - Props injected to the component.
 * @returns Device policy list component.
 */
const DevicePolicyList: FunctionComponent<DevicePolicyListPropsInterface> = ({
    isLoading,
    list,
    onPolicyAdd,
    onPolicyDelete,
    onSearchQueryClear,
    searchQuery,
    "data-componentid": componentId = "device-policy-list"
}: DevicePolicyListPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const devicePoliciesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devicePolicies
    );
    const hasDeletePermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.delete);

    const [ deletingPolicy, setDeletingPolicy ] = useState<DevicePolicyListItemInterface | undefined>(undefined);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const handleDelete = (): void => {
        if (!deletingPolicy) {
            return;
        }

        setIsDeleting(true);

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
                    description: t("devices:assurancePolicies.notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devices:assurancePolicies.notifications.delete.genericError.message")
                }));
            })
            .finally((): void => {
                setIsDeleting(false);
                setDeletingPolicy(undefined);
            });
    };

    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (policy: DevicePolicyListItemInterface): ReactNode => (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={ 1.5 }
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
                        <Typography variant="body1" data-componentid={ `${ componentId }-item-name` }>
                            { policy.name }
                        </Typography>
                    </Stack>
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
    };

    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: (): boolean => !hasDeletePermission,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_event: SyntheticEvent, policy: DevicePolicyListItemInterface): void => {
                    setDeletingPolicy(policy);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    const showPlaceholders = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton
                            onClick={ onSearchQueryClear }
                            data-componentid={ `${ componentId }-clear-search-button` }
                        >
                            { t("devices:assurancePolicies.advancedSearch.emptyResults.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("devices:assurancePolicies.advancedSearch.emptyResults.title") }
                    subtitle={ [
                        t("devices:assurancePolicies.advancedSearch.emptyResults.subtitles.0",
                            { query: searchQuery }),
                        t("devices:assurancePolicies.advancedSearch.emptyResults.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        return (
            <EmptyPlaceholder
                action={ onPolicyAdd && (
                    <PrimaryButton onClick={ onPolicyAdd } data-componentid={ `${ componentId }-add-button` }>
                        <Icon name="add" />
                        { t("devices:assurancePolicies.buttons.add") }
                    </PrimaryButton>
                ) }
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                title={ t("devices:assurancePolicies.placeholders.empty.title") }
                subtitle={ [ t("devices:assurancePolicies.placeholders.empty.subtitles.0") ] }
                data-componentid={ `${ componentId }-empty-placeholder` }
            />
        );
    };

    return (
        <>
            <DataTable<DevicePolicyListItemInterface>
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (_event: SyntheticEvent, policy: DevicePolicyListItemInterface): void => {
                    history.push(AppConstants.getPaths().get("DEVICE_POLICY_EDIT").replace(":id", policy.id));
                } }
                placeholders={ showPlaceholders() }
                selectable={ true }
                showHeader={ true }
                transparent={ !isLoading && list?.length === 0 }
                data-componentid={ componentId }
            />
            { deletingPolicy && (
                <ConfirmationModal
                    open={ !!deletingPolicy }
                    type="negative"
                    assertionHint={ t("devices:assurancePolicies.list.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    primaryActionLoading={ isDeleting }
                    onClose={ (): void => setDeletingPolicy(undefined) }
                    onSecondaryActionClick={ (): void => setDeletingPolicy(undefined) }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                    >
                        { t("devices:assurancePolicies.list.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                    >
                        { t("devices:assurancePolicies.list.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
                    >
                        { t("devices:assurancePolicies.list.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default DevicePolicyList;
