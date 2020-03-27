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
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { Card, CardProps, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "@wso2is/react-components";
// Importing the following from the `configs` index causes a circular dependency due to `GlobalConfig` being exported
// from the index as well. TODO: Revert the import after this issue is fixed.
import { ApplicationTemplateIllustrations, TechnologyLogos } from "../../../configs/ui";

/**
 * Proptypes for the application template card component.
 */
interface ApplicationTemplateCardPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    description: string;
    technologyTypes: string[];
    disabled?: boolean;
    name: string;
    id?: string;
    image?: string;
    imageSize?: GenericIconSizes;
    onClick: (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    selected?: boolean;
    textAlign?: "center" | "left" | "right";
    inline?: boolean;
}

/**
 * Application template card component.
 *
 * @param {ApplicationTemplateCardPropsInterface} props - Props injected to the components.
 * @return {JSX.Element}
 * @constructor
 */
export const ApplicationTemplateCard: FunctionComponent<ApplicationTemplateCardPropsInterface> = (
    props: ApplicationTemplateCardPropsInterface
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
        technologyTypes,
        textAlign
    } = props;

    const classes = classNames(
        "app-template-card",
        {
            ["with-image"]: image,
            disabled,
            inline,
            selected
        },
        className
    );

    /**
     *  Find the image in the illustration Object.
     *
     *  @param imageName - Check for the following name.
     *  @param illustrationObject - Image object to check.
     */
    const findIcon = ((imageName: string, illustrationObject) => {
        const key: string = Object.keys(illustrationObject).find((key) => key === imageName);
        if (key) {
            return illustrationObject[key];
        } else {
            return null
        }
    });

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
                            icon={
                                findIcon(image, ApplicationTemplateIllustrations) ?
                                    findIcon(image, ApplicationTemplateIllustrations) : image
                            }
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
                    technologyTypes && (
                        <div className="technologies">
                            <div className="title">Technologies</div>
                            <div className="logos">
                                {
                                    technologyTypes.map((technology, index) => (
                                        <Popup
                                            key={ index }
                                            trigger={ (
                                                <span className="icon-wrapper">
                                                    { findIcon(technology, TechnologyLogos) ?
                                                        <GenericIcon
                                                            icon={ findIcon(technology, TechnologyLogos) }
                                                            size="micro"
                                                            spaced="right"
                                                            inline
                                                            transparent
                                                        /> : technology
                                                    }
                                                </span>
                                            ) }
                                            position="top center"
                                            content={ technology }
                                            inverted
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the application template card.
 */
ApplicationTemplateCard.defaultProps = {
    imageSize: "auto",
    inline: true,
    textAlign: "center"
};
