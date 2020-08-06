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
 */

import { ReactComponent as AppIcon } from "../../../themes/dark/assets/images/icons/app-icon.svg";
import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import { ReactComponent as EmailOTPIcon } from "../../../themes/default/assets/images/authenticators/email-otp.svg";
import FIDOLogo from "../../../themes/default/assets/images/authenticators/fido.png";
import { ReactComponent as SMSOTPIcon } from "../../../themes/default/assets/images/authenticators/sms-otp.svg";
import TOTPIcon from "../../../themes/default/assets/images/authenticators/totp.png";
import { ReactComponent as ArrowRight } from "../../../themes/default/assets/images/icons/arrow-right-icon.svg";
import { ReactComponent as AuthorizeIcon } from "../../../themes/default/assets/images/icons/authorize.svg";
import {
    ReactComponent as CertificateColoredIcon
} from "../../../themes/default/assets/images/icons/certificate-colored-icon.svg";
import { ReactComponent as ClockColoredIcon } from "../../../themes/default/assets/images/icons/clock-colored-icon.svg";
import { ReactComponent as CodeIcon } from "../../../themes/default/assets/images/icons/code-icon.svg";
import { ReactComponent as CogWheelIcon } from "../../../themes/default/assets/images/icons/cog-wheel-icon.svg";
import { ReactComponent as CubeStack } from "../../../themes/default/assets/images/icons/cube-stack-icon.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import {
    ReactComponent as IDPCertificateIcon
} from "../../../themes/default/assets/images/icons/idpCertificate.svg";
import { ReactComponent as IntrospectIcon } from "../../../themes/default/assets/images/icons/introspect.svg";
import { ReactComponent as IssuerIcon } from "../../../themes/default/assets/images/icons/issuer.svg";
import { ReactComponent as JWKSIcon } from "../../../themes/default/assets/images/icons/jwks.svg";
import { ReactComponent as LockShieldIcon } from "../../../themes/default/assets/images/icons/lock-shield.svg";
import {
    ReactComponent as MagnifierColoredIcon
} from "../../../themes/default/assets/images/icons/magnifier-colored-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../../../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as OpenBookIcon } from "../../../themes/default/assets/images/icons/open-book-icon.svg";
import { ReactComponent as ReportIcon } from "../../../themes/default/assets/images/icons/report-icon.svg";
import { ReactComponent as ShuttleIcon } from "../../../themes/default/assets/images/icons/shuttle-icon.svg";
import { ReactComponent as SLOIcon } from "../../../themes/default/assets/images/icons/slo.svg";
import { ReactComponent as SpinWheelIcon } from "../../../themes/default/assets/images/icons/spin-wheel-icon.svg";
import { ReactComponent as SSOIcon } from "../../../themes/default/assets/images/icons/sso.svg";
import { ReactComponent as TokenIcon } from "../../../themes/default/assets/images/icons/token.svg";
import { ReactComponent as UserInfoIcon } from "../../../themes/default/assets/images/icons/userInfo.svg";
import {
    ReactComponent as CustomApplicationTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/custom-app-illustration.svg";
import {
    ReactComponent as OIDCMobileTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/oidc-mobile-template-illustration.svg";
import {
    ReactComponent as OIDCWebAppTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/oidc-web-app-template-illustration.svg";
import {
    ReactComponent as PassiveSTSTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/passive-sts-template-illustration.svg";
import {
    ReactComponent as SAMLWebAppTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/saml-web-app-template-illustration.svg";
import {
    ReactComponent as SPATemplateIllustration
} from "../../../themes/default/assets/images/illustrations/spa-template-illustration.svg";
import {
    ReactComponent as WindowsTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/windows-template-illustration.svg";
import {
    ReactComponent as WSTrustTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/ws-trust-template-illustration.svg";
import OIDCLogo from "../../../themes/default/assets/images/protocols/oidc.png";
import OpenIDLogo from "../../../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../../../themes/default/assets/images/protocols/ws-fed.png";
import WSTrustLogo from "../../../themes/default/assets/images/protocols/ws-trust.png";
import { ReactComponent as FacebookLogo } from "../../../themes/default/assets/images/social/facebook.svg";
import { ReactComponent as GoogleLogo } from "../../../themes/default/assets/images/social/google.svg";
import { ReactComponent as TwitterLogo } from "../../../themes/default/assets/images/social/twitter.svg";
import { ReactComponent as AndroidLogo } from "../../../themes/default/assets/images/technologies/android-logo.svg";
import { ReactComponent as AngularLogo } from "../../../themes/default/assets/images/technologies/angular-logo.svg";
import { ReactComponent as AppleLogo } from "../../../themes/default/assets/images/technologies/apple-logo.svg";
import { ReactComponent as CSharpLogo } from "../../../themes/default/assets/images/technologies/c-sharp-logo.svg";
import { ReactComponent as CordovaLogo } from "../../../themes/default/assets/images/technologies/cordova-logo.svg";
import { ReactComponent as DotNetLogo } from "../../../themes/default/assets/images/technologies/dotnet-logo.svg";
import { ReactComponent as HTMLLogo } from "../../../themes/default/assets/images/technologies/html-logo.svg";
import { ReactComponent as JavaLogo } from "../../../themes/default/assets/images/technologies/java-logo.svg";
import { ReactComponent as JavaScriptLogo } from "../../../themes/default/assets/images/technologies/javascript-logo.svg";
import { ReactComponent as JWTLogo } from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import { ReactComponent as NodeJSLogo } from "../../../themes/default/assets/images/technologies/nodejs-logo.svg";
import { ReactComponent as PythonLogo } from "../../../themes/default/assets/images/technologies/python-logo.svg";
import { ReactComponent as ReactLogo } from "../../../themes/default/assets/images/technologies/react-logo.svg";
import { ReactComponent as VueLogo } from "../../../themes/default/assets/images/technologies/vue-logo.svg";
import { ReactComponent as WindowsLogo } from "../../../themes/default/assets/images/technologies/windows-logo.svg";
import { ReactComponent as MicrosoftLogo } from "../../../themes/default/assets/images/third-party/microsoft-logo.svg";
import { ReactComponent as Office365Logo } from "../../../themes/default/assets/images/third-party/office-365-logo.svg";
import { ReactComponent as YahooLogo } from "../../../themes/default/assets/images/third-party/yahoo-logo.svg";

export const SidePanelIcons = {
    applications: AppIcon,
    childIcon: ArrowRight
};

export const InboundProtocolLogos = {
    oidc: OIDCLogo,
    openid: OpenIDLogo,
    "passive-sts": WSFedLogo,
    saml: SamlLogo,
    "ws-trust": WSTrustLogo,
    wsFed: WSFedLogo,
    wsTrust: WSTrustLogo
};

export const ApplicationTemplateIllustrations = {
    customApp: CustomApplicationTemplateIllustration,
    oidcMobile: OIDCMobileTemplateIllustration,
    oidcWebApp: OIDCWebAppTemplateIllustration,
    passiveSTS: PassiveSTSTemplateIllustration,
    samlWebApp: SAMLWebAppTemplateIllustration,
    spa: SPATemplateIllustration,
    windowsNative: WindowsTemplateIllustration,
    wsTrust: WSTrustTemplateIllustration
};

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

export const ApplicationWizardStepIcons = {
    general: DocumentIcon,
    protocolConfig: GearsIcon,
    protocolSelection: SpinWheelIcon,
    summary: ReportIcon
};

export const AuthenticatorIcons = {
    basic: BasicAuthIcon,
    default: LockShieldIcon,
    emailOTP: EmailOTPIcon,
    facebook: FacebookLogo,
    fido: FIDOLogo,
    google: GoogleLogo,
    identifierFirst: MagnifierColoredIcon,
    jwtBasic: JWTLogo,
    microsoft: MicrosoftLogo,
    office365: Office365Logo,
    sessionExecutor: ClockColoredIcon,
    smsOTP: SMSOTPIcon,
    totp: TOTPIcon,
    twitter: TwitterLogo,
    x509: CertificateColoredIcon,
    yahoo: YahooLogo
};

export const HelpPanelIcons = {
    endpoints: {
        authorize: AuthorizeIcon,
        certificate: IDPCertificateIcon,
        introspect: IntrospectIcon,
        issuer: IssuerIcon,
        jwks: JWKSIcon,
        metadata: IDPMetadataIcon,
        samlSLO: SLOIcon,
        samlSSO: SSOIcon,
        token: TokenIcon,
        userInfo: UserInfoIcon
    },
    tabs: {
        docs: OpenBookIcon,
        guide: CogWheelIcon,
        samples: CodeIcon,
        sdks: CubeStack,
        whatsNext: ShuttleIcon
    }
};
