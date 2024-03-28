/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

/**
 * Fetches the theme variables for the given theme.
 * 
 * @param themeName - Name of the theme.
 * 
 * @returns Theme variables. 
 */
export const getThemeVariables = (themeName: string): Promise<Record<string, string>> =>  {

    return new Promise((resolve: (value: Record<string, string>) => void, reject: (reason?: Error) => void) => {
        import(`../../../themes/${ themeName }/theme-variables.json`)
            .then((response: Record<string, string>) => {
                resolve(response);
            }).catch((error: Error) => {
                reject(error);
            });
    });
};
