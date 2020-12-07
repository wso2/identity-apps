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
    HelpPanelLayout,
    HelpPanelTabInterface,
    LabelWithPopup,
    PageLayout
} from "@wso2is/react-components";
import get from "lodash/get";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Label } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    DocPanelUICardInterface,
    FeatureConfigInterface,
    HelpPanelUtils,
    PortalDocumentationStructureInterface,
    getHelpPanelActionIcons,
    history,
    setHelpPanelDocsContentURL,
    toggleHelpPanelVisibility
} from "../../core";
import { getApplicationDetails, updateApplicationConfigurations } from "../api";
import { EditApplication, HelpPanelOverview } from "../components";
import { getHelpPanelIcons } from "../configs";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationAccessTypes,
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    State,
    SupportedAuthProtocolTypes,
    emptyApplication
} from "../models";
import { ApplicationManagementUtils } from "../utils";

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

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const helpPanelDocURL: string = useSelector((state: AppState) => state.helpPanel.docURL);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const helpPanelVisibilityGlobalState: boolean = useSelector((state: AppState) => state.helpPanel.visibility);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
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
    const [ isExtensionsAvailable, setIsExtensionsAvailable ] = useState<boolean>(false);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(0);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>(undefined);
    const [ inboundProtocolConfigs, setInboundProtocolConfigs ] = useState<object>(undefined);

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

            history.push(AppConstants.getPaths().get("PAGE_NOT_FOUND"));
        }
    }, [ featureConfig ]);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (!applicationTemplate) {
            return;
        }

        const editApplicationDocs = get(helpPanelDocStructure,
            ApplicationManagementConstants.EDIT_APPLICATIONS_DOCS_KEY);

        if (!editApplicationDocs) {
            return;
        }

        dispatch(
            setHelpPanelDocsContentURL(editApplicationDocs[
                ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
                    .get(applicationTemplate.id) ]?.[ApplicationManagementConstants.APPLICATION_DOCS_OVERVIEW])
        );
    }, [ applicationTemplate, helpPanelDocStructure ]);

    /**
     * Filter application samples based on the template type.
     */
    useEffect(() => {
        if (!applicationTemplate) {
            return;
        }
        const mappedKey = ApplicationManagementConstants.APPLICATION_TEMPLATE_DOC_MAPPING
            .get(applicationTemplate.id);

        const samplesDocs = get(helpPanelDocStructure, ApplicationManagementUtils.getSampleDocsKey(mappedKey));
        const SDKDocs = get(helpPanelDocStructure, ApplicationManagementUtils.getSDKDocsKey(mappedKey));
        const configDocs = get(helpPanelDocStructure, ApplicationManagementUtils.getConfigDocsKey(mappedKey));

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
    }, [ applicationTemplate, helpPanelDocStructure ]);

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
        if (applicationTemplate && (application?.inboundProtocols?.length > 1)) {
            updateApplicationConfigurations(application.id, { templateId: "" })
                .then(() => {
                    handleApplicationUpdate(application.id);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.updateApplication" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.applications.notifications.updateApplication" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateApplication" +
                            ".genericError.message")
                    }));
                });
        }

    }, [ applicationTemplate, application ]);

    /**
     * Triggered when the application state search param in the URL changes.
     * TODO: IMPORTANT - Refactor this code.
     */
    useEffect(() => {
        if (!urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY)) {
            if (isExtensionsAvailable) {
                setDefaultActiveIndex(1);
            }

            return;
        }

        if (urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY)
            === ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_VALUE && isExtensionsAvailable) {

            setDefaultActiveIndex(0);

            if (helpPanelVisibilityGlobalState) {
                dispatch(toggleHelpPanelVisibility(false));
            }

            return;
        }

        if (urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY)
            === ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_VALUE && !HelpPanelUtils.isPanelPinned()) {

            toggleHelpPanelVisibility(true);
        }
    }, [ urlSearchParams.get(ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY), isExtensionsAvailable ]);

    /**
     * Retrieves application details from the API.
     *
     * @param {string} id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response: ApplicationInterface) => {

                const template = applicationTemplates
                    && applicationTemplates instanceof Array
                    && applicationTemplates.length > 0
                    && applicationTemplates.find((template) => template.id === response.templateId);

                setApplicationTemplate(template);
                setApplication(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchApplication.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplication.genericError." +
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
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * Called when an application is deleted.
     */
    const handleApplicationDelete = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
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
                    applicationType={ applicationTemplate?.name }
                    inboundProtocols={ application?.inboundProtocols }
                    handleTabChange={ handleTabChange }
                />
                ),
            //heading: t("console:develop.features.applications.helpPanel.tabs.start.heading"),
            heading: "Server Endpoints",
            hidden: application?.inboundProtocols?.length <= 0,
            icon: {
                icon: getHelpPanelIcons().tabs.guide
            }
        }
        // TODO : Should be removed after getting started flow is implemented.
        /*{
            content: (
                helpPanelSelectedProtocol
                    ? (
                        <>
                            <PageHeader
                                title={ `${ helpPanelSelectedProtocol.displayName } Configurations` }
                                titleAs="h4"
                                backButton={ samplesTabBackButtonEnabled && {
                                    onClick: () => setHelpPanelSelectedProtocol(undefined),
                                    text: t("console:develop.features.applications.helpPanel.tabs.samples." +
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
                                { t("console:develop.features.applications.helpPanel.tabs.configs.content." +
                                    "title") }
                            </Heading>
                            <Hint>
                                { t("console:develop.features.applications.helpPanel.tabs.configs.content." +
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
                                                    image={ getInboundProtocolLogos()[ configs.image ] }
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
            heading: t("console:develop.features.applications.helpPanel.tabs.configs.heading"),
            hidden: !configs || (configs instanceof Array && configs.length < 1),
            icon: {
                icon: getHelpPanelIcons().tabs.guide
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
                                    text: t("console:develop.features.applications.helpPanel.tabs.samples." +
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
                                { t("console:develop.features.applications.helpPanel.tabs.samples.content." +
                                    "sample.title") }
                            </Heading>
                            <Hint>
                                { t("console:develop.features.applications.helpPanel.tabs.samples.content." +
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
                                                    image={ getTechnologyLogos[ sample.image ] }
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
                icon: getHelpPanelIcons().tabs.samples
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
                                    text: t("console:develop.features.applications.helpPanel.tabs.sdks." +
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
                                { t("console:develop.features.applications.helpPanel.tabs.sdks.content." +
                                    "sdk.title") }
                            </Heading>
                            <Hint>
                                { t("console:develop.features.applications.helpPanel.tabs.sdks.content." +
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
                                                    image={ getTechnologyLogos[ sdk.image ] }
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
                icon: getHelpPanelIcons().tabs.sdks
            }
        }*/
    ];

    /**
     * Resolves the application status label.
     * @return {ReactElement}
     */
    const resolveApplicationStatusLabel = (): ReactElement => {

        if (!inboundProtocolList || !inboundProtocolConfigs) {
            return null;
        }

        if (inboundProtocolList.length === 0) {
            
            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.applications.popups.appStatus.notConfigured.header") }
                    popupSubHeader={ t("console:develop.features.applications.popups.appStatus.notConfigured.content") }
                    labelColor="yellow"
                />
            );
        }

        if (inboundProtocolList.length === 1
            && inboundProtocolList.includes(SupportedAuthProtocolTypes.OIDC)
            && inboundProtocolConfigs
            && inboundProtocolConfigs[ SupportedAuthProtocolTypes.OIDC ]) {

            if (inboundProtocolConfigs[ SupportedAuthProtocolTypes.OIDC ].state === State.REVOKED) {

                return (
                    <LabelWithPopup
                        popupHeader={ t("console:develop.features.applications.popups.appStatus.revoked.header") }
                        popupSubHeader={ t("console:develop.features.applications.popups.appStatus.revoked.content") }
                        labelColor="grey"
                    />
                );
            }
        }

        return (
            <LabelWithPopup
                popupHeader={ t("console:develop.features.applications.popups.appStatus.active.header") }
                popupSubHeader={ t("console:develop.features.applications.popups.appStatus.active.content") }
                labelColor="green"
            />
        );
    };

    /**
     * Returns if the application is readonly or not by evaluating the `readOnly` attribute in
     * URL and the `access` attribute in application info response.
     *
     * @return {boolean} If an application is Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {

        return urlSearchParams.get(ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY) === "true"
            || application.access === ApplicationAccessTypes.READ;
    };

    return (
        <HelpPanelLayout
            activeIndex={ tabsActiveIndex }
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ {
                close: getHelpPanelActionIcons().close,
                pin: getHelpPanelActionIcons().pin
            } }
            sidebarToggleTooltip={ t("console:develop.features.helpPanel.actions.open") }
            pinButtonTooltip={ t("console:develop.features.helpPanel.actions.pin") }
            unpinButtonTooltip={ t("console:develop.features.helpPanel.actions.unPin") }
            onHelpPanelVisibilityChange={ (isVisible: boolean) => dispatch(toggleHelpPanelVisibility(isVisible)) }
            visible={ helpPanelVisibilityGlobalState }
        >
            <PageLayout
                isLoading={ isApplicationRequestLoading }
                title={ (
                    <>
                        <span>{ application.name }</span>
                        { resolveApplicationStatusLabel() }
                    </>
                ) }
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
                    "data-testid": `${ testId }-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.applicationsEdit.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-testid={ `${ testId }-page-layout` }
            >
                <EditApplication
                    application={ application }
                    defaultActiveIndex={ defaultActiveIndex }
                    featureConfig={ featureConfig }
                    isLoading={ isApplicationRequestLoading }
                    onDelete={ handleApplicationDelete }
                    onUpdate={ handleApplicationUpdate }
                    template={ applicationTemplate }
                    data-testid={ testId }
                    isTabExtensionsAvailable={ (isAvailable) => setIsExtensionsAvailable(isAvailable) }
                    urlSearchParams={ urlSearchParams }
                    getConfiguredInboundProtocolsList={ (list: string[]) => {
                        setInboundProtocolList(list);
                    } }
                    getConfiguredInboundProtocolConfigs={ (configs: object) => {
                        setInboundProtocolConfigs(configs);
                    } }
                    readOnly={ resolveReadOnlyState() }
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
