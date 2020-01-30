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

import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { LanguageSwitcher } from "../language-switcher";

/**
 * Footer component prop types.
 */
interface FooterPropsInterface {
    className?: string;
    copyright?: string;
    currentLanguage?: string;
    fixed?: "left" | "right" | "bottom" | "top";
    fluid?: boolean;
    links?: FooterLinkInterface[];
    onLanguageChange?: (language: string) => void;
    showLanguageSwitcher?: boolean;
    supportedLanguages?: object;
}

/**
 * Footer links interface.
 */
interface FooterLinkInterface {
    to: string;
    name: string;
}

/**
 * Footer component.
 *
 * @param {FooterPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const Footer: React.FunctionComponent<FooterPropsInterface> = (
    props: FooterPropsInterface
): JSX.Element => {

    const {
        className,
        copyright,
        currentLanguage,
        fixed,
        fluid,
        links,
        onLanguageChange,
        showLanguageSwitcher,
        supportedLanguages
    } = props;

    const classes = classNames(
        "app-footer",
        {
            [ "fluid-footer" ]: fluid
        }
        , className
    );

    return (
        <Menu id="app-footer" className={ classes } fixed={ fixed } borderless>
            <Container fluid={ fluid }>
                <Menu.Item className="copyright">{ copyright }</Menu.Item>
                <Menu.Menu position="right">
                    {
                        // Only show language switcher if it is set to show and if the required props are passed in.
                        (showLanguageSwitcher && currentLanguage && onLanguageChange && supportedLanguages)
                            ? (
                                <LanguageSwitcher
                                    className="footer-dropdown"
                                    currentLanguage={ currentLanguage }
                                    onLanguageChange={ onLanguageChange }
                                    supportedLanguages={ supportedLanguages }
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
    fixed: "bottom",
    fluid: false,
    showLanguageSwitcher: false
};
