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

import { LoadableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { MouseEventHandler, ReactNode } from "react";
import { Divider, Header, Icon, Placeholder } from "semantic-ui-react";
import { GenericIcon } from "../icon";

/**
 * Page header component Prop types.
 */
export interface PageHeaderPropsInterface extends LoadableComponentInterface {
    backButton?: BackButtonInterface;
    bottomMargin?: boolean;
    className?: string;
    description?: ReactNode;
    image?: any;
    showBottomDivider?: boolean;
    title: string;
    titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    titleTextAlign?: "left" | "center" | "right" | "justified";
}

/**
 * Back button interface.
 */
interface BackButtonInterface {
    text: string;
    onClick: MouseEventHandler;
    testId?: string;
}

/**
 * Page header component.
 *
 * @param {PageHeaderPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const PageHeader: React.FunctionComponent<PageHeaderPropsInterface> = (
    props: PageHeaderPropsInterface
): JSX.Element => {

    const {
        backButton,
        bottomMargin,
        className,
        description,
        image,
        isLoading,
        showBottomDivider,
        title,
        titleAs,
        titleTextAlign
    } = props;

    const wrapperClasses = classNames(
        "page-header-wrapper",
        {
            ["with-image"]: image
        },
        className
    );

    const innerClasses = classNames(
        "page-header-inner",
        {
            ["with-image"]: image
        }
    );

    return (
        (title || description) && (
            <div className={ wrapperClasses }>
                {
                    backButton && backButton.text && (
                        isLoading
                            ? (
                                <div className="back-button fluid">
                                    <Placeholder>
                                        <Placeholder.Line length="short" />
                                    </Placeholder>
                                </div>
                            )
                            : (
                                <div
                                    data-testid={ backButton.testId }
                                    className="back-button"
                                    onClick={ backButton.onClick }
                                >
                                    <Icon name="arrow left"/>
                                    { backButton.text }
                                </div>
                            )
                    )
                }
                <div className={ innerClasses }>
                    { image && (
                        <GenericIcon
                            icon={
                                isLoading ?
                                    (
                                        <div className="fluid">
                                            <Placeholder style={ { height: 100, width: 100 } }>
                                                <Placeholder.Image square />
                                            </Placeholder>
                                        </div>
                                    )
                                    : image
                            }
                            size="tiny"
                            transparent
                            spaced="right"
                        />
                    ) }
                    <Header className="page-header ellipsis" as={ titleAs } textAlign={ titleTextAlign }>
                        {
                            isLoading
                                ? (
                                    <div style={ { width: "250px" } }>
                                        <Placeholder fluid>
                                            <Placeholder.Header>
                                                <Placeholder.Line />
                                                { description && <Placeholder.Line /> }
                                            </Placeholder.Header>
                                        </Placeholder>
                                    </div>
                                )
                                : (
                                    <Header
                                        className="page-header ellipsis"
                                        as={ titleAs }
                                        textAlign={ titleTextAlign }
                                    >
                                        { title && title }
                                        { description && (
                                            <Header.Subheader
                                                className="sub-header ellipsis"
                                            >
                                                { description }
                                            </Header.Subheader>
                                        ) }
                                    </Header>
                                )
                        }
                    </Header>
                </div>
                {
                    bottomMargin && <Divider hidden/>
                }
                {
                    showBottomDivider && <Divider />
                }
            </div>
        )
    );
};

PageHeader.defaultProps = {
    bottomMargin: true,
    showBottomDivider: false,
    titleAs: "h1"
};
