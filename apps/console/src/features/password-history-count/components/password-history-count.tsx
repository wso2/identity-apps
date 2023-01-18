/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import { Field } from "@wso2is/form/src";
import { Message } from "@wso2is/react-components/src";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Divider, Icon } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions";

export const generatePasswordHistoryCount = (
    componentId: string,
    passwordHistoryEnabled: boolean,
    setPasswordHistoryEnabled: (value: boolean) => void
): ReactElement => {
    return (
        <>
            <h5>Password History Count</h5>
            <div className="criteria">
                <Field.Checkbox
                    ariaLabel="Enable/Disable Password History Count"
                    name="passwordHistoryCountEnabled"
                    label="Must be different from the last"
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
                />
                <label>passwords.</label>
            </div>
            <Message info>
                <Icon name="info circle" />
                Specify the number of unique passwords that a user should use
                before an old password can be reused.
            </Message>
            <Divider hidden />
            <h5>Password Input Validation</h5>
        </>
    );
};
