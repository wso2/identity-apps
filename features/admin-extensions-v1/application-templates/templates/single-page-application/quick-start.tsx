/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import AngularIcon from "./assets/angular-logo-icon.svg";
import BackboneIcon from "./assets/backbone-logo-icon.svg";
import JavaScriptLogo from "./assets/javascript-logo.svg";
import MeteorIcon from "./assets/meteor-logo-icon.svg";
import ReactLogo from "./assets/react-icon.svg";
import VueIcon from "./assets/vue-logo-icon.svg";
import { IntegrateSDKs } from "./integrate-sdks/integrate-sdks";
import { SupportedSPATechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import { getApplicationList } from "../../../../features/applications/api";
import {
    ApplicationInterface,
    ApplicationListInterface,
    ApplicationTemplateInterface,
    URLFragmentTypes
} from "../../../../features/applications/models";
import { history } from "../../../../features/core";
import { AppState } from "../../../../features/core/store";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, SPACustomConfiguration, SPATechnologySelection } from "../../shared/components";
import { SDKMeta } from "../../templates/single-page-application/meta";

/**
 * Prop types of the component.
 */
interface SinglePageApplicationQuickStartPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 9;
const PROTOCOL_TAB_INDEX: number = 2;
const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start content for the Single page application template.
 *
 * @param props - Props injected into the component.
 * @returns Quick start content for the Single page application template.
 */
