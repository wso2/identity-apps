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
import Chip from "@oxygen-ui/react/Chip";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
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
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
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
import { DropdownProps, PaginationProps, SemanticICONS } from "semantic-ui-react";
import deleteDevice from "../api/delete-device";
import updateDevice from "../api/update-device";
import useGetUserDevices from "../api/use-get-user-devices";
import { DEVICE_NAME_MAX_LENGTH } from "../constants/device-constants";
import { DeviceInterface } from "../models/devices";

dayjs.extend(localizedFormat);

/**
 * Props interface of {@link UserDevices}
 */
interface UserDevicesPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the user whose devices are shown.
     */
    userId: string;
}

/**
 * Devices a user has registered.
 *
 * @param props - Props injected to the component.
 * @returns User devices component.
 */
const UserDevices: FunctionComponent<UserDevicesPropsInterface> = ({
    userId,
    "data-componentid": componentId = "user-devices"
}: UserDevicesPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const devicesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devices
    );
    const hasUpdatePermission: boolean = useRequiredScopes(devicesFeatureConfig?.scopes?.update);
    const hasDeletePermission: boolean = useRequiredScopes(devicesFeatureConfig?.scopes?.delete);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ deletingDevice, setDeletingDevice ] = useState<DeviceInterface | undefined>(undefined);
    const [ renamingDevice, setRenamingDevice ] = useState<DeviceInterface | undefined>(undefined);
    const [ deviceName, setDeviceName ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: deviceList,
        error: deviceListFetchError,
        isLoading: isDeviceListLoading,
        mutate: mutateDeviceList
    } = useGetUserDevices(userId, listItemLimit, listOffset);

    const devices: DeviceInterface[] = deviceList?.devices ?? [];
    const totalResults: number = deviceList?.totalResults ?? 0;

    useEffect(() => {
        if (!deviceListFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:userDevices.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:userDevices.notifications.fetch.genericError.message")
        }));
    }, [ deviceListFetchError ]);

    const handlePaginationChange = (_event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (_event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        setListOffset(0);
    };

    const handleRenameOpen = (device: DeviceInterface): void => {
        setRenamingDevice(device);
        setDeviceName(device.deviceName ?? "");
    };

    const handleRenameClose = (): void => {
        if (isSubmitting) {
            return;
        }

        setRenamingDevice(undefined);
    };

    const handleRename = (): void => {
        if (!renamingDevice) {
            return;
        }

        setIsSubmitting(true);

        updateDevice(renamingDevice.id, { deviceName: deviceName.trim() })
            .then((): void => {
                dispatch(addAlert({
                    description: t("devices:userDevices.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devices:userDevices.notifications.update.success.message")
                }));
                setRenamingDevice(undefined);
                mutateDeviceList();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("devices:userDevices.notifications.update.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devices:userDevices.notifications.update.genericError.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    const handleDelete = (): void => {
        if (!deletingDevice) {
            return;
        }

        setIsSubmitting(true);

        deleteDevice(deletingDevice.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("devices:userDevices.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devices:userDevices.notifications.delete.success.message")
                }));

                // Step back a page when the last device on the current page is deleted.
                if (devices.length === 1 && listOffset > 0) {
                    setListOffset(Math.max(0, listOffset - listItemLimit));

                    return;
                }

                mutateDeviceList();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("devices:userDevices.notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devices:userDevices.notifications.delete.genericError.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
                setDeletingDevice(undefined);
            });
    };

    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "deviceName",
                id: "deviceName",
                key: "deviceName",
                render: (device: DeviceInterface): ReactNode => (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={ 1.5 }
                        data-componentid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ device.deviceName }
                                    size="mini"
                                    data-componentid={ `${ componentId }-item-avatar` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-componentid={ `${ componentId }-item-image` }
                        />
                        <div>
                            <Typography variant="body1" data-componentid={ `${ componentId }-item-name` }>
                                { device.deviceName }
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                data-componentid={ `${ componentId }-item-model` }
                            >
                                { device.deviceModel }
                            </Typography>
                        </div>
                    </Stack>
                ),
                title: t("devices:userDevices.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (device: DeviceInterface): ReactNode => (
                    <Chip
                        size="small"
                        color={ device.status === "ACTIVE" ? "success" : "default" }
                        sx={ { height: "auto", paddingY: 0.25 } }
                        label={ (
                            <Typography variant="body2" component="span" color="inherit">
                                { t(`devices:userDevices.list.status.${ device.status }`, {
                                    defaultValue: device.status
                                }) }
                            </Typography>
                        ) }
                        data-componentid={ `${ componentId }-item-status` }
                    />
                ),
                title: t("devices:userDevices.list.columns.status")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "registeredAt",
                id: "registeredAt",
                key: "registeredAt",
                render: (device: DeviceInterface): ReactNode => (
                    <Typography variant="body2" data-componentid={ `${ componentId }-item-registered-at` }>
                        { device.registeredAt ? dayjs(device.registeredAt).format("lll") : "-" }
                    </Typography>
                ),
                title: t("devices:userDevices.list.columns.registeredAt")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("devices:userDevices.list.columns.actions")
            }
        ];
    };

    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ componentId }-item-rename-button`,
                hidden: (): boolean => !hasUpdatePermission,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_event: SyntheticEvent, device: DeviceInterface): void => handleRenameOpen(device),
                popupText: (): string => t("devices:userDevices.list.actions.rename"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: (): boolean => !hasDeletePermission,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_event: SyntheticEvent, device: DeviceInterface): void => setDeletingDevice(device),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    const trimmedDeviceName: string = deviceName.trim();

    return (
        <>
            <ListLayout
                currentListSize={ devices.length }
                isLoading={ isDeviceListLoading }
                listItemLimit={ listItemLimit }
                activePage={ Math.floor(listOffset / listItemLimit) + 1 }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ false }
                totalPages={ Math.ceil(totalResults / listItemLimit) }
                totalListSize={ totalResults }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <Box sx={ { "& .ui.table.data-table .data-table-header th": { paddingX: 1.375 } } }>
                    <DataTable<DeviceInterface>
                        isLoading={ isDeviceListLoading }
                        actions={ resolveTableActions() }
                        columns={ resolveTableColumns() }
                        data={ devices }
                        onRowClick={ (): null => null }
                        placeholders={ (
                            <EmptyPlaceholder
                                image={ getEmptyPlaceholderIllustrations().newList }
                                imageSize="tiny"
                                title={ t("devices:userDevices.placeholders.empty.title") }
                                subtitle={ [ t("devices:userDevices.placeholders.empty.subtitles.0") ] }
                                data-componentid={ `${ componentId }-empty-placeholder` }
                            />
                        ) }
                        selectable={ false }
                        showHeader={ true }
                        transparent={ !isDeviceListLoading && devices.length === 0 }
                        data-componentid={ componentId }
                    />
                </Box>
            </ListLayout>
            { deletingDevice && (
                <ConfirmationModal
                    open={ !!deletingDevice }
                    type="negative"
                    assertionHint={ t("devices:userDevices.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    primaryActionLoading={ isSubmitting }
                    onClose={ (): void => setDeletingDevice(undefined) }
                    onSecondaryActionClick={ (): void => setDeletingDevice(undefined) }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                    >
                        { t("devices:userDevices.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                    >
                        { t("devices:userDevices.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
                    >
                        { t("devices:userDevices.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { renamingDevice && (
                <Dialog
                    open={ true }
                    fullWidth
                    maxWidth="xs"
                    onClose={ handleRenameClose }
                    data-componentid={ `${ componentId }-rename-dialog` }
                >
                    <DialogTitle>{ t("devices:userDevices.rename.heading") }</DialogTitle>
                    <DialogContent dividers sx={ { paddingY: 2 } }>
                        <TextField
                            fullWidth
                            required
                            autoFocus
                            label={ t("devices:userDevices.rename.name.label") }
                            placeholder={ t("devices:userDevices.rename.name.placeholder") }
                            value={ deviceName }
                            inputProps={ { maxLength: DEVICE_NAME_MAX_LENGTH } }
                            onChange={ (event: ChangeEvent<HTMLInputElement>): void =>
                                setDeviceName(event.target.value) }
                            data-componentid={ `${ componentId }-rename-name` }
                        />
                    </DialogContent>
                    <DialogActions sx={ { paddingX: 2, paddingY: 1.5 } }>
                        <LinkButton
                            disabled={ isSubmitting }
                            onClick={ handleRenameClose }
                            data-componentid={ `${ componentId }-rename-cancel-button` }
                        >
                            { t("common:cancel") }
                        </LinkButton>
                        <PrimaryButton
                            loading={ isSubmitting }
                            disabled={ isSubmitting || !trimmedDeviceName
                                || trimmedDeviceName === renamingDevice.deviceName }
                            onClick={ handleRename }
                            data-componentid={ `${ componentId }-rename-save-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </DialogActions>
                </Dialog>
            ) }
        </>
    );
};

export default UserDevices;
