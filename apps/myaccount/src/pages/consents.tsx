/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteProps } from "react-router";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { Consents, PolicyConsent } from "../components";
import { AlertInterface } from "../models";
import { addAlert } from "../store/actions";

interface ConsentsPagePropsInterface extends TestableComponentInterface, RouteProps {}

const ConsentsPage: FunctionComponent<ConsentsPagePropsInterface> = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    return (
        <PageLayout
            pageTitle="Consents"
            title={ t("myAccount:pages.consents.title") }
            description={ t("myAccount:pages.consents.subTitle") }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Consents onAlertFired={ handleAlerts } />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <PolicyConsent onAlertFired={ handleAlerts } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

export default ConsentsPage;
