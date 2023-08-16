/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * @deprecated Use StorybookCategories
 */
export const StoryCategories = {
    COMPONENTS: "Components API/Components"
};

enum StorybookCategories {
    Primitives = "Primitives",
    Layout = "Layout",
    Buttons = "Buttons",
    DataDisplay = "Data Display",
    Overlays = "Overlays",
    Typography = "Typography",
    Feedback = "Feedback",
    Miscellaneous = "Miscellaneous",
    Hooks = "Hooks"
}

export const STORYBOOK_HIERARCHY = {
    ALERT: `${ StorybookCategories.Feedback }/Alert`,
    MESSAGE: `${ StorybookCategories.Feedback }/Message`
};
