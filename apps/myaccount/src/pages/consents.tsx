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

import Box from "@oxygen-ui/react/Box";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps } from "react-router";
import { Dispatch } from "redux";
import { Consents, MarketingConsent, PolicyConsent } from "../components";
import { AppConstants } from "../constants";
import { AlertInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { addAlert } from "../store/actions";

interface ConsentsPagePropsInterface extends IdentifiableComponentInterface, RouteProps {}

const ConsentsPage: FunctionComponent<ConsentsPagePropsInterface> = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    const handleAlerts: (_alert: AlertInterface) => void = useCallback(
        (alert: AlertInterface): void => {
            dispatch(addAlert(alert));
        },
        [ dispatch ]
    );

    return (
        <PageLayout
            pageTitle={ t("myAccount:pages.consents.title") }
            title={ t("myAccount:pages.consents.title") }
            description={ t("myAccount:pages.consents.subTitle") }
        >
            <Box display="flex" flexDirection="column" gap={ 2 }>
                { hasRequiredScopes(
                    accessConfig?.security,
                    accessConfig?.security?.scopes?.read,
                    allowedScopes
                ) && isFeatureEnabled(
                    accessConfig?.security,
                    AppConstants.FEATURE_DICTIONARY.get("SECURITY_CONSENTS")
                ) && <Consents onAlertFired={ handleAlerts } /> }
                <PolicyConsent onAlertFired={ handleAlerts } />
                <MarketingConsent onAlertFired={ handleAlerts } />
            </Box>
        </PageLayout>
    );
};

export default ConsentsPage;
