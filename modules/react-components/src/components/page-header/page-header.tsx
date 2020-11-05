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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { MouseEventHandler, ReactElement, ReactNode } from "react";
import { Divider, Grid, Header, Icon, Placeholder, SemanticWIDTHS } from "semantic-ui-react";
import { GenericIcon } from "../icon";

/**
 * Page header component Prop types.
 */
export interface PageHeaderPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Action component.
     */
    action?: ReactNode;
    /**
     * Column width for the action container grid.
     */
    actionColumnWidth?: SemanticWIDTHS;
    /**
     * Go back button.
     */
    backButton?: BackButtonInterface;
    /**
     * Show/ Hide bottom margin.
     */
    bottomMargin?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Description.
     */
    description?: ReactNode;
    /**
     * Column width for the heading container grid.
     */
    headingColumnWidth?: SemanticWIDTHS;
    /**
     * Optional image.
     */
    image?: any;
    /**
     * Show/ Hide bottom divider.
     */
    showBottomDivider?: boolean;
    /**
     * Header title.
     */
    title?: string | ReactElement;
    /**
     * Title render element.
     */
    titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /**
     * Title text alignment.
     */
    titleTextAlign?: "left" | "center" | "right" | "justified";
}

/**
 * Back button interface.
 */
export interface BackButtonInterface extends TestableComponentInterface {
    /**
     * Button label.
     */
    text: string;
    /**
     * Button Onclick.
     */
    onClick: MouseEventHandler;
}

/**
 * Page header component.
 *
 * @param {PageHeaderPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const PageHeader: React.FunctionComponent<PageHeaderPropsInterface> = (
    props: PageHeaderPropsInterface
): ReactElement => {

    const {
        action,
        actionColumnWidth,
        backButton,
        bottomMargin,
        className,
        description,
        headingColumnWidth,
        image,
        isLoading,
        showBottomDivider,
        title,
        titleAs,
        titleTextAlign,
        [ "data-testid" ]: testId
    } = props;

    const wrapperClasses = classNames(
        "page-header-wrapper",
        {
            [ "with-image" ]: image
        },
        className
    );

    const innerClasses = classNames(
        "page-header-inner",
        {
            [ "with-image" ]: image
        }
    );

    const backButtonClasses = classNames(
        "back-button",
        {
            [ "display-flex" ]: action,
            "fluid": isLoading
        }
    );
    
    const headingContent = (
        <div className={ innerClasses }>
            { image && (
                <GenericIcon
                    icon={
                        isLoading ?
                            (
                                <div className="fluid">
                                    <Placeholder style={ { height: 100, width: 100 } }>
                                        <Placeholder.Image square/>
                                    </Placeholder>
                                </div>
                            )
                            : image
                    }
                    size="tiny"
                    transparent
                    spaced="right"
                    data-testid={ `${ testId }-image` }
                />
            ) }

            {
                isLoading
                    ? (
                        <Header
                            className="page-header ellipsis"
                            as={ titleAs }
                            textAlign={ titleTextAlign }
                            data-testid={ `${ testId }-text-wrapper-loading` }
                        >
                            <div style={ { width: "250px" } }>
                                <Placeholder fluid>
                                    <Placeholder.Header>
                                        <Placeholder.Line/>
                                        { description && <Placeholder.Line/> }
                                    </Placeholder.Header>
                                </Placeholder>
                            </div>
                        </Header>
                    )
                    : (
                        <Header
                            className="page-header ellipsis"
                            as={ titleAs }
                            textAlign={ titleTextAlign }
                            data-testid={ `${ testId }-text-wrapper` }
                        >
                            <span data-testid={ `${ testId }-title` }>
                                { title && title }
                            </span>
                            { description && (
                                <Header.Subheader
                                    className="sub-header ellipsis"
                                    data-testid={ `${ testId }-sub-title` }
                                >
                                    { description }
                                </Header.Subheader>
                            ) }
                        </Header>
                    )
            }
        </div>
    );

    return (
        (title || description)
            ? (
                <div className={ wrapperClasses } data-testid={ testId }>
                    {
                        backButton && backButton.text && (
                            isLoading
                                ? (
                                    <div className={ backButtonClasses }>
                                        <Placeholder>
                                            <Placeholder.Line length="short"/>
                                        </Placeholder>
                                    </div>
                                )
                                : (
                                    <div
                                        data-testid={ backButton[ "data-testid" ] }
                                        className={ backButtonClasses }
                                        onClick={ backButton.onClick }
                                    >
                                        <Icon name="arrow left"/>
                                        { backButton.text }
                                    </div>
                                )
                        )
                    }
                    {
                        action
                            ? (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column computer={ headingColumnWidth }>
                                            { headingContent }
                                        </Grid.Column>
                                        <Grid.Column computer={ actionColumnWidth }>
                                            { action && <div className="floated right action">{ action }</div> }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            )
                            : headingContent
                    }
                    {
                        bottomMargin && <Divider hidden/>
                    }
                    {
                        showBottomDivider && <Divider/>
                    }
                </div>
            )
            : null
    );
};

/**
 * Default proptypes for the page header component.
 */
PageHeader.defaultProps = {
    actionColumnWidth: 6,
    bottomMargin: true,
    "data-testid": "page-header",
    headingColumnWidth: 10,
    showBottomDivider: false,
    titleAs: "h1"
};
