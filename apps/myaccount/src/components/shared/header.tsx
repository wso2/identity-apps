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
    Logo,
    ProductBrand,
    Header as ReusableHeader,
    HeaderPropsInterface as ReusableHeaderPropsInterface,
    ThemeContext
} from "@wso2is/react-components";
import _ from "lodash";
import React, {
    FunctionComponent,
    ReactElement,
    useContext,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import { AppConstants } from "../../constants";
import { history } from "../../helpers";
import { ConfigReducerStateInterface } from "../../models";
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

    const { state } = useContext(ThemeContext);

    const { t } = useTranslation();

    // TODO: Get this from profile reducer and cast `ProfileInfoInterface`.
    const profileInfo: any = useSelector((state: AppState) => state.authenticationInformation.profileInfo);
    // TODO: Use common loaders reducer.
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoLoading);
    const linkedAccounts: LinkedAccountInterface[] = useSelector((state: AppState) => state.profile.linkedAccounts);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>(undefined);

    useEffect(() => {
        if (_.isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }

        if (_.isEmpty(linkedAccounts)) {
            dispatch(getProfileLinkedAccounts());
        }
    }, []);

    useEffect(() => {
        if (_.isEmpty(config)) {
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
                    appName={
                        (state.appName && state.appName !== "")
                            ? state.appName
                            : config.ui.appName
                    }
                    style={ { marginTop: 0 } }
                    logo={
                        (state.logo && state.logo !== "")
                            ? <Image src={ state.logo } style={ { maxHeight: 25 } }/>
                            : (
                                <Logo
                                    className="portal-logo"
                                    image={
                                        resolveAppLogoFilePath(window[ "AppUtils" ].getConfig().ui.appLogoPath,
                                            `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                            `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                            state.theme)
                                    }
                                />
                            )
                    }
                    productName={
                        (state.productName && state.productName !== "")
                            ? state.productName
                            : config.ui.productName
                    }
                    version={ config.ui.productVersionConfig?.versionOverride ?? config.deployment.productVersion }
                    versionUISettings={ {
                        allowSnapshot: config.ui.productVersionConfig?.allowSnapshot,
                        labelColor: config.ui.productVersionConfig?.labelColor,
                        textCase: config.ui.productVersionConfig?.textCase
                    } }
                />
            ) }
            brandLink={ config.deployment.appHomePath }
            basicProfileInfo={ profileInfo }
            fluid={ fluid }
            isProfileInfoLoading={ isProfileInfoLoading }
            linkedAccounts={ linkedAccounts }
            onLinkedAccountSwitch={ handleLinkedAccountSwitch }
            userDropdownLinks={ [
                {
                    icon: "arrow right",
                    name: t("common:personalInfo"),
                    onClick: () => history.push(AppConstants.getPaths().get("PROFILE_INFO"))
                },
                {
                    icon: "power off",
                    name: t("common:logout"),
                    onClick: () => history.push(AppConstants.getAppLogoutPath())
                }
            ] }
            profileInfo={ profileInfo }
            showUserDropdown={ true }
            onSidePanelToggleClick={ onSidePanelToggleClick }
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
