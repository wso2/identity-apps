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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { GoogleAuthenticationProviderCreateWizard } from "./google-authentication-provider-create-wizard";
import { IdentityProviderCreateWizard } from "./identity-provider-create-wizard";
import {
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderTemplateInterface,
    SupportedQuickStartTemplateTypes
} from "../../models";

/**
 * Proptypes for the Authenticator Create Wizard factory.
 */
interface AuthenticatorCreateWizardFactoryInterface extends TestableComponentInterface {

    /**
     * Set of duplicate IDPs in the system.
     */
    duplicateIDPs: string[];
    /**
     * Show/Hide the wizard
     */
    open: boolean;
    /**
     * Callback to be triggered on wizard close.
     */
    onWizardClose: GenericIdentityProviderCreateWizardPropsInterface[ "onWizardClose" ];
    /**
     * Selected Template
     */
    template: GenericIdentityProviderCreateWizardPropsInterface[ "template" ];
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
        open,
        duplicateIDPs,
        onWizardClose,
        template,
        type,
        ...rest
    } = props;

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [
        selectedTemplateWithUniqueName,
        setSelectedTemplateWithUniqueName
    ] = useState<IdentityProviderTemplateInterface>(template);

    /**
     * Called when possibleListOfDuplicateIdps is changed.
     */
    useEffect(() => {
        
        if (!open) {
            return;
        }

        if (!template?.idp?.name) {
            return;
        }

        if (!duplicateIDPs) {
            return;
        }

        setSelectedTemplateWithUniqueName({
            ...template,
            idp: {
                ...template.idp,
                name: generateUniqueIDPName(template.idp.name, duplicateIDPs)
            }
        });
        
        setShowWizard(true);
    }, [ duplicateIDPs, template, open ]);

    /**
     * Generate the next unique name by appending 1-based index number to the provided initial value.
     *
     * @param initialIdpName Initial value for the IdP name.
     * @param idpList The list of available IdPs names.
     * @return A unique name from the provided list of names.
     */
    const generateUniqueIDPName = (initialIdpName: string, idpList: string[]): string => {

        let idpName: string = initialIdpName;

        for (let i = 2; ; i++) {
            if (!idpList?.includes(idpName)) {
                break;
            }
            idpName = initialIdpName + i;
        }

        return idpName;
    };

    switch (type) {
        case SupportedQuickStartTemplateTypes.GOOGLE:
            return showWizard
                ? (
                    <GoogleAuthenticationProviderCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        // Remove once `GoogleAuthenticationProviderCreateWizard` uses the generic interface.
                        closeWizard={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            onWizardClose();
                            setShowWizard(false);
                        } }
                        template={ selectedTemplateWithUniqueName }
                        { ...rest }
                    />
                )
                : null;
        default:
            return showWizard
                ? (
                    <IdentityProviderCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        // Remove once `IdentityProviderCreateWizard` uses the generic interface.
                        closeWizard={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            onWizardClose();
                            setShowWizard(false);
                        } }
                        template={ selectedTemplateWithUniqueName }
                        { ...rest }
                    />
                )
                : null;
    }
};

/**
 * Default props for the Authenticator Create Wizard factory.
 */
AuthenticatorCreateWizardFactory.defaultProps = {
    "data-testid": "authenticator-create-wizard-factory"
};
