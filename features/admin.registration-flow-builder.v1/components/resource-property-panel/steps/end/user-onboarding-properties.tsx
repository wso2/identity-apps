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

import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Box from "@oxygen-ui/react/Box";
import Alert from "@oxygen-ui/react/Alert";
import Typography from "@oxygen-ui/react/Typography";
import useGetFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-config";
import { CommonResourcePropertiesPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import isEmpty from "lodash-es/isEmpty";

/**
 * Props interface of {@link UserOnboardingProperties}
 */
export type UserOnboardingPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * User Onboarding widget properties component.
 *
 * @param props - Props injected to the component.
 * @returns UserOnboardingProperties component.
 */
const UserOnboardingProperties: FunctionComponent<UserOnboardingPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "user-onboarding-properties-component",
    onChange
}: UserOnboardingPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { flowCompletionConfigs, setFlowCompletionConfigs } = useAuthenticationFlowBuilderCore();
    const { data: registrationFlowConfig } = useGetFlowConfig(FlowTypes.REGISTRATION);

    const configs = !isEmpty(flowCompletionConfigs) ? flowCompletionConfigs : registrationFlowConfig?.flowCompletionConfigs;

    return (
        <Stack gap={2} data-componentid={componentId}>
            <Typography>
                <Alert severity="info">
                    <Trans i18nKey="flows:registrationFlow.steps.end.description">
                        The <strong>End Screen</strong> defines what happens once the flow is completed. It allows you to control the user&apos;s final experience by selecting one of the following outcomes:
                    </Trans>
                </Alert>
            </Typography>
            <FormControlLabel
                label={ t("flows:registrationFlow.steps.end.accountVerification.label") }
                control={
                    <Checkbox
                        checked={ configs?.isEmailVerificationEnabled === "true" }
                        onChange={(event) => {
                            setFlowCompletionConfigs({
                                ...configs,
                                isEmailVerificationEnabled: event.target.checked ? "true" : "false"
                            });
                        }}
                    />
                }
            />
            <FormHelperText>{ t("flows:registrationFlow.steps.end.accountVerification.hint") }</FormHelperText>
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                <FormControlLabel
                    label={ t("flows:registrationFlow.steps.end.accountActivation.activateImmediately.label") }
                    control={
                        <Checkbox
                            checked={ configs?.isAccountLockOnCreationEnabled === "false" }
                            onChange={(event) => {
                                setFlowCompletionConfigs({
                                    ...configs,
                                    isAccountLockOnCreationEnabled: event.target.checked ? "false" : "true"
                                });
                            }}
                        />
                    }
                />
                <FormHelperText>{ t("flows:registrationFlow.steps.end.accountActivation.activateImmediately.hint") }</FormHelperText>
            </Box>
            <FormControlLabel
                label={ t("flows:registrationFlow.steps.end.autoLogin.label") }
                control={
                    <Checkbox
                        checked={ configs?.isAutoLoginEnabled === "true" }
                        onChange={(event) => {
                            setFlowCompletionConfigs({
                                ...configs,
                                isAutoLoginEnabled: event.target.checked ? "true" : "false"
                            });
                        }}
                    />
                }
            />
            <FormHelperText>{ t("flows:registrationFlow.steps.end.autoLogin.hint") }</FormHelperText>
            <FormControlLabel
                label={ t("flows:registrationFlow.steps.end.accountFlowCompletion.label") }
                control={
                    <Checkbox
                        checked={ configs?.isFlowCompletionNotificationEnabled === "true" }
                        onChange={(event) => {
                            setFlowCompletionConfigs({
                                ...configs,
                                isFlowCompletionNotificationEnabled: event.target.checked ? "true" : "false"
                            });
                        }}
                    />
                }
            />
            <FormHelperText>{ t("flows:registrationFlow.steps.end.accountFlowCompletion.hint") }</FormHelperText>
        </Stack>
    );
};

export default UserOnboardingProperties;
