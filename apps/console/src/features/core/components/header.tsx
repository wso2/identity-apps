/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { AnnouncementBannerInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { CommonUtils as ReusableCommonUtils } from "@wso2is/core/utils";
import {
    Announcement,
    AppSwitcher,
    Logo,
    ProductBrand,
    Header as ReusableHeader,
    HeaderPropsInterface as ReusableHeaderPropsInterface
} from "@wso2is/react-components";
import compact from "lodash-es/compact";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Container, Menu } from "semantic-ui-react";
import { commonConfig } from "../../../extensions/configs";
import { AppSwitcherIcons } from "../configs";
import { history } from "../helpers";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { CommonUtils, EventPublisher } from "../utils";

/**
 * Dashboard layout Prop types.
 */
interface HeaderPropsInterface extends Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo"> {
    /**
     * Active view.
     */
    activeView?: "ADMIN" | "DEVELOPER";
}

/**
 * Implementation of the Reusable Header component.
 *
 * @param {HeaderPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Header: FunctionComponent<HeaderPropsInterface> = (
    props: HeaderPropsInterface
): ReactElement => {

    const {
        activeView,
        fluid,
        onSidePanelToggleClick,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isHeaderAvatarLabelAllowed: boolean = useSelector((state: AppState) =>
        state.config.ui.isHeaderAvatarLabelAllowed);
    const showAppSwitcherSeparate: boolean = useSelector((state: AppState) => state.config.ui.showAppSwitchButton);
    const accountAppURL: string = useSelector((state: AppState) => state.config.deployment.accountApp.path);
    const consoleAppURL: string = useSelector((state: AppState) => state.config.deployment.appHomePath);

    const isDevelopAllowed: boolean = 
        useSelector((state: AppState) => state.accessControl.isDevelopAllowed);
    const isManageAllowed: boolean = 
        useSelector((state: AppState) => state.accessControl.isManageAllowed);

    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (isEmpty(config)) {
            return;
        }

        if (!config?.ui?.announcements
            || !(config?.ui?.announcements instanceof Array)
            || (config?.ui?.announcements.length < 1)) {

            return;
        }

        setAnnouncement(ReusableCommonUtils.getValidAnnouncement(config.ui.announcements,
            CommonUtils.getSeenAnnouncements()));
    }, [ config ]);

    /**
     * Handles announcement dismiss callback.
     */
    const handleAnnouncementDismiss = () => {
        CommonUtils.setSeenAnnouncements(announcement.id);

        const validAnnouncement = ReusableCommonUtils.getValidAnnouncement(config.ui.announcements,
            CommonUtils.getSeenAnnouncements());

        if (!validAnnouncement) {
            setAnnouncement(null);
            return;
        }

        setAnnouncement(validAnnouncement);
    };

    /**
     * Renders the app switcher dropdown.
     *
     * @return {React.ReactElement}
     */
    const renderAppSwitcher = (): ReactElement => {

        return (
            <Menu.Item
                className="app-switch-button-wrapper"
                key="app-switch-trigger"
                data-testid="app-switch-trigger"
            >
                <AppSwitcher
                    enabled={ showAppSwitcherSeparate }
                    tooltip={ t("console:common.header.appSwitch.tooltip") }
                    apps={ [
                        {
                            "data-testid": "app-switch-console",
                            description: t("console:common.header.appSwitch.console.description"),
                            enabled: true,
                            icon: AppSwitcherIcons().console,
                            name: t("console:common.header.appSwitch.console.name"),
                            onClick: () => {
                                eventPublisher.publish("console-click-visit-console");

                                window.open(consoleAppURL, "_self");
                            }
                        },
                        {
                            "data-testid": "app-switch-myaccount",
                            description: t("console:common.header.appSwitch.myAccount.description"),
                            enabled: true,
                            icon: AppSwitcherIcons().myAccount,
                            name: t("console:common.header.appSwitch.myAccount.name"),
                            onClick: () => {
                                eventPublisher.publish("console-click-visit-my-account");

                                window.open(accountAppURL, "_blank", "noopener");
                            }
                        }
                    ] }
                />
            </Menu.Item>
        );
    };

    /**
     * Redirects to myaccount from console.
     */
    const onAvatarClick = () => {

        window.open(window[ "AppUtils" ].getConfig().accountApp.path,
            "_blank", "noopener");
    };

    return (
        <ReusableHeader
            announcement={ announcement && (
                <Announcement
                    message={ announcement.message }
                    onDismiss={ handleAnnouncementDismiss }
                    color={ announcement.color }
                />
            ) }
            brand={ (
                <ProductBrand
                    appName={ config.ui.appName }
                    style={ { marginTop: 0 } }
                    logo={ (
                        <Logo
                            className="portal-logo"
                            image={
                                resolveAppLogoFilePath(window[ "AppUtils" ].getConfig().ui.appLogoPath,
                                    `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                    `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                    config.ui.theme.name)
                            }
                        />
                    ) }
                    version={ config.ui.productVersionConfig?.versionOverride ?? config.deployment.productVersion }
                    versionUISettings={ {
                        allowSnapshot: config.ui.productVersionConfig?.allowSnapshot,
                        labelColor: config.ui.productVersionConfig?.labelColor,
                        labelPosition: "absolute",
                        textCase: config.ui.productVersionConfig?.textCase
                    } }
                />
            ) }
            brandLink={ config.deployment.appHomePath }
            basicProfileInfo={ profileInfo }
            extensions={
                // Remove false values. Needed for `&&` operator.
                compact([
                    ...commonConfig?.header?.getHeaderExtensions(),
                    showAppSwitcherSeparate && {
                        component: renderAppSwitcher(),
                        floated: "right"
                    }
                ])
            }
            fluid={ fluid }
            isProfileInfoLoading={ isProfileInfoLoading }
            userDropdownLinks={
                compact([
                    {
                        category: "APPS",
                        categoryLabel: "Apps",
                        links: [
                            {
                                "data-testid": "app-switch-console",
                                icon: AppSwitcherIcons().myAccount,
                                name: t("console:manage.features.header.links.userPortalNav"),
                                onClick: () => {
                                    eventPublisher.publish("console-click-visit-console");
                                    window.open(consoleAppURL, "_self");
                                }
                            },
                            {
                                "data-testid": "app-switch-myaccount",
                                icon: AppSwitcherIcons().console,
                                name: t("console:common.header.appSwitch.console.name"),
                                onClick: () => {
                                    eventPublisher.publish("console-click-visit-my-account");
                                    window.open(accountAppURL, "_blank", "noopener");
                                }
                            }
                        ]
                    },
                    ...commonConfig?.header?.getUserDropdownLinkExtensions(),
                    {
                        category: "GENERAL",
                        categoryLabel: null,
                        links: [
                            {
                                name: t("common:logout"),
                                onClick: () => {
                                    eventPublisher.publish("console-click-logout");

                                    history.push(window[ "AppUtils" ].getConfig().routes.logout);
                                }
                            }
                        ]
                    }
                ])
            }
            profileInfo={ profileInfo }
            showUserDropdown={ true }
            showUserDropdownTriggerLabel={
                (isHeaderAvatarLabelAllowed === undefined)
                    ? false
                    : isHeaderAvatarLabelAllowed
            }
            onSidePanelToggleClick={ onSidePanelToggleClick }
            onAvatarClick={ onAvatarClick }
            data-testid={ testId }
            { ...rest }
        >
            {
                isDevelopAllowed && isManageAllowed && (
                    <div className="secondary-panel" data-testid={ `${ testId }-secondary-panel` }>
                        <Container fluid={ fluid }>
                            <Menu className="inner-menu">
                                <Menu.Item
                                    name={ config.deployment.developerApp.displayName }
                                    active={ activeView === "DEVELOPER" }
                                    className="portal-switch"
                                    onClick={ () => {
                                        history.push(config.deployment.developerApp.path);
                                    } }
                                    data-testid={ `${ testId }-developer-portal-switch` }
                                />
                                <Menu.Item
                                    name={ config.deployment.adminApp.displayName }
                                    active={ activeView === "ADMIN" }
                                    className="portal-switch"
                                    onClick={ () => {
                                        history.push(config.deployment.adminApp.path);
                                    } }
                                    data-testid={ `${ testId }-admin-portal-switch` }
                                />
                            </Menu>
                        </Container>
                    </div>
                )
            }
        </ReusableHeader>
    );
};

/**
 * Default props for the component.
 */
Header.defaultProps = {
    "data-testid": "app-header",
    fluid: true
};
