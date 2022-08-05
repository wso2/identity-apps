/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FC, ReactElement, ReactNode } from "react";

export type DynamicTilePropsInterface = {
    outlined?: boolean;
    disabled?: boolean;
    reduceOpacity?: boolean;
    clipped?: boolean;
    whiteBackground?: boolean;
    grayedOut?: boolean;
    header?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
    /**
     * You can specify whether the footer content/items
     * should be justified to the end or not. Otherwise,
     * by default it has {@code justify-content: space-between}
     */
    justifyFooter?: "end" | "start";
    bodyAlignment?: "center" | "start";
} & IdentifiableComponentInterface & any;

export const DynamicTile: FC<DynamicTilePropsInterface> = (
    props: DynamicTilePropsInterface
): ReactElement => {

    const {
        className,
        clipped,
        outlined,
        disabled,
        reduceOpacity,
        grayedOut,
        header,
        body,
        footer,
        whiteBackground,
        justifyFooter,
        bodyAlignment,
        ["data-componentid"]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "application-tile",
        {
            /**
             * If there's no header or footer we force center the
             * body of the card to make it even.
             */
            "auto-vh-center": !header && !footer,
            "clipped": clipped,
            "cursor-not-allowed": disabled,
            "grayscale": grayedOut,
            "opacity-50": reduceOpacity,
            outlined,
            "white-bg": whiteBackground
        },
        className
    );

    return (
        <div
            { ...rest }
            className={ classes }
            data-componentid={ testId }>
            { header && (
                <div className="header">
                    { header }
                </div>
            ) }
            { body && (
                <div
                    className={ classNames("body", {
                        "center": bodyAlignment === "center",
                        "start": bodyAlignment === "start"
                    }) }>
                    { body }
                </div>
            ) }
            { footer && (
                <div
                    className={ classNames("footer", {
                        "justify-end": justifyFooter === "end",
                        "justify-start": justifyFooter === "start"
                    }) }>
                    { footer }
                </div>
            ) }
        </div>
    );

};

/**
 * Default props {@link DynamicTile}
 */
DynamicTile.defaultProps = {
    bodyAlignment: "center",
    className: null,
    clipped: true,
    "data-componentid": "dynamic-tile",
    grayedOut: false,
    justifyFooter: undefined,
    outlined: false,
    reduceOpacity: false,
    whiteBackground: false
};
