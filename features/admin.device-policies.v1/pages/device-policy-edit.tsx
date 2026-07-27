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

import { PenToSquareIcon } from "@oxygen-ui/react-icons";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableHead from "@oxygen-ui/react/TableHead";
import TableRow from "@oxygen-ui/react/TableRow";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    PrimaryButton,
    ResourceTab,
    TabPageLayout
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import EditDevicePolicyWizard from "../components/edit-device-policy-wizard";
import useGetDevicePolicyById from "../hooks/use-get-device-policy-by-id";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyExpressionInterface,
    DevicePolicyFieldDefinitionInterface,
    DevicePolicyRuleGroupInterface,
    PolicyResourceResponseInterface
} from "../models/device-policy";
import { buildFieldDisplayMap, buildOperatorDisplayMap } from "../utils/device-policy-rule-utils";

interface DevicePolicyEditPagePathParams {
    id: string;
}

type DevicePolicyEditPagePropsInterface = IdentifiableComponentInterface &
    RouteComponentProps<DevicePolicyEditPagePathParams>;

const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
    android: "Android",
    ios: "iOS",
    macos: "macOS",
    windows: "Windows"
};

const DevicePolicyEditPage: FunctionComponent<DevicePolicyEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-policy-edit-page"
}: DevicePolicyEditPagePropsInterface): ReactElement => {
    const policyId: string = match.params.id?.split("#")[0];

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const devicePoliciesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devicePolicies
    );
    const hasUpdatePermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.update);

    const [ showEditWizard, setShowEditWizard ] = useState<boolean>(false);

    const {
        data: policy,
        isLoading: isPolicyLoading,
        error: policyFetchError,
        mutate: mutatePolicy
    } = useGetDevicePolicyById(policyId, !isEmpty(policyId));

    useEffect((): void => {
        if (!policyFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.edit.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.edit.notifications.fetch.genericError.message")
        }));
    }, [ policyFetchError ]);

    const platformRules: PolicyResourceResponseInterface[] = useMemo(
        (): PolicyResourceResponseInterface[] => policy?.resources ?? [],
        [ policy ]
    );

    /* -- Metadata for display-name resolution (SWR caches by URL) ------- */

    const platformsInPolicy: DevicePlatformType[] = useMemo(
        (): DevicePlatformType[] =>
            platformRules.map((r: PolicyResourceResponseInterface): DevicePlatformType =>
                r.target as DevicePlatformType
            ),
        [ platformRules ]
    );

    const { data: androidMeta } =
        useGetDevicePolicyMetadata("android", platformsInPolicy.includes("android"));
    const { data: iosMeta } =
        useGetDevicePolicyMetadata("ios", platformsInPolicy.includes("ios"));
    const { data: macosMeta } =
        useGetDevicePolicyMetadata("macos", platformsInPolicy.includes("macos"));
    const { data: windowsMeta } =
        useGetDevicePolicyMetadata("windows", platformsInPolicy.includes("windows"));

    const allRawMeta: Record<DevicePlatformType, DevicePolicyFieldDefinitionInterface[] | undefined> =
        useMemo((): Record<DevicePlatformType, DevicePolicyFieldDefinitionInterface[] | undefined> => ({
            android: androidMeta,
            ios: iosMeta,
            macos: macosMeta,
            windows: windowsMeta
        }), [ androidMeta, iosMeta, macosMeta, windowsMeta ]);

    const platformFieldMaps: Partial<Record<DevicePlatformType, Map<string, string>>> = useMemo(
        (): Partial<Record<DevicePlatformType, Map<string, string>>> => {
            const result: Partial<Record<DevicePlatformType, Map<string, string>>> = {};

            ([ "android", "ios", "macos", "windows" ] as DevicePlatformType[]).forEach(
                (p: DevicePlatformType): void => {
                    if (allRawMeta[p]) {
                        result[p] = buildFieldDisplayMap(allRawMeta[p]);
                    }
                }
            );

            return result;
        },
        [ allRawMeta ]
    );

    const platformOperatorMaps: Partial<Record<DevicePlatformType, Map<string, string>>> = useMemo(
        (): Partial<Record<DevicePlatformType, Map<string, string>>> => {
            const result: Partial<Record<DevicePlatformType, Map<string, string>>> = {};

            ([ "android", "ios", "macos", "windows" ] as DevicePlatformType[]).forEach(
                (p: DevicePlatformType): void => {
                    if (allRawMeta[p]) {
                        result[p] = buildOperatorDisplayMap(allRawMeta[p]);
                    }
                }
            );

            return result;
        },
        [ allRawMeta ]
    );

    const formatValue = (expression: DevicePolicyExpressionInterface): ReactNode => {
        const raw: string = expression.value?.value ?? "";

        if (raw === "true") {
            return <Chip label="Enabled" color="success" size="small" />;
        }

        if (raw === "false") {
            return <Chip label="Disabled" color="error" size="small" />;
        }

        if (raw.includes(",")) {
            return (
                <Box sx={ { display: "flex", flexWrap: "wrap", gap: 0.5 } }>
                    { raw.split(",").map((v: string): ReactNode => (
                        <Chip key={ v } label={ v.trim() } size="small" variant="outlined" />
                    )) }
                </Box>
            );
        }

        return <span>{ raw }</span>;
    };

    const panes: { menuItem: string; render: () => ReactElement }[] = useMemo(
        (): { menuItem: string; render: () => ReactElement }[] =>
            platformRules.map(
                (platformRule: PolicyResourceResponseInterface): {
                    menuItem: string;
                    render: () => ReactElement;
                } => {
                    const platform: DevicePlatformType = platformRule.target as DevicePlatformType;
                    const expressions: DevicePolicyExpressionInterface[] =
                        (platformRule.rule?.rules ?? []).flatMap(
                            (group: DevicePolicyRuleGroupInterface): DevicePolicyExpressionInterface[] =>
                                group.expressions
                        );

                    return {
                        menuItem: PLATFORM_DISPLAY_NAMES[platform] ?? platform,
                        render: (): ReactElement => (
                            <ResourceTab.Pane
                                controlledSegmentation
                                attached={ false }
                                data-componentid={ `${ componentId }-${ platform }-pane` }
                            >
                                { expressions.length === 0 ? (
                                    <p className="sub-heading">
                                        { t(
                                            "devices:assurancePolicies.wizard.steps.review.noRuleNote",
                                            { platform: PLATFORM_DISPLAY_NAMES[platform] ?? platform }
                                        ) }
                                    </p>
                                ) : (
                                    <>
                                        <p className="sub-heading">
                                            { t(
                                                "devices:assurancePolicies.edit.sections.conditions.description"
                                            ) }
                                        </p>
                                        <Table
                                            data-componentid={
                                                `${ componentId }-${ platform }-conditions-table`
                                            }
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.field"
                                                        ) }
                                                    </TableCell>
                                                    <TableCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.operator"
                                                        ) }
                                                    </TableCell>
                                                    <TableCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.value"
                                                        ) }
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { expressions.map(
                                                    (
                                                        expression: DevicePolicyExpressionInterface
                                                    ): ReactElement => (
                                                        <TableRow key={ expression.field }>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={ { fontWeight: 500 } }
                                                                >
                                                                    { platformFieldMaps[platform]
                                                                        ?.get(expression.field)
                                                                        ?? expression.field }
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={ platformOperatorMaps[platform]
                                                                        ?.get(expression.operator)
                                                                        ?? expression.operator }
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                { formatValue(expression) }
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                ) }
                                            </TableBody>
                                        </Table>
                                    </>
                                ) }
                            </ResourceTab.Pane>
                        )
                    };
                }
            ),
        [ platformRules, platformFieldMaps, platformOperatorMaps ]
    );

    return (
        <>
            <TabPageLayout
                isLoading={ isPolicyLoading }
                title={ policy?.name ?? policyId }
                image={ (
                    <AnimatedAvatar
                        name={ policy?.name ?? "" }
                        size="tiny"
                        floated="left"
                        data-componentid={ `${ componentId }-avatar` }
                    />
                ) }
                backButton={ {
                    "data-componentid": `${ componentId }-back-button`,
                    onClick: (): void =>
                        history.push(AppConstants.getPaths().get("DEVICE_ASSURANCE_POLICIES")),
                    text: t("devices:assurancePolicies.edit.backButton")
                } }
                action={ hasUpdatePermission && (
                    <PrimaryButton
                        disabled={ isPolicyLoading || !policy }
                        onClick={ (): void => setShowEditWizard(true) }
                        data-componentid={ `${ componentId }-edit-button` }
                    >
                        <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                            <PenToSquareIcon />
                            { t("devices:assurancePolicies.edit.editButton") }
                        </Box>
                    </PrimaryButton>
                ) }
                data-componentid={ `${ componentId }-layout` }
                bottomMargin={ false }
                contentTopMargin={ true }
                pageHeaderMaxWidth={ false }
            >
                <ResourceTab
                    panes={ panes }
                    data-componentid={ `${ componentId }-resource-tab` }
                />
            </TabPageLayout>

            { showEditWizard && policy && (
                <EditDevicePolicyWizard
                    policyId={ policyId }
                    initialName={ policy.name }
                    initialRules={ platformRules }
                    onClose={ (): void => setShowEditWizard(false) }
                    onSuccess={ (): void => {
                        setShowEditWizard(false);
                        mutatePolicy();
                    } }
                    data-componentid={ `${ componentId }-edit-wizard` }
                />
            ) }
        </>
    );
};

export default DevicePolicyEditPage;
