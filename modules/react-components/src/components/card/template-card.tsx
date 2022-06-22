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
import React, { CSSProperties, FunctionComponent, MouseEvent, ReactElement, ReactNode, useState } from "react";
import { Card, CardProps, Icon, Label, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";

/**
 * Proptypes for the template card component.
 */
export interface TemplateCardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Template description
     */
    description: string;
    /**
     * Tag size.
     */
    tagSize?: GenericIconSizes;
    /**
     * Set of tags for the template.
     */
    tags?: TemplateCardTagInterface[] | string[];
    /**
     * Element to render the tag as.
     */
    tagsAs?: "icon" | "label" | "default";
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
     * Icon options.
     */
    imageOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Template card onclick event.
     * @param {React.MouseEvent<HTMLAnchorElement>} e - Event,
     * @param {CardProps} data - Card data.
     */
    onClick: (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * Display disabled items as grayscale.
     */
    renderDisabledItemsAsGrayscale?: boolean;
    /**
     * Opacity for the overlay.
     */
    overlayOpacity?: number;
    /**
     * Selected mode flag.
     */
    selected?: boolean;
    /**
     * Show/Hide tags section.
     */
    showTags?: boolean;
    /**
     * Show/Hide tag icon.
     */
    showTagIcon?: boolean;
    /**
     * Text align direction.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * Inline mode.
     */
    inline?: boolean;
    /**
     * Show an attached label as a ribbon.
     */
    ribbon?: ReactNode;
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
    displayName?: string;
    /**
     * Tag image.
     */
    logo?: any;
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
        imageOptions,
        imageSize,
        onClick,
        overlayOpacity,
        renderDisabledItemsAsGrayscale,
        ribbon,
        selected,
        showTags,
        showTagIcon,
        tagSize,
        tags,
        tagsAs,
        tagsSectionTitle,
        textAlign,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "template-card",
        {
            disabled,
            grayscale : disabled && renderDisabledItemsAsGrayscale,
            inline,
            selected,
            [ "with-image" ]: image
        },
        className
    );

    const [ , setDimmerState ] = useState<boolean>(false);

    /**
     * Renders the tag based on render type.
     *
     * @param {TemplateCardTagInterface | string} tag - Tag to be rendered.
     * @param {"icon" | "label" | "default"} as - Render type.
     * @param {number} index - Tag index in array.
     * @return {React.ReactElement}
     */
    const renderTag = (tag: TemplateCardTagInterface | string, as: "icon" | "label" | "default",
        index: number): ReactElement => {

        if (typeof tag === "string") {
            return (
                <span className="tag default" key={ index }>
                    { tag }
                    { (tags.length === 1 || index === tags.length - 1) ? "" : "," }
                </span>
            );
        }

        if (as === "icon") {
            return (
                <Popup
                    basic
                    key={ index }
                    trigger={ (
                        <div
                            className="icon-wrapper"
                            data-componentid={ `${ componentId }-logo-wrapper` }
                            data-testid={ `${ testId }-logo-wrapper` }
                        >
                            <GenericIcon
                                square
                                icon={ tag.logo }
                                size={ tagSize }
                                spaced="right"
                                fill={ false }
                                data-componentid={ `${ componentId }-logo` }
                                data-testid={ `${ testId }-logo` }
                                inline
                                transparent
                            />
                        </div>
                    ) }
                    size="mini"
                    position="top center"
                    content={ tag.displayName }
                    inverted
                />
            );
        }

        if (as === "label") {
            return (
                <Label
                    key={ index }
                    size="mini"
                    data-componentid={ `${ componentId }-logo-label` }
                    data-testid={ `${ testId }-logo-label` }
                >
                    { tag.displayName }
                </Label>
            );
        }

        return (
            <span className="tag default" key={ index }>
                { tag.displayName }
                { (tags.length === 1 || index === tags.length - 1) ? "" : ", " }
            </span>
        );
    };

    /**
     * Inline styles for image container.
     */
    const imageContainerStyles = (): CSSProperties | undefined => {

        return {
            opacity: disabled ? overlayOpacity : 1
        };
    };

    /**
     * Inline styles for text container.
     */
    const textContainerStyles = (): CSSProperties => {

        return {
            textAlign
        };
    };

    return (
        <Card
            id={ id }
            className={ classes }
            onClick={ onClick }
            link={ false }
            as="div"
            data-componentid={ componentId }
            data-testid={ testId }
            onMouseEnter={ () => setDimmerState(true) }
            onMouseLeave={ () => setDimmerState(false) }
        >
            {
                image && (
                    <Card.Content
                        style={ imageContainerStyles() }
                        className="card-image-container"
                    >
                        {
                            ribbon && (
                                <div className="ribbon">
                                    { ribbon }
                                </div>
                            )
                        }
                        <GenericIcon
                            square
                            transparent
                            className="card-image"
                            size={ imageSize }
                            icon={ image }
                            data-componentid={ `${ componentId }-image` }
                            data-testid={ `${ testId }-image` }
                            { ...imageOptions }
                        />
                    </Card.Content>
                )
            }
            <Card.Content className="card-text-container" style={ textContainerStyles() }>
                <Card.Header
                    data-componentid={ `${ componentId }-header` }
                    data-testid={ `${ testId }-header` }
                >
                    { name }
                </Card.Header>
                <Card.Description
                    data-componentid={ `${ componentId }-description` }
                    data-testid={ `${ testId }-description` }
                >
                    { description }
                </Card.Description>
                {
                    (showTags && tags && tags instanceof Array && tags.length > 0)
                        ? (
                            <div
                                className="tags-container"
                                data-componentid={ `${ componentId }-tags-container` }
                                data-testid={ `${ testId }-tags-container` }
                            >
                                { tagsSectionTitle && (
                                    <div
                                        className="title"
                                        data-componentid={ `${ componentId }-tags-title` }
                                        data-testid={ `${ testId }-tags-title` }
                                    >
                                        { tagsSectionTitle }
                                    </div>
                                ) }
                                <div
                                    className="tags"
                                    data-componentid={ `${ componentId }-tags` }
                                    data-testid={ `${ testId }-tags` }
                                >
                                    { showTagIcon && <Icon name="tag" className="tag-icon" size="tiny" color="grey" /> }
                                    {
                                        (tags as Array<TemplateCardTagInterface|string>)
                                            .map((tag, index) => renderTag(tag, tagsAs, index))
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
 * Default props for the template card.
 */
TemplateCard.defaultProps = {
    "data-componentid": "template-card",
    "data-testid": "template-card",
    imageSize: "tiny",
    inline: true,
    renderDisabledItemsAsGrayscale: true,
    tagSize: "x22",
    tagsAs: "label",
    textAlign: "center"
};
