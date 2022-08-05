/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CodeEditor } from "@wso2is/react-components";
import { Divider, Button, Icon, Card, Form } from "semantic-ui-react";
import {
    getInboundProtocolConfig,
    ApplicationInterface,
    SupportedAuthProtocolTypes
} from "../../../../features/applications";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { store, toggleHelpPanelVisibility, AppState } from "../../../../features/core";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { VerticalStepper } from "./vertical-stepper";
import { ReactComponent as AngularIcon } from "../../../assets/images/icons/angular-icon.svg";
import { ReactComponent as ReactIcon } from "../../../assets/images/icons/react-icon.svg";

interface IntegrateAppComponentProps extends TestableComponentInterface {
    applicationType: string;
    application: ApplicationInterface;
}

/**
 * Integrate Application flow component
 * @param props props required for component
 */
export const IntegrateAppComponent: FunctionComponent<IntegrateAppComponentProps> = (
    props: IntegrateAppComponentProps
): ReactElement => {

    const {
        applicationType,
        application,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const deploymentConfigs = store.getState().config.deployment;
    const [ inboundProtocolConfigs, setInboundProtocolConfigs ] = useState(undefined);
    const [ authConfig, setAuthConfig ] = useState(undefined);
    const [ integrateCode, setIntegrateCode ] = useState("");
    const [ selectedWebAppTechnology, setSelectedWebAppTechnology ] = useState("");
    const [ callBackUrlSelection, setCallBackUrlSelection ] = useState<any[]>([]);
    const [ selectedLoginCallBack, setSelectedLoginCallBack ] = useState<any>("");
    const [ selectedLogoutCallBack, setSelectedLogoutCallBack ] = useState<any>("")
    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState<boolean>(false);
    const helpPanelVisibilityGlobalState: boolean = useSelector((state: AppState) => state.helpPanel.visibility);



    // TODO : Move get configs to util function
    useEffect(() => {
        if ( application === undefined ) {
            return;
        }

        let protocolConfigs: any = {};
        const selectedProtocolList: string[] = [];

        application?.inboundProtocols?.map((protocol) => {

            const protocolName = mapProtocolTypeToName(protocol.type);

            getInboundProtocolConfig(application.id, protocolName)
                .then((response) => {
                    protocolConfigs = {
                        ...protocolConfigs,
                        [protocolName]: response
                    };

                    selectedProtocolList.push(protocolName);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {
                    setInboundProtocolConfigs(protocolConfigs);
                    const urlArray = protocolConfigs?.oidc ?
                        EncodeDecodeUtils.decodeURLRegex(protocolConfigs?.oidc?.callbackURLs[0]) : undefined;

                    if (urlArray && urlArray.length > 1) {
                        urlArray.forEach((callbackUrl) => {
                            setCallBackUrlSelection(prevItems => [...prevItems, {
                                key: callbackUrl, text: callbackUrl, value: callbackUrl
                            }])
                        })
                    }
                });
        });
    },  [ application ]);

    useEffect(() => {
        if (inboundProtocolConfigs == undefined) {
            return;
        }

        const configs = inboundProtocolConfigs.oidc
            ? {
                clientHost: deploymentConfigs.clientHost,
                clientID: inboundProtocolConfigs.oidc.clientId,
                loginCallbackURL: callBackUrlSelection.length > 1
                    ? selectedLoginCallBack
                    : inboundProtocolConfigs.oidc.callbackURLs[0],
                logoutCallbackURL: callBackUrlSelection.length > 1
                    ? selectedLogoutCallBack
                    : inboundProtocolConfigs.oidc.callbackURLs[0],
                serverOrigin: deploymentConfigs.serverOrigin,
                tenant: deploymentConfigs.tenant,
                tenantPath: deploymentConfigs.tenantPath
            }
            : undefined;

        setAuthConfig(configs);
        setIntegrateCode(`import { IdentityAuth } from "@wso2/identity-oidc-js";

/**
 * Minimal required configuration sample to initialize the client
 */
const authConfig = {
    loginCallbackURL: "${ callBackUrlSelection.length > 1 ? selectedLoginCallBack : configs?.loginCallbackURL }",
    logoutCallbackURL: "${ callBackUrlSelection.length > 1 ? selectedLogoutCallBack : configs?.logoutCallbackURL }",
    clientHost: "` + configs?.clientHost + `",
    clientID: "` + configs?.clientID + `",
    serverOrigin: "` + configs?.serverOrigin + `"
};

/**
 * Initialize authClient
 */
const authClient = new IdentityAuth(authConfig);

/**
 * Trigger sign in
 */
authClient.signIn().then((response) => {
// Response with basic user details upon logged in
});
                            `);
    }, [ inboundProtocolConfigs, callBackUrlSelection, selectedLoginCallBack, selectedLogoutCallBack ]);

    /**
     * Todo Remove this mapping and fix the backend.
     */
    const mapProtocolTypeToName = ((type: string): string => {
        let protocolName = type;
        if (protocolName === "oauth2") {
            protocolName = SupportedAuthProtocolTypes.OIDC;
        } else if (protocolName === "passivests") {
            protocolName = SupportedAuthProtocolTypes.WS_FEDERATION;
        } else if (protocolName === "wstrust") {
            protocolName = SupportedAuthProtocolTypes.WS_TRUST;
        } else if (protocolName === "samlsso") {
            protocolName = SupportedAuthProtocolTypes.SAML;
        }

        return protocolName;
    });

    const webAppContent = [ {
        stepTitle: `Select Application Type ${selectedWebAppTechnology ? "(" + selectedWebAppTechnology + ")" : ""}`,
        stepContent: (
            <>
                <p>Choose the technology that your application is built on.</p>
                <Card.Group itemsPerRow={ helpPanelVisibilityGlobalState ? 5 : 9 }>
                    <Card
                        raised={ false }
                        data-testid={ `${ testId }-technology-react` }
                        className={ `basic-card tech-selection ${selectedWebAppTechnology === "React" ? "selected" : "" } ` }
                        onClick={ ()=> {
                            setSelectedWebAppTechnology("React")
                        } }
                    >
                        <Card.Content textAlign={ "center" }>
                            <ReactIcon />
                            <Card.Description>
                                ReactJS
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <Card
                        raised={ false }
                        data-testid={ `${ testId }-technology-angular` }
                        className={ `basic-card tech-selection ${selectedWebAppTechnology === "Angular" ? "selected" : "" } ` }
                        onClick={ ()=> {
                            setSelectedWebAppTechnology("Angular")
                        } }
                    >
                        <Card.Content textAlign={ "center" }>
                            <AngularIcon />
                            <Card.Description>
                                Angular
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </>
        )
    }, {
        stepTitle: "Install SDK",
        stepContent: (
            <>
                <p>Run below command to install JavaScript OIDC SDK from NPM registry</p>
                <code>npm install @wso2/identity-oidc-js</code>
            </>
        )
    }, {
        stepTitle: "Add Asgardio to your app",
        stepContent: (
            <>
                <p>Copy and paste below code based on the technology that your app is built on.</p>
                {
                    callBackUrlSelection.length > 1 &&
                    <>
                        <Form>
                            <Form.Group widths='3'>
                                <Form.Select
                                    fluid
                                    onChange={ (value, data) => {
                                        setSelectedLoginCallBack(data.value)
                                    } }
                                    label='Select login callback URL:'
                                    options={ callBackUrlSelection }
                                    placeholder='Login Callback URL'
                            />
                            </Form.Group>
                            <Form.Group widths='3'>
                                <Form.Select
                                    fluid
                                    onChange={ (value, data) => {
                                        setSelectedLogoutCallBack(data.value);
                                    } }
                                    label='Select logout callback URL:'
                                    options={ callBackUrlSelection }
                                    placeholder='Logout Callback URL'
                            />
                            </Form.Group>
                        </Form>
                        <Divider hidden/>
                    </>
                }
                <div className="code-segment">
                    { selectedWebAppTechnology === "React" &&
                        <>
                            <div 
                                data-testid={ `${ testId }-react-config` } 
                                className="action-buttons"
                            >
                                <Button basic size='tiny' className="copy-config" icon>
                                    <Icon name='copy' />
                                </Button>
                                <Button className="download-config" size='tiny' basic onClick={ () => {
                                    dispatch(toggleHelpPanelVisibility(true));
                                    setIsSidePanelOpen(true);
                                    // TODO: IMPORTANT Remove this once scroll is fixed.
                                    window.scrollTo(0,0);
                                } }>
                                    Configuration Help
                                </Button>
                            </div>
                            <CodeEditor
                                showLineNumbers={ false }
                                language="javascript"
                                sourceCode={ integrateCode }
                                options={ {
                                    gutters: []
                                } }
                                theme={ "light" }
                                readOnly={ true }
                            />
                        </>
                    }
                    {
                        selectedWebAppTechnology === "Angular" &&
                        <>
                            <div 
                                data-testid={ `${ testId }-angular-config` } 
                                className="action-buttons"
                            >
                                <Button basic size='tiny' className="copy-config" icon>
                                    <Icon name='copy' />
                                </Button>
                                <Button className="download-config" size='tiny' basic onClick={ () => {
                                    dispatch(toggleHelpPanelVisibility(true));
                                    setIsSidePanelOpen(true)
                                    // TODO: IMPORTANT Remove this once scroll is fixed.
                                    window.scrollTo(0,0);
                                } }>
                                    Configuration Help
                                </Button>
                            </div>
                            <CodeEditor
                                showLineNumbers={ false }
                                language="javascript"
                                sourceCode={ integrateCode }
                                options={ {
                                    gutters: []
                                } }
                                theme={ "light" }
                                readOnly={ true }
                            />
                        </>
                    }
                </div>
            </>
        )
    } ]

    const webPageContent = [ {
        stepTitle: "Add Asgardio to your app",
        stepContent: (
            <>
                <p>Copy and paste below code based on the technology that your app is built on.</p>
                {
                    callBackUrlSelection.length > 1 &&
                    <>
                        <Form>
                            <Form.Group widths='3'>
                                <Form.Select
                                    fluid
                                    onChange={ (value, data) => {
                                        setSelectedLoginCallBack(data.value)
                                    } }
                                    label='Select login callback URL:'
                                    options={ callBackUrlSelection }
                                    placeholder='Login Callback URL'
                            />
                            </Form.Group>
                            <Form.Group widths='3'>
                                <Form.Select
                                    fluid
                                    onChange={ (value, data) => {
                                        setSelectedLogoutCallBack(data.value)
                                    } }
                                    label='Select logout callback URL:'
                                    options={ callBackUrlSelection }
                                    placeholder='Logout Callback URL'
                            />
                            </Form.Group>
                        </Form>
                        <Divider hidden/>
                    </>
                }
                <div className="code-segment" >
                    <div className="action-buttons">
                        <Button basic size='tiny' className="copy-config" icon>
                            <Icon name='copy' />
                        </Button>
                        <Button className="download-config" size='tiny' basic onClick={ () => {
                            dispatch(toggleHelpPanelVisibility(true));
                            // TODO: IMPORTANT Remove this once scroll is fixed.
                            window.scrollTo(0,0);
                        } }>
                            Configuration Help
                        </Button>
                    </div>
                    <CodeEditor
                        showLineNumbers={ false }
                        language="htmlmixed"
                        beautify
                        sourceCode={ `<script
    type="application/javascript"
    src="http://unpkg.com/@wso2/identity-oidc-js@0.1.0/bundle/wso2-identity-oidc.standalone.js">
</script>

<script>

    var webAppOrigin = "` + authConfig?.loginCallbackURL + `";

    const authConfig = {
        // Web App URL
        clientHost: webAppOrigin,

        // ClientID generated for the application
        clientID: "` + authConfig?.clientID + `",

        // After login callback URL - We have use app root as this is a SPA
        // (Add it in application OIDC settings "Callback Url")
        loginCallbackURL: webAppOrigin,

        // After logout callback URL - We have use app root as this is a SPA
        // (Add it in application OIDC settings "Callback Url")
        logoutCallbackURL: webAppOrigin,

        // WSO2 Identity Server URL
        serverOrigin: "https://asgardio.io",

        // Tenant Details: Enable if needed only
        // tenant: "demo.com",
        // tenantPath: "/t/demo.com"
    };

</script>` }
                        options={ {
                            gutters: []
                        } }
                        theme={ "light" }
                        readOnly={ true }
                    />
                </div>
            </>
        )
    } ]

    return (
        applicationType === "Web Application" ?
            <VerticalStepper stepContent={ webPageContent } isSidePanelOpen />
        :
            <VerticalStepper
                stepContent={ webAppContent }
                isNextEnabled={ selectedWebAppTechnology !== "" }
                isSidePanelOpen
            />
    )
};
