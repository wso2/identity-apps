/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { CodeEditor, GenericIcon, Text, MessageWithIcon } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Form, Icon, InputOnChangeData, Message } from "semantic-ui-react";
import { dotNetSDKInstallerConfigCode, tomcatOIDCSamplePropertiesFileCode } from "./code-blocks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalOIDCAppTechnologyTypes } from "./models";
import {
    ApplicationInterface, ApplicationManagementUtils,
    ApplicationTemplateInterface, OIDCDataInterface, SupportedAuthProtocolTypes, updateAuthProtocolConfig
} from "../../../../features/applications";
import { Config, getTechnologyLogos } from "../../../../features/core/configs";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../components/component-extensions/application/vertical-stepper";
import { FormValidation } from "@wso2is/validation";
import { AddUserStepContent } from "../../shared/components";
import { EventPublisher } from "../../../../features/core/utils";

interface TryoutSamplesPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    template: ApplicationTemplateInterface;
    technology: SupportedTraditionalOIDCAppTechnologyTypes;
    inboundProtocolConfig: any;
    onApplicationUpdate: () => void;
    /**
     * Store the newly added callback urls.
     */
    addedCallBackUrls: string[];
    addedOrigins: string[];
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
        addedCallBackUrls,
        addedOrigins,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ authConfig, setAuthConfig ] = useState(undefined);
    const [ callbacksUpdated, setCallbacksUpdated ] = useState<boolean>(false);
    const [ sampleServerHost, setSampleServerHost ] = useState<string>("http://localhost:8080");
    const [ isValidSampleServerHost, setIsValidSampleServerHost ] = useState<boolean>(true);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (isEmpty(inboundProtocolConfig)) {
            return;
        }

        const configs = {
            clientID: inboundProtocolConfig.oidc?.clientId,
            clientSecret: inboundProtocolConfig.oidc?.clientSecret,
            serverOrigin: Config.getDeploymentConfig().serverHost
        };

        setAuthConfig(configs);
    }, [ inboundProtocolConfig ]);

    /**
     * Temporarily add post logout URI on try out sample selection.
     * TODO: Fix the creation wizard properly to add multiple callback urls.
     *
     */
    useEffect(() => {
        if (sampleServerHost && !checkCallbacks(sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home)) {
            handleAddCallback([sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home],sampleServerHost, true);
        }
    }, [ sampleServerHost ]);

    const handleAddCallback = (urls: string[], origin: string, hideDisplayMsg: boolean = false) => {

        if (inboundProtocolConfig.oidc.callbackURLs.length === 0) {
            return;
        }

        const configuredCallbacks: any = (inboundProtocolConfig?.oidc?.callbackURLs
            && Array.isArray(inboundProtocolConfig.oidc.callbackURLs))
            ? ApplicationManagementUtils.buildCallBackURLWithSeparator(inboundProtocolConfig.oidc.callbackURLs[ 0 ])
                .split(",")
            : [];

        if (urls && !hideDisplayMsg) {
            urls.forEach(((url: string): void => {
                if (!addedCallBackUrls.includes(url)){
                    addedCallBackUrls.push(url)
                }
            }))
        }

        const urlsToBeUpdated: string[] = [];
        if (addedCallBackUrls) {
            addedCallBackUrls.forEach((url: string): void => {
                if (!configuredCallbacks.includes(url)){
                    urlsToBeUpdated.push(url);
                }
            });
        }

        const shouldUpdateCallbacks: boolean = urlsToBeUpdated.length > 0;
        const shouldUpdateAllowedOrigins: boolean = !inboundProtocolConfig.oidc.allowedOrigins.includes(origin);

        if (shouldUpdateAllowedOrigins && !addedOrigins.includes(origin) && !hideDisplayMsg) {
            addedOrigins.push(origin)
        }
        const body: OIDCDataInterface = {
            ...inboundProtocolConfig.oidc,
            allowedOrigins: shouldUpdateAllowedOrigins
                ? [ ...inboundProtocolConfig.oidc.allowedOrigins, ...addedOrigins ]
                : inboundProtocolConfig.oidc.allowedOrigins,
            callbackURLs: shouldUpdateCallbacks
                ? [ ApplicationManagementUtils.buildCallBackUrlWithRegExp([ ...configuredCallbacks, ...urlsToBeUpdated ]
                    .join(",")) ]
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
                if (!hideDisplayMsg) {
                    setCallbacksUpdated(true);
                    dispatch(addAlert<AlertInterface>(resolveAlertContent()));
                }
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "An error occurred while updating the application.",
                    level: AlertLevels.ERROR,
                    message: "Error occurred"
                }));
            });
    };

    const checkCallbacks = (urlToCheck: string) => {

        if (inboundProtocolConfig.oidc.callbackURLs.length === 0) {
            return false;
        }

        const urlArray = inboundProtocolConfig?.oidc
            ? EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ])
            : [];

        if (!urlArray || !Array.isArray(urlArray) || urlArray.length < 1) {

            return false;
        }

        return urlArray.includes(urlToCheck);
    };

    const generateSampleDownloadStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes) => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
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
                            window.open(SDKMeta.tomcatOIDCAgent.sample.artifact, "");
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
                            window.open(SDKMeta.tomcatOIDCAgent.sample.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return (
                <>
                    <Button
                        basic
                        data-testid={ `${ testId }-download-dotnet-sample` }
                        className="sample-action-button download"
                        onClick={ () => {
                            eventPublisher.publish("application-quick-start-click-download-sample", {
                                type: "dot-net"
                            });
                            window.open(SDKMeta.dotNet.sample.artifact, "");
                        } }
                    >
                        <GenericIcon
                            transparent
                            icon={ getTechnologyLogos().dotNet }
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
                                type: "dot-net"
                            });
                            window.open(SDKMeta.dotNet.sample.repository, "");
                        } }
                    >
                        View source on GitHub
                        <Icon name="github" className="ml-2" />
                    </Button>
                </>
            );
        }
    };

    const generateIntegrateCode = (technology: SupportedTraditionalOIDCAppTechnologyTypes) => {

        if (!authConfig) {
            return null;
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return tomcatOIDCSamplePropertiesFileCode(authConfig, sampleServerHost);
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return dotNetSDKInstallerConfigCode(authConfig);
        }
    };

    const handleURLFieldUpdate = (e: ChangeEvent, data: InputOnChangeData) => {
        if (FormValidation.url(data.value)) {
            setIsValidSampleServerHost(true);
            setSampleServerHost(data.value);
        } else {
            setSampleServerHost(null);
            setIsValidSampleServerHost(false);
        }
    }

    const renderServerSelectionInput = () => {

        return  (
            <>
                <Text>
                    Few of the configurations such as <code className="inline-code">callBackURL</code> and <code
                    className="inline-code">trustedAudience</code> depends on the host that
                    your <strong>Tomcat</strong> server is running on.
                </Text>
                <Form>
                    <Form.Group widths="3">
                        <Form.Input
                            fluid
                            placeholder="https://localhost:8080"
                            label="Enter your Tomcat Host URL"
                            value={ sampleServerHost }
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

    const generateConfigureStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes) => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
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
                        Update the <code className="inline-code">oidc-sample-app.properties</code> file
                        located in <code className="inline-code">
                        &#60;TOMCAT_HOME&#62;/webapps/oidc-sample-app/WEB-INF/classes</code> with the following.
                    </Text>

                    { renderServerSelectionInput() }

                    {
                        !callbacksUpdated
                        && !isEmpty(sampleServerHost)
                        && !(checkCallbacks(
                            sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL))
                            ? (
                                <Message warning>
                                    <p>
                                        In order to try out the sample, you need to
                                        add <strong>
                                        { sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL }
                                    </strong>  and <strong>
                                        { sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home }
                                    </strong>  to <strong>Authorized redirect URLs</strong>
                                        <Button
                                            className="warning"
                                            floated="right"
                                            onClick={
                                                () => handleAddCallback([sampleServerHost +
                                                    SDKMeta.tomcatOIDCAgent.sample.sigInRedirectURL,
                                                    sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home],
                                                    sampleServerHost)
                                            }
                                        >
                                            Add Now
                                        </Button>
                                    </p>
                                </Message>
                            )
                            : null
                    }

                    <div className="code-segment" data-suppress="">
                        <CodeEditor
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            language="htmlmixed"
                            sourceCode={
                                generateIntegrateCode(SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE)
                            }
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

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return (
                <>
                    <Text>
                        Double click the <code className="inline-code">PickupManagerOIDC-v0.1.1.msi</code> and
                        follow the on-screen guidance until you get to the app configuration window.
                    </Text>
                    <Text>
                        Fill the corresponding fields with the following information.
                    </Text>
                    <div className="code-segment">
                        <CodeEditor
                            oneLiner
                            readOnly
                            withClipboardCopy
                            showLineNumbers
                            className="application-sample-config-editor"
                            language="htmlmixed"
                            sourceCode={ generateIntegrateCode(technology) }
                            beautify={ true }
                            options={ {
                                lineWrapping: true
                            } }
                            height="100%"
                            theme="dark"
                        />
                    </div>
                    <Divider hidden/>
                    <Text>
                        Continue the on-screen guidance and complete the installation.
                    </Text>
                </>
            );
        }

        return null;
    };

    const generateRunStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactNode => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return (
                <>
                    <Text>
                        Now that you have added the relevant configurations, restart the <strong>Tomcat</strong> server,
                        for the newly added changes to be applied to the application.
                    </Text>
                    {
                        !isEmpty(sampleServerHost) && (
                            <Text>
                                Try out the application by accessing the URL <a
                                href={ sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link external"
                            >
                                { sampleServerHost + SDKMeta.tomcatOIDCAgent.sample.home }</a>
                            </Text>
                        )
                    }
                    { renderAddUserStep() }
                </>
            );
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return (
                <>
                    <Text>
                        Once the installation is complete the <code className="inline-code">
                        Pickup Manager - OIDC v0.1.1</code> application will be launched automatically.
                        You can always re-launch the application by double clicking on the
                        <code className="inline-code">Pickup Manager - OIDC v0.1.1</code> application
                        available on your Desktop.
                    </Text>
                    { renderAddUserStep() }
                </>
            );
        }

        return null;
    };

    const renderAddUserStep = (): ReactElement => {

        return (
            <div className="add-user-step">
                <Message info className="add-user-info">
                    { <AddUserStepContent/> }
                </Message>
            </div>
        );
    }

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

    const renderPrerequisitesStep = (technology: SupportedTraditionalOIDCAppTechnologyTypes): ReactElement => {

        if (!(technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE
            || technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET)) {

            return null;
        }

        const generateContent = () => {

            if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
                return (
                    <>
                        <Text>
                            You will  need to have <strong>Apache Tomcat 8.x or 9.x</strong> installed on
                            your environment to try out the sample.
                        </Text>
                        <Text className={ 'message-info-text' }>To download <strong>Apache Tomcat</strong>,
                            navigate to the official <a
                            href="https://tomcat.apache.org/download-90.cgi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >downloads</a> page.
                        </Text>
                    </>
                );
            }

            if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
                return (
                    <>
                        <Text>
                            You will need to have <strong>Microsoft Windows 8</strong> (Or server equivalent) or
                            greater and <strong>.NET Framework 4.6.1</strong> (or greater)
                            set up on your environment to try out the integration.
                        </Text>
                        <Text className={ 'message-info-text' }>
                            To download <strong>.NET Framework</strong>, navigate to the official <a
                            href="https://dotnet.microsoft.com/download/dotnet-framework/net461"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link external"
                        >downloads</a> page.
                        </Text>
                    </>
                );
            }
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
            { renderPrerequisitesStep(technology) }
            <VerticalStepper
                alwaysOpen
                isSidePanelOpen
                stepContent={ sampleFlowSteps }
                isNextEnabled={ technology !== undefined }
            />
        </>
    );
};
