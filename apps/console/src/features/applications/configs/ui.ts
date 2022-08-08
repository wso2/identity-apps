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

import { FunctionComponent, SVGProps } from "react";
import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import { ReactComponent as EmailOTPIcon } from "../../../themes/default/assets/images/authenticators/email-otp.svg";
import { ReactComponent as SMSOTPIcon } from "../../../themes/default/assets/images/authenticators/sms-otp.svg";
import TOTPIcon from "../../../themes/default/assets/images/authenticators/totp.png";
import { ReactComponent as AuthorizeIcon } from "../../../themes/default/assets/images/icons/authorize.svg";
import {
    ReactComponent as CertificateColoredIcon
} from "../../../themes/default/assets/images/icons/certificate-colored-icon.svg";
import { ReactComponent as ClockColoredIcon } from "../../../themes/default/assets/images/icons/clock-colored-icon.svg";
import { ReactComponent as CodeIcon } from "../../../themes/default/assets/images/icons/code-icon.svg";
import { ReactComponent as CogWheelIcon } from "../../../themes/default/assets/images/icons/cog-wheel-icon.svg";
import { ReactComponent as CubeStack } from "../../../themes/default/assets/images/icons/cube-stack-icon.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as DoneButtonIcon } from "../../../themes/default/assets/images/icons/done-button.svg";
import FIDOLogo from "../../../themes/default/assets/images/icons/fingerprint.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import {
    ReactComponent as IDPCertificateIcon
} from "../../../themes/default/assets/images/icons/idp-certificate.svg";
import { ReactComponent as IntrospectIcon } from "../../../themes/default/assets/images/icons/introspect.svg";
import { ReactComponent as IssuerIcon } from "../../../themes/default/assets/images/icons/issuer.svg";
import { ReactComponent as JWKSIcon } from "../../../themes/default/assets/images/icons/jwks.svg";
import { ReactComponent as LockShieldIcon } from "../../../themes/default/assets/images/icons/lock-shield.svg";
import { ReactComponent as MagicLinkLogo } from "../../../themes/default/assets/images/icons/magic-link-icon.svg";
import {
    ReactComponent as MagnifierColoredIcon
} from "../../../themes/default/assets/images/icons/magnifier-colored-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../../../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as OpenBookIcon } from "../../../themes/default/assets/images/icons/open-book-icon.svg";
import  {
    ReactComponent as AddCircleOutlineIcon
} from "../../../themes/default/assets/images/icons/outline-icons/add-circle-outline.svg";
import { ReactComponent as WellKnownIcon
} from "../../../themes/default/assets/images/icons/outline-icons/discovery-endpoint.svg";
import {
    ReactComponent as RevokeTokenIcon
} from "../../../themes/default/assets/images/icons/outline-icons/revoke-outline.svg";
import PlusIcon from "../../../themes/default/assets/images/icons/plus-icon.svg";
import { ReactComponent as ReportIcon } from "../../../themes/default/assets/images/icons/report-icon.svg";
import { ReactComponent as ShuttleIcon } from "../../../themes/default/assets/images/icons/shuttle-icon.svg";
import { ReactComponent as SLOIcon } from "../../../themes/default/assets/images/icons/slo.svg";
import { ReactComponent as SpinWheelIcon } from "../../../themes/default/assets/images/icons/spin-wheel-icon.svg";
import { ReactComponent as SSOIcon } from "../../../themes/default/assets/images/icons/sso.svg";
import { ReactComponent as StartButtonIcon } from "../../../themes/default/assets/images/icons/start-button.svg";
import { ReactComponent as TokenIcon } from "../../../themes/default/assets/images/icons/token.svg";
import { ReactComponent as UserInfoIcon } from "../../../themes/default/assets/images/icons/userInfo.svg";
import { ReactComponent as WarningIcon } from "../../../themes/default/assets/images/icons/warning-icon.svg";
import {
    ReactComponent as FacebookLogo
} from "../../../themes/default/assets/images/identity-providers/facebook-idp-illustration.svg";
import GithubIdPIcon from "../../../themes/default/assets/images/identity-providers/github-idp-illustration.svg";
import {
    ReactComponent as GoogleLogo
} from "../../../themes/default/assets/images/identity-providers/google-idp-illustration.svg";
import {
    ReactComponent as Office365Logo
} from "../../../themes/default/assets/images/identity-providers/office-365.svg";
import { ReactComponent as TwitterLogo } from "../../../themes/default/assets/images/identity-providers/twitter.svg";
import { ReactComponent as YahooLogo } from "../../../themes/default/assets/images/identity-providers/yahoo.svg";
import {
    ReactComponent as ProtocolPredefined
} from "../../../themes/default/assets/images/illustrations/application-predefined.svg";
import {
    ReactComponent as ProtocolIllustration
} from "../../../themes/default/assets/images/illustrations/application-protocols-illustration.svg";
import {
    ReactComponent as BasicAuthIllustration
} from "../../../themes/default/assets/images/illustrations/basic-auth-illustration.svg";
import {
    ReactComponent as BoxTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/box-template-illustration.svg";
import {
    ReactComponent as codeFileIllustration
} from "../../../themes/default/assets/images/illustrations/code-file.svg";
import {
    ReactComponent as CustomApplicationTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/custom-app-illustration.svg";
import {
    ReactComponent as globalIllustration
} from "../../../themes/default/assets/images/illustrations/global.svg";
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
    ReactComponent as settingsIllustration
} from "../../../themes/default/assets/images/illustrations/setting.svg";
import {
    ReactComponent as SlackTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/slack-template-illustration.svg";
import {
    ReactComponent as SPATemplateIllustration
} from "../../../themes/default/assets/images/illustrations/spa-template-illustration.svg";
import {
    ReactComponent as WindowsTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/windows-template-illustration.svg";
import {
    ReactComponent as WorkdayTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/workday-template-illustration.svg";
import {
    ReactComponent as WSTrustTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/ws-trust-template-illustration.svg";
import {
    ReactComponent as ZoomTemplateIllustration
} from "../../../themes/default/assets/images/illustrations/zoom-template-illustration.svg";
import OAuth2OpenIDLogo from "../../../themes/default/assets/images/protocols/oauth2-oidc.png";
import OpenIDLogo from "../../../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../../../themes/default/assets/images/protocols/ws-fed.png";
import WSTrustLogo from "../../../themes/default/assets/images/protocols/ws-trust.png";
import { ReactComponent as JWTLogo } from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import { ReactComponent as MicrosoftLogo } from "../../../themes/default/assets/images/third-party/microsoft-logo.svg";
import { SupportedAuthProtocolTypes } from "../models";

export const getInboundProtocolLogos = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>>;
    oidc: string;
    openid: string;
    "passive-sts": string;
    [ SupportedAuthProtocolTypes.OAUTH2_OIDC ]: string;
    saml: string;
    "ws-trust": string;
    wsFed: string;
    wsTrust: string;
} => {

    return {
        general: ProtocolIllustration,
        oidc: OpenIDLogo,
        openid: OpenIDLogo,
        "passive-sts": WSFedLogo,
        [ SupportedAuthProtocolTypes.OAUTH2_OIDC ]: OAuth2OpenIDLogo,
        saml: SamlLogo,
        "ws-trust": WSTrustLogo,
        wsFed: WSFedLogo,
        wsTrust: WSTrustLogo
    };
};

export const getApplicationTemplateIllustrations = (): {
    box: FunctionComponent<SVGProps<SVGSVGElement>>;
    customApp: FunctionComponent<SVGProps<SVGSVGElement>>;
    oidcMobile: FunctionComponent<SVGProps<SVGSVGElement>>;
    oidcWebApp: FunctionComponent<SVGProps<SVGSVGElement>>;
    passiveSTS: FunctionComponent<SVGProps<SVGSVGElement>>;
    samlWebApp: FunctionComponent<SVGProps<SVGSVGElement>>;
    slack: FunctionComponent<SVGProps<SVGSVGElement>>;
    spa: FunctionComponent<SVGProps<SVGSVGElement>>;
    windowsNative: FunctionComponent<SVGProps<SVGSVGElement>>;
    workday: FunctionComponent<SVGProps<SVGSVGElement>>;
    wsTrust: FunctionComponent<SVGProps<SVGSVGElement>>;
    zoom: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        box: BoxTemplateIllustration,
        customApp: CustomApplicationTemplateIllustration,
        oidcMobile: OIDCMobileTemplateIllustration,
        oidcWebApp: OIDCWebAppTemplateIllustration,
        passiveSTS: PassiveSTSTemplateIllustration,
        samlWebApp: SAMLWebAppTemplateIllustration,
        slack: SlackTemplateIllustration,
        spa: SPATemplateIllustration,
        windowsNative: WindowsTemplateIllustration,
        workday: WorkdayTemplateIllustration,
        wsTrust: WSTrustTemplateIllustration,
        zoom: ZoomTemplateIllustration
    };
};

export const getApplicationWizardStepIcons = (): {
    general: FunctionComponent<SVGProps<SVGSVGElement>>;
    protocolConfig: FunctionComponent<SVGProps<SVGSVGElement>>;
    protocolSelection: FunctionComponent<SVGProps<SVGSVGElement>>;
    summary: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        general: DocumentIcon,
        protocolConfig: GearsIcon,
        protocolSelection: SpinWheelIcon,
        summary: ReportIcon
    };
};

export const getAuthenticatorIcons = (): {
    basic: string;
    default: FunctionComponent<SVGProps<SVGSVGElement>>;
    emailOTP: FunctionComponent<SVGProps<SVGSVGElement>>;
    facebook: FunctionComponent<SVGProps<SVGSVGElement>>;
    fido: string;
    github: string;
    google: FunctionComponent<SVGProps<SVGSVGElement>>;
    identifierFirst: FunctionComponent<SVGProps<SVGSVGElement>>;
    jwtBasic: FunctionComponent<SVGProps<SVGSVGElement>>;
    magicLink: FunctionComponent<SVGProps<SVGSVGElement>>;
    microsoft: FunctionComponent<SVGProps<SVGSVGElement>>;
    office365: FunctionComponent<SVGProps<SVGSVGElement>>;
    sessionExecutor: FunctionComponent<SVGProps<SVGSVGElement>>;
    smsOTP: FunctionComponent<SVGProps<SVGSVGElement>>;
    totp: string;
    twitter: FunctionComponent<SVGProps<SVGSVGElement>>;
    x509: FunctionComponent<SVGProps<SVGSVGElement>>;
    yahoo: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        basic: BasicAuthIcon,
        default: LockShieldIcon,
        emailOTP: EmailOTPIcon,
        facebook: FacebookLogo,
        fido: FIDOLogo,
        github: GithubIdPIcon,
        google: GoogleLogo,
        identifierFirst: MagnifierColoredIcon,
        jwtBasic: JWTLogo,
        magicLink: MagicLinkLogo,
        microsoft: MicrosoftLogo,
        office365: Office365Logo,
        sessionExecutor: ClockColoredIcon,
        smsOTP: SMSOTPIcon,
        totp: TOTPIcon,
        twitter: TwitterLogo,
        x509: CertificateColoredIcon,
        yahoo: YahooLogo
    };
};

export const getHelpPanelIcons = (): {
    endpoints: {
        authorize: FunctionComponent<SVGProps<SVGSVGElement>>;
        certificate: FunctionComponent<SVGProps<SVGSVGElement>>;
        introspect: FunctionComponent<SVGProps<SVGSVGElement>>;
        issuer: FunctionComponent<SVGProps<SVGSVGElement>>;
        jwks: FunctionComponent<SVGProps<SVGSVGElement>>;
        metadata: FunctionComponent<SVGProps<SVGSVGElement>>;
        samlSLO: FunctionComponent<SVGProps<SVGSVGElement>>;
        samlSSO: FunctionComponent<SVGProps<SVGSVGElement>>;
        token: FunctionComponent<SVGProps<SVGSVGElement>>;
        revoke: FunctionComponent<SVGProps<SVGSVGElement>>;
        userInfo: FunctionComponent<SVGProps<SVGSVGElement>>;
        wellKnown: FunctionComponent<SVGProps<SVGSVGElement>>;
    },
    tabs: {
        docs: FunctionComponent<SVGProps<SVGSVGElement>>;
        guide: FunctionComponent<SVGProps<SVGSVGElement>>;
        samples: FunctionComponent<SVGProps<SVGSVGElement>>;
        sdks: FunctionComponent<SVGProps<SVGSVGElement>>;
        whatsNext: FunctionComponent<SVGProps<SVGSVGElement>>;
    }
} => {

    return {
        endpoints: {
            authorize: AuthorizeIcon,
            certificate: IDPCertificateIcon,
            introspect: IntrospectIcon,
            issuer: IssuerIcon,
            jwks: JWKSIcon,
            metadata: IDPMetadataIcon,
            revoke: RevokeTokenIcon,
            samlSLO: SLOIcon,
            samlSSO: SSOIcon,
            token: TokenIcon,
            userInfo: UserInfoIcon,
            wellKnown: WellKnownIcon
        },
        tabs: {
            docs: OpenBookIcon,
            guide: CogWheelIcon,
            samples: CodeIcon,
            sdks: CubeStack,
            whatsNext: ShuttleIcon
        }
    };
};

export const getGeneralIcons = (): {
    addCircleOutline: FunctionComponent<SVGProps<SVGSVGElement>>;
    plusIcon: string;
    predefined: FunctionComponent<SVGProps<SVGSVGElement>>;
    warning: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        addCircleOutline: AddCircleOutlineIcon,
        plusIcon: PlusIcon,
        predefined: ProtocolPredefined,
        warning: WarningIcon
    };
};

export const getSignInMethodIllustrations = (): {
    basicAuth: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        basicAuth: BasicAuthIllustration
    };
};

export const getSignInFlowIcons = (): {
    addButton: FunctionComponent<SVGProps<SVGSVGElement>>;
    startButton: FunctionComponent<SVGProps<SVGSVGElement>>;
    doneButton: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        addButton: AddCircleOutlineIcon,
        doneButton: DoneButtonIcon,
        startButton: StartButtonIcon
    };
};

export const getSAMLModeIcons = (): {
    manual: FunctionComponent<SVGProps<SVGSVGElement>>;
    fileBased: FunctionComponent<SVGProps<SVGSVGElement>>;
    URLBased: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {

    return {
        URLBased: globalIllustration,
        fileBased: codeFileIllustration,
        manual: settingsIllustration
    };
};
