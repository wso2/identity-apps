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

import { ReactComponent as GearsIcon } from "../resources/assets/images/icons/gears-icon.svg";
import { ReactComponent as DocumentIcon } from "../resources/assets/images/icons/document-icon.svg";
import { ReactComponent as ReportIcon } from "../resources/assets/images/icons/report-icon.svg";
import EmailOTPIcon from "../resources/assets/images/icons/email-solid.svg";
import SMSOTPIcon from "../resources/assets/images/icons/sms-otp.svg";
import FIDOIcon from "../resources/assets/images/icons/fido2.svg";
import MagicLinkIcon from "../resources/assets/images/icons/magic-link-icon.svg";
import TOTPIcon from "../resources/assets/images/icons/totp.svg";
import { ReactComponent as DefaultConnectionIcon 
} from "../resources/assets/images/icons/default-connection-icon.svg";
import { ReactComponent as EnterpriseConnectionIcon
} from "../resources/assets/images/icons/enterprise-icon.svg";
import OrganizationSSOIcon from "../resources/assets/images/icons/organization-sso-icon.svg";
import OIDCConnectionIcon from "../resources/assets/images/icons/oidc-connection-icon.png";
import SAMLConnectionIcon from "../resources/assets/images/icons/saml-connection-icon.png";
import WSFederationIcon from "../resources/assets/images/icons/ws-fed.png";
import { SupportedServices } from "../models/connection";
import ConnectionIcon from "../resources/assets/images/icons/connection.svg";
import {
    ReactComponent as ProvisionIcon
} from "../resources/assets/images/icons/provision.svg";
import TrustedTokenIssuerIcon 
    from "../../../themes/default/assets/images/identity-providers/trusted-token-issuer-illustration.svg";

export const getConnectionWizardStepIcons = (): any => {

    return {
        authenticatorSettings: GearsIcon,
        general: DocumentIcon,
        outboundProvisioningSettings: GearsIcon,
        summary: ReportIcon
    };
};

export const getConnectionIcons = (): any => {

    return {
        default: DefaultConnectionIcon,
        emailOTP: EmailOTPIcon,
        enterprise: EnterpriseConnectionIcon,
        fido: FIDOIcon,
        magicLink: MagicLinkIcon,
        oidc: OIDCConnectionIcon,
        organizationSSO: OrganizationSSOIcon,
        saml: SAMLConnectionIcon,
        smsOTP: SMSOTPIcon,
        totp: TOTPIcon,
        trustedTokenIssuer: TrustedTokenIssuerIcon,
        wsFed: WSFederationIcon
    };
};

export const getConnectionCapabilityIcons = (): any => {

    return {
        [ SupportedServices.AUTHENTICATION ]: ConnectionIcon,
        [ SupportedServices.PROVISIONING ]: ProvisionIcon
    };
};

export const getOutboundProvisioningConnectorWizardIcons = (): any => {

    return {
        connectorDetails: DocumentIcon,
        connectorSelection: GearsIcon,
        summary: ReportIcon
    };
};
