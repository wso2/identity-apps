/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { Code, CodeEditor, CodeEditorProps, GenericIcon, MessageWithIcon, Text } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Icon, Message, Popup } from "semantic-ui-react";
import { ReactComponent as AngularLogo } from "./assets/angular-logo.svg";
import { ReactComponent as JavaScriptLogo } from "./assets/javascript-logo.svg";
import { SDKMeta } from "./meta";
import { SupportedSPATechnologyTypes } from "./models";
import {
    ApplicationInterface,
    ApplicationManagementUtils,
    ApplicationTemplateInterface,
    OIDCDataInterface,
    SupportedAuthProtocolTypes,
    updateAuthProtocolConfig
} from "../../../../features/applications";
import { Config } from "../../../../features/core/configs";
import { EventPublisher } from "../../../../features/core/utils";
import ReactLogoDataURL from "../../../assets/images/icons/react-icon.svg";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { AddUserStepContent } from "../../shared/components";

/**
 * The set of scopes requested to have a smooth UX. If `profile` is not requested, the `username` etc.
 * claims will not return with the ID Token.
 */
const DEFAULT_REQUESTED_SCOPES: string[] = [ "openid", "profile" ];

interface TryoutSamplesPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    onApplicationUpdate: () => void;
    technology: SupportedSPATechnologyTypes;
    template: ApplicationTemplateInterface;
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
        application,
        inboundProtocolConfig,
        onApplicationUpdate,
        technology,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ authConfig, setAuthConfig ] = useState(undefined);

    const [ callbacksUpdated, setCallbacksUpdated ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (isEmpty(inboundProtocolConfig)) {
            return;
        }

        const configs = {
            clientID: inboundProtocolConfig.oidc?.clientId,
            baseUrl: Config.getDeploymentConfig().serverHost,
            signInRedirectURL: "https://localhost:3000",
            signOutRedirectURL: "https://localhost:3000",
            scope: DEFAULT_REQUESTED_SCOPES
        };

        setAuthConfig(configs);
    }, [ inboundProtocolConfig ]);

    const checkCallbacks = (urlToCheck: string) => {

        const urlArray = (inboundProtocolConfig?.oidc?.callbackURLs
            && Array.isArray(inboundProtocolConfig.oidc.callbackURLs))
            ? EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ])
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const generateIntegrateCode = (technology: SupportedSPATechnologyTypes) => {

        if (!authConfig) {
            return null;
        }

        const scopesForDisplay = (): string => {

            return `[${ authConfig?.scope?.map((item: string) => {
                return `"${ item }"`;
            })
                }]`;
        };

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return `{
    "clientID": "${ authConfig.clientID }",
    "baseUrl": "${ authConfig.baseUrl }",
    "signInRedirectURL": "${ authConfig.signInRedirectURL }",
    "signOutRedirectURL": "${ authConfig.signOutRedirectURL }",
    "scope": ${ scopesForDisplay() }
}`;
        }

        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return `{
    "clientID": "${ authConfig.clientID }",
    "baseUrl": "${ authConfig.baseUrl }",
    "signInRedirectURL": "${ authConfig.signInRedirectURL }",
    "signOutRedirectURL": "${ authConfig.signOutRedirectURL }",
    "scope": ${ scopesForDisplay() }
}`;
        }

        return `const authConfig = {
    clientID: "${ authConfig.clientID }",
    signInRedirectURL: "${ authConfig.signInRedirectURL }",
    baseUrl: "${ authConfig.baseUrl }",
    scope: ${ scopesForDisplay() }
};`;

    };

    const handleAddCallback = (url: string) => {

        const configuredCallbacks: any = ApplicationManagementUtils.buildCallBackURLWithSeparator(
            inboundProtocolConfig.oidc.callbackURLs[ 0 ]).split(",");

        const shouldUpdateCallbacks: boolean = !configuredCallbacks.includes(url);
        const shouldUpdateAllowedOrigins: boolean = !inboundProtocolConfig.oidc.allowedOrigins.includes(url);

        const body: OIDCDataInterface = {
            ...inboundProtocolConfig.oidc,
            allowedOrigins: shouldUpdateAllowedOrigins
                ? [ ...inboundProtocolConfig.oidc.allowedOrigins, url ]
                : inboundProtocolConfig.oidc.allowedOrigins,
            callbackURLs: shouldUpdateCallbacks
                ? [ ApplicationManagementUtils.buildCallBackUrlWithRegExp([ ...configuredCallbacks, url ].join(",")) ]
                : inboundProtocolConfig.oidc.callbackURLs
        };

        const resolveAlertContent = () => {

            if (shouldUpdateAllowedOrigins && shouldUpdateCallbacks) {
                return {
                    description: "Successfully updated the URLs in the application.",
                    level: AlertLevels.SUCCESS,
                    message: "Updated the URLs"
                };
            } else if (shouldUpdateCallbacks) {
                return {
                    description: "Successfully updated the Allowed Origins.",
                    level: AlertLevels.SUCCESS,
                    message: "Updated the URLs"
                };
            }

            return {
                description: "Successfully updated the Callback URLs in the application.",
                level: AlertLevels.SUCCESS,
                message: "Updated the URLs"
            };
        };

        updateAuthProtocolConfig<OIDCDataInterface>(application.id, body, SupportedAuthProtocolTypes.OIDC)
            .then(() => {
                setCallbacksUpdated(true);
                dispatch(addAlert<AlertInterface>(resolveAlertContent()));
                onApplicationUpdate();
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "An error occurred while updating the application.",
                    level: AlertLevels.ERROR,
                    message: "Error occurred"
                }));
            });
    };

    const generateSampleDownloadStep = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-react-sample` }
                        className="sample-action-button download"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-download-sample", {
                                type: "react"
                            });
                            window.open(SDKMeta.react.samples.basicUsage.artifact, "");
                        } }
                    >
                        <GenericIcon
                            transparent
                            icon={ ReactLogoDataURL }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-view-source-on-github", {
                                type: "react"
                            });
                            window.open(SDKMeta.react.samples.basicUsage.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <Trans i18nKey="extensions:develop.applications.quickstart.spa.samples.exploreMoreSamples">
                            Explore <a
                                href={ SDKMeta.react.samples.root }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                                onClick={ () => {
                                    eventPublisher.publish("application-quick-start-click-explore-more-samples", {
                                        type: "react"
                                    });
                                } }
                            >more samples <Icon name="external"/></a> like this.
                        </Trans>
                    </div>
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-js-sample` }
                        className="sample-action-button download"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-download-sample", {
                                type: "javascript"
                            });
                            window.open(SDKMeta.javascript.samples.javascript.artifact, "");
                        } }
                    >
                        <GenericIcon
                            transparent
                            icon={ JavaScriptLogo }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-view-source-on-github", {
                                type: "javascript"
                            });
                            window.open(SDKMeta.javascript.samples.javascript.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <Trans i18nKey="extensions:develop.applications.quickstart.spa.samples.exploreMoreSamples">
                            Explore <a
                                href={ SDKMeta.javascript.samples.root }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                                onClick={ () => {
                                    eventPublisher.publish("application-quick-start-click-explore-more-samples", {
                                        type: "javascript"
                                    });
                                } }
                            >more samples <Icon name="external"/></a> like this.
                        </Trans>
                    </div>
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-angular-sample` }
                        className="sample-action-button download"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-download-sample", {
                                type: "angular"
                            });
                            window.open(SDKMeta.angular.samples.basicUsage.artifact, "");
                        } }
                    >
                        <GenericIcon
                            transparent
                            icon={ AngularLogo }
                            size="mini"
                            spaced="right"
                            floated="left"
                        />
                        Download { technology } sample
                        <Icon name="download" className="ml-2" />
                    </Button>
                    <Button
                        basic
                        className="sample-action-button github"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-view-source-on-github", {
                                type: "angular"
                            });
                            window.open(SDKMeta.angular.samples.basicUsage.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                    <div className="mt-3">
                        <Trans i18nKey="extensions:develop.applications.quickstart.spa.samples.exploreMoreSamples">
                            Explore <a
                                href={ SDKMeta.angular.samples.root }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                                onClick={ () => {
                                    eventPublisher.publish("application-quick-start-click-explore-more-samples", {
                                        type: "angular"
                                    });
                                } }
                            >more samples <Icon name="external"/></a> like this.
                        </Trans>
                    </div>
                </>
            );
        }
    };

    const generateConfigureStep = (technology: SupportedSPATechnologyTypes) => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    <Text>
                        Copy the following configuration and replace the content of the{ " " }
                        <code className="inline-code">config.json</code> file found in the{ " " }
                        <code className="inline-code">asgardeo-react-app/src</code> sample folder.
                    </Text>
                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="json"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.REACT) }
                            beautify={ true }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>
                    { spaSampleAppRepoLinkJSX(SDKMeta.react.repository) }
                    <Divider hidden />
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    <p className="mt-4">
                        Open the <strong>index.html</strong> file located at the root of{ " " }
                        the sample project and scroll down to the <strong>{ "<script>" }</strong> tag at the end of the{ " "}
                        <strong>body</strong> tag and find <code className="inline-code">authConfig</code> object.
                    </p>
                    <p>Update the configurations given below.</p>
                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="javascript"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.JAVASCRIPT) }
                            beautify={ true }
                            theme="dark"
                            options={ {
                                lineWrapping: true
                            } }
                        />
                    </div>
                    { spaSampleAppRepoLinkJSX(SDKMeta.javascript.repository) }
                </>
            );
        } else if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    <Text>
                        Copy the following configuration and replace the content of the{ " " }
                        <code className="inline-code">config.json</code> file found in the{ " " }
                        <code className="inline-code">asgardeo-angular-app/src</code> sample folder.
                    </Text>
                    <div className="code-segment">
                        <CodeEditor
                            height={ "100%" }
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="json"
                            sourceCode={ generateIntegrateCode(SupportedSPATechnologyTypes.ANGULAR) }
                            beautify={ true }
                            options={ {
                                lineWrapping: true
                            } }
                            theme="dark"
                        />
                    </div>
                    { spaSampleAppRepoLinkJSX(SDKMeta.angular.repository) }
                    <Divider hidden />
                </>
            );
        }

        return null;
    };

    const spaSampleAppRunningStepInstructionsJSX = (): ReactElement => {
        return (
            <>
                <p className="mt-2">
                    Open a terminal, navigate to the root of the sample, and execute the following command:
                </p>
                { spaSampleAppRunningStepCommandJSX() }
                <Text spaced="top">
                    The app is now accessible from <a
                        href="https://localhost:3000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clickable-link"
                        >https://localhost:3000
                    </a>
                    { " " }
                    <Popup
                        content={
                            "Opening the app in your browser might cause a Certificate Not Trusted " +
                            "warning since the sample app is using a self-signed certificate. " +
                            "Instruct your browser to trust that certificate to proceed."
                        }
                        inverted
                        trigger={<Icon color="orange" name="help circle" />}
                        position="bottom center"
                    />
                </Text>
            </>
        )
    };

    const spaSampleAppRunningStepCommandJSX = (props: CodeEditorProps = {}): ReactElement => {
        return (
            <CodeEditor
                { ...props }
                oneLiner
                readOnly
                withClipboardCopy
                language="javascript"
                sourceCode="npm install && npm start"
            />
        );
    };

    const spaSampleAppRepoLinkJSX = (link: string): ReactElement => {
        return (
            <div className="mt-3">
                To learn more, go to our <a
                    href={ link }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clickable-link"
                >
                    <Icon name="github"/>GitHub repository
                </a>
            </div>
        );
    };

    const generateRunStep = (technology: SupportedSPATechnologyTypes): ReactNode => {

        if (technology === SupportedSPATechnologyTypes.REACT) {
            return (
                <>
                    { spaSampleAppRunningStepInstructionsJSX() }
                    { renderAddUserStep() }
                </>
            );
        }
        if (technology === SupportedSPATechnologyTypes.ANGULAR) {
            return (
                <>
                    { spaSampleAppRunningStepInstructionsJSX() }
                    { renderAddUserStep() }
                </>
            );
        }
        if (technology === SupportedSPATechnologyTypes.JAVASCRIPT) {
            return (
                <>
                    { spaSampleAppRunningStepInstructionsJSX() }
                    { renderAddUserStep() }
                </>
            );
        }

        return null;
    };

    const renderAddUserStep = (): ReactElement => {

        return (
            <>
                <Divider hidden className="mb-0"/>
                <div className="add-user-step">
                    <Message info className="add-user-info">
                        { <AddUserStepContent/> }
                    </Message>
                </div>
            </>
        );
    }

    const sampleFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: generateSampleDownloadStep(technology),
            stepTitle: "Download"
        },
        {
            stepContent: (
                <>
                    {
                        !callbacksUpdated
                        && !(checkCallbacks("https://localhost:3000")
                            && checkCallbacks("https://localhost:3000"))
                            ? (
                                <Message warning>
                                    <p>
                                        In order to try out the sample, you need to
                                        add <strong>https://localhost:3000</strong> to <strong>Authorized redirect
                                        URIs</strong>
                                        <Button className="warning" floated="right"
                                                onClick={ () => handleAddCallback("https://localhost:3000") }>Add
                                            Now</Button>
                                    </p>
                                </Message>
                            )
                            : null
                    }
                    { generateConfigureStep(technology) }
                </>
            ),
            stepTitle: "Configure"
        },
        {
            stepContent: generateRunStep(technology),
            stepTitle: "Run"
        }
    ];

    const renderPrerequisitesStep = (): ReactElement => {

        if (technology !== SupportedSPATechnologyTypes.REACT && technology !== SupportedSPATechnologyTypes.ANGULAR) {
            return null;
        }

        return (
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type={ "info" }
                    header={ "Prerequisite" }
                    content={ (
                        <Text className={ 'message-info-text' } >
                            You will need to have <strong>Node.js</strong> and <strong>npm</strong> installed on
                            your environment to try out the SDK.

                            To download the Long Term Support (LTS) version of <strong>Node.js </strong>
                            (which includes <strong>npm</strong>), navigate to the official <a
                            href="https://nodejs.org/en/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >downloads</a> page.
                        </Text>
                    ) }
                />
                {
                    technology === SupportedSPATechnologyTypes.ANGULAR && (
                        <Text>
                            <strong>Note: </strong>The SDK currently doesn&apos;t support Angular 11 applications{ " " }
                            in the <Code>Strict Mode</Code>. We are working on making the SDK compatible.
                        </Text>
                    )
                }
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
