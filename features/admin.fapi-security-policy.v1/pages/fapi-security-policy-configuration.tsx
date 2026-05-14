/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, PageLayout, PrimaryButton } from "@wso2is/react-components";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { updateDcrFapiConfig } from "../api/update-dcr-fapi-config";
import { updateFapiConfig } from "../api/update-fapi-config";
import useGetDcrFapiConfig from "../api/use-get-dcr-fapi-config";
import useGetFapiConfig from "../api/use-get-fapi-config";
import {
    DcrConfigAPIResponseInterface,
    DcrPatchOperationInterface,
    FapiConfigAPIResponseInterface,
    FapiProfile
} from "../models/fapi-security-policy";
import FapiEnforcementSettings from "../components/fapi-enforcement-settings";
import SupportedFapiProfiles from "../components/supported-fapi-profiles";

/**
 * Props for the FAPI Security Policy configuration page.
 */
type FapiSecurityPolicyConfigurationPageInterface = IdentifiableComponentInterface;

/**
 * FAPI Security Policy configuration page.
 */
const FapiSecurityPolicyConfigurationPage: FunctionComponent<FapiSecurityPolicyConfigurationPageInterface> = (
    { "data-componentid": componentId = "fapi-security-policy-configuration-page" }:
        FapiSecurityPolicyConfigurationPageInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.server?.scopes?.update);

    // ── Local form state ──────────────────────────────────────────────────────
    const [ fapiEnabled, setFapiEnabled ] = useState<boolean>(true);
    const [ supportedProfiles, setSupportedProfiles ] = useState<FapiProfile[]>([]);
    const [ enableFapiEnforcement, setEnableFapiEnforcement ] = useState<boolean>(false);
    const [ dcrFapiProfile, setDcrFapiProfile ] = useState<FapiProfile>("FAPI1_ADVANCED");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // ── Data fetching ─────────────────────────────────────────────────────────
    const {
        data: fapiConfigData,
        error: fapiConfigError,
        isLoading: isFapiConfigLoading,
        mutate: mutateFapiConfig
    } = useGetFapiConfig<FapiConfigAPIResponseInterface, IdentityAppsApiException>(true);

    const {
        data: dcrConfigData,
        error: dcrConfigError,
        isLoading: isDcrConfigLoading,
        mutate: mutateDcrConfig
    } = useGetDcrFapiConfig<DcrConfigAPIResponseInterface, IdentityAppsApiException>(true);

    // ── Populate state from API responses ─────────────────────────────────────
    useEffect(() => {
        if (fapiConfigData) {
            setFapiEnabled(fapiConfigData.enabled);
            setSupportedProfiles(fapiConfigData.supportedProfiles ?? []);
        }
    }, [ fapiConfigData ]);

    useEffect(() => {
        if (dcrConfigData) {
            setEnableFapiEnforcement(dcrConfigData.enableFapiEnforcement);
            setDcrFapiProfile(dcrConfigData.fapiProfile ?? "FAPI1_ADVANCED");
        }
    }, [ dcrConfigData ]);

    // ── Error alerts ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (fapiConfigError) {
            dispatch(addAlert<AlertInterface>({
                description: t("fapiSecurityPolicy:notifications.getFapiConfig.error.description"),
                level: AlertLevels.ERROR,
                message: t("fapiSecurityPolicy:notifications.getFapiConfig.error.message")
            }));
        }
    }, [ fapiConfigError ]);

    useEffect(() => {
        if (dcrConfigError) {
            dispatch(addAlert<AlertInterface>({
                description: t("fapiSecurityPolicy:notifications.getDcrConfig.error.description"),
                level: AlertLevels.ERROR,
                message: t("fapiSecurityPolicy:notifications.getDcrConfig.error.message")
            }));
        }
    }, [ dcrConfigError ]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleProfileToggle = (profile: FapiProfile): void => {
        setSupportedProfiles((prev: FapiProfile[]) => {
            const next: FapiProfile[] = prev.includes(profile)
                ? prev.filter((p: FapiProfile) => p !== profile)
                : [ ...prev, profile ];

            if (dcrFapiProfile === profile && !next.includes(profile)) {
                setDcrFapiProfile(next[0] ?? "FAPI1_ADVANCED");
            }

            return next;
        });
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);

        const dcrPatchOps: DcrPatchOperationInterface[] = [
            { operation: "REPLACE", path: "/enableFapiEnforcement", value: enableFapiEnforcement },
            { operation: "REPLACE", path: "/fapiProfile", value: dcrFapiProfile }
        ];

        try {
            await updateFapiConfig({ enabled: fapiEnabled, supportedProfiles });
            await updateDcrFapiConfig(dcrPatchOps);

            mutateFapiConfig();
            mutateDcrConfig();
            dispatch(addAlert<AlertInterface>({
                description: t("fapiSecurityPolicy:notifications.updateConfig.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("fapiSecurityPolicy:notifications.updateConfig.success.message")
            }));
        } catch (error: unknown) {
            const apiError: IdentityAppsApiException = error as IdentityAppsApiException;

            dispatch(addAlert<AlertInterface>({
                description: apiError?.message
                    ?? t("fapiSecurityPolicy:notifications.updateConfig.error.description"),
                level: AlertLevels.ERROR,
                message: t("fapiSecurityPolicy:notifications.updateConfig.error.message")
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    const isLoading: boolean = isFapiConfigLoading || isDcrConfigLoading;

    return (
        <PageLayout
            title={ t("fapiSecurityPolicy:title") }
            pageTitle={ t("fapiSecurityPolicy:title") }
            description={ t("fapiSecurityPolicy:description") }
            backButton={ {
                onClick: onBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-layout` }
        >
            <Grid className="mt-2">
                <EmphasizedSegment className="form-wrapper" padded="very">
                    { isLoading
                        ? <ContentLoader />
                        : (
                            <>
                                { /* ── Content — disabled when FAPI is off ──────────────── */ }
                                <Box>
                                    { /* ── Supported FAPI Profiles ──────────────────────── */ }
                                    <SupportedFapiProfiles
                                        data-componentid={ `${ componentId }-profiles` }
                                        selectedProfiles={ supportedProfiles }
                                        onProfileToggle={ handleProfileToggle }
                                        isReadOnly={ isReadOnly }
                                        hasError={ supportedProfiles.length === 0 }
                                    />

                                    <Divider />

                                    { /* ── Dynamic Client Registration ─────────────────── */ }
                                    <Box mt={ 4 }>
                                        <Typography variant="h6" mb={ 2 }>
                                            { t("fapiSecurityPolicy:form.dcr.heading") }
                                        </Typography>
                                        <FapiEnforcementSettings
                                            data-componentid={ `${ componentId }-dcr` }
                                            enableFapiEnforcement={ enableFapiEnforcement }
                                            selectedProfile={ dcrFapiProfile }
                                            supportedProfiles={ supportedProfiles }
                                            onEnforcementToggle={ setEnableFapiEnforcement }
                                            onProfileChange={ setDcrFapiProfile }
                                        />
                                    </Box>
                                </Box>

                                { /* ── Action bar ───────────────────────────────────────── */ }
                                { !isReadOnly && (
                                    <Grid xs={ 8 } marginTop={ 4 }>
                                        <PrimaryButton
                                            size="small"
                                            onClick={ handleSubmit }
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting || supportedProfiles.length === 0 }
                                            ariaLabel={ t("fapiSecurityPolicy:form.buttons.update.ariaLabel") }
                                            data-componentid={ `${ componentId }-update-button` }
                                        >
                                            { t("common:update") }
                                        </PrimaryButton>
                                    </Grid>
                                ) }
                            </>
                        )
                    }
                </EmphasizedSegment>
            </Grid>
        </PageLayout>
    );
};

export default FapiSecurityPolicyConfigurationPage;
