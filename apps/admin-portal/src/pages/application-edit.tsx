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

import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import {
    AppAvatar,
    ContentLoader,
    Heading,
    Hint,
    Markdown,
    PageHeader,
    SelectionCard
} from "@wso2is/react-components";
import { AppConfig, history } from "../helpers";
import {
    AppConfigInterface,
    ApplicationEditFeaturesConfigInterface,
    ApplicationInterface,
    ApplicationSampleInterface,
    ApplicationSDKInterface,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface,
    emptyApplication,
    GithubRepoCategoryTypes
} from "../models";
import { ApplicationConstants, ApplicationManagementConstants, UIConstants } from "../constants";
import { Divider, Grid, SemanticICONS } from "semantic-ui-react";
import { HelpPanelTabInterface, InfoCard } from "@wso2is/react-components";
import { HelpSidebarIcons, TechnologyLogos } from "../configs";
import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { addAlert } from "@wso2is/core/store";
import { AppState } from "../store";
import { EditApplication } from "../components";
import { fetchFromURL } from "@wso2is/core/api";
import { getApplicationDetails } from "../api";
import { HelpPanelLayout } from "../layouts";
import { PageLayout } from "../layouts";
import { StringUtils } from "@wso2is/core/utils";
import { useTranslation } from "react-i18next";

/**
 * Application Edit page.
 *
 * @return {ReactElement}
 */
