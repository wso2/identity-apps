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

package org.wso2.identity.apps.login.portal.layout;

import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.DefaultParser;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.Parser;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.ObjectOutputStream;

/**
 * This class will be used to compile the layouts.
 */
public class LayoutCompiler {

    /**
     * This method will compile the layout files and result will be written to a separate file in the same directory.
     * This method will expect one argument -> Path to the layouts home directory.
     */
    public static void main(String[] args) {

        String homeDir = args[0];
        Parser parser = new DefaultParser();
        File dir = new File(homeDir);
        try {
            String[] directories = dir.list(new FilenameFilter() {
                @Override
                public boolean accept(File current, String name) {

                    return new File(current, name).isDirectory();
                }
            });
            if (directories == null) {
                return;
            }
            for (String directoryName : directories) {
                String layoutDirPath = homeDir + "/" + directoryName + "/";
                ExecutableIdentifier compiledLayout =
                        parser.compile(new File(layoutDirPath + "body.html").toURI().toURL());
                try (FileOutputStream compiledLayoutFile = new FileOutputStream(layoutDirPath + "body.ser");
                    ObjectOutputStream out = new ObjectOutputStream(compiledLayoutFile)) {
                    out.writeObject(compiledLayout);
                } catch (IOException | ClassNotFoundException e) {
                    throw new RuntimeException("Can't serialized the compiled layout: " + directoryName, e);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Can't compile the layouts", e);
        }
    }
}
