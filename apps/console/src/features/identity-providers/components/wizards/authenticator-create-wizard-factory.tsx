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
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EnterpriseIDPCreateWizard } from "./enterprise-idp-create-wizard";
import { GoogleAuthenticationProviderCreateWizard } from "./google-authentication-provider-create-wizard";
import { OidcAuthenticationProviderCreateWizard } from "./oidc-authentication-provider-create-wizard";
import { ConfigReducerStateInterface } from "../../../core/models";
import { AppState } from "../../../core/store";
import { getIdentityProviderList, getIdentityProviderTemplate } from "../../api";
import { IdentityProviderManagementConstants } from "../../constants";
import {
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateLoadingStrategies
} from "../../models";
import { IdentityProviderTemplateManagementUtils } from "../../utils";
import { handleGetIDPTemplateAPICallError } from "../utils";

/**
 * Proptypes for the Authenticator Create Wizard factory.
 */
interface AuthenticatorCreateWizardFactoryInterface extends TestableComponentInterface {

    /**
     * Show/Hide the wizard
     */
    open: boolean;
    /**
     * Callback to be triggered on wizard close.
     */
    onWizardClose: GenericIdentityProviderCreateWizardPropsInterface[ "onWizardClose" ];
    /**
     * Callback to be triggered on successful IDP create.
     */
    onIDPCreate: GenericIdentityProviderCreateWizardPropsInterface[ "onIDPCreate" ];
    /**
     * Type of the wizard.
     */
    type: string;
    /**
     * Selected template. Added this since this {@link AuthenticatorCreateWizardFactory}
     * does not support template grouping. If we are introducing the functionality
     * this must be well tested because it might be a breaking change. For more context
     * please refer {@link IdentityProviderTemplateSelectPage}
     *
     * FIXME: As a part of #git.issue
     */
    selectedTemplate?: IdentityProviderTemplateInterface;
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
        onWizardClose,
        type,
        /**
         * Added this because {@link IdentityProviderTemplateSelectPage} currently
         * unable to handle grouped templates properly. {@link selectedTemplate}
         * will be a grouped identity provider with sub templates. Even though, the
         * grouping logic implemented and is in place {@link getTemplate} method
         * keeps failing to set the correct grouped template to this state.
         *
         * FIXME: As a part of #git.issue
         */
        selectedTemplate: parentSel,
        ...rest
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ possibleListOfDuplicateIDPs, setPossibleListOfDuplicateIDPs ] = useState<string[]>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(open);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);
    const [
        selectedTemplateWithUniqueName,
        setSelectedTemplateWithUniqueName
    ] = useState<IdentityProviderTemplateInterface>(undefined);

    /**
     * Load the template based on the passed in template type.
     */
    useEffect(() => {

        if (!type) {
            return;
        }

        getTemplate(type);
    }, [ type ]);

    /**
     * Called when template is selected. If the selected template
     * is not present it won't show the wizard.
     */
    useEffect(() => {
        if (!selectedTemplate) return;
        getPossibleListOfDuplicateIDPs(
            selectedTemplate.idp?.name || selectedTemplate.name
        );
        setShowWizard(true);
    }, [ selectedTemplate ]);

    /**
     * Called when there are duplicate IDPs and a unique name should be added to the newly created one.
     */
    useEffect(() => {

        if (!showWizard) return;
        if (!possibleListOfDuplicateIDPs) return;

        if (selectedTemplate.idp?.name) {
            /**
             * If the selected template has a idp associated to
             * it we can assure that it is a standalone template
             * and proceed to re-populate the state with a unique
             * name for the authenticator.
             */
            setSelectedTemplateWithUniqueName({
                ...selectedTemplate,
                idp: {
                    ...selectedTemplate.idp,
                    name: generateUniqueIDPName(
                        selectedTemplate.idp.name,
                        possibleListOfDuplicateIDPs
                    )
                }
            });
        } else {
            /**
             * If the selected template doesn't have any idp associated to it
             * we can "assume" that it's a grouped template that contains
             * multiple {@link IdentityProviderTemplateInterface.subTemplates}.
             */
            setSelectedTemplateWithUniqueName({
                ...selectedTemplate,
                name: generateUniqueIDPName(
                    selectedTemplate?.name,
                    possibleListOfDuplicateIDPs
                )
            });
        }

        setShowWizard(true);

    }, [ possibleListOfDuplicateIDPs, selectedTemplate, showWizard ]);

    /**
     * Retrieve Identity Provider template.
     */
    const getTemplate = (templateId: string): void => {

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy
            ? config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE
            : (IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY
                === IdentityProviderTemplateLoadingStrategies.REMOTE);

        if (useAPI) {
            getIdentityProviderTemplate(templateId)
                .then((response) => {
                    if (!response.disabled) {
                        setSelectedTemplate(response as IdentityProviderTemplateInterface);
                    }
                })
                .catch((error) => {
                    handleGetIDPTemplateAPICallError(error);
                });
        } else {
            IdentityProviderTemplateManagementUtils.getIdentityProviderTemplate(templateId)
                .then((response) => {
                    /**
                     * If for some reason we can't find the given template by id
                     * and the template is disabled from file level, we can assure
                     * the {@link type} (templateId) is a grouped type.
                     */
                    if (response !== undefined && response.disabled) {
                        setSelectedTemplate(response as IdentityProviderTemplateInterface);
                    } else {
                        /**
                         * If the {@link getIdentityProviderTemplate} method failed to
                         * retrieve the matching template via the {@link type} (templateId)
                         * then set the template that got passed from {@link props}. This
                         * case executes when a grouped template is trying to load.
                         *
                         * FIXME: Re-evaluate this change as a part of #git.issue
                         */
                        if (parentSel && !parentSel.disabled) {
                            setSelectedTemplate(parentSel);
                        }
                    }
                })
                .catch((error) => {
                    handleGetIDPTemplateAPICallError(error);
                });
        }
    };

    /**
     * Get the possible duplicate IDPs.
     *
     * @param {string} idpName - Name of the IDP.
     */
    const getPossibleListOfDuplicateIDPs = (idpName: string): void => {

        getIdentityProviderList(null, null, "name sw " + idpName)
            .then((response: IdentityProviderListResponseInterface) => {
                setPossibleListOfDuplicateIDPs(response?.totalResults
                    ? response?.identityProviders?.map(eachIdp => eachIdp.name)
                    : []
                );
            });
    };

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
        case IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE:
            return (showWizard && !isEmpty(selectedTemplateWithUniqueName))
                ? (
                    <GoogleAuthenticationProviderCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            onWizardClose();
                            setShowWizard(false);
                        } }
                        template={ selectedTemplateWithUniqueName }
                        { ...rest }
                    />
                )
                : null;
        case IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC:
            return (showWizard && !isEmpty(selectedTemplateWithUniqueName))
                ? (
                    <OidcAuthenticationProviderCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        closeWizard={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            setShowWizard(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        { ...rest }
                    />
                )
                : null;
        default:
            return (showWizard && !isEmpty(selectedTemplateWithUniqueName))
                ? (
                    <EnterpriseIDPCreateWizard
                        title="Standard Based Authentication"
                        subTitle="Configure a new Identity Provider with advanced enterprise protocols."
                        closeWizard={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            setShowWizard(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
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
