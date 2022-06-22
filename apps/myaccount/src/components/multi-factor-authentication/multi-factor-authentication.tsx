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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { BackupCodeAuthenticator, FIDOAuthenticator, SMSOTPAuthenticator, TOTPAuthenticator } from "./authenticators";
import { getBackupCodes, getEnabledAuthenticators, updateEnabledAuthenticators } from "../../api";
import { AppConstants } from "../../constants";
import { AlertInterface, AlertLevels, EnabledAuthenticatorsInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { CommonUtils } from "../../utils";
import { SettingsSection } from "../shared";

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
    const [ isBackupCodeDisabled, setIsBackupCodeDisabled ] = useState<boolean>(true);
    const [ showBackupWizard, setShowBackupWizard ] = useState<boolean>(false);
    const [ openBackupWizard, setOpenBackupWizard ] = useState<boolean>(false);
    const [ backupCodes, setBackupCodes ] = useState<Array<string>>();

    const translateKey: string = "myAccount:components.mfa.backupCode.";
    const backupAuthenticatorName: string = "Backup Code Authenticator";

    /**
     * Load backup codes when opening the modal.
     */
    useEffect(()=> {
        
        if (enableMFAUserWise && isSuperTenantLogin()) {
            getBackupCodes()
                .then((response) => {
                    setBackupCodes(response.backupCodes);
                }).catch((errorMessage)=> {
                    onAlertFired({
                        description: t(
                            translateKey +
                            "notifications.retrieveError.error.description",
                            {
                                error: errorMessage
                            }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            translateKey + "notifications.retrieveError.error.message"
                        )
                    });
                });
        }
        
    }, []);

    /**
    * Get enabled authenticators and check if backup authenticator is enabled.
    */
    useEffect(() => {
        if (enableMFAUserWise && isSuperTenantLogin()) {
            getEnabledAuthenticators().then((authenticators: EnabledAuthenticatorsInterface) => {
                let authenticatorList: Array<string>;

                if (authenticators.enabledAuthenticators !== undefined ) {
                    authenticatorList = authenticators.enabledAuthenticators.split(",");
                } else {
                    authenticatorList = [];
                }

                if (authenticatorList.length <= 1 && authenticatorList.includes(backupAuthenticatorName)) {
                    authenticatorList.splice(authenticatorList.indexOf(backupAuthenticatorName), 1);
                    const enabledAuthenticators = authenticatorList.join(",");

                    updateEnabledAuthenticators(enabledAuthenticators)
                        .then(() => {
                            setIsBackupCodeDisabled(true);
                        })
                        .catch((errorMessage)=> {
                            onAlertFired({
                                description: t(translateKey + 
                                    "notifications.updateAuthenticatorError.error.description", {
                                    error: errorMessage
                                }),
                                level: AlertLevels.ERROR,
                                message: t(translateKey + "notifications.updateAuthenticatorError.error.message")
                            });
                        });
                } else if (authenticatorList.length > 1){
                    setIsBackupCodeDisabled(false);
                } else {
                    setIsBackupCodeDisabled(true);
                }

            }).catch((errorMessage) => {
                onAlertFired({
                    description: t(translateKey + "notifications.retrieveAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.retrieveAuthenticatorError.error.message")
                });
            });
        }
   
    }, [ isBackupCodeDisabled ]);

    /**
     * Check if the login tenant is super tenant or not?
     * 
     * @returns True if login tenant is super tenant.
     */
    const isSuperTenantLogin = (): boolean => {
        return AppConstants.getTenant() === AppConstants.getSuperTenant();
    };

    const backupWizard = (): JSX.Element => {
        
        return (<BackupCodeAuthenticator
            onAlertFired={ onAlertFired }
            isInit={ false }
            openWizard={ openBackupWizard }
            onOpenWizardToggle={ (isOpen : boolean) => {setOpenBackupWizard(isOpen); } }
            onShowBackupCodeWizardToggle={ (show : boolean) => {setShowBackupWizard(show); } }
            backupCodes= { backupCodes }
            updateBackupCodes = { (backupCodesList) =>{setBackupCodes(backupCodesList);} }
        />);
    };

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.mfa.description") }
            header={ t("myAccount:sections.mfa.heading") }
            onPrimaryActionClick={ 
                (isSuperTenantLogin() && !isBackupCodeDisabled) ? 
                    () => { setOpenBackupWizard(true); } : 
                    null 
            }
            primaryAction={ (isSuperTenantLogin() && !isBackupCodeDisabled) ? t(translateKey + "heading") : "" }
        >
            { backupWizard() }
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
                                onBackupCodeAvailabilityToggle={ 
                                    (isEnabled: boolean) => (setIsBackupCodeDisabled(!isEnabled)) 
                                }
                                isBackupCodeForced={ forceBackupCode && enableMFAUserWise }
                                isSuperTenantLogin={ isSuperTenantLogin() }
                                backupCodes = { backupCodes }
                                updateBackupCodes = { (backupCodeList) => {setBackupCodes(backupCodeList);} }
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
