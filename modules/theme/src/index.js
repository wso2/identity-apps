/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

export * from "./theme";

/*
 * Export default theme variables
 */
export const defaultThemeVariables = require("../dist/theme-variables.json");
export const Themes = [
    "dark",
    "default"
];

// Icons
export const AlertIcon = require("../dist/lib/themes/default/assets/images/icons/alert-icon.svg");
export const AppIcon = require("../dist/lib/themes/default/assets/images/icons/app-icon.svg");
export const ArrowRight = require("../dist/lib/themes/default/assets/images/icons/arrow-right-icon.svg");
export const BlockedMagnifierIcon =
    require("../dist/lib/themes/default/assets/images/icons/blocked-magnifier-icon.svg");
export const BoxIcon = require("../dist/lib/themes/default/assets/images/icons/box-icon.svg");
export const CaretRightIcon = require("../dist/lib/themes/default/assets/images/icons/caret-right-icon.svg");
export const ClaimsIcon = require("../dist/lib/themes/default/assets/images/icons/claims-icon.svg");
export const CloseIcon = require("../dist/lib/themes/default/assets/images/icons/close-icon.svg");
export const CodeIcon = require("../dist/lib/themes/default/assets/images/icons/code-icon.svg");
export const ConsentIcon = require("../dist/lib/themes/default/assets/images/icons/consent-icon.svg");
export const ControlsIcon = require("../dist/lib/themes/default/assets/images/icons/controls-icon.svg");
export const CrossIcon = require("../dist/lib/themes/default/assets/images/icons/cross-icon.svg");
export const DashboardIcon = require("../dist/lib/themes/default/assets/images/icons/dashboard-icon.svg");
export const DocumentIcon = require("../dist/lib/themes/default/assets/images/icons/document-icon.svg");
export const DotIcon = require("../dist/lib/themes/default/assets/images/icons/dot-icon.svg");
export const DragIcon = require("../dist/lib/themes/default/assets/images/icons/drag-icon.svg");
export const DragSquaresIcon = require("../dist/lib/themes/default/assets/images/icons/drag-squares-icon.svg");
export const EmailIcon = require("../dist/lib/themes/default/assets/images/icons/email-icon.svg");
export const ErrorIcon = require("../dist/lib/themes/default/assets/images/icons/error-icon.svg");
export const FingerprintIcon = require("../dist/lib/themes/default/assets/images/icons/fingerprint.svg");
export const ForbiddenIcon = require("../dist/lib/themes/default/assets/images/icons/forbidden-icon.svg");
export const GearsIcon = require("../dist/lib/themes/default/assets/images/icons/gears-icon.svg");
export const InfoIcon = require("../dist/lib/themes/default/assets/images/icons/info-icon.svg");
export const LaunchIcon = require("../dist/lib/themes/default/assets/images/icons/launch-icon.svg");
export const LockIcon = require("../dist/lib/themes/default/assets/images/icons/lock-icon.svg");
export const MagnifierIcon = require("../dist/lib/themes/default/assets/images/icons/magnifier-icon.svg");
export const MaximizeIcon = require("../dist/lib/themes/default/assets/images/icons/maximize-icon.svg");
export const MinimizeIcon = require("../dist/lib/themes/default/assets/images/icons/minimize-icon.svg");
export const MonitorIcon = require("../dist/lib/themes/default/assets/images/icons/monitor-icon.svg");
export const PackageIcon = require("../dist/lib/themes/default/assets/images/icons/package.svg");
export const PadlockIcon = require("../dist/lib/themes/default/assets/images/icons/padlock-icon.svg");
export const PlugIcon = require("../dist/lib/themes/default/assets/images/icons/plug-icon.svg");
export const SecurityQuestionsIcon = 
    require("../dist/lib/themes/default/assets/images/icons/security-questions-icon.svg");
