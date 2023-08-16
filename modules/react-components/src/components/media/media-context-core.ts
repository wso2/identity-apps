/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createMedia } from "@artsy/fresnel";

export const BREAKPOINTS: {
    computer: number;
    largeScreen: number;
    mobile: number;
    tablet: number;
    widescreen: number;
} = {
    computer: 992,
    largeScreen: 1200,
    mobile: 320,
    tablet: 768,
    widescreen: 1920
};

export const AppMedia: any = createMedia({
    breakpoints: BREAKPOINTS
});

export const mediaStyle = AppMedia.createMediaStyle();
