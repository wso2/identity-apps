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

import { CommonUtils } from "@wso2is/core/utils";
import { EmptyPlaceholder, LinkButton } from "@wso2is/react-components";
import React, { ReactNode } from "react";
import { getEmptyPlaceholderIllustrations } from "../configs/ui";

/**
 * Creates a route chunk error handler that stores the app home path in sessionStorage.
 *
 * @param appHomePath - The application home path to store.
 * @returns A callback function for handling route chunk errors.
 */
export const createRouteErrorHandler = (
    appHomePath: string
): ((_error: Error, _errorInfo: React.ErrorInfo) => void) => {
    return (_error: Error, _errorInfo: React.ErrorInfo): void => {
        sessionStorage.setItem("auth_callback_url_console", appHomePath);
    };
};

/**
 * Creates a broken page fallback component with error message and retry action.
 *
 * @param t - The translation function from i18next.
 * @returns A ReactNode representing the broken page fallback UI.
 */
export const createBrokenPageFallback = (
    t: (key: string, defaultValue?: string) => string
): ReactNode => {
    const brokenPageSubtitles: string[] = [
        t("console:common.placeholders.brokenPage.subtitles.0"),
        t("console:common.placeholders.brokenPage.subtitles.1")
    ];

    return (
        <EmptyPlaceholder
            action={ (
                <LinkButton onClick={ () => CommonUtils.refreshPage() }>
                    { t("console:common.placeholders.brokenPage.action") }
                </LinkButton>
            ) }
            image={ getEmptyPlaceholderIllustrations().brokenPage }
            imageSize="tiny"
            subtitle={ brokenPageSubtitles }
            title={ t("console:common.placeholders.brokenPage.title") }
        />
    );
};
