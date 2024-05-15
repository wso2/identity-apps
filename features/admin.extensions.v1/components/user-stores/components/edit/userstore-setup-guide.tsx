/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
    ContentLoader,
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Message,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Icon } from "semantic-ui-react";
import { AppConfigs } from "../../../../../admin.core.v1/configs/app-configs";
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

    const { getLink } = useDocumentation();

    const [ isTokenGenerated, setIsTokenGenerated ] = useState<boolean>(false);
    const [ isConnectionTested, setIsConnectionTested ] = useState<boolean>(false);
    const [ connectionStatus, setConnectionStatus ] = useState<boolean>(undefined);
    const [ isAgentConnectionsRequestLoading, setIsAgentConnectionsRequestLoading ] = useState<boolean>(false);
    const [ accessToken, setAccessToken ] = useState<string>("");
    const { t } = useTranslation();

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
            .then((response: any) => {
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

        const userStoreID: string = userStoreId.split("#")[0];
        const data: any = { userStoreId: userStoreID };

        generateToken(data)
            .then((response: any) => {
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
                    window.open(
                        AppConfigs.getAppUtils().getConfig().extensions.userStoreAgentUrl +
                        RemoteUserStoreMeta.userStoreAgent.artifact, "_blank",
                        "noopener, noreferrer"
                    );
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
                    <Message
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
                        Generate a new installation token which will require when you try to connect your remote user
                        store through the user store agent.
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
                { t("extensions:manage.features.userStores.edit." +
                    "setupGuide.steps.configureProperties.description") }
            </Text>
            <Divider hidden />
            <Text weight="500">
                See the
                <DocumentationLink
                    link={ getLink("manage.userStores.userStoreProperties.learnMore") }
                >
                    Asgardeo documentation
                </DocumentationLink> for the complete list of user store configuration properties.
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
                the installation token on prompt.
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
                                    <Message
                                        type="error"
                                        content={
                                            (<>
                                                { t("extensions:manage.features.userStores.edit." +
                                                    "setupGuide.steps.tryAgain.info") }
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
                                            </>)
                                        }
                                    />
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
            <Message
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
                                    Follow the steps given below to configure the user store agent,
                                    which connects the remote user store to Asgardeo
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
