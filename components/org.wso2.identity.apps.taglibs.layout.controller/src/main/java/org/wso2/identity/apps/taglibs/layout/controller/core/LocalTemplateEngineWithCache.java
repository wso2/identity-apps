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

package org.wso2.identity.apps.taglibs.layout.controller.core;

import org.wso2.identity.apps.taglibs.layout.controller.cache.LayoutCache;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.executors.DefaultExecutor;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.DefaultParser;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.Parser;

import java.io.Writer;
import java.net.URL;
import java.util.Map;

/**
 * Caching implementation of the TemplateEngine interface with more controls using local compiler.
 */
public class LocalTemplateEngineWithCache implements TemplateEngine {

    private static final long serialVersionUID = 8574215169965654726L;
    private ExecutableIdentifier compiledObject = null;
    private DefaultExecutor executor = null;

    /**
     * Execute the layout with given data and generate the complete page.
     *
     * @param layoutName Name of the layout.
     * @param layoutFile Layout file path as a URL object.
     * @param data       Data required to execute the layout file.
     * @param out        Output object as a writer.
     * @param cache      Whether we want to cache the layout file.
     */
    @Override
    public void execute(String layoutName, URL layoutFile, Map<String, Object> data, Writer out, boolean cache) {

        if (executor == null && compiledObject == null) {
            if (!cache) {
                Parser parser = new DefaultParser();
                compiledObject = parser.compile(layoutFile);
            } else {
                LayoutCache layoutCache = LayoutCache.getInstance();
                compiledObject = layoutCache.getLayout(layoutName, layoutFile);
            }
            executor = new DefaultExecutor(data);
        }
        compiledObject.accept(executor, out);
    }

    /**
     * Check the existance of the layout file.
     *
     * @param layoutName Name of the layout.
     * @param layoutFile Layout file path as a URL object.
     * 
     * @return Whether the layout file exist or not.
     */
    public boolean exists(String layoutName, URL layoutFile) {
        LayoutCache layoutCache = LayoutCache.getInstance();
        try {
            ExecutableIdentifier compiledLayout = layoutCache.getLayout(layoutName, layoutFile);
            if (compiledLayout == null) {
                return false;
            } else {
                return true;
            }
        } catch (Exception exception) {
            return false;
        }
    }

    /**
     * Get the compiled layout file as an object
     *
     * @return Compiled layout will be return
     */
    public ExecutableIdentifier getCompiledObject() {

        return compiledObject;
    }

    /**
     * Get the executor which is used to execute the compiled layout
     *
     * @return Layout executor will return
     */
    public DefaultExecutor getExecutor() {

        return executor;
    }
}
