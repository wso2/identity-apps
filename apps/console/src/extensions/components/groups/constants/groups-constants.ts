/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AppConstants } from "apps/console/src/features/core";

/**
 * Class containing Groups constants.
 */
export class GroupsConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly APPLICATION_RESOURCE_DIR: string = "applications";

    /**
     * Get the paths necessary for the groups page.
     *
     * @returns `Map<string, string>`
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("APPLICATIONS", `${ AppConstants.getDeveloperViewBasePath() }/` + `${this.APPLICATION_RESOURCE_DIR}`);
    }
}
