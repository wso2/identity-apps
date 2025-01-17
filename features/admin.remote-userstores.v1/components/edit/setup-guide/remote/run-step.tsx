/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";
import { CheckIcon } from "@oxygen-ui/react-icons";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CodeEditor, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetUserStoreAgentConnections from "../../../../api/use-get-user-store-agent-connections";
import { AgentConnectionInterface } from "../../../../models/remote-user-stores";

interface RunAgentStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store id.
     */
    userStoreId: string;
    /**
     * User store manager type.
     */
    userStoreManager: RemoteUserStoreManagerType;
}

/**
 * Run agent step component for Remote user store manager.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const RunAgentStep: FunctionComponent<RunAgentStepPropsInterface> = ({
    userStoreId,
    userStoreManager,
    ["data-componentid"]: componentId = "run-agent-step"
}: RunAgentStepPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ shouldCheckStatus, setShouldCheckStatus ] = useState(false);

    const {
        data: agentConnectionsData,
        isLoading: isAgentConnectionsRequestLoading,
        error: agentConnectionsRequestError,
        mutate: fetchAgentConnectionList
    } = useGetUserStoreAgentConnections(userStoreId, userStoreManager, shouldCheckStatus);

    /**
     * Handle the agent connection request error.
     */
    useEffect(() => {
        if (agentConnectionsRequestError) {
            dispatch(
                addAlert({
                    description: t("remoteUserStores:notifications.connectionStatusCheckError.description"),
                    level: AlertLevels.ERROR,
                    message: t("remoteUserStores:notifications.connectionStatusCheckError.message")
                })
            );
        }
    }, [ agentConnectionsRequestError ]);

    /**
     * Renders the connection status message/action based on the agent connection data.
     * @returns the check connection button
     */
    const renderConnectionStatus = (): ReactElement => {
        // Render the check connection button if the agent connection data is not available.
        if (!agentConnectionsData && !agentConnectionsRequestError) {
            return (
                <Button
                    variant="outlined"
                    loading={ isAgentConnectionsRequestLoading }
                    onClick={ () => setShouldCheckStatus(true) }
                    data-componentid={ `${componentId}-check-connection-button` }
                >
                    { t("remoteUserStores:pages.edit.guide.steps.run.checkConnection.action") }
                </Button>
            );
        }

        const isConnectionSuccessful: boolean = agentConnectionsData?.some(
            (agentConnection: AgentConnectionInterface) => agentConnection.connected && agentConnection.agent
        );

        // Render the success message if the agent connection data is available and the connection is successful.
        if (isConnectionSuccessful) {
            return (
                <Button
                    variant="outlined"
                    startIcon={ <CheckIcon /> }
                    color="success"
                    data-componentid={ `${componentId}-connection-success-button` }
                >
                    { t("remoteUserStores:pages.edit.guide.steps.run.checkConnection.successAction") }
                </Button>
            );
        }

        // Render the error message if the agent connection data is available and the connection is not successful.
        return (
            <Message
                type="error"
                content={
                    (<>
                        { t("remoteUserStores:pages.edit.guide.steps.run.checkConnection.errorMessage") }
                        <Button
                            variant="outlined"
                            className="btn-try-again"
                            loading={ isAgentConnectionsRequestLoading }
                            onClick={ () => fetchAgentConnectionList() }
                            data-componentid={ `${componentId}-try-again-button` }
                        >
                            { t("remoteUserStores:pages.edit.guide.steps.run.checkConnection.errorAction") }
                        </Button>
                    </>)
                }
                data-componentid={ `${componentId}-connection-error-message` }
            />
        );
    };

    return (
        <>
            <Typography component="p" marginBottom={ 2 }>
                { t("remoteUserStores:pages.edit.guide.steps.run.description.remote") }
            </Typography>

            <strong>{ t("remoteUserStores:pages.edit.guide.steps.run.commands.unix") }</strong>
            <CodeEditor oneLiner readOnly withClipboardCopy language="javascript" sourceCode="./remoteagent" />
            <br />
            <strong>{ t("remoteUserStores:pages.edit.guide.steps.run.commands.windows") }</strong>
            <CodeEditor
                oneLiner
                readOnly
                withClipboardCopy
                language="javascript"
                sourceCode="remoteagent"
            />

            <Typography component="p" marginTop={ 2 } marginBottom={ 1 }>
                <Trans i18nKey="remoteUserStores:pages.edit.guide.steps.run.successMessage.remote">
                    Once the user store agent is connected successfully the message{ " " }
                    <strong>Successfully connected with the server</strong> will be displayed in the terminal.
                </Trans>
            </Typography>
            { renderConnectionStatus() }
        </>
    );
};

export default RunAgentStep;
