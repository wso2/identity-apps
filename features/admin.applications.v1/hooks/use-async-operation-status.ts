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
import { getAsyncOperationStatus } from "../api/application";
import { OperationStatus } from "../constants/application-management";
import { OperationStatusSummary } from "../models/application";

/**
 * Proptypes for the use operation status poller hook.
 */
export interface useAsyncOperationStatusProps {
    operationType: string;
    subjectId: string;
    pollingInterval?: number;
    onCompleted?: (finalStatus: OperationStatus) => void;
    onStatusChange?: (operationId: string, status: OperationStatus,
        summary: OperationStatusSummary) => void;
    enabled?: boolean;
}

/**
 * Proptypes for the REST api params.
 */
interface Params {
    filter?: string;
    limit?: number;
    after?: string;
    before?: string;
}

/**
 *  Use operation status poller hook.
 *
 * @param props - Props injected to the component.
 *
 * @returns Use operation status poller hook.
 */
export const useAsyncOperationStatus = ({
    operationType,
    subjectId,
    pollingInterval,
    onCompleted,
    onStatusChange,
    enabled
}: useAsyncOperationStatusProps) => {

    const [ status, setStatus ] = useState<OperationStatus>(OperationStatus.IDLE);
    const intervalRef: MutableRefObject<number> = useRef<number | null>(null);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const API_LIMIT: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

    const [ params ] = useState<Params>({
        after: null,
        filter: `subjectId eq ${subjectId} and operationType eq ${operationType}`,
        limit: API_LIMIT
    });

    const fetchStatus = async (): Promise< { operationId: string, status: OperationStatus,
        summary: OperationStatusSummary } > => {

        const response: AxiosResponse = await getAsyncOperationStatus(params.after, null, params.filter, params.limit);
        const newStatus: OperationStatus = response.data?.operations[0]?.status ?? OperationStatus.IDLE;
        const newOperationId: string = response.data?.operations[0]?.operationId ?? null;
        const operationSummary: OperationStatusSummary = {
            failedCount: response.data?.operations[0]?.unitOperationDetail?.summary?.failed ?? 0,
            partiallyCompletedCount: response.data?.operations[0]?.unitOperationDetail?.
                summary?.partiallyCompleted ?? 0,
            successCount: response.data?.operations[0]?.unitOperationDetail?.summary?.success ?? 0
        };

        return { operationId: newOperationId, status: newStatus, summary: operationSummary };
    };

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
