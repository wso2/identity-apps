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
                                onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();

                                    inputRef.current?.select();
                                    setCopied(true);
                                    document.execCommand("copy");
                                    copyButtonRef.current.ref.current.blur();

                                    if (window.getSelection) {
                                        window.getSelection().removeAllRanges();
                                    }
                                } }
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
