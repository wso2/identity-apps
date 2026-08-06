/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import MenuItem from "@oxygen-ui/react/MenuItem";
import Stack from "@oxygen-ui/react/Stack";
import MuiTextField from "@oxygen-ui/react/TextField";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    AlertInterface,
    AlertLevels,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Button, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "semantic-ui-react";
import { addPresentationDefinition } from "../../api/presentation-definitions";
import {
    PresentationDefinition,
    PresentationDefinitionCreationModel
} from "../../models/presentation-definitions";

interface AddPresentationDefinitionWizardPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
}

const generateHandle = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 255);
};

/**
 * Single-page modal for creating a new Presentation Definition.
 * Collects name, handle, description, and credential type in one form.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const AddPresentationDefinitionWizard: FunctionComponent<AddPresentationDefinitionWizardPropsInterface> = ({
    closeWizard,
    "data-componentid": componentId = "add-presentation-definition-wizard"
}: AddPresentationDefinitionWizardPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const [ handle, setHandle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ credentialType, setCredentialType ] = useState<string>("");

    const [ nameError, setNameError ] = useState<string>("");
    const [ credentialTypeError, setCredentialTypeError ] = useState<string>("");

    const handleNameChange = useCallback((newName: string): void => {
        setName(newName);
        setNameError("");
        setHandle(generateHandle(newName));
    }, []);

    const handleCreate = useCallback((): void => {
        let hasError: boolean = false;

        if (!name.trim()) {
            setNameError(t("common:required"));
            hasError = true;
        }
        if (!credentialType.trim()) {
            setCredentialTypeError(t("common:required"));
            hasError = true;
        }
        if (hasError) return;

        setIsSubmitting(true);

        const definitionData: PresentationDefinitionCreationModel = {
            credentials: [ {
                id: handle.trim(),
                type: credentialType.trim()
            } ],
            description: description.trim() || undefined,
            name: name.trim()
        };

        addPresentationDefinition(definitionData)
            .then((response: PresentationDefinition) => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.createDefinition.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "presentationDefinitions:notifications.createDefinition.success.message"
                    )
                }));
                history.push(
                    AppConstants.getPaths().get("VP_DEFINITION_EDIT").replace(":id", response.id)
                );
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                if (error?.response?.status === 409) {
                    dispatch(addAlert<AlertInterface>({
                        description: t(
                            "presentationDefinitions:notifications.createDefinition.duplicateError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "presentationDefinitions:notifications.createDefinition.duplicateError.message"
                        )
                    }));
                } else {
                    dispatch(addAlert<AlertInterface>({
                        description: t(
                            "presentationDefinitions:notifications.createDefinition.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "presentationDefinitions:notifications.createDefinition.error.message"
                        )
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                closeWizard();
            });
    }, [ name, description, credentialType, handle ]);

    return (
        <Modal
            data-componentid={ componentId }
            open={ true }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ t("presentationDefinitions:wizard.title") }</Modal.Header>
            <Modal.Content>
                <Stack direction="column" spacing={ 2 }>
                    <div>
                        <MuiTextField
                            fullWidth
                            required
                            size="small"
                            label={ t("presentationDefinitions:wizard.form.name.label") }
                            placeholder={ t("presentationDefinitions:wizard.form.name.placeholder") }
                            value={ name }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                handleNameChange(e.target.value)
                            }
                            error={ !!nameError }
                            helperText={ nameError || undefined }
                            data-componentid={ `${componentId}-name-field` }
                        />
                        <Hint className="hint" compact>
                            { t("presentationDefinitions:wizard.form.name.hint") }
                        </Hint>
                    </div>
                    <MuiTextField
                        fullWidth
                        size="small"
                        label={ t("presentationDefinitions:wizard.form.description.label") }
                        placeholder={ t("presentationDefinitions:wizard.form.description.placeholder") }
                        value={ description }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                            setDescription(e.target.value)
                        }
                        multiline
                        rows={ 2 }
                        data-componentid={ `${componentId}-description-field` }
                    />
                    <div>
                        <MuiTextField
                            fullWidth
                            required
                            size="small"
                            label={ t("presentationDefinitions:wizard.form.credentialType.label") }
                            placeholder={ t(
                                "presentationDefinitions:wizard.form.credentialType.placeholder"
                            ) }
                            value={ credentialType }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                setCredentialType(e.target.value);
                                setCredentialTypeError("");
                            } }
                            error={ !!credentialTypeError }
                            helperText={ credentialTypeError || undefined }
                            data-componentid={ `${componentId}-credential-type-field` }
                        />
                        <Hint className="hint" compact>
                            { t("presentationDefinitions:wizard.form.credentialType.hint") }
                        </Hint>
                    </div>
                    <div>
                        <MuiTextField
                            select
                            fullWidth
                            size="small"
                            label={ t("presentationDefinitions:wizard.form.format.label") }
                            value="dc+sd-jwt"
                            data-componentid={ `${componentId}-format-field` }
                        >
                            <MenuItem value="dc+sd-jwt">dc+sd-jwt</MenuItem>
                        </MuiTextField>
                        <Hint className="hint" compact>
                            { t("presentationDefinitions:wizard.form.format.hint") }
                        </Hint>
                    </div>
                </Stack>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    className="link-button"
                    basic
                    primary
                    onClick={ closeWizard }
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    primary={ true }
                    loading={ isSubmitting }
                    disabled={ isSubmitting }
                    onClick={ handleCreate }
                    data-componentid={ `${componentId}-create-button` }
                >
                    { t("presentationDefinitions:wizard.form.submitButton") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default AddPresentationDefinitionWizard;
