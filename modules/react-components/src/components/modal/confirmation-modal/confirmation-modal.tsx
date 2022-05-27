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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    useEffect,
    useState
} from "react";
import { Button, Checkbox, Icon, Input, Modal, ModalProps } from "semantic-ui-react";
import { ConfirmationModalContent } from "./confirmation-modal-content";
import { ConfirmationModalDescription } from "./confirmation-modal-description";
import { ConfirmationModalHeader } from "./confirmation-modal-header";
import { ConfirmationModalMessage } from "./confirmation-modal-message";
import { LinkButton } from "../../button";

/**
 * Confirmation modal component props.
 */
export interface ConfirmationModalPropsInterface extends ModalProps, TestableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * If the animated icons should be shown.
     */
    animated?: boolean;
    /**
     * Assertion text. If set, the primary action will only be enabled
     * after a matching input is entered or checkbox is being pressed.
     */
    assertion?: string;
    /**
     * Hint for the assertion.
     */
    assertionHint?: ReactNode;
    /**
     * Type of the assertion.
     */
    assertionType?: "input" | "checkbox";
    /**
     * Confirmation modal emphasis.
     */
    type: "positive" | "negative" | "warning" | "info";
    /**
     * Primary action button label.
     */
    primaryAction?: string | ReactNode;
    /**
     * Tells whether primary action is loading or something is
     * happening asynchronously.
     */
    primaryActionLoading?: boolean;
    /**
     * Should primary action button appear in full length.
     */
    primaryActionFluid?: boolean;
    /**
     * Secondary action button label.
     */
    secondaryAction?: string | ReactNode;
    /**
     * Callback function for the primary action button.
     */
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Callback function for the secondary action button.
     */
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Skip assertion.
     */
    skipAssertion?: boolean;
    /**
     * Text alignment.
     */
    textAlign?: "left" | "center" | "right" | "justified";
}

/**
 * Interface for the confirmation modal sub component.
 */
export interface ConfirmationModalSubComponentsInterface {
    Header: typeof ConfirmationModalHeader;
    Content: typeof ConfirmationModalContent;
    Description: typeof ConfirmationModalDescription;
    Message: typeof ConfirmationModalMessage;
}