export const SMSIcon = require("../dist/lib/themes/default/assets/images/icons/sms-icon.svg");
export const SpinWheelIcon = require("../dist/lib/themes/default/assets/images/icons/spin-wheel-icon.svg");
export const SuccessIcon = require("../dist/lib/themes/default/assets/images/icons/success-icon.svg");
export const ReportIcon = require("../dist/lib/themes/default/assets/images/icons/report-icon.svg");
export const TickCircleIcon = require("../dist/lib/themes/default/assets/images/icons/tick-circle-icon.svg");
export const ToolsIcon = require("../dist/lib/themes/default/assets/images/icons/tools-icon.svg");
export const AuthenticatorAppIcon = 
    require("../dist/lib/themes/default/assets/images/icons/authenticator-app-icon.svg");
export const UserIcon = require("../dist/lib/themes/default/assets/images/icons/user-icon.svg");
export const UserStoreIcon = require("../dist/lib/themes/default/assets/images/icons/user-store.svg");
export const WarningIcon = require("../dist/lib/themes/default/assets/images/icons/warning-icon.svg");

// Illustrations
export const AssociatedAccountsIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/associated-accounts.svg");
export const AssociatedAccountsMiniIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/associated-accounts-mini.svg");
export const ChangePasswordIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/change-password.svg");
export const ChangePasswordMiniIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/change-password-mini.svg");
export const EmptySearchResultsIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/no-search-results.svg");
export const ProfileExportIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/profile-export.svg");
export const ProfileExportMiniIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/profile-export-mini.svg");
export const SecurityQuestionsIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/security-questions.svg");
export const SecurityQuestionsMiniIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/security-questions-mini.svg");
export const QRCodeScanIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/qrcode-scan.svg");
export const EnterVerificationCode = 
    require("../dist/lib/themes/default/assets/images/illustrations/enter-verification-code.svg");

// Status shields
export const StatusShieldGood = require("../dist/lib/themes/default/assets/images/accounts-status-icons/good.svg");
export const StatusShieldWarning = 
    require("../dist/lib/themes/default/assets/images/accounts-status-icons/warning.svg");
export const StatusShieldDanger = require("../dist/lib/themes/default/assets/images/accounts-status-icons/danger.svg");

// Logos
export const GravatarLogo = require("../dist/lib/themes/default/assets/images/gravatar-logo.png");
export const Logo = require("../dist/lib/themes/default/assets/images/logo.svg");

// Protocol Logos
export const SamlLogo = require("../dist/lib/themes/default/assets/images/protocols/saml.png");
export const OpenIDLogo = require("../dist/lib/themes/default/assets/images/protocols/openid.png");
export const WSFedLogo = require("../dist/lib/themes/default/assets/images/protocols/ws-fed.png");
export const WSTrustLogo = require("../dist/lib/themes/default/assets/images/protocols/ws-trust.png");
export const OIDCLogo = require("../dist/lib/themes/default/assets/images/protocols/oidc.png");

// Misc
export const DummyUser = require("../dist/lib/themes/default/assets/images/user.png");
export const OrangeAppIconBackground = require("../dist/lib/themes/default/assets/images/app-icon-background.png");

// Technology Logos
export const AngularLogo = require("../dist/lib/themes/default/assets/images/technologies/angular-logo.svg");
export const DotNetLogo = require("../dist/lib/themes/default/assets/images/technologies/dotnet-logo.svg");
export const JavaLogo = require("../dist/lib/themes/default/assets/images/technologies/java-logo.svg");
export const ReactLogo = require("../dist/lib/themes/default/assets/images/technologies/react-logo.svg");
export const VueLogo = require("../dist/lib/themes/default/assets/images/technologies/vue-logo.svg");

// Application template illustrations
export const WebAppTemplateIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/web-app-illustration.svg");
export const SPATemplateIllustration = 
    require("../dist/lib/themes/default/assets/images/illustrations/spa-illustration.svg");

// Social
export const FacebookLogo = require("../dist/lib/themes/default/assets/images/social/facebook.svg");
export const GoogleLogo = require("../dist/lib/themes/default/assets/images/social/google.svg");
export const TwitterLogo = require("../dist/lib/themes/default/assets/images/social/twitter.svg");

