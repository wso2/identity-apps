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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import OxygenHeader from "@oxygen-ui/react/Header";
import Image from "@oxygen-ui/react/Image";
import Link from "@oxygen-ui/react/Link";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Menu from "@oxygen-ui/react/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import { FeatureStatus, Show, useCheckFeatureStatus } from "@wso2is/access-control";
import { OrganizationType } from "@wso2is/common";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { hasRequiredScopes, resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { LocalStorageUtils, StringUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import { GenericIcon, useDocumentation } from "@wso2is/react-components";
import {
    TenantTier,
    TenantTierRequestResponse
} from "apps/console/src/extensions/components/subscription/models/subscription";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { organizationConfigs } from "../../../extensions";
import { FeatureGateConstants } from "../../../extensions/components/feature-gate/constants/feature-gate";
import { SubscriptionContext } from "../../../extensions/components/subscription/contexts/subscription-context";
import { ReactComponent as LogoutIcon } from "../../../themes/default/assets/images/icons/logout-icon.svg";
import { ReactComponent as MyAccountIcon } from "../../../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as AskHelpIcon } from "../../../themes/wso2is/assets/images/icons/ask-help-icon.svg";
import { ReactComponent as CommunityIcon } from "../../../themes/wso2is/assets/images/icons/community-icon.svg";
import {
    ReactComponent as ContactSupportIcon
} from "../../../themes/wso2is/assets/images/icons/contact-support-icon.svg";
import { ReactComponent as DocsIcon } from "../../../themes/wso2is/assets/images/icons/docs-icon.svg";
import { ReactComponent as BillingPortalIcon } from "../../../themes/wso2is/assets/images/icons/dollar-icon.svg";
import { getApplicationList } from "../../applications/api";
import { ApplicationListInterface } from "../../applications/models";
import useAuthorization from "../../authorization/hooks/use-authorization";
import { OrganizationSwitchBreadcrumb } from "../../organizations/components/organization-switch";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { AppConstants } from "../constants";
import { history } from "../helpers";
import { ConfigReducerStateInterface, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { CommonUtils, EventPublisher } from "../utils";

/**
 * Dashboard layout Prop types.
 */
interface HeaderPropsInterface extends IdentifiableComponentInterface {
    handleSidePanelToggleClick?: () => void;
}

/**
 * Implementation of the Reusable Header component.
 *
 * @param props - Props injected to the component.
 * @returns react element containing the Reusable Header component.
 */
export const Header: FunctionComponent<HeaderPropsInterface> = (
    props: HeaderPropsInterface
): ReactElement => {
    const { handleSidePanelToggleClick } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const profileInfo: ProfileInfoInterface = useSelector(
        (state: AppState) => state.profile.profileInfo
    );
    const config: ConfigReducerStateInterface = useSelector(
        (state: AppState) => state.config
    );
    const showAppSwitchButton: boolean = useSelector(
        (state: AppState) => state.config.ui.showAppSwitchButton
    );
    const accountAppURL: string = useSelector(
        (state: AppState) => state.config.deployment.accountApp.path
    );
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );
    const associatedTenants: any[] = useSelector(
        (state: AppState) => state?.auth?.tenants
    );
    const privilegedUserAccountURL: string = useSelector(
        (state: AppState) =>
            state.config.deployment.accountApp.tenantQualifiedPath
    );
    const isPrivilegedUser: boolean = useSelector(
        (state: AppState) => state.auth.isPrivilegedUser
    );
    const feature: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const scopes: string = useSelector(
        (state: AppState) => state.auth.allowedScopes
    );
    const userOrganizationID: string = useSelector((state: AppState) =>
        state?.organization?.userOrganizationId);

    const { UIConfig } = useUIConfig();
    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const { tierName }: TenantTierRequestResponse = useContext(SubscriptionContext);

    const { organizationType } = useGetCurrentOrganizationType();

    const { legacyAuthzRuntime }  = useAuthorization();

    const [ anchorHelpMenu, setAnchorHelpMenu ] = useState<null | HTMLElement>(null);

    const openHelpMenu: boolean = Boolean(anchorHelpMenu);

    const handleHelpMenuClick = (event: { currentTarget: React.SetStateAction<HTMLElement>; }) => {
        setAnchorHelpMenu(event.currentTarget);
    };

    const onCloseHelpMenu = (): void => {
        setAnchorHelpMenu(null);
    };

    const [ billingPortalURL, setBillingPortalURL ] = useState<string>(undefined);
    const [ upgradeButtonURL, setUpgradeButtonURL ] = useState<string>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (saasFeatureStatus === FeatureStatus.DISABLED) {
            return;
        }

        CommonUtils.buildBillingURLs(tenantDomain, associatedTenants).then(
            ({
                billingPortalURL,
                upgradeButtonURL
            }: {
                billingPortalURL: string;
                upgradeButtonURL: string;
            }) => {
                setBillingPortalURL(billingPortalURL);
                setUpgradeButtonURL(upgradeButtonURL);
            }
        );
    }, []);

    /**
     * Show the organization switching dropdown only if
     *  - the organizations feature is enabled
     *  - the extensions config enables this
     *  - the requires scopes are there
     *  - the organization management feature is enabled by the backend
     *  - the user is logged in to a non-super-tenant account
     */
    const isOrgSwitcherEnabled: boolean = useMemo(() => {
        // If the organizations feature is disabled, do not show the org switcher.
        if (!UIConfig?.legacyMode?.organizations) {
            return false;
        }

        if (legacyAuthzRuntime) {
            return (
                isOrganizationManagementEnabled &&
                // The `tenantDomain` takes the organization id when you log in to a sub-organization.
                // So, we cannot use `tenantDomain` to check
                // if the user is logged in to a non-super-tenant account reliably.
                // So, we check if the organization id is there in the URL to see if the user is in a sub-organization.
                (tenantDomain === AppConstants.getSuperTenant() ||
                    window[ "AppUtils" ].getConfig().organizationName ||
                    organizationConfigs.showSwitcherInTenants) &&
                hasRequiredScopes(
                    feature?.organizations,
                    feature?.organizations?.scopes?.read,
                    scopes
                )
            );
        }

        return (
            isOrganizationManagementEnabled &&
            (organizationType === OrganizationType.SUPER_ORGANIZATION ||
                organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
                organizationType === OrganizationType.SUBORGANIZATION ||
                organizationConfigs.showSwitcherInTenants) &&
            hasRequiredScopes(
                feature?.organizations,
                feature?.organizations?.scopes?.read,
                scopes
            )
        );
    }, [
        tenantDomain,
        feature.organizations
    ]);

    /**
     * Check if there are applications registered and set the value to local storage.
     */
    useEffect(() => {
        if (
            !isEmpty(
                LocalStorageUtils.getValueFromLocalStorage("IsAppsAvailable")
            ) &&
            LocalStorageUtils.getValueFromLocalStorage("IsAppsAvailable") ===
            "true"
        ) {
            return;
        }

        getApplicationList(null, null, null)
            .then((response: ApplicationListInterface) => {
                LocalStorageUtils.setValueInLocalStorage(
                    "IsAppsAvailable",
                    response.totalResults > 0 ? "true" : "false"
                );
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            });
    }, []);

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

    const generateHeaderButtons = (): ReactElement[] => {
        return [
            window[ "AppUtils" ].getConfig().docSiteUrl && (
                <Button
                    color="inherit"
                    onClick={ () => {
                        window.open(
                            window[ "AppUtils" ].getConfig().docSiteUrl,
                            "_blank",
                            "noopener"
                        );
                    } }
                    startIcon={ <DocsIcon /> }
                    data-testid="dev-doc-site-link"
                >
                    {
                        I18n.instance.t(
                            "extensions:common.help.docSiteLink"
                        ) as ReactNode
                    }
                </Button>
            ),
            (window[ "AppUtils" ].getConfig().extensions.community ||
                window[ "AppUtils" ].getConfig().extensions.helpCenterUrl) && (
                <>
                    <Button
                        color="inherit"
                        startIcon={ <AskHelpIcon /> }
                        data-testid="get-help-dropdown-link"
                        className="oxygen-user-dropdown-button"
                        onClick={ handleHelpMenuClick }
                    >
                        { I18n.instance.t("extensions:common.help.helpDropdownLink") as ReactNode }
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
                        { window[ "AppUtils" ].getConfig().extensions.community && (
                            <MenuItem
                                className="get-help-dropdown-item"
                                onClick={ () => {
                                    window.open(
                                        window[ "AppUtils" ].getConfig()
                                            .extensions.community,
                                        "_blank",
                                        "noopener"
                                    );
                                } }
                            >
                                <>
                                    <ListItemIcon>
                                        <GenericIcon
                                            className="spaced-right"
                                            transparent
                                            fill="white"
                                            size="x22"
                                            icon={ CommunityIcon }
                                        />
                                    </ListItemIcon>
                                    { I18n.instance.t("extensions:common.help.communityLink") }
                                </>
                            </MenuItem>
                        ) }
                        { window[ "AppUtils" ].getConfig().extensions.helpCenterUrl && (
                            <MenuItem
                                className="get-help-dropdown-item"
                                onClick={ () => {
                                    window.open(
                                        window[ "AppUtils" ].getConfig()
                                            .extensions.helpCenterUrl,
                                        "_blank",
                                        "noopener"
                                    );
                                } }
                            >
                                <>
                                    <ListItemIcon>
                                        <GenericIcon
                                            className="spaced-right"
                                            transparent
                                            fill="white"
                                            size="x22"
                                            icon={ ContactSupportIcon }
                                        />
                                    </ListItemIcon>
                                    { I18n.instance.t("extensions:common.help.helpCenterLink") }
                                    <Chip
                                        label="PREMIUM"
                                        className="oxygen-menu-item-chip oxygen-chip-premium" />
                                </>
                            </MenuItem>
                        ) }
                    </Menu>
                </>
            ),
            tierName === TenantTier.FREE && billingPortalURL && !isPrivilegedUser &&
            window[ "AppUtils" ].getConfig().extensions
                .upgradeButtonEnabled && (
                <Show when={ [] } featureId={ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER }>
                    <a
                        href={ upgradeButtonURL }
                        target="_blank"
                        rel="noreferrer"
                        data-componentid="upgrade-button-link"
                    >
                        <Button
                            color="secondary"
                            variant="outlined"
                        >
                            {
                                I18n.instance.t(
                                    "extensions:common.upgrade"
                                ) as ReactNode
                            }
                        </Button>
                    </a>
                </Show>
            )
        ];
    };

    const isShowAppSwitchButton = (): boolean => {
        if (!showAppSwitchButton) {
            return false;
        }

        // Show the app switch button only if the user is logged in to the
        // user resident organization.
        if (!legacyAuthzRuntime) {
            return (!userOrganizationID
                || userOrganizationID === window[ "AppUtils" ].getConfig().organizationName);
        }

        return true;
    };

    const LOGO_IMAGE = () => {
        return (
            <Image
                src={ resolveAppLogoFilePath(
                    window[ "AppUtils" ].getConfig().ui.appLogoPath,
                    `${ window[ "AppUtils" ].getConfig().clientOrigin
                    }/` +
                    `${ StringUtils.removeSlashesFromPath(
                        window[ "AppUtils" ].getConfig()
                            .appBase
                    ) !== ""
                        ? StringUtils.removeSlashesFromPath(
                            window[ "AppUtils" ].getConfig()
                                .appBase
                        ) + "/"
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
                    desktop: (<LOGO_IMAGE />),
                    mobile: (<LOGO_IMAGE />)
                },
                onClick: () => history.push(config.deployment.appHomePath),
                title: config.ui.appName
            } }
            user={ {
                email:
                    profileInfo?.email ??
                        typeof profileInfo?.emails[ 0 ] === "string"
                        ? (profileInfo?.emails[ 0 ] as string)
                        : profileInfo?.emails[ 0 ]?.value,
                image: profileInfo?.profileUrl,
                name: resolveUsername()
            } }
            showCollapsibleHamburger
            onCollapsibleHamburgerClick={ handleSidePanelToggleClick }
            position="fixed"
            leftAlignedElements={ [
                isOrgSwitcherEnabled ? <OrganizationSwitchBreadcrumb /> : null
            ] }
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
                            { I18n.instance.t("extensions:common.dropdown.footer.privacyPolicy") as string }
                        </Link>
                        <Link
                            variant="body3"
                            href={ getLink("common.cookiePolicy") }
                            target="_blank"
                            rel="noreferrer"
                        >
                            { I18n.instance.t("extensions:common.dropdown.footer.cookiePolicy") as string }
                        </Link>
                        <Link
                            variant="body3"
                            href={ getLink("common.termsOfService") }
                            target="_blank"
                            rel="noreferrer"
                        >
                            { I18n.instance.t("extensions:common.dropdown.footer.termsOfService") as string }
                        </Link>
                    </Box>
                ],
                menuItems: [
                    billingPortalURL && window[ "AppUtils" ].getConfig().extensions.billingPortalUrl &&
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
                                    { t(
                                        "extensions:manage.features.header.links.billingPortalNav"
                                    ) }
                                </ListItemText>
                            </MenuItem>
                        </Show>
                    ),
                    isShowAppSwitchButton()
                        ? (
                            <MenuItem
                                color="inherit"
                                key={ t(
                                    "myAccount:components.header.appSwitch.console.name"
                                ) }
                                onClick={ () => {
                                    eventPublisher.publish(
                                        "console-click-visit-my-account"
                                    );
                                    window.open(
                                        isPrivilegedUser
                                            ? privilegedUserAccountURL
                                            : accountAppURL,
                                        "_blank",
                                        "noopener"
                                    );
                                } }
                            >
                                <ListItemIcon>
                                    <MyAccountIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    { t("console:common.header.appSwitch.myAccount.name") }
                                </ListItemText>
                            </MenuItem>
                        ) : null
                ],
                onActionClick: () =>
                    history.push(AppConstants.getAppLogoutPath()),
                triggerOptions: {
                    "data-componentid": "app-header-user-avatar",
                    "data-testid": "app-header-user-avatar"
                }
            } }
        />
    );
};

/**
 * Default props for the component.
 */
Header.defaultProps = {
    "data-componentid": "app-header",
    handleSidePanelToggleClick: () => null
};
