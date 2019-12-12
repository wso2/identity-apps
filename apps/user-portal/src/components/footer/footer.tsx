/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { LanguageSwitcher } from "../shared";

/**
 * Footer component prop types.
 */
interface AppFooterProps {
    copyright?: string;
}

/**
 * Footer component.
 *
 * @param {AppFooterProps} props - Props supplied to the footer component.
 * @return {JSX.Element}
 */
export const AppFooter: React.FunctionComponent<AppFooterProps> = (
    props: AppFooterProps
): JSX.Element => {
    const { copyright } = props;
    const { t } = useTranslation();
    return (
        <Menu id="app-footer" className="app-footer" fixed="bottom" borderless>
            <Container>
                <Menu.Item className="copyright">
                    {
                        copyright
                            ? copyright
                            : t("views:footer.copyright", { year: new Date().getFullYear() })
                    }
                </Menu.Item>
                <Menu.Menu position="right">
                    <LanguageSwitcher className="footer-dropdown"/>
                    <Menu.Item className="footer-link" as={ Link } to="/privacy">{ t("common:privacy") }</Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

/**
 * Default proptypes for the footer component.
 */
AppFooter.defaultProps = {
    copyright: COPYRIGHT_TEXT
};
