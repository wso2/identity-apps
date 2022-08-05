/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, CodeEditor, Heading, Link, Text } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement, ReactNode } from "react";
import { Divider } from "semantic-ui-react";
import {
    reactSDKAuthenticatedStateCode,
    reactSDKContextAccessCode,
    reactSDKContextImportCode,
    reactSDKInitialisationCode,
    reactSDKLoginButtonCode,
    reactSDKProviderImportCode
} from "./code-blocks";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../../../components/component-extensions";
import { SDKInitConfig } from "../../../../shared";
import { SDKMeta } from "../../meta";
import { SupportedSPATechnologyTypes } from "../../models";
import { Prerequisites } from "../prerequisites";

/**
 * Interface for the React SDK Integrate steps component props.
 */
interface ReactSDKIntegrateStepsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Component for callback URL selection when there's multiple configured.
     * @param {ReactNode} heading Heading for the config options section.
     */
    configurationOptions: (heading: ReactNode) => ReactElement;
    /**
     * Product name from config. ex: Asgardeo.
     */
    productName: string;
    /**
     * The config that the SDK is initialized with.
     */
    sdkConfig: SDKInitConfig;
}

/**
 * React SDK Integrate steps.
 *
 * TODO: Add Localization. https://github.com/wso2-enterprise/asgardeo-product/issues/7033
 *
 * @param {ReactSDKIntegrateStepsPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const ReactSDKIntegrateSteps: FunctionComponent<ReactSDKIntegrateStepsPropsInterface> = (
    props: ReactSDKIntegrateStepsPropsInterface
): ReactElement => {

    const {
        configurationOptions,
        productName,
        sdkConfig,
        ["data-componentid"]: testId
    } = props;

    /**
     * Render SDK Installation instruction steps.
     * @return {ReactNode}
     */
    const renderSDKInstallInstructions = (): ReactNode => {

        return (
            <>
                <Text>
                    Run the following command to install <Code>@asgardeo/auth-react</Code> &{ " " }
                    <Code>react-router-dom</Code> from the npm registry.
                </Text>
                <Text>
                    <strong>Note: </strong>The <Code>react-router-dom</Code> package is a{ " " }
                    <Code>peer-dependency</Code> of the SDK and it is required to be installed for the SDK to{ " " }
                    work. We are working on making it optional.
                </Text>
                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="htmlmixed"
                        sourceCode={ SDKMeta.react.npmInstallCommand }
                    />
                </div>
            </>
        );
    };

    /**
     * Render Auth Client configuration instructions.
     * @return {ReactNode}
     */
    const renderAuthClientConfigurationInstructions = (): ReactNode => {

        if (!sdkConfig) {
            return null;
        }

        const renderConfigurationOptions = () => {

            const heading = (
                <Text>
                    <Code>AuthProvider</Code> takes a config object as a prop that can be used to initialize the{ " " }
                    SDK instance. Pass the relevant configurations to get the SDK to work with your application.
                </Text>
            );

            return configurationOptions(heading);
        };

        return (
            <>
                <Text>
                    Asgardeo React SDK exposes the <Code>AuthProvider</Code> component, which helps you{ " " }
                    easily integrate { productName } to your application.
                </Text>

                <Text>
                    First, import the <Code>AuthProvider</Code> component from <Code>@asgardeo/auth-react</Code>.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ reactSDKProviderImportCode() }
                    />
                </div>

                <Text spaced="top">
                    Then, wrap your <strong>root component</strong> with the <Code>AuthProvider</Code>.
                </Text>

                <Divider hidden />
                { renderConfigurationOptions() }
                <Divider hidden />

                <div className="code-segment">
                    <CodeEditor
                        height={ "100%" }
                        showLineNumbers
                        withClipboardCopy
                        language="typescript"
                        sourceCode={
                            reactSDKInitialisationCode({
                                clientID: sdkConfig.clientID,
                                scope: sdkConfig.scope,
                                baseUrl: sdkConfig?.baseUrl,
                                signInRedirectURL: sdkConfig.signInRedirectURL,
                                signOutRedirectURL: sdkConfig.signOutRedirectURL
                            })
                        }
                        options={ {
                            lineWrapping: true
                        } }
                        theme="dark"
                        readOnly
                    />
                </div>

                <Text spaced="top">
                    Go to our <Link link={ SDKMeta.react.links.authClientConfig }>documentation</Link> to learn{ " " }
                    more about other configurations supported by the SDK.
                </Text>
            </>
        );
    };

    /**
     * Render Auth Context access instructions.
     * @return {ReactNode}
     */
    const renderAuthContextAccessInstructions = (): ReactNode => {

        return (
            <>
                <Text>
                    The <Code>useAuthContext()</Code> hook provided by the SDK could be used to access the{ " " }
                    session state that contains information such as the email address of the authenticated user{ " " }
                    and the methods that are required for implementing authentication.
                </Text>

                <Text>
                    Import the <Code>useAuthContext()</Code> hook from <Code>@asgardeo/auth-react</Code>.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ reactSDKContextImportCode() }
                    />
                </div>

                <Text spaced="top">
                    And then inside your components, you can access the context as follows. 
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ reactSDKContextAccessCode() }
                    />
                </div>

                <Heading as="h4">Add a Login Button</Heading>

                <Text>
                    We can use the <Code>signIn()</Code> method from <Code>useContext()</Code> to easily{ " " }
                    implement a <strong>login button</strong>.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ reactSDKLoginButtonCode() }
                    />
                </div>

                <Text spaced="top">
                    Similarly to the above step, we can use the <Code>signOut()</Code> method from{ " " }
                    <Code>useContext()</Code> to implement a <strong>logout button</strong>.
                </Text>

                <Heading as="h4">Show Authenticated User&apos;s Information</Heading>

                <Text>
                    The following code snippet demonstrates the usage of the <Code>state</Code> object together{ " " }
                    with other methods from the context.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        height={ "100%" }
                        showLineNumbers
                        withClipboardCopy
                        language="typescript"
                        options={ {
                            lineWrapping: true
                        } }
                        theme="dark"
                        sourceCode={ reactSDKAuthenticatedStateCode() }
                    />
                </div>

                <Divider hidden/>

                <Text spaced="top">
                    Go to our <Link link={ SDKMeta.react.links.useContextDocumentation }>documentation</Link>{ " " }
                    to read more about all the available states and methods of the <Code>useAuthContext()</Code>{ " " }
                    hook API.
                </Text>
            </>
        );
    };

    /**
     * Render adding Routing instructions.
     * @return {ReactNode}
     */
    const renderRoutingInstructions = (): ReactNode => {

        return (
            <>
                <Text>
                    If your application needs routing, the SDK provides a component called{ " " }
                    <Code>SecureRoute</Code> which is implemented with <Code>react-router-dom</Code>.{ " " }
                    This component allows you to easily secure your routes with Asgardeo.
                </Text>
                <Text>
                    For more information, read our <Link
                    link={ SDKMeta.react.links.secureRoute }>documentation</Link>. And also checkout the <Link
                    link={ SDKMeta.react.samples.routing.repository }>sample</Link>{ " " }
                    and go through the source code.
                </Text>
            </>
        );
    };

    /**
     * Steps.
     * @return {VerticalStepperStepInterface[]}
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: renderSDKInstallInstructions(),
            stepTitle: "Install SDK"
        },
        {
            stepContent: renderAuthClientConfigurationInstructions(),
            stepTitle: (
                <Fragment>
                    Configure the <Code>AuthProvider</Code>
                </Fragment>
            )
        },
        {
            stepContent: renderAuthContextAccessInstructions(),
            stepTitle: (
                <Fragment>
                    Use API
                </Fragment>
            )
        },
        {
            stepContent: renderRoutingInstructions(),
            stepTitle: (
                <Fragment>
                    Add Routing (Optional)
                </Fragment>
            )
        }
    ];

    return (
        <Fragment>
            <Prerequisites technology={ SupportedSPATechnologyTypes.REACT }/>
            <VerticalStepper
                alwaysOpen
                isSidePanelOpen
                isNextEnabled={ true }
                stepContent={ steps }
                data-testid={ `${ testId }-vertical-stepper` }
            />
        </Fragment>
    );
};

/**
 * Default props for the component
 */
ReactSDKIntegrateSteps.defaultProps = {
    "data-componentid": "react-sdk-integrate-steps"
};
