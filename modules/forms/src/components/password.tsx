import React, { useState } from "react";
import { Form, Icon, Popup, SemanticWIDTHS } from "semantic-ui-react";

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
 * @param props
 */
export const Password: React.FunctionComponent<PasswordPropsInterface> = (
    props: PasswordPropsInterface
): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Form.Input
            { ...props }
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
