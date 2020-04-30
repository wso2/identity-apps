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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import axios from "axios";
import { HelpPanelConstants } from "../constants";
import { parsePortalDocumentationStructureYAML } from "../helpers";
import { HttpMethods, PortalDocumentationStructureInterface } from "../models";
import { store } from "../store";

/**
 * Gets the document structure for `Admin Portal`, defined in the `mkdocs.yml`
 * file from the `wso2/docs-is` repo.
 * @see {@link https://github.com/wso2/docs-is/blob/master/en/mkdocs.yml}
 *
 * @return {Promise<PortalDocumentationStructureInterface>} A promise containing the response.
 */
export const getPortalDocumentationStructure = (): Promise<PortalDocumentationStructureInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/vnd.github.v3.raw"
        },
        method: HttpMethods.GET,
        params: {
            ref: HelpPanelConstants.PORTAL_DOCUMENTATION_BRANCH
        },
        url: store.getState().config.endpoints.portalDocumentationStructure
    };

    return axios.request(requestConfig)
        .then((response) => {
            return Promise.resolve(parsePortalDocumentationStructureYAML(response.data));
        }).catch((error) => {
            throw new IdentityAppsApiException(
                HelpPanelConstants.PORTAL_DOCUMENTATION_STRUCTURE_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the raw content from Github consuming content endpoint.
 *
 * @return {Promise<T>} A promise containing the response.
 */
export const getRawDocumentation = <T = {}>(path: string): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/vnd.github.v3.raw"
        },
        method: HttpMethods.GET,
        params: {
            ref: HelpPanelConstants.PORTAL_DOCUMENTATION_BRANCH
        },
        url: `${ store.getState().config.endpoints.portalDocumentationRawContent }/${ path }`
    };

    return axios.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        }).catch((error) => {
            throw new IdentityAppsApiException(
                HelpPanelConstants.PORTAL_DOCUMENTATION_RAW_CONTENT_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
