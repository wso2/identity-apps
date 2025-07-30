/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { Grid, Typography } from "@mui/material";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Button, CopyInputField, EmphasizedSegment, Message } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { AgentSecretShowModal } from "./agent-secret-show-modal";

interface AgentCredentialsProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentCredentials({
    agentId,
    ["data-componentid"]: componentId = "agent-credentials"
}: AgentCredentialsProps) {
    const { t } = useTranslation();

    const [ isAgentCredentialWizardOpen, setIsAgentCredentialWizardOpen ] = React.useState<boolean>(false);

    return (
        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <Typography variant="h4">{ t("agents:edit.credentials.title") }</Typography>
            <Typography variant="body1" className="mt-1 mb-3" style={ { color: "#9c9c9c" } }>
                { t("agents:edit.credentials.subtitle") }
            </Typography>
            <Grid container>
                <Grid xs={ 8 }>
                    <Typography variant="body1" style={ { marginBottom: "2%" } }>Agent ID</Typography>
                    <CopyInputField value={ agentId } />
                    <Divider />
                    <Typography variant="body1">Agent Secret</Typography>
                    <Message info>
                        If you’ve lost or forgotten the agent secret, you can regenerate it, but be aware that any
                        scripts or applications using the current agent secret will need to be updated.
                    </Message>
                    <Button
                        color="red"
                        onClick={ () => {
                            setIsAgentCredentialWizardOpen(true);
                        } }
                        data-componentid={ `${componentId}-agent-secret-regenerate-button` }
                    >
                        Regenerate
                    </Button>
                </Grid>
            </Grid>
            <AgentSecretShowModal
                agentId={ agentId }
                isOpen={ isAgentCredentialWizardOpen }
                onClose={ () => {
                    setIsAgentCredentialWizardOpen(false);
                } }
                title="Regenerate Agent Secret"
                isForSecretRegeneration
            />
        </EmphasizedSegment>
    );
}
