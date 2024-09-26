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

import Alert from "@oxygen-ui/react/Alert";
import { Field } from "@wso2is/form/src";
import { Heading } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { TFunction } from "react-i18next";

export const generatePasswordHistoryCount = (
    componentId: string,
    passwordHistoryEnabled: boolean,
    setPasswordHistoryEnabled: (value: boolean) => void,
    t: TFunction<"translation", undefined>,
    isReadOnly: boolean = false
): ReactElement => {
    return (
        <>
            <Heading as="h4">
                { t("extensions:manage.serverConfigurations.passwordHistoryCount.heading") }
            </Heading>
            <Alert severity="info" className="info-box">
                { t("extensions:manage.serverConfigurations.passwordHistoryCount.message") }
            </Alert>
            <div className="criteria">
                <Field.Checkbox
                    ariaLabel="Enable/Disable Password History Count"
                    name="passwordHistoryCountEnabled"
                    label={ t("extensions:manage.serverConfigurations.passwordHistoryCount.label1") }
                    required={ false }
                    disabled={ false }
                    listen={ (value: boolean) => {
                        setPasswordHistoryEnabled(value);
                    } }
                    width={ 16 }
                    data-testid={ `${ componentId }-password-history-count-toggle` }
                    readOnly={ isReadOnly }
                />
                <Field.Input
                    ariaLabel="Password History Count"
                    inputType="number"
                    name="passwordHistoryCount"
                    min={ 1 }
                    width={ 2 }
                    required={ true }
                    hidden={ false }
                    placeholder="5"
                    maxLength={ 2 }
                    minLength={ 2 }
                    readOnly={ isReadOnly }
                    disabled={ !passwordHistoryEnabled }
                    data-testid={ `${ componentId }-password-history-count` }
                    validation={ (value: string): string | undefined=> {
                        const numValue: number = parseInt(value);

                        if (numValue < 1) {
                            return t("common:minValidation", { min: 1 });
                        }
                    } }
                />
                <label>{ t("extensions:manage.serverConfigurations.passwordHistoryCount.label2") }</label>
            </div>
        </>
    );
};
