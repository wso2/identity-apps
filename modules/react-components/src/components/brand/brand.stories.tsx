/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
