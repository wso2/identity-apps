/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import isObject from "lodash-es/isObject";
import React, { PropsWithChildren, ReactElement } from "react";
import { Icon, Popup, PopupProps, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

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
 * @param {React.PropsWithChildren<HintPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
     * @return {PopupProps}
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
     * @return {ReactElement}
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
                            trigger={ resolveIcon() }
                            content={ children }
                            data-componentid={ `${ componentId }-popup` }
                            data-testid={ `${ testId }-popup` }
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
