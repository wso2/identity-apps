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

package org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers;

import org.wso2.identity.apps.taglibs.layout.controller.compiler.CompilerException;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ComponentIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ConditionIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.DataIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.DefaultIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.NoIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.NotConditionIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.resolvers.FileResolver;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.resolvers.Resolver;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The default parser, use to compile the layout file
 */
public class DefaultParser implements Parser {

    private final Pattern pattern = Pattern.compile(
            "\\{\\{([-_a-zA-Z0-9]+)\\}\\}|"
                    + "\\{\\{\\{([-_a-zA-Z0-9]+)\\}\\}\\}|"
                    + "\\{\\{#([-_a-zA-Z0-9]+)\\}\\}|"
                    + "\\{\\{/([-_a-zA-Z0-9]+)\\}\\}|"
                    + "\\{\\{\\^([-_a-zA-Z0-9]+)\\}\\}"
    );
    private Resolver resolver;

    /**
     * The inner class, use to keep the data required to compiling process
     */
    private static class CompileContext {
        String line = "";
        Matcher matcher = null;
        int start = 0;
        StringBuilder textKeeper = null;
    }

    /**
     * Constructor
     */
    public DefaultParser() {
        resolver = new FileResolver();
    }

    /**
     * Constructor
     *
     * @param resolver File resolver to read the layout file
     */
    public DefaultParser(Resolver resolver) {
        this.resolver = resolver;
    }

    /**
     * Execute the layout file and create a compiled layout file as a object
     *
     * @param file File path for the layout as an URL object
     * @return Compiled layout file
     */
    @Override
    public ExecutableIdentifier compile(URL file) {
        BufferedReader reader = (BufferedReader) resolver.getReader(file);

        CompileContext context = new CompileContext();
        ExecutableIdentifier temp = compile(reader, context, null);
        resolver.closeResources();
        return temp;
    }

    /**
     * Recursive compiling fucntion to compile the layout file
     *
     * @param reader         BufferedReader to read the layout file
     * @param context        Compiling context
     * @param identifierName Name of the recently identified block identifier
     *                       (Ex:- ConditionIdentifier, NotConditionIdentifier)
     * @return Compiled layout file or block of identifiers
     */
    private ExecutableIdentifier compile(BufferedReader reader, CompileContext context, String identifierName) {
        ArrayList<ExecutableIdentifier> allIdentifiers = new ArrayList<ExecutableIdentifier>();
        String currentIdentifierName;

        while (readLine(reader, context)) {
            if (context.matcher == null) {
                context.matcher = pattern.matcher(context.line);
            }

            if (context.matcher.find(context.start)) {
                if ((currentIdentifierName = context.matcher.group(1)) != null) {
                    if (context.textKeeper != null) {
                        allIdentifiers.add(
                                new DataIdentifier(
                                        currentIdentifierName,
                                        context.textKeeper.toString()
                                                + context.line.substring(context.start, context.matcher.start())
                                )
                        );
                        context.textKeeper = null;
                    } else {
                        allIdentifiers.add(
                                new DataIdentifier(
                                        currentIdentifierName,
                                        context.line.substring(context.start, context.matcher.start())
                                )
                        );
                    }
                    context.start = context.matcher.end();
                } else if ((currentIdentifierName = context.matcher.group(2)) != null) {
                    if (context.textKeeper != null) {
                        allIdentifiers.add(
                                new ComponentIdentifier(
                                        currentIdentifierName,
                                        context.textKeeper.toString()
                                                + context.line.substring(context.start, context.matcher.start())
                                )
                        );
                        context.textKeeper = null;
                    } else {
                        allIdentifiers.add(
                                new ComponentIdentifier(
                                        currentIdentifierName,
                                        context.line.substring(context.start, context.matcher.start())
                                )
                        );
                    }
                    context.start = context.matcher.end();
                } else if ((currentIdentifierName = context.matcher.group(3)) != null) {
                    ConditionIdentifier condition;
                    if (context.textKeeper != null) {
                        condition = new ConditionIdentifier(
                                currentIdentifierName,
                                context.textKeeper.toString()
                                        + context.line.substring(context.start, context.matcher.start())
                        );
                        context.textKeeper = null;
                    } else {
                        condition = new ConditionIdentifier(
                                currentIdentifierName,
                                context.line.substring(context.start, context.matcher.start())
                        );
                    }
                    context.start = context.matcher.end();
                    ExecutableIdentifier child = compile(reader, context, currentIdentifierName);
                    condition.setChild(child);
                    allIdentifiers.add(condition);
                } else if ((currentIdentifierName = context.matcher.group(4)) != null) {
                    if (!identifierName.trim().equals(currentIdentifierName.trim())) {
                        throw new IllegalStateException(
                                "Layout file is not correctly written,"
                                        + " make sure to place closing tags in correct place: "
                                        + currentIdentifierName
                        );
                    }
                    if (context.textKeeper != null) {
                        allIdentifiers.add(
                                new NoIdentifier(
                                        context.textKeeper.toString()
                                                + context.line.substring(context.start, context.matcher.start())
                                )
                        );
                        context.textKeeper = null;
                    } else {
                        allIdentifiers.add(
                                new NoIdentifier(
                                        context.line.substring(context.start, context.matcher.start())
                                )
                        );
                    }
                    context.start = context.matcher.end();

                    return createCompiledObject(allIdentifiers);
                } else if ((currentIdentifierName = context.matcher.group(5)) != null) {
                    NotConditionIdentifier notCondition;
                    if (context.textKeeper != null) {
                        notCondition = new NotConditionIdentifier(
                                currentIdentifierName,
                                context.textKeeper.toString()
                                        + context.line.substring(context.start, context.matcher.start()
                                )
                        );
                        context.textKeeper = null;
                    } else {
                        notCondition = new NotConditionIdentifier(
                                currentIdentifierName,
                                context.line.substring(context.start, context.matcher.start())
                        );
                    }
                    context.start = context.matcher.end();
                    ExecutableIdentifier child = compile(reader, context, currentIdentifierName);
                    notCondition.setChild(child);
                    allIdentifiers.add(notCondition);
                }
            } else {
                if (context.textKeeper == null) {
                    context.textKeeper = new StringBuilder(context.line.substring(context.start) + "\n");
                } else {
                    context.textKeeper.append(context.line.substring(context.start) + "\n");
                }
                context.line = "";
                context.matcher = null;
                context.start = 0;
            }
        }

        if (identifierName != null) {
            throw new IllegalStateException(
                    "Layout file is not correctly written, make sure to place closing tags in correct place"
            );
        }

        if (context.textKeeper != null) {
            allIdentifiers.add(new NoIdentifier(context.textKeeper.toString()));
        }

        return createCompiledObject(allIdentifiers);
    }

    /**
     * Create the final compiled version of the layout file
     *
     * @param allIdentifiers Array of identifiers
     * @return All identifiers as a single object
     */
    private ExecutableIdentifier createCompiledObject(ArrayList<ExecutableIdentifier> allIdentifiers) {
        return new DefaultIdentifier(allIdentifiers);
    }

    /**
     * Read a new line from the layout file
     *
     * @param reader  BufferedReader to read the layout file
     * @param context Compiling context
     * @return Whether is there new line to read
     */
    private boolean readLine(BufferedReader reader, CompileContext context) {
        if (context.line.equals("")) {
            try {
                context.line = reader.readLine();
            } catch (IOException e) {
                throw new CompilerException("Can't read the file", e);
            }
        }

        if (context.line == null) {
            return false;
        }

        return true;
    }

}
