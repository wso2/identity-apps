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
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableHead from "@oxygen-ui/react/TableHead";
import TableRow from "@oxygen-ui/react/TableRow";
import Typography from "@oxygen-ui/react/Typography";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    EmphasizedSegment,
    Heading,
    PageLayout
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import useGetDeviceById from "../hooks/use-get-device-by-id";

interface DeviceDetailPagePathParams {
    id: string;
}

type DeviceDetailPagePropsInterface = IdentifiableComponentInterface &
    RouteComponentProps<DeviceDetailPagePathParams>;

const DeviceDetailPage: FunctionComponent<DeviceDetailPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-detail-page"
}: DeviceDetailPagePropsInterface): ReactElement => {
    const deviceId: string = match.params.id?.split("#")[0];

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        data: device,
        isLoading: isDeviceLoading,
        error: deviceFetchError
    } = useGetDeviceById(deviceId, !isEmpty(deviceId));

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

    const resolveStatusChip = (status: string): ReactElement => {
        const color: "success" | "warning" | "error" =
            status === "ACTIVE" ? "success" : status === "PENDING" ? "warning" : "error";

        return <Chip label={ status } color={ color } size="small" />;
    };

    const formatDate = (iso: string | undefined): string => {
        if (!iso) {
            return "-";
        }

        return new Date(iso).toLocaleString();
    };

    const renderField = (label: string, value: ReactNode): ReactElement => (
        <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                { label }
            </Typography>
            <Typography variant="body1" component="div" sx={ { fontWeight: 500 } }>
                { value }
            </Typography>
        </Box>
    );

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
                onClick: (): void => history.goBack(),
                text: t("devices:detail.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <Stack spacing={ 3 }>
                { /* ── Device Information ── */ }
                <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-info-segment` }>
                    <Heading as="h5">
                        { t("devices:detail.sections.deviceInfo.heading") }
                    </Heading>
                    <Grid container spacing={ 3 } className="mt-2">
                        <Grid xs={ 12 } sm={ 6 }>
                            { renderField(
                                t("devices:detail.sections.deviceInfo.fields.deviceName"),
                                device?.deviceName ?? "-"
                            ) }
                        </Grid>
                        <Grid xs={ 12 } sm={ 6 }>
                            { renderField(
                                t("devices:detail.sections.deviceInfo.fields.deviceModel"),
                                device?.deviceModel ?? "-"
                            ) }
                        </Grid>
                        <Grid xs={ 12 } sm={ 6 }>
                            { renderField(
                                t("devices:detail.sections.deviceInfo.fields.status"),
                                device?.status ? resolveStatusChip(device.status) : "-"
                            ) }
                        </Grid>
                        <Grid xs={ 12 } sm={ 6 }>
                            { renderField(
                                t("devices:detail.sections.deviceInfo.fields.registeredAt"),
                                formatDate(device?.registeredAt)
                            ) }
                        </Grid>
                    </Grid>
                </EmphasizedSegment>

                { /* ── Device Metadata ── */ }
                <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-metadata-segment` }>
                    <Heading as="h5">
                        { t("devices:detail.sections.metadata.heading") }
                    </Heading>
                    <Typography variant="body2" color="text.secondary" className="sub-heading">
                        { t("devices:detail.sections.metadata.description") }
                    </Typography>
                    { metadataEntries.length > 0 ? (
                        <Table data-componentid={ `${ componentId }-metadata-table` }>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        { t("devices:detail.sections.metadata.columns.key") }
                                    </TableCell>
                                    <TableCell>
                                        { t("devices:detail.sections.metadata.columns.value") }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { metadataEntries.map(([ key, value ]: [ string, string ]): ReactElement => (
                                    <TableRow key={ key }>
                                        <TableCell>
                                            <Typography variant="body2" sx={ { fontWeight: 500 } }>
                                                { key }
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{ String(value) }</TableCell>
                                    </TableRow>
                                )) }
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            { t("devices:detail.sections.metadata.empty") }
                        </Typography>
                    ) }
                </EmphasizedSegment>
            </Stack>
        </PageLayout>
    );
};

export default DeviceDetailPage;