const SinglePageApplicationQuickStart: FunctionComponent<SinglePageApplicationQuickStartPropsInterface> = (
    props: SinglePageApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        defaultTabIndex,
        inboundProtocolConfig,
        onApplicationUpdate,
        onTriggerTabUpdate,
        template,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);
    const [ selectedTechnology, setSelectedTechnology ] = useState<SupportedSPATechnologyTypes>(undefined);
    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);
    const isHelpPanelVisible: boolean = useSelector((state: AppState) => state.helpPanel.visibility);


    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response: ApplicationListInterface) => {
                setAppList(response);

            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplications." +
                        "genericError.message")
                }));
            });
    }, []);

    useEffect(() => {
        if (appList === undefined) {
            return;
        }

        if (!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            if (appList?.applications?.length > 1) {
                setSelectedIntegration(QuickStartModes.INTEGRATE);

                return;
            }
            setSelectedIntegration(QuickStartModes.SAMPLES);
        }
    }, [ appList ]);

    /**
     * Called when the URL fragment updates
     */
    useEffect(() => {

        if (!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const technologyType: string = (window.location.hash).split("&" + URLFragmentTypes.VIEW)[1].split("_")[1];

        if (SupportedSPATechnologyTypes.REACT.toLowerCase() == technologyType) {
            setSelectedTechnology(SupportedSPATechnologyTypes.REACT);
        } else if (SupportedSPATechnologyTypes.ANGULAR.toLowerCase() == technologyType) {
            setSelectedTechnology(SupportedSPATechnologyTypes.ANGULAR);
        } else if (SupportedSPATechnologyTypes.JAVASCRIPT.toLowerCase() == technologyType) {
            setSelectedTechnology(SupportedSPATechnologyTypes.JAVASCRIPT);
        } else {
            handleInvalidURL();
        }
    }, [ window.location.hash ]);

    /**
     * Handles invalid URL fragments
     */
    const handleInvalidURL = (): void => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ defaultTabIndex }`,
            pathname: window.location.pathname
        });

        setSelectedTechnology(undefined);
    };

    const handleIntegrateSelection = (selection: QuickStartModes): void => {
        setSelectedIntegration(selection);
    };

    const resolveQuickStartMode = (): ReactElement => {

        switch (selectedIntegration) {
            case QuickStartModes.INTEGRATE:
                return (
                    <IntegrateSDKs
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        inboundProtocolConfig={ inboundProtocolConfig }
                    />
                );
            case QuickStartModes.SAMPLES:
                return (
                    <TryoutSamples
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        onApplicationUpdate={ onApplicationUpdate }
                        inboundProtocolConfig={ inboundProtocolConfig }
                    />
                );
            default:
                return null;
        }
    };

    const resetTabState = () => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ QUICK_START_TAB_INDEX }`,
            pathname: window.location.pathname
        });

        setSelectedTechnology(undefined);
    };

    const resolveTechnologyLogo = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return ReactLogo;
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return JavaScriptLogo;
        }

        return null;
    };

    const resolveTechnologySelection = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-technology-selection-container` }>
                <SPATechnologySelection<SupportedSPATechnologyTypes>
                    technologies={ [
                        {
                            "data-componentid": "react",
                            displayName: SupportedSPATechnologyTypes.REACT,
                            logo: ReactLogo,
                            sampleAppURL: SDKMeta.react.samples.basicUsage.repository,
                            type: SupportedSPATechnologyTypes.REACT
                        },
                        {
                            "data-componentid": "javascript",
                            displayName: SupportedSPATechnologyTypes.JAVASCRIPT,
                            logo: JavaScriptLogo,
                            sampleAppURL: SDKMeta.javascript.samples.javascript.artifact,
                            type: SupportedSPATechnologyTypes.JAVASCRIPT
                        }
                    ] }
                    data-componentid={ `${ componentId }-technology-selection` }
                    onSelectedTechnologyChange={
                        (technology: SupportedSPATechnologyTypes) =>
                            setSelectedTechnology(technology)
                    }
                />
            </Grid.Row>
        );
    };

    const resolveCustomConfiguration = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-custom-configuration-container` }>
                <SPACustomConfiguration
                    onTriggerTabUpdate={ onTriggerTabUpdate }
                    infoTabIndex={ INFO_TAB_INDEX }
                    protocolTabIndex={ PROTOCOL_TAB_INDEX }
                    inboundProtocolConfig={ inboundProtocolConfig }
                    icons={ [
                        { techIcon: AngularIcon, techIconTitle: "Angular" },
                        { techIcon: VueIcon, techIconTitle: "Vue" },
                        { techIcon: MeteorIcon, techIconTitle: "Meteor" },
                        { techIcon: BackboneIcon, techIconTitle: "Backbone" }
                    ] }
                    data-componentid={ `${ componentId }-custom-configuration` }
                    documentationLink={
                        getLink(
                            "develop.applications.editApplication." +
                            "singlePageApplication.quickStart." +
                            "customConfig.learnMore"
                        )
                    }
                />
            </Grid.Row>
        );
    };

    return (
        <Grid data-componentid={ componentId } className="ml-0 mr-0">
            {
                !(selectedTechnology || (window.location.hash).includes(URLFragmentTypes.VIEW))
                    ? (
                        <>
                            <Grid.Row className="technology-selection-wrapper single-page-qsg">
                                <Grid.Column width={ 8 } className="custom-config-container p-5">
                                    { resolveCustomConfiguration() }
                                </Grid.Column>
                                <Grid.Column width={ 8 } className="p-5">
                                    { resolveTechnologySelection() }
                                </Grid.Column>
                            </Grid.Row>
                            <Divider className="or" vertical>
                                <Heading as="h5">OR</Heading>
                            </Divider>
                        </>
                    )
                    : (
                        <>
                            <Grid.Row>
                                <Grid.Column width={ isHelpPanelVisible ? 16 : 13 }>
                                    <QuickStartPanelOverview
                                        technology={ selectedTechnology }
                                        applicationType={ template.id }
                                        application={ application }
                                        inboundProtocols={ application?.inboundProtocols }
                                        onBackButtonClick={ () => resetTabState() }
                                        handleIntegrateSelection={ handleIntegrateSelection }
                                        technologyLogo={ resolveTechnologyLogo(selectedTechnology) }
                                        defaultTabIndex={ defaultTabIndex }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={ isHelpPanelVisible ? 16 : 13 }>
                                    { resolveQuickStartMode() }
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )
            }
        </Grid>
    );
};

/**
 * Default props for the component
 */
SinglePageApplicationQuickStart.defaultProps = {
    "data-componentid": "spa-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SinglePageApplicationQuickStart;
