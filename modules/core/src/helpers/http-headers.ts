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

import { AcceptHeaderValues, ContentTypeHeaderValues } from "../models";

/**
 * Generates a generic HTTP request header.
 * This function will generate a generic HTTP request header. `clientHost`
 * can be passed in if cross origin header has to be added. And the function
 * will use `"Accept": "application/json"` and `"Content-Type": "application/json"`
 * by default. These can be configured by passing in the relevant values.
 *
 * @param {string} clientHost - Client Host URL.
 * @param {string} accept - Accept type.
 * @param {string} contentType - Content type.
 * @return {object} Moderated HTTP request headers object.
 */
export const HTTPRequestHeaders = (clientHost: string,
                                   accept: string = AcceptHeaderValues.APP_JSON,
                                   contentType: string = ContentTypeHeaderValues.APP_JSON): object => {

    const headers = {
        "Accept": accept,
        "Access-Control-Allow-Origin": clientHost,
        "Content-Type": contentType
    };

    // drop any attributes with `undefined` or `null` values.
    return Object.keys(headers).reduce((acc, key) =>
        (
            (headers[ key ] === undefined || headers[ key ] === null)
                ? acc
                : {
                    ...acc,
                    [ key ]: headers[ key ]
                }
        ), {});
};
