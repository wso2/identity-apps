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
import React, { FunctionComponent, MouseEvent, ReactElement, ReactNode } from "react";
import { Card, CardProps, Divider, Label, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";

/**
 * Proptypes for the template card component.
 */
export interface TemplateCardPropsInterface extends TestableComponentInterface {
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
     * Element to render the tag as.
     */
    tagsAs?: "icon" | "label";
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
    image?: GenericIconProps["icon"];
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
        tagsAs,
        tagsSectionTitle,
        textAlign,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "template-card",
        {
            disabled,
            inline,
            selected,
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
                        />
                    </Card.Content>
                )
            }
            <Card.Content className="card-text-container" style={ { textAlign } }>
                <Card.Header data-testid={ `${ testId }-header` }>{ name }</Card.Header>
                <Card.Description data-testid={ `${ testId }-description` }>{ description }</Card.Description>
                {
                    (tags && tags instanceof Array && tags.length > 0)
                        ? (
                            <div className="tags" data-testid={ `${ testId }-tags-container` }>
                                <div className="title" data-testid={ `${ testId }-tags-title` }>
                                    { tagsSectionTitle }
                                </div>
                                <div className="logos" data-testid={ `${ testId }-logos-container` }>
                                    {
                                        tags.map((tag, index) => (
                                            tagsAs === "icon"
                                                ? (
                                                    <Popup
                                                        basic
                                                        key={ index }
                                                        trigger={ (
                                                            <span
                                                                className="icon-wrapper"
                                                                data-testid={ `${ testId }-logo-wrapper` }
                                                            >
                                                                <GenericIcon
                                                                    icon={ tag.logo }
                                                                    size="micro"
                                                                    spaced="right"
                                                                    data-testid={ `${ testId }-logo` }
                                                                    inline
                                                                    transparent
                                                                />
                                                            </span>
                                                        ) }
                                                        size="mini"
                                                        position="top center"
                                                        content={ tag.displayName }
                                                        inverted
                                                    />
                                                )
                                                : (
                                                    <Label size="mini" data-testid={ `${ testId }-logo-label` }>
                                                        { tag.displayName }
                                                    </Label>
                                                )
                                        ))
                                    }
                                </div>
                            </div>
                        )
                        : <Divider hidden/>
                }
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the template card.
 */
TemplateCard.defaultProps = {
    "data-testid": "template-card",
    imageSize: "tiny",
    inline: true,
    tagsAs: "label",
    textAlign: "center"
};
