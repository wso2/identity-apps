/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    CodeEditor,
    ContentLoader,
    CopyInputField,
    EmphasizedSegment,
    Heading,
    MessageWithIcon,
    Text,
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Divider, Grid, Icon, Message } from "semantic-ui-react";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "../../../component-extensions";
import { generateToken, getAgentConnections } from "../../api";
import { RemoteUserStoreMeta } from "../../constants";
import { AgentConnectionInterface } from "../../models";

/**
 * Props for the remote customer user store page.
 */
interface SetupGuideTabPropsInterface extends TestableComponentInterface {
    /**
     * User store ID
     */
    userStoreId: string;
    /**
     * Flag to check if the user store is created.
     */
    isUserStoreLoading: boolean;
}

/**
 * A function returning a ReactElement to render tab panes.
 */
export const SetupGuideTab: FunctionComponent<SetupGuideTabPropsInterface> = (
    props: SetupGuideTabPropsInterface
): ReactElement => {

    const {
        isUserStoreLoading,
        userStoreId,
        [ "data-testid" ]: testId
    } = props;

    const [ isTokenGenerated, setIsTokenGenerated ] = useState<boolean>(false);
    const [ isConnectionTested, setIsConnectionTested ] = useState<boolean>(false);
    const [ connectionStatus, setConnectionStatus ] = useState<boolean>(undefined);
    const [ isAgentConnectionsRequestLoading, setIsAgentConnectionsRequestLoading ] = useState<boolean>(false);
    const [ accessToken, setAccessToken ] = useState<string>("");

    useEffect(() => {
        if (accessToken) {
            setIsTokenGenerated(true);
        }
    }, [ accessToken ]);

    useEffect(() => {
        if (!isConnectionTested) {
            return;
        }

        if (isConnectionTested) {
            fetchAgentConnectionList();
        }
    }, [ isConnectionTested ]);

    useEffect(() => {
        if (!connectionStatus) {
            setIsConnectionTested(false);
        }
    }, [ connectionStatus ]);

    /**
     * The following function handles fetching the agent connections.
     */
    const fetchAgentConnectionList = () => {
        setIsAgentConnectionsRequestLoading(true);
        getAgentConnections(userStoreId)
            .then((response) => {
                response.map((connection: AgentConnectionInterface) => {
                    if (connection.agent && connection.connected) {
                        setConnectionStatus(connection.connected);
                        return;
                    }
                });
            })
            .finally(() => {
                setIsAgentConnectionsRequestLoading(false);
            });
    };

    /**
     * The following function handles generating the token.
     */
    const handleGenerateToken = () => {

        const data = { userStoreId: userStoreId }

        generateToken(data)
            .then((response) => {
                setAccessToken(response.token);
            });
    };

    /**
     * The following function renders the download agent step.
     */
    const resolveDownloadAgentStep = () => (
        <>
            <Text>
                Download and unzip the user store agent.
            </Text>
            <Button
                basic
                color="orange"
                onClick={ () => {
                    window.open(RemoteUserStoreMeta.userStoreAgent.artifact, "");
                } }
            >
                Download the agent
                <Icon name="download" className="ml-3" />
            </Button>
        </>
    );

    /**
     * The following function renders the token generation step.
     */
    const resolveGenerateTokenStep = () => {
        if (isTokenGenerated) {
            return (
                <>
                    <MessageWithIcon
                        content="Make sure to note down the installation token as it will be required when
                                running the user store agent. You won’t be able to see it again!"
                        type="warning"
                    />
                    <label>
                        Installation token
                    </label>
                    <CopyInputField
                        value={ accessToken ? accessToken : "" }
                        data-testid={ `${ testId }-client-secret-readonly-input` }
                    />
                </>
            );
        } else {
            return (
                <>
                    <Text>
                        Generate a new access token which will require when you try to connect your remote user store
                        through the user store agent.
                    </Text>
                    <Button color="orange" basic onClick={ handleGenerateToken }>
                        Generate token
                    </Button>
                </>
            );
        }
    };

    /**
     * The following function renders configuring user store properties step.
     */
    const resolveConfigureUserStoreStep = () => (
        <>
            <Text>
                Configure the properties of the local user store in the deployment.config.toml file that is found in
                the user store agent distribution depending on your requirements.
            </Text>
            <Divider hidden />
            <Text weight="500">
                See the <a>Asgardeo documentation</a> for the complete list of userstore configuration properties.
            </Text>
        </>
    );

    /**
     * The following function renders the Run agent step.
     */
    const resolveRunAgentStep = () => (
        <>
            <Text>
                Execute one of the following commands based on your operating system. Enter
                the <code className="inline-code">installation_token</code> on prompt.
            </Text>
            <Divider hidden/>
            <strong>
                On Linux/Mac OS
            </strong>
            <CodeEditor
                oneLiner
                readOnly
                withClipboardCopy
                language="javascript"
                sourceCode="sh wso2agent.sh"
            />
            <Divider hidden/>
            <strong>
                On Windows
            </strong>
            <CodeEditor
                oneLiner
                readOnly
                withClipboardCopy
                language="javascript"
                sourceCode="wso2agent.bat  -- run"
            />
            <Divider hidden/>
            { resolveConnectionSection() }
        </>
    );

    /**
     * The following function renders the check connection section.
     */
    const resolveConnectionSection = () => (
        <>
            <Text>
                Once the user store agent is connected successfully the message <strong>Agent successfully connected to
                Asgardeo</strong> will be displayed in the terminal.
            </Text>
            {
                !isAgentConnectionsRequestLoading && isConnectionTested
                    ? (
                        connectionStatus !== undefined && connectionStatus
                            ? (
                                <Button basic color="green">
                                    <Icon name="check" color="green"/>
                                    Successfully Connected
                                </Button>
                            ) : (
                                <>
                                    <Message inline negative>
                                        No user store agents connected. Check the agent terminal and try again.
                                        <Button
                                            floated="right"
                                            inline
                                            basic
                                            color="orange"
                                            loading={ isAgentConnectionsRequestLoading }
                                            onClick={ () => fetchAgentConnectionList() }
                                        >
                                            Try Again
                                        </Button>
                                    </Message>
                                </>
                            )
                    )
                    : (
                        <Button
                            basic
                            color="orange"
                            loading={ isAgentConnectionsRequestLoading }
                            onClick={ () => setIsConnectionTested(true) }
                        >
                            Check Connections
                        </Button>
                    )
            }
            <Divider hidden/>
            <MessageWithIcon
                type="warning"
                header="What's Next?"
                content="Update the attribute mappings according to remote user store type that you connected.
                Make sure to review the mapped attributes otherwise it may cause errors in the user listings."
            />
        </>
    );

    const setupGuideSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: resolveDownloadAgentStep(),
            stepTitle: "Download the agent"
        },
        {
            stepContent: resolveConfigureUserStoreStep(),
            stepTitle: "Configure local user store properties"
        },
        {
            stepContent: resolveGenerateTokenStep(),
            stepTitle: "Generate new token"
        },
        {
            stepContent: resolveRunAgentStep(),
            stepTitle: "Run the agent"
        }
    ];

    return (
        <>
            {
                !isUserStoreLoading
                    ? (
                        <EmphasizedSegment padded="very">
                            <Heading as="h3">
                                Connect the remote user store
                                <Heading subHeading as="h6">
                                    Follow the steps given below to configure the user store agent, which connects the remote user
                                    store to Asgardeo
                                </Heading>
                            </Heading>
                            <Divider hidden/>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 16 } >
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column width={ 10 } >
                                                    <VerticalStepper
                                                        alwaysOpen={ true }
                                                        isSidePanelOpen={ false }
                                                        stepContent={ setupGuideSteps }
                                                        isNextEnabled={ true }
                                                        data-testid={ `${ testId }-vertical-stepper` }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </EmphasizedSegment>
                    ) : (
                        <ContentLoader/>
                    )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
SetupGuideTab.defaultProps = {
    "data-testid": "user-store-setup-guide"
};
