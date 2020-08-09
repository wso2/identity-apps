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

import { I18n } from "@wso2is/i18n";
import { EmptyPlaceholder, ErrorBoundary } from "@wso2is/react-components";
import React, { Suspense, lazy } from "react";
import { Placeholder } from "semantic-ui-react";
import * as getConfig from "./config";
import { EmptyPlaceholderIllustrations } from "../features/core";

interface ComponentExtensionInterface {
    component?: string;
    subComponent?: string;
    type?: string;
}

/**
 * Identity Apps Component Extension
 * Note : This component will read the config.js and identify `componentExtensions` 
 * key and will generate appropriate extension content. 
 * 
 * Current Support : Tab Extensions
 * TODO : Support for other types of components
 * 
 * @param props - extension props
 */
export const ComponentExtensionPlaceholder = ( args: ComponentExtensionInterface ): any[] => {

    const { 
        component,
        subComponent,
        type
    } = args;

    if (type === "tab") {
        const componentExtensionConfig: any[] = getConfig()?.componentExtensions;
        const tabPanes: any[] = [];

        if (componentExtensionConfig.length < 1) {
            return tabPanes;
        }

        const config = componentExtensionConfig.reduce(config => {
            return config.component === component && config.subComponent === subComponent && config.type === type
        })

        if (config && config.panes && config.panes.length > 0) {
            config.panes.map(pane => {
                const DynamicLoader = lazy(() => import(`${pane.path}`))
                tabPanes.push({
                    menuItem: I18n.instance.t(pane.title),
                    render: () => (
                        <ErrorBoundary
                            fallback={ (
                                <EmptyPlaceholder
                                    image={ EmptyPlaceholderIllustrations.genericError }
                                    imageSize="tiny"
                                    subtitle={ [
                                        I18n.instance.t("devPortal:placeholders.genericError.subtitles.0"),
                                        I18n.instance.t("devPortal:placeholders.genericError.subtitles.1")
                                    ] }
                                    title={ I18n.instance.t("devPortal:placeholders.genericError.title") }
                                />
                            ) }
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
                                
                                <DynamicLoader />
                            </Suspense>
                        </ErrorBoundary>
                    )
                })
            })
        }

        return tabPanes;
    }

    return [];

}

