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

package org.wso2.identity.apps.taglibs.layout.controller.compiler.resolvers;

import org.wso2.identity.apps.taglibs.layout.controller.compiler.CompilerException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;

/**
 * File resolver implementation for both local and remote files
 */
public class FileResolver implements Resolver {

    private InputStream inputStream = null;
    private InputStreamReader streamReader = null;
    private BufferedReader reader = null;

    /**
     * Get the reader to read the layout file
     *
     * @param file Layout file path as an URL object
     * @return Reader to read the layout file
     */
    @Override
    public Reader getReader(URL file) {
        if (file == null) {
            throw new CompilerException("Can't find the given file");
        }

        try {
            inputStream = file.openStream();
            streamReader = new InputStreamReader(inputStream, "UTF-8");
            reader = new BufferedReader(streamReader);
        } catch (Exception e) {
            throw new CompilerException("Can't initialize a reader for the given file", e);
        }

        return reader;
    }

    /**
     * Close resources related to the reader
     */
    @Override
    public void closeResources() {
        try {
            if (reader != null) {
                reader.close();
            }
            if (streamReader != null) {
                streamReader.close();
            }
            if (inputStream != null) {
                inputStream.close();
            }
        } catch (IOException e) {
            throw new CompilerException("Can't close the reader", e);
        }
    }

}
