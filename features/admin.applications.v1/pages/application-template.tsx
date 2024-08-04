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

import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    getEmptyPlaceholderIllustrations,
    getTechnologyLogos,
    history
} from "@wso2is/admin.core.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, EmptyPlaceholder, PageLayout, TemplateGrid } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import orderBy from "lodash-es/orderBy";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Divider,
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    Input
} from "semantic-ui-react";
import { InboundProtocolsMeta } from "../components/meta";
import { MinimalAppCreateWizard } from "../components/wizard/minimal-application-create-wizard";
import { getApplicationTemplateIllustrations } from "../configs/ui";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import CustomProtocolApplicationTemplate
    from "../data/application-templates/templates/custom-protocol-application/custom-protocol-application.json";
import {
    ApplicationTemplateCategories, ApplicationTemplateCategoryInterface,
    ApplicationTemplateInterface,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface
} from "../models";
import { ApplicationManagementUtils } from "../utils/application-management-utils";
import { ApplicationTemplateManagementUtils } from "../utils/application-template-management-utils";

/**
 * Template filter types.
 */
const TEMPLATE_FILTER_TYPES: DropdownItemProps[] = [
    {
        key: "all",
        text: "All Types",
        value: "all"
    }
];

// Temporary component level constants to show search/hide template filter options.
// TODO: Remove once more than one template category is available. (https://github.com/wso2/product-is/issues/10891)
const SHOW_TEMPLATE_SEARCH: boolean = false;
const SHOW_TEMPLATE_FILTER: boolean = false;

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
const ApplicationTemplateSelectPage: FunctionComponent<ApplicationTemplateSelectPageInterface> = (
    props: ApplicationTemplateSelectPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const customInboundProtocols: AuthProtocolMetaListItemInterface[] = useSelector((state: AppState) =>
        state.application.meta.customInboundProtocols);

    const [ categorizedTemplates, setCategorizedTemplates ] = useState<ApplicationTemplateCategoryInterface[]>([]);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);
    const [
        filteredTemplateList,
        setFilteredTemplateList
    ] = useState<ApplicationTemplateListItemInterface[]>(undefined);
    const [ searchTriggered, setSearchTriggered ] = useState<boolean>(false);
    const [ showCustomProtocolApplicationTemplate, setShowCustomProtocolApplicationTemplate ] =
        useState<boolean>(false);

    const [ templateFilterTypes, setTemplateFilterTypes ] = useState<DropdownItemProps[]>(TEMPLATE_FILTER_TYPES);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Fetch the custom inbound protocols.
     */
    useEffect(() => {
        ApplicationManagementUtils.getCustomInboundProtocols(InboundProtocolsMeta, true);
    }, []);

    /**
     * Show/hide custom application templated based on the availability of custom inbound authenticators.
     */
    useEffect(() => {
        setShowCustomProtocolApplicationTemplate(customInboundProtocols.length > 0);
    }, [ customInboundProtocols ]);

    /**
     *  Get Application templates.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

    useEffect(() => {
        if (filteredTemplateList == undefined) {
            return;
        }

        if (isEqual(filteredTemplateList, applicationTemplates)) {
            setSearchTriggered(false);
        } else {
            setSearchTriggered(true);
        }
    }, [ filteredTemplateList ]);

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
                    const isAvailable: boolean = filterTypes.some(
                        (filterType: DropdownItemProps) => filterType.value === type);

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
     * Categorize the application templates.
     */
    useEffect(() => {
        if (!applicationTemplates || !Array.isArray(applicationTemplates) || !(applicationTemplates.length > 0)) {
            return;
        }

        ApplicationTemplateManagementUtils.categorizeTemplates(applicationTemplates)
            .then((response: ApplicationTemplateCategoryInterface[]) => {
                setCategorizedTemplates(response);
            })
            .catch(() => {
                setCategorizedTemplates([]);
            });
    }, [ applicationTemplates ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * Handles template selection.
     *
     * @param e - Click event.
     * @param id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        if (!applicationTemplates) {
            return;
        }

        let selected: ApplicationTemplateListItemInterface = applicationTemplates
            .find((template: ApplicationTemplateListItemInterface) => template.id === id);

        if (!selected) {
            return;
        }

        if (id === CustomApplicationTemplate.id) {
            selected = cloneDeep(CustomApplicationTemplate);
        }

        eventPublisher.publish("application-click-create-new", {
            source: "application-listing-page",
            type: selected.templateId
        });
        setSelectedTemplate(selected);
        setShowWizard(true);
    };

    /**
     * Handles the template search.
     *
     * @param e - Click event.
     * @param value - Search value.
     */
    const handleTemplateSearch = (e: SyntheticEvent, { value }: { value: string }): void => {
        if (value.length > 0) {
            setFilteredTemplateList(applicationTemplates.filter((item: ApplicationTemplateListItemInterface) =>
                item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1));
        } else {
            setFilteredTemplateList(applicationTemplates);
        }
    };

    /**
     * Handles the template type change.
     *
     * @param event - Click event.
     * @param data - Dropdown data.
     */
    const handleTemplateTypeChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        if (data.value === "all") {
            setFilteredTemplateList(applicationTemplates);
        } else {
            const filtered: ApplicationTemplateListItemInterface[] = applicationTemplates.filter(
                (template: ApplicationTemplateListItemInterface) =>
                    template.types?.includes(data.value));

            setFilteredTemplateList(filtered);
        }
    };

    /**
     * Generic function to render the template grid.
     *
     * @param templates - Set of templates to be displayed.
     * @param additionalProps - Additional props for the `TemplateGrid` component.
     * @param placeholder - Empty placeholder for the grid.
     * @param templatesOverrides - Template array which will get precedence.
     * @param isSearchView - Is the requested view search ro not.
     * @returns Template grid.
     */
    const renderTemplateGrid = (templates: ApplicationTemplateInterface[],
        additionalProps: Record<string, unknown>,
        placeholder?: ReactElement,
        templatesOverrides?: ApplicationTemplateInterface[],
        isSearchView?: boolean): ReactElement => {

        // Don't show the grid if there are no templates unless the view requested is search.
        if (!isSearchView && isEmpty(templatesOverrides) && isEmpty(templates)) {

            return null;
        }

        let templateToShow: ApplicationTemplateInterface[] = templatesOverrides
            ? templatesOverrides
            : templates;

        if (!showCustomProtocolApplicationTemplate) {
            templateToShow = templateToShow.filter((template: ApplicationTemplateInterface) =>
                template.id !== CustomProtocolApplicationTemplate.id);
        }

        // Order the templates by pushing coming soon items to the end.
        templateToShow = orderBy(templateToShow, [ "comingSoon" ], [ "desc" ]);

        return (
            <TemplateGrid<ApplicationTemplateListItemInterface>
                type="application"
                templates={
                    templateToShow
                }
                templateIcons={ { ...getApplicationTemplateIllustrations(), ...getTechnologyLogos() } as any }
                templateIconOptions={ {
                    fill: "primary"
                } }
                templateIconSize="tiny"
                onTemplateSelect={ handleTemplateSelection }
                paginate={ true }
                paginationLimit={ 6 }
                paginationOptions={ {
                    showLessButtonLabel: t("common:showLess"),
                    showMoreButtonLabel: t("common:showMore")
                } }
                renderDisabledItemsAsGrayscale={ true }
                emptyPlaceholder={ placeholder }
                { ...additionalProps }
            />
        );
    };

    /**
     * Renders the template grid based on the passed in view.
     *
     * @param view - Render view.
     * @returns Template grids.
     */
    const renderTemplateGrids = (view: "CATEGORIZED" | "SEARCH_RESULTS"): ReactElement => {

        if (view === "CATEGORIZED") {
            return (
                <>
                    {
                        categorizedTemplates.map((category: ApplicationTemplateCategoryInterface, index: number) => (
                            <div key={ index } className="templates quick-start-templates">
                                {
                                    renderTemplateGrid(
                                        category.templates,
                                        {
                                            "data-testid": `${ category.id }-template-grid`,
                                            heading: category.displayName,
                                            showTagIcon: category.viewConfigs?.tags?.showTagIcon,
                                            showTags:  category.viewConfigs?.tags?.showTags,
                                            subHeading: category.description,
                                            tagSize: category.viewConfigs?.tags?.tagSize,
                                            tagsAs: category.viewConfigs?.tags?.as,
                                            tagsKey: category.viewConfigs?.tags?.tagsKey,
                                            tagsSectionTitle: category.viewConfigs?.tags?.sectionTitle
                                        },
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={ t("applications:templates.emptyPlaceholder." +
                                                    "title") }
                                            subtitle={ [ t("applications:templates." +
                                                    "emptyPlaceholder.subtitles") ] }
                                            data-testid={
                                                `${ testId }-quick-start-template-grid-empty-placeholder`
                                            }
                                        />
                                    )
                                }
                                <Divider hidden />
                            </div>
                        ))
                    }
                </>
            );
        }

        if (view === "SEARCH_RESULTS") {
            return (
                <div className="templates search-results">
                    {
                        renderTemplateGrid(
                            [],
                            {
                                "data-testid": `${ testId }-search-template-grid`
                            },
                            <Grid centered>
                                <Grid.Row>
                                    <Grid.Column>
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().emptySearch }
                                            imageSize="tiny"
                                            title="No results found"
                                            subtitle={ [ "We weren't able to find the type you" +
                                            " were looking for.", "Please try a different term or use one of" +
                                            " the following application types to create a new application." ] }
                                            data-testid={ `${ testId }-quick-start-template-grid-empty-
                                                    placeholder` }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>,
                            filteredTemplateList,
                            true
                        )
                    }
                </div>
            );
        }

        return null;
    };

    return (
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
            {
                (SHOW_TEMPLATE_SEARCH || SHOW_TEMPLATE_FILTER) && (
                    <>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    {
                                        SHOW_TEMPLATE_SEARCH && (
                                            <Input
                                                data-testid={ `${ testId }-search` }
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleTemplateSearch }
                                                placeholder="Search application type"
                                                floated="left"
                                                width={ 6 }
                                                style={ { width: "270px" } }
                                            />
                                        )
                                    }
                                    {
                                        SHOW_TEMPLATE_FILTER && (
                                            <Dropdown
                                                data-testid={ `${ testId }-sort` }
                                                className="floated right"
                                                placeholder="Select type"
                                                selection
                                                defaultValue="all"
                                                options={ templateFilterTypes }
                                                onChange={ handleTemplateTypeChange }
                                            />
                                        )
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider hidden />
                    </>
                )
            }
            {
                searchTriggered && filteredTemplateList
                    ? renderTemplateGrids("SEARCH_RESULTS")
                    : (
                        applicationTemplates && !isApplicationTemplateRequestLoading
                            ? renderTemplateGrids("CATEGORIZED")
                            : <ContentLoader dimmer/>

                    )
            }
            { showWizard && (
                <MinimalAppCreateWizard
                    title={ selectedTemplate?.name }
                    subTitle={ selectedTemplate?.description }
                    closeWizard={ (): void => setShowWizard(false) }
                    template={ selectedTemplate }
                    showHelpPanel={ true }
                    subTemplates={ selectedTemplate?.subTemplates }
                    subTemplatesSectionTitle={ selectedTemplate?.subTemplatesSectionTitle }
                    addProtocol={ false }
                    templateLoadingStrategy={
                        config.ui.applicationTemplateLoadingStrategy
                            ?? ApplicationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY
                    }
                />
            ) }
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
