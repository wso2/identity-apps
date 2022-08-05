/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { FormValidation } from "@wso2is/validation";
import { CodeEditor, GenericIcon, Hint, MessageWithIcon, Text } from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { Divider, Form, Icon, InputOnChangeData, Message } from "semantic-ui-react";
import {
    tomcatSAMLAgentLoginButtonCode,
    tomcatSAMLAgentLogoutCode,
    tomcatSAMLAgentMavenDependencyCode,
    tomcatSAMLAgentSamplePropertiesCode,
    tomcatSAMLAgentSampleWebXMLCode,
    wso2InternalRepoPointingCode
} from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalSAMLAppTechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationTemplateInterface,
    SAMLApplicationConfigurationInterface
} from "../../../../features/applications";
import { Config } from "../../../../features/core/configs";
import TomcatLogo from "../../../assets/images/icons/tomcat-icon.svg";
import MavenLogo from "../../../assets/images/icons/maven-logo.svg";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../features/core";

interface IntegrateSDKsPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    technology: SupportedTraditionalSAMLAppTechnologyTypes;
    template: ApplicationTemplateInterface;
    inboundProtocolConfig: any;
}

/**
 * Integrate SDKs to Single Page Applications.
 *
 * @param {IntegrateSDKsPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const IntegrateSDKs: FunctionComponent<IntegrateSDKsPropsInterface> = (
    props: IntegrateSDKsPropsInterface
): ReactElement => {

    const {
        inboundProtocolConfig,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const [ SDKInitConfig, setSDKInitConfig ] = useState(undefined);
    const [ appContextPath, setAppContextPath ] = useState<string>(null);
    const [ isValidAppContextPath, setIsValidAppContextPath ] = useState<boolean>(true);

    useEffect(() => {
        if (!inboundProtocolConfig?.saml) {
            return;
        }

        const configs = {
            acsURL: inboundProtocolConfig.saml.defaultAssertionConsumerUrl,
            certificate: samlConfigurations?.certificate,
            issuer: samlConfigurations?.issuer,
            samlIssuer: inboundProtocolConfig.saml.issuer,
            baseUrl: Config.getDeploymentConfig().serverHost,
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

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData) => {
        if (FormValidation.url(data.value)) {
            setIsValidAppContextPath(true);
            setAppContextPath(data.value);
        } else {
            setAppContextPath(null);
            setIsValidAppContextPath(false);
        }
    }

    const renderAppContextInput = () => {

        return  (
            <>
                <Form>
                    <Form.Group widths="3">
                        <Form.Input
                            fluid
                            placeholder="https://myapp.io"
                            label="App Context Path"
                            value={ appContextPath }
                            onChange={ (e, data) => {
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
                    <Message error>
                        <p>Please enter a valid URL</p>
                    </Message>
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
                        navigate to the official
                        <a
                            href="https://maven.apache.org/download.cgi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        > downloads</a> page.
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
                stepContent={ integrationFlowSteps }
                isNextEnabled={ technology !== undefined }
                data-testid={ `${ testId }-vertical-stepper` }
            />
            <Divider hidden className="x2"/>
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type={ "info" }
                    header={ "Try Out!" }
                    content={ <AddUserStepContent/> }
                />
            </div>
        </>
    );
};
