/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

const path = require('path');
const fs = require('fs-extra');
const XmlParser = require('fast-xml-parser');
const { execSync } = require('child_process');

const packageJson =  path.join(__dirname, "..", "package.json");
const pomXml = path.join(__dirname, "..", "pom.xml");

const getProjectVersion = function() {
    const fileContent = fs.readFileSync(pomXml);
    const pom = XmlParser.parse(fileContent.toString());

    return pom.project.version.replace("-SNAPSHOT", "");
};

let packageJsonContent = require(packageJson);
packageJsonContent.version = getProjectVersion();

fs.writeFileSync(packageJson, JSON.stringify(packageJsonContent, null, 4)+"\n");

execSync("npx lerna version " + getProjectVersion() + " --yes --no-git-tag-version",
    { cwd: path.join(__dirname, "..") }
);

console.log("update packages version to " + getProjectVersion());
