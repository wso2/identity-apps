/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for sub stories.
 */
export interface SubStoryInterface {
    /**
     * Title of the example.
     */
    title: string;
    /**
     * Story description.
     */
    description: string;
    /**
     * Source code related to the example.
     */
    source?: string;
}

/**
 * Interface for the story meta.
 */
export interface StoryMetaInterface {
    /**
     * Description of the main story.
     */
    description: string;
    /**
     * Components to import.
     */
    components: string[] | string;
    /**
     * Array of sub stories.
     */
    stories?: SubStoryInterface[];
    /**
     * Module to import the components.
     */
    importModule?: string;
    /**
     * Title of the main story.
     */
    title: string;
}
