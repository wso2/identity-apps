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

/**
 * Utility functions
 */

/**
 * 
 * @param {string} filePath 
 * @returns whether the passed file is a typescript file.
 */
const isTSFile = (filePath) =>  {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx")
}

/**
 * 
 * @param {any} obj - en_US language bundle
 * @param {string} path - path to the value in lang bundle joined with `.`.
 * eg: advancedSearch.form.inputs.filterAttribute.placeholder
 * 
 * @returns the translation for the corresponding path in lang bundle
 */
const getValueAtPath = (obj, path) => {
  return path
      .split('.')
      .map((key) => key.trim()) // Trim keys to avoid whitespace issues
      .reduce((acc, key) => {
          if (!acc || typeof acc !== "object") {
              // console.warn(`Invalid object at "${key}":`, acc);
              return undefined;
          }
          if (!Object.hasOwn(acc, key)) {
              // console.warn(`Key "${key}" not found in:`, acc);
              return undefined;
          }
          return acc[key];
      }, obj);
};

/**
 * 
 * @param {string} namespace
 * 
 * @returns the language bundle for the provided namespace. 
 */
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

/**
 * 
 * @param {any} args - arguments passed to the t("") function
 * 
 * @returns the formatted property access chain to access translation in lang bundle.
 * eg: advancedSearch.form.inputs.filterAttribute.placeholder
 */
const getPropertyAccessChain = async (args) => {
  if(args.length > 0 && args[0].getKind() === SyntaxKind.BinaryExpression) {
    return args[0].getText().replace(/["+]/g, "").replace("\n","").replace(/\s+/g, "").trim()+ " \n";
  }

  if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
    return args[0].getText().replace(/^"|"$/g, "");
  }
}

/* Script logic begins here */

const i18nEnUsLangBundlePath = path.resolve(__dirname, "..", "..", "..", "modules", "i18n", "dist", "bundle", "en-US", "portals");

// get file path as cmd argument.
let filePathsFromArg = process.argv[2]

if (!filePathsFromArg) {
  console.error("Pass a list of file names separated by space")
  process.exit(1);
}

filePathsFromArg = filePathsFromArg.split(" ");

// Initialize a ts-morph Project
const project = new Project();

const brokenI18nErrorMessages = []
const i18nManualReviewFlags = []

for(const relativeFilePath of filePathsFromArg) {
  const filePath = path.resolve(__dirname, "..", "..", "..", relativeFilePath)

  if (!isTSFile(filePath)) {
    console.warn("Invalid file: " + filePath);
    continue;
  }  
  
  project.addSourceFileAtPath(filePath)
  const sourceFile = project.getSourceFileOrThrow(filePath);
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

  for (const call of calls) {
    const expression = call.getExpression();

    if (expression.getText() === "t") {
        console.log(`Found t("") call in ${filePath}:`);

        const args = call.getArguments();
        const i18nKey = await getPropertyAccessChain(args);

        if (!i18nKey) {
            i18nManualReviewFlags.push("Couldn't resolve the i18n usage at " + filePathFromArg + "#L" + call.getStartLineNumber());
            continue; // Use `continue` instead of `return` to skip the current iteration
        }

        console.log(`  - Text: ${i18nKey}\n`);

        const i18nNamespace = i18nKey.split(":")[0];
        const i18nStringPath = i18nKey.split(":")[1];

        // Using async/await for dynamicImport instead of then()
        const langBundle = await dynamicImport(i18nNamespace);
        const value = getValueAtPath(langBundle, i18nStringPath);

        if (!value) {
          brokenI18nErrorMessages.push("Broken i18n key: " + i18nKey + " at " + filePath);
        }
    }
  }
}

for(const warning of i18nManualReviewFlags) {
  console.warn(warning)
}

if (brokenI18nErrorMessages.length > 0) {
  for(const error of brokenI18nErrorMessages) {
    console.error(error)
  }
  process.exit(1)
}