export const ApplicationEditPage: FunctionComponent<{}> = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const helpPanelDocURL = useSelector((state: AppState) => state.helpPanel.docURL);
    const helpPanelMetadata = useSelector((state: AppState) => state.helpPanel.metadata);

    const appConfig: AppConfigInterface = useContext(AppConfig);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ applicationTemplate, setApplicationTemplate ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);
    const [ permissions, setPermissions ] = useState<CRUDPermissionsInterface>(undefined);
    const [ features, setFeatures ] = useState<ApplicationEditFeaturesConfigInterface>(undefined);
    const [ helpSidebarVisibility, setHelpSidebarVisibility ] = useState<boolean>(false);
    const [ helpPanelDocContent, setHelpPanelDocContent ] = useState<string>(undefined);
    const [ helpPanelTabsActiveIndex, setHelpPanelTabsActiveIndex ] = useState<number>(0);
    const [ helpPanelSampleContent, setHelpPanelSampleContent ] = useState<string>(undefined);
    const [ selectedInboundProtocol, setSelectedInboundProtocol ] = useState<AuthProtocolMetaListItemInterface>(null);
    const [ helpPanelSelectedSample, setHelpPanelSelectedSample ] = useState<ApplicationSampleInterface>(undefined);
    const [
        isHelpPanelDocContentRequestLoading,
        setHelpPanelDocContentRequestLoadingStatus
    ] = useState<boolean>(false);
    const [
        isHelpPanelSamplesContentRequestLoading,
        setHelpPanelSamplesContentRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Called when help panel doc URL status changes.
     */
    useEffect(() => {
        if (!helpPanelDocURL) {
            return;
        }

        setHelpPanelDocContentRequestLoadingStatus(true);

        fetchFromURL<string>(helpPanelDocURL)
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

        fetchFromURL<string>(helpPanelSelectedSample.docs)
            .then((response) => {
                setHelpPanelSampleContent(response);
            })
            .finally(() => {
                setHelpPanelSamplesContentRequestLoadingStatus(false);
            });
    }, [ helpPanelSelectedSample ]);

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getApplication(id);
    }, []);

    /**
     * Called when the app config value changes.
     */
    useEffect(() => {
        if (!appConfig) {
            return;
        }

        setPermissions(_.get(appConfig, ApplicationManagementConstants.CRUD_PERMISSIONS_APP_CONFIG_KEY));
        setFeatures(_.get(appConfig, ApplicationManagementConstants.EDIT_FEATURES_APP_CONFIG_KEY));
    }, [ appConfig ]);

    /**
     * Retrieves application details from the API.
     *
     * @param {string} id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response) => {
                setApplication(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving application details",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
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
     * Handles the help panel toggle action.
     */
    const handleHelpPanelToggle = () => {
        setHelpSidebarVisibility(!helpSidebarVisibility);
    };

    /**
     * Handles help panel samples change event.
     *
     * @param sample - Selected sample.
     */
    const handleHelpPanelSelectedSample = (sample: any) => {
        setHelpPanelSelectedSample(sample);
    };

    /**
     * Handles sidebar mini item click event.
     *
     * @param {string} item - Clicked item.
     */
    const handleSidebarMiniItemClick = (item: string) => {
        helpPanelTabs.forEach((pane, index) => {
            if (pane.heading === item) {
                setHelpPanelTabsActiveIndex(index);
            }
        });
        setHelpSidebarVisibility(true);
    };

    /**
     * Filter application samples based on the template type.
     * @param {ApplicationSampleInterface[]} samples - List of Samples.
     * @return {ApplicationSampleInterface[]} Filtered list.
     */
    const filterSamples = (samples: ApplicationSampleInterface[]) => {
        if (applicationTemplate?.name) {
            return samples.filter((sample) =>
                sample?.repo?.category?.includes(applicationTemplate.name as GithubRepoCategoryTypes)
            );
        }

        return samples;
    };

    /**
     * Filter SDKs based on the template type.
     *
     * @param {ApplicationSDKInterface[]} sdks - List of SDKs.
     * @return {ApplicationSDKInterface[]} Filtered list.
     */
    const filterSDKs = (sdks: ApplicationSDKInterface[]) => {
        if (applicationTemplate?.name) {
            return sdks.filter((sdk) =>
                sdk?.category?.includes(applicationTemplate.name as GithubRepoCategoryTypes)
            );
        }

        return sdks;
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                isHelpPanelDocContentRequestLoading
                    ? <ContentLoader dimmer />
                    : (
                        <Markdown
                            source={ helpPanelDocContent }
                            transformImageUri={ (uri) =>
                                uri.startsWith("http" || "https")
                                    ? uri
                                    : UIConstants.HELP_PANEL_DOCS_ASSETS_URL_PREFIX +
                                    StringUtils.removeDotsAndSlashesFromRelativePath(uri)
                            }
                        />
                    )
            ),
            heading: t("common:docs"),
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
                                backButton={ {
                                    onClick: () => setHelpPanelSelectedSample(undefined),
                                    text: t("devPortal:components.applications.helpPanel.tabs.samples." +
                                        "content.sample.goBack")
                                } }
                                bottomMargin={ false }
                            />

                            <Heading as="h5">{ t("common:download") }</Heading>
                            <Hint>
                                { t("devPortal:components.applications.helpPanel.tabs.samples.content.sample.hint") }
                            </Hint>

                            <InfoCard
                                fluid
                                githubRepoCard={ true }
                                header={ helpPanelSelectedSample.repo.owner.login }
                                subHeader={ helpPanelSelectedSample.repo.name }
                                description={ helpPanelSelectedSample.repo.description }
                                image={ helpPanelSelectedSample.repo.owner.avatar }
                                tags={ helpPanelSelectedSample.repo.topics }
                                githubRepoMetaInfo={ {
                                    forks: helpPanelSelectedSample.repo.forks,
                                    stars: helpPanelSelectedSample.repo.stars,
                                    watchers: helpPanelSelectedSample.repo.watchers
                                } }
                                onClick={ () => window.open(helpPanelSelectedSample.repo.url) }
                            />
                            <Divider hidden/>
                            {
                                helpPanelSelectedSample?.docs && (
                                    <>
                                        <Divider horizontal>
                                            <Heading as="h5">
                                                { t("common:documentation") }
                                            </Heading>
                                        </Divider>
                                        <Divider hidden/>
                                        {
                                            isHelpPanelSamplesContentRequestLoading
                                                ? <ContentLoader dimmer/>
                                                : <Markdown source={ helpPanelSampleContent }/>
                                        }
                                    </>
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
                                        (helpPanelMetadata?.applications?.samples[ selectedInboundProtocol?.id ]
                                            && helpPanelMetadata.applications.samples[
                                                selectedInboundProtocol.id ] instanceof Array
                                            && helpPanelMetadata.applications.samples[
                                                selectedInboundProtocol.id ].length > 0)
                                            ? filterSamples(helpPanelMetadata.applications.samples[
                                                selectedInboundProtocol.id ]).map((sample, index) => (
                                                    <Grid.Column key={ index }>
                                                        <SelectionCard
                                                            size="auto"
                                                            header={ sample.displayName }
                                                            image={ TechnologyLogos[ sample.image ] }
                                                            imageSize="mini"
                                                            spaced="bottom"
                                                            onClick={ () => handleHelpPanelSelectedSample(sample) }
                                                        />
                                                    </Grid.Column>
                                            ))
                                            : null
                                    }
                                </Grid.Row>
                            </Grid>
                        </>
                    )
            ),
            heading: t("common:samples"),
            icon: "code" as SemanticICONS
        },
        {
            content: (
                <>
                    <Heading as="h4">
                        { t("devPortal:components.applications.helpPanel.tabs.samples.content.sdks.title") }
                    </Heading>
                    <Hint>
                        { t("devPortal:components.applications.helpPanel.tabs.samples.content.sdks.subTitle") }
                    </Hint>
                    <Divider hidden/>

                    <Grid>
                        <Grid.Row columns={ 2 }>
                            {
                                (helpPanelMetadata?.applications?.sdks[ selectedInboundProtocol?.id ]
                                    && helpPanelMetadata.applications.sdks[
                                        selectedInboundProtocol.id ]instanceof Array
                                    && helpPanelMetadata.applications.sdks[ selectedInboundProtocol.id ].length > 0)
                                    ? filterSDKs(helpPanelMetadata.applications.sdks[ selectedInboundProtocol.id ])
                                        .map((sdk, index) => (
                                            <Grid.Column key={ index }>
                                                <InfoCard
                                                    githubRepoCard={ true }
                                                    header={ sdk.owner.login }
                                                    subHeader={ sdk.name }
                                                    description={ sdk.description }
                                                    image={ sdk.owner.avatar }
                                                    tags={ sdk.topics }
                                                    githubRepoMetaInfo={ {
                                                        forks: sdk.forks,
                                                        language: sdk.language,
                                                        languageLogo: TechnologyLogos[ sdk.languageLogo ],
                                                        stars: sdk.stars,
                                                        watchers: sdk.watchers
                                                    } }
                                                    onClick={ () => window.open(sdk.url) }
                                                />
                                            </Grid.Column>
                                    ))
                                    : null
                            }
                        </Grid.Row>
                    </Grid>
                </>
            ),
            heading: t("common:sdks"),
            icon: "box" as SemanticICONS
        }
    ];

    return (
        <HelpPanelLayout
            actions={ [
                {
                    icon: HelpSidebarIcons.actionPanel.pin
                },
                {
                    icon: HelpSidebarIcons.actionPanel.close,
                    onClick: handleHelpPanelToggle
                }
            ] }
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            tabsActiveIndex={ helpPanelTabsActiveIndex }
            sidebarVisibility={ helpSidebarVisibility }
            onSidebarToggle={ handleHelpPanelToggle }
            onSidebarMiniItemClick={ handleSidebarMiniItemClick }
        >
            <PageLayout
                title={ application.name }
                contentTopMargin={ true }
                description={ application.description }
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
            >
                <EditApplication
                    application={ application }
                    features={ features }
                    isLoading={ isApplicationRequestLoading }
                    onDelete={ handleApplicationDelete }
                    onUpdate={ handleApplicationUpdate }
                    permissions={ permissions }
                    onInboundProtocolSelect={ setSelectedInboundProtocol }
                />
            </PageLayout>
        </HelpPanelLayout>
    );
};