/**
 * Confirmation modal component.
 *
 * @param {ConfirmationModalPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ConfirmationModal: FunctionComponent<ConfirmationModalPropsInterface> &
    ConfirmationModalSubComponentsInterface = (
        props: ConfirmationModalPropsInterface
    ): ReactElement => {

        const {
            animated,
            assertion,
            assertionHint,
            assertionType,
            children,
            className,
            type,
            primaryAction,
            primaryActionFluid,
            secondaryAction,
            onPrimaryActionClick,
            onSecondaryActionClick,
            skipAssertion,
            textAlign,
            primaryActionLoading,
            [ "data-componentid" ]: componentId,
            [ "data-testid" ]: testId,
            ...rest
        } = props;

        const [ assertionInput, setAssertionInput ] = useState<string>("");
        const [ confirmed, setConfirmed ] = useState<boolean>(false);
        const [ assertionDisabled, setAssertionDisabled ] = useState<boolean>(false);

        /**
     * Called when the assertion input changes.
     */
        useEffect(() => {
            setConfirmed(assertionInput === assertion);
        }, [ assertionInput ]);

        const classes = classNames(
            "confirmation-modal",
            {
                [ textAlign === "justified" ? "justified" : `${textAlign} aligned` ]: textAlign
            },
            className
        );

        /**
     * Handler for the secondary button click event.
     */
        const handleSecondaryActionClick = (e: MouseEvent<HTMLButtonElement>) => {
            setAssertionInput("");
            setConfirmed(false);
            onSecondaryActionClick(e);
        };

        /**
     * Handler for the primary button click event.
     */
        const handlePrimaryActionClick = (e: MouseEvent<HTMLButtonElement>) => {
            setAssertionInput("");
            setAssertionDisabled(true);
            setConfirmed(false);
            onPrimaryActionClick(e);
        };

        /**
     * Handler for the enter key press down.
     */
        const handleKeyDown = (k: KeyboardEvent, e: MouseEvent<HTMLButtonElement> ) => {
            if (k.key === "Enter" && confirmed) {
                setAssertionInput("");        
                onPrimaryActionClick(e);
            }
        };

        /**
     * Resolves the animated icon.
     *
     * @param {string} type - Type of the modal.
     *
     * @return {React.ReactElement}
     */
        const resolveIcon = (type: string): ReactElement => {
            if (type === "positive") {
                return (
                    <div
                        className="svg-box"
                        data-componentid={ `${ componentId }-${ type }-animated-icon` }
                        data-testid={ `${ testId }-${ type }-animated-icon` }
                    >
                        <svg className="circular positive-stroke">
                            <circle
                                className="path"
                                cx="75"
                                cy="75"
                                r="50"
                                fill="none"
                                strokeWidth="5"
                                strokeMiterlimit="10"
                            />
                        </svg>
                        <svg className="positive-icon positive-stroke">
                            <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                                <path
                                    className="positive-icon__check"
                                    fill="none"
                                    d="M616.306,283.025L634.087,300.805L673.361,261.53"
                                />
                            </g>
                        </svg>
                    </div>
                );
            } else if (type === "negative") {
                return (
                    <div
                        className="svg-box"
                        data-componentid={ `${ componentId }-${ type }-animated-icon` }
                        data-testid={ `${ testId }-${ type }-animated-icon` }
                    >
                        <svg className="circular negative-stroke">
                            <circle
                                className="path"
                                cx="75"
                                cy="75"
                                r="50"
                                fill="none"
                                strokeWidth="5"
                                strokeMiterlimit="10"
                            />
                        </svg>
                        <svg className="negative-icon negative-stroke">
                            <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)">
                                <path className="first-line" d="M634.087,300.805L673.361,261.53" fill="none"/>
                            </g>
                            <g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)">
                                <path className="second-line" d="M634.087,300.805L673.361,261.53"/>
                            </g>
                        </svg>
                    </div>
                );
            } else if (type === "warning") {
                return (
                    <div
                        className="svg-box"
                        data-componentid={ `${ componentId }-${ type }-animated-icon` }
                        data-testid={ `${ testId }-${ type }-animated-icon` }
                    >
                        <svg className="circular warning-stroke">
                            <circle
                                className="path"
                                cx="75"
                                cy="75"
                                r="50"
                                fill="none"
                                strokeWidth="5"
                                strokeMiterlimit="10"
                            />
                        </svg>
                        <svg className="warning-icon warning-stroke">
                            <g transform="matrix(1,0,0,1,-615.516,-257.346)">
                                <g transform="matrix(0.56541,-0.56541,0.56541,0.56541,93.7153,495.69)">
                                    <path className="line" d="M634.087,300.805L673.361,261.53" fill="none"/>
                                </g>
                                <g transform="matrix(2.27612,-2.46519e-32,0,2.27612,-792.339,-404.147)">
                                    <circle className="dot" cx="621.52" cy="316.126" r="1.318"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                );
            } else {
                return (
                    <Icon
                        className="modal-icon"
                        name="info circle"
                        size="huge"
                        color="blue"
                        data-componentid={ `${ componentId }-info-animated-icon` }
                        data-testid={ `${ testId }-info-animated-icon` }
                    />
                );
            }
        };

        /**
     * Resolves the assertion input.
     *
     * @param {"input" | "checkbox"} type - Type of the assertion.
     *
     * @return {React.ReactElement}
     */
        const resolveAssertionInput = (type: "input" | "checkbox"): ReactElement => {
            if (type === "input") {
                return (
                    <>
                        {
                            assertionHint && typeof assertionHint === "string"
                                ? <p>{ assertionHint }</p>
                                : assertionHint
                        }
                        <Input
                            disabled={ assertionDisabled }
                            data-componentid={ `${ componentId }-assertion-input` }
                            data-testid={ `${ testId }-assertion-input` }
                            onChange={ (e: ChangeEvent<HTMLInputElement>): void => setAssertionInput(e.target?.value) }
                            onKeyDown={ handleKeyDown }
                            value={ assertionInput }
                            fluid
                        />
                    </>
                );
            } else if (type === "checkbox") {
                if (typeof assertionHint !== "string") {
                    throw new Error("Unsupported hint format. Checkboxes can only have hints of type string.");
                }

                return (
                    <Checkbox
                        disabled={ assertionDisabled }
                        label={ assertionHint }
                        checked={ confirmed }
                        onChange={ (): void => setConfirmed(!confirmed) }
                        data-componentid={ `${ componentId }-assertion-checkbox` }
                        data-testid={ `${ testId }-assertion-checkbox` }
                    />
                );
            }

            throw new Error("Unsupported assertion input type. Only `string` and `checkbox` is supported.");
        };

        return (
            <Modal
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
                className={ classes }
            >
                { animated && (
                    <div className="animated-icon">{ resolveIcon(type) }</div>
                ) }
                { children }
                {
                    assertionType && (
                        <Modal.Content className="no-margin-top">
                            { resolveAssertionInput(assertionType) }
                        </Modal.Content>
                    )
                }
                {
                    (primaryAction || secondaryAction) && (
                        <Modal.Actions>
                            {
                                (secondaryAction && onSecondaryActionClick) && (
                                    <LinkButton
                                        data-componentid={ componentId + "-cancel-button" }
                                        data-testid={ testId + "-cancel-button" }
                                        positive={ type === "positive" }
                                        negative={ type === "negative" }
                                        warning={ type === "warning" }
                                        info={ type === "info" }
                                        onClick={ handleSecondaryActionClick }
                                    >
                                        { secondaryAction }
                                    </LinkButton>
                                )
                            }
                            {
                                (primaryAction && onPrimaryActionClick) && (
                                    <Button
                                        loading={ primaryActionLoading }
                                        data-componentid={ componentId + "-confirm-button" }
                                        data-testid={ testId + "-confirm-button" }
                                        className={ `${ type } ${ primaryActionFluid ? "fluid" : "" }` }
                                        disabled={
                                            primaryActionLoading || !skipAssertion
                                                ? !(!assertionType || confirmed)
                                                : false
                                        }
                                        onClick={ handlePrimaryActionClick }
                                        fluid={ primaryActionFluid }
                                    >
                                        { primaryAction }
                                    </Button>
                                )
                            }
                        </Modal.Actions>
                    )
                }
            </Modal>
        );
    };

/**
 * Default proptypes for the confirmation modal component.
 */
ConfirmationModal.defaultProps = {
    "data-componentid": "confirmation-modal",
    "data-testid": "confirmation-modal",
    dimmer: "blurring",
    primaryActionLoading: false,
    size: "tiny",
    textAlign: "left"
};

ConfirmationModal.Header = ConfirmationModalHeader;
ConfirmationModal.Content = ConfirmationModalContent;
ConfirmationModal.Description = ConfirmationModalDescription;
ConfirmationModal.Message = ConfirmationModalMessage;
