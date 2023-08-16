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
    components: [ "Alert" ],
    description: "Alert component to show success, error, warning and info notifications on the front end dashboards.",
    stories: [
        {
            description: "Displays all the alert variations.",
            title: "All variations"
        },
        {
            description: "Alert to show success messages.",
            title: "Success Alert"
        },
        {
            description: "Alert to show error messages.",
            title: "Error Alert"
        },
        {
            description: "Alert to show warning messages.",
            title: "Warning Alert"
        },
        {
            description: "Alert to show info messages.",
            title: "Info Alert"
        },
        {
            description: "Play around with different props to dynamically interact with the alert component.",
            title: "Playground Alert"
        }
    ],
    title: StoryCategories.COMPONENTS + "/Alert"
};
