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
    ProjectConfiguration,
    Tree,
    applyChangesToString,
    convertNxGenerator,
    formatFiles,
    generateFiles,
    getProjects,
    joinPathFragments,
    logger,
    names
} from "@nrwl/devkit";
import { runTasksInSerial } from "@nrwl/workspace/src/utilities/run-tasks-in-serial";
import * as ts from "typescript";
import { SourceFile } from "typescript";
import { Schema } from "./schema";
import { addImport } from "../../../utils";

/**
 * Interface extending the schema with the properties that are needed for the component generator.
 */
interface NormalizedSchema extends Schema {
    /**
     * The path to the project's source root.
     */
    projectSourceRoot: string;
    /**
     * File name.
     */
    fileName: string;
    /**
     * Class name.
     */
    className: string;
}

/**
 * Create the component files, adds the exports to the barrel, and formats the files.
 *
 * @param host - The host is the tree that the schematic is operating on.
 * @param schema - The schema object that was passed to the schematic.
 * @returns A function that takes a host and a schema and returns a promise that resolves to an array
 * of generator callbacks.
 */
export const componentGenerator = async (host: Tree, schema: Schema): Promise<GeneratorCallback> => {
    const options = await normalizeOptions(host, schema);

    createComponentFiles(host, options);

    const tasks: GeneratorCallback[] = [];

    addExportsToBarrel(host, options);

    await formatFiles(host);

    return runTasksInSerial(...tasks);
};

/**
 * Generates the component files, deletes the ones that aren't needed, and converts the files to
 * JavaScript if the user has selected that option.
 *
 * @param host - Tree - The tree that contains the files that will be generated.
 * @param options - NormalizedSchema
 */
const createComponentFiles = (host: Tree, options: NormalizedSchema): void => {
    const componentDir: string = joinPathFragments(
        options.projectSourceRoot,
        options.directory
    );

    generateFiles(host, joinPathFragments(__dirname, "./files"), componentDir, {
        ...options,
        tmpl: ""
    });

    for (const changes of host.listChanges()) {
        const deleteFile: boolean = false;

        if (deleteFile) {
            host.delete(changes.path);
        }
    }
};

/**
 * Adds an export statement to the index file of the project.
 *
 * @param host - Tree - The tree that contains the files that will be modified.
 * @param options - NormalizedSchema
 */
const addExportsToBarrel = (host: Tree, options: NormalizedSchema): void => {
    const workspace: Map<string, ProjectConfiguration> = getProjects(host);
    const isApp: boolean = workspace.get(options.project).projectType === "application";

    if (options.export && !isApp) {
        const indexFilePath: string = joinPathFragments(
            options.projectSourceRoot,
            "index.ts"
        );
        const indexSource: string | null = host.read(indexFilePath, "utf-8");

        if (indexSource !== null) {
            const indexSourceFile: SourceFile = ts.createSourceFile(
                indexFilePath,
                indexSource,
                ts.ScriptTarget.Latest,
                true
            );
            const changes: string = applyChangesToString(
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

/**
 * Takes the options passed to the schematic and normalizes them.
 *
 * @param host - Tree
 * @param options - Schema - This is the options object that we pass to the schematic.
 * @returns - options
 *     - className
 *     - directory
 *     - fileName
 *     - hasStyles
 *     - projectSourceRoot
 *     - styledModule
 */
const normalizeOptions = async (host: Tree, options: Schema): Promise<NormalizedSchema> => {
    assertValidOptions(options);

    const { className, fileName } = names(options.name);
    const componentFileName: string = options.fileName ?? fileName;
    const project: ProjectConfiguration = getProjects(host).get(options.project);

    if (!project) {
        logger.error(
            `Cannot find the ${options.project} project. Please double check the project name.`
        );
        throw new Error();
    }

    const { sourceRoot: projectSourceRoot, projectType } = project;

    const directory = await getDirectory(host, options);

    if (options.export && projectType === "application") {
        logger.warn(
            "The \"--export\" option should not be used with applications and will do nothing."
        );
    }

    return {
        ...options,
        className,
        directory,
        fileName: componentFileName,
        projectSourceRoot
    };
};

/**
 * Returns the directory where the new component will be created.
 *
 * @param host - Tree - The tree that contains the files that will be generated.
 * @param options - Schema - This is the options object that is passed to the schematic.
 * @returns The directory where the component will be created.
 */
const getDirectory = (host: Tree, options: Schema): string => {
    const { fileName }  = names(options.name);
    const workspace: Map<string, ProjectConfiguration> = getProjects(host);
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

/**
 * Checks if the user has entered a slash in the component name and if so, it throws an error.
 *
 * @param options - Schema - this is the options object that is passed to the schematic.
 */
const assertValidOptions = (options: Schema): void => {
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
