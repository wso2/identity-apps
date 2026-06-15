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
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Icon, Label, Table } from "semantic-ui-react";
import EditDevicePolicyWizard from "../components/edit-device-policy-wizard";
import useGetDevicePolicyById from "../hooks/use-get-device-policy-by-id";
import {
    DevicePlatformType,
    DevicePolicyExpressionInterface,
    PolicyResourceResponseInterface
} from "../models/device-policy";

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

        if (raw.includes(",")) {
            return (
                <span>
                    { raw.split(",").map((v: string): ReactNode => (
                        <Label key={ v } size="small" basic style={ { marginBottom: 2 } }>
                            { v.trim() }
                        </Label>
                    )) }
                </span>
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
                        (platformRule.rule?.rules ?? []).flatMap((group) => group.expressions);

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
                                            celled
                                            padded
                                            data-componentid={
                                                `${ componentId }-${ platform }-conditions-table`
                                            }
                                        >
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.field"
                                                        ) }
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.operator"
                                                        ) }
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        { t(
                                                            "devices:assurancePolicies.edit.sections" +
                                                            ".conditions.columns.value"
                                                        ) }
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                { expressions.map(
                                                    (
                                                        expression: DevicePolicyExpressionInterface
                                                    ): ReactElement => (
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
                                    </>
                                ) }
                            </ResourceTab.Pane>
                        )
                    };
                }
            ),
        [ platformRules ]
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
                action={ (
                    <PrimaryButton
                        disabled={ isPolicyLoading || !policy }
                        onClick={ (): void => setShowEditWizard(true) }
                        data-componentid={ `${ componentId }-edit-button` }
                    >
                        <Icon name="pencil" />
                        { t("devices:assurancePolicies.edit.editButton") }
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
