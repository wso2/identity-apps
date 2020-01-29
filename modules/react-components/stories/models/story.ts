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
