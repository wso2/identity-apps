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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    PageLayout,
    TemplateGrid
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Dropdown, DropdownItemProps, DropdownProps, Grid, Icon, Input } from "semantic-ui-react";
import { AppConstants, AppState, EmptyPlaceholderIllustrations, history } from "../../core";
import { ApplicationCreateWizard, CustomApplicationTemplate, MinimalAppCreateWizard } from "../components";
import { ApplicationTemplateIllustrations } from "../configs";
import { ApplicationManagementConstants } from "../constants";
import { ApplicationTemplateCategories, ApplicationTemplateListItemInterface } from "../models";
import { ApplicationManagementUtils } from "../utils";

/**
 * The template ID of SPAs.
 *
 * @constant
 *
 * @type {string}
 */
const SPA_TEMPLATE_ID = "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7";

/**
 * The template ID of the Web application templates.
 * 
 * @constant 
 * 
 * @type {string}
 */
const WEB_APP_TEMPLATE_ID = "b9c5e11e-fc78-484b-9bec-015d247561b8";

/**
 * Template filter types.
 * @type {{text: string; value: string; key: string}[]}
 */
const TEMPLATE_FILTER_TYPES: DropdownItemProps[] = [
    {
        key: "all",
        text: "All Types",
        value: "all"
    }
];

/**
 * Props for the Applications templates page.
 */
type ApplicationTemplateSelectPageInterface = TestableComponentInterface;

