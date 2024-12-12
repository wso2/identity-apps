/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationListInterface, ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import set from "lodash-es/set";
import { MutableRefObject, useRef } from "react";

/**
 * Interface for duplicate application list cache.
 */
interface DuplicateApplicationListCache {
    /**
     * Application list response for recently searched application name.
     */
    appList: ApplicationListInterface;
    /**
     * Recently searched application name.
     */
    appName: string;
}

/**
 * Hook to generate a unique application name.
 *
 * @returns The function to generate unique application names.
 */
const useUniqueApplicationName = (): {
    generateUniqueApplicationName: (
        initialApplicationName: string,
        formValues: Record<string, unknown>,
        fieldName: string
    ) => Promise<void>
} => {
    const duplicateApplicationListCache: MutableRefObject<DuplicateApplicationListCache> =
        useRef<DuplicateApplicationListCache>(null);

    /**
     * Generate the next unique name by appending 1-based index number to the provided initial value.
     *
     * @param initialApplicationName - Initial value for the Application name.
     * @returns A unique name from the provided list of names.
     */
    const generateUniqueApplicationName = async (
        initialApplicationName: string,
        formValues: Record<string, unknown>,
        fieldName: string
    ): Promise<void> => {

        let appName: string = initialApplicationName?.trim();
        let possibleListOfDuplicateApplications: ApplicationListInterface =
            duplicateApplicationListCache?.current?.appList;

        if (duplicateApplicationListCache?.current?.appName !== appName) {
            possibleListOfDuplicateApplications = await getApplicationList(null, null, "name sw " + appName);
            duplicateApplicationListCache.current = {
                appList: possibleListOfDuplicateApplications,
                appName
            };
        }

        if (possibleListOfDuplicateApplications?.totalResults > 0) {
            const applicationNameList: string[] = possibleListOfDuplicateApplications?.applications?.map(
                (item: ApplicationListItemInterface) => item?.name);

            for (let i: number = 2; ; i++) {
                if (!applicationNameList?.includes(appName)) {
                    break;
                }

                appName = initialApplicationName + " " +  i;
            }
        }

        set(formValues, fieldName, appName);
    };

    return { generateUniqueApplicationName };
};

export default useUniqueApplicationName;
