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
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode } from "react";
import { Card, CardProps, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the template card component.
 */
export interface TemplateCardPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Template description
     */
    description: string;
    /**
     * Set of tags for the template.
     */
    tags?: TemplateCardTagInterface[];
    /**
     * Title for the tags section.
     */
    tagsSectionTitle?: ReactNode;
    /**
     * Disabled mode.
     */
    disabled?: boolean;
    /**
     * Template Name.
     */
    name: string;
    /**
     * Template ID.
     */
    id?: string;
    /**
     * Template image.
     */
    image?: any;
    /**
     * Size of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Template card onclick event.
     * @param {React.MouseEvent<HTMLAnchorElement>} e - Event,
     * @param {CardProps} data - Card data.
     */
    onClick: (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * Selected mode flag.
     */
    selected?: boolean;
    /**
     * Text align direction.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * Inline mode.
     */
    inline?: boolean;
}

/**
 * Template card tag interface.
 */
export interface TemplateCardTagInterface {
    /**
     * Tag name.
     */
    name: string;
    /**
     * Tag display name.
     */
    displayName: string;
    /**
     * Tag image.
     */
    logo: any;
}

/**
 * Template card component that can be used to represent application and IDP templates.
 *
 * @param {TemplateCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const TemplateCard: FunctionComponent<TemplateCardPropsInterface> = (
    props: TemplateCardPropsInterface
): ReactElement => {

    const {
        className,
        description,
        disabled,
        name,
        id,
        inline,
        image,
        imageSize,
        onClick,
        selected,
        tags,
        tagsSectionTitle,
        textAlign
    } = props;

    const classes = classNames(
        "template-card",
        {
            [ "with-image" ]: image,
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
            as="div"
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
                <Card.Header>{ name }</Card.Header>
                <Card.Description>{ description }</Card.Description>
                {
                    (tags && tags instanceof Array && tags.length > 0)
                        ? (
                            <div className="tags">
                                <div className="title">{ tagsSectionTitle }</div>
                                <div className="logos">
                                    {
                                        tags.map((tag, index) => (
                                            <Popup
                                                key={ index }
                                                trigger={ (
                                                    <span className="icon-wrapper">
                                                        <GenericIcon
                                                            icon={ tag.logo }
                                                            size="micro"
                                                            spaced="right"
                                                            inline
                                                            transparent
                                                        />
                                                    </span>
                                                ) }
                                                position="top center"
                                                content={ tag.displayName }
                                                inverted
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        )
                        : null
                }
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the application template card.
 */
TemplateCard.defaultProps = {
    imageSize: "auto",
    inline: true,
    textAlign: "center"
};
