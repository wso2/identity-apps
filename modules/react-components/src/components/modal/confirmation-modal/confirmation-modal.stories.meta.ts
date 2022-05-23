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

import { StoryCategories } from "../../hierarchy";
import { StoryMetaInterface } from "../../models";

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
