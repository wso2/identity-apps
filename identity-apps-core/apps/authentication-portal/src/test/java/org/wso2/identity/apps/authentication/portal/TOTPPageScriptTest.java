/*
 * Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com).
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
package org.wso2.identity.apps.authentication.portal;

import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

/**
 * Tests script references in TOTP authentication pages.
 */
public class TOTPPageScriptTest {

    private static final Path WEBAPP_DIR = Paths.get("src", "main", "webapp");
    private static final String RELATIVE_SCRIPT_REFERENCE = "<script src=\"js/scripts.js\"></script>";
    private static final String OBSOLETE_ABSOLUTE_SCRIPT_REFERENCE =
            "<script src=\"/totpauthenticationendpoint/js/scripts.js\"></script>";

    @DataProvider(name = "totpPages")
    public Object[][] getTOTPPageNames() {

        return new Object[][]{
                {"totp.jsp"},
                {"totpError.jsp"}
        };
    }

    @Test(dataProvider = "totpPages")
    public void testTOTPPagesUseRelativeScriptReference(String pageName) throws IOException {

        String pageContent = Files.readString(WEBAPP_DIR.resolve(pageName), StandardCharsets.UTF_8);

        assertTrue(pageContent.contains(RELATIVE_SCRIPT_REFERENCE),
                pageName + " should retain the relative scripts.js reference.");
        assertFalse(pageContent.contains(OBSOLETE_ABSOLUTE_SCRIPT_REFERENCE),
                pageName + " should not request the obsolete absolute TOTP scripts.js endpoint.");
    }
}
