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

import { ContentLoader, EmptyPlaceholder, TemplateGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { ApplicationCreateWizard } from "../components";
import { CustomApplicationTemplate } from "../components/applications/meta";
import { ApplicationTemplateIllustrations, EmptyPlaceholderIllustrations } from "../configs";
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

    const { t } = useTranslation();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [showWizard, setShowWizard] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplateListItemInterface>(null);
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
    }, [applicationTemplates]);

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
            title={ t("devPortal:pages.applicationTemplate.title") }
            contentTopMargin={ true }
            description={ t("devPortal:pages.applicationTemplate.subTitle") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("devPortal:pages.applicationTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            {
                (applicationTemplates && !isApplicationTemplateRequestLoading)
                    ? (
                        <div className="quick-start-templates">
                            <TemplateGrid<ApplicationTemplateListItemInterface>
                                type="application"
                                templates={
                                    applicationTemplates.filter((template) => template.id !== "custom-application")
                                }
                                templateIcons={ ApplicationTemplateIllustrations }
                                heading={ t("devPortal:components.applications.templates.quickSetup.heading") }
                                subHeading={ t("devPortal:components.applications.templates.quickSetup.subHeading") }
                                onTemplateSelect={ handleTemplateSelection }
                                paginate={ true }
                                paginationLimit={ 5 }
                                paginationOptions={ {
                                    showLessButtonLabel: t("common:showLess"),
                                    showMoreButtonLabel: t("common:showMore")
                                } }
                                emptyPlaceholder={ (
                                    <EmptyPlaceholder
                                        image={ EmptyPlaceholderIllustrations.newList }
                                        imageSize="tiny"
                                        title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                                        subtitle={ [t("devPortal:components.templates.emptyPlaceholder.subtitles")] }
                                    />
                                ) }
                                tagsSectionTitle={ t("common:technologies") }
                            />
                        </div>
                    )
                    : <ContentLoader dimmer/>
            }
            <Divider hidden/>
            <div className="custom-templates">
                <TemplateGrid<ApplicationTemplateListItemInterface>
                    type="application"
                    templates={ [CustomApplicationTemplate] }
                    templateIcons={ ApplicationTemplateIllustrations }
                    heading={ t("devPortal:components.applications.templates.manualSetup.heading") }
                    subHeading={ t("devPortal:components.applications.templates.manualSetup.subHeading") }
                    onTemplateSelect={ handleTemplateSelection }
                    paginate={ true }
                    paginationLimit={ 5 }
                    paginationOptions={ {
                        showLessButtonLabel: t("common:showLess"),
                        showMoreButtonLabel: t("common:showMore")
                    } }
                    emptyPlaceholder={ (
                        <EmptyPlaceholder
                            image={ EmptyPlaceholderIllustrations.newList }
                            imageSize="tiny"
                            title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                            subtitle={ [t("devPortal:components.templates.emptyPlaceholder.subtitles")] }
                        />
                    ) }
                    tagsSectionTitle={ t("common:technologies") }
                />
            </div>
            {
                showWizard && (
                    <ApplicationCreateWizard
                        title={ selectedTemplate?.name }
                        subTitle={ selectedTemplate?.description }
                        closeWizard={ (): void => setShowWizard(false) }
                        template={ selectedTemplate }
                        addProtocol={ false }
                    />
                )
            }
        </PageLayout>
    );
};
