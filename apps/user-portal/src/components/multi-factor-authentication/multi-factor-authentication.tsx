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
import { List } from "semantic-ui-react";
import { FIDOAuthenticator, SMSOTPAuthenticator, TOTPAuthenticator } from "./authenticators";
import { ApplicationConstants } from "../../constants";
import { AlertInterface, FeatureConfigInterface } from "../../models";
import { SettingsSection } from "../shared";

/**
 * Prop types for the basic details component.
 */
interface MfaProps  extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}

export const MultiFactorAuthentication: React.FunctionComponent<MfaProps> = (props: MfaProps): JSX.Element => {
    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;

    return (
        <SettingsSection
            description={ t("userPortal:sections.mfa.description") }
            header={ t("userPortal:sections.mfa.heading") }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    {
                        hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_SMS")
                        )
                        ? (
                            <SMSOTPAuthenticator onAlertFired={ onAlertFired } />
                        )
                        : null
                    }
                </List.Item>
                <List.Item className="inner-list-item">
                    {
                        hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_FIDO")
                        )
                        ? (
                            <FIDOAuthenticator onAlertFired={ onAlertFired } />
                        )
                        : null
                    }
                </List.Item>
                <List.Item className="inner-list-item">
                    {
                        hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read) &&
                        isFeatureEnabled(
                            featureConfig?.security,
                            ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_TOTP")
                        )
                        ? (
                            <TOTPAuthenticator onAlertFired={ onAlertFired } />
                        )
                        : null
                    }
                </List.Item>
            </List>
        </SettingsSection>
    );
};
