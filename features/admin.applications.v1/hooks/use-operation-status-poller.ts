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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosResponse } from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getSharedAccessStatus } from "../api/application";
import { OperationStatus } from "../constants/application-management";

export interface UseOperationStatusPollerProps {
    operationType: string;
    subjectId: string;
    pollingInterval?: number;
    onCompleted?: (finalStatus: OperationStatus) => void;
    onStatusChange?: (operationId: string, status: OperationStatus) => void;
    enabled?: boolean;
}

export const useOperationStatusPoller = ({
    operationType,
    subjectId,
    pollingInterval,
    onCompleted,
    onStatusChange,
    enabled
}: UseOperationStatusPollerProps) => {

    const [ status, setStatus ] = useState<OperationStatus>(OperationStatus.IDLE);
    const intervalRef: MutableRefObject<number> = useRef<number | null>(null);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchStatus = async (): Promise< { operationId: string, status: OperationStatus } > => {
        const response: AxiosResponse = await getSharedAccessStatus(operationType, subjectId, 1000);
        const newStatus: OperationStatus = response.data?.operations[0]?.status ?? OperationStatus.IDLE;
        const newOperationId: string = response.data?.operations[0]?.operationId ?? null;

        return { operationId: newOperationId, status: newStatus };
    };

    const startPolling = () => {
        if (!enabled || intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(async () => {
            try {
                const { operationId: newOperationId, status: newStatus } = await fetchStatus();

                setStatus(newStatus);
                onStatusChange?.(newOperationId, newStatus);

                if (newStatus !== OperationStatus.IN_PROGRESS) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    onCompleted?.(newStatus);
                }
            } catch (error) {
                dispatch(addAlert({
                    description: t("common:asyncOperationErrorMessage.description"),
                    level: AlertLevels.ERROR,
                    message: t("common:asyncOperationErrorMessage.message")
                }));
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
            }
        }, pollingInterval);
    };

    const fetchInitialStatus = async () => {
        try {

            const { operationId: newOperationId, status: initialStatus } = await fetchStatus();

            setStatus(initialStatus);
            onStatusChange?.(newOperationId, initialStatus);

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
