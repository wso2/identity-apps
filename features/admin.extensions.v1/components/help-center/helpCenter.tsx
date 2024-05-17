/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { GenericIcon } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import { AppState } from "@wso2is/admin.core.v1";
import { ReactComponent as DocIcon } from "../../../themes/wso2is/assets/images/documentation.svg";
import { ReactComponent as HelpIcon } from "../../../themes/wso2is/assets/images/help.svg";

/**
 * Contact Support Icon to link support portal.
 */
export default (): ReactElement => {

    const helpCenterURL: string = useSelector((state: AppState) => state.config.deployment.helpCenterURL);
    const docSiteURL: string = useSelector((state: AppState) => state.config.deployment.docSiteURL);

    const { t } = useTranslation();

    return (
        (helpCenterURL || docSiteURL) && (helpCenterURL !== "" || docSiteURL !== "")
            ? (
                <Menu.Item className="help-center-button-wrapper" key="feedback-button">
                    <Dropdown
                        id="test-in-app-feedback"
                        className="help-center-button help-dropdown"
                        data-testid="help-center-dropdown"
                        pointing="top right"
                        trigger={ (
                            <GenericIcon
                                inverted
                                transparent
                                hoverable
                                hoverType="circular"
                                icon={ (
                                    <Icon
                                        className="help-center-button-icon"
                                        size="large"
                                        name="question circle outline"
                                    />
                                ) }
                                data-testid="help-center-dropdown-trigger-icon"
                                size="auto"
                            />
                        ) }
                        icon={ null }
                    >
                        <Dropdown.Menu>
                            { docSiteURL && docSiteURL !== "" && (
                                <Dropdown.Item
                                    className="help-dropdown-item"
                                    onClick={ () => window.open(docSiteURL, "_blank", "noopener") }
                                    data-testid="help-center-doc-site-nav-link"
                                >
                                    <GenericIcon
                                        transparent
                                        icon={ <DocIcon/>
                                        }
                                        size="auto"
                                        floated="left"
                                        spaced="right"
                                    />
                                    { t("extensions:common.help.docSiteLink") }
                                </Dropdown.Item>
                            ) }
                            { helpCenterURL && helpCenterURL !== "" && (
                                <Dropdown.Item
                                    className="help-dropdown-item"
                                    onClick={ () => window.open(helpCenterURL, "_blank", "noopener") }
                                    data-testid="help-center-support-portal-nav-link"
                                >
                                    <GenericIcon
                                        transparent
                                        icon={ <HelpIcon/>
                                        }
                                        size="auto"
                                        floated="left"
                                        spaced="right"
                                    />
                                    { t("extensions:common.help.helpCenterLink") }
                                </Dropdown.Item>
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            )
            : null
    );
};
