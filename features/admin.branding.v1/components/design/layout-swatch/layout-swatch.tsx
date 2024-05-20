/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactElement, useState } from "react";
import { Placeholder } from "semantic-ui-react";
import { BrandingPreferenceImageInterface } from "../../../../common.branding.v1/models";

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
 * @param props - Props injected to the component.
 * @returns Layout Swatch Component.
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

    const classes: string = classNames(
        "layout-swatch",
        {
            active
        }
    );

    const containerClasses: string = classNames(
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
