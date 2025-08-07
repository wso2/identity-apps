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

import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import {
    WorkflowInstanceOperationType,
    WorkflowInstanceRequestType,
    WorkflowInstanceStatus
} from "../models/workflowRequests";
import "./filter-dropdowns.scss";

interface FilterDropdownProps {
    value: string;
    onChange: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    style?: React.CSSProperties;
    placeholder?: string;
    [key: string]: any;
}

export const WorkflowRequestsStatusDropdown: React.FC<FilterDropdownProps> =
({ value, onChange, style, placeholder, ..._rest }: FilterDropdownProps) => {
    const { t } = useTranslation();
    const statusOptions: Array<{ key: WorkflowInstanceStatus; text: string; value: WorkflowInstanceStatus }> = [
        {
            key: WorkflowInstanceStatus.ALL_TASKS,
            text: t("approvalWorkflows:status.all"),
            value: WorkflowInstanceStatus.ALL_TASKS
        },
        {
            key: WorkflowInstanceStatus.PENDING,
            text: t("approvalWorkflows:status.pending"),
            value: WorkflowInstanceStatus.PENDING
        },
        {
            key: WorkflowInstanceStatus.APPROVED,
            text: t("approvalWorkflows:status.approved"),
            value: WorkflowInstanceStatus.APPROVED
        },
        {
            key: WorkflowInstanceStatus.REJECTED,
            text: t("approvalWorkflows:status.rejected"),
            value: WorkflowInstanceStatus.REJECTED
        },
        {
            key: WorkflowInstanceStatus.FAILED,
            text: t("approvalWorkflows:status.failed"),
            value: WorkflowInstanceStatus.FAILED
        },
        {
            key: WorkflowInstanceStatus.DELETED,
            text: t("approvalWorkflows:status.deleted"),
            value: WorkflowInstanceStatus.DELETED
        }
    ];

    return (
        <Dropdown
            selection
            options={ statusOptions }
            value={ value }
            onChange={ onChange }
            placeholder={ placeholder }
            text={ placeholder }
            className="workflow-requests-filter-dropdown"
            style={ style }
        />
    );
};

export const WorkflowRequestRequestTypeDropdown: React.FC<FilterDropdownProps> =
({ value, onChange, style, placeholder, ..._rest }: FilterDropdownProps) => {
    const { t } = useTranslation([ "approvalWorkflows" ]);
    const eventTypeOptions: Array<{
        key: WorkflowInstanceRequestType;
        text: string;
        value: WorkflowInstanceRequestType;
    }> = [
        {
            key: WorkflowInstanceRequestType.ALL_TASKS,
            text: t("approvalWorkflows:eventType.all"),
            value: WorkflowInstanceRequestType.ALL_TASKS
        },
        {
            key: WorkflowInstanceRequestType.MY_TASKS,
            text: t("approvalWorkflows:eventType.myTasks"),
            value: WorkflowInstanceRequestType.MY_TASKS
        }
    ];

    return (
        <Dropdown
            selection
            options={ eventTypeOptions }
            value={ value }
            onChange={ onChange }
            placeholder={ placeholder }
            text={ placeholder }
            className="workflow-requests-filter-dropdown"
            style={ style }
        />
    );
};

export const WorkflowRequestOperationTypeDropdown: React.FC<FilterDropdownProps> =
({ value, onChange, style, placeholder, ..._rest }: FilterDropdownProps) => {
    const { t } = useTranslation([ "approvalWorkflows" ]);
    const operationTypeOptions: Array<{
        key: WorkflowInstanceOperationType;
        text: string;
        value: WorkflowInstanceOperationType;
    }> = [
        {
            key: WorkflowInstanceOperationType.ALL,
            text: t("approvalWorkflows:operationType.all"),
            value: WorkflowInstanceOperationType.ALL
        },
        {
            key: WorkflowInstanceOperationType.ADD_USER,
            text: t("approvalWorkflows:operationType.createUser"),
            value: WorkflowInstanceOperationType.ADD_USER
        },
        {
            key: WorkflowInstanceOperationType.DELETE_USER,
            text: t("approvalWorkflows:operationType.deleteUser"),
            value: WorkflowInstanceOperationType.DELETE_USER
        },
        {
            key: WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS,
            text: t("approvalWorkflows:operationType.updateUserRoles"),
            value: WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS
        },
        {
            key: WorkflowInstanceOperationType.ADD_ROLE,
            text: t("approvalWorkflows:operationType.createRole"),
            value: WorkflowInstanceOperationType.ADD_ROLE
        },
        {
            key: WorkflowInstanceOperationType.DELETE_ROLE,
            text: t("approvalWorkflows:operationType.deleteRole"),
            value: WorkflowInstanceOperationType.DELETE_ROLE
        }
    ];

    return (
        <Dropdown
            selection
            options={ operationTypeOptions }
            value={ value }
            onChange={ onChange }
            placeholder={ placeholder }
            text={ placeholder }
            className="workflow-requests-filter-dropdown"
            style={ style }
        />
    );
};
