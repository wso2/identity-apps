/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Divider, Grid, Message, Modal, Form as SemanticForm } from "semantic-ui-react";
import { AppState, EventPublisher } from "../../core";
import { addOrganization, getOrganizations } from "../api";
import { ORGANIZATION_TYPE, OrganizationManagementConstants } from "../constants";
import { AddOrganizationInterface, OrganizationInterface, OrganizationListInterface } from "../models";

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
    parent?: OrganizationInterface;
    /**
     * Callback to update the organization details.
     */
    onUpdate?: () => void;
}

/**
 * An app creation wizard with only the minimal features.
 *
 * @param {AddOrganizationModalPropsInterface} props Props to be injected into the component.
 */
export const AddOrganizationModal: FunctionComponent<AddOrganizationModalPropsInterface> = (
    props: AddOrganizationModalPropsInterface
): ReactElement => {
    const { closeWizard, parent, onUpdate, [ "data-componentid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ type, setType ] = useState<ORGANIZATION_TYPE>(ORGANIZATION_TYPE.STRUCTURAL);
    const [ duplicateName, setDuplicateName ] = useState<boolean>(false);
    const currentOrganization: OrganizationInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const submitForm = useRef<() => void>();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const submitOrganization = async (values: OrganizationAddFormProps): Promise<void> => {
        if (values?.name) {
            try {
                const response: OrganizationListInterface = await getOrganizations(
                    `name eq ${ values.name }`,
                    1,
                    null,
                    null,
                    true
                );

                if (response?.organizations?.length > 0) {
                    setDuplicateName(true);

                    return;
                } else {
                    setDuplicateName(false);
                }
            } catch (error) {
                setDuplicateName(false);
            }
        }

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
                                { duplicateName && (
                                    <Message negative data-componentid={ `${ testId }-duplicate-name-error` }>
                                        <Message.Content>
                                            { t(
                                                "console:manage.features.organizations.forms." +
                                                "addOrganization.name.validation.duplicate"
                                            ) }
                                        </Message.Content>
                                    </Message>
                                ) }
                                <Form
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
                                        maxLength={ 32 }
                                        minLength={ 3 }
                                        data-componentid={ `${ testId }-organization-name-input` }
                                        width={ 16 }
                                        listen={ () => {
                                            setDuplicateName(false);
                                        } }
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
                                        maxLength={ 32 }
                                        minLength={ 3 }
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
