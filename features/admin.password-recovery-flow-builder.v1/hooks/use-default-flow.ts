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

import useAuthenticationFlowBuilderCore
    from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { useMemo } from "react";

/**
 * Hook to resolve the default password recovery flow template based on the
 * connector configuration metadata.
 *
 * @param templates - Available templates list.
 * @returns Resolved default template.
 */
const useDefaultFlow = (templates: Template[]): Template => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    return useMemo(() => {
        if (!templates || templates.length === 0) {
            return null;
        }

        const connectorConfig: any = metadata?.connectorConfigs ?? {};

        const emailOTPEnabled: boolean = connectorConfig.passwordRecoveryEmailOtpEnabled === true
            || connectorConfig.passwordRecoveryEmailOtpEnabled === "true";
        const smsOTPEnabled: boolean = connectorConfig.passwordRecoverySmsOtpEnabled === true
            || connectorConfig.passwordRecoverySmsOtpEnabled === "true";
        const magicLinkEnabled: boolean = connectorConfig.passwordRecoveryMagicLinkEnabled === true
            || connectorConfig.passwordRecoveryMagicLinkEnabled === "true";

        if (magicLinkEnabled) {
            return templates.find(
                (template: Template) =>
                    template.type === "PASSWORD_RECOVERY_WITH_MAGIC_LINK"
            );
        }

        if (smsOTPEnabled && emailOTPEnabled) {
            return templates.find(
                (template: Template) =>
                    template.type === "PASSWORD_RECOVERY_WITH_SMS_OR_EMAIL_OTP_AND_PASSWORD_RESET"
            );
        }

        if (smsOTPEnabled) {
            return templates.find(
                (template: Template) =>
                    template.type === "PASSWORD_RECOVERY_WITH_SMS_OTP_AND_PASSWORD_RESET"
            );
        }

        // Default to the basic (email OTP) template.
        return templates.find((template: Template) => template.type === TemplateTypes.Basic);
    }, [ metadata, templates ]);
};

export default useDefaultFlow;
