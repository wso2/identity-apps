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

import React, {FunctionComponent, ReactElement} from "react";
import { SupportedAuthProtocolTypes } from "../../../models";
import { OIDCAuthenticatorForm } from "./oidc-authenticator-form";

/**
 * Proptypes for the inbound form factory component.
 */
interface AuthenticatorFormFactoryInterface {
    metadata: any;
    initialValues: any;
    onSubmit: (values: any) => void;
    type: SupportedAuthProtocolTypes;
}

/**
 * Authenticator form factory.
 *
 * @param {AuthenticatorFormFactoryInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorFormFactory: FunctionComponent<AuthenticatorFormFactoryInterface> = (
    props: AuthenticatorFormFactoryInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        type
    } = props;

    switch (type) {
        case SupportedAuthProtocolTypes.OIDC:
            return <OIDCAuthenticatorForm initialValues={ initialValues } metadata={ metadata } onSubmit={ onSubmit } />;
        default:
            return null;
    }
};
