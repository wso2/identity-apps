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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import { DropdownChild } from "@wso2is/forms";
import { DangerZone, DangerZoneGroup, EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Form, Grid } from "semantic-ui-react";
import { deleteAgent, updateAgent } from "../../api/agents";
import useGetAgent from "../../hooks/use-get-agent";

interface AgentOverviewProps extends IdentifiableComponentInterface {
    agentId: string;
}

export enum ModelType {
    GPT_4 = "gpt_4",
    GPT_4_TURBO = "gpt_4_turbo",
    CLAUDE_3 = "claude_3",
    GEMINI_1_5 = "gemini_1_5",
    MISTRAL_7B = "mistral_7b",
    MIXTRAL = "mixtral",
    LLAMA_3 = "llama_3"
}

const MODEL_TYPES: DropdownChild[] = [
    {
        key: ModelType.GPT_4,
        text: "GPT-4",
        value: ModelType.GPT_4
    },
    {
        key: ModelType.GPT_4_TURBO,
        text: "GPT-4 Turbo",
        value: ModelType.GPT_4_TURBO
    },
    {
        key: ModelType.CLAUDE_3,
        text: "Claude 3",
        value: ModelType.CLAUDE_3
    },
    {
        key: ModelType.GEMINI_1_5,
        text: "Gemini 1.5",
        value: ModelType.GEMINI_1_5
    },
    {
        key: ModelType.MISTRAL_7B,
        text: "Mistral 7B",
        value: ModelType.MISTRAL_7B
    },
    {
        key: ModelType.MIXTRAL,
        text: "Mixtral",
        value: ModelType.MIXTRAL
    },
    {
        key: ModelType.LLAMA_3,
        text: "LLaMA 3",
        value: ModelType.LLAMA_3
    }
];



export default function AgentOverview({ agentId }: AgentOverviewProps) {

    const dispatch: any = useDispatch();
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    const [ initialValues, setInitialValues ] = useState<any>();

    const {
        data: agentInfo
    } = useGetAgent(agentId);

    useEffect(() => {
        if (agentInfo) {
            setInitialValues({
                description: agentInfo?.["urn:scim:schemas:extension:custom:User"]?.agentDescription,
                languageModel: ModelType.GPT_4.toString(),
                logo: agentInfo?.logo,
                name: agentInfo.name?.givenName,
                owner: authenticatedUser,
                version: "1.0.0"
            });
        }
    }, [ agentInfo ]);

    return (
        <>
            <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
                <FinalForm
                    onSubmit={ (values: any) => {

                        const data: PatchRoleDataInterface = {
                            Operations: [
                                {
                                    op: "replace",
                                    value: {
                                        name: {
                                            givenName: values?.name
                                        }
                                    }
                                },
                                {
                                    op: "replace",
                                    value: {
                                        "urn:scim:schemas:extension:custom:User": {
                                            "agentDescription": values?.description
                                        }
                                    }
                                }
                            ],
                            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
                        };

                        updateAgent(agentId, data).then((_response: any) => {
                            dispatch(addAlert({
                                description: "Agent information updated successfully.",
                                level: AlertLevels.SUCCESS,
                                message: "Updated successfully"
                            }));
                        }).catch((_err: unknown) => {
                            dispatch(addAlert({
                                description: "An error occurred when updating agent information.",
                                level: AlertLevels.ERROR,
                                message: "Something went wrong"
                            }));
                        });
                    } }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column computer={ 12 }>
                                        <form
                                            onSubmit={ handleSubmit }
                                            style={ { display: "flex", flexDirection: "column" } }
                                        >
                                            <FinalFormField
                                                name="name"
                                                label="Name"
                                                component={ TextFieldAdapter }
                                            ></FinalFormField>

                                            <div style={ { marginTop: "5%" } }>
                                                <FinalFormField
                                                    key="languageModel"
                                                    width={ 16 }
                                                    FormControlProps={ {
                                                        margin: "dense"
                                                    } }
                                                    ariaLabel="Language Model"

                                                    name="languageModel"
                                                    type={ "dropdown" }
                                                    displayEmpty={ true }
                                                    label={ "Language Model" }
                                                    component={ SelectFieldAdapter }
                                                    maxLength={ 100 }
                                                    minLength={ 0 }
                                                    options={
                                                        [ ...MODEL_TYPES.map(
                                                            (option: DropdownChild) => ({
                                                                text: option.text,
                                                                value: option.value.toString()
                                                            }))
                                                        ]
                                                    }
                                                    disabled={ false }
                                                />
                                            </div>

                                            <FinalFormField
                                                name="description"
                                                className="pt-3"
                                                label="Description"
                                                multiline
                                                rows={ 4 }
                                                maxRows={ 6 }
                                                component={ TextFieldAdapter }
                                            ></FinalFormField>
                                            <Form.Group>
                                                <PrimaryButton type="submit" className="mt-5">
                                    Update
                                                </PrimaryButton>
                                            </Form.Group>
                                        </form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        );
                    } }
                    initialValues={ initialValues }
                ></FinalForm>
            </EmphasizedSegment>

            <Divider hidden />
            <DangerZoneGroup
                sectionHeader={ "Danger Zone" }
            >


                <DangerZone
                    actionTitle={
                        "Disable agent"
                    }
                    header={
                        "Disable agent"
                    }
                    subheader={
                        "Once disabled, this agent will not be able to connect to any application or connection. " +
                        "Please be certain before you proceed"
                    }
                    onActionClick={ (): void => null }
                    data-testid={ "-danger-zone" }
                />

                <DangerZone
                    actionTitle={
                        "Delete agent"
                    }
                    header={
                        "Delete agent"
                    }
                    subheader={
                        "This action will remove the agent's association with this organization. " +
                        "Please be certain before you proceed"
                    }
                    onActionClick={ () => deleteAgent(agentId).then(() => {
                        dispatch(addAlert({
                            description: "Agent deleted successfully.",
                            level: AlertLevels.SUCCESS,
                            message: "Deleted successfully"
                        }));
                        history.push(AppConstants.getPaths().get("AGENTS"));
                    }).catch((_error: any) => {
                        dispatch(addAlert({
                            description: "An error occurred when deleting agent.",
                            level: AlertLevels.ERROR,
                            message: "Something went wrong"
                        }));
                    })
                    }
                    data-testid={ "-danger-zone" }
                />

            </DangerZoneGroup>
        </>
    );
}
