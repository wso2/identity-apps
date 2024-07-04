/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import ReactMarkdown, { ExtraProps, Options } from "react-markdown";
import rehypeAttrs from "rehype-attr";

/**
 * Props interface for the Markdown custom component.
 */
export type MarkdownCustomComponentPropsInterface<
    TagName extends keyof JSX.IntrinsicElements
> = JSX.IntrinsicElements[TagName] & ExtraProps & IdentifiableComponentInterface;

/**
 * Proptypes for the placeholder component.
 */
export interface MarkdownPropsInterface extends Options, IdentifiableComponentInterface,
    TestableComponentInterface {
    /**
     * Content written in Markdown format to be displayed.
     */
    source: string;
    /**
     * Text alignment.
     */
    textAlign?: "left" | "center" | "right";
}

/**
 * Markdown renderer component.
 *
 * @param props - Props injected in to the component.
 *
 * @returns the markdown renderer component
 */
export const Markdown: FunctionComponent<MarkdownPropsInterface> = (props: MarkdownPropsInterface): ReactElement => {

    const {
        source,
        className,
        textAlign,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "markdown",
        {
            [ `text-align-${ textAlign }` ]: textAlign
        }
        , className
    );

    return (
        <ReactMarkdown
            className={ classes }
            skipHtml={ true }
            data-componentid={ componentId }
            data-testid={ testId }
            rehypePlugins={ [ rehypeAttrs ] }
            { ...rest }
        >
            { source }
        </ReactMarkdown>
    );
};

/**
 * Default proptypes for the markdown component.
 */
Markdown.defaultProps = {
    "data-componentid": "markdown-renderer",
    "data-testid": "markdown-renderer",
    textAlign: "left"
};
