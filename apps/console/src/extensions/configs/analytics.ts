/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
