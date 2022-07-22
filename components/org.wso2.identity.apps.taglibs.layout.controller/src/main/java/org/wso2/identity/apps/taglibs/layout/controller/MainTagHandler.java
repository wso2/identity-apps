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

import org.wso2.identity.apps.taglibs.layout.controller.core.LocalTemplateEngineWithCache;

import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

/**
 * Tag handler class for the "main" tag.
 */
public class MainTagHandler extends TagSupport {

    private static final long serialVersionUID = -7314788638114472678L;
    private String layoutName;
    private String layoutFileRelativePath;
    private Map<String, Object> data = new HashMap<>();
    private boolean cache = true;
    private LocalTemplateEngineWithCache engine = null;

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
     * Set the cache.
     *
     * @param cache Whether the cache is enabled or not.
     */
    public void setCache(boolean cache) {

        this.cache = cache;
    }

    /**
     * This method will execute when the starting point of the "main" tag is reached.
     *
     * @return int -> SKIP_BODY, EVAL_BODY_INCLUDE, EVAL_BODY_BUFFERED.
     * @throws JspException
     */
    public int doStartTag() throws JspException {

        engine = new LocalTemplateEngineWithCache();
        try {
            engine.execute(layoutName, pageContext.getServletContext().getResource(layoutFileRelativePath), data,
                    new PrintWriter(pageContext.getOut()), cache);
        } catch (MalformedURLException e) {
            throw new JspException("Can't create a URL to the given relative path", e);
        }
        if (engine.getExecutor().componentExecutionEnabled()) {
            pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, engine.getExecutor().getComponentName());
            engine.getExecutor().deactivateComponent();
            return EVAL_BODY_INCLUDE;
        }
        return SKIP_BODY;
    }

    /**
     * This method will execute after each body execution of the "main" tag.
     *
     * @return int -> EVAL_BODY_AGAIN, SKIP_BODY.
     * @throws JspException
     */
    public int doAfterBody() throws JspException {

        try {
            engine.execute(layoutName, pageContext.getServletContext().getResource(layoutFileRelativePath), data,
                    new PrintWriter(pageContext.getOut()), cache);
        } catch (MalformedURLException e) {
            throw new JspException("Can't create a URL to the given relative path", e);
        }
        if (engine.getExecutor().componentExecutionEnabled()) {
            pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, engine.getExecutor().getComponentName());
            engine.getExecutor().deactivateComponent();
            return EVAL_BODY_AGAIN;
        }
        pageContext.removeAttribute(Constant.COMPONENT_NAME_STORING_VAR);
        return SKIP_BODY;
    }

    /**
     * Release the resource for speedup the garbage collection.
     */
    public void release() {

        layoutName = null;
        layoutFileRelativePath = null;
        data = null;
        engine = null;
        super.release();
    }

}
