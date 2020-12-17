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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Card, CardProps } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Tooltip } from "../typography";

/**
 * Proptypes for the selection card component.
 */
export interface SelectionCardPropsInterface extends Omit<CardProps, "image">, TestableComponentInterface {
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
        imageOptions,
        imageSize,
        multilineDescription,
        onClick,
        selected,
        selectionType,
        showText,
        showTooltips,
        size,
        spaced,
        textAlign,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "selection-card",
        {
            disabled,
            "filled-selection": selectionType === "filled",
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

    return (
        <Card
            id={ id }
            className={ classes }
            onClick={ onClick }
            link={ false }
            as="div"
            data-testid={ testId }
            { ...rest }
        >
            {
                image && (
                    <Card.Content className="card-image-container">
                        <GenericIcon
                            className="card-image"
                            size={ imageSize }
                            icon={ image }
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
                        { header && (
                            <Tooltip
                                disabled={ !showTooltips }
                                content={ header }
                                trigger={ (
                                    <Card.Header data-testid={ `${ testId }-header` }>
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
                                        data-testid={ `${ testId }-description` }
                                    >
                                        { description }
                                    </Card.Description>
                                ) }
                            />
                        ) }
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
    "data-testid": "selection-card",
    imageSize: "tiny",
    inline: false,
    onClick: () => null,
    selectionType: "underlined",
    showText: true,
    showTooltips: false,
    size: "default",
    textAlign: "center"
};
