/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "CookieConsentBanner" ],
    description: "Banner component to get Cookie consent.",
    stories: [
        {
            description: "Default variation of the Cookie consent banner.",
            title: "Default"
        },
        {
            description: "Inverted variation of the Cookie consent banner.",
            title: "Inverted"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Banners/Cookie Consent`
};
