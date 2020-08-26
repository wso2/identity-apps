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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { InboundCustomProtocolForm } from "./inbound-custom-form";
import { InboundOIDCForm } from "./inbound-oidc-form";
import { InboundPassiveStsForm } from "./inbound-passive-sts-form";
import { InboundSAMLForm } from "./inbound-saml-form";
import { InboundWSTrustForm } from "./inbound-ws-trust-form";
import { SupportedAuthProtocolTypes } from "../../models";

/**
 * Proptypes for the inbound form factory component.
 */
interface InboundFormFactoryInterface extends TestableComponentInterface {
    metadata?: any;
    initialValues: any;
    onSubmit: (values: any) => void;
    type: SupportedAuthProtocolTypes;
    onApplicationRegenerate?: () => void;
    onApplicationRevoke?: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOrigins?: string[];
    /**
     * Tenant domain
     */
    tenantDomain?: string;
}

/**
 * Inbound protocol form factory.
 *
 * @param {InboundFormFactoryInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundFormFactory: FunctionComponent<InboundFormFactoryInterface> = (
    props: InboundFormFactoryInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        type,
        onApplicationRegenerate,
        onApplicationRevoke,
        readOnly,
        allowedOrigins,
        tenantDomain,
        [ "data-testid" ]: testId
    } = props;

    switch (type) {
        case SupportedAuthProtocolTypes.OIDC:
            return (
                <InboundOIDCForm
                    tenantDomain={ tenantDomain }
                    allowedOriginList={ allowedOrigins }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    onApplicationRegenerate={ onApplicationRegenerate }
                    onApplicationRevoke={ onApplicationRevoke }
                    readOnly={ readOnly }
                    data-testid={ testId }
                />
            );
        case SupportedAuthProtocolTypes.SAML:
            return (
                <InboundSAMLForm
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    readOnly={ readOnly }
                    data-testid={ testId }
                />
            );
        case SupportedAuthProtocolTypes.WS_TRUST:
            return (
                <InboundWSTrustForm
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    readOnly={ readOnly }
                    data-testid={ testId }
                />
            );
        case SupportedAuthProtocolTypes.WS_FEDERATION:
            return (
                <InboundPassiveStsForm
                    initialValues={ initialValues }
                    onSubmit={ onSubmit }
                    readOnly={ readOnly }
                    data-testid={ testId }
                />
            );
        case SupportedAuthProtocolTypes.CUSTOM:
            return (
                <InboundCustomProtocolForm
                    metadata={ metadata }
                    initialValues={ initialValues }
                    onSubmit={ onSubmit }
                    data-testid={ testId }
                />
            );
        default:
            return null;
    }
};

/**
 * Default props for the inbound form factory component.
 */
InboundFormFactory.defaultProps = {
    "data-testid": "inbound-form-factory"
};
