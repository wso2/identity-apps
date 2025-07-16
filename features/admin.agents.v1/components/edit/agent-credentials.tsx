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
import { generatePassword, getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models/validation-config";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Button, CopyInputField, EmphasizedSegment, Message } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { AgentSecretShowModal } from "./agent-secret-show-modal";
import { updateAgentPassword } from "../../api/agents";

interface AgentCredentialsProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentCredentials({
    agentId,
    ["data-componentid"]: componentId = "agent-credentials"
}: AgentCredentialsProps) {
    const { data: validationData } = useValidationConfigData();

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const passwordValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getConfiguration(validationData);
    }, [ validationData ]);

    const [ isSecretRegenerationLoading, setIsSecretRegenerationLoading ] = React.useState<boolean>(false);
    const [ isAgentCredentialWizardOpen, setIsAgentCredentialWizardOpen ] = React.useState<boolean>(false);
    const [ newAgentSecret, setNewAgentSecret ] = React.useState<string>("");

    const regenerateAgentScret = () => {
        setIsSecretRegenerationLoading(true);

        const newPassword: string = generatePassword(
            Number(passwordValidationConfig.minLength),
            Number(passwordValidationConfig.minLowerCaseCharacters) > 0,
            Number(passwordValidationConfig.minUpperCaseCharacters) > 0,
            Number(passwordValidationConfig.minNumbers) > 0,
            Number(passwordValidationConfig.minSpecialCharacters) > 0,
            Number(passwordValidationConfig.minLowerCaseCharacters),
            Number(passwordValidationConfig.minUpperCaseCharacters),
            Number(passwordValidationConfig.minNumbers),
            Number(passwordValidationConfig.minSpecialCharacters),
            Number(passwordValidationConfig.minUniqueCharacters)
        );

        setNewAgentSecret(newPassword);

        updateAgentPassword(
            agentId,
            newPassword
        ).then(() => {
            setIsAgentCredentialWizardOpen(true);
        }).catch((_error: AxiosError) => {
            // Handle error during regeneration of agent secret.
            dispatch(addAlert({
                description: t("agents:edit.credentials.regenerate.alerts.error.description"),
                level: AlertLevels.ERROR,
                message: t("agents:edit.credentials.regenerate.alerts.error.message")
            }));
        }).finally(() => {
            setIsSecretRegenerationLoading(false);
        });
    };

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
                    <Typography variant="body1">Agent secret</Typography>
                    <Message warning>
                        <strong>Before regenerating:</strong> Make sure you are ready to update all
                        applications using the new agent secret. Once regenerated,
                        <ul>
                            <li>All scripts and applications that use the current agent secret will
                                stop working immediately</li>
                            <li>You will need to update the agent secret in all integrations</li>
                            <li>The current agent secret cannot be recovered once regenerated</li>
                        </ul>
                    </Message>
                    <Button
                        color="red"
                        loading={ isSecretRegenerationLoading }
                        disabled={ isSecretRegenerationLoading }
                        onClick={ regenerateAgentScret }
                        data-componentid={ `${componentId}-agent-secret-regenerate-button` }
                    >
                        { isSecretRegenerationLoading ? "Regenerating" : "Regenerate" }
                    </Button>
                </Grid>
            </Grid>
            <AgentSecretShowModal
                title="Regenerated Agent Secret"
                agentId={ agentId }
                agentSecret={ newAgentSecret }
                isOpen={ isAgentCredentialWizardOpen }
                onClose={ () => {
                    setIsAgentCredentialWizardOpen(false);
                } }
            />
        </EmphasizedSegment>
    );
}
