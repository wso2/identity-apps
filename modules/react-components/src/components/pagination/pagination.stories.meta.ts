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
