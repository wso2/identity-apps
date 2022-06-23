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

package org.wso2.identity.apps.taglibs.layout.controller.compiler.executors;

import org.owasp.encoder.Encode;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.CompilerException;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ComponentIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ConditionIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.DataIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.DefaultIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.NoIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.NotConditionIdentifier;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Map;

/**
 * Implementation of the executor interface.
 * Execute the compiled layout file.
 */
public class DefaultExecutor implements Executor {

    private static final long serialVersionUID = -6320882487995318374L;
    private final Map<String, Object> data;
    private final ArrayList<Integer> deepIterationPath;
    private int iterationLevel;
    private String componentName;
    private boolean activeComponentExecution;

    /**
     * Constructor.
     *
     * @param data All data required to execute the layout file.
     */
    public DefaultExecutor(Map<String, Object> data) {

        this.data = data;
        deepIterationPath = new ArrayList<Integer>();
        iterationLevel = -1;
        componentName = null;
        activeComponentExecution = false;
    }

    /**
     * Start the next iteration level (Block level).
     */
    private void nextIterationLevel() {

        if (deepIterationPath.size() == iterationLevel + 1) {
            deepIterationPath.add(0);
        }
        iterationLevel++;
    }

    /**
     * Remove the completed iteration level (Block level).
     */
    private void removeIteration() {

        deepIterationPath.remove(iterationLevel);
        iterationLevel--;
    }

    /**
     * Move into next identifier.
     */
    private void next() {

        deepIterationPath.set(iterationLevel, deepIterationPath.get(iterationLevel) + 1);
    }

    /**
     * Set the current running component.
     *
     * @param name Name of the component.
     */
    private void setComponent(String name) {

        componentName = name;
        activeComponentExecution = true;
    }

    /**
     * Remove the component which was executed.
     */
    public void deactivateComponent() {

        activeComponentExecution = false;
        componentName = null;
        iterationLevel = -1;
    }

    /**
     * Getter to get the component name.
     *
     * @return Component name.
     */
    public String getComponentName() {

        return componentName;
    }

    /**
     * Check whether the component execution enabled or not.
     *
     * @return Component execution enabled or not.
     */
    public boolean componentExecutionEnabled() {

        return activeComponentExecution;
    }

    /**
     * Check whether the compiled layout execution can continue or not.
     *
     * @return Whether the compiled layout execution can continue or not.
     */
    @Override
    public boolean continueExecution() {

        return !activeComponentExecution;
    }

    /**
     * Get the current executing index of the compiled layout.
     *
     * @return current executing index.
     */
    @Override
    public int getCurrentExecutionIndex() {

        return deepIterationPath.get(iterationLevel);
    }

    /**
     * Execute the provided default identifier.
     *
     * @param identifier Default identifier (Set of identifiers).
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(DefaultIdentifier identifier, Writer out) {

        nextIterationLevel();
    }

    /**
     * Execute the provided component identifier.
     *
     * @param identifier Component identifier.
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(ComponentIdentifier identifier, Writer out) {

        write(identifier.getText(), out);

        setComponent(identifier.getIdentifierName());
        next();
    }

    /**
     * Execute the provided data identifier.
     *
     * @param identifier Data identifier.
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(DataIdentifier identifier, Writer out) {

        write(identifier.getText(), out);
        Object value = data.get(identifier.getIdentifierName());

        if (value != null) {
            write(value.toString(), true, out);
        }
        next();
    }

    /**
     * Execute the provided condition identifier.
     *
     * @param identifier Condition identifier.
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(ConditionIdentifier identifier, Writer out) {

        if (iterationLevel == deepIterationPath.size() - 1) {
            write(identifier.getText(), out);
        }
        Object value = data.get(identifier.getIdentifierName());

        boolean executeContent = false;
        if (value instanceof Boolean) {
            if ((Boolean) value) {
                executeContent = true;
            }
        }

        if (executeContent) {
            identifier.acceptChild(this, out);
            if (!activeComponentExecution) {
                removeIteration();
            }
        }

        if (!activeComponentExecution) {
            next();
        }
    }

    /**
     * Execute the provided not condition identifier.
     *
     * @param identifier Not condition identifier.
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(NotConditionIdentifier identifier, Writer out) {

        if (iterationLevel == deepIterationPath.size() - 1) {
            write(identifier.getText(), out);
        }
        Object value = data.get(identifier.getIdentifierName());

        boolean executeContent = false;
        if (value instanceof Boolean) {
            if (!((Boolean) value)) {
                executeContent = true;
            }
        } else if (value == null) {
            executeContent = true;
        }

        if (executeContent) {
            identifier.acceptChild(this, out);
            if (!activeComponentExecution) {
                removeIteration();
            }
        }

        if (!activeComponentExecution) {
            next();
        }
    }

    /**
     * Execute the provided no identifier.
     *
     * @param identifier No identifier.
     * @param out        The output will be written to this writer.
     */
    @Override
    public void execute(NoIdentifier identifier, Writer out) {

        write(identifier.getText(), out);
        next();
    }

    /**
     * Write text content to the output writer.
     *
     * @param content Output text.
     * @param encode  Text encode enable or not.
     * @param out     The output will be written to this writer.
     */
    private void write(String content, boolean encode, Writer out) {

        try {
            if (encode) {
                out.write(Encode.forHtml(content));
            } else {
                out.write(content);
            }
        } catch (IOException e) {
            throw new CompilerException("Failed to write", e);
        }
    }

    /**
     * Method overloading -> Refer to the above method.
     */
    private void write(String content, Writer out) {

        write(content, false, out);
    }

}
