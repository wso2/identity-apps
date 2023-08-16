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
