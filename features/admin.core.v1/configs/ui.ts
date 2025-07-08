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

import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1/constants";
import { FunctionComponent, ReactNode } from "react";
import { ReactComponent as AlertIcon } from "../../themes/default/assets/images/icons/alert-icon.svg";
import {
    ReactComponent as ApplicationRolesIcon
} from "../../themes/default/assets/images/icons/application-roles.svg";
import { ReactComponent as ArrowRight } from "../../themes/default/assets/images/icons/arrow-right-icon.svg";
import { ReactComponent as CaretLeftIcon } from "../../themes/default/assets/images/icons/caret-left-icon.svg";
import { ReactComponent as CaretRightIcon } from "../../themes/default/assets/images/icons/caret-right-icon.svg";
import {
    ReactComponent as CertificateAvatar
} from "../../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as CertificateIcon } from "../../themes/default/assets/images/icons/certificate-icon.svg";
import { ReactComponent as ClaimsIcon } from "../../themes/default/assets/images/icons/claims-icon.svg";
import { ReactComponent as CodeForkIcon } from "../../themes/default/assets/images/icons/code-fork.svg";
import { ReactComponent as ConnectionIcon } from "../../themes/default/assets/images/icons/connection.svg";
import ConsoleIcon from "../../themes/default/assets/images/icons/console-icon.svg";
import { ReactComponent as CrossIcon } from "../../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as DatabaseIcon } from "../../themes/default/assets/images/icons/database-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as EmailIcon } from "../../themes/default/assets/images/icons/email-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as GearsIcon } from "../../themes/default/assets/images/icons/gears-icon.svg";
import LogoutIcon from "../../themes/default/assets/images/icons/logout-icon.svg";
import { ReactComponent as MaximizeIcon } from "../../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as MinimizeIcon } from "../../themes/default/assets/images/icons/minimize-icon.svg";
import MyAccountIcon from "../../themes/default/assets/images/icons/myaccount-icon.svg";
import {
    ReactComponent as OrganizationRolesIcon
} from "../../themes/default/assets/images/icons/organization-roles.svg";
import {
    ReactComponent as AccountManagementOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/account-management-outline.svg";
import {
    ReactComponent as AdminAdvisoryBannerIcon
} from "../../themes/default/assets/images/icons/outline-icons/admin-advisory-outline.svg";
import {
    ReactComponent as AdminOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/admin-outline.svg";
import { ReactComponent as AgentOutlineIcon } from "../../themes/default/assets/images/icons/outline-icons/agent.svg";
import {
    ReactComponent as AnalyticsIcon
} from "../../themes/default/assets/images/icons/outline-icons/analytics.svg";
import {
    ReactComponent as ApplicationsOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/application-outline.svg";
import {
    ReactComponent as BriefcaseIcon
} from "../../themes/default/assets/images/icons/outline-icons/briefcase-outline.svg";
import {
    ReactComponent as CloudConnectionOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/cloud-connection-outline.svg";
import { ReactComponent as HomeIcon } from "../../themes/default/assets/images/icons/outline-icons/home-outline.svg";
import {
    ReactComponent as IDPOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/idp-provider-outline.svg";
import {
    ReactComponent as IDVPOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/idvp-outline.svg";
import {
    ReactComponent as KeyOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/key-outline.svg";
import {
    ReactComponent as LDAPOutlineLegacyIcon
} from "../../themes/default/assets/images/icons/outline-icons/ldap-outline-legacy.svg";
import {
    ReactComponent as LDAPOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/ldap-outline.svg";
import {
    ReactComponent as LoginAttemptSecurityOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/login-attempts-outline.svg";
import {
    ReactComponent as UserOnboardingOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/onboarding-outline.svg";
import {
    ReactComponent as OtherSettingsOutlineIcon
} from "../../themes/default/assets/images/icons/outline-icons/other-settings-outline.svg";
import {
    ReactComponent as ApprovalsIcon
} from "../../themes/default/assets/images/icons/outline-icons/pending-approval-outline.svg";
import {
    ReactComponent as RemoteLoggingIcon
} from "../../themes/default/assets/images/icons/outline-icons/remote-logging.svg";
import { ReactComponent as PinIcon } from "../../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlugIcon } from "../../themes/default/assets/images/icons/plug-icon.svg";
import {
    ReactComponent as PushNotificationProviderIcon
} from "../../themes/default/assets/images/icons/push-provider-icon.svg";
import { ReactComponent as ScopeIcon } from "../../themes/default/assets/images/icons/scope.svg";
import {
    ReactComponent as LockIconFilled
} from "../../themes/default/assets/images/icons/secret-grey.svg";
import { ReactComponent as SMSIcon } from "../../themes/default/assets/images/icons/sms-icon.svg";
import {
    ReactComponent as DarkModeIcon
} from "../../themes/default/assets/images/icons/solid-icons/crescent-icon.svg";
import { ReactComponent as KeyIcon } from "../../themes/default/assets/images/icons/solid-icons/key.svg";
import {
    ReactComponent as LightModeIcon
} from "../../themes/default/assets/images/icons/solid-icons/light-icon.svg";
import {
    ReactComponent as MyAccountSolidIcon
} from "../../themes/default/assets/images/icons/solid-icons/my-account-icon.svg";
import {
    ReactComponent as OpenBookIcon
} from "../../themes/default/assets/images/icons/solid-icons/oidc.svg";
import { ReactComponent as UnPinIcon } from "../../themes/default/assets/images/icons/unpin-icon.svg";
import { ReactComponent as FileUploadIllustration } from "../../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as UserGroupIcon } from "../../themes/default/assets/images/icons/user-group-icon.svg";
import { ReactComponent as UserIcon } from "../../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as CertificateBadge } from "../../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../../themes/default/assets/images/illustrations/certificate.svg";
import {
    ReactComponent as JWTKey
} from "../../themes/default/assets/images/illustrations/jwt-key-icon.svg";
import { ReactComponent as CertificateRibbon } from "../../themes/default/assets/images/illustrations/ribbon.svg";
import {
    ReactComponent as BrokenPageIllustration
} from "../../themes/default/assets/images/placeholder-illustrations/broken-page-illustration.svg";
import {
    ReactComponent as CreateErrorIllustration
} from "../../themes/default/assets/images/placeholder-illustrations/create-error-illustration.svg";
import {
    ReactComponent as EmptyListIllustration
} from "../../themes/default/assets/images/placeholder-illustrations/empty-list-illustration.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../../themes/default/assets/images/placeholder-illustrations/empty-search-illustration.svg";
import {
    ReactComponent as PageNotFoundIllustration
} from "../../themes/default/assets/images/placeholder-illustrations/page-not-found-illustration.svg";
import AxschemaLogo from "../../themes/default/assets/images/protocols/axschema.png";
import EidasLogo from "../../themes/default/assets/images/protocols/eidas.png";
import OAuth2Logo from "../../themes/default/assets/images/protocols/oauth2.png";
import OIDCFullLogo from "../../themes/default/assets/images/protocols/oidc.png";
import OIDCLogo from "../../themes/default/assets/images/protocols/openid-connect.png";
import SamlLogo from "../../themes/default/assets/images/protocols/saml.png";
import SCIMLogo from "../../themes/default/assets/images/protocols/scim.png";
import WSFedLogo from "../../themes/default/assets/images/protocols/ws-fed.png";
import { ReactComponent as AndroidLogo } from "../../themes/default/assets/images/technologies/android-logo.svg";
import { ReactComponent as AngularLogo } from "../../themes/default/assets/images/technologies/angular-logo.svg";
import { ReactComponent as AppleLogo } from "../../themes/default/assets/images/technologies/apple-logo.svg";
import { ReactComponent as CSharpLogo } from "../../themes/default/assets/images/technologies/c-sharp-logo.svg";
import { ReactComponent as CordovaLogo } from "../../themes/default/assets/images/technologies/cordova-logo.svg";
import { ReactComponent as DotNetLogo } from "../../themes/default/assets/images/technologies/dotnet-logo.svg";
import { ReactComponent as FlutterLogo } from "../../themes/default/assets/images/technologies/flutter-logo.svg";
import { ReactComponent as HTMLLogo } from "../../themes/default/assets/images/technologies/html-logo.svg";
import { ReactComponent as IOSLogo } from "../../themes/default/assets/images/technologies/ios-logo.svg";
import { ReactComponent as JavaLogo } from "../../themes/default/assets/images/technologies/java-logo.svg";
import {
    ReactComponent as JavaScriptLogo
} from "../../themes/default/assets/images/technologies/javascript-logo.svg";
import MacOSLogo from "../../themes/default/assets/images/technologies/macos-logo.png";
import { ReactComponent as NodeJSLogo } from "../../themes/default/assets/images/technologies/nodejs-logo.svg";
import { ReactComponent as PHPLogo } from "../../themes/default/assets/images/technologies/php-logo.svg";
import { ReactComponent as PythonLogo } from "../../themes/default/assets/images/technologies/python-logo.svg";
import { ReactComponent as ReactLogo } from "../../themes/default/assets/images/technologies/react-logo.svg";
import { ReactComponent as VueLogo } from "../../themes/default/assets/images/technologies/vue-logo.svg";
import { ReactComponent as WindowsLogo } from "../../themes/default/assets/images/technologies/windows-logo.svg";
import {
    ReactComponent as MCPServersOutlineIcon
} from "../../themes/wso2is/assets/images/icons/outline-icons/mcp-servers-outline.svg";

/**
 * Typed interface of {@link getTechnologyLogos}
 */
interface GetTechnologyLogosInterface {
    android: FunctionComponent | ReactNode,
    angular: FunctionComponent | ReactNode,
    apple: FunctionComponent | ReactNode,
    axschema: string,
    cSharp: FunctionComponent | ReactNode,
    cordova: FunctionComponent | ReactNode,
    dotNet: FunctionComponent | ReactNode,
    eidas: string,
    flutter: FunctionComponent | ReactNode,
    html: FunctionComponent | ReactNode,
    ios: FunctionComponent | ReactNode,
    java: FunctionComponent | ReactNode,
    javascript: FunctionComponent | ReactNode,
    macos: string,
    nodejs: FunctionComponent | ReactNode,
    oauth2: string,
    oidc: string,
    openidconnect: string,
    php: FunctionComponent | ReactNode,
    python: FunctionComponent | ReactNode,
    react: FunctionComponent | ReactNode,
    saml: string,
    scim: string,
    vue: FunctionComponent | ReactNode,
    windows: FunctionComponent | ReactNode,
    wsFed: FunctionComponent | ReactNode,
}

/**
 * Get Technology Logos. Please add the types to
 * {@link GetTechnologyLogosInterface} if introducing
 * new icons/images.
 */
export const getTechnologyLogos = (): GetTechnologyLogosInterface => {

    return {
        android: AndroidLogo,
        angular: AngularLogo,
        apple: AppleLogo,
        axschema: AxschemaLogo,
        cSharp: CSharpLogo,
        cordova: CordovaLogo,
        dotNet: DotNetLogo,
        eidas: EidasLogo,
        flutter: FlutterLogo,
        html: HTMLLogo,
        ios: IOSLogo,
        java: JavaLogo,
        javascript: JavaScriptLogo,
        macos: MacOSLogo,
        nodejs: NodeJSLogo,
        oauth2: OAuth2Logo,
        oidc: OIDCLogo,
        openidconnect: OIDCFullLogo,
        php: PHPLogo,
        python: PythonLogo,
        react: ReactLogo,
        saml: SamlLogo,
        scim: SCIMLogo,
        vue: VueLogo,
        windows: WindowsLogo,
        wsFed: WSFedLogo
    };
};

/**
 * Typed interface of {@link getSidePanelIcons}
 */
export type GetSidePanelIconsInterface = {
    adminAdvisoryBanner: FunctionComponent | ReactNode,
    policyAdministration: FunctionComponent | ReactNode,
    administrators: FunctionComponent | ReactNode,
    apiResources: FunctionComponent | ReactNode,
    applicationRoles: FunctionComponent | ReactNode,
    appLogs: FunctionComponent | ReactNode,
    applications: FunctionComponent | ReactNode,
    approvals: FunctionComponent | ReactNode,
    certificate: FunctionComponent | ReactNode,
    childIcon: FunctionComponent | ReactNode,
    claims: FunctionComponent | ReactNode,
    connections: FunctionComponent | ReactNode,
    connectors: Record<string, FunctionComponent | ReactNode>,
    emailTemplates: FunctionComponent | ReactNode,
    gears: FunctionComponent | ReactNode,
    groups: FunctionComponent | ReactNode,
    home: FunctionComponent | ReactNode,
    identityProviders: FunctionComponent | ReactNode,
    identityVerificationProviders: FunctionComponent | ReactNode,
    jwtKey: FunctionComponent | ReactNode,
    mcpServers: FunctionComponent | ReactNode,
    organization: FunctionComponent | ReactNode,
    organizationLegacy: FunctionComponent | ReactNode,
    overview: FunctionComponent | ReactNode,
    push: FunctionComponent | ReactNode,
    remoteFetch: FunctionComponent | ReactNode,
    remoteLogging: FunctionComponent | ReactNode,
    roles: FunctionComponent | ReactNode,
    organizationRoles: FunctionComponent | ReactNode,
    scopes: FunctionComponent | ReactNode,
    secrets: FunctionComponent | ReactNode,
    serverConfigurations: FunctionComponent | ReactNode,
    sms: FunctionComponent | ReactNode,
    userStore: FunctionComponent | ReactNode,
    users: FunctionComponent | ReactNode,
    insights: FunctionComponent | ReactNode,
    agents: FunctionComponent | ReactNode,
};

/**
 * Get Side Panel Icons. Please add the types to
 * {@link GetSidePanelIconsInterface} if introducing
 * new icons/images.
 */
export const getSidePanelIcons = (): GetSidePanelIconsInterface => {

    return {
        adminAdvisoryBanner: AdminAdvisoryBannerIcon,
        administrators: AdminOutlineIcon,
        agents: AgentOutlineIcon,
        apiResources: CloudConnectionOutlineIcon,
        appLogs: IDPMetadataIcon,
        applicationRoles: ApplicationRolesIcon,
        applications: ApplicationsOutlineIcon,
        approvals: ApprovalsIcon,
        certificate: CertificateIcon,
        childIcon: ArrowRight,
        claims: ClaimsIcon,
        connections: ConnectionIcon,
        connectors: {
            [ ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID ]: AccountManagementOutlineIcon,
            [ ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID ]: UserOnboardingOutlineIcon,
            [
            ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
            ]: LoginAttemptSecurityOutlineIcon,
            [ ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID ]: KeyOutlineIcon,
            [ ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID ]: OtherSettingsOutlineIcon,
            default: PlugIcon
        },
        emailTemplates: EmailIcon,
        gears: GearsIcon,
        groups: UserGroupIcon,
        home: HomeIcon,
        identityProviders: IDPOutlineIcon,
        identityVerificationProviders: IDVPOutlineIcon ,
        insights: AnalyticsIcon,
        jwtKey: JWTKey,
        mcpServers: MCPServersOutlineIcon,
        organization: LDAPOutlineIcon,
        organizationLegacy: LDAPOutlineLegacyIcon,
        organizationRoles: OrganizationRolesIcon,
        overview: DashboardIcon,
        policyAdministration: AdminOutlineIcon,
        push: PushNotificationProviderIcon,
        remoteFetch: CodeForkIcon,
        remoteLogging: RemoteLoggingIcon,
        roles: BriefcaseIcon,
        scopes: ScopeIcon,
        secrets: KeyOutlineIcon,
        serverConfigurations: GearsIcon,
        sms: SMSIcon,
        userStore: DatabaseIcon,
        users: UserIcon
    };
};

/**
 * Typed interface of {@link getSidePanelMiscIcons}
 */
export type GetSidePanelMiscIconsInterface = {
    caretRight: FunctionComponent | ReactNode,
};

/**
 * Get Side Panel Miscellaneous Icons. Please add the types to
 * {@link GetSidePanelMiscIconsInterface} if introducing
 * new icons/images.
 */
export const getSidePanelMiscIcons = (): GetSidePanelMiscIconsInterface => {

    return {
        caretRight: CaretRightIcon
    };
};

/**
 * Typed interface of {@link getAdvancedSearchIcons}
 */
export type GetAdvancedSearchIconsInterface = {
    clear: FunctionComponent | ReactNode,
};

/**
 * Get Advanced Search Icons. Please add the types to
 * {@link GetAdvancedSearchIconsInterface} if introducing
 * new icons/images.
 */
export const getAdvancedSearchIcons = (): GetAdvancedSearchIconsInterface  => {

    return {
        clear: CrossIcon
    };
};

/**
 * Typed interface of {@link getEmptyPlaceholderIllustrations}
 */
export type GetEmptyPlaceholderIllustrationsInterface = {
    alert: FunctionComponent | ReactNode,
    brokenPage: FunctionComponent | ReactNode,
    createError: FunctionComponent | ReactNode,
    emptyList: FunctionComponent | ReactNode,
    emptySearch: FunctionComponent | ReactNode,
    fileUpload: FunctionComponent | ReactNode,
    genericError: FunctionComponent | ReactNode,
    loginError: FunctionComponent | ReactNode,
    newList: FunctionComponent | ReactNode,
    pageNotFound: FunctionComponent | ReactNode,
    search: FunctionComponent | ReactNode
};

/**
 * Get Empty Placeholder Illustrations. Please add the types to
 * {@link GetEmptyPlaceholderIllustrationsInterface} if introducing
 * new icons/images.
 */
export const getEmptyPlaceholderIllustrations = (): GetEmptyPlaceholderIllustrationsInterface => {

    return {
        alert: AlertIcon,
        brokenPage: BrokenPageIllustration,
        createError: CreateErrorIllustration,
        emptyList: EmptyListIllustration,
        emptySearch: EmptySearchResultsIllustration,
        fileUpload: FileUploadIllustration,
        genericError: BrokenPageIllustration,
        loginError: ForbiddenIcon,
        newList: EmptyListIllustration,
        pageNotFound: PageNotFoundIllustration,
        search: EmptySearchResultsIllustration
    };
};

/**
 * Typed interface of {@link getOperationIcons}
 */
export type GetOperationIconsInterface = {
    darkMode: FunctionComponent | ReactNode,
    drag: FunctionComponent | ReactNode,
    keyIcon: FunctionComponent | ReactNode,
    lightMode: FunctionComponent | ReactNode,
    maximize: FunctionComponent | ReactNode,
    minimize: FunctionComponent | ReactNode,
    openBookIcon: FunctionComponent | ReactNode
};

/**
 * Get Operation Icons. Please add the types to
 * {@link GetOperationIconsInterface} if introducing
 * new icons/images.
 */
export const getOperationIcons = (): GetOperationIconsInterface => {

    return {
        darkMode: DarkModeIcon,
        drag: DragSquaresIcon,
        keyIcon: KeyIcon,
        lightMode: LightModeIcon,
        maximize: MaximizeIcon,
        minimize: MinimizeIcon,
        openBookIcon: OpenBookIcon
    };
};

/**
 * Typed interface of {@link getHelpPanelActionIcons}
 */
export type GetHelpPanelActionIconsInterface = {
    caretLeft: FunctionComponent | ReactNode,
    caretRight: FunctionComponent | ReactNode,
    close: FunctionComponent | ReactNode,
    pin: FunctionComponent | ReactNode,
    unpin: FunctionComponent | ReactNode
};

/**
 * Get Certificate illustrations. Please add the types to
 * {@link GetHelpPanelActionIconsInterface} if introducing
 * new icons/images.
 */
export const getHelpPanelActionIcons = (): GetHelpPanelActionIconsInterface => {

    return {
        caretLeft: CaretLeftIcon,
        caretRight: CaretRightIcon,
        close: CrossIcon,
        pin: PinIcon,
        unpin: UnPinIcon
    };
};

/**
 * Typed interface of {@link getCertificateIllustrations}
 */
export type GetCertificateIllustrationsInterface = {
    avatar: FunctionComponent | ReactNode,
    badge: FunctionComponent | ReactNode,
    file: FunctionComponent | ReactNode,
    ribbon: FunctionComponent | ReactNode,
    uploadPlaceholder: FunctionComponent | ReactNode
};

/**
 * Get Certificate illustrations. Please add the types to
 * {@link GetCertificateIllustrationsInterface} if introducing
 * new icons/images.
 */
export const getCertificateIllustrations = (): GetCertificateIllustrationsInterface => {

    return {
        avatar: CertificateAvatar,
        badge: CertificateBadge,
        file: CertificateIllustration,
        ribbon: CertificateRibbon,
        uploadPlaceholder: FileUploadIllustration
    };
};

/**
 * Typed interface of {@link getSecretManagementIllustrations}
 */
export type GetSecretManagementIllustrationsInterface = {
    editingSecretIcon: FunctionComponent | ReactNode
};

/**
 * Secret Management illustrations. Please add the types to
 * {@link GetSecretManagementIllustrationsInterface} if introducing
 * new icons/images.
 */
export const getSecretManagementIllustrations = (): GetSecretManagementIllustrationsInterface => {
    return {
        editingSecretIcon: LockIconFilled
    };
};

/**
 * Typed interface of {@link getMiscellaneousIcons}
 */
export type GetMiscellaneousIconsInterface = {
    tenantIcon: FunctionComponent | ReactNode,
    tenantLegacyIcon: FunctionComponent | ReactNode
};

/**
 * Miscellaneous Icons. Please add the types to
 * {@link GetMiscellaneousIconsInterface} if introducing
 * new icons/images.
 */
export const getMiscellaneousIcons = (): GetMiscellaneousIconsInterface => {

    return {
        tenantIcon: LDAPOutlineIcon,
        tenantLegacyIcon: LDAPOutlineLegacyIcon
    };
};

/**
 * Typed interface of {@link AppSwitcherIcons}
 */
export type GetAppSwitcherIconsInterface = {
    console: string,
    logout: string,
    myAccount: string
};

/**
 * App Switcher Icons. Please add the types to
 * {@link GetAppSwitcherIconsInterface} if introducing
 * new icons/images.
 */
export const AppSwitcherIcons = (): GetAppSwitcherIconsInterface => {

    return {
        console: ConsoleIcon,
        logout: LogoutIcon,
        myAccount: MyAccountIcon
    };
};

/**
 * Typed interface of {@link getGeneralIcons}
 */
export type GetGeneralIconsInterface = {
    crossIcon: FunctionComponent | ReactNode,
    myAccountSolidIcon: FunctionComponent | ReactNode
};

/**
 * Get General Icons. Please add the types to
 * {@link GetGeneralIconsInterface} if introducing
 * new icons/images.
 */
export const getGeneralIcons = (): GetGeneralIconsInterface => {

    return {
        crossIcon: CrossIcon,
        myAccountSolidIcon: MyAccountSolidIcon
    };
};

/**
 * Typed interface of {@link getAppHeaderIcons}
 */
export type GetAppHeaderIconsInterface = {
    homeIcon: FunctionComponent | ReactNode,
};

/**
 * App Header Icons. Please add the types to
 * {@link GetAppHeaderIconsInterface} if introducing
 * new icons/images.
 */
export const getAppHeaderIcons = (): GetAppHeaderIconsInterface => {

    return {
        homeIcon: HomeIcon
    };
};
