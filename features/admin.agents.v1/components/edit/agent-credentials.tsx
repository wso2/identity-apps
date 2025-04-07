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
import {
    ApplicationCertificateWrapper
} from "@wso2is/admin.applications.v1/components/settings/certificate/application-certificate-wrapper";
import { SupportedAuthProtocolTypes } from "@wso2is/admin.applications.v1/models/application-inbound";

import { IdentifiableComponentInterface } from "@wso2is/core/models";

import { Button, Code, CopyInputField, EmphasizedSegment, Heading, PrimaryButton } from "@wso2is/react-components";
import { t } from "i18next";
import React, { Fragment } from "react";
import { Trans } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { Grid as SemanticGrid } from "semantic-ui-react";

interface AgentCredentialsProps extends IdentifiableComponentInterface {
    agentId: string;
}

const certificateOptions: any = [
    {
        label: "None",
        value: "none"
    },
    {
        label: "JWKS URL",
        value: "jwks"
    },
    {
        label: "Provide certificate",
        value: "certificate"
    }
];

export default function AgentCredentials({
    agentId,
    ["data-componentid"]: componentId = "agent-credentials"
}: AgentCredentialsProps) {
    return (
        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <Typography variant="h4">
                Credentials
            </Typography>
            <Typography variant="body1" className="mt-1 mb-5" style={ { color: "#9c9c9c" } }>
            Authentication details for this agent to securely access applications and API resources.
            </Typography>
            <Grid container>
                <Grid xs={ 8 }>
                    <div style={ { marginBottom: "20px" } }>
                        <label>Client ID</label>
                        <CopyInputField value={ "dZBvthATdJmUNb_knryEiKZ26Xoa" } />
                    </div>

                    <label className="mt-5">Client secret</label>
                    <div style={ { display: "flex", flexDirection: "row" } }>
                        <CopyInputField
                            secret
                            value={ "sdjskjksjkdjkjsdk" }
                            hideSecretLabel={ "Hide secret" }
                            showSecretLabel={ "Show secret" }
                            data-componentid={ "client-secret-readonly-input" }
                        />
                        <Button
                            color="red"
                            className="oidc-action-button"
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
                                <Heading as="h4">
                        Certificate
                                </Heading>
                                <Button
                                    basic
                                    primary
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ componentId }-submit-button` }
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
