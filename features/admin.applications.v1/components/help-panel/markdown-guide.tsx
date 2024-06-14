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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmphasizedSegment,
    Markdown
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Prop types of the `MarkdownGuide` component.
 */
export interface MarkdownGuidePropsInterface extends IdentifiableComponentInterface {
    /**
     * Content to be displayed in Markdown format.
     */
    content: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
}

/**
 * Markdown guide generation component.
 *
 * @param Props - Props to be injected into the component.
 */
export const MarkdownGuide: FunctionComponent<MarkdownGuidePropsInterface> = (
    props: MarkdownGuidePropsInterface
): ReactElement => {
    const {
        content,
        isLoading,
        ["data-componentid"]: componentId
    } = props;

    return (
        <EmphasizedSegment data-componentid={ componentId } padded="very">
            {
                isLoading
                    ? <ContentLoader inline="centered" active/>
                    : (
                        <Markdown
                            source={ content }
                        />
                    )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the `MarkdownGuide` guide.
 */
MarkdownGuide.defaultProps = {
    "data-componentid": "markdown-guide"
};
