/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import kebabCase from "lodash-es/kebabCase";
import React, { CSSProperties, FunctionComponent, ReactElement, useState } from "react";
import { Card, CardProps, Dimmer } from "semantic-ui-react";
import { GenericIcon } from "../icon";

/**
 * Proptypes for the selection card component.
 */
export interface TechnologyCardPropsInterface extends Omit<CardProps, "image">, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Is card disabled.
     */
    disabled?: boolean;
    /**
     * Display name of the card.
     */
    displayName?: string;
    /**
     * Image for the card.
     */
    image?: any;
    /**
     * Key of the card.
     */
    key?: number;
    /**
     * Called on click.
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;
    /**
     * Overlay for the card.
     */
    overlay?: any;
    /**
     * Opacity for the overlay.
     */
    overlayOpacity?: number;
    /**
     * Should the card be formatted to raise above the page.
     */
    raised?: boolean;
    /**
     * Resolve i18n tag for feature available content
     */
    featureAvailable?: string;
}

/**
 * Technology card component.
 *
 * @param props - Props injected to the components.
 *
 * @returns the TechnologyCard component
 */
export const TechnologyCard: FunctionComponent<TechnologyCardPropsInterface> = (
    props: TechnologyCardPropsInterface
): ReactElement => {

    const {
        className,
        disabled,
        displayName,
        image,
        key,
        onClick,
        overlayOpacity,
        raised,
        featureAvailable,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "tech-selection basic-card rounded mb-1",
        {
            "disabled no-hover": disabled
        },
        className
    );

    const [ dimmerState, setDimmerState ] = useState<boolean>(false);

    /**
     * Inline styles for image container.
     */
    const imageContainerStyles = (): CSSProperties | undefined => {

        return {
            display: "flex",
            height: "100%",
            justifyContent: "center",
            opacity: disabled ? overlayOpacity : 1
        };
    };

    return (
        <div className="tech-selection-wrapper">
            <Card
                as={ "div" }
                link={ false }
                key={ key }
                raised={ raised }
                data-componentid={ componentId ?? `technology-card-${ kebabCase(displayName) }` }
                data-testid={ testId ?? `technology-card-${ kebabCase(displayName) }` }
                className={ classes }
                onClick={ !disabled && onClick }
                onMouseEnter={ () => setDimmerState(true) }
                onMouseLeave={ () => setDimmerState(false) }
            >
                {
                    disabled && (
                        <Dimmer className="lighter" active={ dimmerState }>
                            { featureAvailable
                                ? featureAvailable
                                : "This feature will be available soon!" }
                        </Dimmer>
                    )
                }
                <Card.Content
                    textAlign="center"
                    style={ imageContainerStyles() }
                >
                    <GenericIcon
                        transparent
                        size="x50"
                        icon={ image }
                    />
                </Card.Content>
            </Card>
            <div
                data-componentid={ `technology-card-alias-${ kebabCase(displayName) }` }
                className={
                    classNames("name", {
                        "tech-name-hidden": !dimmerState,
                        "tech-name-visible": dimmerState
                    })
                }>
                { displayName }
            </div>
        </div>

    );
};

/**
 * Default props for the technology card component.
 */
TechnologyCard.defaultProps = {
    "data-componentid": "technology-card",
    "data-testid": "technology-card"
};
