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

import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { IdentityProviderTemplateListInterface, IdentityProviderTemplateListItemInterface } from "../models";
import { IdentityProviderCreateWizard } from "../components/identity-providers/wizard";
import { QuickStartIdentityProviderTemplates } from "../components/identity-providers/templates";
import { getIdentityProviderTemplate, getIdentityProviderTemplateList } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AppState } from "../store";
import { setAvailableAuthenticatorsMeta } from "../store/actions/identity-provider";

/**
 * Choose the application template from this page.
 *
 * @return {JSX.Element}
 */
export const IdentityProviderTemplateSelectPage: FunctionComponent<{}> = (): ReactElement => {

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateListItemInterface>(null);
    const [availableTemplates, setAvailableTemplates] = useState<IdentityProviderTemplateListItemInterface[]>([]);
    
    const dispatch = useDispatch();

    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);

    /**
     * Retrieve Identity Provider template list.
     *
     */
    const getTemplateList = (): void => {

        getIdentityProviderTemplateList()
            .then((response) => {
                const templateList: IdentityProviderTemplateListInterface = response;
                // sort templateList based on display Order
                templateList.templates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
                setAvailableTemplates(templateList.templates);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Identity provider Template List Fetch Error"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving identity provider template list",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
    };

    /**
     * Retrieve Identity Provider template.
     *
     */
    const getTemplate = (templateId: string): void => {

        getIdentityProviderTemplate(templateId)
            .then((response) => {
                setSelectedTemplate(response as IdentityProviderTemplateListItemInterface);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Identity provider Template List Fetch Error"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving identity provider template list",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
    };

    /**
     *  Get Identity Provider templates.
     */
    useEffect(() => {
        getTemplateList();
    }, []);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        if (availableAuthenticators) {
            dispatch(setAvailableAuthenticatorsMeta(undefined));
        }
        history.push("/identity-providers");
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        getTemplate(id);
    };
    
    useEffect(() => {
        if (!selectedTemplate) {
            return;
        }
        setSelectedTemplate(selectedTemplate);
        setShowWizard(true);
    }, [selectedTemplate]);

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
            { availableTemplates && (
                <div className="quick-start-templates">
                    <QuickStartIdentityProviderTemplates
                        templates={ availableTemplates }
                        onTemplateSelect={ (e, { id }) => {
                            handleTemplateSelection(e, { id });
                        } }
                    />
                </div>
            ) }
            { showWizard && (
                <IdentityProviderCreateWizard
                    title={ selectedTemplate?.name }
                    subTitle={ selectedTemplate?.description }
                    closeWizard={ () => {
                        setSelectedTemplate(null);
                        setShowWizard(false);
                    } }
                    template={ selectedTemplate?.idp }
                />
            ) }
        </PageLayout>
    );
};
