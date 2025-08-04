/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { TierLimitReachErrorModal } from "@wso2is/admin.core.v1/components/modals/tier-limit-reach-error-modal";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Heading, Hint, LinkButton, Message, PrimaryButton, Text } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { addOrganization, checkOrgHandleAvailability } from "../api";
import {
    ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    ORGANIZATION_DESCRIPTION_MIN_LENGTH,
    ORGANIZATION_NAME_MAX_LENGTH,
    ORGANIZATION_NAME_MIN_LENGTH,
    ORGANIZATION_TYPE,
    OrganizationManagementConstants
} from "../constants";
import { AddOrganizationInterface, CheckOrgHandleResponseInterface, GenericOrganization, OrganizationResponseInterface }
    from "../models";

interface OrganizationAddFormProps {
    name: string;
    orgHandle: string;
    description?: string;
}

/**
 * Prop types of the `AddOrganizationModal` component.
 */
export interface AddOrganizationModalPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
    parent?: GenericOrganization;
    /**
     * Callback to update the organization details.
     */
    onUpdate?: () => void;
}

const FORM_ID: string = "organization-add-modal-form";
const SUB_ORG_LEVELS_EXCEEDED_ERROR: string = "sub organization levels";

/**
 * An app creation wizard with only the minimal features.
 *
 * @param props - Props to be injected into the component.
 * @returns Functional component.
 */
