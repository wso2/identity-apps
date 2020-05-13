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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { StringUtils } from "@wso2is/core/utils";
import {
    AppAvatar,
    ContentLoader,
    Heading,
    HelpPanelTabInterface,
    Hint,
    Markdown,
    PageHeader,
    SelectionCard
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Label, SemanticICONS } from "semantic-ui-react";
import { getApplicationDetails, getRawDocumentation, updateApplicationConfigurations } from "../../api";
import { EditApplication } from "../../components";
import { TechnologyLogos } from "../../configs";
import { ApplicationConstants, ApplicationManagementConstants, HelpPanelConstants, UIConstants } from "../../constants";
import { generateApplicationSamples, history } from "../../helpers";
import { HelpPanelLayout, PageLayout } from "../../layouts";
import {
    ApplicationInterface,
    ApplicationSampleInterface,
    ApplicationTemplateListItemInterface,
    FeatureConfigInterface,
    PortalDocumentationStructureInterface,
    emptyApplication
} from "../../models";
import { AppState } from "../../store";
import { setHelpPanelDocsContentURL } from "../../store/actions";
import { ApplicationManagementUtils } from "../../utils";

/**
 * Proptypes for the applications edit page component.
 */
type ApplicationEditPageInterface = TestableComponentInterface

/**
 * Application Edit page component.
 *
 * @param {ApplicationEditPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ApplicationEditPage: FunctionComponent<ApplicationEditPageInterface> = (
    props: ApplicationEditPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const helpPanelDocURL: string = useSelector((state: AppState) => state.helpPanel.docURL);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.features);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ applicationTemplateName, setApplicationTemplateName ] = useState<string>(undefined);
    const [ applicationTemplate, setApplicationTemplate ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);
    const [ helpPanelDocContent, setHelpPanelDocContent ] = useState<string>(undefined);
    const [ helpPanelSampleContent, setHelpPanelSampleContent ] = useState<string>(undefined);
    const [ helpPanelSelectedSample, setHelpPanelSelectedSample ] = useState<ApplicationSampleInterface>(undefined);
    const [ samplesTabBackButtonEnabled, setSamplesTabBackButtonEnabled ] = useState<boolean>(true);
    const [ samples, setSamples ] = useState<ApplicationSampleInterface[]>(undefined);
    const [
        isHelpPanelDocContentRequestLoading,
        setHelpPanelDocContentRequestLoadingStatus
    ] = useState<boolean>(false);
    const [
        isHelpPanelSamplesContentRequestLoading,
        setHelpPanelSamplesContentRequestLoadingStatus
    ] = useState<boolean>(false);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Fetch the application details on initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getApplication(id);
    }, []);

    /**
     * Push to 404 if application edit feature is disabled.
     */
    useEffect(() => {
        if (!featureConfig || !featureConfig.applications) {
            return;
        }

        if(!isFeatureEnabled(featureConfig.applications,
            ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT"))) {

            history.push(ApplicationConstants.PATHS.get("404"));
        }
    }, [ featureConfig ]);

    /**
     * Set the template once application templates list is available in redux.
     */
    useEffect(() => {
        if (applicationTemplates === undefined) {

            setApplicationTemplateRequestLoadingStatus(true);

            ApplicationManagementUtils.getApplicationTemplates()
                .finally(() => {
                    setApplicationTemplateRequestLoadingStatus(false);
                });

            return;
        }

        if (applicationTemplateName
            && !_.isEmpty(applicationTemplates)
            && applicationTemplates instanceof Array
            && applicationTemplates.length > 0) {

            setApplicationTemplate(applicationTemplates.find((template) => template.name === applicationTemplateName));
        }
    }, [ applicationTemplateName, applicationTemplates ]);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (!applicationTemplateName) {
            return;
        }

        const editApplicationDocs = _.get(helpPanelDocStructure, HelpPanelConstants.EDIT_APPLICATIONS_DOCS_KEY);

        if (!editApplicationDocs) {
            return;
        }

        dispatch(setHelpPanelDocsContentURL(editApplicationDocs[ HelpPanelConstants.APPLICATION_TEMPLATE_DOC_MAPPING
            .get(applicationTemplateName) ]));
    }, [ applicationTemplateName, helpPanelDocStructure ]);

    /**
     * Filter application samples based on the template type.
     */
    useEffect(() => {
        const samplesDocs = _.get(helpPanelDocStructure, HelpPanelConstants.APPLICATION_SAMPLES_DOCS_KEY);

        if (!samplesDocs) {
            return;
        }

        const samples = generateApplicationSamples(samplesDocs);

        if (samples instanceof Array && samples.length === 1) {
            setHelpPanelSelectedSample(samples[ 0 ]);
            setSamplesTabBackButtonEnabled(false);
        }

        setSamples(samples);
    }, [ helpPanelDocStructure ]);

    /**
     * Called when help panel doc URL status changes.
     */
    useEffect(() => {
        if (!helpPanelDocURL) {
            return;
        }

        setHelpPanelDocContentRequestLoadingStatus(true);

        getRawDocumentation<string>(helpPanelDocURL)
            .then((response) => {
                setHelpPanelDocContent(response);
            })
            .finally(() => {
                setHelpPanelDocContentRequestLoadingStatus(false);
            });
    }, [ helpPanelDocURL ]);

    /**
     * Called when the technology is changed in the samples section.
     */
    useEffect(() => {
        if (!helpPanelSelectedSample?.docs) {
            return;
        }

        setHelpPanelSamplesContentRequestLoadingStatus(true);

        getRawDocumentation<string>(helpPanelSelectedSample.docs)
            .then((response) => {
                setHelpPanelSampleContent(response);
            })
            .finally(() => {
                setHelpPanelSamplesContentRequestLoadingStatus(false);
            });
    }, [ helpPanelSelectedSample ]);

    /**
     * Remove template name if multiple protocols configured.
     */
    useEffect(() => {
        if (applicationTemplateName && (application?.inboundProtocols?.length > 1)) {
            updateApplicationConfigurations(application.id, { description: application.description })
                .then(() => {
                    handleApplicationUpdate(application.id)
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("devPortal:components.applications.notifications.updateApplication" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("devPortal:components.applications.notifications.updateApplication" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.updateApplication" +
                            ".genericError.message")
                    }));
                })
        }

    }, [applicationTemplateName, application]);

    /**
     * Retrieves application details from the API.
     *
     * @param {string} id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response: ApplicationInterface) => {

                const [
                    templateName,
                    description
                ] = ApplicationManagementUtils.resolveApplicationTemplateNameInDescription(response.description);

                setApplicationTemplateName(templateName);

                setApplication({
                    ...response,
                    description
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchApplication.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchApplication.genericError.message")
                }));
            })
            .finally(() => {
                setApplicationRequestLoading(false);
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
    };

    /**
     * Called when an application is deleted.
     */
    const handleApplicationDelete = (): void => {
        history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
    };

    /**
     * Called when an application updates.
     *
     * @param {string} id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        getApplication(id);
    };

    /**
     * Handles help panel samples change event.
     *
     * @param sample - Selected sample.
     */
    const handleHelpPanelSelectedSample = (sample: any) => {
        setHelpPanelSelectedSample(sample);
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                isHelpPanelDocContentRequestLoading
                    ? <ContentLoader dimmer/>
                    : (
                        <Markdown
                            source={ helpPanelDocContent }
                            transformImageUri={ (uri) =>
                                uri.startsWith("http" || "https")
                                    ? uri
                                    : UIConstants.HELP_PANEL_DOCS_ASSETS_URL_PREFIX +
                                    StringUtils.removeDotsAndSlashesFromRelativePath(uri)
                            }
                            data-testid={ `${ testId }-help-panel-docs-tab-markdown-renderer` }
                        />
                    )
            ),
            heading: t("common:docs"),
            hidden: !helpPanelDocURL,
            icon: "file alternate outline" as SemanticICONS
        },
        {
            content: (
                helpPanelSelectedSample
                    ? (
                        <>
                            <PageHeader
                                title={ `${ helpPanelSelectedSample.displayName } Sample` }
                                titleAs="h4"
                                backButton={ samplesTabBackButtonEnabled && {
                                    onClick: () => setHelpPanelSelectedSample(undefined),
                                    text: t("devPortal:components.applications.helpPanel.tabs.samples." +
                                        "content.sample.goBack")
                                } }
                                bottomMargin={ false }
                                data-testid={ `${ testId }-help-panel-samples-tab-page-header` }
                            />
                            <Divider hidden/>
                            {
                                helpPanelSelectedSample?.docs && (
                                    isHelpPanelSamplesContentRequestLoading
                                        ? <ContentLoader dimmer/>
                                        : (
                                            <Markdown
                                                source={ helpPanelSampleContent }
                                                data-testid={ `${ testId }-help-panel-samples-tab-markdown-renderer` }
                                            />
                                        )
                                )
                            }
                        </>
                    )
                    : (
                        <>
                            <Heading as="h4">
                                { t("devPortal:components.applications.helpPanel.tabs.samples.content." +
                                    "technology.title") }
                            </Heading>
                            <Hint>
                                { t("devPortal:components.applications.helpPanel.tabs.samples.content." +
                                    "technology.subTitle") }
                            </Hint>
                            <Divider hidden/>

                            <Grid>
                                <Grid.Row columns={ 4 }>
                                    {
                                        samples && samples.map((sample, index) => (
                                            <Grid.Column key={ index }>
                                                <SelectionCard
                                                    size="auto"
                                                    header={ sample.displayName }
                                                    image={ TechnologyLogos[ sample.image ] }
                                                    imageSize="mini"
                                                    spaced="bottom"
                                                    onClick={ () => handleHelpPanelSelectedSample(sample) }
                                                    data-testid={ `${ testId }-help-panel-samples-tab-selection-card` }
                                                />
                                            </Grid.Column>
                                        ))
                                    }
                                </Grid.Row>
                            </Grid>
                        </>
                    )
            ),
            heading: t("common:samples"),
            hidden: !samples || (samples instanceof Array && samples.length < 1),
            icon: "code" as SemanticICONS
        }
    ];

    return (
        <HelpPanelLayout
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
        >
            <PageLayout
                isLoading={ isApplicationRequestLoading }
                title={ application.name }
                contentTopMargin={ true }
                description={ (
                    <div className="with-label ellipsis">
                        { applicationTemplate?.name && <Label size="small">{ applicationTemplate.name }</Label> }
                        { application.description }
                    </div>
                ) }
                image={ (
                    <AppAvatar
                        name={ application.name }
                        image={ application.imageUrl }
                        size="tiny"
                        spaced="right"
                    />
                ) }
                backButton={ {
                    onClick: handleBackButtonClick,
                    text: t("devPortal:pages.applicationsEdit.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-testid={ `${ testId }-page-layout` }
            >
                <EditApplication
                    application={ application }
                    featureConfig={ featureConfig }
                    isLoading={ isApplicationRequestLoading }
                    onDelete={ handleApplicationDelete }
                    onUpdate={ handleApplicationUpdate }
                    template={ applicationTemplate }
                    data-testid={ testId }
                />
            </PageLayout>
        </HelpPanelLayout>
    );
};

/**
 * Default proptypes for the application edit page component.
 */
ApplicationEditPage.defaultProps = {
    "data-testid": "application-edit"
};
