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
    components: [ "UserAvatar" ],
    description: "Avatar component to display user avatars.",
    stories: [
        {
            description: "Displays all the user avatar variations.",
            title: "All variations"
        },
        {
            description: "Default user Avatar.",
            title: "Default"
        },
        {
            description: "Avatar with user's initials.",
            title: "With Initials"
        },
        {
            description: "Avatar from image.",
            title: "With Image"
        },
        {
            description: "Avatar from gravatar URL.",
            title: "Gravatar"
        },
        {
            description: "Avatar to display loading status.",
            title: "Placeholder"
        },
        {
            description: "Editable user avatar.",
            title: "Editable"
        },
        {
            description: "Different user avatar sizes. `mini`, `little`, `tiny` and `small` are displayed here." +
                "All the other `Semantic UI` sizes are also supported.",
            title: "Different sizes"
        },
        {
            description: "Play around with different props to dynamically interact with the user avatar component.",
            title: "Playground"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/User Avatar`
};
