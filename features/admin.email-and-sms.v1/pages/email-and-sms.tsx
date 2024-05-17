/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { EnvelopeIcon } from "@oxygen-ui/react-icons";
import Grid from "@oxygen-ui/react/Grid";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ReactComponent as SMSIcon } from "../../themes/default/assets/images/icons/sms-icon.svg";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { SettingsSection } from "../settings/settings-section";
import "./notification-channels.scss";

/**
 * Props for the Server Configurations page.
 */
type EmailAndSMSPageInterface = IdentifiableComponentInterface;

/**
 * Notification channel listing page.
 *
 * @param props - Props injected to the component.
 * @returns Notification channels listing page component.
 */
export const EmailAndSMSPage: FunctionComponent<EmailAndSMSPageInterface> = (
    props: EmailAndSMSPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentid } = props;

    const { t } = useTranslation();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    /**
     * Handle connector advance setting selection.
     */
    const handleSMSSelection = (): void => {
        history.push(AppConstants.getPaths().get("SMS_PROVIDER"));
    };

    const handleEmailSelection = (): void => {
        history.push(AppConstants.getPaths().get("EMAIL_PROVIDER"));
    };

    return (
        <PageLayout
            pageTitle={ t("extensions:develop.notificationChannel.heading") }
            title={ t("extensions:develop.notificationChannel.title") }
            description={ t("extensions:develop.notificationChannel.description") }
            data-testid={ `${componentid}-page-layout` }
        >
            <Grid container rowSpacing={ 3 } columnSpacing={ 3 }>
                { featureConfig.emailProviders?.enabled
                  && !(featureConfig?.emailProviders?.disabledFeatures?.includes("superTenantProvider"))
                  && (
                      <Grid xs={ 12 } md={ 6 } lg={ 4 }>
                          <SettingsSection
                              data-componentid={ "email-provider-card" }
                              description={ t("extensions:develop.emailProviders.description") }
                              icon={ <EnvelopeIcon size="small" className="icon"/> }
                              header={ t("extensions:develop.emailProviders.heading") }
                              onPrimaryActionClick={ isSuperOrganization() ? null : handleEmailSelection }
                              primaryAction={ isSuperOrganization() ? null : t("common:configure") }
                              placeholder={
                                  isSuperOrganization() ?
                                      (<Trans
                                          i18nKey={
                                              "extensions:develop.emailProviders.note"
                                          }
                                      >
                                    Email provider configurations for the super organization
                                    can only be updated through <strong>deployment.toml</strong>
                                      </Trans>) : null
                              }
                              connectorEnabled={ !isSuperOrganization() }
                          />
                      </Grid>
                  ) }

                { featureConfig.smsProviders?.enabled && (
                    <Grid xs={ 12 } md={ 6 } lg={ 4 }>
                        <SettingsSection
                            data-componentid={ "sms-provider-card" }
                            description={ t("smsProviders:description") }
                            icon={ <SMSIcon fill="white" /> }
                            header={
                                t("smsProviders:heading")
                            }
                            onPrimaryActionClick={ handleSMSSelection }
                            primaryAction={ t("common:configure") }
                            connectorEnabled
                        />
                    </Grid>
                ) }
            </Grid>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EmailAndSMSPage.defaultProps = {
    "data-componentid": "email-and-sms-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EmailAndSMSPage;
