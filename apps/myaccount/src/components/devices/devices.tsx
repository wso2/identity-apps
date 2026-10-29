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

import { Theme, alpha } from "@mui/material/styles";
import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Divider from "@oxygen-ui/react/Divider";
import IconButton from "@oxygen-ui/react/IconButton";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemAvatar from "@oxygen-ui/react/ListItemAvatar";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Menu from "@oxygen-ui/react/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { EllipsisVerticalIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal } from "@wso2is/react-components";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { Fragment, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { RenameDeviceDialog } from "./rename-device-dialog";
import { deleteDevice, updateDevice } from "../../api/devices";
import useGetDevices from "../../hooks/use-get-devices";
import { RequestErrorInterface } from "../../hooks/use-request";
import {
    AlertInterface,
    AlertLevels,
    DeviceInterface,
    DeviceListResponseInterface,
    DevicePatchRequestInterface,
    DeviceStatus
} from "../../models";
import { SettingsSection } from "../shared";

dayjs.extend(LocalizedFormat);

const DEVICES_PAGE_SIZE: number = 10;

/**
 * Icons for the kinds of device, matched against the device model and name. Same icons as active sessions.
 */
const DEVICE_TYPE_ICONS: { icon: SemanticICONS; pattern: RegExp }[] = [
    { icon: "tablet alternate", pattern: /ipad|tablet|\btab\b|surface/i },
    { icon: "laptop", pattern: /macbook|laptop|thinkpad|xps|notebook|chromebook|zenbook|latitude/i },
    { icon: "computer", pattern: /desktop|imac|\bpc\b|workstation|mac mini|mac pro/i },
    { icon: "mobile alternate", pattern: /iphone|pixel|galaxy|phone|oneplus|android|xiaomi|redmi|huawei|nokia/i }
];

/**
 * Error code returned by the devices API when device management is disabled on the server.
 */
const DEVICE_MANAGEMENT_DISABLED_ERROR_CODE: string = "DM-60002";

type DeviceNotificationKey = "activateDevice" | "deactivateDevice" | "deleteDevice" | "fetchDevices" | "renameDevice";

interface DevicesComponentPropsInterface extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * Called when the server reports that device management is disabled, so the parent can drop the section.
     */
    onFeatureDisabled?: () => void;
}

/**
 * Lists the devices registered to the authenticated user and lets them rename,
 * activate, deactivate and delete those devices.
 *
 * @param props - Props injected to the component.
 * @returns Devices component.
 */
