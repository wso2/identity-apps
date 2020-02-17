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
import { Card, CardProps } from "semantic-ui-react";
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
     * Label of the card.
     */
    label: string;
    /**
     * On click callback for the element.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * If the card should appear as selected.
     */
    selected?: boolean;
    /**
     * Should the card be inline.
     */
    inline?: boolean;
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
        id,
        inline,
        image,
        imageSize,
        label,
        onClick,
        selected
    } = props;

    const wrapperClasses = classNames(
        "labeled-card-wrapper",
        {
            [ "with-bottom-margin" ]: bottomMargin,
            inline
        },
        className
    );

    const cardClasses = classNames(
        "labeled-card",
        {
            ["with-image"]: image,
            disabled,
            selected
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
            <div className="card-label">{ label }</div>
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
    onClick: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => null
};
