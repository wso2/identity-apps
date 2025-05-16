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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosResponse } from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AsyncOperationStatusResponse, OperationStatus, OperationStatusSummary } from
    "../../admin.core.v1/models/common";
import { getAsyncOperationStatus } from "../api/application";

/**
 * Proptypes for the use operation status poller hook.
 */
export interface useAsyncOperationStatusProps {
    /**
     * Type of the operation being tracked
     */
    operationType: string;
    /**
     * The unique identifier of the subject associated with the operation.
     */
    subjectId: string;
    /**
     * The interval between each poll to check the operation's status.
     */
    pollingInterval?: number;
    /**
     * Callback function triggered when the operation reaches a completed status.
     *
     * @param finalStatus - The final status of the operation after completion.
     */
    onCompleted?: (finalStatus: OperationStatus) => void;
    /**
     * Callback function triggered whenever the status of the operation changes.
     *
     * @param operationId - The unique identifier of the operation.
     * @param status - The current status of the operation.
     * @param summary - A summary of the operation's status.
     */
    onStatusChange?: (operationId: string, status: OperationStatus, summary: OperationStatusSummary) => void;
    /**
     * A flag to enable or disable the polling of the operation's status. If set to `false`, polling is disabled.
     */
    enabled?: boolean;
}

/**
 * Proptypes for the REST api params.
 */
interface UseAsyncOperationStatusParams {
    filter?: string;
    limit?: number;
    after?: string;
    before?: string;
}

/**
 *  This hook polls the status of an asynchronous operation at a specified interval and triggers
 *  the relevant callbacks when the status changes or the operation completes.
 *
 * @param string - operationType - The type of the operation being tracked.
 * @param string - subjectId - The unique identifier of the subject associated with the operation
 * @param number - The interval between each poll to check the operation's status.
 * @param Function - [onCompleted] - A callback function triggered when the operation reaches a completed status.
 * @param Function - [onStatusChange] - A callback function triggered whenever the status of the operation changes.
 * @param boolean - [enabled=true] - A flag to enable or disable the polling of the operation's status.
 */
export const useAsyncOperationStatus = ({
    operationType,
    subjectId,
    pollingInterval,
    onCompleted,
    onStatusChange,
    enabled
}: useAsyncOperationStatusProps) => {

    const API_LIMIT: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;
    const params: UseAsyncOperationStatusParams = {
        after: null,
        filter: `subjectId eq ${subjectId} and operationType eq ${operationType}`,
        limit: API_LIMIT
    };

    const intervalRef: MutableRefObject<number> = useRef<number | null>(null);
    const [ status, setStatus ] = useState<OperationStatus>(OperationStatus.IDLE);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * Fetches the current status of the asynchronous operation.
     */
    const fetchStatus = async (): Promise< { operationId: string, status: OperationStatus,
        summary: OperationStatusSummary } > => {
        const response: AxiosResponse = await getAsyncOperationStatus(params.after, null, params.filter, params.limit);
        const operation: AsyncOperationStatusResponse = response.data?.operations[0];
        const newStatus: OperationStatus = operation?.status ?? OperationStatus.IDLE;
        const newOperationId: string = operation?.operationId ?? null;
        const operationSummary: OperationStatusSummary = {
            failedCount: operation?.unitOperationDetail?.summary?.failed ?? 0,
            partiallyCompletedCount: operation?.unitOperationDetail?.summary?.partiallyCompleted ?? 0,
            successCount: operation?.unitOperationDetail?.summary?.success ?? 0
        };

        return { operationId: newOperationId, status: newStatus, summary: operationSummary };
    };

    /**
     * Starts polling for the operation status at regular intervals.
     * Stops polling when the operation is completed.
     */
    const startPolling = () => {
        if (!enabled || intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(async () => {
            try {
                const { operationId: newOperationId, status: newStatus, summary: operationSummary }
                    = await fetchStatus();

                if (newStatus !== status) {
                    setStatus(newStatus);
                    onStatusChange?.(newOperationId, newStatus, operationSummary);
                }

                if (newStatus !== OperationStatus.IN_PROGRESS) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    onCompleted?.(newStatus);
                }
            } catch (error) {
                dispatch(addAlert({
                    description: t("common:asyncOperationErrorMessage.message"),
                    level: AlertLevels.ERROR,
                    message: t("common:asyncOperationErrorMessage.description")
                }));
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
            }
        }, pollingInterval);
    };

    /**
     * Fetches the initial status of the asynchronous operation and starts polling if the status is in progress.
     * Calls the `onCompleted` callback when the operation completes.
     */
    const fetchInitialStatus = async () => {
        try {

            const { operationId: newOperationId, status: initialStatus, summary: operationSummary }
                = await fetchStatus();

            if (initialStatus !== status) {
                setStatus(initialStatus);
                onStatusChange?.(newOperationId, initialStatus, operationSummary);
            }

            if (initialStatus === OperationStatus.IN_PROGRESS) {
                startPolling();
            } else {
                onCompleted?.(initialStatus);
            }
        } catch (error) {
            dispatch(addAlert({
                description: t("common:asyncOperationErrorMessage.description"),
                level: AlertLevels.ERROR,
                message: t("common:asyncOperationErrorMessage.message")
            }));
        }
    };

    useEffect(() => {
        if (!enabled) return;
        fetchInitialStatus();

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [ enabled ]);

    return {
        startPolling,
        status
    };
};
