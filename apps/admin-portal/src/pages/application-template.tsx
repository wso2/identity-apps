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

import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { ApplicationCreateWizard, QuickStartApplicationTemplates } from "../components";
import { ApplicationTemplateIllustrations, TechnologyLogos } from "../configs";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import {
    ApplicationTemplateListItemInterface,
    ApplicationTemplatesInterface,
    SupportedApplicationTemplateCategories,
    SupportedAuthProtocolTypes,
    SupportedQuickStartTemplateTypes
} from "../models";

/**
 * Choose the application template from this page.
 *
 * @return {JSX.Element}
 */
export const ApplicationTemplateSelectPage: FunctionComponent<any> = (): JSX.Element => {

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);

    // TODO Remove this hard coded list and retrieve the template list from an endpoint.
    // Quick start templates list.
    const QUICK_START_APPLICATION_TEMPLATES: ApplicationTemplateListItemInterface[] = [
        {
            description: "Front end applications which uses APIs. Mostly written using scripting languages.",
            displayName: "Single page application",
            id: SupportedQuickStartTemplateTypes.SPA,
            image: ApplicationTemplateIllustrations?.spa,
            protocols: [ SupportedAuthProtocolTypes.OIDC ],
            technologies: [
                {
                    displayName: "Angular",
                    logo: TechnologyLogos.angular,
                    name: "angular"
                },
                {
                    displayName: "React",
                    logo: TechnologyLogos.react,
                    name: "react"
                },
                {
                    displayName: "Vue",
                    logo: TechnologyLogos.vue,
                    name: "vuejs"
                }
            ]
        },
        {
            description: "Regular web applications which uses redirections inside browsers.",
            displayName: "Web application",
            id: SupportedQuickStartTemplateTypes.OAUTH_WEB_APP,
            image: ApplicationTemplateIllustrations?.webApp,
            protocols: [ SupportedAuthProtocolTypes.OIDC ],
            technologies: [
                {
                    displayName: "Java",
                    logo: TechnologyLogos.java,
                    name: "java"
                },
                {
                    displayName: ".NET",
                    logo: TechnologyLogos.dotNet,
                    name: "dotnet"
                }
            ]
        }
    ];

    // TODO Remove this hard coded list and retrieve the template list from an endpoint.
    // Templates list.
    const TEMPLATES: ApplicationTemplatesInterface = {
        [ SupportedApplicationTemplateCategories.QUICK_START as string ]: QUICK_START_APPLICATION_TEMPLATES
    };

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push("/applications");
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     * @param {SupportedApplicationTemplateCategories} templateCategory - The category of the selected template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string },
                                     templateCategory: SupportedApplicationTemplateCategories): void => {

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
            title="Select application type"
            contentTopMargin={ true }
            description="Please choose one of the following application types."
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to applications"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <div className="quick-start-templates">
                <Heading as="h1">Quick Start</Heading>
                <QuickStartApplicationTemplates
                    templates={ TEMPLATES[ SupportedApplicationTemplateCategories.QUICK_START ] }
                    onTemplateSelect={ (e, { id }) =>
                        handleTemplateSelection(e, { id }, SupportedApplicationTemplateCategories.QUICK_START)
                    }
                />
            </div>
            { showWizard && (
                    <ApplicationCreateWizard
                        title={ selectedTemplate?.displayName }
                        subTitle={ selectedTemplate?.description }
                        closeWizard={ () => setShowWizard(false) }
                        templateType={ selectedTemplate?.id }
                        protocol={ selectedTemplate?.protocols[0] }
                    />
                ) }
        </PageLayout>
    );
};
