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
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { WorkflowInstanceOperationType, WorkflowInstanceRequestType, WorkflowInstanceStatus } from "../models/workflowRequests";
import "./filter-dropdowns.scss";

interface FilterDropdownProps {
    value: string;
    onChange: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    style?: React.CSSProperties;
    placeholder?: string;
    [key: string]: any;
}

export const WorkflowRequestsStatusDropdown: React.FC<FilterDropdownProps> = ({ value, onChange, style, placeholder, ...rest }) => {
    const { t } = useTranslation();
    const statusOptions = [
        { key: WorkflowInstanceStatus.ALL_TASKS, value: WorkflowInstanceStatus.ALL_TASKS, text: t("approvalWorkflows:status.all") },
        { key: WorkflowInstanceStatus.PENDING, value: WorkflowInstanceStatus.PENDING, text: t("approvalWorkflows:status.pending") },
        { key: WorkflowInstanceStatus.APPROVED, value: WorkflowInstanceStatus.APPROVED, text: t("approvalWorkflows:status.approved") },
        { key: WorkflowInstanceStatus.REJECTED, value: WorkflowInstanceStatus.REJECTED, text: t("approvalWorkflows:status.rejected") },
        { key: WorkflowInstanceStatus.FAILED, value: WorkflowInstanceStatus.FAILED, text: t("approvalWorkflows:status.failed") },
        { key: WorkflowInstanceStatus.DELETED, value: WorkflowInstanceStatus.DELETED, text: t("approvalWorkflows:status.deleted") }
    ];
    
    return (
        <Dropdown
            selection
            options={statusOptions}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            text={placeholder}
            className="workflow-requests-filter-dropdown"
            style={style}
        />
    );
};

export const WorkflowRequestRequestTypeDropdown: React.FC<FilterDropdownProps> = ({ value, onChange, style, placeholder, ...rest }) => {
    const { t } = useTranslation(["approvalWorkflows"]);
    const eventTypeOptions = [
        { key: WorkflowInstanceRequestType.ALL_TASKS, value: WorkflowInstanceRequestType.ALL_TASKS, text: t("approvalWorkflows:eventType.all") },
        { key: WorkflowInstanceRequestType.MY_TASKS, value: WorkflowInstanceRequestType.MY_TASKS, text: t("approvalWorkflows:eventType.myTasks") }
    ];
    
    return (
        <Dropdown
            selection
            options={eventTypeOptions}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            text={placeholder}
            className="workflow-requests-filter-dropdown"
            style={style}
        />
    );
};

export const WorkflowRequestOperationTypeDropdown: React.FC<FilterDropdownProps> = ({ value, onChange, style, placeholder, ...rest }) => {
    const { t } = useTranslation(["approvalWorkflows"]);
    const operationTypeOptions = [
        {key: WorkflowInstanceOperationType.ALL, value: WorkflowInstanceOperationType.ALL, text: t("approvalWorkflows:operationType.all")},
        {key: WorkflowInstanceOperationType.ADD_USER, value: WorkflowInstanceOperationType.ADD_USER, text: t("approvalWorkflows:operationType.createUser")},
        {key: WorkflowInstanceOperationType.DELETE_USER, value: WorkflowInstanceOperationType.DELETE_USER, text: t("approvalWorkflows:operationType.deleteUser")},
        {key: WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS, value: WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS, text: t("approvalWorkflows:operationType.updateUserRoles")},
        {key: WorkflowInstanceOperationType.ADD_ROLE, value: WorkflowInstanceOperationType.ADD_ROLE, text: t("approvalWorkflows:operationType.createRole")},
        {key: WorkflowInstanceOperationType.DELETE_ROLE, value: WorkflowInstanceOperationType.DELETE_ROLE, text: t("approvalWorkflows:operationType.deleteRole")},
        {key: WorkflowInstanceOperationType.UPDATE_ROLE_NAME, value: WorkflowInstanceOperationType.UPDATE_ROLE_NAME, text: t("approvalWorkflows:operationType.updateRoleName")},
        {key: WorkflowInstanceOperationType.UPDATE_USERS_OF_ROLES, value: WorkflowInstanceOperationType.UPDATE_USERS_OF_ROLES, text: t("approvalWorkflows:operationType.updateRoleUsers")},
        {key: WorkflowInstanceOperationType.DELETE_USER_CLAIMS, value: WorkflowInstanceOperationType.DELETE_USER_CLAIMS, text: t("approvalWorkflows:operationType.deleteUserClaims")},
        {key: WorkflowInstanceOperationType.UPDATE_USER_CLAIMS, value: WorkflowInstanceOperationType.UPDATE_USER_CLAIMS, text: t("approvalWorkflows:operationType.updateUserClaims")}
    ];
    
    return (
        <Dropdown
            selection
            options={operationTypeOptions}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            text={placeholder}
            className="workflow-requests-filter-dropdown"
            style={style}
        />
    );
};
