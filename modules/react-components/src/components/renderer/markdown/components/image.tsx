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

import Box from "@oxygen-ui/react/Box";
import { MarkdownCustomComponentPropsInterface } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import "./image.scss";

/**
 * Props interface for the `MarkdownImage` component.
 */
interface MarkdownImageProps extends MarkdownCustomComponentPropsInterface<"img"> {
    /**
     * Custom attributes supplied by the 'rehype-attr' plugin.
     */
    "data-config"?: {
        /**
         * Flag to determine whether the image should get the full width.
         */
        fullWidth?: boolean;
    };
}

/**
 * Markdown custom component for the img element.
 *
 * @param Props - Props to be injected into the component.
 */
const MarkdownImage: FunctionComponent<MarkdownImageProps> = (props: MarkdownImageProps): ReactElement => {
    const {
        src,
        alt,
        "data-config": dataConfig,
        "data-componentid": componentId
    } = props;

    const classes: string = classNames(
        "markdown-image",
        {
            "full-width": dataConfig?.fullWidth
        }
    );

    return (
        <Box
            className={ classes }
            component="img"
            src={ src }
            alt={ alt }
            data-componentid={ componentId }
        />
    );
};

/**
 * Default props for the `MarkdownImage` component.
 */
MarkdownImage.defaultProps = {
    "data-componentid": "custom-markdown-image"
};

export { MarkdownImage as img };
