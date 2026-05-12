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
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, SemanticICONS } from "semantic-ui-react";
import { deleteDevice } from "../api/devices";
import { DeviceResponseInterface } from "../models/devices";

interface DeviceListPropsInterface extends IdentifiableComponentInterface {
    isLoading: boolean;
    list: DeviceResponseInterface[];
    onDeviceDelete: () => void;
    searchQuery?: string;
    onSearchQueryClear?: () => void;
}

const DeviceList: FunctionComponent<DeviceListPropsInterface> = (
    props: DeviceListPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "device-list",
        isLoading,
        list,
        onDeviceDelete,
        onSearchQueryClear,
        searchQuery
    } = props;

    const dispatch: ReturnType<typeof useDispatch> = useDispatch();
    const { t } = useTranslation();

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ deletingDevice, setDeletingDevice ] = useState<DeviceResponseInterface | null>(null);

    const handleRowClick = (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
        history.push(
            AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id)
        );
    };

    const handleDeleteConfirm = (): void => {
        deleteDevice(deletingDevice.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("devices:notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devices:notifications.delete.success.message")
                }));
                onDeviceDelete();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("devices:notifications.delete.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("devices:notifications.delete.error.message")
                }));
            })
            .finally((): void => {
                setShowDeleteConfirmation(false);
                setDeletingDevice(null);
            });
    };

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "deviceName",
            id: "deviceName",
            key: "deviceName",
            render: (device: DeviceResponseInterface): ReactNode => (
                <Header
                    image
                    as="h6"
                    className="header-with-icon"
                    data-componentid={ `${ componentId }-item-heading` }
                >
                    <AppAvatar
                        image={ (
                            <AnimatedAvatar
                                name={ device.deviceName ?? "Device" }
                                size="mini"
                                data-componentid={ `${ componentId }-item-avatar` }
                            />
                        ) }
                        size="mini"
                        spaced="right"
                        data-componentid={ `${ componentId }-item-image` }
                    />
                    <Header.Content>
                        { device.deviceName }
                        <Header.Subheader>{ device.deviceModel }</Header.Subheader>
                    </Header.Content>
                </Header>
            ),
            title: t("devices:list.columns.deviceName")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "userId",
            id: "userId",
            key: "userId",
            render: (device: DeviceResponseInterface): ReactNode =>
                device.userName
                    ? getUserNameWithoutDomain(device.userName)
                    : device.userId,
            title: t("devices:list.columns.user")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            render: (device: DeviceResponseInterface): ReactNode => device.status,
            title: t("devices:list.columns.status")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "registeredAt",
            id: "registeredAt",
            key: "registeredAt",
            render: (device: DeviceResponseInterface): ReactNode =>
                device.registeredAt ? new Date(device.registeredAt).toLocaleDateString() : "-",
            title: t("devices:list.columns.registeredAt")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("devices:list.columns.actions")
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${ componentId }-item-delete-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                setDeletingDevice(device);
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
                            { t("devices:placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("devices:placeholders.emptySearch.title") }
                    subtitle={ [
                        <Trans
                            key="0"
                            i18nKey="devices:placeholders.emptySearch.subtitles.0"
                            values={ { searchQuery } }
                        >
                            We could not find any results for <strong>{ searchQuery }</strong>.
                        </Trans>,
                        t("devices:placeholders.emptySearch.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        return (
            <EmptyPlaceholder
                className="list-placeholder mr-0"
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                subtitle={ [ t("devices:placeholders.empty.subtitles.0") ] }
                title={ t("devices:placeholders.empty.title") }
                data-componentid={ `${ componentId }-empty-placeholder` }
            />
        );
    };

    return (
        <>
            <DataTable<DeviceResponseInterface>
                className="devices-table"
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                placeholders={ renderPlaceholder() }
                selectable={ true }
                onRowClick={ handleRowClick }
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
                    assertionHint={ t("devices:list.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmation(false) }
                    onPrimaryActionClick={ handleDeleteConfirm }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("devices:list.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("devices:list.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("devices:list.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default DeviceList;
