/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 */

import axios from "axios";
import { DocumentationConstants } from "../constants";
import { IdentityAppsApiException } from "../exceptions";
import { parsePortalDocumentationStructureYAML } from "../helpers";
import { DocumentationProviders, DocumentationStructureFileTypes, HttpMethods } from "../models";
import { StringUtils } from "../utils";

/**
 * Gets the document structure for `Developer Portal`, defined in the `mkdocs.yml`.
 * If the provider is "GITHUB", the function will use the necessary headers and params,
 * required by the GITHUB content API.
 * @see {@link https://github.com/wso2/docs-is/blob/master/en/mkdocs.yml}
 *
 * @param {string} url - URL to retrieve the structure from.
 * @param {DocumentationStructureFileTypes} fileType - Type of the structure file.
 * @param {DocumentationProviders} provider - Doc content provider.
 * @param {string} branch - If the provider is `GITHUB`, the branch to be used for fetching.
 *
 * @return {Promise<T>} A promise containing the response.
 */
export const getPortalDocumentationStructure = <T = {}>(
    url: string,
    fileType: DocumentationStructureFileTypes = DocumentationStructureFileTypes.YAML,
    provider: DocumentationProviders = DocumentationProviders.GITHUB,
    branch: string): Promise<T> => {

    let headers: object = {};
    let params: object = {};

    if (provider === DocumentationProviders.GITHUB) {
        headers = {
            "Accept": "application/vnd.github.v3.raw"
        };

        params = {
            ref: branch
        };
    }

    const requestConfig = {
        headers,
        method: HttpMethods.GET,
        params,
        url
    };

    return axios.request(requestConfig)
        .then((response) => {
            let structure = response.data;

            if (fileType === DocumentationStructureFileTypes.YAML) {
                structure = parsePortalDocumentationStructureYAML<T>(response.data)
            }

            return Promise.resolve(structure);
        }).catch((error) => {
            throw new IdentityAppsApiException(
                DocumentationConstants.STRUCTURE_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the raw documentation content.
 * If the provider is "GITHUB", the function will use the necessary headers and params,
 * required by the GITHUB content API.
 *
 * @param {string} baseURL - Base URL to retrieve the content from.
 * @param {string} relativePath - Relative path to the actual content.
 * @param {DocumentationProviders} provider - Doc content provider.
 * @param {string} branch - If the provider is `GITHUB`, the branch to be used for fetching.
 *
 * @return {Promise<T>} A promise containing the response.
 */
export const getRawDocumentation = <T = {}>(
    baseURL: string,
    relativePath: string,
    provider: DocumentationProviders = DocumentationProviders.GITHUB,
    branch: string): Promise<T> => {

    let headers: object = {};
    let params: object = {};

    if (provider === DocumentationProviders.GITHUB) {
        headers = {
            "Accept": "application/vnd.github.v3.raw"
        };

        params = {
            ref: branch
        };
    }

    const requestConfig = {
        headers,
        method: HttpMethods.GET,
        params,
        url: StringUtils.removeSlashesFromPath(baseURL, false, true) + "/"
            + StringUtils.removeDotsAndSlashesFromRelativePath(relativePath)
    };

    return axios.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        }).catch((error) => {
            throw new IdentityAppsApiException(
                DocumentationConstants.RAW_CONTENT_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
