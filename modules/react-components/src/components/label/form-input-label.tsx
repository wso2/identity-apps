/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";

interface FormInputLabelProps extends IdentifiableComponentInterface, TestableComponentInterface {
    htmlFor: string;
    disabled?: boolean;

    [ key: string ]: any;
}

export const FormInputLabel: FunctionComponent<FormInputLabelProps> = (
    props: PropsWithChildren<FormInputLabelProps>
): ReactElement => {

    const {
        children,
        htmlFor,
        disabled,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <label
            data-componentid={ componentId }
            data-testid={ testId }
            htmlFor={ htmlFor }
            className={ classNames({ disabled }) }
            { ...rest }
        >
            { children }
        </label>
    );

};

FormInputLabel.defaultProps = {
    "data-componentid": "form-input-label",
    "data-testid": "form-input-label"
};
