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
import { WorkflowRequestOperationTypeDropdown, WorkflowRequestRequestTypeDropdown, WorkflowRequestsStatusDropdown } from "./filter-dropdowns";
import TimeRangeDropdown from "./time-range-dropdown";
import { useTranslation } from "react-i18next";
import "../styles/workflow-requests.css";

interface WorkflowRequestsFilterProps {
    requestType: string;
    setRequestType: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    operationType: string;
    setOperationType: (value: string) => void;
    createdTimeRange: number | undefined;
    handleCreatedTimeRangeChange: (range: number) => void;
    handleCreatedCustomDateChange: (from: string, to: string) => void;
    updatedTimeRange: number | undefined;
    handleUpdatedTimeRangeChange: (range: number) => void;
    handleUpdatedCustomDateChange: (from: string, to: string) => void;
    searchWorkflowRequests: () => void;
    loading: boolean;
}

const WorkflowRequestsFilter: React.FC<WorkflowRequestsFilterProps> = ({
    requestType,
    setRequestType,
    status,
    setStatus,
    operationType,
    setOperationType,
    createdTimeRange,
    handleCreatedTimeRangeChange,
    handleCreatedCustomDateChange,
    updatedTimeRange,
    handleUpdatedTimeRangeChange,
    handleUpdatedCustomDateChange
}) => {
    const { t } = useTranslation(["workflow-requests"]);
    
    return (
        <form className="workflow-requests-filter-bar advanced-search ui form" autoComplete="off">
            <div className="fields">
                <div className="field">
                    <div>
                        <WorkflowRequestRequestTypeDropdown
                            value={requestType}
                            onChange={(e, data) => {
                                setRequestType(data.value as string);
                            }}
                            data-componentid="workflow-requests-event-type-dropdown"
                            placeholder={t("filters.requestType")}
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <WorkflowRequestsStatusDropdown
                            value={status}
                            onChange={(e, data) => {
                                setStatus(data.value as string);
                            }}
                            data-componentid="workflow-requests-status-dropdown"
                            placeholder={t("filters.status")}
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <WorkflowRequestOperationTypeDropdown
                            value={operationType}
                            onChange={(e, data) => {
                                setOperationType(data.value as string);
                            }}
                            data-componentid="workflow-requests-operation-type-dropdown"
                            placeholder={t("filters.operationType")}
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <TimeRangeDropdown
                            label={t("filters.createdTimeRange")}
                            selectedRange={createdTimeRange}
                            onRangeChange={(range) => {
                                handleCreatedTimeRangeChange(range);
                            }}
                            onCustomDateChange={(from, to) => {
                                handleCreatedCustomDateChange(from, to);
                            }}
                            disabled={updatedTimeRange !== undefined && updatedTimeRange !== -2}
                            componentId="created-time-range"
                        />
                    </div>
                </div>
                <div className="field">
                    <div>
                        <TimeRangeDropdown
                            label={t("filters.updatedTimeRange")}
                            selectedRange={updatedTimeRange}
                            onRangeChange={(range) => {
                                handleUpdatedTimeRangeChange(range);
                            }}
                            onCustomDateChange={(from, to) => {
                                handleUpdatedCustomDateChange(from, to);
                            }}
                            disabled={createdTimeRange !== undefined && createdTimeRange !== -2}
                            componentId="updated-time-range"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default WorkflowRequestsFilter;
