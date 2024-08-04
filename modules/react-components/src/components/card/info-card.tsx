/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Button, Card, CardProps, Icon, Item, Label } from "semantic-ui-react";
import { LinkButton } from "../button";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Popup } from "../popup";
import { Tooltip } from "../typography";

/**
 * Proptypes for the info card component.
 */
export interface InfoCardPropsInterface extends CardProps, IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Action for the card
     */
    action?: ReactNode;
    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Hint for the disabled card.
     */
    disabledHint?: ReactNode;
    /**
     * Status of the feature.
     */
    featureStatus?: ReactElement;
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
     * Extra options for the card image.
     */
    imageOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Github repo metadata.
     */
    githubRepoMetaInfo?: GithubHubRepoMetaInfoInterface;
    /**
     * Disable hovering effect.
     */
    noHover?: boolean;
    /**
     * If the card is selected.
     */
    selected?: boolean;
    /**
     * Card sub header.
     */
    subHeader?: string;
    /**
     * Show an attached label as a ribbon.
     */
    ribbon?: ReactNode;
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
    /**
     * Show/Hide tooltips.
     */
    showTooltips?: boolean | { header:boolean; description:boolean; };
    /**
     * Show/Hide card action.
     */
    showCardAction?: boolean;
    /**
     * Show/Hide setup guide button.
     */
    showSetupGuideButton?: boolean;
}

/**
 * Interface for Github repo meta info.
 */
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
 * @param props - Props injected to the components.
 * @returns Selection card component.
 */
