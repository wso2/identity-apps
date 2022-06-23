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

package org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers;

import org.wso2.identity.apps.taglibs.layout.controller.compiler.executors.Executor;

import java.io.Writer;

/**
 * Condition identifier class -> {{{#nameOfTheConditionVariable}}}.
 */
public class ConditionIdentifier implements ExecutableIdentifier {

    private static final long serialVersionUID = 6283176238696651659L;
    private final String identifierName;
    private final String prependText;
    private ExecutableIdentifier child;

    /**
     * Constructor.
     *
     * @param identifierName Name of the condition variable.
     * @param text           Text identified before this condition identifier.
     */
    public ConditionIdentifier(String identifierName, String text) {

        this.prependText = text;
        this.identifierName = identifierName.trim();
        this.child = null;
    }

    /**
     * Entry point to execute the current identifier.
     *
     * @param executor This the object which is responsible for
     *                 executing each identifier and generate the page content in-order.
     * @param out      The output will be written to this writer.
     */
    public void accept(Executor executor, Writer out) {

        executor.execute(this, out);
    }

    /**
     * Getter to get the text identified before this condition identifier.
     *
     * @return Text identified before this condition identifier.
     */
    public String getText() {

        return prependText;
    }

    /**
     * Getter to get the condition variable name.
     *
     * @return Condition variable name.
     */
    public String getIdentifierName() {

        return identifierName;
    }

    /**
     * Getter to get the child identifiers.
     *
     * @return Child identifiers.
     */
    public ExecutableIdentifier getChild() {

        return child;
    }

    /**
     * Setter to set the child identifier to the condition identifier.
     *
     * @param child Child identifiers of the condition block.
     */
    public void setChild(ExecutableIdentifier child) {

        this.child = child;
    }

    /**
     * Entry point to execute the child identifier.
     *
     * @param executor This the object which is responsible for
     *                 executing each identifier and generate the page content in-order.
     * @param out      The output will be written to this writer.
     */
    public void acceptChild(Executor executor, Writer out) {

        child.accept(executor, out);
    }
}