export const DevicesComponent: FunctionComponent<DevicesComponentPropsInterface> = (
    props: DevicesComponentPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        onFeatureDisabled,
        ["data-componentid"]: componentId = "devices"
    } = props;

    const { t } = useTranslation();

    const [ offset, setOffset ] = useState<number>(0);
    const [ actionsMenuAnchor, setActionsMenuAnchor ] = useState<HTMLElement | null>(null);
    const [ actionsMenuDevice, setActionsMenuDevice ] = useState<DeviceInterface | null>(null);
    const [ deviceToRename, setDeviceToRename ] = useState<DeviceInterface | null>(null);
    const [ deviceToDeactivate, setDeviceToDeactivate ] = useState<DeviceInterface | null>(null);
    const [ deviceToDelete, setDeviceToDelete ] = useState<DeviceInterface | null>(null);
    const [ isRequestInProgress, setIsRequestInProgress ] = useState<boolean>(false);

    const {
        data: deviceList,
        error: deviceListFetchError,
        isLoading: isDeviceListLoading,
        mutate: mutateDeviceList
    } = useGetDevices<DeviceListResponseInterface, RequestErrorInterface>(DEVICES_PAGE_SIZE, offset);

    const isFeatureDisabled: boolean = deviceListFetchError?.response?.status === 404
        && deviceListFetchError?.response?.data?.code === DEVICE_MANAGEMENT_DISABLED_ERROR_CODE;
    const devices: DeviceInterface[] = deviceList?.devices ?? [];
    const totalResults: number = deviceList?.totalResults ?? 0;

    const fireErrorAlert = (notificationKey: DeviceNotificationKey): void => {
        onAlertFired({
            description: t(`myAccount:components.devices.notifications.${ notificationKey }.genericError.description`),
            level: AlertLevels.ERROR,
            message: t(`myAccount:components.devices.notifications.${ notificationKey }.genericError.message`)
        });
    };

    const fireSuccessAlert = (notificationKey: DeviceNotificationKey): void => {
        onAlertFired({
            description: t(`myAccount:components.devices.notifications.${ notificationKey }.success.description`),
            level: AlertLevels.SUCCESS,
            message: t(`myAccount:components.devices.notifications.${ notificationKey }.success.message`)
        });
    };

    useEffect(() => {
        if (!deviceListFetchError) {
            return;
        }

        if (isFeatureDisabled) {
            onFeatureDisabled?.();

            return;
        }

        fireErrorAlert("fetchDevices");
    }, [ deviceListFetchError ]);

    /**
     * Steps back a page when the current page has become empty, e.g. after deleting its last device.
     */
    useEffect(() => {
        if (deviceList && deviceList.devices?.length === 0 && offset > 0) {
            setOffset(Math.max(0, offset - DEVICES_PAGE_SIZE));
        }
    }, [ deviceList ]);

    const handleActionsMenuOpen = (event: MouseEvent<HTMLElement>, device: DeviceInterface): void => {
        setActionsMenuAnchor(event.currentTarget);
        setActionsMenuDevice(device);
    };

    const handleActionsMenuClose = (): void => {
        setActionsMenuAnchor(null);
        setActionsMenuDevice(null);
    };

    const patchDevice = async (
        device: DeviceInterface,
        patch: DevicePatchRequestInterface,
        notificationKey: DeviceNotificationKey
    ): Promise<boolean> => {
        setIsRequestInProgress(true);

        try {
            await updateDevice(device.id, patch);
            fireSuccessAlert(notificationKey);
            mutateDeviceList();

            return true;
        } catch (_error) {
            fireErrorAlert(notificationKey);

            return false;
        } finally {
            setIsRequestInProgress(false);
        }
    };

    const handleRename = async (deviceName: string): Promise<void> => {
        if (!deviceToRename) {
            return;
        }

        if (deviceName === deviceToRename.deviceName) {
            setDeviceToRename(null);

            return;
        }

        const isSuccess: boolean = await patchDevice(deviceToRename, { deviceName }, "renameDevice");

        if (isSuccess) {
            setDeviceToRename(null);
        }
    };

    const handleDeactivate = async (): Promise<void> => {
        if (!deviceToDeactivate) {
            return;
        }

        await patchDevice(deviceToDeactivate, { status: DeviceStatus.INACTIVE }, "deactivateDevice");
        setDeviceToDeactivate(null);
    };

    const handleDelete = async (): Promise<void> => {
        if (!deviceToDelete) {
            return;
        }

        setIsRequestInProgress(true);

        try {
            await deleteDevice(deviceToDelete.id);
            fireSuccessAlert("deleteDevice");
            mutateDeviceList();
        } catch (_error) {
            fireErrorAlert("deleteDevice");
        } finally {
            setIsRequestInProgress(false);
            setDeviceToDelete(null);
        }
    };

    const handleRenameClick = (): void => {
        setDeviceToRename(actionsMenuDevice);
        handleActionsMenuClose();
    };

    const handleStatusToggleClick = (): void => {
        const device: DeviceInterface | null = actionsMenuDevice;

        handleActionsMenuClose();

        if (!device) {
            return;
        }

        if (device.status === DeviceStatus.ACTIVE) {
            setDeviceToDeactivate(device);

            return;
        }

        patchDevice(device, { status: DeviceStatus.ACTIVE }, "activateDevice");
    };

    const handleDeleteClick = (): void => {
        setDeviceToDelete(actionsMenuDevice);
        handleActionsMenuClose();
    };

    const formatRegisteredDate = (registeredAt: string): string => {
        const registeredDate: dayjs.Dayjs = dayjs(registeredAt);

        return registeredDate.isValid() ? registeredDate.format("ll") : registeredAt;
    };

    const resolveDeviceIcon = (device: DeviceInterface): SemanticICONS => {
        const searchText: string = `${ device.deviceModel ?? "" } ${ device.deviceName ?? "" }`;

        return DEVICE_TYPE_ICONS.find(
            (type: { icon: SemanticICONS; pattern: RegExp }) => type.pattern.test(searchText)
        )?.icon ?? "mobile alternate";
    };

    const renderStatus = (device: DeviceInterface): ReactElement => {
        const isActive: boolean = device.status === DeviceStatus.ACTIVE;

        return (
            <Box
                component="span"
                sx={ {
                    alignItems: "center",
                    bgcolor: (theme: Theme) => isActive
                        ? alpha(theme.palette.success.main, 0.12)
                        : theme.palette.action.hover,
                    borderRadius: 4,
                    color: isActive ? "success.dark" : "text.secondary",
                    display: "inline-flex",
                    flexShrink: 0,
                    fontSize: "0.75rem",
                    gap: 0.75,
                    lineHeight: 1.6,
                    px: 1
                } }
                data-componentid={ `${ componentId }-list-item-status` }
            >
                <Box
                    component="span"
                    sx={ {
                        bgcolor: isActive ? "success.main" : "text.disabled",
                        borderRadius: "50%",
                        height: 6,
                        width: 6
                    } }
                />
                { isActive
                    ? t("myAccount:components.devices.status.active")
                    : t("myAccount:components.devices.status.inactive") }
            </Box>
        );
    };

    const renderDeviceDetails = (device: DeviceInterface): string => {
        const details: string[] = [];

        if (device.deviceModel) {
            details.push(device.deviceModel);
        }
        if (device.registeredAt) {
            details.push(t("myAccount:components.devices.list.registeredOn",
                { date: formatRegisteredDate(device.registeredAt) }));
        }

        return details.join(" · ");
    };

    const renderDeviceList = (): ReactElement => (
        <List disablePadding sx={ { px: 3.5 } } data-componentid={ `${ componentId }-list` }>
            { devices.map((device: DeviceInterface, index: number) => {
                const isActive: boolean = device.status === DeviceStatus.ACTIVE;

                return (
                    <Fragment key={ device.id }>
                        { index > 0 && <Divider component="li" /> }
                        <ListItem
                            sx={ { px: 0, py: 1.25 } }
                            data-componentid={ `${ componentId }-list-item` }
                            secondaryAction={ (
                                <IconButton
                                    edge="end"
                                    aria-label={ t("myAccount:components.devices.actions.more",
                                        { name: device.deviceName }) }
                                    aria-haspopup="menu"
                                    disabled={ isRequestInProgress }
                                    onClick={ (event: MouseEvent<HTMLElement>) => handleActionsMenuOpen(event, device) }
                                    data-componentid={ `${ componentId }-list-item-actions-button` }
                                >
                                    <EllipsisVerticalIcon />
                                </IconButton>
                            ) }
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={ {
                                        bgcolor: "action.hover",
                                        color: "text.secondary",
                                        height: 40,
                                        opacity: isActive ? 1 : 0.5,
                                        width: 40
                                    } }
                                    data-componentid={ `${ componentId }-list-item-icon` }
                                >
                                    <Icon name={ resolveDeviceIcon(device) } fitted />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                disableTypography
                                sx={ { minWidth: 0, pr: 2 } }
                                primary={ (
                                    <Stack direction="row" spacing={ 1 } alignItems="center" sx={ { minWidth: 0 } }>
                                        <Typography
                                            variant="body1"
                                            noWrap
                                            title={ device.deviceName }
                                            color={ isActive ? "text.primary" : "text.secondary" }
                                            sx={ { fontWeight: 500 } }
                                            data-componentid={ `${ componentId }-list-item-name` }
                                        >
                                            { device.deviceName }
                                        </Typography>
                                        { renderStatus(device) }
                                    </Stack>
                                ) }
                                secondary={ (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                        title={ renderDeviceDetails(device) }
                                        data-componentid={ `${ componentId }-list-item-details` }
                                    >
                                        { renderDeviceDetails(device) }
                                    </Typography>
                                ) }
                            />
                        </ListItem>
                    </Fragment>
                );
            }) }
        </List>
    );

    const renderLoadingState = (): ReactElement => (
        <Box px={ 2 } py={ 1 } data-componentid={ `${ componentId }-loading` }>
            { [ 0, 1 ].map((item: number) => (
                <Box key={ item } py={ 1 }>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="25%" />
                </Box>
            )) }
        </Box>
    );

    const renderPagination = (): ReactElement => {
        if (totalResults <= DEVICES_PAGE_SIZE) {
            return null;
        }

        const pageStart: number = offset + 1;
        const pageEnd: number = Math.min(offset + devices.length, totalResults);

        return (
            <Stack
                direction="row"
                spacing={ 1 }
                alignItems="center"
                justifyContent="flex-end"
                mx={ 3.5 }
                pt={ 1.5 }
                pb={ 1.5 }
                sx={ { borderTop: 1, borderColor: "divider" } }
                data-componentid={ `${ componentId }-pagination` }
            >
                <Typography component="span" variant="body2" color="text.secondary">
                    { t("myAccount:components.devices.pagination.summary",
                        { end: pageEnd, start: pageStart, total: totalResults }) }
                </Typography>
                <Button
                    size="small"
                    disabled={ offset === 0 || isDeviceListLoading }
                    onClick={ () => setOffset(Math.max(0, offset - DEVICES_PAGE_SIZE)) }
                    data-componentid={ `${ componentId }-pagination-previous-button` }
                >
                    { t("myAccount:components.devices.pagination.previous") }
                </Button>
                <Button
                    size="small"
                    disabled={ offset + DEVICES_PAGE_SIZE >= totalResults || isDeviceListLoading }
                    onClick={ () => setOffset(offset + DEVICES_PAGE_SIZE) }
                    data-componentid={ `${ componentId }-pagination-next-button` }
                >
                    { t("myAccount:components.devices.pagination.next") }
                </Button>
            </Stack>
        );
    };

    if (isFeatureDisabled) {
        return null;
    }

    return (
        <div data-componentid={ componentId }>
            <SettingsSection
                description={ t("myAccount:sections.devices.description") }
                header={ t("myAccount:sections.devices.heading") }
                placeholder={
                    !isDeviceListLoading && devices.length === 0
                        ? t("myAccount:sections.devices.actionTitles.empty")
                        : null
                }
            >
                { isDeviceListLoading
                    ? renderLoadingState()
                    : devices.length > 0 && (
                        <>
                            { renderDeviceList() }
                            { renderPagination() }
                        </>
                    )
                }
            </SettingsSection>
            <Menu
                anchorEl={ actionsMenuAnchor }
                open={ Boolean(actionsMenuAnchor) }
                onClose={ handleActionsMenuClose }
                data-componentid={ `${ componentId }-actions-menu` }
            >
                <MenuItem
                    onClick={ handleRenameClick }
                    data-componentid={ `${ componentId }-actions-menu-rename` }
                >
                    { t("myAccount:components.devices.actions.rename") }
                </MenuItem>
                <MenuItem
                    onClick={ handleStatusToggleClick }
                    data-componentid={ `${ componentId }-actions-menu-toggle-status` }
                >
                    { actionsMenuDevice?.status === DeviceStatus.ACTIVE
                        ? t("myAccount:components.devices.actions.deactivate")
                        : t("myAccount:components.devices.actions.activate") }
                </MenuItem>
                <MenuItem
                    onClick={ handleDeleteClick }
                    sx={ { color: "error.main" } }
                    data-componentid={ `${ componentId }-actions-menu-delete` }
                >
                    { t("myAccount:components.devices.actions.delete") }
                </MenuItem>
            </Menu>
            { deviceToRename && (
                <RenameDeviceDialog
                    isOpen={ Boolean(deviceToRename) }
                    initialName={ deviceToRename.deviceName }
                    isSubmitting={ isRequestInProgress }
                    onClose={ () => setDeviceToRename(null) }
                    onSubmit={ handleRename }
                    data-componentid={ `${ componentId }-rename-dialog` }
                />
            ) }
            { deviceToDeactivate && (
                <ConfirmationModal
                    type="warning"
                    open={ Boolean(deviceToDeactivate) }
                    primaryAction={ t("myAccount:components.devices.modals.deactivateConfirmation.primaryAction") }
                    secondaryAction={ t("common:cancel") }
                    primaryActionLoading={ isRequestInProgress }
                    onPrimaryActionClick={ handleDeactivate }
                    onSecondaryActionClick={ () => setDeviceToDeactivate(null) }
                    onClose={ () => !isRequestInProgress && setDeviceToDeactivate(null) }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-deactivate-confirmation-modal` }
                >
                    <ConfirmationModal.Header>
                        { t("myAccount:components.devices.modals.deactivateConfirmation.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("myAccount:components.devices.modals.deactivateConfirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("myAccount:components.devices.modals.deactivateConfirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { deviceToDelete && (
                <ConfirmationModal
                    type="negative"
                    open={ Boolean(deviceToDelete) }
                    primaryAction={ t("myAccount:components.devices.modals.deleteConfirmation.primaryAction") }
                    secondaryAction={ t("common:cancel") }
                    primaryActionLoading={ isRequestInProgress }
                    onPrimaryActionClick={ handleDelete }
                    onSecondaryActionClick={ () => setDeviceToDelete(null) }
                    onClose={ () => !isRequestInProgress && setDeviceToDelete(null) }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                >
                    <ConfirmationModal.Header>
                        { t("myAccount:components.devices.modals.deleteConfirmation.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("myAccount:components.devices.modals.deleteConfirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("myAccount:components.devices.modals.deleteConfirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </div>
    );
};
