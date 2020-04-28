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

import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Card, CardProps, Label, LabelProps, SemanticSIZES } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the labeled card component.
 */
interface LabeledCardPropsInterface {
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
     * On click callback for the element.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * On click callback for the close button.
     */
    onCloseClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void;
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
 * @return {JSX.Element}
 * @constructor
 */
export const LabeledCard: FunctionComponent<LabeledCardPropsInterface> = (
    props: LabeledCardPropsInterface
): JSX.Element => {

    const {
        bottomMargin,
        className,
        disabled,
        fluid,
        id,
        inline,
        image,
        imageSize,
        label,
        labelEllipsis,
        onClick,
        onCloseClick,
        selected,
        size
    } = props;

    const wrapperClasses = classNames(
        "labeled-card-wrapper",
        {
            fluid,
            inline,
            [ size ]: size,
            [ "with-bottom-margin" ]: bottomMargin
        },
        className
    );

    const cardClasses = classNames(
        "labeled-card",
        {
            disabled,
            selected,
            [ "with-image" ]: image
        }
    );

    return (
        <div className={ wrapperClasses }>
            <Card
                id={ id }
                as="div"
                className={ cardClasses }
                onClick={ onClick }
                link={ false }
            >
                { onCloseClick && (
                    <Label
                        className="close-button"
                        color="red"
                        size="mini"
                        onClick={ onCloseClick }
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
                        square
                        transparent
                    />
                </Card.Content>
            </Card>
            <div className={ "card-label" + labelEllipsis ? " ellipsis" : "" }>{ label }</div>
        </div>
    );
};

/**
 * Default props for the labeled card component.
 */
LabeledCard.defaultProps = {
    bottomMargin: true,
    imageSize: "mini",
    inline: true,
    onClick: () => null
};
