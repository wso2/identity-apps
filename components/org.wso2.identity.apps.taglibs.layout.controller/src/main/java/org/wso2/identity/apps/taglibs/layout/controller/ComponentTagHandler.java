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

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

/**
 * Tag handler class for the "component" tag
 */
public class ComponentTagHandler extends TagSupport {

    private static final long serialVersionUID = 3133927426104147501L;
    private String name;

    public void setName(String name) {

        this.name = name;
    }

    /**
     * This method will execute when the starting point of the "component" tag is reached
     *
     * @return int -> SKIP_BODY, EVAL_BODY_INCLUDE, EVAL_BODY_BUFFERED
     * @throws JspException
     */
    public int doStartTag() throws JspException {

        String currentComponentName = (String) pageContext.getAttribute(Constant.COMPONENT_NAME_STORING_VAR);

        if (currentComponentName == null) {
            return SKIP_BODY;
        }

        if (currentComponentName.equals(name)) {
            pageContext.removeAttribute(Constant.COMPONENT_NAME_STORING_VAR);
            return EVAL_BODY_INCLUDE;
        } else {
            return SKIP_BODY;
        }
    }

    /**
     * Release the resource for speedup the garbage collection
     */
    public void release() {

        name = null;
        super.release();
    }

}
