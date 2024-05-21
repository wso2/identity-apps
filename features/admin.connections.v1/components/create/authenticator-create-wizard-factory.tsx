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

import { AppState } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CreateConnectionWizard } from "./add-connection-wizard";
import {
    EnterpriseConnectionCreateWizard
} from "./enterprise-connection-create-wizard";
import { useGetConnectionTemplate, useGetConnections } from "../../api/connections";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import {
    ConnectionTemplateInterface,
    GenericConnectionCreateWizardPropsInterface,
    StrictConnectionInterface
} from "../../models/connection";
import {
    handleGetConnectionTemplateRequestError,
    handleGetConnectionsError
} from "../../utils/connection-utils";
import {
    ExpertModeAuthenticationProviderCreateWizard
} from "../wizards/expert-mode/expert-mode-authentication-provider-create-wizard";
import {
    OrganizationEnterpriseConnectionCreateWizard
} from "../wizards/organization-enterprise/organization-enterprise-connection-create-wizard";
import { TrustedTokenIssuerCreateWizard } from "../wizards/trusted-token-issuer-create-wizard";

/**
 * Proptypes for the Authenticator Create Wizard factory.
 */
interface AuthenticatorCreateWizardFactoryInterface extends IdentifiableComponentInterface {

    /**
     * Show/Hide the wizard
     */
    isModalOpen: boolean;
    /**
     * Callback to be triggered on modal visibility change.
     */
    handleModalVisibility: (isVisible: boolean) => void;
    /**
     * Callback to be triggered on wizard close.
     */
    onWizardClose: GenericConnectionCreateWizardPropsInterface[ "onWizardClose" ];
    /**
     * Callback to be triggered on successful IDP create.
     */
    onIDPCreate: GenericConnectionCreateWizardPropsInterface[ "onIDPCreate" ];
    /**
     * Type of the wizard.
     */
    type: string;
    /**
     * Selected template. Added this since this {@link AuthenticatorCreateWizardFactory}
     * does not support template grouping. If we are introducing the functionality
     * this must be well tested because it might be a breaking change. For more context
     * please refer {@link IdentityProviderTemplateSelectPage}
     */
    selectedTemplate?: ConnectionTemplateInterface;
}

/**
 * Authenticator Create Wizard factory.
 *
 * @param props - Props injected to the component.
 *
 * @returns ReactElement
 */
