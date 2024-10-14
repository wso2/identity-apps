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

import Alert, { AlertProps } from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import { MarkdownCustomComponentPropsInterface } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { childRenderer } from "./utils";
import "./blockquote.scss";

/**
 * Custom blockquote component types.
 */
enum CustomBlockquoteTypes {
    WRAPPER = "wrapper"
}

/**
 * Props interface for the `Blockquote` component.
 */
interface BlockquoteProps extends MarkdownCustomComponentPropsInterface<"blockquote"> {
    /**
     * Custom attributes supplied by the 'rehype-attr' plugin.
     */
    "data-config"?: {
        /**
         * Type of the alert message.
         */
        type?: AlertProps["severity"] | CustomBlockquoteTypes;
        /**
         * Title of the alert message.
         */
        title?: string;
        /**
         * Variant of the alert box.
         * filled or outlined
         */
        variant?: AlertProps["variant"];
        /**
         * Boolean flag to determine if the icon should be displayed.
         */
        icon?: boolean;
        /**
         * If the component type is wrapper how much indentation is needed.
         * 1 Indent = 5px
         */
        indent?: number;
    };
}

/**
 * Markdown custom component for the blockquote element.
 *
 * @param Props - Props to be injected into the component.
 */
const Blockquote: FunctionComponent<BlockquoteProps> = ({
    children,
    "data-config": dataConfig,
    "data-componentid": componentId = "custom-markdown-blockquote"
}: BlockquoteProps): ReactElement => {

    if (!children || !Array.isArray(children)) {
        return null;
    }

    const classes: string = classNames({ "markdown-blockquote-alert": !dataConfig?.type });

    return (
        dataConfig?.type === CustomBlockquoteTypes.WRAPPER
            ? (
                <div
                    style={ {
                        marginLeft: `${ 5 * (dataConfig?.indent === undefined ? 0 : dataConfig?.indent) }px`
                    } }
                >
                    { childRenderer({ children }) }
                </div>
            )
            : (
                <Alert
                    severity={ dataConfig?.type }
                    className={ classes }
                    icon={ dataConfig?.type ? (dataConfig?.icon === false ? false : undefined) : false }
                    // TODO: Remove any casting once https://github.com/wso2/oxygen-ui/issues/292 is addressed.
                    variant={ (dataConfig?.type ? dataConfig?.variant ?? "standard" : "standard") as any }
                    data-componentid={ componentId }
                >
                    {
                        dataConfig?.title ? (
                            <AlertTitle>{ dataConfig?.title }</AlertTitle>
                        ) : null
                    }
                    { childRenderer({ children }) }
                </Alert>
            )
    );
};

export default Blockquote;
