/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { I18n } from "@wso2is/i18n";
import { FormValidation } from "@wso2is/validation";
import { IdentityVerificationProviderInterface } from "../models";

/**
 * Performs required, invalid and duplicate validations for IDVP name.
 *
 * @param value - IDVP name.
 * @param idvpList - List of already available IDVPs.
 * @param currentIDVP - The current IDVP
 * @returns Validation error message.
 */
export const validateIDVPName = (
    value: string,
    idvpList: IdentityVerificationProviderInterface[],
    currentIDVP?: IdentityVerificationProviderInterface
): string => {

    if (!value) {
        return I18n.instance.t("idvp:forms.generalDetails.name.validations.required");
    }
    if (!FormValidation.isValidResourceName(value)) {
        return I18n.instance.t("idvp:forms.generalDetails.name.validations.invalid",
            { idpName: value });
    }

    if (isIDVPNameAlreadyTaken(value, idvpList, currentIDVP)) {
        return I18n.instance.t("idvp:forms.generalDetails.name.validations.duplicate");
    }

    return;
};

/**
 * Checks if the given IDVP name is already taken.
 *
 * @param value - IDVP name.
 * @param idvpList - List of already existing IDVPs.
 * @param currentIDVP - The current IDVP
 * @returns Whether the IDVP name is already taken.
 */
const isIDVPNameAlreadyTaken = (
    value: string,
    idvpList: IdentityVerificationProviderInterface[],
    currentIDVP?: IdentityVerificationProviderInterface
):boolean => {

    if (!idvpList) {
        return false;
    }

    const existingIDVP: IdentityVerificationProviderInterface = idvpList.find(
        (idvp: IdentityVerificationProviderInterface) => {
            if (currentIDVP) {
                // Current IDVP is available on edit IDVP scenario. In that case, we need to skip the
                // current IDVP name when validating the name
                return idvp.Name === value && currentIDVP.Name !== value;
            }

            return idvp.Name === value;
        }
    );

    return !!existingIDVP;
};
