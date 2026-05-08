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

import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    PageLayout
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Divider, Icon, Label, Table } from "semantic-ui-react";
import useGetDevicePolicyById from "../hooks/use-get-device-policy-by-id";
import {
    DevicePlatformType,
    DevicePolicyExpressionInterface
} from "../models/devices";

type DevicePolicyEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
    android: "Android",
    ios: "iOS",
    macos: "macOS",
    windows: "Windows"
};

const OPERATOR_DISPLAY_NAMES: Record<string, string> = {
    equals: "equals",
    greaterThan: "greater than",
    lessThan: "less than",
    notEquals: "not equals"
};

const DevicePolicyEditPage: FunctionComponent<DevicePolicyEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-policy-edit-page"
}: DevicePolicyEditPagePropsInterface): ReactElement => {
    const policyId: string = match.params["id"]?.split("#")[0];

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const technologyLogos: ReturnType<typeof getTechnologyLogos> = getTechnologyLogos();

    const {
        data: policy,
        isLoading: isPolicyLoading,
        error: policyFetchError
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

    const allExpressions: DevicePolicyExpressionInterface[] = useMemo(
        (): DevicePolicyExpressionInterface[] =>
            (policy?.rule?.rules ?? []).flatMap(
                (group) => group.expressions
            ),
        [ policy ]
    );

    const platformExpression: DevicePolicyExpressionInterface | undefined = useMemo(
        (): DevicePolicyExpressionInterface | undefined =>
            allExpressions.find((e: DevicePolicyExpressionInterface): boolean => e.field === "platform"),
        [ allExpressions ]
    );

    const conditionExpressions: DevicePolicyExpressionInterface[] = useMemo(
        (): DevicePolicyExpressionInterface[] =>
            allExpressions.filter((e: DevicePolicyExpressionInterface): boolean => e.field !== "platform"),
        [ allExpressions ]
    );

    const platformKey: DevicePlatformType | undefined = platformExpression?.value?.value as DevicePlatformType;

    const platformLogo: unknown = platformKey ? technologyLogos[platformKey] : undefined;

    const formatValue = (expression: DevicePolicyExpressionInterface): ReactNode => {
        const raw: string = expression.value?.value ?? "";

        if (raw === "true") {
            return (
                <Label color="green" size="small">
                    <Icon name="check circle" />
                    Enabled
                </Label>
            );
        }

        if (raw === "false") {
            return (
                <Label color="red" size="small">
                    <Icon name="times circle" />
                    Disabled
                </Label>
            );
        }

        return <span>{ raw }</span>;
    };

    return (
        <PageLayout
            isLoading={ isPolicyLoading }
            title={ policy?.name ?? policyId }
            description={ policy?.ruleId }
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
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            { platformLogo && (
                <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-platform-segment` }>
                    <Heading as="h5">
                        { t("devices:assurancePolicies.edit.sections.platform.heading") }
                    </Heading>
                    <div
                        style={ {
                            alignItems: "center",
                            display: "flex",
                            gap: "12px",
                            marginTop: "12px"
                        } }
                    >
                        <GenericIcon
                            icon={ platformLogo }
                            size="x30"
                            inline
                            transparent
                            data-componentid={ `${ componentId }-platform-logo` }
                        />
                        <span style={ { fontSize: "1rem", fontWeight: 500 } }>
                            { PLATFORM_DISPLAY_NAMES[platformKey] ?? platformKey }
                        </span>
                    </div>
                </EmphasizedSegment>
            ) }

            { conditionExpressions.length > 0 && (
                <>
                    <Divider hidden />
                    <EmphasizedSegment
                        padded="very"
                        data-componentid={ `${ componentId }-conditions-segment` }
                    >
                        <Heading as="h5">
                            { t("devices:assurancePolicies.edit.sections.conditions.heading") }
                        </Heading>
                        <p className="sub-heading">
                            { t("devices:assurancePolicies.edit.sections.conditions.description") }
                        </p>
                        <Table
                            celled
                            padded
                            data-componentid={ `${ componentId }-conditions-table` }
                        >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        { t("devices:assurancePolicies.edit.sections.conditions.columns.field") }
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        { t("devices:assurancePolicies.edit.sections.conditions.columns.operator") }
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        { t("devices:assurancePolicies.edit.sections.conditions.columns.value") }
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { conditionExpressions.map(
                                    (expression: DevicePolicyExpressionInterface): ReactElement => (
                                        <Table.Row key={ expression.field }>
                                            <Table.Cell>
                                                <strong>{ expression.displayName }</strong>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Label size="small" color="blue" basic>
                                                    { OPERATOR_DISPLAY_NAMES[expression.operator]
                                                        ?? expression.operator }
                                                </Label>
                                            </Table.Cell>
                                            <Table.Cell>
                                                { formatValue(expression) }
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                ) }
                            </Table.Body>
                        </Table>
                    </EmphasizedSegment>
                </>
            ) }
        </PageLayout>
    );
};

export default DevicePolicyEditPage;
