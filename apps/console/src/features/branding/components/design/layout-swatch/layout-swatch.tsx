/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactElement, useState } from "react";
import { Placeholder } from "semantic-ui-react";
import { BrandingPreferenceImageInterface } from "../../../models";

/**
 * Proptypes for the Layout Swatch component.
 */
export interface LayoutSwatchInterface extends IdentifiableComponentInterface {
    /**
     * Is the swatch active.
     */
    active?: boolean;
    /**
     * Image of the layout.
     */
    image: BrandingPreferenceImageInterface;
    /**
     * Add a premium badge or not.
     */
    premium?: boolean;
    /**
     * Layout swatch click event handler.
     */
    onClick: MouseEventHandler<HTMLDivElement>;
}

/**
 * Layout Swatch Component.
 *
 * @param {PropsWithChildren<LayoutSwatchInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LayoutSwatch: FunctionComponent<PropsWithChildren<LayoutSwatchInterface>> = (
    props: PropsWithChildren<LayoutSwatchInterface>
): ReactElement => {

    const {
        active,
        children,
        image,
        premium,
        onClick,
        [ "data-componentid" ]: componentId
    } = props;

    const [ isImageLoaded, setIsImageLoaded ] = useState<boolean>(false);

    const classes = classNames(
        "layout-swatch",
        {
            active
        }
    );

    const containerClasses = classNames(
        "layout-swatch-container",
        {
            "premium-ribbon": premium
        }
    );

    return (
        <div className={ containerClasses } >
            <div
                className={ classes }
                data-componentid={ componentId }
                onClick={ onClick }
            > 
                {
                    !isImageLoaded
                        ? (
                            <Placeholder className="layout-swatch-placeholder" >
                                <Placeholder.Image />
                            </Placeholder>
                        )
                        : null
                }
                <img 
                    className="layout-swatch-image" 
                    src={ image.imgURL } 
                    alt={ image.altText } 
                    onLoad={ () => setIsImageLoaded(true) }
                    hidden={ !isImageLoaded }
                />
                <div className="layout-swatch-control">
                    { children }
                </div>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
LayoutSwatch.defaultProps = {
    "data-componentid": "layout-swatch"
};
