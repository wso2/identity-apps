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
import React, { FunctionComponent, MouseEvent } from "react";
import { Card, CardProps, Icon, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the application template card component.
 */
interface ApplicationTemplateCardPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    description: string;
    technologies?: TechnologyInterface[];
    disabled?: boolean;
    name: string;
    id?: string;
    image?: any;
    imageSize?: GenericIconSizes;
    onClick: (e: MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    selected?: boolean;
    textAlign?: "center" | "left" | "right";
    inline?: boolean;
}

interface TechnologyInterface {
    name: string;
    displayName: string;
    logo: any;
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
): JSX.Element => {

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
        technologies,
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
                    technologies && (
                        <div className="technologies">
                            <div className="title">Technologies</div>
                            <div className="logos">
                                {
                                    technologies.map((technology, index) => (
                                        <Popup
                                            key={ index }
                                            trigger={ (
                                                    <span className="icon-wrapper">
                                                        <GenericIcon
                                                            icon={ technology.logo }
                                                            size="micro"
                                                            spaced="right"
                                                            inline
                                                            transparent
                                                        />
                                                    </span>
                                                ) }
                                            position="top center"
                                            content={ technology.displayName }
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
