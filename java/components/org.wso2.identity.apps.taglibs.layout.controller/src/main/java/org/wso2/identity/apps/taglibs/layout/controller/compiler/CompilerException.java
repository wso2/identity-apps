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

package org.wso2.identity.apps.taglibs.layout.controller.compiler;

/**
 * Compiler runtime exception wrapper.
 */
public class CompilerException extends RuntimeException {

    private static final long serialVersionUID = 1088421038552580614L;

    /**
     * Constructor to create the default error.
     */
    public CompilerException() {

        super();
    }

    /**
     * Constructor with custom message.
     *
     * @param message Exception message.
     */
    public CompilerException(String message) {

        super(message);
    }

    /**
     * Constructor with custom message and throwable object.
     *
     * @param message Exception message.
     * @param throwable Throwable object.
     */
    public CompilerException(String message, Throwable throwable) {

        super(message, throwable);
    }

    /**
     * Constructor with custom throwable object.
     * 
     * @param throwable Throwable object.
     */
    public CompilerException(Throwable throwable) {

        super(throwable);
    }

    /**
     * Constructor with custom exception.
     *
     * @param e Exception object.
     */
    public CompilerException(Exception e) {

        super(e);
    }
}
