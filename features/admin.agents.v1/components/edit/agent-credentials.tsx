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
import { Button, CopyInputField, EmphasizedSegment, Heading, Message, PrimaryButton } from "@wso2is/react-components";
import React, { Fragment } from "react";
import { Divider, Grid as SemanticGrid } from "semantic-ui-react";

interface AgentCredentialsProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentCredentials({
    agentId,
    ["data-componentid"]: componentId = "agent-credentials"
}: AgentCredentialsProps) {
    const regenerateAgentScret = () => {
        /** TODO Impl. */
    };

    return (
        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <Typography variant="h4">Credentials</Typography>
            <Typography variant="body1" className="mt-1 mb-5" style={ { color: "#9c9c9c" } }>
                Authentication details for this agent to securely access applications and API resources.
            </Typography>
            <Grid container>
                <Grid xs={ 8 }>
                    <div style={ { marginBottom: "20px" } }>
                        <label>Agent ID</label>
                        <CopyInputField value={ "dZBvthATdJmUNb_knryEiKZ26Xoa" } />
                    </div>

                    <Divider />
                    <Heading as="h4">Agent secret</Heading>

                    <Message info>
                        If you’ve lost or forgotten the agent secret, you can regenerate it, but be aware that any
                        scripts or applications using the current agent secret will need to be updated.
                    </Message>
                    <div style={ { display: "flex", flexDirection: "row" } }>
                        <CopyInputField
                            secret
                            showSecret={ false }
                            value={ "sdjskjksjkdjkjsdk" }
                            hideSecretLabel={ "Hide secret" }
                            showSecretLabel={ "Show secret" }
                            data-componentid={ "client-secret-readonly-input" }
                        />
                        <Button
                            color="red"
                            onClick={ regenerateAgentScret }
                            style={ { marginLeft: "10px" } }
                            data-testid={ `${componentId}-oidc-regenerate-button` }
                        >
                            Regenerate
                        </Button>
                    </div>

                    <>
                        <Divider />
                        <Divider hidden />
                        <SemanticGrid.Row columns={ 1 }>
                            <SemanticGrid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">Certificate</Heading>
                                <Button
                                    basic
                                    primary
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${componentId}-submit-button` }
                                >
                                    Generate Certificate
                                </Button>
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </>

                    <PrimaryButton className="mt-5">Update</PrimaryButton>
                </Grid>
            </Grid>
        </EmphasizedSegment>
    );
}
