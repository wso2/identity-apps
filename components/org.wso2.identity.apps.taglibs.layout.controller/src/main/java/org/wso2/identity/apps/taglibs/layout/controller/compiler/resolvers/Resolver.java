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

package org.wso2.identity.apps.taglibs.layout.controller.compiler.resolvers;

import java.io.Reader;
import java.net.URL;

/**
 * Resolver interface to read the layout file
 */
public interface Resolver {

    /**
     * Get the reader to read the layout file
     *
     * @param file Layout file path as an URL object
     * @return Reader to read the layout file
     */
    public Reader getReader(URL file);

    /**
     * Close resources related to the reader
     */
    public void closeResources();

}
