/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
