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
import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { LanguageSwitcher, SupportedLanguagesInterface } from "../language-switcher";

/**
 * Footer component prop types.
 */
export interface FooterPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Copyright text.
     */
    copyright?: string;
    /**
     * Currently selected language.
     */
    currentLanguage?: string;
    /**
     * Fixed direction.
     */
    fixed?: "left" | "right" | "bottom" | "top";
    /**
     * Flag for fluid behavior.
     */
    fluid?: boolean;
    /**
     * Set of footer links.
     */
    links?: FooterLinkInterface[];
    /**
     * Callback for language change.
     * @param language - Language code for the Changed language.
     */
    onLanguageChange?: (language: string) => void;
    /**
     * Show/Hide language switcher dropdown caret icon.
     */
    showLanguageSwitcherDropdownCaret?: boolean;
    /**
     * Should the switcher be shown.
     */
    showLanguageSwitcher?: boolean;
    /**
     * Set of supported languages.
     */
    supportedLanguages?: SupportedLanguagesInterface;
}

/**
 * Footer links interface.
 */
export interface FooterLinkInterface {
    /**
     * Link location.
     */
    to: string;
    /**
     * Link name.
     */
    name: string;
}

/**
 * Footer component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Footer React Component
 */
export const Footer: FunctionComponent<FooterPropsInterface> = (
    props: FooterPropsInterface
): ReactElement => {

    const {
        className,
        copyright,
        currentLanguage,
        fixed,
        fluid,
        links,
        onLanguageChange,
        showLanguageSwitcher,
        showLanguageSwitcherDropdownCaret,
        supportedLanguages,
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const classes = classNames(
        "app-footer",
        {
            [ "fluid-footer" ]: fluid
        }
        , className
    );

    return (
        <Menu
            stackable
            id="app-footer"
            className={ classes }
            fixed={ fixed }
            fluid={ fluid }
            borderless
            data-componentid={ componentId }
            data-testid={ testId }
        >
            <Container
                fluid={ fluid }
                data-componentid={ `${ componentId }-container` }
                data-testid={ `${ testId }-container` }
                className="app-footer-container"
            >
                <Menu.Item
                    className="copyright"
                    data-componentid={ `${ componentId }-copyright` }
                    data-testid={ `${ testId }-copyright` }
                >
                    { copyright }
                </Menu.Item>
                <Menu.Menu
                    position="right"
                    data-componentid={ `${ componentId }-menu` }
                    data-testid={ `${ testId }-menu` }
                >
                    {
                        // Only show language switcher if it is set to show and if the required props are passed in.
                        (showLanguageSwitcher && currentLanguage && onLanguageChange && supportedLanguages)
                            ? (
                                <LanguageSwitcher
                                    className="footer-dropdown"
                                    currentLanguage={ currentLanguage }
                                    onLanguageChange={ onLanguageChange }
                                    showDropdownCaret={ showLanguageSwitcherDropdownCaret }
                                    supportedLanguages={ supportedLanguages }
                                    data-componentid={ `${ componentId }-language-switcher` }
                                    data-testid={ `${ testId }-language-switcher` }
                                />
                            )
                            : null
                    }
                    {
                        (links && links.length && links.length > 0)
                            ? links.map((link, index) => (
                                <Menu.Item
                                    className="footer-link"
                                    as={ Link }
                                    key={ index }
                                    to={ link.to }
                                    data-componentid={ `${ componentId }-link-${ link.name }` }
                                    data-testid={ `${ testId }-link-${ link.name }` }
                                >
                                    { link.name }
                                </Menu.Item>
                            ))
                            : null
                    }
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

/**
 * Default proptypes for the footer component.
 */
Footer.defaultProps = {
    "data-componentid": "app-footer",
    "data-testid": "app-footer",
    fixed: "bottom",
    fluid: false,
    showLanguageSwitcher: false,
    showLanguageSwitcherDropdownCaret: false
};
