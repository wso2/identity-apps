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
import { AnnouncementBannerInterface, ProfileInfoInterface, TenantAssociationsInterface } from "@wso2is/core/models";
import { CommonUtils as ReusableCommonUtils, SessionStorageUtils } from "@wso2is/core/utils";
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
import { useSelector } from "react-redux";
import { Container, Image, Menu } from "semantic-ui-react";
import { ComponentPlaceholder } from "../../../extensions";
import { getMiscellaneousIcons } from "../configs";
import { history } from "../helpers";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { CommonUtils } from "../utils";

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

    const { state } = useContext(ThemeContext);

    const { t } = useTranslation();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const defaultTenant: string = useSelector((state: AppState) => state.auth.defaultTenant);
    const associatedTenants: string | string[] = useSelector((state: AppState) => state.auth.associatedTenants);

    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>(undefined);
    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);

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

    useEffect(() => {

        const association: TenantAssociationsInterface = {
            associatedTenants: associatedTenants,
            currentTenant: tenantDomain,
            defaultTenant: defaultTenant,
            username: email ? email : username
        };

        setTenantAssociations(association);
    }, [ associatedTenants && defaultTenant ]);

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
     * Handle the tenant switch action and redirect the user to the selected
     * tenant path of the console.
     */
    const handleTenantSwitch = (tenantName: string) => {
        const newTenantedPath = window["AppUtils"].getConfig().clientOrigin + "/t/" + tenantName + "/" +
            window["AppUtils"].getConfig().appBase;

        // Clear the callback url of the previous tenant.
        SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

        // Redirect the user to the newly selected tenant path.
        window.location.replace(newTenantedPath);
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
            extensions={ [
                {
                    component: (
                        <Menu.Item key={ "feedback-button" }>
                            <ComponentPlaceholder section="feedback-button" type="component"/>
                        </Menu.Item>
                    ),
                    floated: "right"
                }
            ] }
            fluid={ fluid }
            isProfileInfoLoading={ isProfileInfoLoading }
            userDropdownLinks={ [
                {
                    icon: "arrow right",
                    name: t("console:manage.features.header.links.userPortalNav"),
                    onClick: () => window.open(window[ "AppUtils" ].getConfig().accountApp.path,
                        "_blank", "noopener")
                },
                {
                    icon: "power off",
                    name: t("common:logout"),
                    onClick: () => history.push(window[ "AppUtils" ].getConfig().routes.logout)
                }
            ] }
            profileInfo={ profileInfo }
            showUserDropdown={ true }
            onSidePanelToggleClick={ onSidePanelToggleClick }
            tenantAssociations={ tenantAssociations }
            tenantIcon={ getMiscellaneousIcons().tenantIcon }
            onTenantSwitch={ handleTenantSwitch }
            data-testid={ testId }
            { ...rest }
        >
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
