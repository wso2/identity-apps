/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import AngularLogo from "./assets/angular-logo.svg";
import AureliaIcon from "./assets/aurelia-logo-icon.svg";
import BackboneIcon from "./assets/backbone-logo-icon.svg";
import EmberIcon from "./assets/ember-logo-icon.svg";
import JavaScriptLogo from "./assets/javascript-logo.svg";
import MeteorIcon from "./assets/meteor-logo-icon.svg";
import PolymerIcon from "./assets/polymer-logo-icon.svg";
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
import { EventPublisher } from "../../../../features/core/utils";
import { QuickStartModes } from "../../shared";
import { QuickStartPanelOverview, TechnologySelection } from "../../shared/components";
import { SupportedTechnologyArray } from "../../shared/components/supported-technology-array";

/**
 * Prop types of the component.
 */
interface SinglePageApplicationQuickStartPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 6;
const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start content for the Single page application template.
 *
 * @param {SinglePageApplicationQuickStartPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
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
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);
    const [ selectedTechnology, setSelectedTechnology ] = useState<SupportedSPATechnologyTypes>(undefined);
    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);
    const isHelpPanelVisible: boolean = useSelector((state: AppState) => state.helpPanel.visibility);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response) => {
                setAppList(response);

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplications." +
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

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return AngularLogo;
        }

        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return JavaScriptLogo;
        }

        return null;
    };

    return (
        <Grid data-testid={ testId } className="ml-0 mr-0">
            {
                !(selectedTechnology || (window.location.hash).includes(URLFragmentTypes.VIEW))
                    ? (
                        <Grid.Row className="technology-selection-wrapper" textAlign="center">
                            <Grid.Column width={ 16 }>
                                <TechnologySelection<SupportedSPATechnologyTypes>
                                    technologies={ [
                                        {
                                            "data-componentid": "react",
                                            displayName: SupportedSPATechnologyTypes.REACT,
                                            logo: ReactLogo,
                                            type: SupportedSPATechnologyTypes.REACT
                                        },
                                        {
                                            "data-componentid": "angular",
                                            displayName: SupportedSPATechnologyTypes.ANGULAR,
                                            logo: AngularLogo,
                                            type: SupportedSPATechnologyTypes.ANGULAR
                                        },
                                        {
                                            "data-componentid": "javascript",
                                            displayName: SupportedSPATechnologyTypes.JAVASCRIPT,
                                            logo: JavaScriptLogo,
                                            type: SupportedSPATechnologyTypes.JAVASCRIPT
                                        }
                                    ] }
                                    onSelectedTechnologyChange={
                                        (technology: SupportedSPATechnologyTypes) =>
                                            setSelectedTechnology(technology)
                                    }
                                />
                                <Grid.Row className="custom-configuration">
                                    <div data-testid={ testId }>
                                        <Divider hidden/>
                                        <Divider className="or" horizontal>
                                            <Heading as="h5">OR</Heading>
                                        </Divider>
                                        <SupportedTechnologyArray
                                            onTriggerTabUpdate={ onTriggerTabUpdate }
                                            infoTabIndex={ INFO_TAB_INDEX }
                                            icons={ [
                                                MeteorIcon,
                                                PolymerIcon,
                                                EmberIcon,
                                                AureliaIcon,
                                                BackboneIcon,
                                                VueIcon
                                            ] }
                                            documentationLink={
                                                getLink(
                                                    "develop.applications.editApplication." +
                                                    "singlePageApplication.quickStart." +
                                                    "customConfig.learnMore"
                                                )
                                            }
                                        />
                                    </div>
                                </Grid.Row>
                            </Grid.Column>.
                        </Grid.Row>
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
    "data-testid": "spa-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SinglePageApplicationQuickStart;
