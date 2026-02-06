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
import { AppConstants as CommonAppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertInterface, AlertLevels, Claim, ExternalClaim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form/src";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
    PageLayout,
    PrimaryButton,
    ResourceTab
} from "@wso2is/react-components";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import {
    deleteVCTemplate,
    updateVCTemplate
} from "../api/verifiable-credentials";
import { ClaimAttributeOption } from "../components/claim-attribute-option";
import { VCTemplateOffer } from "../components/vc-template-offer";
import { VerifiableCredentialsConstants } from "../constants/verifiable-credentials";
import { useGetVCTemplate } from "../hooks/use-get-vc-template";
import { VCTemplateUpdateModel } from "../models/verifiable-credentials";
import "./vc-template-edit.scss";

/**
 * Prop types for the VC Template Edit page component.
 */
type VCTemplateEditPageProps = IdentifiableComponentInterface;

/**
 * Form values interface for the VC template edit form.
 */
interface VCTemplateEditFormValues {
    displayName: string;
    format: string;
    expiresIn: number | string;
}

const FORM_ID: string = "vc-template-edit-form";

/**
 * Base64 encoded value of http://wso2.org/vc/claim
 */
const VC_CLAIM_DIALECT_ID: string = "aHR0cDovL3dzbzIub3JnL3ZjL2NsYWlt";
const DEFAULT_VC_FORMAT: string = VerifiableCredentialsConstants.CREDENTIAL_FORMATS.VC_SD_JWT;

