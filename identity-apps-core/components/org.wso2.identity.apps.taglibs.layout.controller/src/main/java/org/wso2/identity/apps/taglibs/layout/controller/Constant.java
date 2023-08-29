/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com).
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.taglibs.layout.controller;

/**
 * All constants related to the layout controlling function.
 */
public class Constant {

    public static final String COMPONENT_NAME_STORING_VAR = "componentLiteralName";
    public static final String DYNAMIC_COMPONENT_FILES_DIRECTORY_PATH = "extensions/";
    public static final String LAYOUT_CACHE_NAME = "layouts";
    public static final String LAYOUT_CACHE_STORE_DIRECTORY_NAME = "layouts";
    public static final int LAYOUT_CACHE_HEAP_ENTRIES = 20;
    public static final int LAYOUT_CACHE_OFF_HEAP_SIZE = 10; // Unit is MB.
    public static final int LAYOUT_CACHE_DISK_SIZE = 1; // Unit is GB.
}
