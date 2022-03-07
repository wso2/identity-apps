/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { EmptyPlaceholder, ErrorBoundary  } from "@wso2is/react-components";
import React, { ErrorInfo, ReactElement, Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Placeholder } from "semantic-ui-react";
import { ExtensionsManager } from "./extensions-manager";
import { AppUtils, EventPublisher, getEmptyPlaceholderIllustrations } from "../features/core";

/**
 * Extension Interface.
 *
 * @interface ExtensionInterface - Component placeholder properties.
 */
interface ExtensionInterface {
    section: "feedback-button" | "tenant-dropdown";
    type: "component";
}

/**
 * Extended Component.
 *
 * @param {ExtensionInterface} props
 * @returns {ReactElement}
 */
export const ComponentPlaceholder = (props: ExtensionInterface): ReactElement => {

    const { section, type } = props;

    const { t } = useTranslation();

    const [ Component, setComponent ] = useState<JSX.Element|any>(null);

    const fragment = ExtensionsManager.getConfig()?.sections[ type + "s" ]?.[ section ];

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {

        if (Component || !fragment) {
            return;
        }

        setComponent(lazy(() => import(`${fragment}`)));
    }, [ fragment ]);

    return (
        <ErrorBoundary
            onChunkLoadError={ AppUtils.onChunkLoadError }
            fallback={ (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    subtitle={ [
                        t("console:common.placeholders.genericError.subtitles.0"),
                        t("console:common.placeholders.genericError.subtitles.1")
                    ] }
                    title={ t("console:common.placeholders.genericError.title") }
                />
            ) }
            handleError={ (error: Error, errorInfo: ErrorInfo) => {
                eventPublisher.publish("error-in-component-placeholder", {
                    error: error?.name,
                    errorInfo: errorInfo?.componentStack,
                    stack: error?.stack
                });
            } }
        >
            <Suspense
                fallback={ (
                    <Placeholder>
                        <Placeholder.Header>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                ) }>
                {
                    Component && <Component />
                }
            </Suspense>
        </ErrorBoundary>
    );
};
