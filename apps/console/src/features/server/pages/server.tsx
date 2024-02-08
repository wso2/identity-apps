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

import CardContent from "@mui/material/CardContent";
import {
    ArrowLoopRightUserIcon,
    UserBannerIcon,
    UserIcon
} from "@oxygen-ui/react-icons";
import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../core";
import "./server.scss";

/**
 * Props for the Server Configurations page.
 */
type ServerSettingsListingPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ServerSettingsListingPage: FunctionComponent<ServerSettingsListingPageInterface> = (
    props: ServerSettingsListingPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();

    return (
        <PageLayout
            pageTitle={ t("console:manage.features.serverConfigs.server.title") }
            title={ t("console:manage.features.serverConfigs.server.title") }
            description={ t("console:manage.features.serverConfigs.server.description") }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid container rowSpacing={ 3 } columnSpacing={ 3 }>
                    <Grid xs={ 12 } md={ 6 } lg={ 4 }>
                        <Card
                            key="admin-advisory-page-section"
                            className="server-configuration"
                            data-componentid="admin-advisory-page-section"
                            onClick={ () => history.push(AppConstants.getPaths().get("ADMIN_ADVISORY_BANNER_EDIT")) }
                        >
                            <CardContent className="server-configuration-header">
                                <div>
                                    <GenericIcon
                                        size="micro"
                                        icon={ (
                                            <Avatar
                                                variant="square"
                                                randomBackgroundColor
                                                backgroundColorRandomizer="admin-advisory-banner"
                                                className="server-configuration-icon-container"
                                            >
                                                <UserBannerIcon className="icon" />
                                            </Avatar>
                                        ) }
                                        inline
                                        transparent
                                        shape="square"
                                    />
                                </div>
                                <Typography variant="h6">
                                    { t("console:manage.features.serverConfigs.adminAdvisory." +
                                        "configurationSection.heading") }
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {  t("console:manage.features.serverConfigs.adminAdvisory." +
                                        "configurationSection.description") }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={ 12 } md={ 6 } lg={ 4 }>
                        <Card
                            key="remote-logging-page-section"
                            data-componentid="remote-logging-page-section"
                            className="server-configuration"
                            onClick={ () => history.push(AppConstants.getPaths().get("REMOTE_LOGGING")) }
                        >
                            <CardContent className="server-configuration-header">
                                <div>
                                    <GenericIcon
                                        size="micro"
                                        icon={ (
                                            <Avatar
                                                variant="square"
                                                randomBackgroundColor
                                                backgroundColorRandomizer="remote-logging"
                                                className="server-configuration-icon-container"
                                            >
                                                <UserIcon className="icon" />
                                            </Avatar>
                                        ) }
                                        inline
                                        transparent
                                        shape="square"
                                    />
                                </div>
                                <Typography variant="h6">
                                    { t("console:manage.features.serverConfigs.remoteLogPublishing" +
                                        ".title")  }
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    { t("console:manage.features.serverConfigs.remoteLogPublishing" +
                                        ".description")  }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={ 12 } md={ 6 } lg={ 4 }>
                        <Card
                            key="manage-notifications-sending-page-section"
                            data-componentid="manage-notifications-sending-page-section"
                            className="server-configuration"
                            onClick={ () => history.push(AppConstants.getPaths().get("INTERNAL_NOTIFICATION_SENDING")) }
                        >
                            <CardContent className="server-configuration-header">
                                <div>
                                    <GenericIcon
                                        size="micro"
                                        icon={ (
                                            <Avatar
                                                variant="square"
                                                randomBackgroundColor
                                                backgroundColorRandomizer="internal-notification"
                                                className="server-configuration-icon-container"
                                            >
                                                <ArrowLoopRightUserIcon className="icon" />
                                            </Avatar>
                                        ) }
                                        inline
                                        transparent
                                        shape="square"
                                    />
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        { t("console:manage.features.serverConfigs." +
                                            "manageNotificationSendingInternally.title")  }
                                    </Typography>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    { t("console:manage.features.serverConfigs." +
                                        "manageNotificationSendingInternally.description")  }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ServerSettingsListingPage.defaultProps = {
    "data-componentid": "server-settings-listing-page"
};

export default ServerSettingsListingPage;
