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

import set from "lodash-es/set";
import { MutableRefObject, useRef } from "react";
import { getIdentityVerificationProvidersList } from "../api/identity-verification-provider";
import {
    IdVPListResponseInterface,
    IdentityVerificationProviderInterface
} from "../models/identity-verification-providers";

/**
 * Interface for duplicate application list cache.
 */
interface DuplicateIdVPListCache {
    /**
     * Application list response for recently searched application name.
     */
    idVPList: IdVPListResponseInterface;
    /**
     * Recently searched application name.
     */
    idVPName: string;
}

/**
 * Hook to generate a unique application name.
 *
 * @returns The function to generate unique application names.
 */
const useUniqueIdVPName = (): {
    generateUniqueName: (
        initialName: string,
        formValues: Record<string, unknown>,
        fieldName: string
    ) => Promise<void>
} => {
    const duplicateListCache: MutableRefObject<DuplicateIdVPListCache> =
        useRef<DuplicateIdVPListCache>(null);

    /**
     * Generate the next unique name by appending 1-based index number to the provided initial value.
     *
     * @param initialName - Initial value for the IdVP name.
     * @returns A unique name from the provided list of names.
     */
    const generateUniqueName = async (
        initialName: string,
        formValues: Record<string, unknown>,
        fieldName: string
    ): Promise<void> => {
        let idVPName: string = initialName?.trim();
        let possibleListOfDuplicates: IdVPListResponseInterface =
            duplicateListCache?.current?.idVPList;

        if (duplicateListCache?.current?.idVPName !== idVPName) {
            possibleListOfDuplicates = await getIdentityVerificationProvidersList(null, null);
            duplicateListCache.current = {
                idVPList: possibleListOfDuplicates,
                idVPName
            };
        }

        if (possibleListOfDuplicates?.totalResults > 0) {
            const nameList: string[] = possibleListOfDuplicates?.identityVerificationProviders
                ?.map((item: IdentityVerificationProviderInterface) => item?.name);

            for (let i: number = 2; ; i++) {
                if (!nameList?.includes(idVPName)) {
                    break;
                }

                idVPName = initialName + " " +  i;
            }
        }

        set(formValues, fieldName, idVPName);
    };

    return { generateUniqueName };
};

export default useUniqueIdVPName;
