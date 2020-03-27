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

import React, { PropsWithChildren, ReactElement } from "react";
import classNames from "classnames";

/**
 * Product brand component Prop types.
 */
export interface ProductBrandPropsInterface {
    className?: string;
    logo?: any;
    name: string;
    style?: object;
}

/**
 * Product Brand component.
 *
 * @param {React.PropsWithChildren<ProductBrandPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProductBrand: React.FunctionComponent<PropsWithChildren<ProductBrandPropsInterface>> = (
    props: PropsWithChildren<ProductBrandPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        logo,
        name,
        style
    } = props;

    return (
        <div className={ classNames(className, "product-title") } style={ style }>
            { logo && logo }
            <h1 className={ classNames(className, "product-title-text") } style={ style }>
                { name }
            </h1>
            { children }
        </div>
    );
};
