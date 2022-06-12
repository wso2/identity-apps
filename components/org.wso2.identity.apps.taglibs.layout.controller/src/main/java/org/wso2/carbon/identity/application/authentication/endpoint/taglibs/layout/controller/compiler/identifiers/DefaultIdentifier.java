/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers;

import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.executors.Executor;

/**
 * Default identifier class
 * Represent a group of identifiers (After compiling layout, which is stored as a Defaul identifier)
 */
public class DefaultIdentifier implements ExecutableIdentifier {

    private static final long serialVersionUID = -962894494415101423L;
    private ExecutableIdentifier[] allIdentifiers;

    /**
     * Constructor
     *
     * @param allIdentifiers Set of identifiers as a array
     */
    public DefaultIdentifier(ExecutableIdentifier[] allIdentifiers) {
        this.allIdentifiers = allIdentifiers;
    }

    /**
     * Entry point to execute the current identifier
     *
     * @param executor This the object which is responsible for
     *                 executing each identifier and generate the page content in-order
     */
    public void accept(Executor executor) {
        executor.execute(this);

        while (true) {
            if (!executor.continueExecution()) {
                break;
            }

            try {
                allIdentifiers[executor.getCurrentExecutionIndex()].accept(executor);
            } catch (IndexOutOfBoundsException e) {
                break;
            }
        }
    }

}
