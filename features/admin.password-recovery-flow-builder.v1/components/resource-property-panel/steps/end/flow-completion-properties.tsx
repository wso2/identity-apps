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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Link from "@oxygen-ui/react/Link";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-config";
import { CommonResourcePropertiesPropsInterface } from
    "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { FlowCompletionConfigsInterface } from "@wso2is/admin.flow-builder-core.v1/models/flows";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface of {@link FlowCompletionProperties}
 */
export type FlowCompletionPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Flow completion step properties component.
 *
 * @param props - Props injected to the component.
 * @returns FlowCompletionProperties component.
 */
const FlowCompletionProperties: FunctionComponent<FlowCompletionPropertiesPropsInterface> = ({
    ["data-componentid"]: componentId = "flow-completion-properties-component"
}: FlowCompletionPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { flowCompletionConfigs, setFlowCompletionConfigs, metadata } = useAuthenticationFlowBuilderCore();
    const { data: passwordRecoveryFlowConfig } = useGetFlowConfig(FlowTypes.PASSWORD_RECOVERY);

    const approvalFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.approvalWorkflows
    );

    const hasApprovalWorkflowReadPermissions: boolean = useRequiredScopes(approvalFeatureConfig?.scopes?.read);

    const configs: FlowCompletionConfigsInterface = !isEmpty(flowCompletionConfigs)
        ? flowCompletionConfigs
        : passwordRecoveryFlowConfig?.flowCompletionConfigs;

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography>
                <Trans i18nKey="flows:passwordRecovery.steps.end.description">
                    The <strong>End Screen</strong> defines what happens once the password recovery flow is completed.
                    It allows you to control the user&apos;s final experience by selecting one of the following
                    outcomes:
                </Trans>
            </Typography>
            { metadata?.workflowEnabled && (
                <Alert severity="warning">
                    <Typography variant="h6">{ t("flows:core.workflowAlert.title") }</Typography>
                    <Typography>
                        <Trans i18nKey="flows:core.workflowAlert.description">
                            A workflow is engaged for this flow. The following settings will not take effect until the
                            workflow is disabled.
                        </Trans>
                        { hasApprovalWorkflowReadPermissions && (
                            <Typography sx={ { marginTop: 1 } }>
                                <Trans i18nKey="flows:core.workflowAlert.navigation">
                                    Click
                                    <Link
                                        sx={ { cursor: "pointer" } }
                                        onClick={ () => {
                                            history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOWS"))
                                        } }
                                    >
                                        here
                                    </Link>
                                    to have a look at the currently engaged workflows.
                                </Trans>
                            </Typography>
                        ) }
                    </Typography>
                </Alert>
            ) }
            <Box sx={ { display: "flex", flexDirection: "column", gap: 1 } }>
                { metadata?.supportedFlowCompletionConfigs?.includes("isAutoLoginEnabled") && (
                    <Box>
                        <FormControlLabel
                            label={ t("flows:passwordRecovery.steps.end.autoLogin.label") }
                            control={
                                (<Checkbox
                                    checked={ configs?.isAutoLoginEnabled === "true" }
                                    disabled={ metadata?.workflowEnabled }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        setFlowCompletionConfigs({
                                            ...configs,
                                            isAutoLoginEnabled: event.target.checked ? "true" : "false"
                                        });
                                    } }
                                />)
                            }
                        />
                        <FormHelperText>{ t("flows:passwordRecovery.steps.end.autoLogin.hint") }</FormHelperText>
                    </Box>
                ) }
                { metadata?.supportedFlowCompletionConfigs?.includes("isFlowCompletionNotificationEnabled") && (
                    <Box>
                        <FormControlLabel
                            label={ t("flows:passwordRecovery.steps.end.flowCompletionNotification.label") }
                            control={
                                (<Checkbox
                                    checked={ configs?.isFlowCompletionNotificationEnabled === "true" }
                                    disabled={ metadata?.workflowEnabled }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        setFlowCompletionConfigs({
                                            ...configs,
                                            isFlowCompletionNotificationEnabled: event.target.checked ? "true" : "false"
                                        });
                                    } }
                                />)
                            }
                        />
                        <FormHelperText>
                            { t("flows:passwordRecovery.steps.end.flowCompletionNotification.hint") }
                        </FormHelperText>
                    </Box>
                ) }
            </Box>
        </Stack>
    );
};

export default FlowCompletionProperties;
