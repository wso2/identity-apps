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
    components: [ "AppAvatar" ],
    description: "Avatar component to display app avatars.",
    stories: [
        {
            description: "All variations of the App Avatar.",
            title: "All variations"
        },
        {
            description: "Avatar with application name initials.",
            title: "With Initials"
        },
        {
            description: "App Avatar resolved from an image.",
            title: "With Image"
        },
        {
            description: "App Avatar to display loading status.",
            title: "Placeholder"
        },
        {
            description: "Different app avatar sizes. `mini`, `little`, `tiny` and `small` are displayed here." +
                "All the other `Semantic UI` sizes are also supported.",
            title: "Different sizes"
        },
        {
            description: "Play around with different props to dynamically interact with the app avatar component.",
            title: "Playground"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/App Avatar`
};
