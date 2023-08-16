/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "Button", "PrimaryButton", "SecondaryButton", "DangerButton", "LinkButton" ],
    description: "Button component.",
    stories: [
        {
            description: "Default button",
            title: "Default Button"
        },
        {
            description: "Button with product primary color.",
            title: "Primary Button"
        },
        {
            description: "Button with product secondary color.",
            title: "Secondary Button"
        },
        {
            description: "Button that appears as a link",
            title: "Link Button"
        },
        {
            description: "Button to exhibit danger actions.",
            title: "Danger Button"
        },
        {
            description: "Button with a custom icon.",
            title: "Icon Button"
        }
    ],
    title: StoryCategories.COMPONENTS + "/Button"
};
