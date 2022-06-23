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

import java.io.File;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

/**
 * Tag handler class for the "dynamicComponent" tag
 */
public class DynamicComponentTagHandler extends TagSupport {

    private static final long serialVersionUID = -5836943916029103550L;
    private String var;

    public void setVar(String var) {

        this.var = var;
    }

    /**
     * This method will execute when the starting point of the "dynamicComponent" tag is reached
     *
     * @return int -> SKIP_BODY, EVAL_BODY_INCLUDE, EVAL_BODY_BUFFERED
     * @throws JspException
     */
    public int doStartTag() throws JspException {

        String currentComponentName = (String) pageContext.getAttribute(Constant.COMPONENT_NAME_STORING_VAR);

        if (currentComponentName == null) {
            return SKIP_BODY;
        }

        String filePath = Constant.DYNAMIC_COMPONENT_FILES_DIRECTORY_PATH + currentComponentName + ".jsp";

        if (new File(pageContext.getServletContext().getRealPath(filePath)).exists()) {
            pageContext.removeAttribute(Constant.COMPONENT_NAME_STORING_VAR);
            pageContext.setAttribute(var, filePath);
            return EVAL_BODY_INCLUDE;
        }

        return SKIP_BODY;
    }

    /**
     * This method will execute when the ending point of the "dynamicComponent" tag is reached
     *
     * @return int -> SKIP_PAGE, EVAL_PAGE
     * @throws JspException
     */
    public int doEndTag() throws JspException {

        pageContext.removeAttribute(var);
        return EVAL_PAGE;
    }

    /**
     * Release the resource for speedup the garbage collection
     */
    public void release() {

        var = null;
        super.release();
    }

}
