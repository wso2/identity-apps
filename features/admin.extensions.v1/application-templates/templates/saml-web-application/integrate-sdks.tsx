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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    CodeEditor,
    DocumentationLink,
    GenericIcon,
    Hint,
    Message,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Form, Icon, InputOnChangeData } from "semantic-ui-react";
import {
    tomcatSAMLAgentLoginButtonCode,
    tomcatSAMLAgentLogoutCode,
    tomcatSAMLAgentMavenDependencyCode,
    tomcatSAMLAgentSamplePropertiesCode,
    tomcatSAMLAgentSampleWebXMLCode,
    wso2InternalRepoPointingCode
} from "./code-blocks";
import { SDKMeta } from "./meta";
import { 
    SAMLIntegrateSDKConfigInterface, 
    SupportedTraditionalSAMLAppTechnologyTypes 
} from "./models";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    SAMLApplicationConfigurationInterface
} from "@wso2is/admin.applications.v1/models";
import { AppState } from "@wso2is/admin.core.v1";
import { Config } from "@wso2is/admin.core.v1/configs";
import MavenLogo from "../../../assets/images/icons/maven-logo.svg";
import TomcatLogo from "../../../assets/images/icons/tomcat-icon.svg";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";

interface IntegrateSDKsPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    technology: SupportedTraditionalSAMLAppTechnologyTypes;
    template: ApplicationTemplateInterface;
    inboundProtocolConfig: any;
}

/**
 * Integrate SDKs to Single Page Applications.
 *
 * @param props - Props injected into the component.
 * @returns ReactElement
 */
