/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { StoryCategories } from "../../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "ConfirmationModal" ],
    description: "A modal component to be prompted for confirmations.",
    stories: [
        {
            description: "Default confirmation modal",
            title: "Default"
        },
        {
            description: "Confirmation modal with text input assertion.",
            title: "Text Input Assertion"
        },
        {
            description: "Confirmation modal with checkbox assertion.",
            title: "Checkbox Assertion"
        },
        {
            description: "Confirmation modal with animations.",
            title: "Animated"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Confirmation Modal`
};
