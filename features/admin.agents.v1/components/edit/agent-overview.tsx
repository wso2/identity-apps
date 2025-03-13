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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { EmphasizedSegment, Hint, PrimaryButton } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "semantic-ui-react";

interface AgentOverviewProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentOverview({ agentId }: AgentOverviewProps) {

    const dispatch: any = useDispatch();

    const [ initialValues, setInitialValues ] = useState<any>();

    useEffect(() => {
        if (agentId) {
            const agents: any = JSON.parse(localStorage.getItem("agents"));

            const agent: any = agents.find((agent: any) => agent.id === agentId);

            if (agent) {
                setInitialValues({
                    description: agent.description,
                    logo: agent.logo,
                    name: agent.name
                });
            }
        }
    },[ agentId ]);

    return (
        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <FinalForm
                onSubmit={ (values: any) => {
                    try {
                        const agents: any = JSON.parse(localStorage.getItem("agents"));

                        const editingAgent: any = agents.find((agent: any) => agent.id === agentId);

                        editingAgent.name = values.name;
                        editingAgent.description = values.description;
                        editingAgent.logo = values.logo;

                        const updatedAgentList: any = agents.filter((agent: any) => agent.id !== agentId);

                        updatedAgentList.push(editingAgent);

                        localStorage.setItem("agents", JSON.stringify(updatedAgentList));

                        dispatch(addAlert({
                            description: "Agent information updated successfully.",
                            level: AlertLevels.SUCCESS,
                            message: "Updated successfully"
                        }));
                    } catch (err) {
                        dispatch(addAlert({
                            description: "An error occurred when updating agent information.",
                            level: AlertLevels.ERROR,
                            message: "Something went wrong"
                        }));
                    }

                } }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    return (
                        <form onSubmit={ handleSubmit } style={ { display: "flex", flexDirection: "column" } }>
                            <FinalFormField
                                name="name"
                                label="Name"
                                component={ TextFieldAdapter }
                            ></FinalFormField>
                            <FinalFormField
                                name="description"
                                className="pt-3"
                                label="Description"
                                multiline
                                rows={ 4 }
                                maxRows={ 6 }
                                component={ TextFieldAdapter }
                            ></FinalFormField>
                            <FinalFormField
                                name="logo"
                                label="Logo"
                                className="pt-3"
                                component={ TextFieldAdapter }
                                helperText={
                                    (<Hint compact className="hint">
                                        An image URL for the application. If this is not provided, we will display a
                                        generated thumbnail instead. Recommended size: 200x200 pixels.
                                    </Hint>)
                                }
                            ></FinalFormField>
                            <Form.Group>
                                <PrimaryButton type="submit" className="mt-5">
                                    Update
                                </PrimaryButton>
                            </Form.Group>
                        </form>
                    );
                } }
                initialValues={ initialValues }
            ></FinalForm>
        </EmphasizedSegment>
    );
}
