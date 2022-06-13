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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Form, Grid, Modal } from "semantic-ui-react";
import { EventPublisher } from "../../core";
import { addOrganization } from "../api";
import { ORGANIZATION_TYPE } from "../constants";
import { AddOrganizationInterface } from "../models";

/**
 * Prop types of the `AddOrganizationModal` component.
 */
interface AddOrganizationModalPropsInterface extends TestableComponentInterface {
    closeWizard: () => void;
    parentID?: string;
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
    const { closeWizard, parentID, onUpdate, [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ organizationName, setOrganizationName ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ domain, setDomain ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ type, setType ] = useState<ORGANIZATION_TYPE>(ORGANIZATION_TYPE.STRUCTURAL);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const submitOrganization = (): void => {
        const organization: AddOrganizationInterface = {
            description: description,
            domain: domain,
            name: organizationName,
            parentId: parentID,
            type: type
        };

        setIsSubmitting(true);

        addOrganization(organization)
            .then(() => {
                eventPublisher.compute;
                closeWizard();
                dispatch(
                    addAlert({
                        description: t("adminPortal:components.applications.notifications.add.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("adminPortal:components.applications.notifications.add.message")
                    })
                );
                if (onUpdate) {
                    onUpdate();
                }
            })
            .catch((error) => {
                dispatch(
                    addAlert({
                        description: t("adminPortal:components.applications.notifications.add.description"),
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:components.applications.notifications.add.message")
                    })
                );
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

    return (
        <>
            <Modal
                open={ true }
                className="wizard application-create-wizard"
                size="small"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-testid={ `${ testId }-modal` }
            >
                <Modal.Header className="wizard-header">
                    Create Organization
                    <Heading as="h6">Create a new organization</Heading>
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                <Form>
                                    <Form.Field>
                                        <label>Organization Name</label>
                                        <input
                                            type="text"
                                            value={ organizationName }
                                            onChange={ (e) => setOrganizationName(e.target.value) }
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={ description }
                                            onChange={ (e) => setDescription(e.target.value) }
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Domain Name</label>
                                        <input
                                            type="text"
                                            value={ domain }
                                            onChange={ (e) => setDomain(e.target.value) }
                                        />
                                    </Form.Field>
                                    <Form.Group grouped>
                                        <label>Type</label>
                                        <Form.Radio
                                            label="Structural"
                                            value={ ORGANIZATION_TYPE.STRUCTURAL }
                                            checked={ type === ORGANIZATION_TYPE.STRUCTURAL }
                                            onChange={ () => setType(ORGANIZATION_TYPE.STRUCTURAL) }
                                        />
                                        <Form.Radio
                                            label="Tenant"
                                            value={ ORGANIZATION_TYPE.TENANT }
                                            checked={ type === ORGANIZATION_TYPE.TENANT }
                                            onChange={ () => setType(ORGANIZATION_TYPE.TENANT) }
                                        />
                                    </Form.Group>
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
                                        submitOrganization();
                                    } }
                                    data-testid={ `${ testId }-next-button` }
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
    "data-testid": "organization-create-wizard"
};
