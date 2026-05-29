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

import { useContext } from "react";
import MoesifAnalyticsContext, { MoesifAnalyticsContextInterface } from "../context/moesif-analytics-context";

/**
 * Return type for the useMoesifAnalytics hook.
 */
interface UseMoesifAnalyticsReturn {
    /**
     * Whether Moesif analytics is initialized and ready to track events.
     */
    isEnabled: boolean;
    /**
     * Fires a Moesif action event with optional metadata.
     *
     * @param eventName - The event name (e.g. "Onboarding-Step-Completed").
     * @param metadata - Optional metadata key-value pairs attached to the event.
     */
    track: (eventName: string, metadata?: Record<string, unknown>) => void;
}

// No-op fallback for when the hook is used outside the provider (e.g. tests).
const NOOP_TRACK: () => void = (): void => { /* noop */ };

/**
 * Hook to consume the Moesif analytics context.
 * Returns a no-op implementation if used outside `MoesifAnalyticsProvider`.
 *
 * @returns Object with `track` function and `isEnabled` flag.
 */
export const useMoesifAnalytics = (): UseMoesifAnalyticsReturn => {
    const context: MoesifAnalyticsContextInterface | undefined = useContext(MoesifAnalyticsContext);

    if (context === undefined) {
        return { isEnabled: false, track: NOOP_TRACK };
    }

    return context;
};
