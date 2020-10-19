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
 *
 */

import { AlertLevels } from "@wso2is/core/models";
import React, { ReactElement, useState } from "react";
import { Message } from "semantic-ui-react";

/**
 * The model of the `alert` state.
 */
interface WizardAlert {
    message: string;
    description: string;
    level: AlertLevels;
}

/**
 * The type of the array returned by the `useWizardAlert` hook.
 */
type UseWizardAlertHookReturnType = [ WizardAlert, React.Dispatch<React.SetStateAction<WizardAlert>>, ReactElement ];

/**
 * This is a React hook that allows you to display an alert within a wizard.
 * This hook returns a state of type `WizardAlert`, a `setState` function and the React alert element.
 *
 * @example
 * ```
 * const [alert, setAlert, alertComponent] = useWizardAlert();
 * ```
 *
 * @return {UseWizardAlertHookReturnType} An array containing the state, setState function and the alert React element.
 */
export const useWizardAlert = (): UseWizardAlertHookReturnType => {
    const [ alert, setAlert ] = useState<WizardAlert>(null);

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
