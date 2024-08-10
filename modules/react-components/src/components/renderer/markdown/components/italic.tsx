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

import { MarkdownCustomComponentPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Markdown custom component for the em element.
 *
 * @param Props - Props to be injected into the component.
 */
const MarkdownEM: FunctionComponent<
    MarkdownCustomComponentPropsInterface<"em">
> = ({
    children,
    "data-componentid": componentId = "custom-markdown-em"
}: MarkdownCustomComponentPropsInterface<"em">): ReactElement => {

    if (typeof children !== "string") {
        return null;
    }

    return (
        <em data-componentid={ componentId }>{ children }</em>
    );
};

export default MarkdownEM;
