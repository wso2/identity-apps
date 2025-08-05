/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { generatePassword, getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api/validation-config";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models/validation-config";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import { t } from "i18next";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Icon, Message, Modal } from "semantic-ui-react";
import { updateAgentPassword } from "../../api/agents";

/**
 * Props for the AgentSecretShowModal component.
 */
interface AgentSecretShowModalProps extends IdentifiableComponentInterface {
    /**
     * The title to be displayed in the modal.
     */
    title?: string;
    /**
     * The unique identifier of the agent.
     */
    agentId: string;
    /**
     * The secret associated with the agent.
     */
    agentSecret?: string;
    /**
     * Flag indicating whether the modal is open.
     */
    isOpen: boolean;
    /**
     * Callback to be invoked when the modal is closed.
     */
    onClose: () => void;
    /**
     * Is for agent secret regeneration.
     */
    isForSecretRegeneration?: boolean;
}

export function AgentSecretShowModal({
    title,
    agentId,
    agentSecret,
    isOpen,
    onClose,
    isForSecretRegeneration,
    ["data-componentid"]: componentId = "agent-secret-show-modal"
}: AgentSecretShowModalProps) {
    const { data: validationData } = useValidationConfigData();

    const dispatch: Dispatch = useDispatch();

    const [ shouldShowSecretRegeneration, setShouldShowSecretRegeneration ] = React.useState<boolean>(false);
    const [ isSecretRegenerationLoading, setIsSecretRegenerationLoading ] = React.useState<boolean>(false);

    const passwordValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getConfiguration(validationData);
    }, [ validationData ]);

    const [ newAgentSecret, setNewAgentSecret ] = React.useState<string>("");

    const regenerateAgentScret = () => {
        setIsSecretRegenerationLoading(true);

        const newPassword: string = generatePassword(
            16,
            Number(passwordValidationConfig.minLowerCaseCharacters) > 0,
            Number(passwordValidationConfig.minUpperCaseCharacters) > 0,
            Number(passwordValidationConfig.minNumbers) > 0,
            Number(passwordValidationConfig.minSpecialCharacters) > 0,
            Number(passwordValidationConfig.minLowerCaseCharacters),
            Number(passwordValidationConfig.minUpperCaseCharacters),
            Number(passwordValidationConfig.minNumbers),
            Number(passwordValidationConfig.minSpecialCharacters),
            Number(passwordValidationConfig.minUniqueCharacters)
        );

        setNewAgentSecret(newPassword);

        updateAgentPassword(
            agentId,
            newPassword
        ).then(() => {
            setShouldShowSecretRegeneration(true);
        }).catch((_error: AxiosError) => {
            dispatch(addAlert({
                description: t("agents:edit.credentials.regenerate.alerts.error.description"),
                level: AlertLevels.ERROR,
                message: t("agents:edit.credentials.regenerate.alerts.error.message")
            }));
        }).finally(() => {
            setIsSecretRegenerationLoading(false);
        });
    };

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ isOpen }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ title }</Modal.Header>
            <Modal.Content>

                {
                    isForSecretRegeneration && !shouldShowSecretRegeneration ? (
                        <>
                            <strong>Before regenerating:</strong> Make sure you are ready to update all
                        applications using the new agent secret. Once regenerated,
                            <ul>
                                <li>Scripts and applications using the current agent secret will need
                                    to be updated accordingly.</li>
                                <li>The current agent secret cannot be recovered once regenerated.</li>
                            </ul>
                        </>
                    ) : (<>
                        <Message warning>
                            <strong>Important:</strong> Please copy and store the agent credentials securely.{ " " }
                    Make sure to copy the agent secret now as you will not be able to see this again.
                        </Message>
                        { !isForSecretRegeneration && (
                            <>
                                <label>Agent ID</label>
                                <div style={ { marginTop: "1%" } }>
                                    <CopyInputField
                                        className="agent-id-input"
                                        value={ agentId }
                                        data-componentid="agent-id-readonly-input"
                                    />
                                </div>
                            </>
                        ) }
                        <div style={ { marginTop: "2%" } }></div>
                        <label>Agent Secret</label>
                        <div style={ { marginTop: "1%" } }>
                            <CopyInputField
                                className="agent-secret-input"
                                secret
                                value={ agentSecret || newAgentSecret }
                                hideSecretLabel="Hide secret"
                                showSecretLabel="Show secret"
                                data-componentid={ "agent-secret-readonly-input" }
                            />
                        </div>
                    </>)
                }
            </Modal.Content>
            <Modal.Actions>
                { isForSecretRegeneration && !shouldShowSecretRegeneration ? (
                    <>
                        <PrimaryButton
                            className="link-button"
                            basic
                            primary
                            onClick={ () => onClose() }
                        >
                        Cancel
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={ () => {
                                regenerateAgentScret();
                            } }
                            loading={ isSecretRegenerationLoading }
                            disabled={ isSecretRegenerationLoading }
                            data-componentid={ componentId + "-proceed-btn" }
                        >
                            Proceed
                            <Icon name="arrow right" />
                        </PrimaryButton>
                    </>

                ) : (
                    <Button
                        primary={ true }
                        type="submit"
                        onClick={ () => {
                            setShouldShowSecretRegeneration(false);
                            onClose();
                        }
                        }
                        data-testid={ `${componentId}-done-button` }
                    >
                            Done
                    </Button>
                ) }
            </Modal.Actions>
        </Modal>
    );
}
