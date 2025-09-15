/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    LoadingStateOptionsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, { MouseEventHandler, ReactElement, ReactNode } from "react";
import { Divider, Grid, Header, Icon, Placeholder, SemanticWIDTHS } from "semantic-ui-react";
import { GenericIcon, GenericIconProps } from "../icon";

/**
 * Page header component Prop types.
 */
export interface PageHeaderPropsInterface extends LoadableComponentInterface, TestableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Action component.
     */
    action?: ReactNode;
    /**
     * Column width for the action container grid.
     */
    actionColumnWidth?: SemanticWIDTHS;
    /**
     * Alert component displayed in the page header.
     */
    alertBanner?: ReactNode;
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
     * Flag to enable the legacy semantic-ui grid system for the page header.
     * @deprecated This prop is deprecated and will be removed in the next major release.
     * Use the new flex mode (default) instead.
     */
    legacyGrid?: boolean;
    /**
     * Flag to determine whether max width should be added to page header text content.
     */
    pageHeaderMaxWidth?: boolean;
    /**
     * Column width for the heading container grid.
     */
    headingColumnWidth?: SemanticWIDTHS;
    /**
     * Optional image.
     */
    image?: any;
    /**
     * Image spaced side.
     */
    imageSpaced?: boolean | GenericIconProps[ "spaced" ];
    /**
     * Show/ Hide bottom divider.
     */
    showBottomDivider?: boolean;
    /**
     * Header title.
     */
    title?: ReactNode;
    /**
     * Title render element.
     */
    titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    /**
     * Title text alignment.
     */
    titleTextAlign?: "left" | "center" | "right" | "justified";
    /**
     * Truncate content
     */
    truncateContent?: boolean;
    /**
     * Optional meta for the loading state.
     */
    loadingStateOptions?: LoadingStateOptionsInterface;
}

/**
 * Back button interface.
 */
export interface BackButtonInterface extends TestableComponentInterface, IdentifiableComponentInterface {
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
 * @param props - Props injected to the component.
 *
 * @returns the page header component
 */
export const PageHeader: React.FunctionComponent<PageHeaderPropsInterface> = (
    {
        action,
        actionColumnWidth = 6,
        alertBanner,
        backButton,
        bottomMargin = true,
        className,
        description,
        // TODO: Remove the default value once the existing components are updated.
        legacyGrid = true,
        headingColumnWidth = 10,
        image,
        isLoading,
        imageSpaced = "right",
        loadingStateOptions,
        showBottomDivider = false,
        title,
        titleAs = "h1",
        titleTextAlign,
        pageHeaderMaxWidth,
        truncateContent,
        [ "data-componentid" ]: componentId = "page-header",
        [ "data-testid" ]: testId = "page-header"
    }: PageHeaderPropsInterface
): ReactElement => {
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
            "fluid": isLoading
        }
    );

    const headerContentClasses = classNames(
        "page-header",
        {
            "ellipsis": truncateContent,
            "no-max-width": !pageHeaderMaxWidth
        }
    );

    const subHeaderContentClasses = classNames(
        "sub-header",
        {
            "ellipsis": truncateContent
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
                                    <Placeholder
                                        style={
                                            loadingStateOptions?.imageType === "circular"
                                                ? { borderRadius: "100%", height: 85, width: 85 }
                                                : { height: 85, width: 85 }
                                        }
                                    >
                                        <Placeholder.Image square />
                                    </Placeholder>
                                </div>
                            )
                            : image
                    }
                    size="tiny"
                    transparent
                    spaced={ (typeof imageSpaced === "boolean" && !imageSpaced) ? null : "right" }
                    data-componentid={ `${ componentId }-image` }
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
                            data-componentid={ `${ componentId }-text-wrapper-loading` }
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
                            className={ headerContentClasses }
                            as={ titleAs }
                            textAlign={ titleTextAlign }
                            data-componentid={ `${ componentId }-text-wrapper` }
                            data-testid={ `${ testId }-text-wrapper` }
                        >
                            <span
                                data-componentid={ `${ componentId }-title` }
                                data-testid={ `${ testId }-title` }
                            >
                                { title ? title : (
                                    <div style={ { width: "400px" } }>
                                        <Placeholder fluid>
                                            <Placeholder.Header>
                                                <Placeholder.Line/>
                                            </Placeholder.Header>
                                        </Placeholder>
                                    </div>
                                )
                                }
                            </span>
                            { description && (
                                <Header.Subheader
                                    className={ subHeaderContentClasses }
                                    data-componentid={ `${ componentId }-sub-title` }
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

    /**
     * Resolves the content rendering logic.
     * @returns Header content as a react component.
     */
    const renderContent = (): ReactElement => {
        if (!action) {
            return headingContent;
        }

        if (!legacyGrid) {
            return (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    flexDirection="row"
                    flexWrap="wrap"
                    alignItems="center"
                    sx={ {
                        gap: "var(--oxygen-spacing-2)"
                    } }
                >
                    <Box className="heading-wrapper">{ headingContent }</Box>
                    <Box className="action-wrapper">{ action }</Box>
                </Box>
            );
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ headingColumnWidth } className="heading-wrapper">
                        { headingContent }
                    </Grid.Column>
                    <Grid.Column computer={ actionColumnWidth } className="action-wrapper">
                        { action && <div className="floated right action">{ action }</div> }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    return (
        (title || description)
            ? (
                <div
                    className={ wrapperClasses }
                    data-componentid={ componentId }
                    data-testid={ testId }
                >
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
                                        data-componentid={ backButton[ "data-componentid" ] }
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
                    { alertBanner }
                    { renderContent() }
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
