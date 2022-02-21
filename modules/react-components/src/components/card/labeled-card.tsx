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
import React, { FunctionComponent, ReactElement } from "react";
import { Card, CardProps, Label, LabelProps, Popup, SemanticSIZES } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";

/**
 * Proptypes for the labeled card component.
 */
export interface LabeledCardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Card Background color.
     */
    background?: "transparent" | "default";
    /**
     * Basic appearance with no borders etc.
     */
    basic?: boolean;
    /**
     * If a bottom margin should be added.
     */
    bottomMargin?: boolean;
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Is the card should be rendered as disabled.
     */
    disabled?: boolean;
    /**
     * The card will take the size of the container.
     */
    fluid?: boolean;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image to be displayed.
     */
    image: any;
    /**
     * Icon options.
     */
    imageOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Size of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Should the card be inline.
     */
    inline?: boolean;
    /**
     * Label of the card.
     */
    label: string;
    /**
     * Label ellipsis.
     */
    labelEllipsis?: boolean;
    /**
     * Should the label go in to 2 lines.
     */
    multilineLabel?: boolean;
    /**
     * On click callback for the element.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * On click callback for the close button.
     */
    onCloseClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void;
    /**
     * Padding.
     */
    padding?: "default" | "none";
    /**
     * Should raise on hover.
     */
    raiseOnHover?: boolean;
    /**
     * If the card should appear as selected.
     */
    selected?: boolean;
    /**
     * Set of sizes. Only tiny is currently supported.
     */
    size?: SemanticSIZES;
}

/**
 * Labeled card component.
 *
 * @param {LabeledCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const LabeledCard: FunctionComponent<LabeledCardPropsInterface> = (
    props: LabeledCardPropsInterface
): ReactElement => {

    const {
        background,
        basic,
        bottomMargin,
        className,
        disabled,
        fluid,
        id,
        inline,
        image,
        imageOptions,
        imageSize,
        label,
        labelEllipsis,
        multilineLabel,
        onClick,
        onCloseClick,
        padding,
        raiseOnHover,
        selected,
        size,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const wrapperClasses = classNames(
        "labeled-card-wrapper",
        {
            basic,
            fluid,
            [ "hover-raised-none" ]: !raiseOnHover,
            inline,
            [ `padding-${ padding }` ]: padding,
            [ size ]: size,
            [ "with-bottom-margin" ]: bottomMargin
        },
        className
    );

    const cardClasses = classNames(
        "labeled-card",
        {
            [ `background-${ background }` ]: background,
            disabled,
            selected,
            [ "with-image" ]: image
        }
    );

    const cardLabelClasses = classNames(
        "card-label",
        {
            "ellipsis": !multilineLabel && labelEllipsis,
            "multiline": multilineLabel
        }
    );

    return (
        <div
            className={ wrapperClasses }
            data-componentid={ `${ componentId }-wrapper` }
            data-testid={ `${ testId }-wrapper` }
        >
            <Card
                id={ id }
                as="div"
                className={ cardClasses }
                onClick={ onClick }
                link={ false }
                data-componentid={ componentId }
                data-testid={ testId }
            >
                { onCloseClick && (
                    <Label
                        className="close-button"
                        color="red"
                        size="mini"
                        onClick={ onCloseClick }
                        data-componentid={ `${ componentId }-close-button` }
                        data-testid={ `${ testId }-close-button` }
                        floating
                        circular
                    >
                        x
                    </Label>
                ) }
                <Card.Content className="card-image-container">
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
            </Card>
            <Popup
                disabled={ !labelEllipsis }
                trigger={ <div className={ cardLabelClasses }>{ label }</div> }
                position="bottom center"
                content={ label }
                data-componentid={ `${ componentId }-label` }
                data-testid={ `${ testId }-label` }
                inverted
            />
        </div>
    );
};

/**
 * Default props for the labeled card component.
 */
LabeledCard.defaultProps = {
    background: "default",
    basic: false,
    bottomMargin: true,
    "data-componentid": "labeled-card",
    "data-testid": "labeled-card",
    imageSize: "mini",
    inline: true,
    onClick: () => null,
    padding: "default",
    raiseOnHover: true
};
