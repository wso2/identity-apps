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
import isObject from "lodash-es/isObject";
import React, { PropsWithChildren, ReactElement } from "react";
import { Icon, PopupProps, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { Popup } from "../popup";

/**
 * Heading component prop types.
 */
export interface HintPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Renders without any margins.
     */
    compact?: boolean;
    /**
     * Determines if the hint is in the disabled state.
     */
    disabled?: boolean;
    /**
     * Icon to be displayed
     */
    icon?: SemanticICONS;
    /**
     * Display inline.
     */
    inline?: boolean;
    /**
     * Hides the component.
     */
    hidden?: boolean;
    /**
     * Display the hint inside a popup.
     */
    popup?: boolean;
    /**
     * Popup options
     */
    popupOptions?: PopupProps;
    /**
     * Is the hint a warning?.
     */
    warning?: boolean;
}

/**
 * Default Popup Options
 */
const DEFAULT_POPUP_OPTIONS: PopupProps = {
    hoverable: true,
    position: "top center"
};

/**
 * Hint component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Hint component.
 */
export const Hint: React.FunctionComponent<PropsWithChildren<HintPropsInterface>> = (
    props: PropsWithChildren<HintPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        compact,
        disabled,
        hidden,
        icon,
        inline,
        popup,
        popupOptions,
        warning,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "ui-hint",
        {
            compact,
            disabled,
            hidden,
            inline: popup ? true : inline,
            popup
        },
        className
    );

    /**
     * Aggregated popup options.
     *
     * @returns Popup props.
     */
    const resolvePopupOptions = (): PopupProps => {

        // If `popupOptions` are externally propvided, merge it with the default.
        if (popupOptions && isObject(popupOptions)) {
            return {
                ...DEFAULT_POPUP_OPTIONS,
                ...popupOptions
            };
        }

        return DEFAULT_POPUP_OPTIONS;
    };

    /**
     * Resolves hit icon.
     *
     * @returns Hit icon.
     */
    const resolveIcon = (): ReactElement => {

        let iconType: SemanticICONS = icon || "info circle";
        let iconColor: SemanticCOLORS = "grey";

        if (warning) {
            iconType = "warning sign";
            iconColor = "yellow";
        }

        return <Icon color={ iconColor } floated="left" name={ iconType } />;
    };

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            {
                popup
                    ? (
                        <Popup
                            inverted
                            trigger={ resolveIcon() }
                            content={ children }
                            data-componentid={ `${ componentId }-popup` }
                            data-testid={ `${ testId }-popup` }
                            popper={ <div style={ { filter: "none" } }/> }
                            { ...resolvePopupOptions() }
                        />
                    )
                    : (
                        <div style={ { columnGap: ".2rem", display: "inline-flex" } }>
                            { resolveIcon() }
                            <div>{ children }</div>
                        </div>
                    )
            }
        </div>
    );
};

/**
 * Default props for the hint component.
 */
Hint.defaultProps = {
    compact: false,
    "data-componentid": "hint",
    "data-testid": "hint",
    inline: false,
    popup: false
};
