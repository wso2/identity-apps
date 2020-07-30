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

import { getRawDocumentation } from "@wso2is/core/api";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ContentLoader,
    Heading,
    HelpPanelLayout,
    HelpPanelTabInterface,
    Hint,
    Markdown,
    PageHeader,
    PageLayout,
    SelectionCard
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Divider, Grid, Label } from "semantic-ui-react";
import { getApplicationDetails, updateApplicationConfigurations } from "../../api";
import { EditApplication } from "../../components";
import { HelpPanelOverview } from "../../components/applications";
import { SamplesGuideComponent } from "../../components/applications/help-panel";
import { HelpPanelIcons, HelpSidebarIcons, InboundProtocolLogos, TechnologyLogos } from "../../configs";
import { AppConstants, ApplicationManagementConstants } from "../../constants";
import { history } from "../../helpers";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    ConfigReducerStateInterface,
    DocPanelUICardInterface,
    FeatureConfigInterface,
    PortalDocumentationStructureInterface,
    emptyApplication
} from "../../models";
import { AppState } from "../../store";
import { setHelpPanelDocsContentURL } from "../../store/actions";
import { ApplicationManagementUtils, HelpPanelUtils } from "../../utils";

/**
 * Proptypes for the applications edit page component.
 */
interface ApplicationEditPageInterface extends TestableComponentInterface, RouteComponentProps { }

