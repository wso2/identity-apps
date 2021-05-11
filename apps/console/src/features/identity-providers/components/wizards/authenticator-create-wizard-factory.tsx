/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { GoogleAuthenticationProviderCreateWizard } from "./google-authentication-provider-create-wizard";
import { IdentityProviderCreateWizard } from "./identity-provider-create-wizard";
import { GenericIdentityProviderCreateWizardPropsInterface, SupportedQuickStartTemplateTypes } from "../../models";

/**
 * Proptypes for the Authenticator Create Wizard factory.
 */
interface AuthenticatorCreateWizardFactoryInterface extends GenericIdentityProviderCreateWizardPropsInterface,
    TestableComponentInterface {

    /**
     * Type of the wizard.
     */
    type: SupportedQuickStartTemplateTypes | string;
}

/**
 * Authenticator Create Wizard factory.
 *
 * @param {AuthenticatorCreateWizardFactoryInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticatorCreateWizardFactory: FunctionComponent<AuthenticatorCreateWizardFactoryInterface> = (
    props: AuthenticatorCreateWizardFactoryInterface
): ReactElement => {

    const {
        onWizardClose,
        type,
        ...rest
    } = props;

    switch (type) {
        case SupportedQuickStartTemplateTypes.GOOGLE:
            return (
                <GoogleAuthenticationProviderCreateWizard
                    // Remove once `GoogleAuthenticationProviderCreateWizard` uses the generic interface.
                    closeWizard={ onWizardClose }
                    { ...rest }
                />
            );
        default:
            return (
                <IdentityProviderCreateWizard
                    // Remove once `IdentityProviderCreateWizard` uses the generic interface.
                    closeWizard={ onWizardClose }
                    { ...rest }
                />
            );
    }
};

/**
 * Default props for the Authenticator Create Wizard factory.
 */
AuthenticatorCreateWizardFactory.defaultProps = {
    "data-testid": "authenticator-create-wizard-factory"
};
