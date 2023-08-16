/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