/**
 * Application Edit page component.
 *
 * @param {ApplicationEditPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ApplicationEditPage: FunctionComponent<ApplicationEditPageInterface> = (
    props: ApplicationEditPageInterface
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const urlSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const helpPanelDocURL: string = useSelector((state: AppState) => state.helpPanel.docURL);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ applicationTemplateName, setApplicationTemplateName ] = useState<string>(undefined);
    const [ applicationTemplate, setApplicationTemplate ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);
    const [ helpPanelDocContent, setHelpPanelDocContent ] = useState<string>(undefined);
    const [ helpPanelSampleContent, setHelpPanelSampleContent ] = useState<string>(undefined);
    const [ helpPanelSDKContent, setHelpPanelSDKContent ] = useState<string>(undefined);
    const [ helpPanelConfigContent, setHelpPanelConfigContent ] = useState<string>(undefined);
    const [ helpPanelSelectedSample, setHelpPanelSelectedSample ] = useState<DocPanelUICardInterface>(undefined);
    const [ helpPanelSelectedSDK, setHelpPanelSelectedSDK ] = useState<DocPanelUICardInterface>(undefined);
    const [
        helpPanelSelectedProtocol, setHelpPanelSelectedProtocol
    ] = useState<DocPanelUICardInterface>(undefined);
    const [ samplesTabBackButtonEnabled, setSamplesTabBackButtonEnabled ] = useState<boolean>(true);
    const [ samples, setSamples ] = useState<DocPanelUICardInterface[]>(undefined);
    const [ sdks, setSDKS ] = useState<DocPanelUICardInterface[]>(undefined);
    const [ configs, setConfigs ] = useState<DocPanelUICardInterface[]>(undefined);
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
    const [ tabsActiveIndex, setTabsActiveIndex ] = useState<number>(0);
    const [ triggerSidebarOpen, setTriggerSidebarOpen ] = useState<boolean>(false);
    const [ triggerSidebarClose, setTriggerSidebarClose ] = useState<boolean>(false);
    const [ isExtensionsAvailable, setIsExtensionsAvailable ] = useState<boolean>(false);

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

            history.push(AppConstants.PATHS.get("PAGE_NOT_FOUND"));
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

            setApplicationTemplate(applicationTemplates.find(
                (template) => template.name === applicationTemplateName));
        }
    }, [ applicationTemplateName, applicationTemplates ]);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (!applicationTemplateName) {
            return;
        }

        const editApplicationDocs = _.get(helpPanelDocStructure,
            ApplicationManagementConstants.EDIT_APPLICATIONS_DOCS_KEY);

        if (!editApplicationDocs) {
            return;
        }

        dispatch(setHelpPanelDocsContentURL(editApplicationDocs[
            ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
            .get(applicationTemplateName) ]?.[ApplicationManagementConstants.APPLICATION_DOCS_OVERVIEW]));
    }, [ applicationTemplateName, helpPanelDocStructure ]);

    /**
     * Filter application samples based on the template type.
     */
    useEffect(() => {
        if (!applicationTemplateName) {
            return;
        }
        const templateName = ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
            .get(applicationTemplateName);

        const samplesDocs = _.get(helpPanelDocStructure, ApplicationManagementUtils.getSampleDocsKey(templateName));
        const SDKDocs = _.get(helpPanelDocStructure, ApplicationManagementUtils.getSDKDocsKey(templateName));
        const configDocs = _.get(helpPanelDocStructure, ApplicationManagementUtils.getConfigDocsKey(templateName));

        if (!samplesDocs) {
            return;
        }

        const samples: DocPanelUICardInterface[] = ApplicationManagementUtils.generateSamplesAndSDKDocs(samplesDocs);
        const sdks: DocPanelUICardInterface[] = ApplicationManagementUtils.generateSamplesAndSDKDocs(SDKDocs);
        const configs: DocPanelUICardInterface[] = ApplicationManagementUtils.generateSamplesAndSDKDocs(configDocs);

        if (samples instanceof Array && samples.length === 1) {
            setHelpPanelSelectedSample(samples[ 0 ]);
            setSamplesTabBackButtonEnabled(false);
        }

        if (sdks instanceof Array && sdks.length === 1) {
            setHelpPanelSelectedSDK(sdks[ 0 ]);
            setSamplesTabBackButtonEnabled(false);
        }

        if (configs instanceof Array && configs.length === 1) {
            setHelpPanelSelectedProtocol(configs[ 0 ]);
            setSamplesTabBackButtonEnabled(false);
        }

        setSDKS(sdks.filter((item) => item.name !== "overview"));
        setSamples(samples.filter((item) => item.name !== "overview"));
        setConfigs(configs.filter((item) => item.name !== "overview"));
    }, [ applicationTemplateName, helpPanelDocStructure ]);

    /**
     * Called when help panel doc URL status changes.
     */
    useEffect(() => {
        if (!helpPanelDocURL) {
            return;
        }

        setHelpPanelDocContentRequestLoadingStatus(true);

        getRawDocumentation<string>(
            config?.endpoints?.documentationContent,
            helpPanelDocURL,
            config?.deployment?.documentation?.provider,
            config?.deployment?.documentation?.githubOptions?.branch)
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

        getRawDocumentation<string>(
            config.endpoints.documentationContent,
            helpPanelSelectedSample.docs,
            config.deployment.documentation.provider,
            config.deployment.documentation.githubOptions.branch)
            .then((response) => {
                setHelpPanelSampleContent(response);
            })
            .finally(() => {
                setHelpPanelSamplesContentRequestLoadingStatus(false);
            });
    },[
        helpPanelSelectedSample,
        config.deployment.documentation.githubOptions.branch,
        config.deployment.documentation.provider,
        config.endpoints.documentationContent
    ]);

    /**
     * Called when the technology is changed in the SDK section.
     */
    useEffect(() => {
        if (!helpPanelSelectedSDK?.docs) {
            return;
        }

        setHelpPanelSamplesContentRequestLoadingStatus(true);

        getRawDocumentation<string>(
            config.endpoints.documentationContent,
            helpPanelSelectedSDK.docs,
            config.deployment.documentation.provider,
            config.deployment.documentation.githubOptions.branch)
            .then((response) => {
                setHelpPanelSDKContent(response);
            })
            .finally(() => {
                setHelpPanelSamplesContentRequestLoadingStatus(false);
            });
    },[
        helpPanelSelectedSDK,
        config.deployment.documentation.githubOptions.branch,
        config.deployment.documentation.provider,
        config.endpoints.documentationContent
    ]);

    /**
     * Called when the technology is changed in the Configurations section.
     */
    useEffect(() => {
        if (!helpPanelSelectedProtocol?.docs) {
            return;
        }

        setHelpPanelSamplesContentRequestLoadingStatus(true);

        getRawDocumentation<string>(
            config.endpoints.documentationContent,
            helpPanelSelectedProtocol.docs,
            config.deployment.documentation.provider,
            config.deployment.documentation.githubOptions.branch)
            .then((response) => {
                setHelpPanelConfigContent(response);
            })
            .finally(() => {
                setHelpPanelSamplesContentRequestLoadingStatus(false);
            });
    },[
        helpPanelSelectedProtocol,
        config.deployment.documentation.githubOptions.branch,
        config.deployment.documentation.provider,
        config.endpoints.documentationContent
    ]);

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
     * Triggered when the application state search param in the URL changes. 
     */
    useEffect(() => {
        if (!urlSearchParams.get("state") || isExtensionsAvailable) {
            setTriggerSidebarClose(true);
            return;
        }

       
        if (urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY)
            === ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_VALUE && !HelpPanelUtils.isPanelPinned()) {

            setTriggerSidebarOpen(true);
        }
    }, [ urlSearchParams.get("state"), isExtensionsAvailable ]);

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
                    message: t("devPortal:components.applications.notifications.fetchApplication.genericError." +
                        "message")
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
        history.push(AppConstants.PATHS.get("APPLICATIONS"));
    };

    /**
     * Called when an application is deleted.
     */
    const handleApplicationDelete = (): void => {
        history.push(AppConstants.PATHS.get("APPLICATIONS"));
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
     * Handles help panel sample change event.
     *
     * @param sample - Selected sample.
     */
    const handleHelpPanelSelectedSample = (sample: any) => {
        setHelpPanelSelectedSample(sample);
    };

    /**
     * Handles help panel SDK change event.
     *
     * @param sdk - Selected SDK.
     */
    const handleHelpPanelSelectedSDK = (sdk: any) => {
        setHelpPanelSelectedSDK(sdk);
    };

    /**
     * Handles help panel Protocol change event.
     *
     * @param protocol - Selected Protool.
     */
    const handleHelpPanelSelectedProtocol = (protocol: any) => {
        setHelpPanelSelectedProtocol(protocol);
    };

    /**
     * Handles the tab change from overview.
     *
     * @param tabId - number
     */
    const handleTabChange = (tabId: number): void => {
        setTabsActiveIndex(tabId);
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                <HelpPanelOverview
                    applicationType={ applicationTemplateName }
                    inboundProtocols={ application?.inboundProtocols }
                    handleTabChange={ handleTabChange }
                />
                ),
            heading: t("devPortal:components.applications.helpPanel.tabs.start.heading"),
            hidden: application?.inboundProtocols?.length <= 0,
            icon: {
                icon: HelpPanelIcons.tabs.whatsNext
            }
        },
        {
            content: (
                helpPanelSelectedProtocol
                    ? (
                        <>
                            <PageHeader
                                title={ `${ helpPanelSelectedProtocol.displayName } Configurations` }
                                titleAs="h4"
                                backButton={ samplesTabBackButtonEnabled && {
                                    onClick: () => setHelpPanelSelectedProtocol(undefined),
                                    text: t("devPortal:components.applications.helpPanel.tabs.samples." +
                                        "content.sample.goBack")
                                } }
                                bottomMargin={ false }
                                data-testid={ `${ testId }-help-panel-samples-tab-page-header` }
                            />
                            <Divider hidden/>
                            {
                                helpPanelSelectedProtocol?.docs && (
                                    isHelpPanelSamplesContentRequestLoading
                                        ? <ContentLoader dimmer/>
                                        : (
                                            <Markdown
                                                source={ helpPanelConfigContent }
                                                data-testid={ `${ testId }-help-panel-configs-tab-markdown-renderer` }
                                            />
                                        )
                                )
                            }
                        </>
                    )
                    : (
                        <>
                            <Heading as="h4">
                                { t("devPortal:components.applications.helpPanel.tabs.configs.content." +
                                    "title") }
                            </Heading>
                            <Hint>
                                { t("devPortal:components.applications.helpPanel.tabs.configs.content." +
                                    "subTitle") }
                            </Hint>
                            <Divider hidden/>

                            <Grid>
                                <Grid.Row columns={ 4 }>
                                    {
                                        configs && configs.map((configs, index) => (
                                            <Grid.Column key={ index }>
                                                <SelectionCard
                                                    size="auto"
                                                    header={ configs.displayName }
                                                    image={ InboundProtocolLogos[ configs.image ] }
                                                    imageSize="mini"
                                                    spaced="bottom"
                                                    onClick={ () => handleHelpPanelSelectedProtocol(configs) }
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
            heading: t("devPortal:components.applications.helpPanel.tabs.configs.heading"),
            hidden: !configs || (configs instanceof Array && configs.length < 1),
            icon: {
                icon: HelpPanelIcons.tabs.guide
            }
        },
        {
            content: (
                helpPanelSelectedSample
                    ? (
                        <>
                            <PageHeader
                                title={ `${ helpPanelSelectedSample.displayName } Sample Application` }
                                titleAs="h1"
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
                                            <SamplesGuideComponent
                                                sampleType={ helpPanelSelectedSample.name }
                                                application={ application }
                                                markDownSource={ helpPanelSampleContent }
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
                                    "sample.title") }
                            </Heading>
                            <Hint>
                                { t("devPortal:components.applications.helpPanel.tabs.samples.content." +
                                    "sample.subTitle") }
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
            icon: {
                icon: HelpPanelIcons.tabs.samples
            }
        },
        {
            content: (
                helpPanelSelectedSDK
                    ? (
                        <>
                            <PageHeader
                                title={ `${ helpPanelSelectedSDK.displayName } SDK` }
                                titleAs="h4"
                                backButton={ samplesTabBackButtonEnabled && {
                                    onClick: () => setHelpPanelSelectedSDK(undefined),
                                    text: t("devPortal:components.applications.helpPanel.tabs.sdks." +
                                        "content.sdk.goBack")
                                } }
                                bottomMargin={ false }
                                data-testid={ `${ testId }-help-panel-samples-tab-page-header` }
                            />
                            <Divider hidden/>
                            {
                                helpPanelSelectedSDK?.docs && (
                                    isHelpPanelSamplesContentRequestLoading
                                        ? <ContentLoader dimmer/>
                                        : (
                                            <Markdown
                                                source={ helpPanelSDKContent }
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
                                { t("devPortal:components.applications.helpPanel.tabs.sdks.content." +
                                    "sdk.title") }
                            </Heading>
                            <Hint>
                                { t("devPortal:components.applications.helpPanel.tabs.sdks.content." +
                                    "sdk.subTitle") }
                            </Hint>
                            <Divider hidden/>

                            <Grid>
                                <Grid.Row columns={ 4 }>
                                    {
                                        sdks && sdks.map((sdk, index) => (
                                            <Grid.Column key={ index }>
                                                <SelectionCard
                                                    size="auto"
                                                    header={ sdk.displayName }
                                                    image={ TechnologyLogos[ sdk.image ] }
                                                    imageSize="mini"
                                                    spaced="bottom"
                                                    onClick={ () => handleHelpPanelSelectedSDK(sdk) }
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
            heading: t("common:sdks"),
            hidden: !sdks || (sdks instanceof Array && sdks.length < 1),
            icon: {
                icon: HelpPanelIcons.tabs.sdks
            }
        }
    ];

    return (
        <HelpPanelLayout
            activeIndex={ tabsActiveIndex }
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ HelpSidebarIcons.actionPanel }
            sidebarToggleTooltip={ t("devPortal:components.helpPanel.actions.open") }
            pinButtonTooltip={ t("devPortal:components.helpPanel.actions.pin") }
            unPinButtonTooltip={ t("devPortal:components.helpPanel.actions.unPin") }
            triggerSidebarOpen={ triggerSidebarOpen }
            triggerSidebarClose={ triggerSidebarClose }
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
                image={
                    application.imageUrl
                        ? (
                            <AppAvatar
                                name={ application.name }
                                image={ application.imageUrl }
                                size="tiny"
                                spaced="right"
                            />
                        )
                        : (
                            <AnimatedAvatar
                                name={ application.name }
                                size="tiny"
                                floated="left"
                            />
                        )
                }
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
                    isTabExtensionsAvailable={ (isAvailable) => setIsExtensionsAvailable(isAvailable) }
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

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationEditPage;
