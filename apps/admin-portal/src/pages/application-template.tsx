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

import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { ApplicationCreateWizard, QuickStartApplicationTemplates } from "../components";
import { CustomApplicationTemplate } from "../components/applications/meta";
import { CustomApplicationTemplates } from "../components/applications/templates";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { ApplicationTemplateListItemInterface } from "../models";
import { AppState } from "../store";
import { ApplicationManagementUtils } from "../utils";

/**
 * Choose the application template from this page.
 *
 * @return {React.ReactElement}
 */
export const ApplicationTemplateSelectPage: FunctionComponent<{}> = (): ReactElement => {

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate]  = useState<ApplicationTemplateListItemInterface>(null);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     *  Get Application templates.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

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
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        const selected = applicationTemplates?.find((template) => template.id === id);

        if (id === "custom-application") {
            setSelectedTemplate(CustomApplicationTemplate);
        } else {
            if (!selected) {
                return;
            }
            setSelectedTemplate(selected);
        }
        setShowWizard(true);
    };

    return (
        <PageLayout
            title="Select Application Type"
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
            {
                !isApplicationTemplateRequestLoading
                    ? (
                        <div className="quick-start-templates">
                            <QuickStartApplicationTemplates
                                templates={ applicationTemplates }
                                onTemplateSelect={ (e, { id }) =>
                                    handleTemplateSelection(e, { id })
                                }
                            />
                        </div>
                    )
                    : <ContentLoader dimmer />
            }
            <Divider hidden />
            <div className="quick-start-templates">
                <CustomApplicationTemplates
                    template={ CustomApplicationTemplate }
                    onTemplateSelect={ (e, { id }) =>
                        handleTemplateSelection(e, { id })
                    }
                />
            </div>
            { showWizard && (
                <ApplicationCreateWizard
                    title={ selectedTemplate?.name }
                    subTitle={ selectedTemplate?.description }
                    closeWizard={ (): void => setShowWizard(false) }
                    template={ selectedTemplate }
                />
            ) }
        </PageLayout>
    );
};
