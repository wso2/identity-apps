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

import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { StringUtils } from "@wso2is/core/utils";
import { Logo, ProductBrand } from "@wso2is/react-components";
import React from "react";
import { useSelector } from "react-redux";
import { Container, Divider, Responsive, Sidebar } from "semantic-ui-react";
import { SidePanelProps } from "./side-panel";
import { SidePanelItems } from "./side-panel-items";
import { ConfigReducerStateInterface } from "../../models";
import { AppState } from "../../store";
import { AppFooter } from "../footer";

/**
 * Mobile side panel component Prop types.
 */
interface SidePanelMobileProps extends SidePanelProps {
    children?: React.ReactNode;
    onPusherClick: () => void;
    visible: boolean;
}

/**
 * Mobile side panel component.
 *
 * @param {SidePanelMobileProps} props - Props injected to the mobile side panel component.
 * @return {JSX.Element}
 */
export const SidePanelMobile: React.FunctionComponent<SidePanelMobileProps> = (
    props: SidePanelMobileProps
): JSX.Element => {

    const {
        headerHeight,
        children,
        onPusherClick,
        visible,
        onSidePanelItemClick,
        ["data-testid"]: testId
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <Sidebar.Pushable data-testid={ `${testId}-pushable` }>
            <Sidebar
                animation="push"
                visible={ visible }
            >
                <Container className="mt-2">
                    <ProductBrand
                        mobile
                        appName={ config.ui.appName }
                        style={ { marginTop: 0 } }
                        logo={ (
                            <Logo
                                className="portal-logo"
                                image={
                                    resolveAppLogoFilePath(window[ "AppUtils" ].getConfig().ui.appLogoPath,
                                        `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                        `${
                                            StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase)
                                        }/libs/themes/` +
                                        config.ui.theme.name)
                                }
                            />
                        ) }
                        productName={ config.ui.productName }
                        version={ config.ui.productVersionConfig?.productVersion }
                        versionUISettings={ {
                            allowSnapshot: config.ui.productVersionConfig?.allowSnapshot,
                            labelColor: config.ui.productVersionConfig?.labelColor,
                            textCase: config.ui.productVersionConfig?.textCase
                        } }
                    />
                </Container>
                <Divider hidden />
                <SidePanelItems
                    type="mobile"
                    onSidePanelItemClick={ onSidePanelItemClick }
                    headerHeight={ headerHeight }
                />
                <Responsive maxWidth={ 767 } >
                    <AppFooter/>
                </Responsive>
            </Sidebar>
            <Sidebar.Pusher
                onClick={ onPusherClick }
                className="side-panel-pusher"
                data-testid={ `${testId}-pushable-side-bar` }
            >
                { children }
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};
