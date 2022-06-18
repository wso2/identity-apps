/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers;

import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;

import java.net.URL;

/**
 * Interface of the parser class
 */
public interface Parser {

    /**
     * Execute the layout file and create a compiled layout file as a object
     *
     * @param file File path for the layout as an URL object
     * @return Compiled layout file
     */
    public ExecutableIdentifier compile(URL file);

}
