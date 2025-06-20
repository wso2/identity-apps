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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationManagementConstants } from "../../constants/application-management";
import { AdvancedConfigurationsInterface } from "../../models/application";

const useAdvancedApplicationConfiguration = (config: AdvancedConfigurationsInterface, onSubmit: any) => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.applications
    );
    const isTrustedAppConsentRequired: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isTrustedAppConsentRequired
    );

    const isApplicationNativeAuthenticationEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_NATIVE_AUTHENTICATION")
    );
    const isTrustedAppsFeatureEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("TRUSTED_APPS")
    );

    const [ isFIDOTrustedAppsEnabled, setIsFIDOTrustedAppsEnabled ] = useState<boolean>(
        config?.trustedAppConfiguration?.isFIDOTrustedApp
    );
    const [ showFIDOConfirmationModal, setShowFIDOConfirmationModal ] = useState<boolean>(false);
    const [ thumbprints, setThumbprints ] = useState(config?.trustedAppConfiguration?.androidThumbprints?.join(","));
    const [ isConsentGranted, setIsConsentGranted ] = useState<boolean>(
        config?.trustedAppConfiguration?.isConsentGranted
    );

    /**
     * Handle FIDO activation value with confirmation. Deactivation is not confirmed
     */
    const handleFIDOActivation = (shouldActivate: boolean) => {
        shouldActivate ?
            (isTrustedAppConsentRequired ? setShowFIDOConfirmationModal(true) : setIsFIDOTrustedAppsEnabled(true))
            : setIsFIDOTrustedAppsEnabled(false);
    };

    /**
     * Update configuration.
     *
     * @param values - Form values.
     */
    const updateConfiguration = (values: AdvancedConfigurationsInterface): void => {
        let androidAttestationServiceCredentialsObject : JSON;

        try {
            if(!isEmpty(values.androidAttestationServiceCredentials)) {
                androidAttestationServiceCredentialsObject = JSON.parse(values.androidAttestationServiceCredentials);
            }
        } catch (ex: any) {
            dispatch(addAlert({
                description: "Unable to update the application configuration",
                level: AlertLevels.ERROR,
                message: t("Improper JSON format for Android Attestation Service Credentials")
            }));

            return;
        }

        // if apiBasedAuthentication is disabled, then disable clientAttestation as well.
        const enableClientAttestation: boolean = values.enableAPIBasedAuthentication
            ? values.enableClientAttestation
            : false;

        const data:any = {
            advancedConfigurations: {
                attestationMetaData: {
                    androidAttestationServiceCredentials: androidAttestationServiceCredentialsObject,
                    androidPackageName: enableClientAttestation ? values.androidPackageName : "",
                    appleAppId: enableClientAttestation ? values.appleAppId : "",
                    enableClientAttestation: enableClientAttestation
                },
                enableAPIBasedAuthentication: !!values.enableAPIBasedAuthentication,
                enableAuthorization: !!values.enableAuthorization,
                returnAuthenticatedIdpList: !!values.returnAuthenticatedIdpList,
                saas: !!values.saas,
                skipLoginConsent: !!values.skipConsentLogin,
                skipLogoutConsent: !!values.skipConsentLogout,
                trustedAppConfiguration: {
                    // androidPackageName and appleAppId is same as clientAttestation.
                    androidPackageName: values.enableFIDOTrustedApps ? values.androidPackageName : "",
                    androidThumbprints: values.enableFIDOTrustedApps ?
                        (isEmpty(thumbprints) ? [] : thumbprints.split(",")) : [],
                    appleAppId: values.enableFIDOTrustedApps ? values.appleAppId : "",
                    isConsentGranted: isConsentGranted,
                    isFIDOTrustedApp: values.enableFIDOTrustedApps
                }
            }
        };

        !applicationConfig.advancedConfigurations.showSaaS && delete data.advancedConfigurations.saas;
        !applicationConfig.advancedConfigurations.showEnableAuthorization &&
            delete data.advancedConfigurations.enableAuthorization;
        !applicationConfig.advancedConfigurations.showReturnAuthenticatedIdPs &&
            delete data.advancedConfigurations.returnAuthenticatedIdpList;

        onSubmit(data);
    };

    return {
        handleFIDOActivation,
        isApplicationNativeAuthenticationEnabled,
        isFIDOTrustedAppsEnabled,
        isTrustedAppConsentRequired,
        isTrustedAppsFeatureEnabled,
        setIsConsentGranted,
        setIsFIDOTrustedAppsEnabled,
        setShowFIDOConfirmationModal,
        setThumbprints,
        showFIDOConfirmationModal,
        thumbprints,
        updateConfiguration
    };
};

export default useAdvancedApplicationConfiguration;
