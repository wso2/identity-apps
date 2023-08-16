/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    URLFragmentTypes
} from "../../../../features/applications/models";
import { history } from "../../../../features/core";
import { getTechnologyLogos } from "../../../../features/core/configs";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import DotNetLogo from "../../../assets/images/icons/net-logo.svg";
import PerlLogo from "../../../assets/images/icons/perl-logo.svg";
import PHPLogo from "../../../assets/images/icons/php-logo.svg";
import PythonLogo from "../../../assets/images/icons/python-logo.svg";
import { QuickStartModes } from "../../shared";
import {
    QuickStartPanelOverview,
    SPATechnologySelection,
    TraditionalSAMLWebApplicationCustomConfiguration
} from "../../shared/components";


/**
 * Prop types of the component.
 */
interface TraditionalSAMLWebApplicationQuickStartPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    onTriggerTabUpdate: (tabIndex: number) => void;
    template: ApplicationTemplateInterface;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 7;
const PROTOCOL_TAB_INDEX: number = 2;
const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start content for the Traditional Web Application template.
 *
 * @param props - Props injected into the component.
 * @returns traditional SAML web application quick start.
 */
const TraditionalSAMLWebApplicationQuickStart:
FunctionComponent<TraditionalSAMLWebApplicationQuickStartPropsInterface> = (
    props: TraditionalSAMLWebApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        defaultTabIndex,
        inboundProtocolConfig,
        onTriggerTabUpdate,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    const { getLink } = useDocumentation();

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(QuickStartModes.INTEGRATE);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalSAMLAppTechnologyTypes>(undefined);


    /**
     * Called when the URL fragment updates
     */
    useEffect(() => {

        if (!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const technologyType: string = (window.location.hash).split("&" + URLFragmentTypes.VIEW)[1].split("_")[1];

        if (SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE.toLowerCase() == unescape(technologyType)) {
            setSelectedTechnology(SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE);
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
        setSelectedIntegration(QuickStartModes.INTEGRATE);
    };

    const resolveTechnologyLogo = (technology: SupportedTraditionalSAMLAppTechnologyTypes) => {

        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return getTechnologyLogos().java;
        }

        return null;
    };

    const resolveCustomConfiguration = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-custom-configuration-container` }>
                <TraditionalSAMLWebApplicationCustomConfiguration
                    onTriggerTabUpdate={ onTriggerTabUpdate }
                    infoTabIndex={ INFO_TAB_INDEX }
                    protocolTabIndex={ PROTOCOL_TAB_INDEX }
                    inboundProtocolConfig={ inboundProtocolConfig }
                    icons={ [
                        { techIcon: DotNetLogo, techIconTitle: "DotNet" },
                        { techIcon: JavaLogo, techIconTitle: "Java EE" },
                        { techIcon: PythonLogo, techIconTitle: "Python" },
                        { techIcon: PHPLogo, techIconTitle: "PHP" },
                        { techIcon: PerlLogo, techIconTitle: "Perl" }
                    ] }
                    data-componentid={ `${ componentId }-custom-configuration` }
                    documentationLink={
                        getLink(
                            "develop.applications.editApplication." +
                            "samlApplication.quickStart." +
                            "customConfig.learnMore"
                        )
                    }
                />
            </Grid.Row>
        );
    };

    const resolveTechnologySelection = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-technology-selection-container` }>
                <SPATechnologySelection<SupportedTraditionalSAMLAppTechnologyTypes>
                    technologies={ [
                        {
                            "data-componentid": "java-ee",
                            displayName: SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE,
                            logo: JavaLogo,
                            sampleAppURL: SDKMeta.tomcatSAMLAgent.sample.artifact,
                            type: SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE
                        }
                    ] }
                    data-componentid={ `${ componentId }-technology-selection` }
                    onSelectedTechnologyChange={
                        (technology: SupportedTraditionalSAMLAppTechnologyTypes) =>
                            setSelectedTechnology(technology)
                    }
                />
            </Grid.Row>
        );
    };

    return (
        <Grid data-componentid={ componentId }>
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
                                <Grid.Column width={ 16 }>
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
                                <Grid.Column width={ 16 }>
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
TraditionalSAMLWebApplicationQuickStart.defaultProps = {
    "data-componentid": "traditional-saml-web-app-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TraditionalSAMLWebApplicationQuickStart;
