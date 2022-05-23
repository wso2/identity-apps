/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import { StoryCategories } from "../../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../../storybook-helpers/models";

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
