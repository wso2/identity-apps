/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { Header } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the placeholder component.
 */
export interface PlaceholderProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Action of the placeholder.
     */
    action?: React.ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Image for the placeholder.
     */
    image?: any;
    /**
     * Size of the placeholder image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Placeholder subtitle.
     */
    subtitle: ReactNode | ReactNode[];
    /**
     * Placeholder title.
     */
    title?: string;
}

/**
 * Placeholder component.
 *
 * @param props - Props injected in to the placeholder component.
 *
 * @returns the placeholder React component
 */
export const EmptyPlaceholder: FunctionComponent<PlaceholderProps> = (props: PlaceholderProps): ReactElement => {

    const {
        action,
        className,
        image,
        imageSize,
        subtitle,
        title,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "empty-placeholder",
        className
    );

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            {
                image
                    ? (
                        <div className="image-container">
                            <GenericIcon
                                fill="default"
                                icon={ image }
                                size={ imageSize }
                                data-componentid={ `${ componentId }-icon` }
                                data-testid={ `${ testId }-icon` }
                                transparent
                            />
                        </div>
                    )
                    : null
            }
            { title && (
                <Header
                    as="h4"
                    className="title"
                    data-componentid={ `${ componentId }-header` }
                    data-testid={ `${ testId }-header` }
                >
                    { title }
                </Header>
            ) }
            {
                subtitle
                    ? Array.isArray(subtitle) && (subtitle.length > 0) && subtitle.map((line, index) => (
                        <div
                            key={ index }
                            className="subtitle"
                            data-componentid={ `${ componentId }-sub-header-line-${ index }` }
                            data-testid={ `${ testId }-sub-header-line-${ index }` }
                        >
                            { line }
                        </div>
                    ))
                    : (
                        <div
                            className="subtitle"
                            data-componentid={ `${ componentId }-sub-header` }
                            data-testid={ `${ testId }-sub-header` }
                        >
                            { subtitle }
                        </div>
                    )
            }
            {
                action
                    ? (
                        <div
                            className="action-container"
                            data-componentid={ `${ componentId }-action-container` }
                            data-testid={ `${ testId }-action-container` }
                        >
                            { action }
                        </div>
                    )
                    : null
            }
        </div>
    );
};

/**
 * Default proptypes for the empty placeholder component.
 */
EmptyPlaceholder.defaultProps = {
    action: null,
    "data-componentid": "empty-placeholder",
    "data-testid": "empty-placeholder",
    image: null,
    imageSize: "auto"
};
