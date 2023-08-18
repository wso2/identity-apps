/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Proptypes for the product header component of login screen skeleton.
 */
interface ProductHeaderInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * Product Header Component.
 *
 * @param {ProductHeaderInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ProductHeader: FunctionComponent<ProductHeaderInterface> = (
    props: ProductHeaderInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference
    } = props;

    return (
        <div className="theme-icon inline auto transparent product-logo portal-logo" data-componentid={ componentId }>
            <img
                src={
                    brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.imgURL
                }
                id="product-logo"
                alt={
                    brandingPreference.theme[ brandingPreference.theme.activeTheme ].images.logo.altText
                }
            />
        </div>
    );
};

/**
 * Default props for the component.
 */
ProductHeader.defaultProps = {
    "data-componentid": "login-screen-skeleton-product-header"
};
