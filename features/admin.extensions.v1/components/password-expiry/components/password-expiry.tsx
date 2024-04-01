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

import { Field } from "@wso2is/form/src";
import React, { ReactElement } from "react";
import { TFunction } from "react-i18next";
import {
    GovernanceConnectorConstants
} from "../../../../admin.server-configurations.v1/constants/governance-connector-constants";

export const generatePasswordExpiry = (
    componentId: string,
    passwordExpiryEnabled: boolean,
    setPasswordExpiryEnabled: (value: boolean) => void,
    t: TFunction<"translation", undefined>,
    isReadOnly: boolean = false
): ReactElement => {
    return (
        <>
            <h5>{ t("extensions:manage.serverConfigurations.passwordExpiry.heading") }</h5>
            <div className="criteria">
                <Field.Checkbox
                    ariaLabel="Enable/Disable Password Expiry"
                    name="passwordExpiryEnabled"
                    label={ t("extensions:manage.serverConfigurations.passwordExpiry.label") }
                    required={ false }
                    disabled={ false }
                    listen={ (value: boolean) => {
                        setPasswordExpiryEnabled(value);
                    } }
                    width={ 16 }
                    data-testid={ `${ componentId }-password-expiry-toggle` }
                    readOnly={ isReadOnly }
                />
                <Field.Input
                    ariaLabel="Password Expiry Time"
                    inputType="number"
                    name="passwordExpiryTime"
                    width={ 2 }
                    required={ true }
                    hidden={ false }
                    placeholder="30"
                    min={
                        GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE
                    }
                    maxLength={
                        GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ isReadOnly }
                    disabled={ !passwordExpiryEnabled }
                    data-testid={ `${ componentId }-password-expiry-time` }
                    validation={ (value: string): string | undefined => {
                        const numValue: number = parseInt(value);

                        if (numValue < 1) {
                            return t("common:minValidation", { min: 1 });
                        }
                    } }
                />
                <label>{ t("extensions:manage.serverConfigurations.passwordExpiry.timeFormat") }</label>
            </div>
        </>
    );
};
