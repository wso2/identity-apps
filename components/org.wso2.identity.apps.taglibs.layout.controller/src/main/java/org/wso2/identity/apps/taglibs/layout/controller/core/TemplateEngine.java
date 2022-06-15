/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.identity.apps.taglibs.layout.controller.core;

import java.io.Serializable;
import java.io.Writer;
import java.net.URL;
import java.util.Map;

/**
 * Interface for the template engine
 */
public interface TemplateEngine extends Serializable {

    /**
     * Execute the layout with given data and generate the complete page
     *
     * @param layoutName     Name of the layout
     * @param layoutFile     Layout file path as a URL object
     * @param data           Data required to execute the layout file
     * @param out            Output object as a writer
     * @param devMode        Whether we are running code in dev or prod (Default - false)
     * @param testLayoutFile This layout file path used when devMode is true
     */
    public void execute(
            String layoutName,
            URL layoutFile, Map<String,
            Object> data,
            Writer out,
            boolean devMode,
            URL testLayoutFile
    );

}
