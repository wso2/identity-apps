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
import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { FIDOAuthenticator, SMSOTPAuthenticator, TOTPAuthenticator } from "./authenticators";
import { AppConstants } from "../../constants";
import { AlertLevels, AlertInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { CommonUtils } from "../../utils";
import { SettingsSection } from "../shared";
import {RenderBackupCodeWizard} from "./authenticators"
import {getEnabledAuthenticators, updateEnabledAuthenticators} from "../../api"
/**
 * Prop types for the basic details component.
 * Also see {@link MultiFactorAuthentication.defaultProps}
 */
interface MfaProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

export const MultiFactorAuthentication: React.FunctionComponent<MfaProps> = (props: MfaProps): JSX.Element => {

    const {
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);
    const forceBackupCode: boolean = useSelector((state: AppState) => state?.config?.ui?.forceBackupCode);
    const enableMFAUserWise: boolean = useSelector((state: AppState) => state?.config?.ui?.enableMFAUserWise);
    const [isBackupCodeDisabled, setIsBackupCodeDisabled] = useState<boolean>(true);
    const [showBackupWizard, setShowBackupWizard] = useState<boolean>(false)
    const [openBackupWizard, setOpenBackupWizard] = useState<boolean>(false)

    const translateKey = "myAccount:components.mfa.backupCode.";

    /**
    * Get enabled authenticators and check if backup authenticator is enabled.
    */
    useEffect(() => {
       getEnabledAuthenticators().then((response) => {
           const authenticators = response;
           let authenticatorList;
           if (authenticators !== undefined) {
               authenticatorList = authenticators.split(",");
           } else {
               authenticatorList = []
           }

           if (authenticatorList.length <= 1 && authenticatorList.includes("Backup Code Authenticator")) {
               authenticatorList.splice(authenticatorList.indexOf("Backup Code Authenticator"), 1)
               const enabledAuthenticators = authenticatorList.join(",");
               updateEnabledAuthenticators(enabledAuthenticators)
               .catch((errorMessage)=> {
                   onAlertFired({
                       description: t(translateKey + "notifications.updateAuthenticatorError.error.description", {
                           error: errorMessage
                       }),
                       level: AlertLevels.ERROR,
                       message: t(translateKey + "notifications.updateAuthenticatorError.error.message")
                   });
               });
           } else if (authenticatorList.length > 1) {
               setIsBackupCodeDisabled(false);
           }

       }).catch((errorMessage) => {
           onAlertFired({
               description: t(translateKey + "notifications.retrieveAuthenticatorError.error.description", {
                   error: errorMessage
               }),
               level: AlertLevels.ERROR,
               message: t(translateKey + "notifications.retrieveAuthenticatorError.error.message")
           });
       })
   
    }, [isBackupCodeDisabled])

    const backupWizard = (): JSX.Element => {
        
       return (<RenderBackupCodeWizard
           onAlertFired={onAlertFired}
           isInit={false}
           openWizard={openBackupWizard}
           onOpenWizardToggle={ (isOpen : boolean) => {setOpenBackupWizard(isOpen) }}
           onShowBackupCodeWizardToggle={ (show : boolean) => {setShowBackupWizard(show) }}
           />)
   }

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.mfa.description") }
            header={ t("myAccount:sections.mfa.heading") }
            onPrimaryActionClick={ !isBackupCodeDisabled ? () => {setOpenBackupWizard(true)} : null}
            primaryAction={ !isBackupCodeDisabled ? t(translateKey + "heading") : "" }
        >
            {backupWizard()}
            <List
                divided={ true }
                verticalAlign="middle"
                className="main-content-inner"
                data-testid={ `${testId}-list` }
            >
                { !CommonUtils.isProfileReadOnly(isReadOnlyUser)
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
                            <TOTPAuthenticator
                                onAlertFired={ onAlertFired }
                                onBackupCodeAvailabilityToggle={ (isEnabled: boolean) => (setIsBackupCodeDisabled(!isEnabled)) }
                                isBackupCodeForced={forceBackupCode && enableMFAUserWise}
                                isSuperTenantLogin={ AppConstants.getTenant() === AppConstants.getSuperTenant() }
                            />
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
