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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { ApplicationCreateWizard, QuickStartApplicationTemplates, } from "../components";
import { ApplicationTemplateIllustrations } from "../configs";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import {
    ApplicationTemplateListInterface,
    ApplicationTemplateListItemInterface,
    SupportedApplicationTemplateCategories,
    SupportedAuthProtocolTypes,
    SupportedQuickStartTemplateTypes
} from "../models";
import { getApplicationList, getApplicationTemplateList } from "../api";
import { useDispatch } from "react-redux";

/**
 * Choose the application template from this page.
 *
 * @return {React.ReactElement}
 */
export const ApplicationTemplateSelectPage: FunctionComponent<{}> = (): ReactElement => {

    const dispatch = useDispatch();

    const [showWizard, setShowWizard] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplateListItemInterface>(null);
    const [availableTemplates, setAvailableTemplates] = useState<ApplicationTemplateListItemInterface[]>([]);

    /**
     * Retrieve Application template list.
     *
     */
    const getAppTemplateList = (): void => {

        getApplicationTemplateList()
            .then((response) => {
                // TODO enable after displayByOrder is available.
                // const templateList: ApplicationTemplateListInterface = response;
                // sort templateList based on display Order
                // templateList.templates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
                // setAvailableTemplates(templateList.templates);
                setAvailableTemplates((response as ApplicationTemplateListInterface).templates);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Template List Fetch Error"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving application template list",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
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
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        const selected = availableTemplates.find((template) => template.id === id);

        if (!selected) {
            return;
        }

        setSelectedTemplate(selected);
        setShowWizard(true);
    };

    /**
     *  Get Application templates.
     */
    useEffect(() => {
        getAppTemplateList();
    }, []);

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
            { availableTemplates &&
            <div className="quick-start-templates">
                <QuickStartApplicationTemplates
                    templates={ availableTemplates }
                    onTemplateSelect={ (e, { id }) =>
                        handleTemplateSelection(e, { id })
                    }
                />
            </div>
            }
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
