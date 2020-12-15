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
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { FederatedAssociations, LinkedAccounts, Profile, ProfileExport } from "../components";
import { AppConstants } from "../constants";
import { InnerPageLayout } from "../layouts";
import { AlertInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";

/**
 * Personal Info page.
 *
 * @return {React.ReactElement}
 */
const PersonalInfoPage = (): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <InnerPageLayout
            pageTitle={ t("myAccount:pages.personalInfo.title") }
            pageDescription={ t("myAccount:pages.personalInfo.subTitle") }
        >
            <Divider hidden/>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(
                                accessConfig?.personalInfo, accessConfig?.personalInfo?.scopes?.read, allowedScopes
                            ) &&
                            isFeatureEnabled(
                                accessConfig?.personalInfo,
                                AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_PROFILE")
                            )
                            ? (
                                <Profile
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(
                                accessConfig?.personalInfo, accessConfig?.personalInfo?.scopes?.read, allowedScopes
                            ) &&
                            isFeatureEnabled(
                                accessConfig?.personalInfo,
                                AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_LINKED_ACCOUNTS")
                            )
                            ? (
                                <LinkedAccounts onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(
                                accessConfig?.personalInfo, accessConfig?.personalInfo?.scopes?.read, allowedScopes
                            ) &&
                            isFeatureEnabled(
                                accessConfig?.personalInfo,
                                AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_EXTERNAL_LOGINS")
                            )
                            ? (
                                <FederatedAssociations onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(
                                accessConfig?.personalInfo, accessConfig?.personalInfo?.scopes?.read, allowedScopes
                            ) &&
                            isFeatureEnabled(
                                accessConfig?.personalInfo,
                                AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_EXPORT_PROFILE")
                            )
                            ? (
                                <ProfileExport onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default PersonalInfoPage;
