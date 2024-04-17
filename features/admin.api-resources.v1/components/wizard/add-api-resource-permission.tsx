/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { AddAPIResourcePermissionForm } from "./add-api-resource-permission-components";
import { APIResourcePermissionInterface, UpdatedAPIResourceInterface } from "../../models";

interface AddAPIResourcePermissionPropsInterface extends IdentifiableComponentInterface {
    /**
     * Close the wizard.
     */
    closeWizard: () => void;
    /**
     * Function to handle the API resource update.
     */
    handleUpdateAPIResource?: (updatedAPIResource: UpdatedAPIResourceInterface, callback?: () => void) => void;
}

/**
 * API resource wizard.
 */
export const AddAPIResourcePermission: FunctionComponent<AddAPIResourcePermissionPropsInterface> = (
    props: AddAPIResourcePermissionPropsInterface
): ReactElement => {

    const {
        closeWizard,
        handleUpdateAPIResource,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const [ submitAddPermissionForm, setSubmitAddPermissionForm ] = useTrigger();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ permissionValidationLoading, setPermissionValidationLoading ] = useState<boolean>(false);

    const addPermission = (permission: APIResourcePermissionInterface): void => {
        handleUpdateAPIResource(
            {
                addedPermissions: [ permission ]
            },
            (): void => { 
                closeWizard();
                setIsSubmitting(false);
            }
        );
    };

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard api-resource-permission-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("extensions:develop.apiResource.tabs.permissions.form.title") }
                <Heading as="h6">{ t("extensions:develop.apiResource.tabs.permissions.form.subTitle") }</Heading>
            </Modal.Header>
            <Modal.Content className="content-container">
                <AddAPIResourcePermissionForm 
                    triggerAddPermission={ submitAddPermissionForm } 
                    addPermission={ addPermission }
                    setIsSubmitting={ setIsSubmitting }
                    permissionValidationLoading={ permissionValidationLoading }
                    setPermissionValidationLoading={ setPermissionValidationLoading }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("extensions:develop.apiResource.tabs.permissions.form.cancelButton") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${componentId}-finish-button` }
                                floated="right"
                                onClick={ () => setSubmitAddPermissionForm() }
                                loading={ isSubmitting }
                            >
                                { t("extensions:develop.apiResource.tabs.permissions.form.submitButton") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the add API resource wizard.
 */
AddAPIResourcePermission.defaultProps = {
    "data-componentid": "add-api-resource-permission"
};
