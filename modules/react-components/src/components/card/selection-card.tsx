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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { CSSProperties, FunctionComponent, ReactElement, useState } from "react";
import { Card, CardProps } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Tooltip } from "../typography";

/**
 * Proptypes for the selection card component.
 */
export interface SelectionCardPropsInterface extends Omit<CardProps, "image">, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Content top border.
     */
    contentTopBorder?: boolean;
    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image for the card.
     */
    image?: any;
    /**
     * Should the image be shown inline?.
     */
    imageInline?: boolean;
    /**
     * Icon options.
     */
    imageOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Side of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Should the description have two lines.
     */
    multilineDescription?: boolean;
    /**
     * Overlay for the card.
     */
    overlay?: any;
    /**
     * Opacity for the overlay.
     */
    overlayOpacity?: number;
    /**
     * Display disabled items as grayscale.
     */
    renderDisabledItemsAsGrayscale?: boolean;
    /**
     * If the card is selected.
     */
    selected?: boolean;
    /**
     *
     */
    selectionType?: "underlined" | "filled";
    /**
     * Should text be shown i.e Header & Description.
     */
    showText?: boolean;
    /**
     * Should tooltips be shown.
     */
    showTooltips?: boolean;
    /**
     * Card size.
     */
    size?: "x100" | "x120" | "small" | "default" | "auto";
    /**
     * Add spacing to the card.
     */
    spaced?: "bottom";
    /**
     * Text alignment.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * If the card should be inline.
     */
    inline?: boolean;
}

/**
 * Selection card component.
 *
 * @param {SelectionCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const SelectionCard: FunctionComponent<SelectionCardPropsInterface> = (
    props: SelectionCardPropsInterface
): ReactElement => {

    const {
        className,
        contentTopBorder,
        description,
        disabled,
        header,
        id,
        inline,
        image,
        imageInline,
        imageOptions,
        imageSize,
        multilineDescription,
        onClick,
        overlay,
        overlayOpacity,
        renderDisabledItemsAsGrayscale,
        selected,
        selectionType,
        showText,
        showTooltips,
        size,
        spaced,
        textAlign,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "selection-card",
        {
            disabled,
            "filled-selection": selectionType === "filled",
            grayscale: disabled && renderDisabledItemsAsGrayscale,
            "image-inline": imageInline,
            inline,
            "no-content-top-border": !contentTopBorder,
            selected,
            [ size ]: size,
            [ `spaced-${ spaced }` ]: spaced,
            "underlined-selection": selectionType === "underlined",
            [ "with-image" ]: image
        },
        className
    );

    const [ dimmerState, setDimmerState ] = useState<boolean>(false);

    /**
     * Inline styles for image container.
     */
    const imageContainerStyles = (): CSSProperties | undefined => {

        return {
            opacity: disabled ? overlayOpacity : 1
        };
    };

    return (
        <Card
            id={ id }
            className={ classes }
            onClick={ disabled ? (/*if disabled noop*/) => void 0 : onClick }
            disabled={ disabled }
            link={ false }
            as="div"
            data-componentid={ componentId }
            data-testid={ testId }
            onMouseEnter={ () => setDimmerState(true) }
            onMouseLeave={ () => setDimmerState(false) }
            { ...rest }
        >
            {
                disabled && dimmerState && overlay
            }
            {
                image && !imageInline && (
                    <Card.Content
                        className="card-image-container"
                        style={ imageContainerStyles() }
                    >
                        <GenericIcon
                            className="card-image"
                            size={ imageSize }
                            icon={ image }
                            data-componentid={ `${ componentId }-image` }
                            data-testid={ `${ testId }-image` }
                            square
                            transparent
                            { ...imageOptions }
                        />
                    </Card.Content>
                )
            }
            {
                showText && (
                    <Card.Content className="card-text-container" style={ { textAlign } }>
                        {
                            image && imageInline && (
                                <div className="card-image-container" style={ imageContainerStyles() }>
                                    <GenericIcon
                                        square
                                        transparent
                                        className="card-image"
                                        size={ imageSize }
                                        icon={ image }
                                        spaced="right"
                                        floated="left"
                                        data-componentid={ `${ componentId }-image` }
                                        data-testid={ `${ testId }-image` }
                                        { ...imageOptions }
                                    />
                                </div>
                            )
                        }
                        <div className="inner-card-text-container">
                            { header && (
                                <Tooltip
                                    disabled={ !showTooltips }
                                    content={ header }
                                    trigger={ (
                                        <Card.Header
                                            data-componentid={ `${ componentId }-header` }
                                            data-testid={ `${ testId }-header` }
                                        >
                                            { header }
                                        </Card.Header>
                                    ) }
                                />
                            ) }
                            { description && (
                                <Tooltip
                                    disabled={ !showTooltips }
                                    content={ description }
                                    trigger={ (
                                        <Card.Description
                                            className={ multilineDescription ? "multiline" : "" }
                                            data-componentid={ `${ componentId }-description` }
                                            data-testid={ `${ testId }-description` }
                                        >
                                            { description }
                                        </Card.Description>
                                    ) }
                                />
                            ) }
                        </div>
                    </Card.Content>
                )
            }
        </Card>
    );
};

/**
 * Default props for the selection card component.
 */
SelectionCard.defaultProps = {
    contentTopBorder: true,
    "data-componentid": "selection-card",
    "data-testid": "selection-card",
    imageSize: "tiny",
    inline: false,
    onClick: () => null,
    renderDisabledItemsAsGrayscale: true,
    selectionType: "underlined",
    showText: true,
    showTooltips: false,
    size: "default",
    textAlign: "center"
};
