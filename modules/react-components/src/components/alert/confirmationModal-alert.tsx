/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels } from "@wso2is/core/models";
import React, { ReactElement, useState } from "react";
import { Message } from "semantic-ui-react";

/**
 * The model of the `alert` state.
 */
interface ConfirmationModalAlert {
    message: string;
    description: string;
    level: AlertLevels;
}

/**
 * The type of the array returned by the `useConfirmationModalAlert` hook.
 */
type UseConfirmationModalAlertHookReturnType = [ ConfirmationModalAlert,
    React.Dispatch<React.SetStateAction<ConfirmationModalAlert>>, ReactElement ];

/**
 * This is a React hook that allows you to display an alert within a ConfirmationModal.
 * This hook returns a state of type `ConfirmationModalAlert`, a `setState` function and the React alert element.
 *
 * @example
 * ```
 * const [alert, setAlert, alertComponent] = useConfirmationModalAlert();
 * ```
 *
 * @returns An array containing the state, setState function and the
 * alert React element.
 */
export const useConfirmationModalAlert = (): UseConfirmationModalAlertHookReturnType => {
    const [ alert, setAlert ] = useState<ConfirmationModalAlert>(null);

    const renderAlert = (): ReactElement => {
        return (
            alert && (
                <Message
                    color={
                        alert.level === AlertLevels.SUCCESS
                            ? "olive"
                            : alert.level === AlertLevels.WARNING
                                ? "yellow"
                                : alert.level === AlertLevels.ERROR
                                    ? "red"
                                    : alert.level === AlertLevels.INFO
                                        ? "teal"
                                        : null
                    }
                >
                    <Message.Header>{ alert.message }</Message.Header>
                    <p>{ alert.description }</p>
                </Message>
            )
        );
    };

    return [ alert, setAlert, renderAlert() ];
};
