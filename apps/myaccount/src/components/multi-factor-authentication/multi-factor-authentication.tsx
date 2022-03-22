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
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { FIDOAuthenticator, SMSOTPAuthenticator, TOTPAuthenticator } from "./authenticators";
import { AppConstants } from "../../constants";
import { AlertInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { SettingsSection } from "../shared";

/**
 * Prop types for the basic details component.
 * Also see {@link MultiFactorAuthentication.defaultProps}
 */
interface MfaProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Converts the isReadOnlyUserString to a boolean variable
 * @return {boolean} True/False
 */
const convertToBoolean = (isReadOnlyUserString: any): boolean => {
    return (isReadOnlyUserString === "true");
};

export const MultiFactorAuthentication: React.FunctionComponent<MfaProps> = (props: MfaProps): JSX.Element => {

    const {
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.mfa.description") }
            header={ t("myAccount:sections.mfa.heading") }
        >
            <List
                divided={ true }
                verticalAlign="middle"
                className="main-content-inner"
                data-testid={ `${testId}-list` }
            >
                { !convertToBoolean(isReadOnlyUser)
                    && hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_SMS")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <SMSOTPAuthenticator
                                featureConfig={ featureConfig }
                                onAlertFired={ onAlertFired }
                            />
                        </List.Item>
                    ) : null }

                { hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_FIDO")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <FIDOAuthenticator onAlertFired={ onAlertFired } />
                        </List.Item>
                    ) : null }

                { hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_TOTP")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <TOTPAuthenticator onAlertFired={ onAlertFired } />
                        </List.Item>
                    ) : null }
            </List>
        </SettingsSection>
    );
};

/**
 * Default properties of {@link MultiFactorAuthentication}
 * See type definitions in {@link MfaProps}
 */
MultiFactorAuthentication.defaultProps = {
    "data-testid": "multi-factor-authentication"
};
