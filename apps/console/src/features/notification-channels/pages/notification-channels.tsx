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

import Grid from "@oxygen-ui/react/Grid";
import { OrganizationType } from "@wso2is/common";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { ReactComponent as EmailIcon } from "../../../themes/default/assets/images/icons/email-icon.svg";
import { ReactComponent as SMSIcon } from "../../../themes/default/assets/images/icons/sms-icon.svg";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../core";
import { useGetOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { SettingsSection } from "../settings/settings-section";

/**
 * Props for the Server Configurations page.
 */
type NotificationChannelPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const NotificationChannelPage: FunctionComponent<NotificationChannelPageInterface> = (
    props: NotificationChannelPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentid } = props;

    const { t } = useTranslation();
    const { organizationType } = useGetOrganizationType();

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    /**
     * Check if the email provider is enabled for the tenant.
     */
    const isEmailProviderEnabled: boolean = featureConfig?.emailProviders?.enabled
        && !(featureConfig?.emailProviders?.disabledFeatures?.includes("superTenantProvider")
        && organizationType === OrganizationType.SUPER_ORGANIZATION);

    /**
     * Check if the SMS provider is enabled for the tenant.
     */
    const isSMSProviderEnabled: boolean = featureConfig?.smsProviders?.enabled;

    /**
     * Handle connector advance setting selection.
     */
    const handleSMSSelection = (): void => {
        history.push(AppConstants.getPaths().get("SMS_PROVIDER"));
    };

    const handleEmailSelection = (): void => {
        history.push(AppConstants.getPaths().get("EMAIL_PROVIDER"));
    };
    
    /**
     * Get the page details based on the enabled providers.
     */
    const getPageDetails = (): {
        description: string;
        pageTitle: string;
        title: string;
    } => {
        if (isEmailProviderEnabled === isSMSProviderEnabled) {
            return {
                description: t("extensions:develop.notificationChannel.description.description"),
                pageTitle: t("extensions:develop.notificationChannel.heading.heading"),
                title: t("extensions:develop.notificationChannel.title.title")
            };
        } else if (isSMSProviderEnabled) {
            return {
                description: t("extensions:develop.notificationChannel.description.onlySMSProvider"),
                pageTitle: t("extensions:develop.notificationChannel.heading.onlySMSProvider"),
                title: t("extensions:develop.notificationChannel.title.onlySMSProvider")
            };
        } else if (isEmailProviderEnabled) {
            return {
                description: t("extensions:develop.notificationChannel.description.onlyEmailProvider"),
                pageTitle: t("extensions:develop.notificationChannel.heading.onlyEmailProvider"),
                title: t("extensions:develop.notificationChannel.title.onlyEmailProvider")
            };
        }
    };

    return (
        <PageLayout
            pageTitle={ getPageDetails().pageTitle }
            title={ getPageDetails().title }
            description={ getPageDetails().description }
            data-testid={ `${componentid}-page-layout` }
        >
            { isEmailProviderEnabled && (
                <>
                    <Grid xs={ 12 } lg={ 6 }>
                        <SettingsSection
                            data-componentid={ "account-login-page-section" }
                            data-testid={ "account-login-page-section" }
                            description={ t("extensions:develop.emailProviders.description") }
                            icon={ EmailIcon }
                            header={ t("extensions:develop.emailProviders.heading") }
                            onPrimaryActionClick={ handleEmailSelection }
                            primaryAction={ t("common:configure") }
                        />
                    </Grid>
                    <Divider hidden/>
                </>
            ) }
            { isSMSProviderEnabled && (
                <Grid xs={ 12 } lg={ 6 }>
                    <SettingsSection
                        data-componentid={ "account-login-page-section" }
                        data-testid={ "account-login-page-section" }
                        description={ t("extensions:develop.smsProviders.description") }
                        icon={ SMSIcon }
                        header={
                            t("extensions:develop.smsProviders.heading")
                        }
                        onPrimaryActionClick={ handleSMSSelection }
                        primaryAction={ t("common:configure") }
                    />
                </Grid>
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
NotificationChannelPage.defaultProps = {
    "data-componentid": "notification-channel-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default NotificationChannelPage;
