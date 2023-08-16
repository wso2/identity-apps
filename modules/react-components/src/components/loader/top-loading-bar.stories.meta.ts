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
    components: [ "TopLoadingBar" ],
    description: "Components to display different app loading status",
    stories: [
        {
            description: "Top loading bar to display AJAX request loading status.",
            title: "Default"
        },
        {
            description: "Play around with different props to dynamically interact with the top loading bar component.",
            title: "Playground"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Top Loading Bar`
};
