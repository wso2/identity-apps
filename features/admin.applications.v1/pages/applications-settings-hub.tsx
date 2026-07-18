/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import { DocumentPenIcon, ShareNodesIcon } from "@oxygen-ui/react-icons";
import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./applications-settings-hub.scss";

/**
 * Props interface of {@link ApplicationsSettingsHub}.
 */
type ApplicationsSettingsHubPropsInterface = IdentifiableComponentInterface;

interface SettingsHubCardInterface {
    identifier: string;
    heading: string;
    description: string;
    icon: ReactElement;
    route: string;
    visible: boolean;
}

/**
 * Applications settings hub page. Shows entry-point cards to the Function
 * Libraries and Dynamic Client Registration settings sub-sections.
 *
 * @param props - Props injected to the component.
 * @returns Applications settings hub page.
 */
const ApplicationsSettingsHub: FunctionComponent<ApplicationsSettingsHubPropsInterface> = (
    props: ApplicationsSettingsHubPropsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = "applications-settings-hub" } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasFunctionLibrariesReadPermission: boolean = useRequiredScopes(
        featureConfig?.functionLibraries?.scopes?.read);
    const hasDynamicClientRegistrationReadPermission: boolean = useRequiredScopes(
        featureConfig?.dynamicClientRegistration?.scopes?.read);

    const handleBackButtonClick: () => void = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    const cards: SettingsHubCardInterface[] = [
        {
            description: t("console:develop.pages.applicationsSettingsHub.cards.functionLibraries.description"),
            heading: t("console:develop.pages.applicationsSettingsHub.cards.functionLibraries.heading"),
            icon: <DocumentPenIcon size="small" className="icon" />,
            identifier: "function-libraries",
            route: AppConstants.getPaths().get("APPLICATIONS_SETTINGS_FUNCTION_LIBRARIES"),
            visible: featureConfig?.functionLibraries?.enabled !== false && hasFunctionLibrariesReadPermission
        },
        {
            description: t("console:develop.pages.applicationsSettingsHub.cards.dcr.description"),
            heading: t("console:develop.pages.applicationsSettingsHub.cards.dcr.heading"),
            icon: <ShareNodesIcon size="small" className="icon" />,
            identifier: "dynamic-client-registration",
            route: AppConstants.getPaths().get("APPLICATIONS_SETTINGS_DCR"),
            visible: featureConfig?.dynamicClientRegistration?.enabled !== false
                && hasDynamicClientRegistrationReadPermission
        }
    ];

    return (
        <PageLayout
            title={ t("console:develop.pages.applicationsSettingsHub.title") }
            description={ t("console:develop.pages.applicationsSettingsHub.subTitle") }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.applicationsSettingsHub.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            className="applications-settings-hub"
            data-componentid={ `${ componentId }-layout` }
        >
            <div className="applications-settings-hub-grid-wrapper" data-componentid={ `${ componentId }-grid` }>
                <div className="applications-settings-hub-grid">
                    { cards.filter((card: SettingsHubCardInterface) => card.visible)
                        .map((card: SettingsHubCardInterface) => (
                            <Card
                                key={ card.identifier }
                                className="applications-settings-hub-card"
                                onClick={ () => history.push(card.route) }
                                data-componentid={ `${ componentId }-${ card.identifier }-card` }
                            >
                                <CardContent className="applications-settings-hub-card-header">
                                    <Avatar
                                        variant="square"
                                        randomBackgroundColor
                                        backgroundColorRandomizer={ card.identifier }
                                        className="applications-settings-hub-card-icon-container"
                                    >
                                        { card.icon }
                                    </Avatar>
                                    <Typography variant="h6">
                                        { card.heading }
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        { card.description }
                                    </Typography>
                                </CardContent>
                            </Card>
                        )) }
                </div>
            </div>
        </PageLayout>
    );
};

export default ApplicationsSettingsHub;
