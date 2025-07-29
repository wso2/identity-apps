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
import { AlertLevels, Claim, IdentifiableComponentInterface, Property } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, Form, Grid, Loader } from "semantic-ui-react";
import { deleteAgent, updateAgent, updateAgentLockStatus } from "../../api/agents";
import useGetAgent from "../../hooks/use-get-agent";
import { AgentScimSchema } from "../../models/agents";
import "./agent-overview.scss";

interface AgentOverviewProps extends IdentifiableComponentInterface {
    agentId: string;
}

type AgentAttribute = Claim & {
    properties: Property[]
}

export default function AgentOverview({
    agentId,
    "data-componentid": componentId = "agent-overview"
}: AgentOverviewProps) {
    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ isAgentLocked, setIsAgentLocked ] = useState<boolean>(false);
    const [ isAgentDeleting, setIsAgentDeleting ] = useState<boolean>(false);
    const [ isAgentDeleteInProgress, setIsAgentDeleteInProgress ] = useState<boolean>(false);

    const {
        data: agentInfo,
        isLoading: isAgentInfoLoading
    } = useGetAgent(agentId);

    useEffect(() => {
        setIsAgentLocked(agentInfo["urn:scim:wso2:schema"]?.accountLocked);
    }, [ agentInfo ]);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    const agentFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.agents);
    const hasAgentUpdatePermissions: boolean = useRequiredScopes(agentFeatureConfig?.scopes?.update);
    const hasAgentDeletePermissions: boolean = useRequiredScopes(agentFeatureConfig?.scopes?.delete);

    function formatTimestamp(timestamp: string): string {
        // Handle microseconds by trimming to milliseconds
        const cleanTimestamp: string = timestamp.split(".")[0] + "Z";
        const date: Date = new Date(cleanTimestamp);

        return date.toLocaleString("en-US", {
            day: "numeric",    // 17
            hour: "numeric",   // 11
            hour12: true,      // AM/PM format
            minute: "2-digit", // 21
            month: "short",    // Jul
            year: "numeric"    // 2025
        });
    }

    const initialValues: AgentScimSchema = useMemo(() => {
        if (agentInfo) {
            return {
                ...agentInfo?.["urn:scim:wso2:agent:schema"],
                createdAt: formatTimestamp(agentInfo?.meta?.created),
                lastModified: formatTimestamp(agentInfo?.meta?.lastModified)
            };
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

    const agentSchemaAttributesWithProperties: AgentAttribute[] = useMemo(() => {
        return agentSchemaAttributes?.map((agentAttribute: Claim) => {
            const claimProperties: any = Object.fromEntries(
                agentAttribute?.properties?.map(
                    ({ key, value }: Property) => [ key, value ]
                )
            );

            return {
                ...agentAttribute,
                properties: claimProperties
            };
        })?.sort((a: AgentAttribute, b: AgentAttribute) => {
            const orderA: number = parseInt(a.properties?.["DisplayOrder"] ?? "0", 10);
            const orderB: number = parseInt(b.properties?.["DisplayOrder"] ?? "0", 10);

            return orderA - orderB;
        });

    }, [ agentSchemaAttributes ]);

    const agentSchemaformFieldProperties: Record<string, any> = {
        "urn:scim:wso2:agent:schema:Description": {
            maxRows: 6,
            multiline: true,
            rows: 4
        }
    };

    const readOnlyAgentAttributes: string[] = [
        "urn:scim:wso2:agent:schema:Owner"
    ];

    return (
        <>
            <EmphasizedSegment
                padded="very"
                className="agent-overview-form"
            >
                {
                    isAgentInfoLoading ? <Loader /> :                (<FinalForm
                        onSubmit={ (values: any) => {

                            const updateAgentPayload: AgentScimSchema = {
                                "urn:scim:wso2:agent:schema": {
                                    ...values,
                                    Owner: authenticatedUser
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
                        render={ ({ handleSubmit, submitting }: FormRenderProps) => {
                            return (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column computer={ 8 }>
                                            <form
                                                onSubmit={ handleSubmit }
                                                style={ { display: "flex", flexDirection: "column", gap: "16px" } }
                                            >
                                                { agentSchemaAttributesWithProperties?.map((agentAttribute: any) => {
                                                    const formFieldProperties: any =
                                                    agentSchemaformFieldProperties[agentAttribute.claimURI] ?? [];

                                                    return readOnlyAgentAttributes?.includes(agentAttribute.claimURI)
                                                        ? null : (
                                                            <FinalFormField
                                                                data-componentid={
                                                                    componentId + "-" +
                                                                    agentAttribute?.properties.DisplayName +
                                                                    "-attribute"
                                                                }
                                                                key={ agentAttribute.id }
                                                                name={ agentAttribute.claimURI.split(":").pop() }
                                                                label={ agentAttribute?.properties.DisplayName }
                                                                component={ TextFieldAdapter }
                                                                { ...formFieldProperties }
                                                            ></FinalFormField>
                                                        );
                                                }) }
                                                <FinalFormField
                                                    key="createdAt"
                                                    name="createdAt"
                                                    label="Created Date"
                                                    component={ TextFieldAdapter }
                                                    readOnly
                                                ></FinalFormField>
                                                <FinalFormField
                                                    key="lastModified"
                                                    name="lastModified"
                                                    label="Modified Date"
                                                    component={ TextFieldAdapter }
                                                    readOnly
                                                ></FinalFormField>
                                                <Form.Group>
                                                    { hasAgentUpdatePermissions && (
                                                        <PrimaryButton
                                                            type="submit"
                                                            loading={ submitting }
                                                            disabled={ submitting }
                                                            data-componentid={ componentId + "-submit-btn" }
                                                        >
                                                            { t("common:update") }
                                                        </PrimaryButton>
                                                    ) }
                                                </Form.Group>
                                            </form>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            );
                        } }
                        initialValues={ initialValues }
                    ></FinalForm>)
                }

            </EmphasizedSegment>

            <Divider hidden />
            { isAgentInfoLoading ? <Loader /> : (
                <DangerZoneGroup
                    sectionHeader={ "Danger Zone" }
                >
                    { hasAgentDeletePermissions && (<DangerZone
                        actionTitle={ "Delete agent" }
                        header={ "Delete agent" }
                        subheader={ "This action will remove the agent's association with this organization. " +
                        "Please be certain before you proceed" }
                        onActionClick={ () => setIsAgentDeleting(true) }
                        data-componentid={ componentId + "-danger-zone" }
                    />) }

                    <DangerZone
                        data-componentId={ `${ componentId }-danger-zone-toggle` }
                        actionTitle={ "Deactivate Agent" }
                        header={
                            "Deactivate Agent"
                        }
                        subheader={
                            "Once the agent is deactivated, it will not be able to access any resources."
                        }
                        onActionClick={ undefined }
                        toggle={ {
                            checked: isAgentLocked,
                            id: "agentAccountLocked",
                            onChange: (toggleData: CheckboxProps) => {
                                setIsAgentLocked(toggleData.target.checked);
                                updateAgentLockStatus(agentId, toggleData.target.checked)
                                    .then(() => {
                                        dispatch(addAlert({
                                            description: "The agent account " +
                                                (toggleData.target.checked
                                                    ? "deactivated"
                                                    : "activated"
                                                ) + " successfully.",
                                            level: AlertLevels.SUCCESS,
                                            message: "Agent account is " +
                                                (toggleData.target.checked ? "deactivated" : "active")
                                        }));
                                    })
                                    .catch((_error: AxiosError) => {
                                        dispatch(addAlert({
                                            description:
                                                "An error occurred when " +
                                                (toggleData.checked ? "blocking" : "unblocking") +
                                                " the agent.",
                                            level: AlertLevels.ERROR,
                                            message: "Something went wrong"
                                        }));
                                    });
                            }
                        } }
                    />
                </DangerZoneGroup>
            ) }

            { (
                <ConfirmationModal
                    data-componentId={ `${ componentId }-confirmation-modal` }
                    onClose={ (): void => setIsAgentDeleting(false) }
                    type="negative"
                    open={ isAgentDeleting }
                    assertionHint={ "Please confirm your action" }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setIsAgentDeleting(false);
                    } }
                    primaryActionLoading={ isAgentDeleteInProgress }
                    onPrimaryActionClick={ () => {

                        setIsAgentDeleteInProgress(true);
                        deleteAgent(agentId).then(() => {
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
                        }).finally(() => {
                            setIsAgentDeleteInProgress(false);
                        }); } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentId={ `${ componentId }-confirmation-modal-header` }>
                        Are you sure?
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-componentId={ `${ componentId }-confirmation-modal-message` }
                        attached
                        negative
                    >
                        If you delete this agent, some functionalities may not work properly.
                        Please proceed with caution.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentId={ `${ componentId }-confirmation-modal-content` }>
                        This action is irreversible and will remove the agent&apos;s association with this organization.
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

        </>
    );
}
