/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { BackupCodeAuthenticator, FIDOAuthenticator, SMSOTPAuthenticator, TOTPAuthenticator } from "./authenticators";
import { getEnabledAuthenticators } from "../../api";
import { AppConstants } from "../../constants";
import { commonConfig } from "../../extensions";
import { 
    AlertInterface, 
    AlertLevels,
    EnabledAuthenticatorsInterface, 
    FeatureConfigInterface 
} from "../../models";
import { AppState } from "../../store";
import { getProfileInformation } from "../../store/actions";
import { CommonUtils } from "../../utils";
import { SettingsSection } from "../shared";
import { UserSessionTerminationModal } from "../user-sessions";

/**
 * Prop types for the basic details component.
 * Also see {@link MultiFactorAuthentication.defaultProps}
 */
interface MfaProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    userStore?: string;
}

export const MultiFactorAuthentication: React.FunctionComponent<MfaProps> = (props: MfaProps): React.ReactElement => {
    const {
        onAlertFired,
        featureConfig,
        userStore,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);
    const isBackupCodeForced: boolean = useSelector((state: AppState) => state?.config?.ui?.forceBackupCode);
    const enableMFAUserWise: boolean = useSelector((state: AppState) => state?.config?.ui?.enableMFAUserWise);
    
    const [ enabledAuthenticators, setEnabledAuthenticators ] = useState<Array<string>>([]);
    const [ isTOTPEnabled, setIsTOTPEnabled ] = useState<boolean>(false);
    const [ isBackupCodesConfigured, setIsBackupCodesConfigured ] = useState<boolean>(false);
    const [ initBackupCodeFlow, setInitBackupCodeFlow ] = useState<boolean>(false);
    const [ showSessionTerminationModal, setShowSessionTerminationModal ] = useState<boolean>(false);
    const [ showModal, setShowModal ] = useState<boolean>(false);

    const translateKey: string = "myAccount:components.mfa.backupCode.";
    const totpAuthenticatorName: string = "totp";
    const backupCodeAuthenticatorName = "backup-code-authenticator";

    /**
     * Fetch enabled authenticators and set to state.
     */
    useEffect(() => {
        getEnabledAuthenticators()
            .then((authenticators: EnabledAuthenticatorsInterface) => {
                const authenticatorList: string[] = authenticators?.enabledAuthenticators?.split(",") ?? [];
                                
                setEnabledAuthenticators(authenticatorList);
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(translateKey + "notifications.retrieveAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.retrieveAuthenticatorError.error.message")
                });
            });
    }, []);

    /**
     * Check whether the TOTP authenticator is enabled.
     */
    useEffect(() => {
        setIsTOTPEnabled(enabledAuthenticators?.includes(totpAuthenticatorName) ?? false);
        setIsBackupCodesConfigured(enabledAuthenticators?.includes(backupCodeAuthenticatorName) ?? false);
    }, [ enabledAuthenticators ]);

    /**
     * Delay the session termination modal.
     */
    useEffect(() => {
        if (showSessionTerminationModal) {
            setTimeout(() => {
                setShowModal(showSessionTerminationModal);
            }, 1500);
        } else {
            setShowModal(showSessionTerminationModal);
        }
    }, [ showSessionTerminationModal ]);

    /**
     * Reset init backup code state, when the backup code setup flow is completed.
     */
    const handleBackupCodeFlowCompleted = (): void => {
        setInitBackupCodeFlow(false);
    };

    /**
     * Check if the login tenant is super tenant or not?
     * 
     * @returns True if login tenant is super tenant.
     */
    const isSuperTenantLogin = (): boolean => {
        return AppConstants.getTenant() === AppConstants.getSuperTenant();
    };

    /**
     * Update state when the authenticator list is updated.
     * @param updatedAuthenticators - Enabled authenticator list after updating.
     */
    const handleEnabledAuthenticatorsUpdated = (updatedAuthenticators: Array<string>): void => {
        setEnabledAuthenticators(updatedAuthenticators);
        dispatch(getProfileInformation(true));
    };

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
                                handleSessionTerminationModalVisibility={ 
                                    () => setShowSessionTerminationModal(true) 
                                }
                            />
                        </List.Item>
                    ) : null }

                { hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_FIDO")
                    ) && commonConfig?.utils?.isFIDOEnabled(userStore) ? (
                        <List.Item className="inner-list-item">
                            <FIDOAuthenticator 
                                onAlertFired={ onAlertFired } 
                                handleSessionTerminationModalVisibility={ 
                                    () => setShowSessionTerminationModal(true) 
                                }
                            />
                        </List.Item>
                    ) : null }

                { hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA_TOTP")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <TOTPAuthenticator
                                enabledAuthenticators={ enabledAuthenticators }
                                onAlertFired={ onAlertFired }
                                isBackupCodeForced={ isBackupCodeForced && enableMFAUserWise }
                                isSuperTenantLogin={ isSuperTenantLogin() }
                                onEnabledAuthenticatorsUpdated={ handleEnabledAuthenticatorsUpdated }
                                triggerBackupCodesFlow={ () => setInitBackupCodeFlow(true) }
                                handleSessionTerminationModalVisibility={ 
                                    () => setShowSessionTerminationModal(true) 
                                }
                            />
                            { isSuperTenantLogin() && isTOTPEnabled && isBackupCodesConfigured
                                ? (
                                    <BackupCodeAuthenticator 
                                        onAlertFired={ onAlertFired }
                                        initBackupCodeFlow={ initBackupCodeFlow }
                                        onBackupFlowCompleted={ handleBackupCodeFlowCompleted }
                                        handleSessionTerminationModalVisibility={ 
                                            () => setShowSessionTerminationModal(true) 
                                        }
                                    />
                                ) : null
                            }
                        </List.Item>
                    ) : null }
            </List>
            <UserSessionTerminationModal 
                isModalOpen={ showModal } 
                handleModalClose={ () => setShowSessionTerminationModal(false) }
            />
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
