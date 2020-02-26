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

import React, { FunctionComponent } from "react";
import { SupportedAuthProtocolTypes } from "../../../models";
import { InboundOIDCForm } from "./inbound-oidc-form";
import { InboundSAMLForm } from "./inbound-saml-form";

/**
 * Proptypes for the inbound form factory component.
 */
interface InboundFormFactoryInterface {
    metadata: any;
    initialValues: any;
    onSubmit: (values: any) => void;
    type: SupportedAuthProtocolTypes;
}

/**
 * Inbound protocol form factory.
 *
 * @param {InboundFormFactoryInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const InboundFormFactory: FunctionComponent<InboundFormFactoryInterface> = (
    props: InboundFormFactoryInterface
): JSX.Element => {

    const {
        metadata,
        initialValues,
        onSubmit,
        type
    } = props;

    switch (type) {
        case SupportedAuthProtocolTypes.OIDC:
            return <InboundOIDCForm initialValues={ initialValues } metadata={ metadata } onSubmit={ onSubmit } />;
        case SupportedAuthProtocolTypes.SAML:
            return <InboundSAMLForm initialValues={ initialValues } metadata={ metadata } onSubmit={ onSubmit }/>;
        default:
            return null;
    }
};