/**
 * VC Template Edit page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const VCTemplateEditPage: FunctionComponent<VCTemplateEditPageProps> = ({
    "data-componentid": componentId = "vc-template-edit"
}: VCTemplateEditPageProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ templateId, setTemplateId ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ localClaims, setLocalClaims ] = useState<Claim[]>([]);
    const [ externalClaims, setExternalClaims ] = useState<ExternalClaim[]>([]);
    const [ claimAttributes, setClaimAttributes ] = useState<ExternalClaim[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ isClaimsLoading, setIsClaimsLoading ] = useState<boolean>(true);

    /**
     * Get the template ID from the URL path.
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[path.length - 1];

        setTemplateId(id);
    }, []);

    /**
     * Fetch the VC template using the useGetVCTemplate hook.
     */
    const {
        data: vcTemplate,
        isLoading,
        error: fetchError,
        mutate: mutateVCTemplate
    } = useGetVCTemplate(templateId, !!templateId);

    /**
     * Handle errors from the VC template fetch.
     */
    useEffect(() => {
        if (fetchError) {
            dispatch(addAlert<AlertInterface>({
                description: t("verifiableCredentials:notifications.fetchTemplate.error.description"),
                level: AlertLevels.ERROR,
                message: t("verifiableCredentials:notifications.fetchTemplate.error.message")
            }));
        }
    }, [ fetchError ]);

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
     * Initialize selected claims when template and claims are loaded.
     */
    useEffect(() => {
        if (!vcTemplate || !claimAttributes || claimAttributes.length === 0) {
            return;
        }

        const selected: ExternalClaim[] = claimAttributes.filter((claim: ExternalClaim) =>
            vcTemplate.claims?.includes(claim.claimURI)
        );

        setSelectedClaims(selected);
    }, [ vcTemplate, claimAttributes ]);

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
     * Validates the display name field.
     *
     * @param value - Display name value.
     * @returns Error message if invalid, undefined if valid.
     */
    const validateDisplayName = (value: string): string | undefined => {
        if (!value) {
            return t("common:required");
        }

        return undefined;
    };

    /**
     * Validates the validity period field.
     *
     * @param value - Validity period value.
     * @returns Error message if invalid, undefined if valid.
     */
    const validateExpiresIn = (value: number | string): string | undefined => {
        if (value === undefined || value === null || value === "") {
            return t("common:required");
        }

        return undefined;
    };

    /**
     * Validates the form fields.
     *
     * @param values - Form values to validate.
     * @returns A partial object containing validation errors.
     */
    const validateForm = (values: VCTemplateEditFormValues): Partial<VCTemplateEditFormValues> => {
        const errors: Partial<VCTemplateEditFormValues> = {};

        const displayNameError: string | undefined = validateDisplayName(values?.displayName);

        if (displayNameError) {
            errors.displayName = displayNameError;
        }

        const expiresInError: string | undefined = validateExpiresIn(values?.expiresIn);

        if (expiresInError) {
            errors.expiresIn = expiresInError;
        }

        return errors;
    };

    /**
     * Handle form submission for updating the VC template.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: VCTemplateEditFormValues): void => {
        setIsSubmitting(true);

        const updateData: VCTemplateUpdateModel = {
            claims: selectedClaims.map((claim: ExternalClaim) => claim.claimURI),
            displayName: values.displayName,
            expiresIn: Number(values.expiresIn),
            format: values.format || DEFAULT_VC_FORMAT
        };

        updateVCTemplate(templateId, updateData)
            .then(() => {
                mutateVCTemplate();
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.updateTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.updateTemplate.success.message")
                }));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.updateTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.updateTemplate.error.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handle deleting the VC template.
     */
    const handleDelete = (): void => {
        setIsDeleting(true);

        deleteVCTemplate(templateId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.deleteTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.deleteTemplate.success.message")
                }));

                setShowDeleteConfirmation(false);
                history.push(CommonAppConstants.getPaths().get("VC_TEMPLATES"));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.deleteTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.deleteTemplate.error.message")
                }));
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(CommonAppConstants.getPaths().get("VC_TEMPLATES"));
    };

    if (isLoading || !vcTemplate) {
        return (
            <PageLayout
                pageTitle={ t("verifiableCredentials:editPage.title") }
                title={ t("verifiableCredentials:editPage.title") }
                data-componentid={ `${componentId}-page-layout` }
            >
                <ContentLoader />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            pageTitle={ vcTemplate?.displayName || t("verifiableCredentials:editPage.title") }
            title={ vcTemplate?.displayName || t("verifiableCredentials:editPage.title") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("verifiableCredentials:editPage.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${componentId}-page-layout` }
        >
            <ResourceTab
                panes={ [
                    {
                        componentId: "general",
                        menuItem: t("verifiableCredentials:editPage.tabs.general"),
                        render: () => (
                            <ResourceTab.Pane controlledSegmentation>
                                <FinalForm
                                    onSubmit={ handleFormSubmit }
                                    validate={ validateForm }
                                    initialValues={ {
                                        displayName: vcTemplate?.displayName,
                                        expiresIn: vcTemplate?.expiresIn?.toString(),
                                        format: vcTemplate?.format || DEFAULT_VC_FORMAT
                                    } }
                                    render={ ({ handleSubmit }: FormRenderProps) => (
                                        <EmphasizedSegment padded="very">
                                            <form
                                                id={ FORM_ID }
                                                onSubmit={ handleSubmit }
                                            >
                                                <Grid className="vc-template-edit-form-grid">
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <FinalFormField
                                                                key="displayName"
                                                                label={ t("verifiableCredentials:editPage.form" +
                                                                    ".displayName.label") }
                                                                width={ 16 }
                                                                FormControlProps={ {
                                                                    margin: "none"
                                                                } }
                                                                ariaLabel="displayName"
                                                                required={ true }
                                                                data-componentid={ `${componentId}-display-name-input` }
                                                                name="displayName"
                                                                type="text"
                                                                placeholder={
                                                                    t("verifiableCredentials:editPage.form." +
                                                                        "displayName.placeholder")
                                                                }
                                                                component={ TextFieldAdapter }
                                                                maxLength={ 255 }
                                                                minLength={ 1 }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <label className="form-label">
                                                                { t("verifiableCredentials:editPage.form"+
                                                                    ".identifier.label") }
                                                            </label>
                                                            <CopyInputField
                                                                value={ vcTemplate?.identifier || "" }
                                                                data-componentid={
                                                                    `${componentId}-identifier-copy-field`
                                                                }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <FinalFormField
                                                                key="format"
                                                                label={ t("verifiableCredentials:editPage.form" +
                                                                    ".format.label") }
                                                                width={ 16 }
                                                                FormControlProps={ {
                                                                    className: "vc-template-edit-format-control",
                                                                    margin: "none"
                                                                } }
                                                                ariaLabel="format"
                                                                required={ true }
                                                                data-componentid={ `${componentId}-format-dropdown` }
                                                                name="format"
                                                                margin="none"
                                                                displayEmpty={ true }
                                                                placeholder={
                                                                    t("verifiableCredentials:editPage.form" +
                                                                        ".format.placeholder")
                                                                }
                                                                component={ SelectFieldAdapter }
                                                                options={ [
                                                                    {
                                                                        text: t(
                                                                            "verifiableCredentials:editPage.form" +
                                                                            ".format.options.vcSdJwt"
                                                                        ),
                                                                        value: VerifiableCredentialsConstants
                                                                            .CREDENTIAL_FORMATS.VC_SD_JWT
                                                                    },
                                                                    {
                                                                        text: t(
                                                                            "verifiableCredentials:editPage.form" +
                                                                            ".format.options.jwtVcJson"
                                                                        ),
                                                                        value: VerifiableCredentialsConstants
                                                                            .CREDENTIAL_FORMATS.JWT_VC_JSON
                                                                    }
                                                                ] }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <FinalFormField
                                                                key="expiresIn"
                                                                label={ t("verifiableCredentials:editPage.form." +
                                                                    "expiresIn.label") }
                                                                width={ 16 }
                                                                FormControlProps={ {
                                                                    margin: "none"
                                                                } }
                                                                ariaLabel="expiresIn"
                                                                required={ true }
                                                                data-componentid={ `${componentId}-expires-in-input` }
                                                                name="expiresIn"
                                                                type="number"
                                                                placeholder={
                                                                    t("verifiableCredentials:editPage.form.expiresIn." +
                                                                        "placeholder")
                                                                }
                                                                helperText={
                                                                    (<Hint className="hint" compact>
                                                                        { t("verifiableCredentials:editPage.form." +
                                                                            "expiresIn.hint") }
                                                                    </Hint>)
                                                                }
                                                                component={ TextFieldAdapter }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <div className="vc-template-edit-claims-section">
                                                                <label className="form-label">
                                                                    { t("verifiableCredentials:editPage.form.claims." +
                                                                        "label") }
                                                                </label>
                                                                <Autocomplete
                                                                    className="vc-claims-dropdown"
                                                                    size="small"
                                                                    disablePortal
                                                                    multiple
                                                                    disableCloseOnSelect
                                                                    loading={ isClaimsLoading }
                                                                    options={ claimAttributes }
                                                                    value={ selectedClaims }
                                                                    data-componentid={
                                                                        `${componentId}-claims-dropdown`
                                                                    }
                                                                    getOptionLabel={ (claim: ExternalClaim) =>
                                                                        claim.localClaimDisplayName || claim.claimURI
                                                                    }
                                                                    renderInput={ (
                                                                        params: AutocompleteRenderInputParams
                                                                    ) => (
                                                                        <TextField
                                                                            { ...params }
                                                                            className="vc-claims-dropdown-input"
                                                                            placeholder={
                                                                                t("verifiableCredentials:editPage."+
                                                                                    "form.claims.placeholder")
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
                                                                    { t("verifiableCredentials:editPage.form.claims." +
                                                                        "hint") }
                                                                </Hint>
                                                            </div>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <label className="form-label">
                                                                { t("verifiableCredentials:editPage.form.offer.label") }
                                                            </label>
                                                            <VCTemplateOffer
                                                                template={ vcTemplate }
                                                                onUpdate={ () => mutateVCTemplate() }
                                                                data-componentid={ `${componentId}-offer` }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                                            <PrimaryButton
                                                                type="submit"
                                                                aria-label="update"
                                                                size="small"
                                                                disabled={ isSubmitting }
                                                                loading={ isSubmitting }
                                                                data-componentid={ `${componentId}-update-button` }
                                                            >
                                                                { t("common:update") }
                                                            </PrimaryButton>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </form>
                                        </EmphasizedSegment>
                                    ) }
                                />
                                <Divider hidden />
                                <DangerZoneGroup
                                    sectionHeader={ t("verifiableCredentials:editPage.dangerZone.header") }
                                >
                                    <DangerZone
                                        actionTitle={ t("verifiableCredentials:editPage.dangerZone.delete." +
                                            "actionTitle") }
                                        header={ t("verifiableCredentials:editPage.dangerZone.delete.header") }
                                        subheader={ t("verifiableCredentials:editPage.dangerZone.delete.subheader") }
                                        onActionClick={ () => setShowDeleteConfirmation(true) }
                                        data-componentid={ `${componentId}-danger-zone` }
                                    />
                                </DangerZoneGroup>
                            </ResourceTab.Pane>
                        )
                    }
                ] }
            />

            <ConfirmationModal
                primaryActionLoading={ isDeleting }
                open={ showDeleteConfirmation }
                onClose={ () => setShowDeleteConfirmation(false) }
                type="negative"
                assertionHint={ t("verifiableCredentials:editPage.confirmations.deleteTemplate.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                onPrimaryActionClick={ handleDelete }
                data-componentid={ `${componentId}-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </PageLayout>
    );
};

export default VCTemplateEditPage;
