/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com).
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { ProfileConstants } from "@wso2is/core/constants";
import { ProfileConfig } from "./models";

export const profileConfig: ProfileConfig = {
    attributes: {
        getRegExpValidationError: (attribute: string) => {
            if (attribute === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")
            ){
                return "myAccount:components.profile.forms.mobileChangeForm." +
                    "inputs.mobile.validations.invalidFormat";
            }
        }
    }
};
