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
import { FederatedAuthenticatorListItemInterface, FederatedAuthenticatorMetaInterface } from "../../../models";
import { CommonAuthenticatorForm } from "../authenticators";

/**
 * Proptypes for the authenticator form factory component.
 */
interface AuthenticatorFormFactoryInterface extends TestableComponentInterface {
    metadata?: FederatedAuthenticatorMetaInterface;
    initialValues: FederatedAuthenticatorListItemInterface;
    onSubmit: (values: FederatedAuthenticatorListItemInterface) => void;
    type: string;
    triggerSubmit?: boolean;
    enableSubmitButton?: boolean;
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
        type,
        triggerSubmit,
        enableSubmitButton,
        [ "data-testid" ]: testId
    } = props;

    switch (type) {
        default:
            return (
                <CommonAuthenticatorForm
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                />
            );
    }
};

AuthenticatorFormFactory.defaultProps = {
    enableSubmitButton: true
};

/**
 * Default proptypes for the IDP authenticator for factory component.
 */
AuthenticatorFormFactory.defaultProps = {
    "data-testid": "idp-edit-authenticator-settings-form-factory"
};
