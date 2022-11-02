/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import * as React from "react";
import { meta } from "./brand.stories.meta";
import { Logo } from "./logo";
import { ProductBrand } from "./product-brand";

export default {
    parameters: {
        component: ProductBrand,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Product Brand"
};

/**
 * Story to display the default product brand.
 *
 * @returns DefaultProductBrand React Component
 */
export const DefaultProductBrand = (): React.ReactElement => (
    <div
        style={ {
            alignContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap"
        } }
    >
        <ProductBrand
            appName="Developer"
            logo={ (
                <Logo
                    image="https://wso2.cachefly.net/wso2/sites/all/2020-theme/images/wso2-logo.svg"
                />
            ) }
            productName="Identity Server"
            version="6.0.0-M24-SNAPSHOT"
        />
    </div>
);

DefaultProductBrand.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
