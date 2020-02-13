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
 * Proptypes for the selection card component.
 */
interface SelectionCardPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    description?: string;
    disabled?: boolean;
    header: string;
    id?: string;
    image?: any;
    imageSize?: GenericIconSizes;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    selected?: boolean;
    textAlign?: "center" | "left" | "right";
    inline?: boolean;
}

/**
 * Selection card component.
 *
 * @param {SelectionCardPropsInterface} props - Props injected to the components.
 * @return {JSX.Element}
 * @constructor
 */
export const SelectionCard: FunctionComponent<SelectionCardPropsInterface> = (
    props: SelectionCardPropsInterface
): JSX.Element => {

    const {
        className,
        description,
        disabled,
        header,
        id,
        inline,
        image,
        imageSize,
        onClick,
        selected,
        textAlign
    } = props;

    const classes = classNames(
        "selection-card",
        {
            ["with-image"]: image,
            disabled,
            inline,
            selected
        },
        className
    );

    return (
        <Card
            id={ id }
            className={ classes }
            onClick={ onClick }
            link={ false }
        >
            {
                image && (
                    <Card.Content className="card-image-container">
                        <GenericIcon
                            className="card-image"
                            size={ imageSize }
                            icon={ image }
                            square
                            transparent
                        />
                    </Card.Content>
                )
            }
            <Card.Content className="card-text-container" style={ { textAlign } }>
                <Card.Header>{ header }</Card.Header>
                { description && <Card.Description>{ description }</Card.Description> }
            </Card.Content>
        </Card>
    );
};

SelectionCard.defaultProps = {
    imageSize: "tiny",
    inline: false,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => null,
    textAlign: "center"
};
