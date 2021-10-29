/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { GenericIcon } from "@wso2is/react-components";
import classNames from "classnames";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardProps, Dimmer } from "semantic-ui-react";

/**
 * Proptypes for the selection card component.
 */
export interface ProtocolCardPropsInterface extends Omit<CardProps, "image">, TestableComponentInterface {
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
    onClick?: any;
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
    showOption?: boolean;
    iconClass?: boolean;
}

/**
 * Proptypes for Container Styles.
 */
export interface ImageContainerStylesPropsInterface {
    opacity: number;
}

/**
 * Technology card component.
 *
 * @param {ProtocolCardPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const ProtocolCard: FunctionComponent<ProtocolCardPropsInterface> = (
    props: ProtocolCardPropsInterface
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
        showOption,
        iconClass,
        [ "data-testid" ]: testId
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
    const [ showExtra, setShowExtra ] = useState<boolean>(false);
    
    /**
     * Inline styles for image container.
     */
    const imageContainerStyles = (): ImageContainerStylesPropsInterface => {

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
                testId ?? `protocol-card-${ kebabCase(displayName) }`
            }
            className={ classes }
            onClick={ showOption ? () => setShowExtra(!showExtra): !disabled && onClick }
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
                    defaultIcon
                    transparent
                    size="mini"
                    className= { `mb-2 ${iconClass} ` }
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
ProtocolCard.defaultProps = {
    "data-testid": "technology-card",
    showOption: false
};
