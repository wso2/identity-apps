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
import java.util.ArrayList;

/**
 * Default identifier class
 * Represent a group of identifiers (After compiling layout, which is stored as a Defaul identifier)
 */
public class DefaultIdentifier implements ExecutableIdentifier {

    private static final long serialVersionUID = -962894494415101423L;
    private final ExecutableIdentifier[] allIdentifiers;

    /**
     * Constructor
     *
     * @param allIdentifiers Set of identifiers as a array list
     */
    public DefaultIdentifier(ArrayList<ExecutableIdentifier> allIdentifiers) {

        this.allIdentifiers = allIdentifiers.toArray(new ExecutableIdentifier[0]);
    }

    /**
     * Entry point to execute the current identifier
     *
     * @param executor This the object which is responsible for
     *                 executing each identifier and generate the page content in-order
     * @param out      The output will be written to this writer
     */
    public void accept(Executor executor, Writer out) {

        executor.execute(this, out);

        while (true) {
            if (!executor.continueExecution()) {
                break;
            }

            try {
                allIdentifiers[executor.getCurrentExecutionIndex()].accept(executor, out);
            } catch (IndexOutOfBoundsException e) {
                break;
            }
        }
    }

}
