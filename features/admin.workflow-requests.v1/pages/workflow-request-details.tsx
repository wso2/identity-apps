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
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, TabPageLayout } from "@wso2is/react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Message, Modal, Table } from "semantic-ui-react";
import { useGetWorkflowInstance } from "../api/use-get-workflow-instance";
import { deleteWorkflowInstance } from "../api/workflow-requests";
import { WorkflowInstanceStatus, WorkflowRequestPropertyInterface } from "../models/workflowRequests";
import "./workflow-request-details.scss";

const WorkflowRequestDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const dispatch: any = useDispatch();

    const path: string[] = history.location.pathname.split("/");
    const id: string = path[path.length - 1];

    const {
        data: workflowRequest,
        isLoading: loading,
        error: workflowInstanceError
    } = useGetWorkflowInstance(id, !!id);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasWorkflowInstanceDeletePermissions: boolean = useRequiredScopes(
        featureConfig?.workflowInstances?.scopes?.delete
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

    const renderDetailsTable = () => {
        if (!workflowRequest) return null;
        const properties: WorkflowRequestPropertyInterface[] = workflowRequest.properties || [];

        return (
            <Table definition className="workflow-request-details-table">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={ 3 }>{ t("approvalWorkflows:details.fields.id") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.workflowInstanceId }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("common:operationType") }</Table.Cell>
                        <Table.Cell>{ t(getOperationTypeTranslationKey(workflowRequest.eventType)) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.requestInitiator") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.requestInitiator ||
                            t("common:approvalsPage.propertyMessages.selfRegistration") }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.status") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.status }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.createdAt") }</Table.Cell>
                        <Table.Cell>{ formatHumanReadableDate(workflowRequest.createdAt) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.updatedAt") }</Table.Cell>
                        <Table.Cell>{ formatHumanReadableDate(workflowRequest.updatedAt) }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.requestParams") }</Table.Cell>
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

    const handleDelete = async () => {
        if (!workflowRequest) return;

        try {
            await deleteWorkflowInstance(workflowRequest.workflowInstanceId);
            dispatch(addAlert({
                description: t("console:manage.features.workflowRequests.notifications."
                    + "deleteWorkflowRequest.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.workflowRequests.notifications."
                    + "deleteWorkflowRequest.success.message")
            }));
            setShowDeleteModal(false);
            history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));
        } catch (err: any) {
            dispatch(addAlert({
                description: t("console:manage.features.workflowRequests.notifications."
                    + "deleteWorkflowRequest.error.description", {
                    description: err?.response?.data?.detail || ""
                }),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.workflowRequests.notifications."
                    + "deleteWorkflowRequest.error.message")
            }));
        }
    };

    return (
        <TabPageLayout
            isLoading={ loading }
            title={ t("approvalWorkflows:details.header") }
            backButton={ {
                "data-testid": "workflow-requests-details-back-button",
                onClick: handleBackButtonClick,
                text: t("approvalWorkflows:details.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            { workflowInstanceError && (
                <Message
                    negative
                    header={ t("approvalWorkflows:details.error.header") }
                    content={ t("approvalWorkflows:details.error.content") }
                />
            ) }
            { workflowRequest && renderDetailsTable() }
            { workflowRequest && workflowRequest.status !== WorkflowInstanceStatus.DELETED && (
                <DangerZoneGroup sectionHeader={ t("approvalWorkflows:details.dangerZone.header") }>
                    <DangerZone
                        actionTitle={ t("approvalWorkflows:details.dangerZone.delete.actionTitle") }
                        header={ t("approvalWorkflows:details.dangerZone.delete.header") }
                        subheader={ t("approvalWorkflows:details.dangerZone.delete.subheader") }
                        onActionClick={ () => setShowDeleteModal(true) }
                        isButtonDisabled={ !hasWorkflowInstanceDeletePermissions }
                        data-testid="workflow-requests-details-danger-zone-delete"
                    />
                </DangerZoneGroup>
            ) }
            <Modal
                open={ showDeleteModal }
                size="small"
                onClose={ () => setShowDeleteModal(false) }
            >
                <Modal.Header>{ t("approvalWorkflows:details.dangerZone.delete.header") }</Modal.Header>
                <Modal.Content>
                    <p>{ t("approvalWorkflows:details.dangerZone.delete.confirm") }</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={ () => setShowDeleteModal(false) }>{ t("common:cancel") }</Button>
                    <Button
                        negative
                        loading={ loading }
                        onClick={ handleDelete }
                        disabled={ !hasWorkflowInstanceDeletePermissions }
                    >{ t("common:delete") }</Button>
                </Modal.Actions>
            </Modal>
        </TabPageLayout>
    );
};

export default WorkflowRequestDetailsPage;
