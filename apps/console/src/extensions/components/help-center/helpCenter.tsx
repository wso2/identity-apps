/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { GenericIcon } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import { AppState } from "../../../features/core";
import { ReactComponent as DocIcon } from "../../../themes/asgardio/assets/images/documentation.svg";
import { ReactComponent as HelpIcon } from "../../../themes/asgardio/assets/images/help.svg";

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
                        trigger={
                            <GenericIcon
                                inverted
                                transparent
                                hoverable
                                hoverType="circular"
                                icon={
                                    <Icon
                                        className="help-center-button-icon"
                                        size="large"
                                        name="question circle outline"
                                    />
                                }
                                data-testid="help-center-dropdown-trigger-icon"
                                size="auto"
                            />
                        }
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
