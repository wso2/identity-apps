/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
// eslint-disable-next-line no-restricted-imports
import { Form, Icon, Popup, SemanticWIDTHS } from "semantic-ui-react";
import { filterPassedProps } from "../utils";

/**
 * Password prop types
 */
interface PasswordPropsInterface {
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

    const filteredProps = filterPassedProps({ ...props });

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
            icon={
                (
                    <Popup
                        trigger={
                            (
                                <Icon
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
                        popper={ <div style={ { filter: "none" } }/> }
                    />
                )
            }
            autoFocus={ props.autoFocus || false }
            readOnly={ props.readOnly }
            disabled={ props.disabled }
            required={ props.required }
        />
    );
};
