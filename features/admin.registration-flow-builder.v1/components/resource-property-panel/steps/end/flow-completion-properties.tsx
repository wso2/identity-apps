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
import { Action } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { FlowCompletionConfigsInterface } from "@wso2is/admin.flow-builder-core.v1/models/flows";
import { StepData } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useNodesData, useReactFlow } from "@xyflow/react";
import isEmpty from "lodash-es/isEmpty";
import omit from "lodash-es/omit";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import RegistrationFlowExecutorConstants from "../../../../constants/registration-flow-executor-constants";
import { parseOrganizationRoleIds } from "../../../../utils/organization-role-utils";
import OrganizationRoleProperties from "./organization-role-properties";

/**
 * Props interface of {@link FlowCompletionProperties}
 */
type FlowCompletionPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
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
    const { flowCompletionConfigs, setFlowCompletionConfigs, metadata, lastInteractedStepId } =
        useAuthenticationFlowBuilderCore();
    const { data: registrationFlowConfig } = useGetFlowConfig(FlowTypes.REGISTRATION);
    const { updateNodeData } = useReactFlow();
    const endStep: Pick<Node, "data"> = useNodesData(lastInteractedStepId);

    const executorName: string = (endStep?.data as StepData)?.action?.executor?.name;
    const provisionTarget: unknown = (endStep?.data as StepData)?.action?.executor?.meta?.[
        RegistrationFlowExecutorConstants.PROVISION_TARGET_KEY
    ];
    const selectedRoleIds: string[] = parseOrganizationRoleIds((endStep?.data as StepData)?.action?.executor?.meta?.[
        RegistrationFlowExecutorConstants.ROLE_IDS_KEY
    ]);

    /**
     * Writes the provision target onto the END step's executor. The key is removed when unchecked, so a
     * flow that does not target the new organization carries no provision target at all.
     */
    const handleProvisionTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const provisionInNewOrganization: boolean = event.target.checked;

        updateNodeData(lastInteractedStepId, (node: Node) => {
            const action: Action = (node?.data as StepData)?.action;
            const meta: Record<string, unknown> = action?.executor?.meta || {};

            return {
                action: {
                    ...action,
                    executor: {
                        ...action?.executor,
                        meta: provisionInNewOrganization
                            ? {
                                ...meta,
                                [RegistrationFlowExecutorConstants.PROVISION_TARGET_KEY]:
                                    RegistrationFlowExecutorConstants.NEW_ORGANIZATION_PROVISION_TARGET
                            }
                            : omit(meta, RegistrationFlowExecutorConstants.PROVISION_TARGET_KEY)
                    }
                }
            };
        });
    };

    const handleRoleIdsChange: (_roleIds: string[]) => void = (roleIds: string[]): void => {
        updateNodeData(lastInteractedStepId, (node: Node) => {
            const action: Action = (node?.data as StepData)?.action;
            const meta: Record<string, unknown> = action?.executor?.meta || {};

            return {
                action: {
                    ...action,
                    executor: {
                        ...action?.executor,
                        meta: roleIds.length > 0
                            ? { ...meta, [RegistrationFlowExecutorConstants.ROLE_IDS_KEY]: JSON.stringify(roleIds) }
                            : omit(meta, RegistrationFlowExecutorConstants.ROLE_IDS_KEY)
                    }
                }
            };
        });
    };

    const approvalFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.approvalWorkflows
    );

    const hasApprovalWorkflowReadPermissions: boolean = useRequiredScopes(approvalFeatureConfig?.scopes?.read);

    const configs: FlowCompletionConfigsInterface = !isEmpty(flowCompletionConfigs)
        ? flowCompletionConfigs
        : registrationFlowConfig?.flowCompletionConfigs;

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography>
                <Trans i18nKey="flows:registrationFlow.steps.end.description">
                    The <strong>End Screen</strong> defines what happens once the flow is completed. It allows you
                    to control the user&apos;s final experience by selecting one of the following outcomes:
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
                    </Typography>
                    { hasApprovalWorkflowReadPermissions && (
                        <Typography sx={ { marginTop: 1 } }>
                            <Trans i18nKey="flows:core.workflowAlert.navigation">
                                Click
                                <Link
                                    sx={ { cursor: "pointer" } }
                                    onClick={ () => {
                                        history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOWS"));
                                    } }
                                >
                                    here
                                </Link>
                                to have a look at the currently engaged workflows.
                            </Trans>
                        </Typography>
                    ) }
                </Alert>
            ) }
            <Box sx={ { display: "flex", flexDirection: "column", gap: 1 } }>
                { metadata?.supportedFlowCompletionConfigs?.includes("isEmailVerificationEnabled") && (
                    <Box>
                        <FormControlLabel
                            label={ t("flows:registrationFlow.steps.end.accountVerification.label") }
                            control={
                                (<Checkbox
                                    checked={ configs?.isEmailVerificationEnabled === "true" }
                                    disabled={ metadata?.workflowEnabled }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        const newConfigs: Record<string, unknown> = {
                                            ...configs,
                                            isEmailVerificationEnabled: event.target.checked ? "true" : "false"
                                        };

                                        // If email verification is disabled, auto-login should also be disabled
                                        // and account lock on creation should be enabled (activate immediately
                                        // should be unchecked)
                                        if (!event.target.checked) {
                                            newConfigs.isAutoLoginEnabled = "false";
                                            newConfigs.isAccountLockOnCreationEnabled = "true";
                                        }

                                        setFlowCompletionConfigs(newConfigs);
                                    } }
                                />)
                            }
                        />
                        <FormHelperText>
                            { t("flows:registrationFlow.steps.end.accountVerification.hint") }
                        </FormHelperText>
                        { !metadata?.workflowEnabled && (
                            <Alert severity="warning">
                                { t("flows:registrationFlow.steps.end.accountVerification.warning") }
                            </Alert>
                        ) }
                    </Box>
                ) }
                { metadata?.supportedFlowCompletionConfigs?.includes("isAccountLockOnCreationEnabled") && (
                    <Box sx={ { display: "flex", flexDirection: "column", ml: 3 } }>
                        <FormControlLabel
                            label={ t("flows:registrationFlow.steps.end.accountActivation.activateImmediately.label") }
                            control={
                                (<Checkbox
                                    checked={ configs?.isAccountLockOnCreationEnabled === "false" }
                                    disabled={
                                        metadata?.workflowEnabled || configs?.isEmailVerificationEnabled !== "true"
                                    }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        const newConfigs: Record<string, unknown> = {
                                            ...configs,
                                            isAccountLockOnCreationEnabled: event.target.checked ? "false" : "true"
                                        };

                                        // If account is set to be locked on creation, auto-login should be disabled
                                        if (!event.target.checked) {
                                            newConfigs.isAutoLoginEnabled = "false";
                                        }

                                        setFlowCompletionConfigs(newConfigs);
                                    } }
                                />)
                            }
                        />
                        <FormHelperText>
                            { t("flows:registrationFlow.steps.end.accountActivation.activateImmediately.hint") }
                        </FormHelperText>
                    </Box>
                ) }
                { metadata?.supportedFlowCompletionConfigs?.includes("isAutoLoginEnabled") && (
                    <Box>
                        <FormControlLabel
                            label={ t("flows:registrationFlow.steps.end.autoLogin.label") }
                            control={
                                (<Checkbox
                                    checked={ configs?.isAutoLoginEnabled === "true" &&
                                        !(configs?.isEmailVerificationEnabled === "true"
                                            && configs?.isAccountLockOnCreationEnabled === "true" ) }
                                    disabled={
                                        metadata?.workflowEnabled ||
                                        (configs?.isEmailVerificationEnabled === "true"
                                            && configs?.isAccountLockOnCreationEnabled === "true")
                                    }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        setFlowCompletionConfigs({
                                            ...configs,
                                            isAutoLoginEnabled: event.target.checked ? "true" : "false"
                                        });
                                    } }
                                />)
                            }
                        />
                        <FormHelperText>{ t("flows:registrationFlow.steps.end.autoLogin.hint") }</FormHelperText>
                    </Box>
                ) }
                { metadata?.supportedFlowCompletionConfigs?.includes("isFlowCompletionNotificationEnabled") && (
                    <Box>
                        <FormControlLabel
                            label={ t("flows:registrationFlow.steps.end.accountFlowCompletion.label") }
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
                            { t("flows:registrationFlow.steps.end.accountFlowCompletion.hint") }
                        </FormHelperText>
                    </Box>
                ) }
                { executorName === RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR && (
                    <Box data-componentid={ `${componentId}-provision-target` }>
                        <FormControlLabel
                            label={ t("flows:registrationFlow.steps.end.provisionTarget.label") }
                            control={
                                (<Checkbox
                                    checked={
                                        provisionTarget ===
                                            RegistrationFlowExecutorConstants.NEW_ORGANIZATION_PROVISION_TARGET
                                    }
                                    onChange={ handleProvisionTargetChange }
                                />)
                            }
                        />
                        <FormHelperText>
                            { t("flows:registrationFlow.steps.end.provisionTarget.hint") }
                        </FormHelperText>
                    </Box>
                ) }
                { executorName === RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR && (
                    <OrganizationRoleProperties
                        key={ lastInteractedStepId }
                        selectedRoleIds={ selectedRoleIds }
                        onChange={ handleRoleIdsChange }
                        data-componentid={ `${componentId}-organization-roles` }
                    />
                ) }
            </Box>
        </Stack>
    );
};

export default FlowCompletionProperties;
