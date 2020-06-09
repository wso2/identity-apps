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
import React  from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import {
    AccountRecoveryComponent,
    ChangePassword,
    Consents,
    MultiFactorAuthentication,
    UserSessionsComponent
} from "../components";
import { ApplicationConstants } from "../constants";
import { InnerPageLayout } from "../layouts";
import { AlertInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";

/**
 * Account security page.
 *
 * @return {JSX.Element}
 */
export const AccountSecurityPage = (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.features);

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <InnerPageLayout
            pageTitle={ t("views:pages.security.title") }
            pageDescription={ t("views:pages.security.subTitle") }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read) &&
                            isFeatureEnabled(
                                accessConfig?.security,
                                ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_CHANGE_PASSWORD")
                            )
                            ? (
                                <ChangePassword onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read) &&
                            isFeatureEnabled(
                                accessConfig?.security,
                                ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY")
                            )
                            ? (
                                <AccountRecoveryComponent
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read) &&
                            isFeatureEnabled(
                                accessConfig?.security,
                                ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_MFA")
                            )
                            ? (
                                <MultiFactorAuthentication onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read) &&
                            isFeatureEnabled(
                                accessConfig?.security,
                                ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_ACTIVE_SESSIONS")
                            )
                            ? (
                                <UserSessionsComponent onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read) &&
                            isFeatureEnabled(
                                accessConfig?.security,
                                ApplicationConstants.FEATURE_DICTIONARY.get("SECURITY_CONSENTS")
                            )
                            ? (
                                <Consents onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
