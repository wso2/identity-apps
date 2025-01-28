/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    Markdown
} from "@wso2is/react-components";
import get from "lodash-es/get";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import "./markdown-guide.scss";

/**
 * Prop types of the `MarkdownGuide` component.
 */
export interface MarkdownGuidePropsInterface extends IdentifiableComponentInterface {
    /**
     * Data that can be templated in a Markdown script.
     */
    data: Record<string, unknown>;
    /**
     * Content to be displayed in Markdown format.
     */
    content: string;
    /**
     * Is the markdown data request loading.
     */
    isLoading?: boolean;
}

/**
 * Markdown guide generation component.
 *
 * @param Props - Props to be injected into the component.
 */
export const MarkdownGuide: FunctionComponent<MarkdownGuidePropsInterface> = ({
    data,
    content,
    isLoading,
    ["data-componentid"]: componentId = "markdown-guide"
}: MarkdownGuidePropsInterface): ReactElement => {

    const appBaseName: string = useSelector((state: AppState) =>
        state?.config?.deployment?.appBaseName);

    /**
     * Create the final markdown content to render by replacing the possible
     * included placeholders.
     */
    const moderatedContent: string = useMemo(() => {
        return content.replace(/\${([^}]+?)}/g, (match: string, key: string) => {
            const propertyValue: unknown = get(data, key);

            if (propertyValue && typeof propertyValue === "string") {
                return propertyValue;
            }

            return match;
        });
    }, [ content, data ]);

    /**
     * Manage internal navigation for relative URLs.
     *
     * @param path - Relative pathname.
     */
    const handleInternalUrl = (path: string) => {
        let pathname: string = path;

        if (!pathname?.startsWith("/")) {
            pathname = "/" + pathname;
        }

        if (!pathname?.startsWith(appBaseName)) {
            pathname = appBaseName + pathname;
        }

        history.push({ pathname });
    };

    return (
        <Grid className="markdown-guide" data-componentid={ componentId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 13 }>
                    {
                        isLoading || !moderatedContent
                            ? <ContentLoader inline="centered" active/>
                            : (
                                <Markdown
                                    properties={ {
                                        onHandleInternalUrl: handleInternalUrl
                                    } }
                                    source={ moderatedContent }
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
