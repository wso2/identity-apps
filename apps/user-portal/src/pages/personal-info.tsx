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

import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { FederatedAssociations, LinkedAccounts, Profile, ProfileExport } from "../components";
import { EXPORT_PROFILE, EXTERNAL_LOGINS, LINKED_ACCOUNTS, PERSONAL_INFO, PROFILE } from "../constants";
import { AppConfig } from "../helpers";
import { InnerPageLayout } from "../layouts";
import { AlertInterface } from "../models";
import { addAlert } from "../store/actions";
import { checkEnabled } from "../utils";

/**
 * Personal Info page.
 *
 * @return {JSX.Element}
 */
export const PersonalInfoPage = (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const personalInfoConfig = useContext(AppConfig)[PERSONAL_INFO];

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <InnerPageLayout
            pageTitle={ t("views:pages.personalInfo.title") }
            pageDescription={ t("views:pages.personalInfo.subTitle") }
        >
            <Divider hidden/>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            checkEnabled(personalInfoConfig, PROFILE)
                            ? (
                                < Profile onAlertFired={ handleAlerts } />
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            checkEnabled(personalInfoConfig, LINKED_ACCOUNTS)
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
                            checkEnabled(personalInfoConfig, EXTERNAL_LOGINS)
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
                            checkEnabled(personalInfoConfig, EXPORT_PROFILE)
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
