/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Icon } from "semantic-ui-react";
import { useDocumentation } from "./use-documentation";

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
        showIcon,
        [ "data-componentid" ]: componentId
    } = props;

    const { getLink } = useDocumentation();

    if (link === undefined) {
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
            { showIcon && (<Icon className="ml-2" name="external alternate"/>) }
        </a>)
    );
};

/**
 * Prop types for the DocumentationLink component.
 */
DocumentationLink.defaultProps = {
    "data-componentid": "documentation-link",
    showEmptyLink: true,
    showIcon: false,
    target: "_blank"
};
