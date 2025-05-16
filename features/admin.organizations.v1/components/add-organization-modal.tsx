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
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Heading, LinkButton, Message, PrimaryButton } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
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
    domainName?: string;
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
    const [ orgHandle, setOrgHandle ] = useState<string>();
    const [ isCheckingOrgHandleValidity, setCheckingOrgHandleValidity ] = useState<boolean>(false);

    const isOrgHandleDotExtensionMandatory: boolean = useSelector(
        (state: AppState) => state.config?.ui?.multiTenancy?.isTenantDomainDotExtensionMandatory
    );

    const submitOrganization = async (values: OrganizationAddFormProps): Promise<Record<string, string>|void> => {
        const organization: AddOrganizationInterface = {
            description: values?.description,
            name: values?.name,
            orgHandle: values?.orgHandle,
            parentId: parent?.id ?? currentOrganization.id,
            type: ORGANIZATION_TYPE.TENANT
        };

        if (!values?.name) {
            return Promise.resolve({
                name: t("organizations:forms.addOrganization.name.validation.empty")
            });
        } else if (!values?.orgHandle) {
            return Promise.resolve({
                handle: t("organizations:forms.addOrganization.orgHandle.validation.empty")
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
                        setError(t(OrganizationManagementConstants.ERROR_SUB_ORGANIZATION_EXIST.getErrorMessage(),
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
            return generateOrgHandle + ".com";
        }

        return generateOrgHandle;
    }

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
                setError(t("organizations:forms.addOrganization.orgHandle.validation.duplicate"));
                setCheckingOrgHandleValidity(false);

                return;
            }

            // Disallow starting with a dot.
            if (orgHandle.startsWith(".")) {
                setError(t("organizations:forms.addOrganization.orgHandle.validation.startingWithDot"));
                setCheckingOrgHandleValidity(false);

                return;
            }

            // Validate .extension requirement.
            if (isOrgHandleDotExtensionMandatory) {
                const lastIndexOfDot: any = orgHandle.lastIndexOf(".");

                if (lastIndexOfDot <= 0) {
                    setError(t("organizations:forms.addOrganization.orgHandle.validation.mandatoryExtension"));
                    setCheckingOrgHandleValidity(false);

                    return;
                }
            }

            // Validate against pattern.
            const regex: RegExp = new RegExp(OrganizationManagementConstants.ORG_HANDLE_REGEX);

            if (!regex.test(orgHandle)) {
                setError(t("organizations:forms.addOrganization.orgHandle.validation.invalidPattern"));
                setCheckingOrgHandleValidity(false);

                return;
            }

            // All validations passed.
            setError("");
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
                        { (error && !isSubmitting) && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <Message type="error" content={ error } />
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
                                        listen={ (value: string) => generateOrgHandle(value) }
                                    />
                                    <Field.Input
                                        ariaLabel="Organization Handle"
                                        inputType="edit_input"
                                        name="orgHandle"
                                        label={ t("organizations:forms.addOrganization.orgHandle.label") }
                                        required={ true }
                                        placeholder={
                                            t("organizations:forms.addOrganization.orgHandle.placeholder")
                                        }
                                        maxLength={ ORGANIZATION_NAME_MAX_LENGTH }
                                        minLength={ ORGANIZATION_NAME_MIN_LENGTH }
                                        data-componentid={ `${ testId }-organization-handle-input` }
                                        width={ 16 }
                                        value={ orgHandle || undefined }
                                        validate={ (value: string) => checkOrgHandleValidity(value) }
                                    />
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
                                    disabled={ isSubmitting || isCheckingOrgHandleValidity || !!error }
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
