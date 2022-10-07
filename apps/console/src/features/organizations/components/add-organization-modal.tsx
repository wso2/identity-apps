/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { AppState, EventPublisher } from "../../core";
import { addOrganization } from "../api";
import {
    ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    ORGANIZATION_DESCRIPTION_MIN_LENGTH,
    ORGANIZATION_NAME_MAX_LENGTH,
    ORGANIZATION_NAME_MIN_LENGTH,
    ORGANIZATION_TYPE
} from "../constants";
import { AddOrganizationInterface, GenericOrganization, OrganizationInterface, OrganizationResponseInterface } from "../models";

interface OrganizationAddFormProps {
    name: string;
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

    const dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ type ] = useState<ORGANIZATION_TYPE>(ORGANIZATION_TYPE.STRUCTURAL);

    const submitForm = useRef<() => void>();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const currentOrganization = useSelector((state: AppState) => state.organization.organization);

    const submitOrganization = async (values: OrganizationAddFormProps): Promise<void> => {
        const organization: AddOrganizationInterface = {
            description: values?.description,
            name: values?.name,
            parentId: parent?.id ?? currentOrganization.id,
            type: ORGANIZATION_TYPE.TENANT
        };

        setIsSubmitting(true);

        addOrganization(organization)
            .then(() => {
                eventPublisher.compute;
                closeWizard();
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications." +
                            "addOrganization.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizations.notifications." + "addOrganization.success.message"
                        )
                    })
                );
                if (onUpdate) {
                    onUpdate();
                }
            })
            .catch((error) => {
                if (error?.description) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizations.notifications." +
                                "addOrganization.error.description",
                                {
                                    description: error.description
                                }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications." + "addOrganization.error.message"
                            )
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizations.notifications." +
                                "addOrganization.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications." +
                                "addOrganization.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const validate = async (values: OrganizationAddFormProps): Promise<Partial<OrganizationAddFormProps>> => {
        const error: Partial<OrganizationAddFormProps> = {};

        if (!values?.name) {
            error.name = t("console:manage.features.organizations.forms.addOrganization.name.validation.empty");
        }

        if (!values?.domainName && type === ORGANIZATION_TYPE.TENANT) {
            error.domainName = t(
                "console:manage.features.organizations.forms.addOrganization." + "domainName.validation.empty"
            );
        }

        return error;
    };

    /**
     * Close the wizard.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    return (
        <>
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
                    { t("console:manage.features.organizations.modals.addOrganization.header") }
                    <Heading as="h6" data-componentid={ `${ testId }-subheading` }>
                        { parent?.name
                            ? t("console:manage.features.organizations.modals.addOrganization.subtitle1", {
                                parent: parent?.name
                            })
                            : t("console:manage.features.organizations.modals.addOrganization.subtitle2") }
                    </Heading>
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <Form
                                    id={ FORM_ID }
                                    uncontrolledForm={ false }
                                    onSubmit={ submitOrganization }
                                    validate={ validate }
                                    triggerSubmit={ (submit) => (submitForm.current = submit) }
                                >
                                    <Field.Input
                                        ariaLabel="Organization Name"
                                        inputType="name"
                                        name="name"
                                        label={ t(
                                            "console:manage.features.organizations.forms." +
                                            "addOrganization.name.label"
                                        ) }
                                        required={ true }
                                        placeholder={ t(
                                            "console:manage.features.organizations.forms." +
                                            "addOrganization.name.placeholder"
                                        ) }
                                        maxLength={ ORGANIZATION_NAME_MAX_LENGTH }
                                        minLength={ ORGANIZATION_NAME_MIN_LENGTH }
                                        data-componentid={ `${ testId }-organization-name-input` }
                                        width={ 16 }
                                    />
                                    <Field.Input
                                        ariaLabel="Description"
                                        inputType="description"
                                        name="description"
                                        label={ t(
                                            "console:manage.features.organizations.forms." +
                                            "addOrganization.description.label"
                                        ) }
                                        required={ false }
                                        placeholder={ t(
                                            "console:manage.features.organizations.forms." +
                                            "addOrganization.description.placeholder"
                                        ) }
                                        maxLength={ ORGANIZATION_DESCRIPTION_MAX_LENGTH }
                                        minLength={ ORGANIZATION_DESCRIPTION_MIN_LENGTH }
                                        data-componentid={ `${ testId }-description-input` }
                                        width={ 16 }
                                    />
                                </Form>
                                { /*Temporarily hidden */ }
                                { /*  <Divider hidden />
                                <SemanticForm>
                                    <SemanticForm.Group grouped>
                                        <label>
                                            { t("console:manage.features.organizations.forms.addOrganization.type") }
                                        </label>
                                        <SemanticForm.Radio
                                            label={ t("console:manage.features.organizations.forms." +
                                                "addOrganization.structural") }
                                            value={ ORGANIZATION_TYPE.STRUCTURAL }
                                            checked={ type === ORGANIZATION_TYPE.STRUCTURAL }
                                            onChange={ () => setType(ORGANIZATION_TYPE.STRUCTURAL) }
                                        />
                                        <SemanticForm.Radio
                                            label={ t("console:manage.features.organizations." +
                                                "forms.addOrganization.tenant") }
                                            value={ ORGANIZATION_TYPE.TENANT }
                                            checked={ type === ORGANIZATION_TYPE.TENANT }
                                            onChange={ () => setType(ORGANIZATION_TYPE.TENANT) }
                                        />
                                    </SemanticForm.Group>
                                </SemanticForm> */ }
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
                                    { t("common:register") }
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
