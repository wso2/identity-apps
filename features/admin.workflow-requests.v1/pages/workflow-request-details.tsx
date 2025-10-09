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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getOperationTypeTranslationKey } from "@wso2is/common.workflow-approvals.v1/utils/approval-utils";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Message, Modal, Table } from "semantic-ui-react";
import { useGetWorkflowInstance } from "../api/use-get-workflow-instance";
import { abortWorkflowInstance } from "../api/workflow-requests";
import { WorkflowInstanceStatus, WorkflowRequestPropertyInterface } from "../models/workflowRequests";
import "./workflow-request-details.scss";

/**
 * Workflow request details page component.
 */
const WorkflowRequestDetailsPage: FunctionComponent<IdentifiableComponentInterface> = (
    {
        [ "data-componentid" ]: componentId = "workflow-request-details-page"
    }: IdentifiableComponentInterface
) => {
    const { t } = useTranslation([ "workflowRequests" ]);
    const dispatch: Dispatch = useDispatch();

    const [ showAbortModal, setshowAbortModal ] = useState<boolean>(false);

    const path: string[] = history.location.pathname.split("/");
    const id: string = path[path.length - 1];

    const {
        data: workflowRequest,
        isLoading: loading,
        error: workflowInstanceError
    } = useGetWorkflowInstance(id, !!id);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasWorkflowInstanceUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.workflowInstances?.scopes?.update
    );

    const formatHumanReadableDate = (dateString: string): string => {
        if (!dateString) return "-";

        const date: Date = new Date(dateString);

        if (isNaN(date.getTime())) return dateString;

        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            hour: "numeric",
            hour12: true,
            minute: "2-digit",
            month: "long",
            weekday: "long",
            year: "numeric"
        };

        return date.toLocaleDateString("en-US", options);
    };

    const formatRequestProperties = (property: WorkflowRequestPropertyInterface): WorkflowRequestPropertyInterface => {
        const key: string = property.key;
        const value: string = property.value;

        const excludedFields: string[] = [
            "REQUEST ID", "requestId", "request_id",
            "self", "Self",
            "arbitries", "Arbitries",
            "arbitrary", "Arbitrary",
            "meta", "Meta",
            "links", "Links",
            "schemas", "Schemas",
            "Tenant Domain"
        ];

        if (excludedFields.some((field: string) => key.toLowerCase().includes(field.toLowerCase()))) { return null; }

        if (value === null ) return { key, value: "null" };
        if (value === "") return { key, value: "(empty)" };
        if (value === "[]") return { key, value: "(empty)" };
        if (Array.isArray(value) && value.length === 0) {
            return { key, value: "(empty)" };
        }

        return { key, value: String(value) };
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));
    };

    const REQUEST_STATUSES: Map<string, string> = new Map([
        [ WorkflowInstanceStatus.FAILED, t("workflowRequests:status.failed") ],
        [ WorkflowInstanceStatus.APPROVED, t("workflowRequests:status.approved") ],
        [ WorkflowInstanceStatus.PENDING, t("workflowRequests:status.pending") ],
        [ WorkflowInstanceStatus.ABORTED, t("workflowRequests:status.aborted") ],
        [ WorkflowInstanceStatus.REJECTED, t("workflowRequests:status.rejected") ]
    ]);

    const renderDetailsTable = () => {
        const properties: WorkflowRequestPropertyInterface[] = workflowRequest.properties || [];

        return (
            <Table definition className="workflow-request-details-table">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={ 3 }>{ t("workflowRequests:details.fields.id") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.workflowInstanceId }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("common:operationType") }</Table.Cell>
                        <Table.Cell>{ t(getOperationTypeTranslationKey(workflowRequest.eventType)) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("workflowRequests:details.fields.requestInitiator") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.requestInitiator ||
                            t("common:approvalsPage.propertyMessages.selfRegistration") }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("workflowRequests:details.fields.status") }</Table.Cell>
                        <Table.Cell>
                            { (REQUEST_STATUSES.get(workflowRequest.status) ?? "N/A").toUpperCase() }
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("workflowRequests:details.fields.createdAt") }</Table.Cell>
                        <Table.Cell>{ formatHumanReadableDate(workflowRequest.createdAt) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("workflowRequests:details.fields.updatedAt") }</Table.Cell>
                        <Table.Cell>{ formatHumanReadableDate(workflowRequest.updatedAt) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("workflowRequests:details.fields.requestParams") }</Table.Cell>
                        <Table.Cell>
                            { properties && properties.length > 0 ? (
                                <Table celled compact size="small">
                                    <Table.Body>
                                        { properties.map(
                                            (property: WorkflowRequestPropertyInterface, index: number) => {
                                                const formattedProperty: WorkflowRequestPropertyInterface
                                                = formatRequestProperties(property);

                                                return formattedProperty &&  (
                                                    <Table.Row key={ index }>
                                                        <Table.Cell className="param-key">
                                                            { formattedProperty.key }
                                                        </Table.Cell>
                                                        <Table.Cell className="param-value">
                                                            { formattedProperty.value }
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            }) }
                                    </Table.Body>
                                </Table>
                            ) : (
                                <span>-</span>
                            ) }
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    };

    const handleAbort = async () => {
        if (!workflowRequest) return;

        try {
            await abortWorkflowInstance(workflowRequest.workflowInstanceId);
            dispatch(addAlert({
                description: t("workflowRequests:notifications.abortWorkflowRequest.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("workflowRequests:notifications.abortWorkflowRequest.success.message")
            }));
            setshowAbortModal(false);
            history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));
        } catch (err: any) {
            dispatch(addAlert({
                description: t("workflowRequests:notifications.abortWorkflowRequest.genericError.description", {
                    description: err?.response?.data?.detail || ""
                }),
                level: AlertLevels.ERROR,
                message: t("workflowRequests:notifications.abortWorkflowRequest.genericError.message")
            }));
        }
    };

    return (
        <TabPageLayout
            isLoading={ loading }
            title={ t("workflowRequests:details.header") }
            backButton={ {
                "data-testid": "workflow-requests-details-back-button",
                onClick: handleBackButtonClick,
                text: t("workflowRequests:details.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ componentId }
        >
            { workflowInstanceError && (
                <Message
                    negative
                    header={ t("workflowRequests:details.error.header") }
                    content={ t("workflowRequests:details.error.content") }
                />
            ) }
            { workflowRequest && renderDetailsTable() }
            { workflowRequest && workflowRequest.status === WorkflowInstanceStatus.PENDING && (
                <DangerZoneGroup sectionHeader={ t("workflowRequests:details.dangerZone.header") }>
                    <DangerZone
                        actionTitle={ t("workflowRequests:details.dangerZone.abort.actionTitle") }
                        header={ t("workflowRequests:details.dangerZone.abort.header") }
                        subheader={ t("workflowRequests:details.dangerZone.abort.subheader") }
                        onActionClick={ () => setshowAbortModal(true) }
                        isButtonDisabled={ !hasWorkflowInstanceUpdatePermissions }
                        data-testid="workflow-requests-details-danger-zone-delete"
                    />
                </DangerZoneGroup>
            ) }
            <Modal
                open={ showAbortModal }
                size="small"
                onClose={ () => setshowAbortModal(false) }
            >
                <Modal.Header>{ t("workflowRequests:details.dangerZone.abort.header") }</Modal.Header>
                <Modal.Content>
                    <p>{ t("workflowRequests:details.dangerZone.abort.confirm") }</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={ () => setshowAbortModal(false) }>{ t("common:cancel") }</Button>
                    <Button
                        negative
                        loading={ loading }
                        onClick={ handleAbort }
                        disabled={ !hasWorkflowInstanceUpdatePermissions }
                    >
                        { t("workflowRequests:details.dangerZone.abort.action") }
                    </Button>
                </Modal.Actions>
            </Modal>
        </TabPageLayout>
    );
};

export default WorkflowRequestDetailsPage;
