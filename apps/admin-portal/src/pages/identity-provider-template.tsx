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

import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { QuickStartIdentityProviderTemplates } from "../components";
import { IdPIcons, IdPCapabilityIcons } from "../configs";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import {
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplatesInterface,
    SupportedAuthenticators,
    SupportedIdentityProviderTemplateCategories,
    SupportedProvisioningConnectors,
    SupportedQuickStartTemplates
} from "../models";

/**
 * Choose the application template from this page.
 *
 * @return {JSX.Element}
 */
export const IdentityProviderTemplateSelectPage: FunctionComponent<any> = (): JSX.Element => {

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateListItemInterface>(null);

    // TODO Remove this hard coded list and retrieve the template list from an endpoint.
    // Quick start templates list.
    const QUICK_START_IDENTITY_PROVIDER_TEMPLATES: IdentityProviderTemplateListItemInterface[] = [
        {
            description: "Allow users from Facebook to access your applications.",
            displayName: "Facebook",
            id: SupportedQuickStartTemplates.FACEBOOK,
            image: IdPIcons?.facebook,
            authenticators: SupportedAuthenticators.FACEBOOK,
            provisioningConnectors: SupportedProvisioningConnectors.NONE,
            services: [
                {
                    displayName: "Authentication",
                    logo: IdPCapabilityIcons.authentication,
                    name: "authentication"
                }
            ]
        },
        {
            description: "Allow users from Google to access your applications.",
            displayName: "Google",
            id: SupportedQuickStartTemplates.GOOGLE,
            image: IdPIcons?.google,
            authenticators: SupportedAuthenticators.GOOGLE,
            provisioningConnectors: SupportedProvisioningConnectors.GOOGLE,
            services: [
                {
                    displayName: "Authentication",
                    logo: IdPCapabilityIcons.authentication,
                    name: "authentication"
                },
                {
                    displayName: "Provision",
                    logo: IdPCapabilityIcons.provision,
                    name: "provision"
                }
            ]
        },
        {
            description: "Allow users from Twitter to access your applications.",
            displayName: "Twitter",
            id: SupportedQuickStartTemplates.TWITTER,
            image: IdPIcons?.twitter,
            authenticators: SupportedAuthenticators.TWITTER,
            provisioningConnectors: SupportedProvisioningConnectors.NONE,
            services: [
                {
                    displayName: "Authentication",
                    logo: IdPCapabilityIcons.authentication,
                    name: "authentication"
                }
            ]
        }
    ];

    // TODO Remove this hard coded list and retrieve the template list from an endpoint.
    // Templates list.
    const TEMPLATES: IdentityProviderTemplatesInterface = {
        [ SupportedIdentityProviderTemplateCategories.QUICK_START as string ]: QUICK_START_IDENTITY_PROVIDER_TEMPLATES
    };

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push("/identity-providers");
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     * @param {SupportedIdentityProviderTemplateCategories} templateCategory - The category of the selected template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string },
                                     templateCategory: SupportedIdentityProviderTemplateCategories): void => {

        // eslint-disable-next-line no-prototype-builtins
        if (!TEMPLATES.hasOwnProperty(templateCategory)) {
            return;
        }

        const selected = TEMPLATES[templateCategory].find((template) => template.id === id);

        if (!selected) {
            return;
        }

        setSelectedTemplate(selected);
        setShowWizard(true);
    };

    return (
        <PageLayout
            title="Select identity provider type"
            contentTopMargin={ true }
            description="Please choose one of the following identity provider types."
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to Identity Providers"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <div className="quick-start-templates">
                <QuickStartIdentityProviderTemplates
                    templates={ TEMPLATES[ SupportedIdentityProviderTemplateCategories.QUICK_START ] }
                    onTemplateSelect={ (e, { id }) =>
                        handleTemplateSelection(e, { id }, SupportedIdentityProviderTemplateCategories.QUICK_START)
                    }
                />
            </div>
            {/*{ showWizard && (*/}
            {/*    <ApplicationCreateWizard*/}
            {/*        title={ selectedTemplate?.displayName }*/}
            {/*        subTitle={ selectedTemplate?.description }*/}
            {/*        closeWizard={ () => setShowWizard(false) }*/}
            {/*        templateType={ selectedTemplate?.id }*/}
            {/*        protocol={ selectedTemplate?.protocols[0] }*/}
            {/*    />*/}
            {/*) }*/}
        </PageLayout>
    );
};
