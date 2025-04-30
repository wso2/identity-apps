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

import { useEffect, useRef, useState } from "react";
import { getSharedAccessStatus } from "../api/application";
import { addAlert } from "@wso2is/core/store";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

export type OperationStatus = "IDLE" | "ONGOING" | "SUCCESS" | "FAILED" | "PARTIAL";

export interface UseOperationStatusPollerOptions {
    applicationId: string;
    pollingInterval?: number;
    onCompleted?: (finalStatus: OperationStatus) => void;
    onStatusChange?: (operationId: string, status: OperationStatus) => void;
    onError?: (error: unknown) => void;
}

export const useOperationStatusPoller = ({
    applicationId,
    pollingInterval,
    onCompleted,
    onStatusChange,
    onError
}: UseOperationStatusPollerOptions) => {

    const [status, setStatus] = useState<OperationStatus>("IDLE");
    const intervalRef = useRef<number | null>(null);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchStatus = async (): Promise< { operationId: string, status: OperationStatus } > => {
        try {
            const response = await getSharedAccessStatus(applicationId);
            const newStatus: OperationStatus = response.data?.operations[0]?.status ?? "IDLE";
            const newOperationId: string = response.data?.operations[0]?.operationId ?? null;

            return {operationId: newOperationId, status: newStatus}

        } catch (error) {
            throw error;
        }
    };

    const startPolling = () => {
        if (intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(async () => {
            try {
                console.log("Polling for status...");
                const {operationId: newOperationId, status: newStatus} = await fetchStatus();
                if (newOperationId !== null) {
                    console.log("New operation ID:", newOperationId);
                }

                setStatus(newStatus);
                onStatusChange?.(newOperationId, newStatus);

                if (newStatus !== "ONGOING") {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    onCompleted?.(newStatus);
                    if (newStatus === "FAILED") {
                        dispatch(addAlert({
                            description: t("applications:edit.sections.shareApplication.completedSharingNotification.failure.description"),
                            level: AlertLevels.ERROR,
                            message: t("applications:edit.sections.shareApplication.completedSharingNotification.failure.message")
                        }));
                    } else if (newStatus === "SUCCESS") {
                        dispatch(addAlert({
                            description: t("applications:edit.sections.shareApplication.completedSharingNotification.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("applications:edit.sections.shareApplication.completedSharingNotification.success.message")
                        }));
                    } else if (newStatus === "PARTIAL") {
                        dispatch(addAlert({
                            description: t("applications:edit.sections.shareApplication.completedSharingNotification.partialSuccess.description"),
                            level: AlertLevels.WARNING,
                            message: t("applications:edit.sections.shareApplication.completedSharingNotification.partialSuccess.message")
                        }));
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                onError?.(error);
            }
        }, pollingInterval);
    };

    const fetchInitialStatus = async () => {
        try {
            const {operationId: newOperationId, status: initialStatus} = await fetchStatus();
            setStatus(initialStatus);
            onStatusChange?.(newOperationId, initialStatus);

            if (initialStatus === "ONGOING") {
                startPolling();
            } else {
                onCompleted?.(initialStatus);
            }
        } catch (error) {
            onError?.(error);
        }
    };

    useEffect(() => {
        console.log("useOperationStatusPoller initialized.");
        fetchInitialStatus();

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        status,
        startPolling
    };
};
