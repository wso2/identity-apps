/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { CopyIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Button, Icon, Input } from "semantic-ui-react";
import { Popup } from "../popup";
import "./copy-input-field.scss";

/**
 * Copy to clipboard input field props.
 */
export interface CopyInputFieldPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Input value.
     */
    value: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Whether to provide the option to view secret.
     */
    showSecret?: boolean;
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
    /**
     * Label of the input field.
     */
    label?: string;
}

/**
 * Copy to clipboard input field component.
 *
 * @param props - Props injected to the component.
 * @returns Copy Input Field Component.
 */
export const CopyInputField: FunctionComponent<CopyInputFieldPropsInterface> = (
    props: CopyInputFieldPropsInterface
): ReactElement => {

    const {
        value,
        className,
        showSecret,
        hideSecretLabel,
        secret,
        showSecretLabel,
        label,
        [ "data-componentid" ]: componentId,
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
     * Copies the value to the users clipboard.
     *
     * @param event - MouseEvent<HTMLButtonElement>
     */
    const copyValueToClipboard = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        /**
         * Since the reference input component is a {@link Input} we can
         * directly get the current value from props itself.
         */
        const _selection = inputRef.current?.props[ "value" ] ?? "";

        await CommonUtils.copyTextToClipboard(_selection);
        setCopied(true);
    };

    return (
        <Input
            label={ label }
            ref={ inputRef }
            value={ value }
            labelPosition="right"
            readOnly
            action={ (
                <Button
                    data-tooltip={ copied ? "Copied!" : "Copy to clipboard" }
                    data-inverted=""
                    className="copy-input-action"
                    icon={ CopyIcon }
                    type="button"
                    onMouseEnter={ () => {
                        setCopied(false);
                    } }
                    ref={ copyButtonRef as React.RefObject<Button> }
                    onClick={ copyValueToClipboard }
                />
            ) }
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
                secret && showSecret && (
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
                        popper={ <div style={ { filter: "none" } }/> }
                    />
                )
            }
            data-componentid={ `${ componentId }-wrapper` }
            data-testid={ `${ testId }-wrapper` }
        />
    );
};

/**
 * Default proptypes for the copy input component.
 */
CopyInputField.defaultProps = {
    "data-componentid": "copy-input",
    "data-testid": "copy-input",
    hideSecretLabel: "Show",
    secret: false,
    showSecretLabel: "Hide"
};
