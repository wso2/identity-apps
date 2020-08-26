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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "semantic-ui-react";
import {
    Alert,
    AppFooter,
    EmptyPlaceholder,
    ErrorBoundary,
    GlobalLoader,
    Header,
    PageHeader,
    SidePanelWrapper
} from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";

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
 * Default header height to be used in state initialisations
 * @type {string}
 */
const DEFAULT_HEADER_HEIGHT = 59;

/**
 * Inner page layout.
 *
 * @param {InnerPageLayoutProps} props - Props injected to the inner page layout
 * @return {JSX.Element}
 */
export const InnerPageLayout: React.FunctionComponent<InnerPageLayoutProps> = (
    props: InnerPageLayoutProps
): JSX.Element => {
    const { children, pageTitle, pageDescription, pageTitleTextAlign } = props;

    const { t } = useTranslation();

    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState(false);
    const [ headerHeight, setHeaderHeight ] = useState(DEFAULT_HEADER_HEIGHT);

    useEffect(() => {
        if (headerHeight === document.getElementById("app-header").offsetHeight) {
            return;
        }
        setHeaderHeight(document.getElementById("app-header").offsetHeight);
    });

    const handleSidePanelToggleClick = (): void => {
        setMobileSidePanelVisibility(!mobileSidePanelVisibility);
    };

    const handleSidePanelPusherClick = (): void => {
        setMobileSidePanelVisibility(false);
    };

    const handleSidePanelItemClick = (): void => {
        setMobileSidePanelVisibility(false);
    };

    const handlePageRefresh = (): void => {
        window.location.reload();
    };

    return (
        <>
            <GlobalLoader height={ 3 }/>
            <Header
                onSidePanelToggleClick={ handleSidePanelToggleClick }
            />
            <div style={ { paddingTop: `${ headerHeight }px` } } className="layout-content">
                <SidePanelWrapper
                    headerHeight={ headerHeight }
                    mobileSidePanelVisibility={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                >
                    <ErrorBoundary
                        fallback={ (
                            <EmptyPlaceholder
                                action={ (
                                    <Button
                                        className="link-button"
                                        onClick={ handlePageRefresh }
                                    >
                                        { t("userPortal:placeholders.genericError.action") }
                                    </Button>
                                ) }
                                image={ EmptyPlaceholderIllustrations.genericError }
                                imageSize="tiny"
                                subtitle={ [
                                    t("userPortal:placeholders.genericError.subtitles.0"),
                                    t("userPortal:placeholders.genericError.subtitles.1")
                                ] }
                                title={ t("userPortal:placeholders.genericError.title") }
                            />
                        ) }
                    >
                        <PageHeader
                            title={ pageTitle }
                            description={ pageDescription }
                            titleTextAlign={ pageTitleTextAlign }
                        />
                        { children }
                    </ErrorBoundary>
                </SidePanelWrapper>
            </div>
            <Alert dismissInterval={ 5 } alertsPosition="br" />
            <AppFooter/>
        </>
    );
};