export const AuthenticatorCreateWizardFactory: FC<AuthenticatorCreateWizardFactoryInterface> = (
    props: AuthenticatorCreateWizardFactoryInterface
): ReactElement => {

    const {
        isModalOpen,
        handleModalVisibility,
        onWizardClose,
        type,
        /*
         * Added this because {@link IdentityProviderTemplateSelectPage} currently
         * unable to handle grouped templates properly. {@link selectedTemplate}
         * will be a grouped identity provider with sub templates. Even though, the
         * grouping logic implemented and is in place {@link getTemplate} method
         * keeps failing to set the correct grouped template to this state.
         */
        selectedTemplate: parentSelectedTemplate,
        ...rest
    } = props;

    const [ possibleListOfDuplicateIDPs, setPossibleListOfDuplicateIDPs ] = useState<string[]>(undefined);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ConnectionTemplateInterface>(undefined);
    const [
        selectedTemplateWithUniqueName,
        setSelectedTemplateWithUniqueName
    ] = useState<ConnectionTemplateInterface>(undefined);
    const { t } = useTranslation();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const {
        data: connectionsResponse,
        isLoading: isConnectionsFetchRequestLoading,
        error: connectionsFetchRequestError
    } = useGetConnections(null, null, !selectedTemplate?.idp?.name
        ? "name sw " + selectedTemplate?.name : "name sw " + selectedTemplate?.idp?.name, null, true
    );

    const {
        data: connectionTemplate,
        isLoading: isConnectionTemplateFetchRequestLoading,
        error: connectionTemplateFetchRequestError
    } = useGetConnectionTemplate(type === "enterprise-protocols" ? "enterprise-idp" : type, type !== null);


    useEffect(() => {
        if (connectionsFetchRequestError) {
            handleGetConnectionsError(connectionsFetchRequestError);
        }

        if (connectionTemplateFetchRequestError) {
            handleGetConnectionTemplateRequestError(connectionTemplateFetchRequestError);
        }

    }, [ connectionsFetchRequestError, connectionTemplateFetchRequestError ]);

    /**
     * Load the template based on the passed in template type.
     */
    useEffect(() => {

        if (!connectionsResponse) {
            return;
        }

        setPossibleListOfDuplicateIDPs(connectionsResponse?.totalResults
            ? connectionsResponse?.identityProviders?.map((eachIdp: StrictConnectionInterface) => eachIdp.name)
            : []
        );
    }, [ connectionsResponse ]);

    /**
     * Set selected connection template.
     */
    useEffect(() => {
        if (!type) {
            return;
        }

        if (type === "enterprise-protocols") {
            setSelectedTemplate(parentSelectedTemplate);
        } else {
            if (!connectionTemplate) {
                return;
            }

            setSelectedTemplate(connectionTemplate);
        }

        getPossibleListOfDuplicateIDPs();
        handleModalVisibility(true);
    }, [ connectionTemplate, type ]);

    /**
     * Get the possible duplicate IDPs.
     *
     * @param idpName - Name of the IDP.
     */
    const getPossibleListOfDuplicateIDPs = (): void => {

        setPossibleListOfDuplicateIDPs(connectionsResponse?.totalResults
            ? connectionsResponse?.identityProviders?.map((eachIdp: StrictConnectionInterface) => eachIdp.name)
            : []
        );
    };

    /**
     * Called when there are duplicate IDPs and a unique name should be added to the newly created one.
     */
    useEffect(() => {

        if (!isModalOpen) {
            return;
        }

        if (!possibleListOfDuplicateIDPs) {
            return;
        }

        // WHen the wizard is closed by pressing `esc`, bellow code block is executed
        // hitting NPE. Better, to terminate execution if `selectedTemplate` is undefined.
        if (!selectedTemplate) {
            return;
        }

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
             * multiple {@link ConnectionTemplateInterface.subTemplates}.
             */
            setSelectedTemplateWithUniqueName({
                ...selectedTemplate,
                name: generateUniqueIDPName(
                    selectedTemplate?.name,
                    possibleListOfDuplicateIDPs
                )
            });
        }

        handleModalVisibility(true);
    }, [ possibleListOfDuplicateIDPs, selectedTemplate, isModalOpen ]);

    /**
     * Generate the next unique name by appending 1-based index number to the provided initial value.
     *
     * @param initialIdpName - Initial value for the IdP name.
     * @param idpList - The list of available IdPs names.
     * @returns A unique name from the provided list of names.
     */
    const generateUniqueIDPName = (initialIdpName: string, idpList: string[]): string => {

        let idpName: string = initialIdpName;

        for (let i: number = 2; ; i++) {
            if (!idpList?.includes(idpName)) {
                break;
            }

            // If the IdP has spaces, append the number after a space.
            if (idpName.split(" ").length > 1) {
                idpName = initialIdpName + " " +  i;
            } else {
                idpName = initialIdpName + i;
            }
        }

        return idpName;
    };

    if (isModalOpen && !isEmpty(selectedTemplateWithUniqueName)) {
        switch (type) {
            case "organization-enterprise-idp":
                return (
                    <OrganizationEnterpriseConnectionCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            handleModalVisibility(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        data-componentid={ selectedTemplate?.templateId }
                        { ...rest }
                    />
                );

            case "trusted-token-issuer":
                return (
                    <TrustedTokenIssuerCreateWizard
                        title= { t("authenticationProvider:templates.trustedTokenIssuer." +
                            "addWizard.title") }
                        subTitle= { t("authenticationProvider:templates.trustedTokenIssuer." +
                            "addWizard.subtitle", { productName }) }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            handleModalVisibility(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        data-componentid={ selectedTemplate?.templateId }
                        { ...rest }
                    />
                );

            case "enterprise-protocols":
                return (
                    <EnterpriseConnectionCreateWizard
                        title= { t("authenticationProvider:templates.enterprise." +
                            "addWizard.title") }
                        subTitle= { t("authenticationProvider:templates.enterprise." +
                            "addWizard.subtitle") }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            handleModalVisibility(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        data-componentid={ selectedTemplate?.templateId }
                        { ...rest }
                    />
                );

            case ConnectionManagementConstants.EXPERT_MODE_TEMPLATE_ID:
                return (
                    <ExpertModeAuthenticationProviderCreateWizard
                        title={
                            selectedTemplateWithUniqueName?.name === "Expert Mode"
                                ? "Custom Connector"
                                : selectedTemplateWithUniqueName?.name
                        }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            handleModalVisibility(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        data-componentid={ selectedTemplate?.templateId }
                        { ...rest }
                    />
                );

            default:
                return (
                    <CreateConnectionWizard
                        isLoading={ isConnectionsFetchRequestLoading || isConnectionTemplateFetchRequestLoading }
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        onWizardClose={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            handleModalVisibility(false);
                            onWizardClose();
                        } }
                        template={ selectedTemplateWithUniqueName }
                        data-componentid={ selectedTemplate?.templateId }
                        connectionNamesList={ possibleListOfDuplicateIDPs }
                        { ...rest }
                    />
                );
        }
    }
};
