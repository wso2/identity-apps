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
import React, { FunctionComponent, PropsWithChildren, ReactElement, SyntheticEvent } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

/**
 * Link component Prop types interface.
 */
interface LinkPropsInterface extends IdentifiableComponentInterface {

    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Does the link point to an external source.
     */
    external?: boolean;
    /**
     * Icon to be displayed.
     */
    icon?: SemanticICONS;
    /**
     * Icon position.
     */
    iconPosition?: "left" | "right";
    /**
     * Documentation URL.
     */
    link?: string;
    /**
     * On Click callback.
     */
    onClick?: (e: SyntheticEvent) => void;
    /**
     * Documentation URL target property. Opens in a new window by default.
     */
    target?: string;
}

/**
 * Link component.
 *
 * @param props - Props injected to the component.
 * @returns the link component.
 */
export const Link: FunctionComponent<PropsWithChildren<LinkPropsInterface>> = (
    props: PropsWithChildren<LinkPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        external,
        icon,
        iconPosition,
        link,
        onClick,
        target,
        [ "data-componentid" ]: componentId
    } = props;

    const classes = classNames(
        "link pointing",
        {
            external
        },
        className
    );

    if (!link) {
        return null;
    }

    return (
        <a
            href={ link }
            target={ target }
            rel="noopener noreferrer"
            className={ classes }
            onClick={ (e: SyntheticEvent) => {
                // If `onClick` is not defined, going further will break the behaviour of anchor.
                if (!onClick) {
                    return;
                }

                e.preventDefault();
                onClick(e);
            } }
            data-componentid={ componentId }
        >
            { external && icon && iconPosition === "left" && <Icon className="mr-1" name={ icon } /> }
            { children }
            { external && icon && iconPosition === "right" && <Icon className="ml-1" name={ icon } /> }
        </a>
    );
};

/**
 * Prop types for the component.
 */
Link.defaultProps = {
    "data-componentid": "link",
    external: true,
    icon: "external",
    iconPosition: "right",
    link: "#",
    target: "_blank"
};