// Authenticators
export const BasicAuthIcon = require("../dist/lib/themes/default/assets/images/authenticators/basic-auth.png");
export const EmailOTPIcon = require("../dist/lib/themes/default/assets/images/authenticators/email-otp.svg");
export const FIDOLogo = require("../dist/lib/themes/default/assets/images/authenticators/fido.png");
export const SMSOTPIcon = require("../dist/lib/themes/default/assets/images/authenticators/sms-otp.svg");
export const TOTPIcon = require("../dist/lib/themes/default/assets/images/authenticators/totp.png");

// Identity providers
export const GoogleIdPIcon = require("../dist/lib/themes/default/assets/images/identity-providers/google.svg");
export const FacebookIdPIcon = require("../dist/lib/themes/default/assets/images/identity-providers/facebook.svg");
export const GithubIdPIcon = require("../dist/lib/themes/default/assets/images/identity-providers/github.svg");
export const TwitterIdPIcon = require("../dist/lib/themes/default/assets/images/identity-providers/twitter.svg");

// Identity provider capabilities
export const AuthenticationCapabilityIcon = 
    require("../dist/lib/themes/default/assets/images/identity-provider-capabilities/authentication.svg");
export const ProvisionCapabilityIcon = 
    require("../dist/lib/themes/default/assets/images/identity-provider-capabilities/provision.svg");

/**
 * The following has been kept for backward compatibility.
 * These can be removed once the user portal is refactored.
 */
export const Padlock = require("../dist/lib/themes/default/assets/images/icons/padlock-icon.svg");

export const HomeTileIcons = {
    profile: require("../dist/lib/themes/default/assets/images/home_profile_mgt.png"),
    security: require("../dist/lib/themes/default/assets/images/home_security_mgt.png"),
    consent: require("../dist/lib/themes/default/assets/images/home_consent_mgt.png")
};

export const SidePanelIconSet = {
    account: require("../dist/lib/themes/default/assets/images/icons/controls-icon.svg"),
    apps: require("../dist/lib/themes/default/assets/images/icons/app-icon.svg"),
    consent: require("../dist/lib/themes/default/assets/images/icons/tick-circle-icon.svg"),
    operations: require("../dist/lib/themes/default/assets/images/icons/tools-icon.svg"),
    overview: require("../dist/lib/themes/default/assets/images/icons/dashboard-icon.svg"),
    personal: require("../dist/lib/themes/default/assets/images/icons/user-icon.svg"),
    security: require("../dist/lib/themes/default/assets/images/icons/lock-icon.svg"),
    session: require("../dist/lib/themes/default/assets/images/icons/monitor-icon.svg"),
};

export const MFAIconSet = {
    sms: require("../dist/lib/themes/default/assets/images/icons/sms-icon.svg"),
    fingerprint: require("../dist/lib/themes/default/assets/images/icons/fingerprint.svg"),
    authenticatorApp: require("../dist/lib/themes/default/assets/images/icons/authenticator-app-icon.svg")
};

export const AccountRecoveryIconSet = {
    email: require("../dist/lib/themes/default/assets/images/icons/email-icon.svg"),
    securityQuestions: require("../dist/lib/themes/default/assets/images/icons/security-questions-icon.svg")
};

export const SettigsSectionIconSet = {
    associatedAccounts: require("../dist/lib/themes/default/assets/images/illustrations/associated-accounts.svg"),
    associatedAccountsMini: 
        require("../dist/lib/themes/default/assets/images/illustrations/associated-accounts-mini.svg"),
    changePassword: require("../dist/lib/themes/default/assets/images/illustrations/change-password.svg"),
    changePasswordMini: require("../dist/lib/themes/default/assets/images/illustrations/change-password-mini.svg"),
    federatedAssociations: 
        require("../dist/lib/themes/default/assets/images/illustrations/federated-associations.svg"),
    federatedAssociationsMini: 
        require("../dist/lib/themes/default/assets/images/illustrations/federated-associations-mini.svg"),
    profileExport: require("../dist/lib/themes/default/assets/images/illustrations/profile-export.svg"),
    profileExportMini: require("../dist/lib/themes/default/assets/images/illustrations/profile-export-mini.svg"),
    securityQuestions: require("../dist/lib/themes/default/assets/images/illustrations/security-questions.svg"),
    securityQuestionsMini: 
        require("../dist/lib/themes/default/assets/images/illustrations/security-questions-mini.svg")
};
