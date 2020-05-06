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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";

/**
 * Product brand component Prop types.
 */
export interface ProductBrandPropsInterface extends TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Product logo.
     */
    logo?: any;
    /**
     * Product name.
     */
    name: string;
    /**
     * Custom styles object.
     */
    style?: object;
}

/**
 * Product Brand component.
 *
 * @param {React.PropsWithChildren<ProductBrandPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ProductBrand: FunctionComponent<PropsWithChildren<ProductBrandPropsInterface>> = (
    props: PropsWithChildren<ProductBrandPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        logo,
        name,
        style,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div className={ classNames(className, "product-title") } style={ style } data-testid={ testId }>
            { logo && logo }
            <h1
                className={ classNames(className, "product-title-text") }
                style={ style }
                data-testid={ `${ testId }-title` }
            >
                { name }
            </h1>
            { children }
        </div>
    );
};

/**
 * Default props for the product brand component.
 */
ProductBrand.defaultProps = {
    "data-testid": "product-brand"
};
