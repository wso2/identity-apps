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

import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    AlertInterface,
    AlertLevels,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { addPresentationDefinition } from "../../api/presentation-definitions";
import {
    AddPresentationDefinitionWizardPropsInterface,
    PresentationDefinitionCreationModelInterface,
    PresentationDefinitionInterface
} from "../../models/presentation-definitions";

/** Allowed identifier characters: alphanumeric, underscore, hyphen. */
const IDENTIFIER_PATTERN: RegExp = /^[A-Za-z0-9_-]+$/;

/**
 * Derives a valid identifier slug from a display name.
 * Lowercases, replaces invalid chars with hyphens, collapses consecutive hyphens,
 * trims leading/trailing hyphens, and caps at 100 characters.
 */
const deriveIdentifier = (displayName: string): string => {
    return displayName
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100);
};

/**
 * Single-page modal for creating a new Presentation Definition.
 * Collects displayName, identifier (auto-derived from displayName, manually overridable),
 * description, and credential type.
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
    const [ displayName, setDisplayName ] = useState<string>("");
    const [ identifier, setIdentifier ] = useState<string>("");
    const [ isIdentifierManuallySet, setIsIdentifierManuallySet ] = useState<boolean>(false);
    const [ description, setDescription ] = useState<string>("");
    const [ credentialType, setCredentialType ] = useState<string>("");
    const [ format, setFormat ] = useState<string>("dc+sd-jwt");

    const [ displayNameError, setDisplayNameError ] = useState<string>("");
    const [ identifierError, setIdentifierError ] = useState<string>("");
    const [ credentialTypeError, setCredentialTypeError ] = useState<string>("");

    const validateIdentifier: (value: string) => string = useCallback((value: string): string => {
        if (!value.trim()) {
            return t("common:required");
        }
        if (!IDENTIFIER_PATTERN.test(value)) {
            return t("presentationDefinitions:wizard.form.identifier.validationError");
        }

        return "";
    }, [ t ]);

    const handleDisplayNameChange: (newDisplayName: string) => void = useCallback(
        (newDisplayName: string): void => {
            setDisplayName(newDisplayName);
            setDisplayNameError("");
            if (!isIdentifierManuallySet) {
                const derived: string = deriveIdentifier(newDisplayName);

                setIdentifier(derived);
                if (derived) {
                    setIdentifierError(validateIdentifier(derived));
                }
            }
        }, [ isIdentifierManuallySet, validateIdentifier ]);

    const handleIdentifierChange: (newIdentifier: string) => void = useCallback(
        (newIdentifier: string): void => {
            setIsIdentifierManuallySet(true);
            setIdentifier(newIdentifier);
            setIdentifierError(validateIdentifier(newIdentifier));
        }, [ validateIdentifier ]);

    const handleCreate: () => void = useCallback((): void => {
        let hasError: boolean = false;

        if (!displayName.trim()) {
            setDisplayNameError(t("common:required"));
            hasError = true;
        }

        const identifierValidationError: string = validateIdentifier(identifier);

        if (identifierValidationError) {
            setIdentifierError(identifierValidationError);
            hasError = true;
        }
        if (!credentialType.trim()) {
            setCredentialTypeError(t("common:required"));
            hasError = true;
        }
        if (hasError) return;

        setIsSubmitting(true);

        const definitionData: PresentationDefinitionCreationModelInterface = {
            credentials: [ {
                format,
                id: credentialType.trim().toLowerCase()
                    .replace(/[^a-z0-9_-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                type: credentialType.trim()
            } ],
            description: description.trim() || undefined,
            displayName: displayName.trim(),
            identifier: identifier.trim()
        };

        addPresentationDefinition(definitionData)
            .then((response: PresentationDefinitionInterface): void => {
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
                closeWizard();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>): void => {
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
            .finally((): void => {
                setIsSubmitting(false);
            });
    }, [ displayName, identifier, description, credentialType, format, validateIdentifier, closeWizard ]);

    return (
        <Dialog
            open={ true }
            fullWidth
            maxWidth="sm"
            onClose={ (_: unknown, reason: string): void => {
                if (reason !== "backdropClick") {
                    closeWizard();
                }
            } }
            data-componentid={ componentId }
        >
            <DialogTitle>
                { t("presentationDefinitions:wizard.title") }
            </DialogTitle>
            <DialogContent dividers sx={ { paddingY: 2 } }>
                <Stack direction="column" spacing={ 2 }>
                    <div>
                        <TextField
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            label={ t("presentationDefinitions:wizard.form.displayName.label") }
                            placeholder={ t(
                                "presentationDefinitions:wizard.form.displayName.placeholder"
                            ) }
                            value={ displayName }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                handleDisplayNameChange(e.target.value)
                            }
                            error={ !!displayNameError }
                            helperText={ displayNameError || undefined }
                            InputLabelProps={ { required: true } }
                            data-componentid={ `${ componentId }-display-name-field` }
                        />
                        <Hint compact>
                            { t("presentationDefinitions:wizard.form.displayName.hint") }
                        </Hint>
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            label={ t("presentationDefinitions:wizard.form.identifier.label") }
                            placeholder={ t(
                                "presentationDefinitions:wizard.form.identifier.placeholder"
                            ) }
                            value={ identifier }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                handleIdentifierChange(e.target.value)
                            }
                            error={ !!identifierError }
                            helperText={ identifierError || undefined }
                            inputProps={ { maxLength: 100 } }
                            InputLabelProps={ { required: true } }
                            data-componentid={ `${ componentId }-identifier-field` }
                        />
                        <Hint compact>
                            { t("presentationDefinitions:wizard.form.identifier.hint") }
                        </Hint>
                    </div>
                    <TextField
                        fullWidth
                        size="small"
                        margin="dense"
                        label={ t("presentationDefinitions:wizard.form.description.label") }
                        placeholder={ t(
                            "presentationDefinitions:wizard.form.description.placeholder"
                        ) }
                        value={ description }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                            setDescription(e.target.value)
                        }
                        multiline
                        rows={ 2 }
                        data-componentid={ `${ componentId }-description-field` }
                    />
                    <div>
                        <TextField
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            label={ t("presentationDefinitions:wizard.form.credentialType.label") }
                            placeholder={ t(
                                "presentationDefinitions:wizard.form.credentialType.placeholder"
                            ) }
                            value={ credentialType }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => {
                                setCredentialType(e.target.value);
                                setCredentialTypeError("");
                            } }
                            error={ !!credentialTypeError }
                            helperText={ credentialTypeError || undefined }
                            InputLabelProps={ { required: true } }
                            data-componentid={ `${ componentId }-credential-type-field` }
                        />
                        <Hint compact>
                            { t("presentationDefinitions:wizard.form.credentialType.hint") }
                        </Hint>
                    </div>
                    <div>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            margin="dense"
                            label={ t("presentationDefinitions:wizard.form.format.label") }
                            value={ format }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                setFormat(e.target.value)
                            }
                            data-componentid={ `${ componentId }-format-field` }
                        >
                            <MenuItem value="dc+sd-jwt">dc+sd-jwt</MenuItem>
                        </TextField>
                        <Hint compact>
                            { t("presentationDefinitions:wizard.form.format.hint") }
                        </Hint>
                    </div>
                </Stack>
            </DialogContent>
            <DialogActions sx={ { paddingX: 2, paddingY: 1.5 } }>
                <LinkButton
                    onClick={ closeWizard }
                    data-componentid={ `${ componentId }-cancel-button` }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    loading={ isSubmitting }
                    disabled={ isSubmitting }
                    onClick={ handleCreate }
                    data-componentid={ `${ componentId }-create-button` }
                >
                    { t("presentationDefinitions:wizard.form.submitButton") }
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddPresentationDefinitionWizard;
