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
import React, { useState } from "react";
import { Form, Icon, Popup, SemanticWIDTHS } from "semantic-ui-react";

/**
 * Password prop types
 */
interface PasswordPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    label: string;
    value: string;
    error: false | { content: JSX.Element[] };
    width: SemanticWIDTHS;
    type: "password";
    placeholder: string;
    name: string;
    onBlur: (event) => void;
    onChange: (event) => void;
    showPassword: string;
    hidePassword: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    [extra: string]: any;
}

/**
 * Password component
 * @param props
 */
export const Password: React.FunctionComponent<PasswordPropsInterface> = (
    props: PasswordPropsInterface
): JSX.Element => {
    const [ isShow, setIsShow ] = useState(false);

    const {
        label,
        value,
        error,
        width,
        type,
        placeholder,
        name,
        onBlur,
        onChange,
        showPassword,
        hidePassword,
        autoFocus,
        readOnly,
        disabled,
        required,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <Form.Input
            label={ label }
            value={ value }
            error={ error }
            type={ isShow ? "text" : type }
            placeholder={ placeholder }
            name={ name }
            width={ width }
            onBlur={ onBlur }
            onChange={ onChange }
            icon={
                (
                    <Popup
                        trigger={
                            (
                                <Icon
                                    name={
                                        !isShow ? "eye" : "eye slash"
                                    }
                                    disabled={ !value }
                                    link
                                    onClick={ () => { setIsShow(!isShow); } }
                                />
                            )
                        }
                        position="top center"
                        content={
                            !isShow
                                ? showPassword
                                : hidePassword
                        }
                        inverted
                    />
                )
            }
            autoFocus={ autoFocus || false }
            readOnly={ readOnly }
            disabled={ disabled }
            required={ required }
            data-componentid= { componentId }
            data-testid= { testId }
            { ...rest }
        />
    );
};

/**
 * Default props for the component.
 */
Password.defaultProps = {
    "data-componentid": "password-input-field"
};
