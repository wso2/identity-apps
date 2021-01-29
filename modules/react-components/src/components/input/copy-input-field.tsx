/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Popup } from "semantic-ui-react";

/**
 * Copy to clipboard input field props.
 */
export interface CopyInputFieldPropsInterface extends TestableComponentInterface {
    /**
     * Input value.
     */
    value: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Popup label for secret show state.
     */
    showSecretLabel?: string;
    /**
     * Popup label for secret hide state.
     */
    hideSecretLabel?: string;
    /**
     * Should the content appear as a secret.
     */
    secret?: boolean;
}

/**
 * Copy to clipboard input field component.
 *
 * @param {CopyInputFieldPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const CopyInputField: FunctionComponent<CopyInputFieldPropsInterface> = (
    props: CopyInputFieldPropsInterface
): ReactElement => {

    const {
        value,
        className,
        hideSecretLabel,
        secret,
        showSecretLabel,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("copy-input", className);

    const inputRef = useRef<Input>(null);
    const copyButtonRef = useRef(null);

    const [ copied, setCopied ] = useState<boolean>(false);
    const [ show, setShow ] = useState<boolean>(false);

    useEffect(() => {
        if (copied) {
            copyButtonRef.current.focus();
        }
    }, [ copied ]);

    /**
     * Copies the value to the users clipboard. This function does
     * support for IE11 as its using obsolete {@link document.execCommand}
     * if the {@link Clipboard} is unavailable.
     *
     * Most browsers don't allow to copy from password fields. So, it's
     * somewhat tricky to get the value and set it to the clipboard. In this
     * function we will get the value of the input via it's props.
     *
     * @param event {MouseEvent<HTMLButtonElement>)}
     */
    const copyValueToClipboard = (event: MouseEvent<HTMLButtonElement>) => {

        event.stopPropagation();

        const onValueCopied = (): void => {
            setCopied(true);
            copyButtonRef.current.ref.current.blur();
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
        };

        // Focus the input node. This will dismount the button's
        // focus from the view.
        inputRef.current?.focus();
        inputRef.current?.select();

        let _selection = window.getSelection().toString();

        // Applying the solution https://stackoverflow.com/a/58859920
        if (inputRef.current?.props.type === "password") {
            _selection = inputRef.current?.props[ "value" ] ?? "";
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(_selection).then(onValueCopied);
        } else {
            if (document.execCommand) {
                document.execCommand("copy");
                onValueCopied();
            }
        }

    };

    return (
        <Input
            ref={ inputRef }
            value={ value }
            labelPosition="right"
            readOnly
            action={
                <Popup
                    trigger={
                        (
                            <Button
                                className="copy-input-action"
                                icon="copy"
                                type="button"
                                onMouseEnter={ () => {
                                    setCopied(false);
                                } }
                                ref={ copyButtonRef as React.RefObject<Button> }
                                onClick={ copyValueToClipboard }
                            />
                        )
                    }
                    openOnTriggerFocus
                    closeOnTriggerBlur
                    position="top center"
                    content={ copied ? "Copied!" : "Copy to clipboard" }
                    inverted
                />
            }
            fluid
            className={ classes }
            type={
                !secret
                    ? "text"
                    : show
                        ? "text"
                        : "password"
            }
            icon={
                secret && (
                    <Popup
                        trigger={ (
                            <Icon
                                className="copy-input-eye-icon"
                                name={
                                    !show
                                        ? "eye"
                                        : "eye slash"
                                }
                                disabled={ !value }
                                link
                                onClick={ () => {
                                    setShow(!show);
                                } }
                            />
                        ) }
                        position="top center"
                        content={
                            !show
                                ? showSecretLabel
                                : hideSecretLabel
                        }
                        inverted
                    />
                )
            }
            data-testid={ `${ testId }-wrapper` }
        />
    )
};

/**
 * Default proptypes for the copy input component.
 */
CopyInputField.defaultProps = {
    "data-testid": "copy-input",
    hideSecretLabel: "Show",
    secret: false,
    showSecretLabel: "Hide"
};
