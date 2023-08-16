/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Field } from "@wso2is/form/src";
import { Message } from "@wso2is/react-components/src";
import React, { ReactElement } from "react";
import { TFunction } from "react-i18next";
import { Divider, Icon } from "semantic-ui-react";

export const generatePasswordHistoryCount = (
    componentId: string,
    passwordHistoryEnabled: boolean,
    setPasswordHistoryEnabled: (value: boolean) => void,
    t: TFunction<"translation", undefined>
): ReactElement => {
    return (
        <>
            <h5>{ t("extensions:manage.serverConfigurations.passwordHistoryCount.heading") }</h5>
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
                    readOnly={ false }
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
            <Message info>
                <Icon name="info circle" />
                { t("extensions:manage.serverConfigurations.passwordHistoryCount.message") }
            </Message>
            <Divider hidden />
            <h5>{ t("extensions:manage.serverConfigurations.passwordValidationHeading") }</h5>
        </>
    );
};
