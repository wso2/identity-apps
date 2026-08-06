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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Switch from "@oxygen-ui/react/Switch";
import MuiTextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Button, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Icon, Modal } from "semantic-ui-react";
import { ClaimConstraintModel, RequestedCredentialModel }
    from "../models/presentation-definitions";

/**
 * Internal state for a single claim row — path stored as dot-notation string for the input,
 * converted to string[] on save.
 */
interface ClaimDraft {
    pathDotNotation: string;
    mandatory: boolean;
    allowedValues: string[];
}

interface CredentialEditDialogPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    onClose: () => void;
    onSave: (credential: RequestedCredentialModel) => void;
    editingCredential?: RequestedCredentialModel;
    isAdd?: boolean;
}

/**
 * Dialog for adding or editing a requested credential entry.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const CredentialEditDialog: FunctionComponent<CredentialEditDialogPropsInterface> = ({
    open,
    onClose,
    onSave,
    editingCredential,
    isAdd = false,
    "data-componentid": componentId = "credential-edit-dialog"
}: CredentialEditDialogPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ credentialId, setCredentialId ] = useState<string>("");
    const [ type, setType ] = useState<string>("");
    const [ purpose, setPurpose ] = useState<string>("");
    const [ claimDrafts, setClaimDrafts ] = useState<ClaimDraft[]>([]);
    const [ enforceTrustedIssuer, setEnforceTrustedIssuer ] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setCredentialId(editingCredential?.id ?? "");
        setType(editingCredential?.type ?? "");
        setPurpose(editingCredential?.purpose ?? "");

        const drafts: ClaimDraft[] = (editingCredential?.claims ?? []).map(
            (c: ClaimConstraintModel): ClaimDraft => {
                const pathArray: string[] = c.path ?? (c.name ? [ c.name ] : []);

                return {
                    allowedValues: c.allowedValues ?? [],
                    mandatory: c.mandatory ?? true,
                    pathDotNotation: pathArray.join(".")
                };
            }
        );

        setClaimDrafts(drafts);
        setEnforceTrustedIssuer(editingCredential?.enforceTrustedIssuer ?? false);
    }, [ open, editingCredential ]);

    const addClaimDraft = (): void => {
        setClaimDrafts((prev: ClaimDraft[]) => [
            ...prev,
            { allowedValues: [], mandatory: true, pathDotNotation: "" }
        ]);
    };

    const removeClaimDraft = (index: number): void => {
        setClaimDrafts((prev: ClaimDraft[]) =>
            prev.filter((_: ClaimDraft, i: number) => i !== index)
        );
    };

    const updateClaimPath = (index: number, value: string): void => {
        setClaimDrafts((prev: ClaimDraft[]) => {
            const updated: ClaimDraft[] = [ ...prev ];

            updated[index] = { ...updated[index], pathDotNotation: value };

            return updated;
        });
    };

    const updateClaimMandatory = (index: number, mandatory: boolean): void => {
        setClaimDrafts((prev: ClaimDraft[]) => {
            const updated: ClaimDraft[] = [ ...prev ];

            updated[index] = { ...updated[index], mandatory };

            return updated;
        });
    };

    const updateClaimAllowedValues = (index: number, allowedValues: string[]): void => {
        setClaimDrafts((prev: ClaimDraft[]) => {
            const updated: ClaimDraft[] = [ ...prev ];

            updated[index] = { ...updated[index], allowedValues };

            return updated;
        });
    };

    const handleSave = (): void => {
        if (!credentialId.trim() || !type.trim()) {
            return;
        }

        const validClaims: ClaimConstraintModel[] = claimDrafts
            .map((draft: ClaimDraft): ClaimConstraintModel => ({
                allowedValues: draft.allowedValues,
                mandatory: draft.mandatory,
                path: draft.pathDotNotation.trim().split(".").map((s: string) => s.trim()).filter(Boolean)
            }))
            .filter((c: ClaimConstraintModel) => (c.path ?? []).length > 0);

        onSave({
            claims: validClaims,
            enforceTrustedIssuer: enforceTrustedIssuer,
            id: credentialId.trim(),
            purpose: purpose.trim() || undefined,
            type: type.trim()
        });
    };

    return (
        <Modal
            data-componentid={ componentId }
            open={ open }
            className="wizard"
            dimmer="blurring"
            size="small"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>
                { isAdd
                    ? t("presentationDefinitions:editPage.form.credentials.addCredential.title")
                    : t("presentationDefinitions:editPage.form.credentials.editCredential.title")
                }
            </Modal.Header>
            <Modal.Content scrolling>
                <MuiTextField
                    fullWidth
                    size="small"
                    label={ t("presentationDefinitions:editPage.form.credentials.credentialId.label") }
                    placeholder={ t("presentationDefinitions:editPage.form.credentials.credentialId.placeholder") }
                    value={ credentialId }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setCredentialId(e.target.value) }
                    required
                    disabled={ !isAdd }
                    helperText={ isAdd
                        ? t("presentationDefinitions:editPage.form.credentials.credentialId.hint")
                        : undefined
                    }
                    sx={ { mb: 2 } }
                    data-componentid={ `${componentId}-credential-id-field` }
                />
                <MuiTextField
                    fullWidth
                    size="small"
                    label={ t("presentationDefinitions:editPage.form.credentials.type.label") }
                    placeholder={ t("presentationDefinitions:editPage.form.credentials.type.placeholder") }
                    value={ type }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value) }
                    required
                    sx={ { mb: 2 } }
                    data-componentid={ `${componentId}-type-field` }
                />
                <MuiTextField
                    fullWidth
                    size="small"
                    label={ t("presentationDefinitions:editPage.form.credentials.purpose.label") }
                    placeholder={ t("presentationDefinitions:editPage.form.credentials.purpose.placeholder") }
                    value={ purpose }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPurpose(e.target.value) }
                    sx={ { mb: 2 } }
                    data-componentid={ `${componentId}-purpose-field` }
                />

                <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 0.5 } }>
                    { t("presentationDefinitions:editPage.form.credentials.claims.label") }
                </Typography>
                <Hint>
                    { t("presentationDefinitions:editPage.form.credentials.claims.hint") }
                </Hint>

                { claimDrafts.map((draft: ClaimDraft, index: number) => (
                    <Box
                        key={ index }
                        sx={ {
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1,
                            mt: 1,
                            p: 1.5
                        } }
                        data-componentid={ `${componentId}-claim-row-${index}` }
                    >
                        <Box sx={ { alignItems: "flex-start", display: "flex", gap: 1 } }>
                            <MuiTextField
                                fullWidth
                                size="small"
                                label={ t(
                                    "presentationDefinitions:editPage.form.credentials.claims.claimPath.label"
                                ) }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.credentials.claims.claimPath.placeholder"
                                ) }
                                value={ draft.pathDotNotation }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateClaimPath(index, e.target.value)
                                }
                                data-componentid={ `${componentId}-claim-${index}-path` }
                            />
                            <Box sx={ { flexShrink: 0, mt: 1 } }>
                                <Icon
                                    link
                                    name="close"
                                    color="grey"
                                    size="small"
                                    onClick={ () => removeClaimDraft(index) }
                                    aria-label="remove claim"
                                    data-componentid={ `${componentId}-claim-${index}-remove` }
                                />
                            </Box>
                        </Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ draft.mandatory }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateClaimMandatory(index, e.target.checked)
                                    }
                                    size="small"
                                    data-componentid={ `${componentId}-claim-${index}-mandatory` }
                                />
                            }
                            label={ t(
                                "presentationDefinitions:editPage.form.credentials.claims.mandatory.label"
                            ) }
                            sx={ { display: "flex", mb: 0.5, mt: 1 } }
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            options={ [] as string[] }
                            value={ draft.allowedValues }
                            onChange={ (_e: SyntheticEvent, newValue: string[]) =>
                                updateClaimAllowedValues(index, newValue)
                            }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <MuiTextField
                                    { ...params }
                                    label={ t(
                                        "presentationDefinitions:editPage.form.credentials.claims.allowedValues.label"
                                    ) }
                                    placeholder={ draft.allowedValues.length === 0
                                        ? t(
                                            "presentationDefinitions:editPage.form.credentials.claims.allowedValues.placeholder"
                                        )
                                        : undefined
                                    }
                                    size="small"
                                />
                            ) }
                            sx={ { mt: 1 } }
                            data-componentid={ `${componentId}-claim-${index}-allowed-values` }
                        />
                        <Hint>
                            { t(
                                "presentationDefinitions:editPage.form.credentials.claims.allowedValues.hint"
                            ) }
                        </Hint>
                    </Box>
                )) }

                <Button
                    basic
                    primary
                    size="mini"
                    type="button"
                    onClick={ addClaimDraft }
                    data-componentid={ `${componentId}-add-claim-button` }
                >
                    <Icon name="add" />
                    { t("presentationDefinitions:editPage.form.credentials.claims.addClaim") }
                </Button>

                <Divider hidden />
                <FormControlLabel
                    control={
                        <Switch
                            checked={ enforceTrustedIssuer }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                setEnforceTrustedIssuer(e.target.checked)
                            }
                            size="small"
                            data-componentid={ `${componentId}-enforce-trusted-issuer` }
                        />
                    }
                    label={ t(
                        "presentationDefinitions:editPage.issuerTrust.enforceTrustedIssuer.label",
                        "Enforce Trusted Issuer"
                    ) }
                    sx={ { display: "flex", mb: 0.5 } }
                />
                <Hint>
                    { t(
                        "presentationDefinitions:editPage.issuerTrust.enforceTrustedIssuer.dialogHint",
                        "When enabled, the credential's x5c chain must validate against a trusted root CA. " +
                        "Trusted CA certificates can be configured after saving."
                    ) }
                </Hint>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    className="link-button"
                    basic
                    primary
                    onClick={ onClose }
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    primary
                    disabled={ !credentialId.trim() || !type.trim() }
                    onClick={ handleSave }
                    data-componentid={ `${componentId}-save-button` }
                >
                    { t("common:save") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CredentialEditDialog;
