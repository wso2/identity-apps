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
import { LocalStorageUtils, CommonUtils as ReusableCommonUtils, StringUtils } from "@wso2is/core/utils";
import {
    Announcement,
    AppSwitcher,
    GenericIcon,
    Logo,
    ProductBrand,
    Header as ReusableHeader,
    HeaderPropsInterface as ReusableHeaderPropsInterface
} from "@wso2is/react-components";
import compact from "lodash-es/compact";
import isEmpty from "lodash-es/isEmpty";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Container, Menu } from "semantic-ui-react";
import { commonConfig } from "../../../extensions";
import { getApplicationList } from "../../applications/api";
import { ApplicationListInterface } from "../../applications/models";
import { AppSwitcherIcons, getAppHeaderIcons } from "../configs";
import { AppConstants } from "../constants";
import { history } from "../helpers";
import { AppViewTypes, ConfigReducerStateInterface, StrictAppViewTypes } from "../models";
import { AppState, setActiveView } from "../store";
import { CommonUtils, EventPublisher } from "../utils";

/**
 * Dashboard layout Prop types.
 */
interface HeaderPropsInterface extends Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo"> {
    /**
     * Active view.
     */
    activeView?: AppViewTypes;
}

/**
 * Interface for the Header sub panel.
 */
export interface HeaderSubPanelItemInterface {
    /**
     * Floated direction.
     */
    floated: "left" | "right";
    /**
     * Component to render.
     */
    component: (currentActiveView?: AppViewTypes, onClickCb?: (newActiveView: AppViewTypes) => void) => ReactElement;
    /**
     * Display order.
     */
    order: number;
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
        activeView: externallyProvidedActiveView,
        fluid,
        onSidePanelToggleClick,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isHeaderAvatarLabelAllowed: boolean = useSelector((state: AppState) =>
        state.config.ui.isHeaderAvatarLabelAllowed);
    const showAppSwitchButton: boolean = useSelector((state: AppState) => state.config.ui.showAppSwitchButton);
    const accountAppURL: string = useSelector((state: AppState) => state.config.deployment.accountApp.path);
    const consoleAppURL: string = useSelector((state: AppState) => state.config.deployment.appHomePath);
    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const associatedTenants: any[] = useSelector((state: AppState) => state?.auth?.tenants);

