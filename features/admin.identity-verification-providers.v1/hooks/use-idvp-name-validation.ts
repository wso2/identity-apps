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

import debounce, { DebouncedFunc } from "lodash-es/debounce";
import { MutableRefObject, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIdentityVerificationProvidersList } from "../api/identity-verification-provider";
import {
    IdVPListResponseInterface,
    IdentityVerificationProviderInterface
} from "../models/identity-verification-providers";

/**
 * Hook for validate the IdVP name.
 *
 * @returns The IdVP name validation function.
 */
const useIdVPNameValidation = (): {
    validateName: (name: string, id: string) => Promise<string | null>
} => {
    const { t } = useTranslation();

    const previouslyValidatedName: MutableRefObject<string> = useRef(null);
    const [ isNameAlreadyReserved, setIsNameAlreadyReserved ] = useState<boolean>(false);

    /**
     * Check if there is any IdVP with the given name.
     *
     * @param name - Name to be searched.
     * @param id - Id of the editing IdVP.
     */
    const isNameAlreadyExist: DebouncedFunc<(name: string, id: string) => Promise<void>> = debounce(
        async (name: string, id: string) => {
            if (previouslyValidatedName?.current !== name) {
                previouslyValidatedName.current = name;

                const response: IdVPListResponseInterface = await getIdentityVerificationProvidersList(null, null);

                const existingIdVP: IdentityVerificationProviderInterface = response?.identityVerificationProviders
                    ?.find((
                        idVP: IdentityVerificationProviderInterface
                    ) => idVP.name.toLocaleLowerCase() === name.toLocaleLowerCase());

                setIsNameAlreadyReserved(existingIdVP && existingIdVP?.id !== id);
            }
        },
        600
    );

    /**
     * Checks whether the IdVP name is valid.
     *
     * @param name - The value need to be validated.
     * @returns Whether the provided value is a valid or not.
     */
    const validateIdVPName = async (name: string, id: string): Promise<string | null> => {
        await isNameAlreadyExist(name, id);

        if (isNameAlreadyReserved) {
            return t("applications:forms.generalDetails.fields.name.validations.duplicate");
        }

        return null;
    };

    return {
        validateName: validateIdVPName
    };
};

export default useIdVPNameValidation;
