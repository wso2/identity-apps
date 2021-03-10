/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardProps, Dimmer } from "semantic-ui-react";
import { GenericIcon } from "../icon";
import kebabCase from "lodash/kebabCase";

/**
 * Proptypes for the selection card component.
 */
export interface TechnologyCardPropsInterface extends Omit<CardProps, "image">, TestableComponentInterface {
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
}

/**
 * Technology card component.
 *
 * @param {TechnologyCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const TechnologyCard: FunctionComponent<TechnologyCardPropsInterface> = (
    props: TechnologyCardPropsInterface
): ReactElement => {

    const {
        className,
        description,
        disabled,
        displayName,
        image,
        key,
        onClick,
        overlayOpacity,
        raised,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const classes = classNames(
        "tech-selection basic-card",
        {
            "disabled no-hover": disabled
        },
        className
    );

    const [ dimmerState, setDimmerState ] = useState<boolean>(false);

    /**
     * Inline styles for image container.
     */
    const imageContainerStyles = (): object => {

        return {
            opacity: disabled ? overlayOpacity : 1
        };
    };

    return (
        <Card
            as={ "div" }
            link={ false }
            key={ key }
            raised={ raised }
            data-testid={
                testId ?? `technology-card-${ kebabCase(displayName) }`
            }
            className={ classes }
            onClick={ !disabled && onClick }
            onMouseEnter={ () => setDimmerState(true) }
            onMouseLeave={ () => setDimmerState(false) }
        >
            {
                disabled && (
                    <Dimmer className="lighter" active={ dimmerState }>
                        { t("common:featureAvailable" ) }
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
                    className="mb-2"
                    icon={ image }
                />
                <Card.Description>
                    { displayName }
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the technology card component.
 */
TechnologyCard.defaultProps = {
    "data-testid": "technology-card",
};