export const AddOrganizationModal: FunctionComponent<AddOrganizationModalPropsInterface> = (
    props: AddOrganizationModalPropsInterface
): ReactElement => {
    const { closeWizard, parent, onUpdate, [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>("");

    const submitForm: any = useRef<() => void>();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);
    const [ orgLevelReachedError, setOrgLevelReachedError ] = useState<boolean>(false);
    const [ orgHandleError, setOrgHandleError ] = useState<string>("");
    const [ orgNameError, setOrgNameError ] = useState<string>("");
    const [ orgHandle, setOrgHandle ] = useState<string>();
    const [ isCheckingOrgHandleValidity, setCheckingOrgHandleValidity ] = useState<boolean>(false);
    const [ isOrgHandleDuplicate, setIsOrgHandleDuplicate ] = useState<boolean>(false);
    const [ isOrgHandleFieldFocused, setIsOrgHandleFieldFocused ] = useState<boolean>(false);

    const isOrgHandleDotExtensionMandatory: boolean = useSelector(
        (state: AppState) => state.config?.ui?.multiTenancy?.isTenantDomainDotExtensionMandatory
    );

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const isOrgHandleFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig.organizations,
        "organizations.orgHandle"
    );

    const submitOrganization = async (values: OrganizationAddFormProps): Promise<Record<string, string> | void> => {
        if (orgHandleError) {
            return;
        }
        const organization: AddOrganizationInterface = {
            description: values?.description,
            name: values?.name,
            orgHandle: isOrgHandleFeatureEnabled ? orgHandle : null,
            parentId: parent?.id ?? currentOrganization.id,
            type: ORGANIZATION_TYPE.TENANT
        };

        if (!organization.name) {
            return Promise.resolve({
                name: t("organizations:forms.addOrganization.name.validation.empty")
            });
        }
        if (isOrgHandleFeatureEnabled && isValidOrgHandle(organization.orgHandle)) {
            return Promise.resolve({
                orgHandle: orgHandleError
            });
        }

        setIsSubmitting(true);

        addOrganization(organization)
            .then(() => {
                eventPublisher.compute;
                closeWizard();
                dispatch(
                    addAlert({
                        description: t(
                            "organizations:notifications." +
                            "addOrganization.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "organizations:notifications." + "addOrganization.success.message"
                        )
                    })
                );
                if (onUpdate) {
                    onUpdate();
                }
            })
            .catch((error: any) => {
                if (error?.description) {
                    if (error.code === OrganizationManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()) {
                        if (error.description.includes(SUB_ORG_LEVELS_EXCEEDED_ERROR)) {
                            setOrgLevelReachedError(true);
                        }
                        setOpenLimitReachedModal(true);
                    } else if (error.code ===
                        OrganizationManagementConstants.ERROR_SUB_ORGANIZATION_EXIST.getErrorCode()) {
                        setOrgNameError(
                            t(OrganizationManagementConstants.ERROR_SUB_ORGANIZATION_EXIST.getErrorMessage(),
                                {
                                    description: error.description
                                }
                            ));
                    } else {
                        setError(t(
                            "organizations:notifications." +
                            "addOrganization.error.description",
                            {
                                description: error.description
                            }
                        ));
                    }
                } else {
                    setError(t(
                        "organizations:notifications." +
                                "addOrganization.genericError.description"
                    ));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Validates the organization handle and sets the error state if it is invalid.
     *
     * @param orgHandle - The organization handle to validate.
     * @returns boolean - True if the organization handle is invalid; false otherwise.
     */
    const isValidOrgHandle = (orgHandle: string): boolean => {

        // 1. Empty check.
        if (!orgHandle || orgHandle === OrganizationManagementConstants.ORG_HANDLE_PLACEHOLDER) {
            setOrgHandleError(t("organizations:forms.addOrganization.orgHandle.validation.empty"));

            return true;
        }

        // 2. First character must be an alphabet.
        if (!orgHandle.match(OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_FIRST_ALPHABET)) {
            setOrgHandleError(t("organizations:forms.addOrganization.orgHandle.validation.invalidFirstCharacter"));

            return true;
        }

        // 3. Length check.
        const minLength: number = OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_MIN_LENGTH;
        const maxLength: number = OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_MAX_LENGTH;

        if (orgHandle.length < minLength || orgHandle.length >= maxLength) {
            setOrgHandleError(t("organizations:forms.addOrganization.orgHandle.validation.invalidLength",
                { max: maxLength, min: minLength }));

            return true;
        }

        // 4. Alphanumeric check.
        const alphanumericValidationRegex: RegExp = isOrgHandleDotExtensionMandatory
            ? OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_ALPHANUMERIC_WITH_DOMAIN
            : OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_ALPHANUMERIC;

        if (!orgHandle.match(alphanumericValidationRegex)) {
            setOrgHandleError(t("organizations:forms.addOrganization.orgHandle.validation.invalidPattern"));

            return true;
        }

        // 5. Uniqueness check (async, but here just check the state).
        if (isCheckingOrgHandleValidity || isOrgHandleDuplicate) {
            setOrgHandleError(t("organizations:forms.addOrganization.orgHandle.validation.duplicate"));

            return true;
        }
        setOrgHandleError("");

        return false;
    };

    /**
     * Close the wizard.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * Close the limit reached modal.
     */
    const handleLimitReachedModalClose = (): void => {
        setOpenLimitReachedModal(false);
        setOrgLevelReachedError(false);
        handleWizardClose();
    };

    /**
     * Generate an organization handle based on the provided organization name.
     *
     * @param orgName - The name of the organization input.
     */
    const generateOrgHandle = (orgName: string): void => {

        if (isEmpty(orgName)) {
            setOrgHandleError("");
            setOrgHandle(undefined);
        } else {
            const sanitizedValue: string = orgName.trim().toLowerCase()
                .replace(OrganizationManagementConstants.ORG_HANDLE_SANITIZATION_REGEX, "");

            setAutoGeneratedOrgHandle(sanitizedValue);
        }
    };

    /**
     * Set an auto-generated organization handle.
     *
     * @param sanitizedValue - The sanitized organization name to generate the handle.
     */
    function setAutoGeneratedOrgHandle(sanitizedValue: string) {
        const autoGenOrgHandle:string = generateRandomOrgHandle(sanitizedValue);

        checkOrgHandleAvailability({ orgHandle: autoGenOrgHandle })
            .then((response: CheckOrgHandleResponseInterface) => {
                if (!response.available) {
                    // Org handle exists, try again.
                    setAutoGeneratedOrgHandle(sanitizedValue);
                } else {
                    setOrgHandleError("");
                    setOrgHandle(autoGenOrgHandle);
                }
            });
    }

    /**
     * Generate a random organization handle.
     *
     * @param sanitizedValue - The sanitized organization name to generate the handle.
     * @returns A randomly generated organization handle.
     */
    function generateRandomOrgHandle(sanitizedValue: string) {
        const randomString: string = Math.random().toString(36).substring(2, 6);

        const generateOrgHandle: string = sanitizedValue + randomString;

        if (isOrgHandleDotExtensionMandatory) {
            return generateOrgHandle + OrganizationManagementConstants.SAMPLE_ORG_HANDLE_DOMAIN_EXTENSION;
        }

        return generateOrgHandle;
    }

    /**
     * Function to render the validation status of first letter of organization handle being in alphabet.
     *
     * @returns Organization handle alphabet validation.
     */
    const renderOrgHandleAlphabetValidationIcon = (): ReactElement => {
        if (!orgHandle || orgHandle === OrganizationManagementConstants.ORG_HANDLE_PLACEHOLDER) {
            return <Icon name="circle" color="grey" />;
        }

        if (orgHandle.match(OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_FIRST_ALPHABET)) {
            return <Icon name="check circle" color="green"/>;
        }

        return isOrgHandleFieldFocused
            ? <Icon name="circle" color="grey"/>
            : <Icon name="remove circle" color="red"/>;
    };

    /**
     * Function to render the validation status of the length of organization handle.
     *
     * @returns Organization handle length validation.
     */
    const renderOrgHandleLengthValidationIcon = (): ReactElement => {
        if (!orgHandle || orgHandle === OrganizationManagementConstants.ORG_HANDLE_PLACEHOLDER) {
            return <Icon name="circle" color="grey" />;
        }

        const minLength: number = OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_MIN_LENGTH;
        const maxLength: number = OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_MAX_LENGTH;

        if (orgHandle.length >= minLength && orgHandle.length < maxLength) {
            return <Icon name="check circle" color="green" />;
        }

        return isOrgHandleFieldFocused
            ? <Icon name="circle" color="grey" />
            : <Icon name="remove circle" color="red" />;
    };

    /**
     * Function to render the validation status of the organization handle being alphanumeric.
     *
     * @returns Organization handle numerical validation.
     */
    const renderOrgHandleAlphanumericValidationIcon = (): ReactElement => {
        if (!orgHandle || orgHandle === OrganizationManagementConstants.ORG_HANDLE_PLACEHOLDER) {
            return <Icon name="circle" color="grey" />;
        }

        const alphanumericValidationRegex: RegExp = isOrgHandleDotExtensionMandatory
            ? OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_ALPHANUMERIC_WITH_DOMAIN
            : OrganizationManagementConstants.ORG_HANDLE_FIELD_CONSTRAINTS.ORG_HANDLE_ALPHANUMERIC;

        if (orgHandle.match(alphanumericValidationRegex)) {
            return <Icon name="check circle" color="green" />;
        }

        return isOrgHandleFieldFocused
            ? <Icon name="circle" color="grey" />
            : <Icon name="remove circle" color="red" />;
    };

    /**
     * Function to render the validation status of the organization handle being unique.
     *
     * @returns Organization handle unique validation.
     */
    const renderOrgHandleUniqueValidationIcon = (): ReactElement => {
        if (!orgHandle || orgHandle === OrganizationManagementConstants.ORG_HANDLE_PLACEHOLDER) {
            return <Icon name="circle" color="grey" />;
        }


        if (orgHandle && !isCheckingOrgHandleValidity && !isOrgHandleDuplicate) {
            return <Icon name="check circle" color="green" />;
        }

        return isOrgHandleFieldFocused
            ? <Icon name="circle" color="grey" />
            : <Icon name="remove circle" color="red" />;
    };

    /**
     * Validate the organization handle.
     *
     * @param orgHandle - The organization handle to validate.
     */
    const checkOrgHandleValidity: any = debounce(async (orgHandle: string) => {
        if (!orgHandle) {
            return;
        }
        setCheckingOrgHandleValidity(true);

        try {
            // Check availability.
            const response: CheckOrgHandleResponseInterface = await checkOrgHandleAvailability({ orgHandle });

            if (!response.available) {
                setIsOrgHandleDuplicate(true);
            } else {
                setIsOrgHandleDuplicate(false);
            }
        } finally {
            setCheckingOrgHandleValidity(false);
        }
    }, 1000);

    return (
        <>
            { openLimitReachedModal && (
                <TierLimitReachErrorModal
                    actionLabel={
                        orgLevelReachedError
                            ?
                            t("suborganizations:notifications.subOrgLevelsLimitReachedError." +
                        "emptyPlaceholder.action")
                            :
                            t("suborganizations:notifications.tierLimitReachedError." +
                        "emptyPlaceholder.action")
                    }
                    handleModalClose={ handleLimitReachedModalClose }
                    header={
                        orgLevelReachedError
                            ?
                            t("suborganizations:notifications.subOrgLevelsLimitReachedError." +
                        "heading")
                            :
                            t("suborganizations:notifications.tierLimitReachedError.heading")
                    }
                    description={
                        orgLevelReachedError
                            ?
                            t("suborganizations:notifications.subOrgLevelsLimitReachedError." +
                        "emptyPlaceholder.subtitles")
                            :
                            t("suborganizations:notifications.tierLimitReachedError." +
                        "emptyPlaceholder.subtitles")
                    }
                    message={
                        orgLevelReachedError
                            ?
                            t("suborganizations:notifications.subOrgLevelsLimitReachedError." +
                        "emptyPlaceholder.title")
                            :
                            t("suborganizations:notifications.tierLimitReachedError." +
                        "emptyPlaceholder.title")
                    }
                    openModal={ openLimitReachedModal }
                />
            ) }
            <Modal
                open={ true }
                className="wizard application-create-wizard"
                size="tiny"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-componentid={ `${ testId }-modal` }
            >
                <Modal.Header className="wizard-header">
                    { t("organizations:modals.addOrganization.header") }
                    <Heading as="h6" data-componentid={ `${ testId }-subheading` }>
                        { parent?.name
                            ? t("organizations:modals.addOrganization.subtitle1", {
                                parent: parent?.name
                            })
                            : t("organizations:modals.addOrganization.subtitle2") }
                    </Heading>
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        { ((error || orgNameError || orgHandleError) && !isSubmitting) && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <Message type="error" content={ error || orgNameError || orgHandleError } />
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <Form
                                    id={ FORM_ID }
                                    uncontrolledForm={ false }
                                    onSubmit={ submitOrganization }
                                    triggerSubmit={ (submit: () => void) => (submitForm.current = submit) }
                                >
                                    <Field.Input
                                        ariaLabel="Organization Name"
                                        inputType="name"
                                        name="name"
                                        label={ t(
                                            "organizations:forms." +
                                            "addOrganization.name.label"
                                        ) }
                                        required={ true }
                                        placeholder={ t(
                                            "organizations:forms." +
                                            "addOrganization.name.placeholder"
                                        ) }
                                        maxLength={ ORGANIZATION_NAME_MAX_LENGTH }
                                        minLength={ ORGANIZATION_NAME_MIN_LENGTH }
                                        data-componentid={ `${ testId }-organization-name-input` }
                                        width={ 16 }
                                        listen={ (value: string) => {
                                            setOrgNameError("");
                                            if (isOrgHandleFeatureEnabled) {
                                                generateOrgHandle(value);
                                            }
                                        } }
                                    />
                                    { isOrgHandleFeatureEnabled && (
                                        <Field.Input
                                            ariaLabel="Organization Handle"
                                            inputType="name"
                                            name="orgHandle"
                                            label={
                                                (<span>
                                                    { t("organizations:forms.addOrganization.orgHandle.label") }
                                                    <Hint
                                                        inline
                                                        popup
                                                        data-testid={ `${testId}-org-handle-info-icon` }>
                                                        { t("organizations:forms.addOrganization.orgHandle.tooltip")
                                                        }
                                                    </Hint>
                                                </span>)
                                            }
                                            placeholder={
                                                t("organizations:forms.addOrganization.orgHandle.placeholder")
                                            }
                                            maxLength={ ORGANIZATION_NAME_MAX_LENGTH }
                                            minLength={ ORGANIZATION_NAME_MIN_LENGTH }
                                            data-componentid={ `${ testId }-organization-handle-input` }
                                            width={ 16 }
                                            value={ orgHandle || undefined }
                                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                                setOrgHandle(e.target.value);
                                                checkOrgHandleValidity(e.target.value);
                                                setOrgHandleError("");
                                            } }
                                            onBlur={ () => setIsOrgHandleFieldFocused(false) }
                                            onFocus={ () => setIsOrgHandleFieldFocused(true) }
                                            required={ true }
                                        />
                                    ) }
                                    { isOrgHandleFeatureEnabled && (
                                        <Grid className="m-0" style={ { marginTop: "-10px" } }>
                                            <Grid.Row className="p-0">
                                                { renderOrgHandleAlphabetValidationIcon() }
                                                <Text muted size={ 12 }>
                                                    Must begin with an alphabet character
                                                </Text>
                                            </Grid.Row>
                                            <Grid.Row className="p-0">
                                                { renderOrgHandleLengthValidationIcon() }
                                                <Text muted size={ 12 }>
                                                    More than 4 characters, less than 30 characters
                                                </Text>
                                            </Grid.Row>
                                            <Grid.Row className="p-0">
                                                { renderOrgHandleAlphanumericValidationIcon() }
                                                <Text muted size={ 12 }>
                                                    Only consist of lowercase alphanumerics
                                                    { isOrgHandleDotExtensionMandatory && (
                                                        <> (Must be in the format of <strong>abc.com</strong>)</>
                                                    ) }
                                                </Text>
                                            </Grid.Row>
                                            <Grid.Row className="p-0">
                                                { renderOrgHandleUniqueValidationIcon() }
                                                <Text muted size={ 12 }>
                                                    Must be unique
                                                </Text>
                                            </Grid.Row>
                                        </Grid>
                                    ) }
                                    <Field.Input
                                        ariaLabel="Description"
                                        inputType="description"
                                        name="description"
                                        label={ t(
                                            "organizations:forms." +
                                            "addOrganization.description.label"
                                        ) }
                                        required={ false }
                                        placeholder={ t(
                                            "organizations:forms." +
                                            "addOrganization.description.placeholder"
                                        ) }
                                        maxLength={ ORGANIZATION_DESCRIPTION_MAX_LENGTH }
                                        minLength={ ORGANIZATION_DESCRIPTION_MIN_LENGTH }
                                        data-componentid={ `${ testId }-description-input` }
                                        width={ 16 }
                                    />
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ handleWizardClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    floated="right"
                                    onClick={ () => {
                                        submitForm?.current && submitForm?.current();
                                    } }
                                    data-componentid={ `${ testId }-next-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:create") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </>
    );
};

/**
 * Default props for the application creation wizard.
 */
AddOrganizationModal.defaultProps = {
    "data-componentid": "organization-create-wizard"
};
