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
import { SBACInterface } from "@wso2is/core/models";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, List, Segment, Grid } from "semantic-ui-react";
import { TypingDNA } from "./data";
import { AppConstants } from "../../constants";
import { AlertInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { SettingsSection } from "../shared";
import { IsTypingDNAEnabled } from "../../api";

/**
 * Prop types for the basic details component.
 */
interface LoginVerifyData extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}

export const LoginVerifyingData: React.FunctionComponent<LoginVerifyData> = (props: LoginVerifyData): JSX.Element => {
    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    const [TypingDNAEnabled, setTypingDNAEnabled] = useState(false);

    const getTypingDNAEnabled = (): void => {
        IsTypingDNAEnabled().then(function(data){
            setTypingDNAEnabled(data);
        }).catch((errorMessage) => {
            setTypingDNAEnabled(false);
        });
    };

    useEffect(() => {
        getTypingDNAEnabled();
    }, []);

    return (
    <>
    {
    ( TypingDNAEnabled ) ?
        (
        <SettingsSection
            description={t("myAccount:components.loginVerifyData.description")}
            header={t("myAccount:components.loginVerifyData.heading")}
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                { hasRequiredScopes(
                    featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes) &&
                    isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("SECURITY_LOGIN_VERIFY_DATA_TYPINGDNA")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <TypingDNA
                                featureConfig={ featureConfig }
                                onAlertFired={ onAlertFired }
                            />
                        </List.Item>
                    ) : null }
            </List>
        </SettingsSection>
        ) : null
    }
    </>
    );
};
