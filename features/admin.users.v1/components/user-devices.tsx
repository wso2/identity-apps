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

import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { deleteDevice, updateDeviceName } from "@wso2is/admin.devices.v1/api/devices";
import useGetDevicesByUserId from "@wso2is/admin.devices.v1/hooks/use-get-devices-by-user-id";
import { DevicePatchRequestInterface, DeviceResponseInterface } from "@wso2is/admin.devices.v1/models/devices";
import { AlertLevels, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    DropdownProps,
    Header,
    Modal,
    PaginationProps,
    SemanticICONS
} from "semantic-ui-react";

const DEFAULT_LIMIT: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

interface UserDevicesPropsInterface extends IdentifiableComponentInterface {
    user: ProfileInfoInterface;
}

export const UserDevices: FunctionComponent<UserDevicesPropsInterface> = ({
    user,
    "data-componentid": componentId = "user-devices"
}: UserDevicesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const devicesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devices
    );
    const hasUpdatePermission: boolean = useRequiredScopes(devicesFeatureConfig?.scopes?.update);
    const hasDeletePermission: boolean = useRequiredScopes(devicesFeatureConfig?.scopes?.delete);

    const [ listItemLimit, setListItemLimit ] = useState<number>(DEFAULT_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ deletingDevice, setDeletingDevice ] = useState<DeviceResponseInterface | null>(null);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ renamingDevice, setRenamingDevice ] = useState<DeviceResponseInterface | null>(null);
    const [ newDeviceName, setNewDeviceName ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data,
        isLoading,
        error,
        mutate
    } = useGetDevicesByUserId(user?.id, listItemLimit, listOffset, !!user?.id);

    const devices: DeviceResponseInterface[] = data?.devices ?? [];
    const totalResults: number = data?.totalResults ?? 0;

    useEffect((): void => {
        if (!error) {
            return;
        }

        dispatch(addAlert({
            description: t("users:userDevices.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("users:userDevices.notifications.fetch.genericError.message")
        }));
    }, [ error, t, dispatch ]);

    const handlePaginationChange = (_e: MouseEvent<HTMLAnchorElement>, paginationData: PaginationProps): void => {
        setListOffset(((paginationData.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (_e: SyntheticEvent<HTMLElement>, dropdownData: DropdownProps): void => {
        setListItemLimit(dropdownData.value as number);
        setListOffset(0);
    };

    /**
     * Navigates to the detail view of the given device.
     *
     * @param device - The device to view.
     */
    const handleDeviceView = (device: DeviceResponseInterface): void => {
        history.push(AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id));
    };

    /**
     * Deletes the currently selected device and refreshes the list.
     */
    const handleDeviceDelete = (): void => {
        if (!deletingDevice) {
            return;
        }

        setIsSubmitting(true);

        deleteDevice(deletingDevice.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("users:userDevices.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("users:userDevices.notifications.delete.success.message")
                }));
                mutate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("users:userDevices.notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:userDevices.notifications.delete.genericError.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
                setShowDeleteConfirmationModal(false);
                setDeletingDevice(null);
            });
    };

    /**
     * Renames the currently selected device and refreshes the list.
     */
    const handleDeviceRename = (): void => {
        if (!renamingDevice) {
            return;
        }

        setIsSubmitting(true);

        const payload: DevicePatchRequestInterface = { deviceName: newDeviceName?.trim() };

        updateDeviceName(renamingDevice.id, payload)
            .then((): void => {
                dispatch(addAlert({
                    description: t("users:userDevices.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("users:userDevices.notifications.update.success.message")
                }));
                mutate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("users:userDevices.notifications.update.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:userDevices.notifications.update.genericError.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
                setRenamingDevice(null);
                setNewDeviceName("");
            });
    };

    const resolveStatusChip = (status: string): ReactElement => {
        const color: "success" | "warning" | "error" =
            status === "ACTIVE" ? "success" : status === "PENDING" ? "warning" : "error";

        return (
            <Chip
                label={ t(`users:userDevices.list.status.${ status?.toLowerCase() }`, { defaultValue: status }) }
                color={ color }
                size="small"
            />
        );
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
            title: t("users:userDevices.list.columns.deviceName")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            render: (device: DeviceResponseInterface): ReactNode => resolveStatusChip(device.status),
            title: t("users:userDevices.list.columns.status")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "registeredAt",
            id: "registeredAt",
            key: "registeredAt",
            render: (device: DeviceResponseInterface): ReactNode =>
                device.registeredAt ? new Date(device.registeredAt).toLocaleDateString() : "-",
            title: t("users:userDevices.list.columns.registeredAt")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("users:userDevices.list.columns.actions")
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${ componentId }-item-edit-button`,
            hidden: (): boolean => !hasUpdatePermission,
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                setRenamingDevice(device);
                setNewDeviceName(device.deviceName ?? "");
            },
            popupText: (): string => t("common:edit"),
            renderer: "semantic-icon"
        },
        {
            "data-componentid": `${ componentId }-item-delete-button`,
            hidden: (): boolean => !hasDeletePermission,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                setDeletingDevice(device);
                setShowDeleteConfirmationModal(true);
            },
            popupText: (): string => t("common:delete"),
            renderer: "semantic-icon"
        }
    ];

    if (isLoading && devices.length === 0) {
        return <ContentLoader />;
    }

    return (
        <>
            <ListLayout
                activePage={ Math.floor(listOffset / listItemLimit) + 1 }
                currentListSize={ devices.length }
                isLoading={ isLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ totalResults > 0 }
                showPaginationPageLimit={ true }
                showTopActionPanel={ false }
                totalListSize={ totalResults }
                totalPages={ Math.ceil(totalResults / listItemLimit) }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <DataTable<DeviceResponseInterface>
                    className="user-devices-table"
                    isLoading={ isLoading }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ devices }
                    placeholders={
                        <EmptyPlaceholder
                            className="list-placeholder mr-0"
                            image={ getEmptyPlaceholderIllustrations().newList }
                            imageSize="tiny"
                            subtitle={ [ t("users:userDevices.placeholders.empty.subtitles.0") ] }
                            title={ t("users:userDevices.placeholders.empty.title") }
                            data-componentid={ `${ componentId }-empty-placeholder` }
                        />
                    }
                    selectable={ true }
                    onRowClick={ (_e: SyntheticEvent, device: DeviceResponseInterface): void =>
                        handleDeviceView(device) }
                    showHeader={ true }
                    transparent={ !isLoading && devices.length === 0 }
                    data-componentid={ componentId }
                />
            </ListLayout>
            { showDeleteConfirmationModal && deletingDevice && (
                <ConfirmationModal
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("users:userDevices.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setDeletingDevice(null);
                    } }
                    onPrimaryActionClick={ handleDeviceDelete }
                    primaryActionLoading={ isSubmitting }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("users:userDevices.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("users:userDevices.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("users:userDevices.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { renamingDevice && (
                <Modal
                    open={ !!renamingDevice }
                    size="tiny"
                    onClose={ (): void => setRenamingDevice(null) }
                    data-componentid={ `${ componentId }-rename-modal` }
                >
                    <Modal.Header>{ t("users:userDevices.rename.heading") }</Modal.Header>
                    <Modal.Content>
                        <TextField
                            fullWidth
                            label={ t("users:userDevices.rename.nameLabel") }
                            value={ newDeviceName }
                            placeholder={ t("users:userDevices.rename.namePlaceholder") }
                            onChange={ (e: ChangeEvent<HTMLInputElement>): void =>
                                setNewDeviceName(e.target.value) }
                            data-componentid={ `${ componentId }-rename-input` }
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <LinkButton
                            onClick={ (): void => setRenamingDevice(null) }
                            data-componentid={ `${ componentId }-rename-cancel-button` }
                        >
                            { t("common:cancel") }
                        </LinkButton>
                        <PrimaryButton
                            onClick={ handleDeviceRename }
                            loading={ isSubmitting }
                            disabled={ isSubmitting || !newDeviceName?.trim() }
                            data-componentid={ `${ componentId }-rename-save-button` }
                        >
                            { t("common:save") }
                        </PrimaryButton>
                    </Modal.Actions>
                </Modal>
            ) }
        </>
    );
};
