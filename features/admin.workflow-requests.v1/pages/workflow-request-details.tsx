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
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, TabPageLayout } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Message, Modal, Table } from "semantic-ui-react";
import { useGetWorkflowInstance } from "../api/use-get-workflow-instance";
import { deleteWorkflowInstance } from "../api/workflow-requests";
import "./workflow-request-details.scss";

const WorkflowRequestDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const dispatch = useDispatch();

    const path: string[] = history.location.pathname.split("/");
    const id: string = path[path.length - 1];

    const {
        data: workflowRequest,
        isLoading: loading,
        error: workflowInstanceError,
        mutate: mutateWorkflowInstance
    } = useGetWorkflowInstance(id, !!id);

    useEffect(() => {
        if (workflowInstanceError) {
            // Error handling is done by the hook
        }
    }, [workflowInstanceError]);

    const formatHumanReadableDate = (dateString: string): string => {
        if (!dateString) return "-";

        const date = new Date(dateString);

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

    // Helper to parse requestParameters BLOB if present
    function parseRequestParameters(raw: any): any {
        if (!raw) return null;
        if (typeof raw === "object") return raw;

        try {
            return JSON.parse(raw);
        } catch {
            const result: any = {};
            const str = raw.toString();
            const content = str.replace(/^\{|\}$/g, '');

            let braceDepth = 0;
            let current = '';
            const parts: string[] = [];

            for (let i = 0; i < content.length; i++) {
                const char = content[i];

                if (char === "{" || char === "[") {
                    braceDepth++;
                } else if (char === "}" || char === "]") {
                    braceDepth--;
                } else if (char === "," && braceDepth === 0) {
                    parts.push(current.trim());
                    current = "";

                    continue;
                }
                current += char;
            }
            if (current.trim()) {
                parts.push(current.trim());
            }

            parts.forEach(part => {

                const colonIndex = part.indexOf(" : ");

                if (colonIndex > 0) {
                    const key = part.substring(0, colonIndex).trim();
                    const value = part.substring(colonIndex + 3).trim();

                    if (value.startsWith("{") && value.endsWith("}")) {
                        const nestedContent = value.substring(1, value.length - 1);
                        const nestedPairs = nestedContent.split(", ");
                        const nestedObj: any = {};

                        nestedPairs.forEach(pair => {
                            const equalIndex = pair.indexOf("=");

                            if (equalIndex > 0) {
                                const nestedKey = pair.substring(0, equalIndex).trim();
                                const nestedValue = pair.substring(equalIndex + 1).trim();

                                nestedObj[nestedKey] = nestedValue;
                            }
                        });

                        result[key] = nestedObj;
                    } else if (value === "[]") {
                        result[key] = [];
                    } else if (value === "null") {
                        result[key] = null;
                    } else {
                        result[key] = value;
                    }
                }
            });

            return result;
        }
    }

    const formatRequestParams = (params: any): { key: string; value: string }[] => {
        if (!params) return [];

        const result: { key: string; value: string }[] = [];

        const excludeFields = [
            "REQUEST ID", "requestId", "request_id",
            "self", "Self",
            "arbitries", "Arbitries",
            "arbitrary", "Arbitrary",
            "meta", "Meta",
            "links", "Links",
            "schemas", "Schemas"
        ];

        const flattenObject = (obj: any, prefix: string = ""): void => {
            for (const [key, value] of Object.entries(obj)) {
                const newKey = prefix ? `${prefix}.${key}` : key;

                if (excludeFields.some(field => newKey.toLowerCase().includes(field.toLowerCase()))) {
                    continue;
                }

                if (value && typeof value === "object" && !Array.isArray(value)) {
                    flattenObject(value, newKey);
                } else {
                    let cleanKey = newKey;

                    // Remove Claims.http://wso2.org/claims/ prefix (handle both @Claims and Claims formats)
                    cleanKey = cleanKey.replace(/@?Claims\.http:\/\/wso2\.org\/claims\//g, "");

                    // Convert camelCase or snake_case to Title Case
                    cleanKey = cleanKey
                        .replace(/([A-Z])/g, " $1") // Add space before capital letters
                        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                        .replace(/\s+/g, " ") // Replace multiple spaces with single space
                        .trim();

                    // Handle special cases
                    if (cleanKey === "Emailaddress") cleanKey = "Email Address";
                    if (cleanKey === "Givenname") cleanKey = "Given Name";
                    if (cleanKey === "Lastname") cleanKey = "Last Name";
                    if (cleanKey === "Resource Type") cleanKey = "Resource Type";
                    if (cleanKey === "Given Name") cleanKey = "Given Name";
                    if (cleanKey === "Last Name") cleanKey = "Last Name";

                    const displayValue = value === null ? "null" : 
                                      value === "" ? "(empty)" : 
                                      Array.isArray(value) ? `[${value.length} items]` : 
                                      String(value);
                    
                    result.push({ key: cleanKey, value: displayValue });
                }
            }
        };

        flattenObject(params);

        return result;
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));
    };

    const renderDetailsTable = () => {
        if (!workflowRequest) return null;

        let params = workflowRequest.requestParams;

        if (!params && (workflowRequest as any).requestParameters) {
            params = parseRequestParameters((workflowRequest as any).requestParameters);
        }

        return (
            <Table definition className="workflow-request-details-table">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={ 3 }>{ t("approvalWorkflows:details.fields.id") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.workflowInstanceId }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.eventType") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.eventType }</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>{ t("approvalWorkflows:details.fields.requestInitiator") }</Table.Cell>
                        <Table.Cell>{ workflowRequest.requestInitiator || "-" }</Table.Cell>
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
                            { params && Object.keys(params).length > 0 ? (
                                <Table celled compact size="small">
                                    <Table.Body>
                                        { formatRequestParams(params).map((item, index) => (
                                            <Table.Row key={ index }>
                                                <Table.Cell className="param-key">{ item.key }</Table.Cell>
                                                <Table.Cell className="param-value">{ item.value }</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            ) : (
                                <span>-</span>
                            )}
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
                description: t("console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.success.message")
            }));
            setShowDeleteModal(false);
            history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));
        } catch (err: any) {
            dispatch(addAlert({
                description: t("console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.error.description", { description: err?.response?.data?.detail || "" }),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.error.message")
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
            { workflowInstanceError && <Message negative header={ t("approvalWorkflows:details.error.header") } content={ t("approvalWorkflows:details.error.content") } /> }
            { workflowRequest && renderDetailsTable() }
            { workflowRequest && (
                <DangerZoneGroup sectionHeader={ t("approvalWorkflows:details.dangerZone.header") }>
                    <DangerZone
                        actionTitle={ t("approvalWorkflows:details.dangerZone.delete.actionTitle") }
                        header={ t("approvalWorkflows:details.dangerZone.delete.header") }
                        subheader={ t("approvalWorkflows:details.dangerZone.delete.subheader") }
                        onActionClick={ () => setShowDeleteModal(true) }
                        data-testid="workflow-requests-details-danger-zone-delete"
                    />
                </DangerZoneGroup>
            )}
            <Modal
                open={ showDeleteModal }
                size="small"
                onClose={() => setShowDeleteModal(false)}
            >
                <Modal.Header>{ t("approvalWorkflows:details.dangerZone.delete.header") }</Modal.Header>
                <Modal.Content>
                    <p>{ t("approvalWorkflows:details.dangerZone.delete.confirm") }</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setShowDeleteModal(false)}>{ t("common:cancel") }</Button>
                    <Button negative loading={ loading } onClick={ handleDelete }>{ t("common:delete") }</Button>
                </Modal.Actions>
            </Modal>
        </TabPageLayout>
    );
};

export default WorkflowRequestDetailsPage;
