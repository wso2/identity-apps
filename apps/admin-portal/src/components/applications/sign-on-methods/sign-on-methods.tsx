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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { StepBasedFlow } from "./step-based-flow";
import {
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface,
    CRUDPermissionsInterface
} from "../../../models";
import { ScriptBasedFlow } from "./script-based-flow";
import { Divider } from "semantic-ui-react";
import { updateAuthenticationSequence } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { PrimaryButton } from "@wso2is/react-components";

/**
 * Proptypes for the sign on methods component.
 */
interface SignOnMethodsPropsInterface {
    /**
     * ID of the application.
     */
    appId?: string;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
}

/**
 * Configure the different sign on strategies for an application.
 *
 * @param {SignOnMethodsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): ReactElement => {

    const {
        appId,
        authenticationSequence,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [ sequence, setSequence ] = useState<AuthenticationSequenceInterface>(authenticationSequence);
    const [ updateTrigger, setUpdateTrigger ] = useState<boolean>(false);
    const [ adaptiveScript, setAdaptiveScript ] = useState<string | string[]>(undefined);

    /**
     * Toggles the update trigger.
     */
    useEffect(() => {
        if (!updateTrigger) {
            return;
        }

        setUpdateTrigger(false);
    }, [ updateTrigger ]);

    /**
     * Handles the data loading from a adaptive auth template when it is selected
     * from the panel.
     *
     * @param {AdaptiveAuthTemplateInterface} template - Adaptive authentication templates.
     */
    const handleLoadingDataFromTemplate = (template: AdaptiveAuthTemplateInterface) => {
        if (!template) {
            return;
        }

        let newSequence = { ...sequence };

        if (template.code) {
            newSequence = {
                ...newSequence,
                script: JSON.stringify(template.code)
            }
        }

        if (template.defaultAuthenticators) {
            const steps: AuthenticationStepInterface[] = [];

            for (const [ key, value ] of Object.entries(template.defaultAuthenticators)) {
                steps.push({
                    id: parseInt(key, 10),
                    options: value.local.map((authenticator) => {
                        return {
                            idp: "LOCAL",
                            authenticator
                        }
                    })
                })
            }

            newSequence = {
                ...newSequence,
                subjectStepId: 1,
                attributeStepId: 1,
                steps
            }
        }

        setSequence(newSequence);
    };

    /**
     * Handles authentication sequence update.
     */
    const handleSequenceUpdate = (sequence: AuthenticationSequenceInterface) => {
        const requestBody = {
            authenticationSequence: {
                ...sequence,
                script: JSON.stringify(adaptiveScript)
            }
        };

        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating authentication steps of the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    /**
     * Handles adaptive script change event.
     *
     * @param {string | string[]} script - Adaptive script from the editor.
     */
    const handleAdaptiveScriptChange = (script: string | string[]) => {
        setAdaptiveScript(script);
    };

    /**
     * Handles the update button click event.
     */
    const handleUpdateClick = () => {
        setUpdateTrigger(true);
    };

    return (
        <div className="sign-on-methods-tab-content">
            <StepBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onUpdate={ handleSequenceUpdate }
                triggerUpdate={ updateTrigger }
            />
            <Divider hidden />
            <ScriptBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onTemplateSelect={ handleLoadingDataFromTemplate }
                onScriptChange={ handleAdaptiveScriptChange }
            />
            <Divider hidden/>
            <PrimaryButton onClick={ handleUpdateClick }>Update</PrimaryButton>
        </div>
    );
};
