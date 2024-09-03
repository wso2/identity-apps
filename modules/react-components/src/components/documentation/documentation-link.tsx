/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { useDocumentation } from "./use-documentation";
import "./documentation-link.scss";

/**
 * DocumentationLink component Prop types.
 */
interface DocumentationLinkPropsInterface extends IdentifiableComponentInterface {
    /**
     * Documentation URL.
     */
    link: string;
    /**
     * Is provided link a reference to link.
     */
    isLinkRef?: boolean;
    /**
     * Documentation URL target property. Opens in a new window by default.
     */
    target?: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Specifies if the text should be shown for an undefined link.
     */
    showEmptyLinkText?: boolean;
    /**
     * Specifies if a link text with an empty link or a `#` should be shown.
     */
    showEmptyLink?: boolean;
    /**
     * Show documentation icon.
     */
    showIcon?: boolean;
}

/**
 * Documentation link anchor tag component.
 *
 * @param props - Props injected to the component.
 *
 * @returns DocumentationLink Component.
 */
export const DocumentationLink: FunctionComponent<PropsWithChildren<DocumentationLinkPropsInterface>> = (
    props: PropsWithChildren<DocumentationLinkPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        link,
        isLinkRef,
        target,
        showEmptyLink,
        showEmptyLinkText,
        showIcon,
        [ "data-componentid" ]: componentId
    } = props;

    const { getLink } = useDocumentation();

    if (link === undefined) {
        if (showEmptyLinkText) {
            return (
                <span>
                    { children }
                </span>
            );
        }

        return null;
    }

    const classes = classNames("documentation-link ml-1 link external no-wrap", className);
    const url = isLinkRef ? getLink(link) : link;

    return (
        !(!showEmptyLink && (!url || url === "#")) &&
        (<a
            href={ url }
            target={ target }
            rel="noopener noreferrer"
            className={ classes }
            data-componentid={ componentId }
        >
            { children }
            { showIcon && (<ArrowUpRightFromSquareIcon className="documentation-icon" />) }
        </a>)
    );
};

/**
 * Prop types for the DocumentationLink component.
 */
DocumentationLink.defaultProps = {
    "data-componentid": "documentation-link",
    showEmptyLink: true,
    showEmptyLinkText: false,
    showIcon: true,
    target: "_blank"
};
