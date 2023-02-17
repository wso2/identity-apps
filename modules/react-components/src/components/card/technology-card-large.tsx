/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import kebabCase from "lodash-es/kebabCase";
import React, { CSSProperties, FunctionComponent, ReactElement, useState } from "react";
import { ButtonProps, Card, CardProps, Dimmer, Icon } from "semantic-ui-react";
import ByAsgardeoLabel from "../../assets/images/by-asgardeo-label.svg";
import { LinkButton } from "../button";
import { GenericIcon } from "../icon";

/**
 * Proptypes for the selection card component.
 */
export interface LargeTechnologyCardPropsInterface extends Omit<CardProps, "image">, IdentifiableComponentInterface,
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
     * Called on quick start click.
     */
    onQuickstartClick?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
    /**
     * Called on sample app click.
     */
    onSampleAppClick?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
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
export const LargeTechnologyCard: FunctionComponent<LargeTechnologyCardPropsInterface> = (
    props: LargeTechnologyCardPropsInterface
): ReactElement => {

    const {
        className,
        disabled,
        displayName,
        image,
        key,
        onQuickstartClick,
        onSampleAppClick,
        overlayOpacity,
        raised,
        featureAvailable,
        [ "data-componentid" ]: componentId
    } = props;

    const classes = classNames(
        "basic-card mb-1 no-hover",
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
        <div className="tech-selection-wrapper large">
            <Card
                as={ "div" }
                link={ false }
                key={ key }
                raised={ raised }
                data-componentid={ componentId ?? `technology-card-${ kebabCase(displayName) }` }
                className={ classes }
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
                <div className="made-by-asgardeo-label">
                    <img
                        width="132"
                        height="35"
                        src={ ByAsgardeoLabel }
                        alt="Made by Asgardeo label"
                    />
                </div>
                <Card.Content
                    textAlign="center"
                    style={ imageContainerStyles() }
                >
                    <GenericIcon
                        transparent
                        size="tiny"
                        icon={ image }
                    />
                </Card.Content>
                <Card.Content
                    textAlign="center"
                    className="pt-0 pb-4"
                >
                    <div
                        data-componentid={ `technology-card-alias-${ kebabCase(displayName) }` }
                        className="technology-name"
                    >
                        { displayName }
                    </div>
                </Card.Content>
                <Card.Content className="mb-4">
                    <LinkButton
                        data-componentid={ `technology-card-${ kebabCase(displayName) }-quickstart-button` }
                        className="tech-card-options mr-3"
                        hoverType="underline"
                        onClick={ !disabled && onQuickstartClick }
                        compact
                    >
                        <Icon name="bolt" />
                        Quickstart
                    </LinkButton>
                    <LinkButton
                        data-componentid={ `technology-card-${ kebabCase(displayName) }-sample-app-button` }
                        className="tech-card-options ml-3"
                        hoverType="underline"
                        onClick={ !disabled && onSampleAppClick }
                        compact
                    >
                        <Icon name="github" />
                        Sample App
                    </LinkButton>
                </Card.Content>
            </Card>
        </div>

    );
};

/**
 * Default props for the technology card component.
 */
LargeTechnologyCard.defaultProps = {
    "data-componentid": "technology-card"
};
