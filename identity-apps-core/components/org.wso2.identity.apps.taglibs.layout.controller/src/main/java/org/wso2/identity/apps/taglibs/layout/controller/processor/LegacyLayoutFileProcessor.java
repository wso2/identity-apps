/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

package org.wso2.identity.apps.taglibs.layout.controller.processor;

import org.wso2.identity.apps.taglibs.layout.controller.Constant;
import org.wso2.identity.apps.taglibs.layout.controller.core.LocalTemplateEngine;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.PageContext;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

import static javax.servlet.jsp.tagext.IterationTag.EVAL_BODY_AGAIN;
import static javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE;
import static javax.servlet.jsp.tagext.Tag.SKIP_BODY;

/**
 * Handles the processing and rendering of legacy layout template files.
 */
public class LegacyLayoutFileProcessor {

    private final LocalTemplateEngine engine;
    private final boolean compile;
    private final PageContext pageContext;
    private final String layoutName;
    private final String layoutFileRelativePath;
    private final Map<String, Object> data;

    /**
     * processing and rendering a layout using the relative file path
     *
     * @param engine                  The template engine used to process the layout file.
     * @param compile                 A boolean flag indicating whether the layout file should be
     *                                 compiled or processed without compilation.
     * @param pageContext             The context of the current JSP page where the layout is rendered.
     * @param layoutName              The name of the layout being processed.
     * @param layoutFileRelativePath  The relative path to the layout file, which can be either a
     *                                 compiled or raw layout file.
     * @param data                    A map of data objects required as input while processing
     *                                 the layout file.
     */
    public LegacyLayoutFileProcessor(LocalTemplateEngine engine, boolean compile, PageContext pageContext,
                                 String layoutName, String layoutFileRelativePath, Map<String, Object> data) {
        this.engine = engine;
        this.compile = compile;
        this.pageContext = pageContext;
        this.layoutName = layoutName;
        this.layoutFileRelativePath = layoutFileRelativePath;
        this.data = data;
    }

    /**
     * Processes the layout template file and generates page content using a specified template engine.
     * Depending on the compile flag, the method either processes a compiled layout file directly or compiles
     * a raw layout file before processing.
     *
     * @throws JspException .
     */
    public void processLegacyLayoutTemplateFile() throws JspException {

        PrintWriter writer = new PrintWriter(pageContext.getOut());

        try {
            if (compile) {
                String rawLayoutFilePath = layoutFileRelativePath.replaceFirst(".ser", ".html");
                engine.execute(layoutName,
                    layoutFileRelativePath.startsWith("http") ? new URL(rawLayoutFilePath) :
                        pageContext.getServletContext().getResource(rawLayoutFilePath), data, writer);
            } else {
                engine.executeWithoutCompile(layoutName,
                    layoutFileRelativePath.startsWith("http") ? new URL(layoutFileRelativePath) :
                        pageContext.getServletContext().getResource(layoutFileRelativePath), data, writer);
            }
        } catch (MalformedURLException e) {
            throw new JspException("Can't create a URL to the given relative path", e);
        }
    }

    /**
     * Initiates the rendering process for legacy layout templates by processing the layout file.
     *
     * @return An integer constant indicating the next step in processing:
     *  - EVAL_BODY_INCLUDE: If component execution is enabled and body content should be included.
     *  - SKIP_BODY: If component execution is not enabled and no body content should be processed.
     * @throws JspException .
     */
    public int startLegacyLayoutRendering() throws JspException {

        processLegacyLayoutTemplateFile();

        if (engine.getExecutor().componentExecutionEnabled()) {
            pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, engine.getExecutor().getComponentName());
            engine.getExecutor().deactivateComponent();
            return EVAL_BODY_INCLUDE;
        }
        return SKIP_BODY;
    }

    /**
     * Continues the rendering process of the layout template. If the component execution is enabled,
     *
     * @return An integer constant indicating the next processing step:
     *         - EVAL_BODY_AGAIN: If component execution is active and the body content should be processed again.
     *         - SKIP_BODY: If component execution is not active and the body content should be skipped.
     * @throws JspException .
     */
    public int continueLegacyLayoutRendering() throws JspException {

        processLegacyLayoutTemplateFile();

        if (engine.getExecutor().componentExecutionEnabled()) {
            pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, engine.getExecutor().getComponentName());
            engine.getExecutor().deactivateComponent();
            return EVAL_BODY_AGAIN;
        }
        pageContext.removeAttribute(Constant.COMPONENT_NAME_STORING_VAR);
        return SKIP_BODY;
    }
}
