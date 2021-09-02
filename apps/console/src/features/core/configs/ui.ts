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

import { FunctionComponent, SVGProps } from "react";
import { ReactComponent as AlertIcon } from "../../../themes/default/assets/images/icons/alert-icon.svg";
import { ReactComponent as ArrowRight } from "../../../themes/default/assets/images/icons/arrow-right-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../../../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BriefcaseIcon } from "../../../themes/default/assets/images/icons/briefcase-icon.svg";
import { ReactComponent as CaretLeftIcon } from "../../../themes/default/assets/images/icons/caret-left-icon.svg";
import { ReactComponent as CaretRightIcon } from "../../../themes/default/assets/images/icons/caret-right-icon.svg";
import {
    ReactComponent as CertificateAvatar
} from "../../../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as CertificateIcon } from "../../../themes/default/assets/images/icons/certificate-icon.svg";
import { ReactComponent as ClaimsIcon } from "../../../themes/default/assets/images/icons/claims-icon.svg";
import { ReactComponent as CloseIcon } from "../../../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CodeForkIcon } from "../../../themes/default/assets/images/icons/code-fork.svg";
import { ReactComponent as ConnectionIcon } from "../../../themes/default/assets/images/icons/connection.svg";
import ConsoleIcon from "../../../themes/default/assets/images/icons/console-icon.svg";
import { ReactComponent as CrossIcon } from "../../../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../../../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as DatabaseIcon } from "../../../themes/default/assets/images/icons/database-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../../../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../../../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import { ReactComponent as LockIcon } from "../../../themes/default/assets/images/icons/lock-icon.svg";
import { ReactComponent as MaximizeIcon } from "../../../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../../../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as MinimizeIcon } from "../../../themes/default/assets/images/icons/minimize-icon.svg";
import MyAccountIcon from "../../../themes/default/assets/images/icons/myaccount-icon.svg";
import {
    ReactComponent as AccountManagementOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/account-management-outline.svg";
import {
    ReactComponent as ApplicationsOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/application-outline.svg";
import {
    ReactComponent as IDPOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/idp-provider-outline.svg";
import {
    ReactComponent as KeyOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/key-outline.svg";
import {
    ReactComponent as LDAPOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/ldap-outline.svg";
import {
    ReactComponent as LoginAttemptSecurityOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/login-attempts-outline.svg";
import {
    ReactComponent as UserOnboardingOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/onboarding-outline.svg";
import {
    ReactComponent as OtherSettingsOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/other-settings-outline.svg";
import {
    ReactComponent as ApprovalsIcon
} from "../../../themes/default/assets/images/icons/outline-icons/pending-approval-outline.svg";
import { ReactComponent as PaperRocketIcon } from "../../../themes/default/assets/images/icons/paper-rocket-icon.svg";
import { ReactComponent as PinIcon } from "../../../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlugIcon } from "../../../themes/default/assets/images/icons/plug-icon.svg";
import { ReactComponent as ScopeIcon } from "../../../themes/default/assets/images/icons/scope.svg";
import {
    ReactComponent as DarkModeIcon
} from "../../../themes/default/assets/images/icons/solid-icons/crescent-icon.svg";
import {
    ReactComponent as LightModeIcon
} from "../../../themes/default/assets/images/icons/solid-icons/light-icon.svg";
import { ReactComponent as UnPinIcon } from "../../../themes/default/assets/images/icons/unpin-icon.svg";
import { ReactComponent as FileUploadIllustration } from "../../../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as UserGroupIcon } from "../../../themes/default/assets/images/icons/user-group-icon.svg";
import { ReactComponent as UserIcon } from "../../../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as CertificateBadge } from "../../../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../../../themes/default/assets/images/illustrations/certificate.svg";
import { ReactComponent as CertificateRibbon } from "../../../themes/default/assets/images/illustrations/ribbon.svg";
import {
    ReactComponent as BrokenPageIllustration
} from "../../../themes/default/assets/images/placeholder-illustrations/broken-page-illustration.svg";
import {
    ReactComponent as EmptyListIllustration
} from "../../../themes/default/assets/images/placeholder-illustrations/empty-list-illustration.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../../../themes/default/assets/images/placeholder-illustrations/empty-search-illustration.svg";
import OIDCFullLogo from "../../../themes/default/assets/images/protocols/oidc.png";
import OIDCLogo from "../../../themes/default/assets/images/protocols/openid-connect.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import SCIMLogo from "../../../themes/default/assets/images/protocols/scim.png";
import { ReactComponent as AndroidLogo } from "../../../themes/default/assets/images/technologies/android-logo.svg";
import { ReactComponent as AngularLogo } from "../../../themes/default/assets/images/technologies/angular-logo.svg";
import { ReactComponent as AppleLogo } from "../../../themes/default/assets/images/technologies/apple-logo.svg";
import { ReactComponent as CSharpLogo } from "../../../themes/default/assets/images/technologies/c-sharp-logo.svg";
import { ReactComponent as CordovaLogo } from "../../../themes/default/assets/images/technologies/cordova-logo.svg";
import { ReactComponent as DotNetLogo } from "../../../themes/default/assets/images/technologies/dotnet-logo.svg";
import { ReactComponent as HTMLLogo } from "../../../themes/default/assets/images/technologies/html-logo.svg";
import { ReactComponent as IOSLogo } from "../../../themes/default/assets/images/technologies/ios-logo.svg";
import { ReactComponent as JavaLogo } from "../../../themes/default/assets/images/technologies/java-logo.svg";
import {
    ReactComponent as JavaScriptLogo
} from "../../../themes/default/assets/images/technologies/javascript-logo.svg";
import MacOSLogo from "../../../themes/default/assets/images/technologies/macos-logo.png";
import { ReactComponent as NodeJSLogo } from "../../../themes/default/assets/images/technologies/nodejs-logo.svg";
import { ReactComponent as PythonLogo } from "../../../themes/default/assets/images/technologies/python-logo.svg";
import { ReactComponent as ReactLogo } from "../../../themes/default/assets/images/technologies/react-logo.svg";
import { ReactComponent as VueLogo } from "../../../themes/default/assets/images/technologies/vue-logo.svg";
import { ReactComponent as WindowsLogo } from "../../../themes/default/assets/images/technologies/windows-logo.svg";
import { ServerConfigurationsConstants } from "../../server-configurations/constants";

export const getTechnologyLogos = () => {

    return {
        android: AndroidLogo,
        angular: AngularLogo,
        apple: AppleLogo,
        cSharp: CSharpLogo,
        cordova: CordovaLogo,
        dotNet: DotNetLogo,
        html: HTMLLogo,
        ios: IOSLogo,
        java: JavaLogo,
        javascript: JavaScriptLogo,
        macos: MacOSLogo,
        nodejs: NodeJSLogo,
        oidc: OIDCLogo,
        openidconnect: OIDCFullLogo,
        python: PythonLogo,
        react: ReactLogo,
        saml: SamlLogo,
        scim: SCIMLogo,
        vue: VueLogo,
        windows: WindowsLogo
    };
};

export const getSidePanelIcons = () => {

    return {
        appLogs: IDPMetadataIcon,
        applications: ApplicationsOutlineIcon,
        approvals: ApprovalsIcon,
        certificate: CertificateIcon,
        childIcon: ArrowRight,
        claims: ClaimsIcon,
        connections: ConnectionIcon,
        connectors: {
            [ ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID ]: AccountManagementOutlineIcon,
            [ ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID ]: UserOnboardingOutlineIcon,
            [ ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                ]: LoginAttemptSecurityOutlineIcon,
            [ ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID ]: KeyOutlineIcon,
            [ ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID ]: OtherSettingsOutlineIcon,
            default: PlugIcon
        },
        emailTemplates: PaperRocketIcon,
        groups: UserGroupIcon,
        identityProviders: IDPOutlineIcon,
        overview: DashboardIcon,
        remoteFetch: CodeForkIcon,
        roles: BriefcaseIcon,
        scopes: ScopeIcon,
        secrets: LockIcon,
        serverConfigurations: GearsIcon,
        userStore: DatabaseIcon,
        users: UserIcon
    };
};

export const getSidePanelMiscIcons = () => {

    return {
        caretRight: CaretRightIcon
    };
};

export const getAdvancedSearchIcons = () => {

    return {
        clear: CrossIcon
    };
};

export const getEmptyPlaceholderIllustrations = () => {

    return {
        alert: AlertIcon,
        brokenPage: BrokenPageIllustration,
        emptyList: EmptyListIllustration,
        emptySearch: EmptySearchResultsIllustration,
        fileUpload: FileUploadIllustration,
        genericError: CloseIcon,
        loginError: ForbiddenIcon,
        newList: EmptyListIllustration,
        pageNotFound: BlockedMagnifierIcon,
        search: EmptySearchResultsIllustration
    };
};

export const getOperationIcons = () => {

    return {
        darkMode: DarkModeIcon,
        drag: DragSquaresIcon,
        lightMode: LightModeIcon,
        maximize: MaximizeIcon,
        minimize: MinimizeIcon
    };
};

export const getHelpPanelActionIcons = () => {

    return {
        caretLeft: CaretLeftIcon,
        caretRight: CaretRightIcon,
        close: CrossIcon,
        pin: PinIcon,
        unpin: UnPinIcon
    };
};

export const getCertificateIllustrations = () => {

    return {
        avatar: CertificateAvatar,
        badge: CertificateBadge,
        file: CertificateIllustration,
        ribbon: CertificateRibbon,
        uploadPlaceholder: FileUploadIllustration
    };
};

export const getMiscellaneousIcons = () => {

    return {
        tenantIcon: LDAPOutlineIcon
    };
};

export const AppSwitcherIcons = (): Record<string, any> => {

    return {
        console: ConsoleIcon,
        myAccount: MyAccountIcon
    };
};

export const getGeneralIcons = (): { [ key: string ]: FunctionComponent<SVGProps<SVGSVGElement>> } => {

    return {
        crossIcon: CrossIcon
    };
};
