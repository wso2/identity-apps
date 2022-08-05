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
    angularSDKInitialisationCode,
    authModuleImportCode,
    authServiceImportCode,
    loginButtonCode,
    serviceInjectionCode,
    stateSubscriptionCode
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
 * Interface for the Angular SDK Integrate steps component props.
 */
interface AngularSDKIntegrateStepsPropsInterface extends IdentifiableComponentInterface {
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
 * Angular SDK Integrate steps.
 * 
 * TODO: Add Localization. https://github.com/wso2-enterprise/asgardeo-product/issues/7033
 *
 * @param {AngularSDKIntegrateStepsPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const AngularSDKIntegrateSteps: FunctionComponent<AngularSDKIntegrateStepsPropsInterface> = (
    props: AngularSDKIntegrateStepsPropsInterface
): ReactElement => {

    const {
        configurationOptions,
        sdkConfig,
        productName,
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
                    Run the following command to install the <Code>@asgardeo/auth-angular</Code> package{ " " }
                    from npm registry.
                </Text>
                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="htmlmixed"
                        sourceCode={ SDKMeta.angular.npmInstallCommand }
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
                    <Code>AsgardeoAuthModule</Code> could be configured with the <Code>forRoot()</Code>. Pass{ " " }
                    the relevant configurations to the <Code>forRoot()</Code> function{ " " }
                    to get the SDK to work with your application.
                </Text>
            );

            return configurationOptions(heading);
        };

        return (
            <>
                <Text>
                    Asgardeo Angular SDK exposes the <Code>AsgardeoAuthModule</Code>, which helps you{ " " }
                    easily integrate { productName } to you application.
                </Text>

                <Text>
                    First, import the <Code>AsgardeoAuthModule</Code> from <Code>@asgardeo/auth-angular</Code>.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ authModuleImportCode() }
                    />
                </div>

                <Text spaced="top">
                    Then, in your <strong>root module</strong>, add <Code>AsgardeoAuthModule</Code> to{ " " }
                    the <Code>imports</Code> array.
                </Text>

                <Divider hidden/>
                { renderConfigurationOptions() }
                <Divider hidden/>

                <div className="code-segment">
                    <CodeEditor
                        height={ "100%" }
                        showLineNumbers
                        withClipboardCopy
                        language="typescript"
                        sourceCode={
                            angularSDKInitialisationCode({
                                clientID: sdkConfig.clientID,
                                scope: sdkConfig.scope,
                                baseUrl: sdkConfig.baseUrl,
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
                    Go to our <Link
                    link={ SDKMeta.angular.links.authModuleConfig }>documentation</Link> to learn more about{ " " }
                    other configurations supported by the SDK.
                </Text>
            </>
        );
    };

    /**
     * Render Auth Service access instructions.
     * @return {ReactNode}
     */
    const renderAuthServiceAccessInstructions = (): ReactNode => {

        return (
            <>
                <Text>
                    The <Code>AsgardeoAuthService</Code> is an <Code>@Injectable()</Code> service provided by{ " " }
                    the SDK that could be used to access the session state which contains information such as{ " " }
                    the email address of the authenticated user and the methods that are required for{ " " }
                    implementing authentication.
                </Text>

                <Text>
                    Import the <Code>AsgardeoAuthService</Code> from <Code>@asgardeo/auth-angular</Code> in to{ " " }
                    the component you want.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ authServiceImportCode() }
                    />
                </div>

                <Text spaced="top">
                    And then inside the <Code>constructor</Code>, inject the service as follows.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ serviceInjectionCode() }
                    />
                </div>

                <Heading as="h4">Add a Login Button</Heading>

                <Text>
                    We can use the <Code>signIn()</Code> method from <Code>AsgardeoAuthService</Code> to easily{ " " }
                    implement a <strong>login button</strong>.
                </Text>

                <div className="code-segment">
                    <CodeEditor
                        oneLiner
                        readOnly
                        withClipboardCopy
                        language="typescript"
                        sourceCode={ loginButtonCode() }
                    />
                </div>

                <Text spaced="top">
                    Similarly to the above step, we can use the <Code>signOut()</Code> method from{ " " }
                    <Code>AsgardeoAuthService</Code> to implement a <strong>logout button</strong>.
                </Text>

                <Heading as="h4">Show Authenticated User&apos;s Information</Heading>

                <Text>
                    The following code snippet demonstrates the usage of the <Code>state$</Code> observable{ " " }
                    together with other APIs exposed via <Code>AsgardeoAuthService</Code>.
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
                        sourceCode={ stateSubscriptionCode() }
                    />
                </div>

                <Divider hidden/>

                <Text spaced="top">
                    Go to our <Link link={ SDKMeta.angular.links.authService }>documentation</Link>{ " " }
                    to read more about all the available states and methods of the <Code>AsgardeoAuthService</Code>.
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
                    If your application needs routing, the SDK also provides a router guard called{ " " }
                    <Code>AsgardeoAuthGuard</Code> which is implemented with <Code>CanActivate</Code> interface{ " " }
                    from <Code>@angular/router</Code>.
                </Text>
                <Text>
                    For more information, read our <Link link={ SDKMeta.react.links.secureRoute }>
                    documentation</Link>. And also checkout the <Link
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
                    Configure the <Code>AsgardeoAuthModule</Code>
                </Fragment>
            )
        },
        {
            stepContent: renderAuthServiceAccessInstructions(),
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
            <Prerequisites technology={ SupportedSPATechnologyTypes.ANGULAR }/>
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
AngularSDKIntegrateSteps.defaultProps = {
    "data-componentid": "angular-sdk-integrate-steps"
};
