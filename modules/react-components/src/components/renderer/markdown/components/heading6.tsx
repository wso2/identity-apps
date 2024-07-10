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

import Typography from "@oxygen-ui/react/Typography";
import { MarkdownCustomComponentPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { childRenderer } from "./utils";

/**
 * Markdown custom component for the h6 element.
 *
 * @param Props - Props to be injected into the component.
 */
const Heading6: FunctionComponent<
    MarkdownCustomComponentPropsInterface<"h6">
> = (props: MarkdownCustomComponentPropsInterface<"h6">): ReactElement => {
    const {
        children,
        "data-componentid": componentId
    } = props;

    if (!children) {
        return null;
    }

    return (
        <Typography variant="subtitle1" component="h6" data-componentid={ componentId }>
            {
                typeof children === "string" ? (
                    children
                ): (
                    childRenderer(props)
                )
            }
        </Typography>
    );
};

/**
 * Default props for the `Heading6` component.
 */
Heading6.defaultProps = {
    "data-componentid": "custom-markdown-heading6"
};

export { Heading6 as h6 };
