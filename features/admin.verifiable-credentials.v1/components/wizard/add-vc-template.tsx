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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { getAllExternalClaims, getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { AlertInterface, AlertLevels, Claim, ExternalClaim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { Button, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { HTMLAttributes, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Modal } from "semantic-ui-react";
import { addVCTemplate } from "../../api/verifiable-credentials";
import { VCTemplate, VCTemplateCreationModel } from "../../models/verifiable-credentials";
import { ClaimAttributeOption } from "../claim-attribute-option";
import "./add-vc-template.scss";

/**
 * Prop types for the Add VC Template Wizard component.
 */
interface AddVCTemplateWizardProps extends IdentifiableComponentInterface {
    /**
     * Callback to close the wizard.
     */
    closeWizard: () => void;
    /**
     * Callback to refresh the list after successful creation.
     */
    onSuccess?: () => void;
}

/**
 * Form values for the VC template creation.
 */
interface VCTemplateFormValues {
    identifier: string;
    displayName: string;
}

/**
 * Base64 encoded value of http://wso2.org/vc/claim
 */
const VC_CLAIM_DIALECT_ID: string = "aHR0cDovL3dzbzIub3JnL3ZjL2NsYWlt";

/**
 * Add Verifiable Credential Template Wizard component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export default function AddVCTemplateWizard({
    closeWizard,
    onSuccess,
    [ "data-componentid" ]: componentId = "add-vc-template-wizard"
}: AddVCTemplateWizardProps): ReactElement {
    const { t } = useTranslation();
    const dispatch: any = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ localClaims, setLocalClaims ] = useState<Claim[]>([]);
    const [ externalClaims, setExternalClaims ] = useState<ExternalClaim[]>([]);
    const [ claimAttributes, setClaimAttributes ] = useState<ExternalClaim[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ isClaimsLoading, setIsClaimsLoading ] = useState<boolean>(true);

    /**
     * Fetch local and external claims on component mount.
     */
    useEffect(() => {
        fetchLocalClaims();
        fetchExternalClaims();
    }, []);

    /**
     * Map external claims with local claim display names.
     */
    useEffect(() => {
        if (localClaims?.length > 0 && externalClaims?.length > 0) {
            const updatedAttributes: ExternalClaim[] = externalClaims.map((externalClaim: ExternalClaim) => {
                const matchedLocalClaim: Claim = localClaims.find((localClaim: Claim) =>
                    localClaim.claimURI === externalClaim.mappedLocalClaimURI
                );

                if (matchedLocalClaim?.displayName) {
                    return {
                        ...externalClaim,
                        localClaimDisplayName: matchedLocalClaim.displayName
                    };
                }

                return externalClaim;
            });

            setClaimAttributes(updatedAttributes);
        }
    }, [ localClaims, externalClaims ]);

    /**
     * Fetch local claims.
     */
    const fetchLocalClaims = (): void => {
        getAllLocalClaims(null)
            .then((response: Claim[]) => {
                setLocalClaims(response);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.fetchClaims.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.fetchClaims.error.message")
                }));
            });
    };

    /**
     * Fetch external claims from VC dialect.
     */
    const fetchExternalClaims = (): void => {
        setIsClaimsLoading(true);

        getAllExternalClaims(VC_CLAIM_DIALECT_ID, null)
            .then((response: ExternalClaim[]) => {
                setExternalClaims(response);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.fetchClaims.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.fetchClaims.error.message")
                }));
            })
            .finally(() => {
                setIsClaimsLoading(false);
            });
    };

    /**
     * Validates the identifier to ensure it doesn't contain spaces.
     *
     * @param value - Identifier value.
     * @returns Error message if invalid, undefined if valid.
     */
    const validateIdentifier = (value: string): string | undefined => {
        if (value && value.match(/\s/) !== null) {
            return t("verifiableCredentials:wizard.form.identifier.validation");
        }

        return undefined;
    };

    /**
     * Handles the form submission.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: VCTemplateFormValues): void => {
        if (!values?.identifier) {
            return;
        }

        const validationError: string | undefined = validateIdentifier(values.identifier);

        if (validationError) {
            return;
        }

        setIsSubmitting(true);

        const templateData: VCTemplateCreationModel = {
            claims: selectedClaims.map((claim: ExternalClaim) => claim.claimURI),
            displayName: values.displayName || values.identifier,
            expiresIn: 31536000,
            format: "jwt_vc_json",
            identifier: values.identifier
        };

        addVCTemplate(templateData)
            .then((_response: VCTemplate) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.createTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.createTemplate.success.message")
                }));

                onSuccess?.();
                closeWizard();
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 409) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createTemplate.duplicateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createTemplate.duplicateError.message")
                    }));
                } else {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createTemplate.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createTemplate.error.message")
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ true }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ t("verifiableCredentials:wizard.title") }</Modal.Header>
            <Modal.Content>
                <FinalForm
                    onSubmit={ handleFormSubmit }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <form id="addVCTemplateForm" onSubmit={ handleSubmit }>
                                <FinalFormField
                                    name="identifier"
                                    label={ t("verifiableCredentials:wizard.form.identifier.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.identifier.placeholder") }
                                    required={ true }
                                    autoComplete="new-password"
                                    component={ TextFieldAdapter }
                                    helperText={ t("verifiableCredentials:wizard.form.identifier.hint") }
                                />
                                <FinalFormField
                                    label={ t("verifiableCredentials:wizard.form.displayName.label") }
                                    name="displayName"
                                    placeholder={ t("verifiableCredentials:wizard.form.displayName.placeholder") }
                                    required={ true }
                                    className="mt-3"
                                    autoComplete="new-password"
                                    component={ TextFieldAdapter }
                                    helperText={ t("verifiableCredentials:wizard.form.displayName.hint") }
                                />
                                <div className="vc-wizard-attributes-section">
                                    <label className="form-label">
                                        { t("verifiableCredentials:wizard.form.attributes.label") }
                                    </label>
                                    <Autocomplete
                                        className="vc-wizard-claims-dropdown"
                                        size="small"
                                        disablePortal
                                        multiple
                                        disableCloseOnSelect
                                        loading={ isClaimsLoading }
                                        options={ claimAttributes }
                                        value={ selectedClaims }
                                        data-componentid={ `${componentId}-claims-dropdown` }
                                        getOptionLabel={ (claim: ExternalClaim) =>
                                            claim.localClaimDisplayName || claim.claimURI
                                        }
                                        renderInput={ (
                                            params: AutocompleteRenderInputParams
                                        ) => (
                                            <TextField
                                                { ...params }
                                                className="vc-wizard-claims-dropdown-input"
                                                placeholder={
                                                    t("verifiableCredentials:wizard.form.attributes.placeholder")
                                                }
                                            />
                                        ) }
                                        onChange={ (
                                            _event: SyntheticEvent,
                                            newValue: ExternalClaim[]
                                        ) => {
                                            setSelectedClaims(newValue);
                                        } }
                                        isOptionEqualToValue={ (
                                            option: ExternalClaim,
                                            value: ExternalClaim
                                        ) =>
                                            option.claimURI === value.claimURI
                                        }
                                        renderTags={ (
                                            value: ExternalClaim[],
                                            getTagProps: AutocompleteRenderGetTagProps
                                        ) => value.map((
                                            option: ExternalClaim,
                                            index: number
                                        ) => (
                                            <Chip
                                                { ...getTagProps({ index }) }
                                                key={ option.claimURI }
                                                label={
                                                    option.localClaimDisplayName
                                                    || option.claimURI
                                                }
                                            />
                                        )) }
                                        renderOption={ (
                                            props: HTMLAttributes<HTMLLIElement>,
                                            option: ExternalClaim,
                                            { selected }: { selected: boolean }
                                        ) => (
                                            <ClaimAttributeOption
                                                selected={ selected }
                                                displayName={ option.localClaimDisplayName }
                                                claimURI={ option.claimURI }
                                                renderOptionProps={ props }
                                            />
                                        ) }
                                    />
                                    <Hint>
                                        { t("verifiableCredentials:wizard.form.attributes.hint") }
                                    </Hint>
                                </div>
                            </form>
                        );
                    } }
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
                            .getElementById("addVCTemplateForm")
                            .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                    } }
                    data-testid={ `${componentId}-create-button` }
                >
                    { t("verifiableCredentials:wizard.form.submitButton") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