/**
 * Choose the application template from this page.
 *
 * @param {ApplicationTemplateSelectPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ApplicationTemplateSelectPage: FunctionComponent<ApplicationTemplateSelectPageInterface> = (
    props: ApplicationTemplateSelectPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);
    const [ templateList, setTemplateList ] = useState<ApplicationTemplateListItemInterface[]>(undefined);
    const [ searchTriggered, setSearchTriggered ] = useState<boolean>(false);
    const [ templateFilterTypes, setTemplateFilterTypes ] = useState<DropdownItemProps[]>(TEMPLATE_FILTER_TYPES);

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

    useEffect(() => {
        if (templateList == undefined) {
            return;
        }

        if (templateList === applicationTemplates) {
            setSearchTriggered(false);
        } else {
            setSearchTriggered(true);
        }
    }, [ templateList ]);

    /**
     * Populate the filter types based on VENDOR template types.
     */
    useEffect(() => {
        if (!(applicationTemplates && applicationTemplates instanceof Array && applicationTemplates.length > 0)) {
            return;
        }

        const filterTypes: DropdownItemProps[] = TEMPLATE_FILTER_TYPES;

        [ ...applicationTemplates ].forEach((template: ApplicationTemplateListItemInterface) => {
            if (ApplicationManagementConstants.FILTERABLE_TEMPLATE_CATEGORIES
                .includes(template.category as ApplicationTemplateCategories)) {

                template.types.forEach((type: string) => {
                    const isAvailable = filterTypes.some((filterType: DropdownItemProps) => filterType.value === type);
                    
                    if (isAvailable) {
                        return;
                    }

                    filterTypes.push({
                        key: type,
                        text: type,
                        value: type
                    });
                });
            }
        });
        
        setTemplateFilterTypes(filterTypes);
    }, [ applicationTemplates ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.PATHS.get("APPLICATIONS"));
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

    /**
     * Handles the template search.
     *
     * @param {React.SyntheticEvent} e - Click event.
     */
    const handleTemplateSearch = (e: SyntheticEvent, { value }: { value: string }): void => {
        if (value.length > 0) {
            setTemplateList(applicationTemplates.filter((item) =>
                item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1))
        } else {
            setTemplateList(applicationTemplates);
        }
    };

    /**
     * Handles the template type change.
     *
     * @param event
     * @param data
     */
    const handleTemplateTypeChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        if (data.value === "all") {
            setTemplateList(applicationTemplates);
        } else {
            const filteredTemplate = [];
            applicationTemplates.map((template) => {
                template.types.map((type) => {
                    if (type.name == data.value) {
                        filteredTemplate.push(template);
                    }
                })
            });

            setTemplateList(filteredTemplate);
        }
    };

        /**
     * Returns the minimal application creation wizard.
     * 
     * @return {ReactElement} The MainAppCreateWizard.
     */
    const minimalAppCreationWizard = (): ReactElement => {
        return (
            <MinimalAppCreateWizard
                title={ selectedTemplate?.name }
                subTitle={ selectedTemplate?.description }
                closeWizard={ (): void => setShowWizard(false) }
                template={ selectedTemplate }
                addProtocol={ false }
            />
        );
    };

    /**
     * Returns the application creation wizard.
     * 
     * @return {ReactElement} The ApplicationCreation Wizard.
     */
    const applicationCreationWizard = (): ReactElement => {
        return (
            <ApplicationCreateWizard
                title={ selectedTemplate?.name }
                subTitle={ selectedTemplate?.description }
                closeWizard={ (): void => setShowWizard(false) }
                template={ selectedTemplate }
                addProtocol={ false }
            />
        )
    }

    /**
     * Returns the appropriate wizard based on the selected template ID.
     * 
     * @return {ReactElement} The MainAppCreateWizard / ApplicationCreation
     */
    const resolveWizard = (): ReactElement => {
        switch (selectedTemplate.id) {
            case SPA_TEMPLATE_ID:
                return minimalAppCreationWizard();
            case WEB_APP_TEMPLATE_ID:
                return minimalAppCreationWizard();
            default:
                return applicationCreationWizard();
        }
    }
    
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
            data-testid={ `${ testId }-page-layout` }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <EmphasizedSegment>
                            <Input
                                data-testid="scope-mgt-claim-list-search-input"
                                icon={ <Icon name="search"/> }
                                onChange={ handleTemplateSearch }
                                placeholder="Search application type"
                                floated="left"
                                width={ 6 }
                                style={ { width: "270px" } }
                            />
                            <Dropdown
                                className="floated right"
                                placeholder="Select type"
                                selection
                                defaultValue="all"
                                options={ templateFilterTypes }
                                onChange={ handleTemplateTypeChange }
                            />
                        </EmphasizedSegment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                searchTriggered && templateList
                    ? (
                        <div className="quick-start-templates">
                            <TemplateGrid<ApplicationTemplateListItemInterface>
                                type="application"
                                templates={ templateList }
                                templateIcons={ ApplicationTemplateIllustrations }
                                templateIconOptions={ {
                                    fill: "primary"
                                } }
                                templateIconSize="tiny"
                                heading={ null }
                                subHeading={ null }
                                onTemplateSelect={ handleTemplateSelection }
                                paginate={ true }
                                paginationLimit={ 5 }
                                paginationOptions={ {
                                    showLessButtonLabel: t("common:showLess"),
                                    showMoreButtonLabel: t("common:showMore")
                                } }
                                emptyPlaceholder={ (
                                    <Grid centered>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <EmptyPlaceholder
                                                    image={ EmptyPlaceholderIllustrations.emptySearch }
                                                    imageSize="tiny"
                                                    title="No results found"
                                                    subtitle={ ["We weren't able to find the type you" +
                                                    " were looking for.", "Please try a different term or use one of" +
                                                    " the following application types to create a new application."] }
                                                    data-testid={ `${ testId }-quick-start-template-grid-empty-
                                                    placeholder` }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column textAlign="center">
                                                <div>
                                                    <TemplateGrid<ApplicationTemplateListItemInterface>
                                                        type="application"
                                                        templates={
                                                            applicationTemplates
                                                            && applicationTemplates instanceof Array
                                                            && applicationTemplates.length > 0
                                                                ? applicationTemplates.filter(
                                                                (template) => template.category ===
                                                                    ApplicationTemplateCategories.DEFAULT)
                                                                : null
                                                        }
                                                        templateIcons={ ApplicationTemplateIllustrations }
                                                        templateIconOptions={ {
                                                            fill: "primary"
                                                        } }
                                                        templateIconSize="tiny"
                                                        heading={ null }
                                                        subHeading={ null }
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
                                                                title={ t("devPortal:components.templates." +
                                                                    "emptyPlaceholder." +
                                                                    "title") }
                                                                subtitle={ [t("devPortal:components.templates." +
                                                                    "emptyPlaceholder.subtitles")] }
                                                                data-testid={ `${ testId }-quick-start-template-grid-
                                                                empty-placeholder` }
                                                            />
                                                        ) }
                                                        tagsSectionTitle={ t("common:technologies") }
                                                        data-testid={ `${ testId }-quick-start-template-grid` }
                                                    />
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                ) }
                                tagsSectionTitle={ t("common:technologies") }
                                data-testid={ `${ testId }-quick-start-template-grid` }
                            />
                        </div>
                    )
                    : (
                        applicationTemplates && !isApplicationTemplateRequestLoading
                            ? (
                                <>
                                    <div className="quick-start-templates">
                                        <TemplateGrid<ApplicationTemplateListItemInterface>
                                            type="application"
                                            templates={
                                                applicationTemplates
                                                && applicationTemplates instanceof Array
                                                && applicationTemplates.length > 0
                                                    ? applicationTemplates.filter(
                                                        (template) =>
                                                            template.category === ApplicationTemplateCategories.DEFAULT)
                                                    : null
                                            }
                                            templateIcons={ ApplicationTemplateIllustrations }
                                            templateIconOptions={ {
                                                fill: "primary"
                                            } }
                                            templateIconSize="tiny"
                                            heading="General Applications"
                                            subHeading={ t("devPortal:components.applications.templates." +
                                                "quickSetup.subHeading") }
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
                                                    title={ t("devPortal:components.templates.emptyPlaceholder." +
                                                        "title") }
                                                    subtitle={ [t("devPortal:components.templates." +
                                                        "emptyPlaceholder.subtitles")] }
                                                    data-testid={
                                                        `${ testId }-quick-start-template-grid-empty-placeholder`
                                                    }
                                                />
                                            ) }
                                            tagsSectionTitle={ t("common:technologies") }
                                            data-testid={ `${ testId }-quick-start-template-grid` }
                                        />
                                    </div>
                                    <Divider hidden/>
                                    <div className="custom-templates">
                                        <TemplateGrid<ApplicationTemplateListItemInterface>
                                            type="application"
                                            templates={
                                                applicationTemplates
                                                && applicationTemplates instanceof Array
                                                && applicationTemplates.length > 0
                                                    ? applicationTemplates.filter(
                                                        (template) =>
                                                            template.category === ApplicationTemplateCategories.VENDOR)
                                                    : null
                                            }
                                            templateIcons={ ApplicationTemplateIllustrations }
                                            templateIconOptions={ {
                                                fill: "primary"
                                            } }
                                            templateIconSize="tiny"
                                            showTags={ true }
                                            tagsKey="types"
                                            tagsAs="default"
                                            showTagIcon={ true }
                                            heading="Vendor Integrations"
                                            subHeading="Predefined set of applications to integrate your application
                                            with popular vendors."
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
                                                    title={ t("devPortal:components.templates.emptyPlaceholder" +
                                                        ".title") }
                                                    subtitle={ [t("devPortal:components.templates." +
                                                        "emptyPlaceholder.subtitles")] }
                                                    data-testid={ `${ testId }-custom-template-grid-empty-placeholder` }
                                                />
                                            ) }
                                            data-testid={ `${ testId }-custom-template-grid` }
                                        />
                                    </div>
                                </>
                            )
                            : <ContentLoader dimmer/>

                    )
            }
            {
                showWizard && resolveWizard()
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationTemplateSelectPage.defaultProps = {
    "data-testid": "application-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationTemplateSelectPage;
