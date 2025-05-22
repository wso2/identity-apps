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
import javax.servlet.jsp.PageContext;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;

import static javax.servlet.jsp.tagext.IterationTag.EVAL_BODY_AGAIN;
import static javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE;
import static javax.servlet.jsp.tagext.Tag.SKIP_BODY;

/**
 * Handles processing of Raw HTML layout templates.
 */
public class LayoutContentProcessor {

    private final PageContext pageContext;
    private final String layoutHtml;

    public BufferedReader reader;
    public String endContent;

    /**
     * Constructs a LayoutContentProcessor instance.
     *
     * @param pageContext The current page context.
     * @param layoutHtml The HTML content of the layout to be processed.
     * @param endContent The content that marks the end of processing for a specific layout section.
     * @param reader A BufferedReader to read content from the layout file or stream.
     */
    public LayoutContentProcessor(PageContext pageContext, String layoutHtml, String endContent,
                                  BufferedReader reader) {

        this.pageContext = pageContext;
        this.layoutHtml = layoutHtml;
        this.endContent = endContent;
        this.reader = reader;
    }

    /**
     * Processes the layout content until the next component tag is encountered.
     *
     * @return An integer constant indicating the action to be taken:
     *  - EVAL_BODY_INCLUDE: If a component tag is found and the body content needs to be included for processing.
     *  - SKIP_BODY: If no further component tags are found in the layout content.
     * @throws IOException .
     */
    public int processLayoutUntilNextComponent() throws IOException {

        PrintWriter writer = new PrintWriter(pageContext.getOut());

        if (reader == null) {
            reader = new BufferedReader(new StringReader(layoutHtml));
        }
        if (endContent != null) {
            writer.write(endContent);
            endContent = null;
        }
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.contains("{{{")) {
                int start = line.indexOf("{{{");
                int end = line.indexOf("}}}", start);
                if (end == -1) {
                    break;
                }
                String componentName = line.substring(start + 3, end).trim();
                writer.write(line.substring(0, start));
                endContent = line.substring(end + 3);
                pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, componentName);
                return EVAL_BODY_INCLUDE;
            }
            writer.write(line);
        }
        return SKIP_BODY;
    }

    /**
     * Processes the remaining layout content after a component is encountered in the layout template.
     *
     * @return An integer constant indicating the processing action:
     *  - EVAL_BODY_AGAIN: If a component tag is found, signaling the need for further processing of the layout.
     *  - SKIP_BODY: If no component tags are found, indicating that processing is complete.
     * @throws IOException .
     */
    public int processRemainingLayoutAfterComponent() throws IOException {

        PrintWriter writer = new PrintWriter(pageContext.getOut());

        if (reader == null) {
            reader = new BufferedReader(new StringReader(layoutHtml));
        }
        if (endContent != null) {
            writer.write(endContent);
            endContent = null;
        }
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.contains("{{{")) {
                int start = line.indexOf("{{{");
                int end = line.indexOf("}}}", start);
                if (end == -1) {
                    break;
                }
                String componentName = line.substring(start + 3, end).trim();
                writer.write(line.substring(0, start));
                endContent = line.substring(end + 3);
                pageContext.setAttribute(Constant.COMPONENT_NAME_STORING_VAR, componentName);
                return EVAL_BODY_AGAIN;
            }
            writer.write(line);
        }
        return SKIP_BODY;
    }
}
