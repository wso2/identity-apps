/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

// eslint-disable-next-line no-restricted-imports
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { isTypingDNAEnabled } from "@wso2is/selfcare.core.v1/api";
import { SettingsSection } from "@wso2is/selfcare.core.v1/components";
import { AppConstants } from "@wso2is/selfcare.core.v1/constants/app-constants";
import { AlertInterface, FeatureConfigInterface } from "@wso2is/selfcare.core.v1/models";
import { AppState } from "@wso2is/selfcare.core.v1/store";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { TypingDNA } from "./data";

/**
 * Prop types for the basic details component.
 */
interface LoginVerifyDataProps extends SBACInterface<FeatureConfigInterface> {

    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Login verifying data component.
 *
 * @param props - Props injected to the component
 * @returns Login verification component
 */
export const LoginVerifyingData: React.FunctionComponent<LoginVerifyDataProps> = (
    props: LoginVerifyDataProps
): JSX.Element => {

    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    const [ typingDNAEnabled, setTypingDNAEnabled ] = useState(false);

    const getTypingDNAEnabled = (): void => {
        if (isFeatureEnabled(
            featureConfig?.security,
            AppConstants.FEATURE_DICTIONARY.get("SECURITY_LOGIN_VERIFY_DATA_TYPINGDNA")
        )) {
            isTypingDNAEnabled().then(function(data: any) {
                setTypingDNAEnabled(data);
            }).catch(() => {
                setTypingDNAEnabled(false);
            });
        } else {
            setTypingDNAEnabled(false);
        }
    };

    useEffect(() => {
        getTypingDNAEnabled();
    }, []);

    return (
        <>
            {
                // TODO: Need to add a general check for hiding the section if no items available.
                typingDNAEnabled ?
                    (
                        <SettingsSection
                            description={ t("myAccount:components.loginVerifyData.description") }
                            header={ t("myAccount:components.loginVerifyData.heading") }
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
                                    ) : null
                                }
                            </List>
                        </SettingsSection>
                    )
                    : null
            }
        </>
    );
};
