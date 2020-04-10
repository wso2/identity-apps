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

import { Card, CardProps, Icon, Label, Popup } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";
import React, { FunctionComponent, ReactElement } from "react";
import classNames from "classnames";

/**
 * Proptypes for the info card component.
 */
export interface InfoCardPropsInterface extends CardProps {
    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Side of the image.
     */
    fluidImageSize?: GenericIconSizes;
    /**
     * Is card used to display a github repo info.
     */
    githubRepoCard?: boolean;
    /**
     * Id for the card.
     */
    id?: string;
    /**
     * Image for the card.
     */
    image?: any;
    /**
     * Side of the image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Github repo metadata.
     */
    githubRepoMetaInfo?: GithubHubRepoMetaInfoInterface;
    /**
     * If the card is selected.
     */
    selected?: boolean;
    /**
     * Card sub header.
     */
    subHeader?: string;
    /**
     * Set of tags.
     */
    tags?: string[];
    /**
     * Text alignment.
     */
    textAlign?: "center" | "left" | "right";
    /**
     * If the card should be inline.
     */
    inline?: boolean;
}

export interface GithubHubRepoMetaInfoInterface {
    language?: any;
    languageLogo?: any;
    forks: number;
    stars: number;
    watchers: number;
}

/**
 * Selection card component.
 *
 * @param {InfoCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const InfoCard: FunctionComponent<InfoCardPropsInterface> = (
    props: InfoCardPropsInterface
): ReactElement => {

    const {
        className,
        description,
        disabled,
        fluid,
        fluidImageSize,
        githubRepoCard,
        githubRepoMetaInfo,
        header,
        id,
        inline,
        image,
        imageSize,
        selected,
        subHeader,
        tags,
        textAlign,
        ...rest
    } = props;

    const classes = classNames(
        "info-card",
        {
            disabled,
            fluid,
            inline,
            selected,
            ["with-image"]: image
        },
        className
    );

    return (
        <Card
            id={ id }
            className={ classes }
            link={ false }
            as="div"
            { ...rest }
        >
            <Card.Content>
                {
                    image && (
                        <GenericIcon
                            className="card-image"
                            size={ fluid? fluidImageSize : imageSize }
                            icon={ image }
                            floated="left"
                            square
                            transparent
                        />
                    )
                }
                <div className="card-header-section">
                    { header && <Card.Header className="card-header ellipsis">{ header }</Card.Header> }
                    { subHeader && <Card.Header className="card-subheader ellipsis">{ subHeader }</Card.Header> }
                    {
                        description && fluid && (
                            <Card.Description className="card-description">{ description }</Card.Description>
                        )
                    }
                    {
                        githubRepoCard && githubRepoMetaInfo && fluid && (
                            <Card.Content className="github-meta">
                                {
                                    githubRepoMetaInfo.languageLogo && (
                                        <Popup
                                            trigger={
                                                <div className="language">
                                                    <GenericIcon
                                                        icon={ githubRepoMetaInfo.languageLogo }
                                                        size="micro"
                                                        transparent
                                                        inline
                                                        square
                                                        spaced="right"
                                                        floated="left"
                                                    />
                                                </div>
                                            }
                                            content={ githubRepoMetaInfo.language }
                                            inverted
                                        />
                                    )
                                }
                                <Label.Group size="mini">
                                    <Label>
                                        <Icon name="star" /> { githubRepoMetaInfo.stars }
                                    </Label>
                                    <Label>
                                        <Icon name="fork" /> { githubRepoMetaInfo.forks }
                                    </Label>
                                    <Label>
                                        <Icon name="eye" /> { githubRepoMetaInfo.watchers }
                                    </Label>
                                </Label.Group>
                            </Card.Content>
                        )
                    }
                </div>
            </Card.Content>
            { description && !fluid && (
                <Card.Content className="card-description-container">
                    <Card.Description className="card-description">
                        { description }
                    </Card.Description>
                </Card.Content>
            ) }
            {
                tags && tags instanceof Array && tags.length > 0
                    ? (
                        <Card.Content className="card-tags">
                            <Label.Group size="mini">
                                {
                                    tags.map((tag, index) => (
                                        <Label key={ index }>#{ tag }</Label>
                                    ))
                                }
                            </Label.Group>
                        </Card.Content>
                    )
                    : null
            }
            {
                githubRepoCard && githubRepoMetaInfo && !fluid && (
                    <Card.Content className="github-meta">
                        {
                            githubRepoMetaInfo.languageLogo && (
                                <Popup
                                    trigger={
                                        <div className="language">
                                            <GenericIcon
                                                icon={ githubRepoMetaInfo.languageLogo }
                                                size="micro"
                                                transparent
                                                inline
                                                square
                                                spaced="right"
                                                floated="left"
                                            />
                                        </div>
                                    }
                                    content={ githubRepoMetaInfo.language }
                                    inverted
                                />
                            )
                        }
                        <Label.Group size="mini">
                            <Label>
                                <Icon name="star" /> { githubRepoMetaInfo.stars }
                            </Label>
                            <Label>
                                <Icon name="fork" /> { githubRepoMetaInfo.forks }
                            </Label>
                            <Label>
                                <Icon name="eye" /> { githubRepoMetaInfo.watchers }
                            </Label>
                        </Label.Group>
                    </Card.Content>
                )
            }
        </Card>
    );
};

InfoCard.defaultProps = {
    fluidImageSize: "tiny",
    imageSize: "mini",
    inline: false,
    onClick: () => null,
    textAlign: "center"
};
