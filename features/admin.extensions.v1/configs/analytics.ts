/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AnalyticsConfig } from "./models/analytics";
import { AppInsights } from "../utils/application-insights";

export const analyticsConfig: AnalyticsConfig = {
    EventPublisherExtension: {
        compute: (computation: () => void) => AppInsights.getInstance().compute(computation),
        init: () => AppInsights.getInstance().init(),
        publish: (eventId: string, customProperties?: { [key: string]: string | Record<string, unknown> | 
                number }) => {
            AppInsights.getInstance().trackEvent(eventId, customProperties);
        },
        record: (pathname: string, startTimeInMs: number, duration: number, 
            responseCode: number, isSuccess: boolean, customProperties?: { [key: string]: any }) => { 
            AppInsights.getInstance().trackDependency(
                pathname ?? "AUTH_EXCEPTION", 
                startTimeInMs, 
                duration ?? Number.MAX_SAFE_INTEGER, 
                responseCode, 
                isSuccess,
                customProperties
            );
        }
    }
};
