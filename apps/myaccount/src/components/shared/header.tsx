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
import { AlertLevels, AnnouncementBannerInterface, LinkedAccountInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { useDispatch, useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { AppSwitcherIcons } from "../../configs";
import { AppConstants } from "../../constants";
import { commonConfig } from "../../extensions";
import { history, resolveUserstore } from "../../helpers";
import { AuthStateInterface, ConfigReducerStateInterface } from "../../models";
import { AppState } from "../../store";
import { getProfileInformation, getProfileLinkedAccounts, handleAccountSwitching } from "../../store/actions";
import { CommonUtils, refreshPage } from "../../utils";

/**
 * Dashboard layout Prop types.
 */
type HeaderPropsInterface = Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo">

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
        fluid,
        onSidePanelToggleClick,
        ...rest
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    // TODO: Get this from profile reducer and cast `ProfileInfoInterface`.
    const profileInfo: any = useSelector((state: AppState) => state.authenticationInformation.profileInfo);
    const tenantName: string = useSelector((state: AppState) => state.authenticationInformation.tenantDomain);
    // TODO: Use common loaders reducer.
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoLoading);
    const linkedAccounts: LinkedAccountInterface[] = useSelector((state: AppState) => state.profile.linkedAccounts);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isHeaderAvatarLabelAllowed: boolean = useSelector((state: AppState) =>
        state.config.ui.isHeaderAvatarLabelAllowed);
    const showAppSwitchButtonConfig: boolean = useSelector((state: AppState) => state.config.ui.showAppSwitchButton);
    const consoleAppURL: string = useSelector((state: AppState) => state.config.deployment.consoleApp.path);
    const accountAppURL: string = useSelector((state: AppState) => state.config.deployment.appHomePath);
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const [ userStore, setUserstore ] = useState<string> (null);
    const [ showAppSwitchButton, setShowAppSwitchButton ] = useState<boolean> (true);

    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>(undefined);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }

        if (isEmpty(linkedAccounts)) {
            dispatch(getProfileLinkedAccounts());
        }
    }, []);

    /**
     * Sets whether to show apps in dropdown.
     */
    useEffect(() => {
        setShowAppSwitchButton(showAppSwitchButtonConfig);
       if (!commonConfig?.utils?.isConsoleNavigationAllowed(userStore)) {
           setShowAppSwitchButton(false);
       }
    }, [ showAppSwitchButtonConfig, userStore ]);

    /**
     * Sets user store of the user.
     */
    useEffect(() => {
        if (profileDetails?.profileInfo?.userName) {
            const userstore: string = resolveUserstore(profileDetails.profileInfo.userName);
            setUserstore(userstore);
        }
    }, [profileDetails?.profileInfo]);

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
     * Handles the account switch click event.
     *
     * @param { LinkedAccountInterface } account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        try {
            dispatch(handleAccountSwitching(account));
            refreshPage();
        } catch (error) {
            if (error.response && error.response.data && error.response.detail) {
                dispatch(
                    addAlert({
                        description: t(
                            "myAccount:components.linkedAccounts.notifications.switchAccount.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.linkedAccounts.notifications.switchAccount.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t(
                        "myAccount:components.linkedAccounts.notifications.switchAccount.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.linkedAccounts.notifications.switchAccount.genericError.message"
                    )
                })
            );
        }
    };

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
     * Based on the authenticated user type,
     * decide which navigation links to provide.
     *
     */
    const getLinks = () => {
        const links = [];

        commonConfig.utils.isConsoleNavigationAllowed(userStore)
            ?
            links.push(
            {
                "data-testid": "app-switch-console",
                icon: AppSwitcherIcons().console,
                name: t("myAccount:components.header.appSwitch.console.name"),
                onClick: () => {
                    window.open(consoleAppURL, "_blank", "noopener");
                }
            })
            : null;

        return links;
    };

    /**
     * Renders the app switcher dropdown.
     *
     * @return {React.ReactElement}
     */
    const renderAppSwitcher = (): ReactElement => (

        <Menu.Item
            className="app-switch-button-wrapper"
            key="app-switch-trigger"
            data-testid="app-switch-trigger"
        >
            <AppSwitcher
                enabled={
                    showAppSwitchButton
                    && (AppConstants.getTenant() === AppConstants.getSuperTenant())
                    && (consoleAppURL && consoleAppURL != "")
                }
                tooltip={ t("myAccount:components.header.appSwitch.tooltip") }
                apps={ [
                    {
                        "data-testid": "app-switch-console",
                        description: t("myAccount:components.header.appSwitch.console.description"),
                        enabled: true,
                        icon: AppSwitcherIcons().console,
                        name: t("myAccount:components.header.appSwitch.console.name"),
                        onClick: () => {
                            window.open(consoleAppURL,"_blank", "noopener");
                        }
                    },
                    {
                        "data-testid": "app-switch-myaccount",
                        description: t("myAccount:components.header.appSwitch.myAccount.description"),
                        enabled: true,
                        icon: AppSwitcherIcons().myAccount,
                        name: t("myAccount:components.header.appSwitch.myAccount.name"),
                        onClick: () => {
                            window.open(accountAppURL,"_self");
                        }
                    }
                ] }
            />
        </Menu.Item>
    );

    /**
     * The following function resolve the organization label in the header.
     */
    const resolveOrganizationLabel = (): ReactElement => {

        const organization = (tenantName == "carbon.super") ? commonConfig.header.organization : tenantName;

        return (
            <Label className="organization-label">
                { t("myAccount:components.header.organizationLabel") } <strong>{ organization }</strong>
            </Label>
        );
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
                    version={ config.ui.productVersionConfig?.productVersion }
                    versionUISettings={ {
                        allowSnapshot: config.ui.productVersionConfig?.allowSnapshot,
                        labelColor: config.ui.productVersionConfig?.labelColor,
                        labelPosition: "absolute",
                        textCase: config.ui.productVersionConfig?.textCase
                    } }
                />
            ) }
            extensions={
                // Remove false values. Needed for `&&` operator.
                compact([
                    showAppSwitchButton && commonConfig?.header?.renderAppSwitcherAsDropdown && {
                        component: renderAppSwitcher(),
                        floated: "right"
                    }
                ])
            }
            brandLink={ config.deployment.appHomePath }
            basicProfileInfo={ profileInfo }
            fluid={ fluid }
            isProfileInfoLoading={ isProfileInfoLoading }
            linkedAccounts={ linkedAccounts }
            onLinkedAccountSwitch={ handleLinkedAccountSwitch }
            userDropdownLinks={
                // Hide the APPs for readonly users
                compact([
                    showAppSwitchButton
                    && !commonConfig?.header?.renderAppSwitcherAsDropdown
                    && !(CommonUtils?.isProfileReadOnly(isReadOnlyUser))
                    && {
                        category: "APPS",
                        categoryLabel: t("common:apps"),
                        links: getLinks()
                    },
                    {
                        category: "GENERAL",
                        links: [
                            {
                                "data-testid": "app-header-dropdown-link-Personal-Info",
                                name: t("common:personalInfo"),
                                onClick: () => history.push(AppConstants.getPaths().get("PROFILE_INFO"))
                            },
                            {
                                "data-testid": "app-header-dropdown-link-Logout",
                                name: t("common:logout"),
                                onClick: () => history.push(AppConstants.getAppLogoutPath())
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
            showOrganizationLabel={ true }
            organizationLabel={ resolveOrganizationLabel() }
            { ...rest }
        />
    );
};

/**
 * Default props for the component.
 */
Header.defaultProps = {
    fluid: false
};
