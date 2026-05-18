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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useGetDevicesByUserId from "@wso2is/admin.devices.v1/hooks/use-get-devices-by-user-id";
import { DeviceResponseInterface } from "@wso2is/admin.devices.v1/models/devices";
import { AlertLevels, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Label, SemanticICONS } from "semantic-ui-react";

interface UserDevicesPropsInterface extends IdentifiableComponentInterface {
    user: ProfileInfoInterface;
}

const UserDevices: FunctionComponent<UserDevicesPropsInterface> = ({
    user,
    "data-componentid": componentId = "user-devices"
}: UserDevicesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: devices,
        isLoading,
        error
    } = useGetDevicesByUserId(user?.id, !!user?.id);

    useEffect((): void => {
        if (!error) {
            return;
        }

        dispatch(addAlert({
            description: t("users:userDevices.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("users:userDevices.notifications.fetch.genericError.message")
        }));
    }, [ error ]);

    const resolveStatusLabel = (status: string): ReactElement => {
        const colour: "green" | "yellow" | "red" =
            status === "ACTIVE" ? "green" : status === "PENDING" ? "yellow" : "red";

        return (
            <Label color={ colour } size="small">{ status }</Label>
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
            render: (device: DeviceResponseInterface): ReactNode => resolveStatusLabel(device.status),
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
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${ componentId }-item-view-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "eye",
            onClick: (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                history.push(
                    AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id)
                );
            },
            popupText: (): string => t("common:view"),
            renderer: "semantic-icon"
        }
    ];

    if (isLoading) {
        return <ContentLoader />;
    }

    return (
        <DataTable<DeviceResponseInterface>
            className="user-devices-table"
            isLoading={ isLoading }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ devices ?? [] }
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
            onRowClick={ (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                history.push(
                    AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id)
                );
            } }
            showHeader={ true }
            transparent={ !isLoading && (!devices || devices.length === 0) }
            data-componentid={ componentId }
        />
    );
};

export default UserDevices;
