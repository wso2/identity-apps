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

import * as React from "react";
import { Header as AppHeader, PageHeader, SidePanelWrapper } from "../components";

/**
 * Inner page layout component Prop types.
 */
interface InnerPageLayoutProps {
    children?: React.ReactNode;
    pageTitle: string;
    pageDescription?: string;
    pageTitleTextAlign?: "left" | "center" | "right" | "justified";
}

/**
 * Inner page layout component state types.
 */
interface InnerPageLayoutState {
    mobileSidePanelVisibility: boolean;
}

/**
 * Inner page layout.
 *
 * @param {Props} props
 * @return {any}
 */
export class InnerPageLayout extends React.Component<InnerPageLayoutProps, InnerPageLayoutState> {
    public state = {
        mobileSidePanelVisibility: false
    };

    public handleSidePanelToggleClick = () => {
        const { mobileSidePanelVisibility } = this.state;
        this.setState({ mobileSidePanelVisibility: !mobileSidePanelVisibility });
    }

    public handleSidePanelPusherClick = () => {
        const { mobileSidePanelVisibility } = this.state;

        if (mobileSidePanelVisibility) {
            this.setState({ mobileSidePanelVisibility: false });
        }
    }

    public handleSidePanelItemClick = () => {
        this.setState({ mobileSidePanelVisibility: false });
    }

    public render() {
        const { mobileSidePanelVisibility } = this.state;
        const { children, pageTitle, pageDescription, pageTitleTextAlign } = this.props;
        return (
            <>
                <AppHeader onSidePanelToggleClick={ this.handleSidePanelToggleClick }/>
                <div className="content-wrapper">
                    <SidePanelWrapper
                        mobileSidePanelVisibility={ mobileSidePanelVisibility }
                        onSidePanelItemClick={ this.handleSidePanelItemClick }
                        onSidePanelPusherClick={ this.handleSidePanelPusherClick }
                    >
                        <PageHeader
                            title={ pageTitle }
                            description={ pageDescription }
                            titleTextAlign={ pageTitleTextAlign }
                        />
                        { children }
                    </SidePanelWrapper>
                </div>
            </>
        );
    }
}
