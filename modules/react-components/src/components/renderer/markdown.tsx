/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { ReactMarkdownProps } from "react-markdown";
import ReactMarkdown from "react-markdown/with-html";

/**
 * Proptypes for the placeholder component.
 */
export interface MarkdownPropsInterface extends ReactMarkdownProps, IdentifiableComponentInterface,
    TestableComponentInterface {

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
            escapeHtml={ false }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        />
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
