/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import classNames from "classnames";
import React, { MouseEvent, useState } from "react";
import { Button, Form, Icon, Popup, SemanticWIDTHS } from "semantic-ui-react";
import { filterPassedProps } from "../utils";

/**
 * Password prop types
 */
interface PasswordPropsInterface {
    showIcon?: boolean;
    showResetIcon?: boolean;
    onResetPasswordValue?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
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
    const [isShow, setIsShow] = useState(false);

    const filteredProps = filterPassedProps({ ...props });

    const classes = classNames("password-input", props.className);

    return (
        <Form.Input
            { ...filteredProps }
            label={ props.label }
            value={ props.value }
            error={ props.error }
            type={ isShow ? "text" : props.type }
            placeholder={ props.placeholder }
            name={ props.name }
            width={ props.width }
            onBlur={ props.onBlur }
            onChange={ props.onChange }
            action={
                props.showResetIcon ?
                    (
                        <Popup
                            trigger={
                                (
                                    <Button
                                        className="copy-input-action"
                                        icon="redo"
                                        type="button"
                                        onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            props.onResetPasswordValue;
                                        } }
                                    />
                                )
                            }
                            openOnTriggerFocus
                            closeOnTriggerBlur
                            position="top center"
                            content={ "Reset password change" }
                            inverted
                        />
                    )
                    : null
            }
            icon={
                props.showIcon ?
                    (
                        <Popup
                            trigger={
                                (
                                    <Icon
                                        className="password-input-eye-icon"
                                        name={
                                            !isShow ? "eye" : "eye slash"
                                        }
                                        disabled={ !props.value }
                                        link
                                        onClick={ () => { setIsShow(!isShow); } }
                                    />
                                )
                            }
                            position="top center"
                            content={
                                !isShow
                                    ? props.showPassword
                                    : props.hidePassword
                            }
                            inverted
                        />
                    )
                    : null
            }
            className={ classes }
            autoFocus={ props.autoFocus || false }
            readOnly={ props.readOnly }
            disabled={ props.disabled }
            required={ props.required }
        />
    );
};

/**
 * Default props for the component.
 */
Password.defaultProps = {
    showIcon: true,
    showResetIcon: false
};
