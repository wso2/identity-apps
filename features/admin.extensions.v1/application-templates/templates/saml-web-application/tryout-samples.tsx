/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CodeEditor, DocumentationLink, GenericIcon, Message, Text, useDocumentation } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Form, Icon, InputOnChangeData } from "semantic-ui-react";
import { tomcatSAMLAgentDockerEnvCode } from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import { updateAuthProtocolConfig } from "@wso2is/admin.applications.v1/api";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    SAML2ConfigurationInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes
} from "@wso2is/admin.applications.v1/models";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";

interface TryoutSamplesPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    template: ApplicationTemplateInterface;
    technology: SupportedTraditionalSAMLAppTechnologyTypes;
    inboundProtocolConfig: any;
}

/**
 * Tryout Samples of Single Page Applications.
 *
 * @param props - Props injected into the component.
 * @returns ReactElement
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

    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);

    const [ acsURLsUpdated, setACSURLsUpdated ] = useState<boolean>(false);
    const [ userTomcatHost, setUserTomcatHost ] = useState<string>("http://localhost:8080");
    const [ isValidSampleServerHost, setIsValidSampleServerHost ] = useState<boolean>(true);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const isACSURLAdded = (urlToCheck: string): boolean => {
        const urlArray: string[] = inboundProtocolConfig.saml
            ? inboundProtocolConfig.saml.assertionConsumerUrls
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const handleAddACSURL = (url: string): void => {
        const acsURLs: string[] = inboundProtocolConfig.saml.assertionConsumerUrls;

        acsURLs.push(url);

        const body: SAML2ConfigurationInterface = {};

        body.manualConfiguration = {
            ...inboundProtocolConfig.saml,
            assertionConsumerUrls: acsURLs,
            defaultAssertionConsumerUrl: url
            
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

    const generateSampleDownloadStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactElement => {
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

    const renderServerSelectionInput = (): ReactElement => {
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
                            onChange={ (e: ChangeEvent, data: InputOnChangeData) => {
                                handleURLFieldUpdate(e, data);
                            } }
                        />
                    </Form.Group>
                </Form>
                { !isValidSampleServerHost && (
                    <Message
                        type="error"
                        content="Please enter a valid URL"
                    />
                ) }
            </>
        );
    };

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData): void => {
        if (FormValidation.url(data.value)) {
            setIsValidSampleServerHost(true);
            setUserTomcatHost(data.value);
        } else {
            setUserTomcatHost(null);
            setIsValidSampleServerHost(false);
        }
    };

    const generateConfigureStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactElement => {
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
                                            <Button
                                                className="warning"
                                                floated="right"
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
                                enableAssertionEncryption: inboundProtocolConfig.saml?.singleSignOnProfile?.assertion?.
                                    encryption?.enabled,
                                enableRequestSigning: inboundProtocolConfig.saml?.requestValidation?.
                                    enableSignatureValidation,
                                enableResponseSigning: inboundProtocolConfig.saml?.responseSigning?.enabled,
                                enableSLO: inboundProtocolConfig.saml?.singleLogoutProfile?.enabled,
                                issuer: samlConfigurations?.issuer,
                                samlIssuer: inboundProtocolConfig.saml.issuer,
                                ssoUrl: samlConfigurations?.ssoUrl,
                                tomcatHost: userTomcatHost
                                
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
        const generateContent = (): ReactElement => {
            return (
                <>
                    <Text>
                        You will need to have <strong>Apache Tomcat</strong> installed on
                        your environment to try out the sample.
                    </Text>
                    <Text>To download <strong>Apache Tomcat</strong>, navigate to the official <DocumentationLink
                        link={ getLink("develop.applications.editApplication." +
                            "samlApplication.quickStart.mavenDownload") }
                        showEmptyLinkText
                    >downloads</DocumentationLink> page.
                    </Text>
                </>
            );
        };

        return (
            <div className="mt-3 mb-6">
                <Message
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
