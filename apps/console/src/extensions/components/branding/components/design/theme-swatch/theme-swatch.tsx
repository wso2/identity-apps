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
import React, { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactElement } from "react";
import { PredefinedThemes } from "../../../meta";
import { BrandingPreferenceColorsInterface } from "../../../models";

/**
 * Proptypes for the Theme Swatch component.
 */
export interface ThemeSwatchInterface extends IdentifiableComponentInterface {

    /**
     * Is the swatch active.
     */
    active?: boolean;
    /**
     * Color Palette of the theme.
     */
    colors: ThemeSwatchRenderColorsInterface;
    /**
     * Additional CSS classes.
     */
    className?: string
    /**
     * Theme swatch click event handler.
     */
    onClick: MouseEventHandler<HTMLDivElement>;
}

/**
 * Interface for the Theme swatch UI configs.
 */
export interface ThemeSwatchUIConfigsInterface {
    /**
     * Theme swatch display name.
     */
    displayName: string;
    /**
     * Theme swatch type.
     */
    type: PredefinedThemes;
    /**
     * Theme swatch colors.
     */
    colors: ThemeSwatchRenderColorsInterface;
}

/**
 * Interface for the theme swatch render colors.
 */
export interface ThemeSwatchRenderColorsInterface extends BrandingPreferenceColorsInterface {

    /**
     * Header background color to be shown in the swatch for the theme.
     */
    headerBackground: string;
    /**
     * Header border bottom color to be shown in the swatch for the theme.
     */
    headerBorderColor: string;
    /**
     * Page background color to be shown in the swatch for the theme.
     */
    pageBackground: string;
}

/**
 * Theme Swatch Component.
 *
 * @param {PropsWithChildren<ThemeSwatchInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ThemeSwatch: FunctionComponent<PropsWithChildren<ThemeSwatchInterface>> = (
    props: PropsWithChildren<ThemeSwatchInterface>
): ReactElement => {

    const {
        active,
        children,
        className,
        colors,
        onClick,
        [ "data-componentid" ]: componentId
    } = props;

    const classes = classNames(
        "theme-swatch",
        {
            active
        },
        className
    );

    return (
        <div
            data-componentid={ componentId }
            className={ classes }
            onClick={ onClick }
        > 
            <div className="theme-preview">
                <div className="theme-preview-inner">
                    <div
                        className="theme-preview-header-nav"
                        style={ {
                            background: colors?.headerBackground,
                            borderBottomColor: colors?.headerBorderColor
                        } }
                    >
                        <div className="theme-preview-header-nav-close-button" />
                    </div>
                    <div
                        className="theme-preview-content"
                        style={ {
                            background: colors?.pageBackground
                        } }
                    >
                        <div className="theme-preview-content-row">
                            <div className="theme-preview-content-placeholder logo-placeholder" />
                        </div>
                        <div className="theme-preview-content-row login-box">
                            <div className="theme-preview-content-placeholder login-box-placeholder">
                                <div className="theme-preview-content-placeholder heading-placeholder" />
                                <div className="login-box-input">
                                    <div className="theme-preview-content-placeholder" />
                                </div>
                                <div className="login-box-input">
                                    <div className="theme-preview-content-placeholder" />
                                </div>
                                <div
                                    className="login-box-input button"
                                    style={ {
                                        background: colors?.primary
                                    } }
                                >
                                    <div className="theme-preview-content-placeholder button-text-placeholder" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="theme-swatch-control">
                { children }
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
ThemeSwatch.defaultProps = {
    "data-componentid": "theme-swatch"
};
