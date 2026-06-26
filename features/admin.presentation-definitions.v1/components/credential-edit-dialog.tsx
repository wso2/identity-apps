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
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import MuiTextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Button, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Icon, Modal } from "semantic-ui-react";
import { ClaimConstraintModel, RequestedCredentialModel } from "../models/presentation-definitions";

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

    const [ type, setType ] = useState<string>("");
    const [ purpose, setPurpose ] = useState<string>("");
    const [ claims, setClaims ] = useState<ClaimConstraintModel[]>([]);
    const [ enforceTrustedIssuers, setEnforceTrustedIssuers ] = useState<boolean>(false);
    const [ trustedIssuers, setTrustedIssuers ] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setType(editingCredential?.type ?? "");
            setPurpose(editingCredential?.purpose ?? "");
            setClaims(editingCredential?.claims ?? []);
            setEnforceTrustedIssuers(editingCredential?.enforceTrustedIssuers ?? false);
            setTrustedIssuers(editingCredential?.trustedIssuers ?? []);
        }
    }, [ open, editingCredential ]);

    const addClaim = (): void => {
        setClaims((prev: ClaimConstraintModel[]) => [
            ...prev,
            { allowedValues: [], mandatory: true, name: "" }
        ]);
    };

    const removeClaim = (index: number): void => {
        setClaims((prev: ClaimConstraintModel[]) => prev.filter(
            (_: ClaimConstraintModel, i: number) => i !== index
        ));
    };

    const updateClaimName = (index: number, name: string): void => {
        setClaims((prev: ClaimConstraintModel[]) => {
            const updated: ClaimConstraintModel[] = [ ...prev ];

            updated[index] = { ...updated[index], name };

            return updated;
        });
    };

    const updateClaimMandatory = (index: number, mandatory: boolean): void => {
        setClaims((prev: ClaimConstraintModel[]) => {
            const updated: ClaimConstraintModel[] = [ ...prev ];

            updated[index] = { ...updated[index], mandatory };

            return updated;
        });
    };

    const updateClaimAllowedValues = (index: number, allowedValues: string[]): void => {
        setClaims((prev: ClaimConstraintModel[]) => {
            const updated: ClaimConstraintModel[] = [ ...prev ];

            updated[index] = { ...updated[index], allowedValues };

            return updated;
        });
    };

    const handleSave = (): void => {
        if (!type.trim()) {
            return;
        }

        const validClaims: ClaimConstraintModel[] = claims
            .filter((c: ClaimConstraintModel) => c.name.trim() !== "")
            .map((c: ClaimConstraintModel) => ({
                allowedValues: c.allowedValues ?? [],
                mandatory: c.mandatory ?? true,
                name: c.name.trim()
            }));

        onSave({
            claims: validClaims,
            enforceTrustedIssuers,
            purpose: purpose.trim() || undefined,
            trustedIssuers: enforceTrustedIssuers ? trustedIssuers : [],
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

                <Typography variant="subtitle2" sx={ { mb: 0.5, fontWeight: 600 } }>
                    { t("presentationDefinitions:editPage.form.credentials.claims.label") }
                </Typography>
                <Hint>
                    { t("presentationDefinitions:editPage.form.credentials.claims.hint") }
                </Hint>

                { claims.map((claim: ClaimConstraintModel, index: number) => (
                    <Box
                        key={ index }
                        sx={ {
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1,
                            mt: 1,
                            p: 1.5,
                            position: "relative"
                        } }
                        data-componentid={ `${componentId}-claim-row-${index}` }
                    >
                        <IconButton
                            size="small"
                            sx={ { position: "absolute", right: 4, top: 4, zIndex: 10 } }
                            onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                removeClaim(index);
                            } }
                            aria-label="remove claim"
                            data-componentid={ `${componentId}-claim-${index}-remove` }
                        >
                            <Icon name="close" />
                        </IconButton>
                        <MuiTextField
                            fullWidth
                            size="small"
                            label={ t(
                                "presentationDefinitions:editPage.form.credentials.claims.claimName.label"
                            ) }
                            placeholder={ t(
                                "presentationDefinitions:editPage.form.credentials.claims.claimName.placeholder"
                            ) }
                            value={ claim.name }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                updateClaimName(index, e.target.value)
                            }
                            sx={ { mb: 1, pr: 4 } }
                            data-componentid={ `${componentId}-claim-${index}-name` }
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ claim.mandatory ?? true }
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
                            sx={ { mb: 0.5 } }
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            options={ [] as string[] }
                            value={ claim.allowedValues ?? [] }
                            onChange={ (_e: SyntheticEvent, newValue: string[]) =>
                                updateClaimAllowedValues(index, newValue)
                            }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <MuiTextField
                                    { ...params }
                                    label={ t(
                                        "presentationDefinitions:editPage.form.credentials.claims.allowedValues.label"
                                    ) }
                                    placeholder={ (claim.allowedValues ?? []).length === 0
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
                    onClick={ addClaim }
                    data-componentid={ `${componentId}-add-claim-button` }
                >
                    <Icon name="add" />
                    { t("presentationDefinitions:editPage.form.credentials.claims.addClaim") }
                </Button>

                <Divider hidden />
                <FormControlLabel
                    control={
                        <Switch
                            checked={ enforceTrustedIssuers }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                setEnforceTrustedIssuers(e.target.checked)
                            }
                            size="small"
                            data-componentid={ `${componentId}-enforce-issuers-switch` }
                        />
                    }
                    label={ t("presentationDefinitions:editPage.form.credentials.enforceTrustedIssuers.label") }
                    sx={ { mb: 0.5 } }
                />
                <Hint>
                    { t("presentationDefinitions:editPage.form.credentials.enforceTrustedIssuers.hint") }
                </Hint>
                { enforceTrustedIssuers && (
                    <>
                        <Divider hidden />
                        <Autocomplete
                            multiple
                            freeSolo
                            options={ [] as string[] }
                            value={ trustedIssuers }
                            onChange={ (_e: SyntheticEvent, newValue: string[]) => setTrustedIssuers(newValue) }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <MuiTextField
                                    { ...params }
                                    label={ t(
                                        "presentationDefinitions:editPage.form.credentials.trustedIssuers.label"
                                    ) }
                                    placeholder={ trustedIssuers.length === 0
                                        ? t(
                                            "presentationDefinitions:editPage.form.credentials.trustedIssuers.placeholder"
                                        )
                                        : undefined
                                    }
                                    size="small"
                                />
                            ) }
                            sx={ { mb: 1 } }
                            data-componentid={ `${componentId}-trusted-issuers-autocomplete` }
                        />
                        <Hint>
                            { t("presentationDefinitions:editPage.form.credentials.trustedIssuers.hint") }
                        </Hint>
                    </>
                ) }
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
                    disabled={ !type.trim() }
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
