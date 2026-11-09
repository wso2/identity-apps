/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Status of a POLL step's polling.
 */
export const PollStatus = Object.freeze({
    ERROR: "ERROR",
    EXPIRED: "EXPIRED",
    FAILED: "FAILED",
    SUCCESS: "SUCCESS",
    WAITING: "WAITING"
});

const DEFAULT_POLL_INTERVAL_SECONDS = 3;
const MAX_POLL_INTERVAL_SECONDS = 30;
const MAX_FAILED_REQUESTS = 5;

/**
 * Resolves when the polling expires. It counts down from the server's expiresIn, so a wrong browser clock does not
 * matter, and expires a second early so the last poll never hits an expired entry.
 *
 * @param {string} expiresIn - Seconds until the polling expires.
 * @returns {number|null} Expiry time in milliseconds, or null if the polling does not expire.
 */
const resolveExpiresAt = (expiresIn) => {
    const seconds = parseInt(expiresIn, 10);

    return isNaN(seconds) ? null : Date.now() + Math.max(seconds - 1, 0) * 1000;
};

/**
 * Polls a POLL step's status until it succeeds, fails or expires. Polling restarts for a new poll token.
 *
 * @param {object} params - Polling parameters.
 * @param {string} params.pollUrl - URL that takes a POST of `{ pollToken }` and returns `{ status }`.
 * @param {string} params.pollToken - Poll token of the step.
 * @param {string} params.pollInterval - Seconds between polls.
 * @param {string} params.expiresIn - Seconds until the polling expires.
 * @param {Function} params.onSuccess - Called once the status is SUCCESS.
 * @param {Function} params.onError - Called after too many failed requests in a row. An error answered by the
 * server fails the polling at once.
 * @returns {{ status: string, remainingMs: number|null }} Polling status and the time left.
 */
export const useFlowPolling = ({ pollUrl, pollToken, pollInterval, expiresIn, onSuccess, onError }) => {
    const [ status, setStatus ] = useState(PollStatus.WAITING);
    const [ expiresAt, setExpiresAt ] = useState(() => resolveExpiresAt(expiresIn));
    const [ now, setNow ] = useState(Date.now());
    const callbacksRef = useRef({ onError, onSuccess });

    callbacksRef.current = { onError, onSuccess };

    useEffect(() => {
        setStatus(PollStatus.WAITING);
        setExpiresAt(resolveExpiresAt(expiresIn));
        setNow(Date.now());
    }, [ pollToken, expiresIn ]);

    useEffect(() => {
        if (status !== PollStatus.WAITING || !expiresAt) {
            return;
        }

        const tick = setInterval(() => {
            const currentTime = Date.now();

            setNow(currentTime);
            if (currentTime >= expiresAt) {
                setStatus(PollStatus.EXPIRED);
            }
        }, 1000);

        return () => clearInterval(tick);
    }, [ status, expiresAt ]);

    useEffect(() => {
        if (status !== PollStatus.WAITING || !pollToken || !pollUrl) {
            return;
        }

        const intervalSeconds = parseInt(pollInterval, 10) || DEFAULT_POLL_INTERVAL_SECONDS;
        const delayMs = Math.min(Math.max(intervalSeconds, 1), MAX_POLL_INTERVAL_SECONDS) * 1000;
        let cancelled = false;
        let controller = null;
        let timer = null;
        let failedRequests = 0;

        const schedulePoll = () => {
            timer = setTimeout(poll, delayMs);
        };

        const poll = () => {
            if (expiresAt && Date.now() >= expiresAt) {
                setStatus(PollStatus.EXPIRED);

                return;
            }
            controller = new AbortController();
            fetch(pollUrl, {
                body: JSON.stringify({ pollToken }),
                cache: "no-store",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                signal: controller.signal
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Flow poll request failed.");
                    }

                    return response.json();
                })
                .then((data) => {
                    if (cancelled) {
                        return;
                    }
                    // The server answered with an error, so retrying would not help.
                    if (data.error) {
                        setStatus(PollStatus.FAILED);

                        return;
                    }
                    failedRequests = 0;
                    if (data.status === PollStatus.SUCCESS) {
                        setStatus(PollStatus.SUCCESS);
                        if (callbacksRef.current.onSuccess) {
                            callbacksRef.current.onSuccess();
                        }
                    } else if (data.status === PollStatus.FAILED) {
                        setStatus(PollStatus.FAILED);
                    } else {
                        schedulePoll();
                    }
                })
                .catch(() => {
                    if (cancelled) {
                        return;
                    }
                    failedRequests++;
                    if (failedRequests >= MAX_FAILED_REQUESTS) {
                        setStatus(PollStatus.ERROR);
                        if (callbacksRef.current.onError) {
                            callbacksRef.current.onError();
                        }

                        return;
                    }
                    schedulePoll();
                });
        };

        schedulePoll();

        return () => {
            cancelled = true;
            clearTimeout(timer);
            if (controller) {
                controller.abort();
            }
        };
    }, [ status, pollUrl, pollToken, pollInterval, expiresAt ]);

    return {
        remainingMs: expiresAt ? Math.max(expiresAt - now, 0) : null,
        status
    };
};
