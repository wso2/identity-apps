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

import Box from "@oxygen-ui/react/Box";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    AlertInterface,
    AlertLevels,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/forms";
import { Button, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Modal } from "semantic-ui-react";
import { addPresentationDefinition } from "../../api/presentation-definitions";
import {
    ClaimConstraintModel,
    PresentationDefinition,
    PresentationDefinitionCreationModel,
    RequestedCredentialModel
} from "../../models/presentation-definitions";

interface AddPresentationDefinitionWizardProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
}

interface DefinitionFormValues {
    name: string;
    description?: string;
}

interface CredentialEntry {
    type: string;
    purpose: string;
    claims: string;
    enforceTrustedIssuers: boolean;
    trustedIssuers: string;
}

/**
 * Wizard for creating a new Presentation Definition.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const AddPresentationDefinitionWizard: FunctionComponent<AddPresentationDefinitionWizardProps> = ({
    closeWizard,
    "data-componentid": componentId = "add-presentation-definition-wizard"
}: AddPresentationDefinitionWizardProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ credentials, setCredentials ] = useState<CredentialEntry[]>([
        { claims: "", enforceTrustedIssuers: false, purpose: "", trustedIssuers: "", type: "" }
    ]);

    // Keep a ref in sync so handleFormSubmit always reads the current credentials,
    // avoiding stale closure issues when FinalForm captures onSubmit.
    const credentialsRef: React.MutableRefObject<CredentialEntry[]> = useRef<CredentialEntry[]>(credentials);
    credentialsRef.current = credentials;

    const addCredentialRow = (): void => {
        setCredentials((prev: CredentialEntry[]) => [
            ...prev,
            { claims: "", enforceTrustedIssuers: false, purpose: "", trustedIssuers: "", type: "" }
        ]);
    };

    const removeCredentialRow = (index: number): void => {
        setCredentials((prev: CredentialEntry[]) => prev.filter((_: CredentialEntry, i: number) => i !== index));
    };

    const updateCredential = (index: number, field: keyof CredentialEntry, value: string | boolean): void => {
        setCredentials((prev: CredentialEntry[]) => {
            const updated: CredentialEntry[] = [ ...prev ];

            updated[index] = { ...updated[index], [field]: value };

            return updated;
        });
    };

    const validateForm = (values: DefinitionFormValues): Partial<DefinitionFormValues> => {
        const errors: Partial<DefinitionFormValues> = {};

        if (!values?.name) {
            errors.name = t("common:required");
        }

        return errors;
    };

    const handleFormSubmit: (values: DefinitionFormValues) => void = useCallback(
        (values: DefinitionFormValues): void => {
            if (!values?.name) return;

            const credentialModels: RequestedCredentialModel[] = credentialsRef.current
                .filter((c: CredentialEntry) => c.type.trim() !== "")
                .map((c: CredentialEntry) => ({
                    claims: c.claims
                        ? c.claims.split(",")
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                            .map((name: string): ClaimConstraintModel => ({ mandatory: true, name }))
                        : [],
                    enforceTrustedIssuers: c.enforceTrustedIssuers,
                    purpose: c.purpose.trim() || undefined,
                    trustedIssuers: c.enforceTrustedIssuers && c.trustedIssuers
                        ? c.trustedIssuers.split(",").map((s: string) => s.trim()).filter(Boolean)
                        : [],
                    type: c.type.trim()
                }));

            if (credentialModels.length === 0) {
                return;
            }

            setIsSubmitting(true);

            const definitionData: PresentationDefinitionCreationModel = {
                credentials: credentialModels,
                description: values.description?.trim() || undefined,
                name: values.name.trim()
            };

            addPresentationDefinition(definitionData)
                .then((response: PresentationDefinition) => {
                    dispatch(addAlert<AlertInterface>({
                        description: t("presentationDefinitions:notifications.createDefinition.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("presentationDefinitions:notifications.createDefinition.success.message")
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
                            description: t("presentationDefinitions:notifications.createDefinition.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("presentationDefinitions:notifications.createDefinition.error.message")
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                    closeWizard();
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Modal
            data-componentid={ componentId }
            open={ true }
            className="wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ t("presentationDefinitions:wizard.title") }</Modal.Header>
            <Modal.Content scrolling>
                <FinalForm
                    onSubmit={ handleFormSubmit }
                    validate={ validateForm }
                    render={ ({ handleSubmit }: FormRenderProps) => (
                        <form id="addPresentationDefinitionForm" onSubmit={ handleSubmit }>
                            <FinalFormField
                                name="name"
                                label={ t("presentationDefinitions:wizard.form.name.label") }
                                placeholder={ t("presentationDefinitions:wizard.form.name.placeholder") }
                                required={ true }
                                helperText={
                                    (<Hint className="hint" compact>
                                        { t("presentationDefinitions:wizard.form.name.hint") }
                                    </Hint>)
                                }
                                component={ TextFieldAdapter }
                                maxLength={ 100 }
                                minLength={ 0 }
                            />
                            <FinalFormField
                                name="description"
                                label={ t("presentationDefinitions:wizard.form.description.label") }
                                placeholder={ t("presentationDefinitions:wizard.form.description.placeholder") }
                                required={ false }
                                component={ TextFieldAdapter }
                                maxLength={ 255 }
                                minLength={ 0 }
                            />

                            <Box sx={ { mt: 2 } }>
                                <Typography variant="subtitle2" sx={ { mb: 1, fontWeight: 600 } }>
                                    { t("presentationDefinitions:wizard.form.credentials.label") }
                                </Typography>
                                <Hint>
                                    { t("presentationDefinitions:wizard.form.credentials.hint") }
                                </Hint>

                                { credentials.map((credential: CredentialEntry, index: number) => (
                                    <Box
                                        key={ index }
                                        sx={ {
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 1,
                                            mb: 1,
                                            mt: 1,
                                            p: 2,
                                            position: "relative"
                                        } }
                                    >
                                        { credentials.length > 1 && (
                                            <IconButton
                                                size="small"
                                                sx={ { position: "absolute", right: 4, top: 4 } }
                                                onClick={ () => removeCredentialRow(index) }
                                                aria-label="remove credential"
                                            >
                                                <Icon name="close" />
                                            </IconButton>
                                        ) }
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={ t("presentationDefinitions:wizard.form.credentials.type.label") }
                                            placeholder={
                                                t("presentationDefinitions:wizard.form.credentials.type.placeholder")
                                            }
                                            value={ credential.type }
                                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateCredential(index, "type", e.target.value)
                                            }
                                            required
                                            sx={ { mb: 1 } }
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={ t(
                                                "presentationDefinitions:wizard.form.credentials.purpose.label"
                                            ) }
                                            placeholder={
                                                t(
                                                    "presentationDefinitions:wizard.form.credentials.purpose.placeholder"
                                                )
                                            }
                                            value={ credential.purpose }
                                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateCredential(index, "purpose", e.target.value)
                                            }
                                            sx={ { mb: 1 } }
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={ t(
                                                "presentationDefinitions:wizard.form.credentials.claims.label"
                                            ) }
                                            placeholder={
                                                t(
                                                    "presentationDefinitions:wizard.form.credentials.claims.placeholder"
                                                )
                                            }
                                            value={ credential.claims }
                                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                updateCredential(index, "claims", e.target.value)
                                            }
                                            helperText={
                                                t("presentationDefinitions:wizard.form.credentials.claims.hint")
                                            }
                                            sx={ { mb: 1 } }
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={ credential.enforceTrustedIssuers }
                                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                        updateCredential(index, "enforceTrustedIssuers",
                                                            e.target.checked)
                                                    }
                                                    size="small"
                                                />
                                            }
                                            label={ t(
                                                "presentationDefinitions:wizard.form.credentials.enforceTrustedIssuers.label"
                                            ) }
                                            sx={ { mb: 0.5 } }
                                        />
                                        { credential.enforceTrustedIssuers && (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label={ t(
                                                    "presentationDefinitions:wizard.form.credentials.trustedIssuers.label"
                                                ) }
                                                placeholder={
                                                    t(
                                                        "presentationDefinitions:wizard.form.credentials.trustedIssuers.placeholder"
                                                    )
                                                }
                                                value={ credential.trustedIssuers }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                    updateCredential(index, "trustedIssuers", e.target.value)
                                                }
                                                helperText={ t(
                                                    "presentationDefinitions:wizard.form.credentials.trustedIssuers.hint"
                                                ) }
                                            />
                                        ) }
                                    </Box>
                                )) }

                                <Button
                                    basic
                                    primary
                                    size="mini"
                                    onClick={ addCredentialRow }
                                    type="button"
                                    data-componentid={ `${componentId}-add-credential-button` }
                                >
                                    <Icon name="add" />
                                    { t("presentationDefinitions:wizard.form.credentials.addButton") }
                                </Button>
                            </Box>
                        </form>
                    ) }
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    className="link-button"
                    basic
                    primary
                    onClick={ closeWizard }
                    data-testid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    primary={ true }
                    type="submit"
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    onClick={ () => {
                        document
                            .getElementById("addPresentationDefinitionForm")
                            .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                    } }
                    data-testid={ `${componentId}-create-button` }
                >
                    { t("presentationDefinitions:wizard.form.submitButton") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default AddPresentationDefinitionWizard;