export const IntegrateSDKs: FunctionComponent<IntegrateSDKsPropsInterface> = (
    props: IntegrateSDKsPropsInterface
): ReactElement => {

    const {
        inboundProtocolConfig,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const { getLink } = useDocumentation();

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);

    const [ SDKInitConfig, setSDKInitConfig ] = useState<SAMLIntegrateSDKConfigInterface>(undefined);
    const [ appContextPath, setAppContextPath ] = useState<string>(null);
    const [ isValidAppContextPath, setIsValidAppContextPath ] = useState<boolean>(true);

    useEffect(() => {
        if (!inboundProtocolConfig?.saml) {
            return;
        }

        const configs: SAMLIntegrateSDKConfigInterface = {
            acsURL: inboundProtocolConfig.saml.defaultAssertionConsumerUrl,
            baseUrl: Config.getDeploymentConfig().customServerHost,
            certificate: samlConfigurations?.certificate,
            enableAssertionEncryption: inboundProtocolConfig.saml?.singleSignOnProfile?.assertion?.encryption?.enabled,
            enableRequestSigning: inboundProtocolConfig.saml?.requestValidation?.enableSignatureValidation,
            enableResponseSigning: inboundProtocolConfig.saml?.responseSigning?.enabled,
            enableSLO: inboundProtocolConfig.saml?.singleLogoutProfile?.enabled,
            issuer: samlConfigurations?.issuer,
            samlIssuer: inboundProtocolConfig.saml.issuer,
            ssoUrl: samlConfigurations?.ssoUrl
        };

        setSDKInitConfig(configs);
    }, [ inboundProtocolConfig ]);

    const generateConfigureStepTitle = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return "Add Dependencies";
        }

        return "Configure Client";
    };

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData): void => {
        if (FormValidation.url(data.value)) {
            setIsValidAppContextPath(true);
            setAppContextPath(data.value);
        } else {
            setAppContextPath(null);
            setIsValidAppContextPath(false);
        }
    };

    const renderAppContextInput = (): ReactElement => {
        return  (
            <>
                <Form>
                    <Form.Group widths="3">
                        <Form.Input
                            fluid
                            placeholder="https://myapp.io"
                            label="App Context Path"
                            value={ appContextPath }
                            onChange={ (e: ChangeEvent, data: InputOnChangeData) => {
                                handleURLFieldUpdate(e, data);
                            } }
                        />
                    </Form.Group>
                    <Hint>
                        The configuration <code className="inline-code">skipURIs</code> depends on
                        your <strong>App context path</strong>.
                    </Hint>
                </Form>

                { !isValidAppContextPath && (
                    <Message
                        type="error"
                        content="Please enter a valid URL"
                    />
                ) }
            </>
        );
    };

    const generateConfigureStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        To ease development, we&apos;ve introduced the <a
                            href="https://github.com/asgardeo/asgardeo-tomcat-saml-agent"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >Asgardeo SAML Agent</a>. You can use this Agent in your project by updating
                        your <code className="inline-code">pom.xml</code> file with the following dependency.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            beautify
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            height="100%"
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentMavenDependencyCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>

                    <Divider hidden />

                    <Text>
                        The Agent is hosted at <strong>WSO2 Internal Repository</strong>.
                        To resolve the dependency mentioned above, point to the repository as follows.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            height="100%"
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ wso2InternalRepoPointingCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>

                    <div className="mt-3">
                        <p>
                            Check out the <a
                                href={ SDKMeta.tomcatSAMLAgent.readme }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                            >
                                <Icon name="github" />documentation
                            </a> to learn more.
                        </p>
                    </div>
                </>
            );
        }

        return null;
    };

    const generateInitialisationStepTitle = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return "Configure";
        }

        return "Configure";
    };

    const generateInitialisationStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {

            return (
                <>
                    <Text>
                        We provide the Asgardeo endpoints to the application using a property file, which is read
                        by the Asgardeo SAML Agent.
                    </Text>
                    <Text>
                        Create a file named <code className="inline-code">sample-app.properties</code> inside the <code
                            className="inline-code">&#60;YOUR_APP&#62;/src/main/resources</code> directory,
                        using the content below.
                    </Text>
                    <Text>
                        <Trans i18nKey="extensions:develop.applications.quickstart.twa.setup.skipURIs">
                            Note the <strong>skipURIs</strong> property. This property defines the web pages in your
                            application that should not be secured, and do not require authentication.
                            Multiple URIs can be set using <strong>comma separated</strong> values.
                        </Trans>
                    </Text>

                    <Divider hidden />

                    { renderAppContextInput() }

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentSamplePropertiesCode(SDKInitConfig, appContextPath) }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>

                    <Divider hidden/>

                    <Text>
                        A comprehensive list of the properties used above, can be found in the <a
                            href={ SDKMeta.tomcatSAMLAgent.catalog }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >Configuration Catalog</a>.
                    </Text>

                    <Divider hidden/>

                    <Text>
                        For advanced use cases such as SAML response signing, the Asgardeo SAML Agent uses a keystore
                        with your private key. If your application doesn&apos;t have a keystore already, generate a
                        keystore file and copy it to the <code
                            className="inline-code">&#60;APP_HOME&#62;/src/main/resources</code> directory.
                        <br/>
                        <br/>
                        Make sure to update <code className="inline-code">KeyStorePassword</code> and <code
                            className="inline-code">PrivateKeyAlias</code> with relevant values.
                    </Text>

                    <Text>
                        Finally, copy and paste the following configuration to the
                        <code className="inline-code">&#60;APP_HOME&#62;/WEB-INF/web.xml</code> file and
                        change the <strong>certificate-file</strong> parameter with the name of your keystore file.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentSampleWebXMLCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const generateLoginStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        In the <code className="inline-code">index.html</code> file, add a login button to be used
                        to forward users to secured pages.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentLoginButtonCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const generateLogoutStep = (technology: SupportedTraditionalSAMLAppTechnologyTypes): ReactNode => {
        if (technology === SupportedTraditionalSAMLAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        Add the following snippet to enable logout from a secured page.
                    </Text>

                    <div className="code-segment">
                        <CodeEditor
                            readOnly
                            showLineNumbers
                            withClipboardCopy
                            language="htmlmixed"
                            sourceCode={ tomcatSAMLAgentLogoutCode() }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const integrationFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateConfigureStep(technology),
            stepTitle: generateConfigureStepTitle(technology)
        },
        {
            stepContent: generateInitialisationStep(technology),
            stepTitle: generateInitialisationStepTitle(technology)
        },
        {
            stepContent: generateLoginStep(technology),
            stepTitle: "Add Login"
        },
        {
            stepContent: generateLogoutStep(technology),
            stepTitle: "Add Logout"
        }
    ];

    const renderPrerequisitesStep = (): ReactElement => {
        const generateContent = () => {
            return (
                <>
                    <p>
                        In this section, we guide you on how to configure your own Java application that
                        uses&nbsp;
                        <GenericIcon
                            transparent
                            icon={ MavenLogo }
                            size="mini"
                            style={ {
                                "display": "inline"
                            } }
                        /> <strong>Apache Maven</strong> (3.6.x or higher) as the package manager and&nbsp;
                        <GenericIcon
                            transparent
                            icon={ TomcatLogo }
                            size="micro"
                            style={ {
                                "display": "inline",
                                "verticalAlign": "sub"
                            } }
                        /> <strong>Apache Tomcat</strong> (8.x or 9.x) as the deployment engine. You may
                        need to adjust some of the steps if you&apos;re working with a different application
                        container or technology.
                    </p>

                    <Text className="message-info-text">To download the latest <strong>Apache Maven</strong>,
                        navigate to the official <DocumentationLink
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
                stepContent={ integrationFlowSteps }
                isNextEnabled={ technology !== undefined }
                data-testid={ `${ testId }-vertical-stepper` }
            />
            <Divider hidden className="x2"/>
            <div className="mt-3 mb-6">
                <Message
                    type={ "info" }
                    header={ "Try Out!" }
                    content={ <AddUserStepContent/> }
                />
            </div>
        </>
    );
};
