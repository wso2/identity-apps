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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { getExternalClaims } from "@wso2is/admin.claims.v1/api";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { DangerZone, DangerZoneGroup, EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Form, Grid } from "semantic-ui-react";
import { deleteAgent, updateAgent } from "../../api/agents";
import { AGENT_FEATURE_DICTIONARY } from "../../constants/agents";
import useGetAgent from "../../hooks/use-get-agent";
import { AgentScimSchema } from "../../models/agents";

interface AgentOverviewProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentOverview({
    agentId,
    "data-componentid": componentId = "agent-overview"
}: AgentOverviewProps) {

    const dispatch: Dispatch = useDispatch();

    const [ initialValues, setInitialValues ] = useState<any>();

    const {
        data: agentInfo
    } = useGetAgent(agentId);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    const agentFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.agents);
    const isAgentDisablingEnabled: boolean =
        isFeatureEnabled(agentFeatureConfig, AGENT_FEATURE_DICTIONARY.get("DISABLE_AGENT"));

    const hasAgentDeletePermissions: boolean = useRequiredScopes(agentFeatureConfig?.scopes?.delete);

    useEffect(() => {
        if (agentInfo) {
            setInitialValues({
                ...agentInfo?.["urn:scim:wso2:agent:schema"]
            });
        }
    }, [ agentInfo ]);


    const [ agentSchemaAttributes, setAgentSchemaAttributes ] = useState<Claim[]>([]);

    useEffect(() => {
        getExternalClaims(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_FOR_AGENTS"))
            .then((agentClaims: Claim[]) => {
                setAgentSchemaAttributes(agentClaims);
            })
            .catch((_error: AxiosError) => {

            });
    }, []);

    const agentSchemaformFieldProperties: Record<string, any> = {
        "urn:scim:wso2:agent:schema:agentDescription": {
            maxRows: 6,
            multiline: true,
            rows: 4
        }
    };

    const readOnlyAgentAttributes: string[] = [
        "urn:scim:wso2:agent:schema:agentOwner"
    ];

    return (
        <>
            <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
                <FinalForm
                    onSubmit={ (values: any) => {

                        const updateAgentPayload: AgentScimSchema = {
                            "urn:scim:wso2:agent:schema": {
                                ...values,
                                agentOwner: authenticatedUser
                            },
                            // TODO: Move this to BE API to set the agent username when updating
                            // the agent information
                            userName: agentInfo?.userName
                        };

                        updateAgent(agentId, updateAgentPayload).then((_response: any) => {
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
                                    <Grid.Column computer={ 8 }>
                                        <form
                                            onSubmit={ handleSubmit }
                                            style={ { display: "flex", flexDirection: "column", gap: "16px" } }
                                        >
                                            { agentSchemaAttributes?.map((agentAttribute: Claim) => {
                                                const claimProperties: any = Object.fromEntries(
                                                    agentAttribute?.properties?.map(
                                                        ({
                                                            key, value
                                                        }: {
                                                            key: string;
                                                            value: string;
                                                        }) => [ key, value ]));

                                                const formFieldProperties: any =
                                                    agentSchemaformFieldProperties[agentAttribute.claimURI] ?? [];

                                                return readOnlyAgentAttributes?.includes(agentAttribute.claimURI)
                                                    ? null : (
                                                        <FinalFormField
                                                            key={ agentAttribute.id }
                                                            name={ agentAttribute.claimURI.split(":").pop() }
                                                            label={ claimProperties.DisplayName }
                                                            component={ TextFieldAdapter }
                                                            { ...formFieldProperties }
                                                        ></FinalFormField>
                                                    );
                                            }) }

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
                { isAgentDisablingEnabled && (
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
                        data-componentid={ componentId + "-danger-zone" }
                    />
                ) }
                { hasAgentDeletePermissions && (<DangerZone
                    actionTitle={ "Delete agent" }
                    header={ "Delete agent" }
                    subheader={ "This action will remove the agent's association with this organization. " +
                        "Please be certain before you proceed" }
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
                    data-componentid={ componentId + "-danger-zone" }
                />) }

            </DangerZoneGroup>
        </>
    );
}