export const InfoCard: FunctionComponent<PropsWithChildren<InfoCardPropsInterface>> = (
    props: PropsWithChildren<InfoCardPropsInterface>
): ReactElement => {

    const {
        action,
        children,
        className,
        description,
        disabled,
        disabledHint,
        featureStatus,
        fluid,
        githubRepoCard,
        githubRepoMetaInfo,
        header,
        id,
        inline,
        image,
        imageOptions,
        imageSize,
        noHover,
        onClick,
        selected,
        subHeader,
        ribbon,
        tags,
        navigationLink,
        showTooltips,
        showCardAction,
        showSetupGuideButton,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const handleClick = () => {
        window.open(navigationLink, "_blank", "noopener,noreferrer");
    };

    const classes = classNames(
        "info-card",
        {
            disabled,
            fluid,
            inline,
            [ "no-hover" ]: noHover || action || disabled,
            selected,
            ["with-image"]: image
        },
        className
    );

    return (
        <Tooltip
            compact
            size="small"
            position="top right"
            disabled={ !disabled || !disabledHint }
            content={ disabledHint }
            trigger={ (
                <Card
                    id={ id }
                    className={ classNames(classes) }
                    link={ false }
                    as="div"
                    data-componentid={ componentId }
                    data-testid={ testId }
                    onClick={ (!showCardAction && onClick) && onClick }
                    { ...rest }
                >
                    <div className="header-without-toggle">
                        <Card.Content>
                            {
                                ribbon && (
                                    <div className="ribbon">
                                        { ribbon }
                                    </div>
                                )
                            }
                            {
                                <Box className="justify-label">
                                    <Item>
                                        { image && (
                                            <GenericIcon
                                                square
                                                transparent
                                                data-componentid={ `${ componentId }-image` }
                                                data-testid={ `${ testId }-image` }
                                                className="card-image"
                                                size={
                                                    fluid && !imageSize
                                                        ? "tiny"
                                                        : imageSize
                                                }
                                                icon={ image }
                                                floated="left"
                                                { ...imageOptions }
                                            />
                                        ) }
                                    </Item>
                                    { featureStatus && (
                                        <Item>
                                            { featureStatus }
                                        </Item>
                                    ) }
                                </Box>
                            }

                            <div className="card-header-section">
                                { header && (
                                    <Tooltip
                                        compact
                                        size="mini"
                                        trigger={ (
                                            <Card.Header
                                                className="card-header ellipsis"
                                                data-componentid={ `${ componentId }-header` }
                                                data-testid={ `${ testId }-header` }
                                            >
                                                { header as ReactNode }
                                            </Card.Header>
                                        ) }
                                        content={ header }
                                        disabled={ typeof showTooltips === "boolean"
                                            ? !showTooltips :
                                            !showTooltips.header || typeof header !== "string" }
                                    />
                                ) }

                                {
                                    description !== undefined && fluid && (
                                        <Tooltip
                                            compact
                                            size="mini"
                                            trigger={ (
                                                <Card.Description
                                                    className="card-description"
                                                    data-componentid={ `${ componentId }-description` }
                                                    data-testid={ `${ testId }-description` }
                                                >
                                                    { description as ReactNode }
                                                </Card.Description>
                                            ) }
                                            content={ description }
                                            disabled={ typeof showTooltips === "boolean"
                                                ? !showTooltips
                                                : !showTooltips.description || typeof description !== "string" }
                                        />
                                    )
                                }
                                {
                                    githubRepoCard && githubRepoMetaInfo && fluid && (
                                        <Card.Content
                                            className="github-meta"
                                            data-componentid={ `${ componentId }-github-repo-meta` }
                                            data-testid={ `${ testId }-github-repo-meta` }
                                        >
                                            {
                                                githubRepoMetaInfo.languageLogo && (
                                                    <Popup
                                                        trigger={ (
                                                            <div className="language">
                                                                <GenericIcon
                                                                    icon={ githubRepoMetaInfo.languageLogo }
                                                                    data-componentid={
                                                                        `${ componentId }-github-repo-language-logo`
                                                                    }
                                                                    data-testid={
                                                                        `${ testId }-github-repo-language-logo`
                                                                    }
                                                                    size="micro"
                                                                    transparent
                                                                    inline
                                                                    square
                                                                    spaced="right"
                                                                    floated="left"
                                                                />
                                                            </div>
                                                        ) }
                                                        content={ githubRepoMetaInfo.language }
                                                        inverted
                                                    />
                                                )
                                            }
                                            <Label.Group
                                                size="mini"
                                                data-componentid={ `${ componentId }-github-repo-stats` }
                                                data-testid={ `${ testId }-github-repo-stats` }
                                            >
                                                <Label
                                                    data-componentid={ `${ componentId }-github-repo-stars` }
                                                    data-testid={ `${ testId }-github-repo-stars` }
                                                >
                                                    <Icon name="star" /> { githubRepoMetaInfo.stars }
                                                </Label>
                                                <Label
                                                    data-componentid={ `${ componentId }-github-repo-forks` }
                                                    data-testid={ `${ testId }-github-repo-forks` }
                                                >
                                                    <Icon name="fork" /> { githubRepoMetaInfo.forks }
                                                </Label>
                                                <Label
                                                    data-componentid={ `${ componentId }-github-repo-watchers` }
                                                    data-testid={ `${ testId }-github-repo-watchers` }
                                                >
                                                    <Icon name="eye" /> { githubRepoMetaInfo.watchers }
                                                </Label>
                                            </Label.Group>
                                        </Card.Content>
                                    )
                                }
                            </div>
                        </Card.Content>
                    </div>
                    { subHeader && (
                        <Card.Header
                            className="card-subheader ellipsis"
                            data-componentid={ `${ componentId }-sub-header` }
                            data-testid={ `${ testId }-sub-header` }
                        >
                            { subHeader }
                        </Card.Header>
                    ) }
                    { description !== undefined && !fluid && (
                        <Card.Content className="card-description-container">
                            <Tooltip
                                compact
                                size="mini"
                                trigger={ (
                                    <Card.Description
                                        className="card-description"
                                        data-componentid={ `${ componentId }-description` }
                                        data-testid={ `${ testId }-description` }
                                    >
                                        { description as ReactNode }
                                    </Card.Description>
                                ) }
                                content={ description }
                                disabled={ typeof showTooltips === "boolean"
                                    ? !showTooltips
                                    : !showTooltips.description || typeof description !== "string" }
                            />
                        </Card.Content>
                    ) }
                    {
                        (tags && tags instanceof Array)
                            ? (
                                <Card.Content
                                    className="card-tags"
                                    data-componentid={ `${ componentId }-tags` }
                                    data-testid={ `${ testId }-tags` }
                                >
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
                    { (showCardAction || showSetupGuideButton) && <div className="ui hidden divider"/> }
                    <div className="instances-container">
                        <div className="conditions-container">
                            <div className="instances-conditionOne">

                                { (
                                    (action !== undefined) && (
                                        <Card.Content
                                            className="action-container"
                                            data-componentid={ `${ componentId }-action-container` }
                                            data-testid={ `${ testId }-action-container` }
                                        >
                                            {
                                                typeof action === "string"
                                                    ? (
                                                        <LinkButton
                                                            disabled={ disabled }
                                                            hoverType="underline"
                                                            className="info-card-inner-action"
                                                            onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                                                                onClick(e as unknown as MouseEvent<HTMLAnchorElement>,
                                                                    null);
                                                            } }
                                                        >
                                                            { action }
                                                        </LinkButton>
                                                    )
                                                    : action
                                            }
                                        </Card.Content>
                                    )
                                )
                                }
                            </div>
                        </div>
                        {
                            showCardAction && (
                                <>
                                    <div className="ui instance divider"/>
                                    <div className="instances-buttons">
                                        { showCardAction ? (
                                            <LinkButton
                                                className="idp-create-button"
                                                disabled={ disabled }
                                                onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                                                    onClick(e as unknown as MouseEvent<HTMLAnchorElement>,
                                                        null);
                                                } }
                                                data-componentid={
                                                    `${ componentId }-${ header.toString().replace(/\s/g, "-") }`
                                                }
                                            >
                                        Create
                                                <i className="arrow right icon"></i>
                                            </LinkButton>
                                        ) : null }
                                        { showSetupGuideButton && (<Button
                                            className="setup-guide-button"
                                            onClick={ handleClick }
                                            disabled={ disabled }
                                            data-componentid={ `${ componentId }-${ header }-setup-guide` }
                                        >
                                            <i className="book icon"></i>
                                        Setup Guide
                                        </Button>) }
                                    </div>
                                </>
                            )
                        }
                    </div>
                    {
                        githubRepoCard && githubRepoMetaInfo && !fluid && (
                            <Card.Content
                                className="github-meta"
                                data-componentid={ `${ componentId }-github-repo-meta` }
                                data-testid={ `${ testId }-github-repo-meta` }
                            >
                                {
                                    githubRepoMetaInfo.languageLogo && (
                                        <Popup
                                            trigger={ (
                                                <div className="language">
                                                    <GenericIcon
                                                        icon={ githubRepoMetaInfo.languageLogo }
                                                        data-componentid={
                                                            `${ componentId }-github-repo-language-logo`
                                                        }
                                                        data-testid={ `${ testId }-github-repo-language-logo` }
                                                        size="micro"
                                                        transparent
                                                        inline
                                                        square
                                                        spaced="right"
                                                        floated="left"
                                                    />
                                                </div>
                                            ) }
                                            content={ githubRepoMetaInfo.language }
                                            inverted
                                        />
                                    )
                                }
                                <Label.Group
                                    size="mini"
                                    data-componentid={ `${ componentId }-github-repo-stats` }
                                    data-testid={ `${ testId }-github-repo-stats` }
                                >
                                    <Label
                                        data-componentid={ `${ componentId }-github-repo-stars` }
                                        data-testid={ `${ testId }-github-repo-stars` }
                                    >
                                        <Icon name="star" /> { githubRepoMetaInfo.stars }
                                    </Label>
                                    <Label
                                        data-componentid={ `${ componentId }-github-repo-forks` }
                                        data-testid={ `${ testId }-github-repo-forks` }
                                    >
                                        <Icon name="fork" /> { githubRepoMetaInfo.forks }
                                    </Label>
                                    <Label
                                        data-componentid={ `${ componentId }-github-repo-watchers` }
                                        data-testid={ `${ testId }-github-repo-watchers` }
                                    >
                                        <Icon name="eye" /> { githubRepoMetaInfo.watchers }
                                    </Label>
                                </Label.Group>
                            </Card.Content>
                        )
                    }
                    { children }
                </Card>
            ) }
        />
    );
};

/**
 * Prop types for the info card component.
 */
InfoCard.defaultProps = {
    "data-componentid": "info-card",
    "data-testid": "info-card",
    imageSize: "mini",
    inline: false,
    onClick: () => null,
    showCardAction: true,
    showSetupGuideButton: true,
    showTooltips: false,
    textAlign: "center"
};
