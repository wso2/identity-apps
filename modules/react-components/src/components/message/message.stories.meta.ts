/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    components: [ "Message" ],
    description: "Message component to show success, error, warning and info messages",
    stories: [
        {
            description: "Displays all the message variations.",
            title: "All variations"
        },
        {
            description: "Message component configured to show success messages.",
            title: "Success Message"
        },
        {
            description: "Message component configured to show error messages.",
            title: "Error Message"
        },
        {
            description: "Message component configured to show warning messages.",
            title: "Warning Message"
        },
        {
            description: "Message component configured to show info messages.",
            title: "Info Message"
        },
        {
            description: "Play around with different props to dynamically interact with the message component.",
            title: "Playground Message"
        }
    ],
    title: StoryCategories.COMPONENTS + "/Message"
};
