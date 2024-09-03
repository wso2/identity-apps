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

import { Code, MarkdownCustomComponentPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Markdown custom component for the code element.
 *
 * @param Props - Props to be injected into the component.
 */
const MarkdownCode: FunctionComponent<
    MarkdownCustomComponentPropsInterface<"code">
> = ({
    children,
    "data-componentid": componentId = "custom-markdown-code"
}: MarkdownCustomComponentPropsInterface<"code">): ReactElement => {

    if (typeof children !== "string") {
        return null;
    }

    return (
        <Code data-componentid={ componentId }>{ children }</Code>
    );
};

export default MarkdownCode;
