/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
 */

import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "DangerZoneGroup", "DangerZone" ],
    description: "Danger zone component to display potentially dangerous actions.",
    stories: [
        {
            description: "A single danger zone action.",
            title: "Default"
        },
        {
            description: "A single danger zone action.",
            title: "Default"
        },
        {
            description: "Group of danger zone actions.",
            title: "Group"
        },
        {
            description: "Play around with different props to dynamically interact with the danger zone component.",
            title: "Playground"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Danger Zone`
};
