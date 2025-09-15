/*
 * Copyright (c) 2022-2025, WSO2 LLC. (http://www.wso2.com).
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

package org.wso2.identity.apps.taglibs.layout.controller;

import org.wso2.identity.apps.taglibs.layout.controller.core.LocalTemplateEngine;
import org.wso2.identity.apps.taglibs.layout.controller.processor.LayoutContentProcessor;
import org.wso2.identity.apps.taglibs.layout.controller.processor.LegacyLayoutFileProcessor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

/**
 * Tag handler class for the "main" tag.
 */
public class MainTagHandler extends TagSupport {

    private static final long serialVersionUID = -7314788638114472678L;
    private String layoutName = "";
    private String layoutFileRelativePath = "";
    private Map<String, Object> data = new HashMap<>();
    private boolean compile = false;
    private LocalTemplateEngine engine = null;

    private LayoutContentProcessor layoutProcessor;
    private LegacyLayoutFileProcessor legacyProcessor;

    /**
     * Set the name of the layout.
     *
     * @param layoutName Name of the layout.
     */
    public void setLayoutName(String layoutName) {

        this.layoutName = layoutName;
    }

    /**
     * Set the layout file relative path.
     *
     * @param layoutFileRelativePath Layout file relative path.
     */
    public void setLayoutFileRelativePath(String layoutFileRelativePath) {

        this.layoutFileRelativePath = layoutFileRelativePath;
    }

    /**
     * Set the map object, consists of data required for the layout.
     *
     * @param data Required data for the layout.
     */
    public void setData(Map<String, Object> data) {

        this.data = data;
    }

    /**
     * Set whether to compile the layout or not.
     *
     * @param compile Whether the compilation is enabled or not.
     */
    public void setCompile(boolean compile) {

        this.compile = compile;
    }

    /**
     * This method will execute when the starting point of the "main" tag is reached.
     * based on the nature of layout content switches between legacy or the default rendering.
     *
     * @throws JspException .
     */
    public int doStartTag() throws JspException {

        if (isLikelyRelativePath(layoutFileRelativePath)) {
            engine = new LocalTemplateEngine();
            legacyProcessor = new LegacyLayoutFileProcessor(engine, compile, pageContext,
                layoutName, layoutFileRelativePath, data);
            return legacyProcessor.startLegacyLayoutRendering();
        } else {
            layoutProcessor = new LayoutContentProcessor(pageContext, layoutFileRelativePath);
            try {
                return layoutProcessor.processLayoutUntilNextComponent();
            } catch (IOException e) {
                throw new JspException("Error processing layout HTML.", e);
            }
        }
    }

    /**
     * This method will execute after each body execution of the "main" tag.
     * based on the nature of layout content switches between legacy or the default rendering.
     *
     * @throws JspException
     */
    public int doAfterBody() throws JspException {

        if (isLikelyRelativePath(layoutFileRelativePath)) {
            if (legacyProcessor == null) {
                throw new IllegalStateException("Legacy layout processor not initialized.");
            }
            return legacyProcessor.continueLegacyLayoutRendering();
        } else {
            if (layoutProcessor == null) {
                throw new IllegalStateException("Layout content processor not initialized.");
            }
            try {
                return layoutProcessor.processRemainingLayoutAfterComponent();
            } catch (IOException e) {
                throw new JspException("Error processing layout HTML.", e);
            }
        }
    }

    private boolean isLikelyRelativePath(String input) {

        return input != null && (input.startsWith("http") || input.startsWith("https") ||
            input.endsWith(".html") || input.endsWith(".ser")
        );
    }

    /**
     * Release the resource for speedup the garbage collection.
     */
    public void release() {

        layoutName = null;
        layoutFileRelativePath = null;
        data = null;
        engine = null;
        if (layoutProcessor != null) {
            layoutProcessor.release();
        }
        legacyProcessor = null;
        layoutProcessor = null;
        super.release();
    }
}
