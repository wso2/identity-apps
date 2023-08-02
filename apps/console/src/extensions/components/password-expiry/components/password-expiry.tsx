/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Field } from "@wso2is/form/src";
import React, { ReactElement } from "react";
import { TFunction } from "react-i18next";
import { GovernanceConnectorConstants } from "../../governance-connectors/constants/governance-connector-constants";

export const generatePasswordExpiry = (
    componentId: string,
    passwordExpiryEnabled: boolean,
    setPasswordExpiryEnabled: (value: boolean) => void,
    t: TFunction<"translation", undefined>
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
                    readOnly={ false }
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
