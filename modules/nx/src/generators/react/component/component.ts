/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    GeneratorCallback,
    Tree,
    applyChangesToString,
    convertNxGenerator,
    formatFiles,
    generateFiles,
    getProjects,
    joinPathFragments,
    logger,
    names,
    toJS
} from "@nrwl/devkit";
import { runTasksInSerial } from "@nrwl/workspace/src/utilities/run-tasks-in-serial";
import * as ts from "typescript";
import { Schema } from "./schema";
import { addImport } from "../../../utils/ast-utils";

interface NormalizedSchema extends Schema {
    projectSourceRoot: string;
    fileName: string;
    className: string;
    styledModule: null | string;
    hasStyles: boolean;
}

export const componentGenerator = async (host: Tree, schema: Schema): Promise<GeneratorCallback> => {
    const options = await normalizeOptions(host, schema);

    createComponentFiles(host, options);

    const tasks: GeneratorCallback[] = [];

    addExportsToBarrel(host, options);

    await formatFiles(host);

    return runTasksInSerial(...tasks);
};

const createComponentFiles = (host: Tree, options: NormalizedSchema): void => {

    const componentDir = joinPathFragments(
        options.projectSourceRoot,
        options.directory
    );

    generateFiles(host, joinPathFragments(__dirname, "./files"), componentDir, {
        ...options,
        tmpl: ""
    });

    for (const c of host.listChanges()) {
        let deleteFile = false;

        if (options.skipTests && /.*spec.tsx/.test(c.path)) {
            deleteFile = true;
        }

        if (
            (options.styledModule || !options.hasStyles) &&
            c.path.endsWith(`.${options.style}`)
        ) {
            deleteFile = true;
        }

        if (options.globalCss && c.path.endsWith(`.module.${options.style}`)) {
            deleteFile = true;
        }

        if (
            !options.globalCss &&
            c.path.endsWith(`${options.fileName}.${options.style}`)
        ) {
            deleteFile = true;
        }

        if (deleteFile) {
            host.delete(c.path);
        }
    }

    if (options.js) {
        toJS(host);
    }
};

const addExportsToBarrel = (host: Tree, options: NormalizedSchema): void => {
    const workspace = getProjects(host);
    const isApp = workspace.get(options.project).projectType === "application";

    if (options.export && !isApp) {
        const indexFilePath = joinPathFragments(
            options.projectSourceRoot,
            options.js ? "index.js" : "index.ts"
        );
        const indexSource = host.read(indexFilePath, "utf-8");

        if (indexSource !== null) {
            const indexSourceFile = ts.createSourceFile(
                indexFilePath,
                indexSource,
                ts.ScriptTarget.Latest,
                true
            );
            const changes = applyChangesToString(
                indexSource,
                addImport(
                    indexSourceFile,
                    `export * from './${options.directory}/${options.fileName}';`
                )
            );

            host.write(indexFilePath, changes);
        }
    }
};

const normalizeOptions = async (host: Tree, options: Schema): Promise<NormalizedSchema> => {

    assertValidOptions(options);

    const { className, fileName } = names(options.name);
    const componentFileName =
        options.fileName ?? (options.pascalCaseFiles ? className : fileName);
    const project = getProjects(host).get(options.project);

    if (!project) {
        logger.error(
            `Cannot find the ${options.project} project. Please double check the project name.`
        );
        throw new Error();
    }

    const { sourceRoot: projectSourceRoot, projectType } = project;

    const directory = await getDirectory(host, options);

    const styledModule = /^(css|scss|less|styl|none)$/.test(options.style)
        ? null
        : options.style;

    if (options.export && projectType === "application") {
        logger.warn(
            "The \"--export\" option should not be used with applications and will do nothing."
        );
    }

    options.classComponent = options.classComponent ?? false;
    options.routing = options.routing ?? false;
    options.globalCss = options.globalCss ?? false;

    return {
        ...options,
        className,
        directory,
        fileName: componentFileName,
        hasStyles: options.style !== "none",
        projectSourceRoot,
        styledModule
    };
};

const getDirectory = (host: Tree, options: Schema): string => {

    const genNames = names(options.name);
    const fileName =
        options.pascalCaseDirectory === true
            ? genNames.className
            : genNames.fileName;
    const workspace = getProjects(host);
    let baseDir: string;

    if (options.directory) {
        baseDir = options.directory;
    } else {
        baseDir =
            workspace.get(options.project).projectType === "application"
                ? "app"
                : "lib";
    }

    return options.flat ? baseDir : joinPathFragments(baseDir, fileName);
};

const assertValidOptions = (options: Schema): void => {

    // assertValidStyle(options.style);

    const slashes = [ "/", "\\" ];

    slashes.forEach(s => {
        if (options.name.indexOf(s) !== -1) {
            const [ name, ...rest ] = options.name.split(s).reverse();
            let suggestion = rest.map(x => x.toLowerCase()).join(s);

            if (options.directory) {
                suggestion = `${options.directory}${s}${suggestion}`;
            }
            throw new Error(
                `Found "${s}" in the component name. Did you mean to use the --directory option (e.g. \`nx g c ${
                    name
                } --directory ${suggestion}\`)?`
            );
        }
    });
};

export default componentGenerator;

export const componentSchematic = convertNxGenerator(componentGenerator);
