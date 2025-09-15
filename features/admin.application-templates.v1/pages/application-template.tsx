/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { ExtensionTemplateListInterface, ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import ExtensionTemplatesProvider from "@wso2is/admin.template-core.v1/provider/extension-templates-provider";
import { TestableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationCreationAdapter from "../components/application-creation-adapter";
import ApplicationTemplateGrid from "../components/application-templates-grid";
import { ApplicationTemplateConstants } from "../constants/templates";
import ApplicationTemplateMetadataProvider from
    "../provider/application-template-metadata-provider";
import ApplicationTemplateProvider from "../provider/application-template-provider";

/**
 * Props for the Applications templates page.
 */
type ApplicationTemplateSelectPageInterface = TestableComponentInterface;

/**
 * Choose the application template from this page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application template select page.
 */
const ApplicationTemplateSelectPage: FunctionComponent<ApplicationTemplateSelectPageInterface> = ({
    "data-testid": testId = "application-templates"
}: ApplicationTemplateSelectPageInterface): ReactElement => {

    const { t } = useTranslation();

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ExtensionTemplateListInterface>(null);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    return (
        <ExtensionTemplatesProvider
            resourceType={ ResourceTypes.APPLICATIONS }
            categories={ ApplicationTemplateConstants.SUPPORTED_CATEGORIES_INFO }
        >
            <PageLayout
                pageTitle="Register New Application"
                title={ t("console:develop.pages.applicationTemplate.title") }
                contentTopMargin={ true }
                description={ t("console:develop.pages.applicationTemplate.subTitle") }
                backButton={ {
                    "data-testid": `${ testId }-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.applicationTemplate.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                showBottomDivider
                data-testid={ `${ testId }-page-layout` }
                headingColumnWidth={ 13 }
                actionColumnWidth={ 3 }
            >
                <ApplicationTemplateGrid
                    onTemplateSelect={ (template: ExtensionTemplateListInterface) => {
                        setSelectedTemplate(template);
                        setShowWizard(true);
                    } }
                />
                <ApplicationTemplateProvider
                    template={ selectedTemplate }
                >
                    <ApplicationTemplateMetadataProvider
                        template={ selectedTemplate }
                    >
                        <ApplicationCreationAdapter
                            template={ selectedTemplate }
                            showWizard={ showWizard }
                            onClose={ () => setShowWizard(false) }
                        />
                    </ApplicationTemplateMetadataProvider>
                </ApplicationTemplateProvider>
            </PageLayout>
        </ExtensionTemplatesProvider>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationTemplateSelectPage;
