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
import { Logo, ProductBrand, ThemeContext } from "@wso2is/react-components";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Container, Divider, Image, Responsive, Sidebar } from "semantic-ui-react";
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

    const { state } = useContext(ThemeContext);
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
                        appName={
                            (state.appName && state.appName !== "")
                                ? state.appName
                                : config.ui.appName
                        }
                        style={ { marginTop: 0 } }
                        logo={
                            (state.logo && state.logo !== "")
                                ? <Image src={ state.logo } style={ { maxHeight: 25 } }/>
                                : (
                                    <Logo
                                        className="portal-logo"
                                        image={
                                            resolveAppLogoFilePath(window[ "AppUtils" ].getConfig().ui.appLogoPath,
                                                `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                                `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                                state.theme)
                                        }
                                    />
                                )
                        }
                        productName={
                            (state.productName && state.productName !== "")
                                ? state.productName
                                : config.ui.productName
                        }
                        version={ config.ui.productVersionConfig?.versionOverride ?? config.deployment.productVersion }
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