    const isDevelopAllowed: boolean =
        useSelector((state: AppState) => state.accessControl.isDevelopAllowed);
    const isManageAllowed: boolean =
        useSelector((state: AppState) => state.accessControl.isManageAllowed);

    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Check if there are applications registered and set the value to local storage.
     */
    useEffect(() => {
        if (!isEmpty(LocalStorageUtils.getValueFromLocalStorage("IsAppsAvailable"))
            && LocalStorageUtils.getValueFromLocalStorage("IsAppsAvailable") === "true") {
            return;
        }

        getApplicationList(null, null, null)
            .then(
                (response: ApplicationListInterface) => {
                    LocalStorageUtils.setValueInLocalStorage("IsAppsAvailable", response.totalResults > 0
                        ? "true" : "false"
                    );
                })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            });
    }, []);

    /**
     * Listens to  the changes in the `externallyProvidedActiveView` and sets the `activeView`.
     */
    useEffect(() => {

        if (activeView) {
            return;
        }

        dispatch(setActiveView(externallyProvidedActiveView));
    }, [ externallyProvidedActiveView ]);

    /**
     * Listens to `config` changes and set the announcement.
     */
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
                    enabled={ showAppSwitchButton }
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

    /**
     * Renders the sub header panel items merging extended ones.
     *
     * @param {HeaderSubPanelItemInterface["floated"]} floated - Floated direction.
     *
     * @return {React.ReactElement}
     */
    const renderSubHeaderPanelItems = (floated: HeaderSubPanelItemInterface[ "floated" ]): ReactElement => {

        const moderatedItemsToRender: ReactElement[] = [];
        const itemExtensions: HeaderSubPanelItemInterface[] = commonConfig?.header?.getHeaderSubPanelExtensions();
        const defaultItems: HeaderSubPanelItemInterface[] = [
            isDevelopAllowed && {
                component: () => (
                    <Menu.Item
                        name={ config.deployment.developerApp.displayName }
                        active={ activeView === StrictAppViewTypes.DEVELOP }
                        className="secondary-panel-item portal-switch"
                        onClick={ () => {
                            eventPublisher.publish("console-click-develop-menu-item");
                            history.push(config.deployment.developerApp.path);
                            dispatch(setActiveView(StrictAppViewTypes.DEVELOP));
                        } }
                        data-testid={ `${ testId }-developer-portal-switch` }
                    />
                ),
                floated: "left",
                order: 1
            },
            isManageAllowed && {
                component: () => (
                    <Menu.Item
                        name={ config.deployment.adminApp.displayName }
                        active={ activeView === StrictAppViewTypes.MANAGE }
                        className="secondary-panel-item portal-switch"
                        onClick={ () => {
                            eventPublisher.publish("console-click-manage-menu-item");
                            history.push(config.deployment.adminApp.path);
                            dispatch(setActiveView(StrictAppViewTypes.MANAGE));
                        } }
                        data-testid={ `${ testId }-admin-portal-switch` }
                    />
                ),
                floated: "left",
                order: 2
            }
        ];

        // If the user is a user is not logging in for the first time the quick start icon will switch to home icon.
        if (itemExtensions[0]?.order === 0 &&
            LocalStorageUtils.getValueFromLocalStorage("IsAppsAvailable") === "true") {
            itemExtensions[0].component = (
                currentActiveView?: AppViewTypes, onClickCb?: (newActiveView: AppViewTypes) => void) => (
                <Menu.Item
                    active={ currentActiveView === commonConfig.header.headerQuickstartMenuItem }
                    className="secondary-panel-item quickstart-page-switch"
                    onClick={ () => {
                        history.push(`${ AppConstants.getMainViewBasePath() }/getting-started`);
                        onClickCb &&
                        onClickCb(commonConfig.header.headerQuickstartMenuItem as AppViewTypes);
                    } }
                    data-testid="app-header-quick-start-switch"
                >
                    <GenericIcon
                        defaultIcon
                        transparent
                        size="x22"
                        hoverable={ false }
                        icon={ getAppHeaderIcons().homeIcon }
                    />
                </Menu.Item>
            );
        }

        sortBy([ ...itemExtensions, ...defaultItems ], [ "order" ]).filter((item: HeaderSubPanelItemInterface) => {
            if (item.floated === floated) {
                const {
                    component: Component
                } = item;

                moderatedItemsToRender.push(
                    Component(activeView, (newActiveView: AppViewTypes) => {
                        dispatch(setActiveView(newActiveView));
                    })
                );
            }
        });

        if (moderatedItemsToRender.length > 0) {
            return (
                <Menu floated={ floated === "right" ? "right" : undefined } className="inner-menu">
                    { moderatedItemsToRender }
                </Menu>
            );
        }

        return null;
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
                                    `${
                                        StringUtils.removeSlashesFromPath(
                                            window[ "AppUtils" ].getConfig().appBase
                                        ) !== ""
                                            ? StringUtils.removeSlashesFromPath(
                                                window[ "AppUtils" ].getConfig().appBase
                                            ) + "/"
                                            : ""
                                    }libs/themes/` +
                                    config.ui.theme.name)
                            }
                        />
                    ) }
                    version={ config.ui.productVersionConfig?.productVersion }
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
                    showAppSwitchButton && commonConfig?.header?.renderAppSwitcherAsDropdown && {
                        component: renderAppSwitcher(),
                        floated: "right"
                    }
                ])
            }
            fluid={ fluid }
            isProfileInfoLoading={ isProfileInfoLoading }
            userDropdownLinks={
                compact([
                    !commonConfig?.header?.renderAppSwitcherAsDropdown && {
                        category: "APPS",
                        categoryLabel: t("common:apps"),
                        links: [
                            {
                                "data-testid": "app-switch-myaccount",
                                icon: AppSwitcherIcons().myAccount,
                                name: t("console:manage.features.header.links.userPortalNav"),
                                onClick: () => {
                                    eventPublisher.publish("console-click-visit-my-account");
                                    window.open(accountAppURL, "_blank", "noopener");
                                }
                            }
                        ]
                    },
                    ...commonConfig?.header?.getUserDropdownLinkExtensions(tenantDomain, associatedTenants),
                    {
                        category: "GENERAL",
                        categoryLabel: null,
                        links: [
                            {
                                "data-testid": "app-header-dropdown-link-Logout",
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
                (isDevelopAllowed || isManageAllowed) && (
                    <div className="secondary-panel" data-testid={ `${ testId }-secondary-panel` }>
                        <Container fluid={ fluid }>
                            { renderSubHeaderPanelItems("left") }
                            { renderSubHeaderPanelItems("right") }
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
