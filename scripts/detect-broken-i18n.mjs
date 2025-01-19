/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Project, SyntaxKind } from "ts-morph";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); 

const i18nEnUsLangBundlePath = path.resolve(__dirname, "..", "modules", "i18n", "dist", "bundle", "en-US", "portals");

// Folder path to analyze
const folderPath = "features/admin.groups.v1"; // Change this to your folder path

// Initialize a ts-morph Project
const project = new Project();

// Function to recursively collect .ts files from a folder
const getTSFiles = (dir) => {
    let results = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (file === "node_modules") {
                return; // Skip the node_modules folder
            }
            results = results.concat(getTSFiles(filePath));
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            results.push(filePath);
        }
    });

    return results;
};

const getValueAtPath = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  };
  
  // Function to dynamically import the file
  const dynamicImport = async (namespace) => {
    try {
      // Read all files in the directory
      const files = fs.readdirSync(i18nEnUsLangBundlePath);
  
      // Find the file matching the namespace
      const matchedFile = files.find((file) =>
        file.startsWith(`${namespace}.`) && file.endsWith(".json")
      );
  
      if (!matchedFile) {
        throw new Error(`File for namespace "${namespace}" not found.`);
      }
  
      // Build the full path to the file
      const filePath = path.resolve(i18nEnUsLangBundlePath, matchedFile);
  
      // Dynamically import the JSON file
      const importedData = await import(filePath, {
        assert: { type: "json" },
      });
  
      return importedData.default || importedData;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return null;
    }
  };
  

// Add files to the project
const tsFiles = getTSFiles(folderPath);

tsFiles.forEach((file) => project.addSourceFileAtPath(file));

// Analyze the files
tsFiles.forEach((filePath) => {
    const sourceFile = project.getSourceFileOrThrow(filePath);
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

    calls.forEach(async (call) => {
        const expression = call.getExpression();

        if (expression.getText() === "t") {
            const args = call.getArguments();

            if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
                console.log(`Found t("") call in ${filePath}:`);
                const i18nKey = args[0].getText().replace(/^"|"$/g, "");;

                console.log(`  - Text: ${i18nKey}`);

                const i18nNamespace = i18nKey.split(":")[0];
                const i18nStringPath = i18nKey.split(":")[1];

                console.log(i18nNamespace)

                dynamicImport(i18nNamespace).then(langBundle => {
                  const value = getValueAtPath(langBundle, i18nStringPath)
                
                  if(!value) {
                    console.error("Broken i18n key found: " + i18nKey)
                  }
                })
            }
        }
    });
});
