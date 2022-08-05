/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface, AlertLevels, AlertInterface } from "@wso2is/core/models";
import { CodeEditor, GenericIcon, MessageWithIcon, Text } from "@wso2is/react-components";
import React, {ChangeEvent, FunctionComponent, ReactElement, ReactNode, useState} from "react";
import { Button, Divider, Form, Icon, InputOnChangeData, Message } from "semantic-ui-react";
import { tomcatSAMLAgentDockerEnvCode } from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    SAML2ConfigurationInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes,
    updateAuthProtocolConfig
} from "../../../../features/applications";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import { FormValidation } from "@wso2is/validation";
import { AddUserStepContent } from "../../shared/components";
import { getTechnologyLogos } from "../../../../features/core/configs";
import { AppState } from "../../../../features/core/store";
import { EventPublisher } from "../../../../features/core/utils";

interface TryoutSamplesPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    template: ApplicationTemplateInterface;
    technology: SupportedTraditionalSAMLAppTechnologyTypes;
    inboundProtocolConfig: any;
}

/**
 * Tryout Samples of Single Page Applications.
 *
 * @param {TryoutSamplesPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const TryoutSamples: FunctionComponent<TryoutSamplesPropsInterface> = (
    props: TryoutSamplesPropsInterface
): ReactElement => {

    const {
        inboundProtocolConfig,
        technology,
        application,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const [ acsURLsUpdated, setACSURLsUpdated ] = useState<boolean>(false);
    const [ userTomcatHost, setUserTomcatHost ] = useState<string>("http://localhost:8080");
    const [ isValidSampleServerHost, setIsValidSampleServerHost ] = useState<boolean>(true);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isACSURLAdded = (urlToCheck: string) => {
        const urlArray = inboundProtocolConfig.saml
            ? inboundProtocolConfig.saml.assertionConsumerUrls
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const handleAddACSURL = (url: string) => {

        const acsURLs = inboundProtocolConfig.saml.assertionConsumerUrls;
        acsURLs.push(url);

        const body: SAML2ConfigurationInterface = {};

        body.manualConfiguration = {
            ...inboundProtocolConfig.saml,
            defaultAssertionConsumerUrl: url,
            assertionConsumerUrls: acsURLs
        };

        updateAuthProtocolConfig<SAML2ConfigurationInterface>(application.id, body, SupportedAuthProtocolTypes.SAML)
            .then(() => {
                setACSURLsUpdated(true);
                dispatch(addAlert<AlertInterface>({
                    description: "Successfully updated the URLs in the application.",
                    level: AlertLevels.SUCCESS,
                    message: "Updated the URLs"
                }));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "An error occurred while updating the application.",
                    level: AlertLevels.ERROR,
                    message: "Error occurred"
                }));
            });
    };

    const generateSampleDownloadStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes) => {

        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-oidc-tomcat-sample` }
                        className="sample-action-button download"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-download-sample", {
                                type: "java-ee"
                            });
                            window.open(SDKMeta.tomcatSAMLAgent.sample.artifact, "");
                        } }
                    >
                        <GenericIcon
                            transparent
                            icon={ getTechnologyLogos().java }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } Sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-view-source-on-github", {
                                type: "java-ee"
                            });
                            window.open(SDKMeta.tomcatSAMLAgent.sample.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                </>
            );
        }

    };

    const renderServerSelectionInput = () => {

        return  (
            <>
                <Text>
                    The property <code className="inline-code">SAML2.AssertionConsumerURL</code> depends on the host
                    that your <strong>Tomcat</strong> server is running on.
                </Text>
                <Form>
                    <Form.Group widths="3">
                        <Form.Input
                            fluid
                            placeholder="https://localhost:8080"
                            label="Enter your Tomcat Host URL"
                            value={ userTomcatHost }
                            onChange={ (e, data) => {
                                handleURLFieldUpdate(e, data);
                            } }
                        />
                    </Form.Group>
                </Form>
                { !isValidSampleServerHost && (
                    <Message error>
                        <p>Please enter a valid URL</p>
                    </Message>
                ) }
            </>
        );
    };

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData) => {
        if (FormValidation.url(data.value)) {
            setIsValidSampleServerHost(true);
            setUserTomcatHost(data.value);
        } else {
            setUserTomcatHost(null);
            setIsValidSampleServerHost(false);
        }
    }

    const generateConfigureStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes) => {

        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        Copy the <code className="inline-code">war</code> file downloaded in the previous
                        step to the deployment location in your <strong>Tomcat</strong> server.
                        The default deployment location is the <code className="inline-code">webapps</code> directory
                        located at the root of your <strong>Tomcat</strong> server.
                    </Text>
                    <Text>
                        If your Tomcat Server is set to auto-deploy applications (and it is set to do this by default)
                        then the <code className="inline-code">war</code> file copied into the deployment location
                        will be extracted automatically. If not, go ahead and restart the server to get the extracted
                        sample.
                    </Text>
                    <Text>
                        Replace the content in the <code className="inline-code">sample-app.properties</code> file
                        located in <code className="inline-code">
                        &#60;TOMCAT_HOME&#62;/webapps/sample-app/WEB-INF/classes</code> with the following.
                    </Text>

                    { renderServerSelectionInput() }

                    {
                        !acsURLsUpdated
                        && !isEmpty(userTomcatHost)
                        && (isACSURLAdded(userTomcatHost + SDKMeta.tomcatSAMLAgent.sample.acsURLSuffix)
                            ? null
                            : (
                                <>
                                    <Message warning>
                                        <p>
                                            In order to try out the sample, you need to
                                            add <strong>{
                                                userTomcatHost + SDKMeta.tomcatSAMLAgent.sample.acsURLSuffix }
                                            </strong> to <strong>Assertion response URLs</strong>
                                            <Button className="warning" floated="right"
                                                    onClick={ () => handleAddACSURL(
                                                        userTomcatHost +
                                                        SDKMeta.tomcatSAMLAgent.sample.acsURLSuffix)
                                                    }>
                                                Add Now
                                            </Button>
                                        </p>
                                    </Message>
                                    <Divider hidden />
                                </>
                            )
                        )
                    }

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentDockerEnvCode( {
                                certificate: samlConfigurations?.certificate,
                                issuer: samlConfigurations?.issuer,
                                samlIssuer: inboundProtocolConfig.saml.issuer,
                                ssoUrl: samlConfigurations?.ssoUrl,
                                tomcatHost: userTomcatHost,
                            } ) }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                    <Divider hidden/>
                </>
            );
        }

        return null;
    };

    const generateRunStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        Now that you have added the relevant configurations, restart the <strong>Tomcat</strong> server,
                        for the newly added changes to be applied to the application.
                    </Text>
                    {
                        !isEmpty(userTomcatHost) && (
                            <Text>
                                Try out the application by accessing the URL <a
                                href={ userTomcatHost + SDKMeta.tomcatSAMLAgent.sample.home }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                            >
                                { userTomcatHost + SDKMeta.tomcatSAMLAgent.sample.home }</a>
                            </Text>
                        )
                    }
                    <div className="add-user-step">
                        <Message info className="add-user-info">
                            { <AddUserStepContent/> }
                        </Message>
                    </div>
                </>
            );
        }

        return null;
    };

    const sampleFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateSampleDownloadStep(technology),
            stepTitle: "Download"
        },
        {
            stepContent: generateConfigureStep(technology),
            stepTitle: "Configure"
        },
        {
            stepContent: generateRunStep(technology),
            stepTitle: "Run"
        }
    ];

    const renderPrerequisitesStep = (): ReactElement => {

        const generateContent = () => {
            return (
                <>
                    <Text>
                        You will need to have <strong>Apache Tomcat</strong> installed on
                        your environment to try out the sample.
                    </Text>
                    <Text>To download <strong>Apache Tomcat</strong>, navigate to the official <a
                        href="https://tomcat.apache.org/download-10.cgi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link external"
                    >downloads</a> page.
                    </Text>
                </>
            );
        };

        return (
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type={ "info" }
                    header={ "Prerequisite" }
                    content={ generateContent() }
                />
            </div>
        );
    };

    return (
        <>
            { renderPrerequisitesStep() }
            <VerticalStepper
                alwaysOpen
                isSidePanelOpen
                stepContent={ sampleFlowSteps }
                isNextEnabled={ technology !== undefined }
            />
        </>
    );
};
