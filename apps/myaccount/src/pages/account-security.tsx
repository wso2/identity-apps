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
import React, {
    ReactElement,
    useEffect,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps } from "react-router";
import { Grid } from "semantic-ui-react";
import {
    AccountRecoveryComponent,
    ChangePassword,
    Consents,
    MultiFactorAuthentication,
    UserSessionsComponent
} from "../components";
import { AppConstants, CommonConstants } from "../constants";
import { InnerPageLayout } from "../layouts";
import { AlertInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";

/**
 * Account security page.
 *
 * @return {React.ReactElement}
 */
const AccountSecurityPage = (props: RouteProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const consentControl = useRef<HTMLDivElement>(null);
    const accountSecurity = useRef<HTMLDivElement>(null);
    const accountActivity = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            switch (props.location.hash) {
            case `#${ CommonConstants.CONSENTS_CONTROL }`:
                consentControl.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                break;
            case `#${ CommonConstants.ACCOUNT_ACTIVITY }`:
                accountActivity.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                break;
            case `#${ CommonConstants.ACCOUNT_SECURITY }`:
                accountSecurity.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                break;
        }
        }, 100);

    }, [ props.location ]);

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <InnerPageLayout
            pageTitle={ t("myAccount:pages.security.title") }
            pageDescription={ t("myAccount:pages.security.subTitle") }
        >
            <Grid>
                { !isReadOnlyUser &&
                    hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_CHANGE_PASSWORD")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <ChangePassword onAlertFired={ handleAlerts } />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { !isReadOnlyUser &&
                    hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACCOUNT_RECOVERY")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div ref={ accountSecurity }>
                                    <AccountRecoveryComponent
                                        featureConfig={ accessConfig }
                                        onAlertFired={ handleAlerts }
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_MFA")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <MultiFactorAuthentication
                                    featureConfig={ accessConfig }
                                    onAlertFired={ handleAlerts }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_ACTIVE_SESSIONS")
                    ) ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div ref={ accountActivity }>
                                    <UserSessionsComponent onAlertFired={ handleAlerts } />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }

                { hasRequiredScopes(accessConfig?.security, accessConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        accessConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_CONSENTS")
                    ) ? (

                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <div ref={ consentControl }>
                                    <Consents onAlertFired={ handleAlerts } />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }
            </Grid>
        </InnerPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AccountSecurityPage;
