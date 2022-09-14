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

import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "Pagination" ],
    description: "Component to Pagination.",
    stories: [
        {
            description: "Default Pagination.",
            title: "Default"
        },
        {
            description: "Pagination with items per page dropdown.",
            title: "Pagination With Items Per Page"
        },
        {
            description: "Minimal Pagination with only next and previous buttons.",
            title: "Minimal Pagination"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Pagination`
};
