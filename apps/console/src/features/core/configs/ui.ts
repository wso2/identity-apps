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

import { ReactComponent as AppIcon } from "../../../themes/dark/assets/images/icons/app-icon.svg";
import {
    ReactComponent as AccountPolicyIcon
} from "../../../themes/default/assets/images/icons/account-policy-icon.svg";
import { ReactComponent as AlertIcon } from "../../../themes/default/assets/images/icons/alert-icon.svg";
import { ReactComponent as ArrowRight } from "../../../themes/default/assets/images/icons/arrow-right-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../../../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../../../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as BriefcaseIcon } from "../../../themes/default/assets/images/icons/briefcase-icon.svg";
import { ReactComponent as CaretRightIcon } from "../../../themes/default/assets/images/icons/caret-right-icon.svg";
import { ReactComponent as CaretLeftIcon } from "../../../themes/default/assets/images/icons/caret-left-icon.svg";
import {
    ReactComponent as CertificateAvatar
} from "../../../themes/default/assets/images/icons/certificate-avatar.svg";
import { ReactComponent as CertificateIcon } from "../../../themes/default/assets/images/icons/certificate-icon.svg";
import { ReactComponent as ClaimsIcon } from "../../../themes/default/assets/images/icons/claims-icon.svg";
import { ReactComponent as CloseIcon } from "../../../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CodeForkIcon } from "../../../themes/default/assets/images/icons/code-fork.svg";
import { ReactComponent as ConsentIcon } from "../../../themes/default/assets/images/icons/consent.svg";
import { ReactComponent as CrossIcon } from "../../../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../../../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as DatabaseIcon } from "../../../themes/default/assets/images/icons/database-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../../../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../../../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import { ReactComponent as GraphIcon } from "../../../themes/default/assets/images/icons/graph-icon.svg";
import { ReactComponent as KeyIcon } from "../../../themes/default/assets/images/icons/key-icon.svg";
import { ReactComponent as MagnifierIcon } from "../../../themes/default/assets/images/icons/magnifier-icon.svg";
import { ReactComponent as MaximizeIcon } from "../../../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../../../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as MinimizeIcon } from "../../../themes/default/assets/images/icons/minimize-icon.svg";
import { ReactComponent as PaperRocketIcon } from "../../../themes/default/assets/images/icons/paper-rocket-icon.svg";
import { ReactComponent as PinIcon } from "../../../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlugIcon } from "../../../themes/default/assets/images/icons/plug-icon.svg";
import { ReactComponent as PlusIcon } from "../../../themes/default/assets/images/icons/plus-icon.svg";
import { ReactComponent as ScopeIcon } from "../../../themes/default/assets/images/icons/scope.svg";
import { ReactComponent as FileUploadIllustration } from "../../../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as UserConfigIcon } from "../../../themes/default/assets/images/icons/user-config-icon.svg";
import { ReactComponent as UserGroupIcon } from "../../../themes/default/assets/images/icons/user-group-icon.svg";
import { ReactComponent as UserIcon } from "../../../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as OrganisationIcon } from "../../../themes/default/assets/images/icons/organisation.svg";
import { ReactComponent as CertificateBadge } from "../../../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../../../themes/default/assets/images/illustrations/certificate.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../../../themes/default/assets/images/illustrations/no-search-results.svg";
import { ReactComponent as CertificateRibbon } from "../../../themes/default/assets/images/illustrations/ribbon.svg";

import OIDCLogo from "../../../themes/default/assets/images/protocols/oidc.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import { ReactComponent as AndroidLogo } from "../../../themes/default/assets/images/technologies/android-logo.svg";
import { ReactComponent as AngularLogo } from "../../../themes/default/assets/images/technologies/angular-logo.svg";
import { ReactComponent as AppleLogo } from "../../../themes/default/assets/images/technologies/apple-logo.svg";
import { ReactComponent as CSharpLogo } from "../../../themes/default/assets/images/technologies/c-sharp-logo.svg";
import { ReactComponent as CordovaLogo } from "../../../themes/default/assets/images/technologies/cordova-logo.svg";
import { ReactComponent as DotNetLogo } from "../../../themes/default/assets/images/technologies/dotnet-logo.svg";
import { ReactComponent as HTMLLogo } from "../../../themes/default/assets/images/technologies/html-logo.svg";
import { ReactComponent as JavaLogo } from "../../../themes/default/assets/images/technologies/java-logo.svg";
import {
    ReactComponent as JavaScriptLogo
} from "../../../themes/default/assets/images/technologies/javascript-logo.svg";
import { ReactComponent as NodeJSLogo } from "../../../themes/default/assets/images/technologies/nodejs-logo.svg";
import { ReactComponent as PythonLogo } from "../../../themes/default/assets/images/technologies/python-logo.svg";
import { ReactComponent as ReactLogo } from "../../../themes/default/assets/images/technologies/react-logo.svg";
import { ReactComponent as VueLogo } from "../../../themes/default/assets/images/technologies/vue-logo.svg";
import { ReactComponent as WindowsLogo } from "../../../themes/default/assets/images/technologies/windows-logo.svg";

export const TechnologyLogos = {
    android: AndroidLogo,
    angular: AngularLogo,
    apple: AppleLogo,
    cSharp: CSharpLogo,
    cordova: CordovaLogo,
    dotNet: DotNetLogo,
    html: HTMLLogo,
    ios: AppleLogo,
    java: JavaLogo,
    javascript: JavaScriptLogo,
    nodejs: NodeJSLogo,
    openidconnect: OIDCLogo,
    python: PythonLogo,
    react: ReactLogo,
    saml: SamlLogo,
    vue: VueLogo,
    windows: WindowsLogo
};

export const SidePanelIcons = {
    appLogs: IDPMetadataIcon,
    applications: AppIcon,
    certificate: CertificateIcon,
    childIcon: ArrowRight,
    claims: ClaimsIcon,
    connectors: {
        [ "Account Management Policies" ]: UserConfigIcon,
        [ "Analytics Engine" ]: GraphIcon,
        [ "Consent Management" ]: ConsentIcon,
        [ "Login Policies" ]: AccountPolicyIcon,
        [ "Password Policies" ]: KeyIcon,
        default: PlugIcon
    },
    emailTemplates: PaperRocketIcon,
    groups: UserGroupIcon,
    identityProviders: PlugIcon,
    overview: DashboardIcon,
    remoteFetch: CodeForkIcon,
    roles: BriefcaseIcon,
    scopes: ScopeIcon,
    serverConfigurations: GearsIcon,
    userStore: DatabaseIcon,
    organisation: OrganisationIcon,
    users: UserIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
};

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    emptySearch: MagnifierIcon,
    fileUpload: FileUploadIllustration,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
    newList: PlusIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
};

export const OperationIcons = {
    drag: DragSquaresIcon,
    maximize: MaximizeIcon,
    minimize: MinimizeIcon
};

export const HelpPanelActionIcons = {
    close: CrossIcon,
    pin: PinIcon,
    caretLeft: CaretLeftIcon,
    caretRight: CaretRightIcon
};

export const CertificateIllustrations = {
    avatar: CertificateAvatar,
    badge: CertificateBadge,
    file: CertificateIllustration,
    ribbon: CertificateRibbon,
    uploadPlaceholder: FileUploadIllustration
};
