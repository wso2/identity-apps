/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { BrandingPreferenceLayoutInterface } from "../../../models";
import { DesignFormValuesInterface } from "../design-form";

/**
 * Prop-types for the Layout Design Extension Components.
 */
export interface LayoutDesignExtensionInterface extends IdentifiableComponentInterface {
    /**
     * Design form initial values.
     */
    initialValues: DesignFormValuesInterface;
    /**
     * Layout instance details.
     */
    layout: BrandingPreferenceLayoutInterface;
    /**
     * Function for set the layout instance details.
     */
    setLayout: (value: BrandingPreferenceLayoutInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * i18N translation function.
     */
    t?: string | any;
}
