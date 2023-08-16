/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { useState } from "react";
import { Form, Icon, SemanticWIDTHS } from "semantic-ui-react";
import { Popup } from "../popup";

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
 * @param props - Props injected to the component.
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
                        popper={ <div style={ { filter: "none" } }></div> }
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
