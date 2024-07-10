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
import { childRenderer } from "./utils";

/**
 * Markdown custom component for the ul element.
 *
 * @param Props - Props to be injected into the component.
 */
const UnorderedList: FunctionComponent<
    MarkdownCustomComponentPropsInterface<"ul">
> = (props: MarkdownCustomComponentPropsInterface<"ul">): ReactElement => {
    const {
        children,
        "data-componentid": componentId
    } = props;

    if (!Array.isArray(children)) {
        return null;
    }

    return (
        <ul data-componentid={ componentId }>
            { childRenderer(props) }
        </ul>
    );
};

/**
 * Default props for the `UnorderedList` component.
 */
UnorderedList.defaultProps = {
    "data-componentid": "custom-markdown-ul"
};

export { UnorderedList as ul };
