/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { 
    BrandingPreferenceInterface,
    DynamicBrandingPreferenceLayoutInterface 
} from "../../models";

/**
 * Abstract class for control the fallbacks of the layouts.
 */
export abstract class LayoutFallback {
    abstract getFallbacks(): Partial<DynamicBrandingPreferenceLayoutInterface>;

    abstract setFallbacks(source: BrandingPreferenceInterface): void
}
