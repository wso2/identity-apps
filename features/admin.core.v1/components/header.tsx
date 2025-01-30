/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Divider from "@oxygen-ui/react/Divider";
import OxygenHeader, { HeaderProps } from "@oxygen-ui/react/Header";
import Image from "@oxygen-ui/react/Image";
import Link from "@oxygen-ui/react/Link";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Menu from "@oxygen-ui/react/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Typography from "@oxygen-ui/react/Typography";
import { DiamondIcon, DiscordIcon, StackOverflowIcon, TalkingHeadsetIcon } from "@oxygen-ui/react-icons";
import { FeatureStatus, Show, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { organizationConfigs } from "@wso2is/admin.extensions.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import { OrganizationSwitchBreadcrumb } from "@wso2is/admin.organizations.v1/components/organization-switch";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useSubscription, { UseSubscriptionInterface } from "@wso2is/admin.subscription.v1/hooks/use-subscription";
import { TenantTier } from "@wso2is/admin.subscription.v1/models/tenant-tier";
import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { FeatureAccessConfigInterface } from "@wso2is/core/src/models";
import { StringUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import { useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ReactComponent as LogoutIcon } from "../../themes/default/assets/images/icons/logout-icon.svg";
import { ReactComponent as MyAccountIcon } from "../../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as AskHelpIcon } from "../../themes/wso2is/assets/images/icons/ask-help-icon.svg";
import { ReactComponent as DocsIcon } from "../../themes/wso2is/assets/images/icons/docs-icon.svg";
import { ReactComponent as BillingPortalIcon } from "../../themes/wso2is/assets/images/icons/dollar-icon.svg";
import { AppConstants, OrganizationType } from "../constants";
import { history } from "../helpers";
import useGlobalVariables from "../hooks/use-global-variables";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { CommonUtils, EventPublisher } from "../utils";
import "./header.scss";

/**
 * Dashboard layout Prop types.
 */
export type HeaderPropsInterface = HeaderProps & IdentifiableComponentInterface;

/**
 * Implementation of the Reusable Header component.
 *
 * @param props - Props injected to the component.
 * @returns react element containing the Reusable Header component.
 */
const Header: FunctionComponent<HeaderPropsInterface> = ({
    "data-componentid": _componentId = "app-header",
    onCollapsibleHamburgerClick = () => null,
    ...rest
}: HeaderPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const showAppSwitchButton: boolean = useSelector((state: AppState) => state.config.ui.showAppSwitchButton);
    const accountAppURL: string = useSelector((state: AppState) => state.config.deployment.accountApp.path);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const associatedTenants: any[] = useSelector((state: AppState) => state?.auth?.tenants);
    const privilegedUserAccountURL: string = useSelector(
        (state: AppState) => state.config.deployment.accountApp.tenantQualifiedPath
    );
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const gettingStartedFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state.config.ui.features.gettingStarted);
    const scopes: string = useSelector((state: AppState) => state.auth.allowedScopes);
    const userOrganizationID: string = useSelector((state: AppState) => state?.organization?.userOrganizationId);

    const hasGettingStartedViewPermission: boolean = useRequiredScopes(
        gettingStartedFeatureConfig?.scopes?.feature
    );

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const { tierName }: UseSubscriptionInterface = useSubscription();

    const { organizationType, isSubOrganization } = useGetCurrentOrganizationType();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const [ anchorHelpMenu, setAnchorHelpMenu ] = useState<null | HTMLElement>(null);

    const openHelpMenu: boolean = Boolean(anchorHelpMenu);

    const handleHelpMenuClick = (event: { currentTarget: React.SetStateAction<HTMLElement> }) => {
        setAnchorHelpMenu(event.currentTarget);
    };

    const onCloseHelpMenu = (): void => {
        setAnchorHelpMenu(null);
    };

    const [ billingPortalURL, setBillingPortalURL ] = useState<string>(undefined);
    const [ upgradeButtonURL, setUpgradeButtonURL ] = useState<string>(undefined);
    const { isOrganizationManagementEnabled } = useGlobalVariables();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (saasFeatureStatus === FeatureStatus.DISABLED) {
            return;
        }

        CommonUtils.buildBillingURLs(tenantDomain, associatedTenants).then(
            ({ billingPortalURL, upgradeButtonURL }: { billingPortalURL: string; upgradeButtonURL: string }) => {
                setBillingPortalURL(billingPortalURL);
                setUpgradeButtonURL(upgradeButtonURL);
            }
        );
    }, [ tenantDomain, associatedTenants ]);

    /**
     * Show the organization switching dropdown only if
     *  - the organizations feature is enabled
     *  - the extensions config enables this
     *  - the requires scopes are there
     *  - the organization management feature is enabled by the backend
     *  - the user is logged in to a non-super-tenant account
     */
    const isOrgSwitcherEnabled: boolean = useMemo(() => (
        isOrganizationManagementEnabled &&
        (organizationType === OrganizationType.SUPER_ORGANIZATION ||
            organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
            organizationType === OrganizationType.SUBORGANIZATION ||
            organizationConfigs.showSwitcherInTenants)
    ), [ tenantDomain, organizationType, scopes ]);

    const resolveUsername = (): string => {
        if (profileInfo?.name?.givenName) {
            return profileInfo.name.givenName;
        }

        if (profileInfo?.name?.familyName) {
            return profileInfo.name.familyName;
        }

        if (profileInfo?.userName) {
            return profileInfo.userName;
        }

        return "";
    };

    const generateHeaderButtons = (): ReactElement[] => [
        window["AppUtils"].getConfig().docSiteUrl && (
            <Button
                color="inherit"
                onClick={ () => {
                    window.open(window["AppUtils"].getConfig().docSiteUrl, "_blank", "noopener");
                } }
                startIcon={ <DocsIcon /> }
                data-testid="dev-doc-site-link"
            >
                { I18n.instance.t("console:common.help.docSiteLink") as ReactNode }
            </Button>
        ),
        (window["AppUtils"].getConfig().extensions.getHelp) && (
            <>
                <Button
                    color="inherit"
                    startIcon={ <AskHelpIcon /> }
                    data-testid="get-help-dropdown-link"
                    className="oxygen-user-dropdown-button"
                    onClick={ handleHelpMenuClick }
                >
                    { I18n.instance.t("console:common.help.helpDropdownLink") as ReactNode }
                </Button>
                <Menu
                    open={ openHelpMenu }
                    anchorEl={ anchorHelpMenu }
                    className="oxygen-user-dropdown-menu header-help-menu"
                    id="header-help-menu"
                    anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                    transformOrigin={ { horizontal: "right", vertical: "top" } }
                    onClose={ onCloseHelpMenu }
                >
                    { window["AppUtils"].getConfig().extensions.getHelp.helpCenterURL && (
                        <>
                            <MenuItem
                                className="get-help-dropdown-item contact-support-dropdown-item"
                                onClick={ () => {
                                    window.open(
                                        window["AppUtils"].getConfig().extensions.getHelp.helpCenterURL,
                                        "_blank",
                                        "noopener noreferrer"
                                    );
                                } }
                            >
                                <>
                                    <ListItemIcon className="contact-support-icon get-help-icon">
                                        <TalkingHeadsetIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            (
                                                <span className="contact-support-title">
                                                    { t("console:common.help.helpCenterLink.title") }
                                                    <Chip
                                                        icon={ <DiamondIcon /> }
                                                        label={ t(FeatureStatusLabel.PREMIUM) }
                                                        className="oxygen-menu-item-chip oxygen-chip-premium"
                                                    />
                                                </span>
                                            )
                                        }
                                        secondary={
                                            (
                                                <Typography className="contact-support-subtitle" variant="inherit">
                                                    { t("console:common.help.helpCenterLink.subtitle",
                                                        { productName }) }
                                                </Typography>
                                            )
                                        }
                                    />
                                </>
                            </MenuItem>
                            <Divider className="get-help-dropdown-divider" />
                        </>
                    ) }
                    { window["AppUtils"].getConfig().extensions.getHelp.communityLinks.discord && (
                        <MenuItem
                            className="get-help-dropdown-item"
                            onClick={ () => {
                                window.open(window["AppUtils"].getConfig().extensions.getHelp.communityLinks.discord
                                    , "_blank", "noopener");
                            } }
                        >
                            <>
                                <ListItemIcon className="get-help-icon">
                                    <DiscordIcon />
                                </ListItemIcon>
                                <ListItemText primary={ t("console:common.help.communityLinks.discord") } />
                            </>
                        </MenuItem>
                    ) }
                    { window["AppUtils"].getConfig().extensions.getHelp.communityLinks.stackOverflow && (
                        <MenuItem
                            className="get-help-dropdown-item"
                            onClick={ () => {
                                window.open(window["AppUtils"].getConfig()
                                    .extensions.getHelp.communityLinks.stackOverflow
                                , "_blank", "noopener");
                            } }
                        >
                            <>
                                <ListItemIcon className="get-help-icon">
                                    <StackOverflowIcon />
                                </ListItemIcon>
                                <ListItemText primary={ t("console:common.help.communityLinks.stackOverflow") } />
                            </>
                        </MenuItem>
                    ) }
                </Menu>
            </>
        ),
        tierName === TenantTier.FREE &&
            billingPortalURL &&
            !isPrivilegedUser &&
            window["AppUtils"].getConfig().extensions.upgradeButtonEnabled && (
            <Show when={ [] } featureId={ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER }>
                <a href={ upgradeButtonURL } target="_blank" rel="noreferrer" data-componentid="upgrade-button-link">
                    <Button
                        className="header-upgrade-btn"
                        color="secondary"
                        variant="outlined"
                        startIcon={ <DiamondIcon /> }
                    >
                        <span className="header-upgrade-btn-text">
                            { I18n.instance.t("console:common.upgrade") as ReactNode }
                        </span>
                    </Button>
                </a>
            </Show>
        )
    ];

    const isShowAppSwitchButton = (): boolean => {
        if (!showAppSwitchButton) {
            return false;
        }

        return !userOrganizationID || userOrganizationID === window["AppUtils"].getConfig().organizationName;
    };

    /**
     * Get the my account url based on the user.
     *
     * @returns my account url.
     */
    const getMyAccountUrl = (): string => {
        if (isPrivilegedUser) {
            return privilegedUserAccountURL;
        } if (isSubOrganization) {
            return consumerAccountURL;
        }

        return accountAppURL;
    };

    const LOGO_IMAGE = () => {
        return (
            <Image
                src={ resolveAppLogoFilePath(
                    window["AppUtils"].getConfig().ui.appLogo?.defaultLogoPath ??
                        window["AppUtils"].getConfig().ui.appLogoPath,
                    `${window["AppUtils"].getConfig().clientOrigin}/` +
                        `${
                            StringUtils.removeSlashesFromPath(window["AppUtils"].getConfig().appBase) !== ""
                                ? StringUtils.removeSlashesFromPath(window["AppUtils"].getConfig().appBase) + "/"
                                : ""
                        }libs/themes/` +
                        config.ui.theme.name
                ) }
                alt="logo"
            />
        );
    };

    return (
        <OxygenHeader
            className="is-header"
            brand={ {
                logo: {
                    desktop: <LOGO_IMAGE />,
                    mobile: <LOGO_IMAGE />
                },
                onClick: () =>
                    hasGettingStartedViewPermission &&
                    history.push(config.deployment.appHomePath),
                title: config.ui.appName
            } }
            user={ {
                email:
                    profileInfo?.email ?? typeof profileInfo?.emails[0] === "string"
                        ? (profileInfo?.emails[0] as string)
                        : profileInfo?.emails[0]?.value,
                image: profileInfo?.profileUrl,
                name: resolveUsername()
            } }
            showCollapsibleHamburger
            onCollapsibleHamburgerClick={ onCollapsibleHamburgerClick }
            position="fixed"
            leftAlignedElements={ [ isOrgSwitcherEnabled ? <OrganizationSwitchBreadcrumb /> : null ] }
            rightAlignedElements={ generateHeaderButtons() }
            userDropdownMenu={ {
                actionIcon: <LogoutIcon />,
                actionText: t("common:logout"),
                footerContent: [
                    <Box key="footer" className="user-dropdown-footer">
                        <Link
                            variant="body3"
                            href={ getLink("common.privacyPolicy") }
                            target="_blank"
                            rel="noreferrer"
                        >
                            { I18n.instance.t("console:common.dropdown.footer.privacyPolicy") as string }
                        </Link>
                        <Link
                            variant="body3"
                            href={ getLink("common.cookiePolicy") }
                            target="_blank"
                            rel="noreferrer">
                            { I18n.instance.t("console:common.dropdown.footer.cookiePolicy") as string }
                        </Link>
                        <Link
                            variant="body3"
                            href={ getLink("common.termsOfService") }
                            target="_blank"
                            rel="noreferrer"
                        >
                            { I18n.instance.t("console:common.dropdown.footer.termsOfService") as string }
                        </Link>
                    </Box>
                ],
                menuItems: [
                    billingPortalURL &&
                        window["AppUtils"].getConfig().extensions.billingPortalUrl &&
                        !isPrivilegedUser && (
                        <Show when={ [] } featureId={ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER }>
                            <MenuItem
                                color="inherit"
                                onClick={ () => {
                                    window.open(billingPortalURL, "_blank", "noopener");
                                } }
                                data-testid="app-switch-billingPortal"
                            >
                                <ListItemIcon>
                                    <BillingPortalIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    { t("extensions:manage.features.header.links.billingPortalNav") }
                                </ListItemText>
                            </MenuItem>
                        </Show>
                    ),
                    isShowAppSwitchButton() ? (
                        <MenuItem
                            color="inherit"
                            key={ t("myAccount:components.header.appSwitch.console.name") }
                            onClick={ () => {
                                eventPublisher.publish("console-click-visit-my-account");
                                window.open(
                                    getMyAccountUrl(),
                                    "_blank",
                                    "noopener"
                                );
                            } }
                        >
                            <ListItemIcon>
                                <MyAccountIcon />
                            </ListItemIcon>
                            <ListItemText>{ t("console:common.header.appSwitch.myAccount.name") }</ListItemText>
                        </MenuItem>
                    ) : null
                ],
                onActionClick: () => history.push(AppConstants.getAppLogoutPath()),
                triggerOptions: {
                    "data-componentid": "app-header-user-avatar",
                    "data-testid": "app-header-user-avatar"
                }
            } }
            { ...rest }
        />
    );
};

export default Header;
