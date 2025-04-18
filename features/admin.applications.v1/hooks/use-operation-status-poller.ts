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

export type OperationStatus = "IDLE" | "ONGOING" | "SUCCESS" | "FAILED" | "PARTIAL";

export interface UseOperationStatusPollerOptions {
    pollingInterval?: number;
    fetchStatus: () => Promise<"IDLE" | "ONGOING" | "SUCCESS" | "FAILED" | "PARTIAL">;
    onCompleted?: () => void;
}

export const useOperationStatusPoller = ({
    pollingInterval = 5000,
    fetchStatus,
    onCompleted
}: UseOperationStatusPollerOptions) => {

    const [ status, setStatus ] = useState<OperationStatus>("IDLE");
    const intervalRef = useRef<number | null>(null);

    const startPolling = () => {
        if (status === "ONGOING") return;

        setStatus("ONGOING");

        intervalRef.current = window.setInterval(async () => {
            try {
                const result: string = await fetchStatus();

                if (result === "SUCCESS" || result === "FAILED" || result === "PARTIAL") {
                    if (intervalRef.current !== null) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setStatus(result);
                    onCompleted?.();
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, pollingInterval);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        startPolling,
        status
    };
};
