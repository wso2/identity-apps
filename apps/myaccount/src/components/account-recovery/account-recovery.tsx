/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { EmailRecovery, SecurityQuestionsComponent } from "./options";
import { ApplicationConstants } from "../../constants";
import { AlertInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { SettingsSection } from "../shared";

/**
 * Prop types for AccountRecoveryComponent component.
 */
interface AccountRecoveryProps extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * The AccountRecoveryComponent component in the Settings section
 *
 * @param {AccountRecoveryProps} props
 * @return {JSX.Element}
 */
export const AccountRecoveryComponent: React.FunctionComponent<AccountRecoveryProps> = (
    props: AccountRecoveryProps
): JSX.Element => {
    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    return (
        <SettingsSection
            description={ t("userPortal:sections.accountRecovery.description") }
            header={ t("userPortal:sections.accountRecovery.heading") }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    {
                        hasRequiredScopes(
                            featureConfig?.security,
                            featureConfig?.security?.scopes?.read,
                            allowedScopes
                        ) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY_CHALLENGE_QUESTIONS")
                        )
                        ? (
                            <SecurityQuestionsComponent onAlertFired={ onAlertFired } />
                        )
                        : null
                    }
                </List.Item>
                <List.Item className="inner-list-item">
                    {
                        hasRequiredScopes(
                            featureConfig?.security,
                            featureConfig?.security?.scopes?.read,
                            allowedScopes
                        ) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY_EMAIL_RECOVERY")
                        )
                        ? (
                            <EmailRecovery onAlertFired={ onAlertFired } />
                        )
                        : null
                    }
                </List.Item>
            </List>
        </SettingsSection>
    );
};
