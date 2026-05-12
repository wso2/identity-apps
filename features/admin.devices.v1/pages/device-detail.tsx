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
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import {
    AnimatedAvatar,
    EmphasizedSegment,
    Heading,
    PageLayout
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Divider, Grid, Icon, Label, Table } from "semantic-ui-react";
import useGetDeviceById from "../hooks/use-get-device-by-id";
import useGetUserById from "../hooks/use-get-user-by-id";
import { DeviceResponseInterface } from "../models/devices";

type DeviceDetailPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const DeviceDetailPage: FunctionComponent<DeviceDetailPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-detail-page"
}: DeviceDetailPagePropsInterface): ReactElement => {
    const deviceId: string = match.params["id"]?.split("#")[0];

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        data: device,
        isLoading: isDeviceLoading,
        error: deviceFetchError
    } = useGetDeviceById(deviceId, !isEmpty(deviceId));

    const {
        data: userProfile,
        isLoading: isUserLoading
    } = useGetUserById(device?.userId, !!device?.userId);

    useEffect((): void => {
        if (!deviceFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:detail.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:detail.notifications.fetch.genericError.message")
        }));
    }, [ deviceFetchError ]);

    const parsedMetadata: Record<string, string> = useMemo((): Record<string, string> => {
        if (!device?.metadata) {
            return {};
        }

        try {
            return JSON.parse(device.metadata) as Record<string, string>;
        } catch {
            return {};
        }
    }, [ device ]);

    const metadataEntries: [ string, string ][] = Object.entries(parsedMetadata);

    const resolveStatusLabel = (status: string): ReactElement => {
        const colour: "green" | "yellow" | "red" =
            status === "ACTIVE" ? "green" : status === "PENDING" ? "yellow" : "red";

        return (
            <Label color={ colour } size="small">
                { status }
            </Label>
        );
    };

    const formatDate = (iso: string): string => {
        if (!iso) {
            return "-";
        }

        return new Date(iso).toLocaleString();
    };

    return (
        <PageLayout
            isLoading={ isDeviceLoading }
            title={ device?.deviceName ?? deviceId }
            description={ device?.deviceModel }
            image={ (
                <AnimatedAvatar
                    name={ device?.deviceName ?? "" }
                    size="tiny"
                    floated="left"
                    data-componentid={ `${ componentId }-avatar` }
                />
            ) }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: (): void => history.push(AppConstants.getPaths().get("DEVICES")),
                text: t("devices:detail.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            { /* ── Device Information ── */ }
            <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-info-segment` }>
                <Heading as="h5">
                    { t("devices:detail.sections.deviceInfo.heading") }
                </Heading>
                <Grid className="mt-2">
                    <Grid.Row columns={ 2 }>
                        <Grid.Column>
                            <div style={ { marginBottom: "1rem" } }>
                                <div style={ { color: "rgba(0,0,0,0.5)", fontSize: "0.85rem", marginBottom: "4px" } }>
                                    { t("devices:detail.sections.deviceInfo.fields.deviceName") }
                                </div>
                                <strong>{ device?.deviceName ?? "-" }</strong>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={ { marginBottom: "1rem" } }>
                                <div style={ { color: "rgba(0,0,0,0.5)", fontSize: "0.85rem", marginBottom: "4px" } }>
                                    { t("devices:detail.sections.deviceInfo.fields.deviceModel") }
                                </div>
                                <strong>{ device?.deviceModel ?? "-" }</strong>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={ { marginBottom: "1rem" } }>
                                <div style={ { color: "rgba(0,0,0,0.5)", fontSize: "0.85rem", marginBottom: "4px" } }>
                                    { t("devices:detail.sections.deviceInfo.fields.status") }
                                </div>
                                { device?.status ? resolveStatusLabel(device.status) : "-" }
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={ { marginBottom: "1rem" } }>
                                <div style={ { color: "rgba(0,0,0,0.5)", fontSize: "0.85rem", marginBottom: "4px" } }>
                                    { t("devices:detail.sections.deviceInfo.fields.registeredAt") }
                                </div>
                                <strong>{ formatDate(device?.registeredAt) }</strong>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>

            <Divider hidden />

            { /* ── Registered User ── */ }
            <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-user-segment` }>
                <Heading as="h5">
                    { t("devices:detail.sections.userInfo.heading") }
                </Heading>
                { isUserLoading ? (
                    <p style={ { color: "rgba(0,0,0,0.4)" } }>Loading...</p>
                ) : userProfile ? (
                    <Grid className="mt-2">
                        <Grid.Row columns={ 2 }>
                            <Grid.Column>
                                <div style={ { marginBottom: "1rem" } }>
                                    <div style={ {
                                        color: "rgba(0,0,0,0.5)",
                                        fontSize: "0.85rem",
                                        marginBottom: "4px"
                                    } }>
                                        { t("devices:detail.sections.userInfo.fields.username") }
                                    </div>
                                    <strong>
                                        <Icon name="user circle" />
                                        { getUserNameWithoutDomain(userProfile.userName) }
                                    </strong>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div style={ { marginBottom: "1rem" } }>
                                    <div style={ {
                                        color: "rgba(0,0,0,0.5)",
                                        fontSize: "0.85rem",
                                        marginBottom: "4px"
                                    } }>
                                        { t("devices:detail.sections.userInfo.fields.email") }
                                    </div>
                                    <strong>
                                        { Array.isArray(userProfile.emails) && userProfile.emails.length > 0
                                            ? (typeof userProfile.emails[0] === "string"
                                                ? userProfile.emails[0]
                                                : (userProfile.emails[0] as { value: string }).value)
                                            : device?.userName ?? "-"
                                        }
                                    </strong>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <p style={ { color: "rgba(0,0,0,0.4)" } }>
                        { t("devices:detail.sections.userInfo.notFound") }
                    </p>
                ) }
            </EmphasizedSegment>

            <Divider hidden />

            { /* ── Device Metadata ── */ }
            <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-metadata-segment` }>
                <Heading as="h5">
                    { t("devices:detail.sections.metadata.heading") }
                </Heading>
                <p className="sub-heading">
                    { t("devices:detail.sections.metadata.description") }
                </p>
                { metadataEntries.length > 0 ? (
                    <Table celled padded data-componentid={ `${ componentId }-metadata-table` }>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    { t("devices:detail.sections.metadata.columns.key") }
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    { t("devices:detail.sections.metadata.columns.value") }
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { metadataEntries.map(([ key, value ]: [ string, string ]): ReactElement => (
                                <Table.Row key={ key }>
                                    <Table.Cell>
                                        <strong>{ key }</strong>
                                    </Table.Cell>
                                    <Table.Cell>{ String(value) }</Table.Cell>
                                </Table.Row>
                            )) }
                        </Table.Body>
                    </Table>
                ) : (
                    <p style={ { color: "rgba(0,0,0,0.4)" } }>
                        { t("devices:detail.sections.metadata.empty") }
                    </p>
                ) }
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default DeviceDetailPage;
