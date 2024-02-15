/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { OutboundProvisioningConnectorSetupForm } from "./outbound-provisioning-connector-setup-form";
import { getApplicationWizardStepIcons } from "../../applications/configs/ui";
import { OutboundProvisioningConfigurationInterface } from "../../applications/models/application";
import { IdentityProviderInterface } from "../../identity-providers/models/identity-provider";

/**
 * Interface for the outbound provisioning IDP setup wizard props.
 */
interface OutboundProvisioningConnectorSetupWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to close the wizard.
     */
    closeWizard: () => void;
    /**
     * Callback to update the outbound provisioning configurations.
     */
    onUpdate: (configuration: OutboundProvisioningConfigurationInterface) => void;
    /**
     * Flag to show/hide loading.
     */
    isSubmitting: boolean;
    /**
     * Available IDP list for the form.
     */
    availableIdpList: IdentityProviderInterface[];
}

/**
 * Outbound provisioning IDP setup wizard component.
 *
 * @param props - Props injected to the component.
 * @returns Outbound provisioning IDP create wizard component.
 */
export const OutboundProvisioningConnectorSetupWizard: FunctionComponent<
    OutboundProvisioningConnectorSetupWizardPropsInterface
> = (props: OutboundProvisioningConnectorSetupWizardPropsInterface): ReactElement => {

    const {
        closeWizard,
        onUpdate,
        isSubmitting,
        availableIdpList,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    /**
     * Handles the final wizard submission.
     *
     * @param values - Form values.
     */
    const handleWizardFormFinish = (values: OutboundProvisioningConfigurationInterface): void => {
        onUpdate(values);
    };

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            data-componentid={ componentId }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("console:develop.features.applications.resident.provisioning.outbound.addIdpWizard" +
                    ".heading") }
                <Heading as="h6">
                    { t("console:develop.features.applications.resident.provisioning.outbound.addIdpWizard" +
                        ".subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    data-componentid={ `${ componentId }-steps` }
                >
                    <Steps.Step
                        icon={ getApplicationWizardStepIcons().general }
                        title={ t("console:develop.features.applications.resident." +
                                    "provisioning.outbound.addIdpWizard.steps.details") }
                        data-componentid={ `${ componentId }-step-${ 0 }` }
                    />
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                <OutboundProvisioningConnectorSetupForm
                    initialValues={ null }
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleWizardFormFinish }
                    idpList={ availableIdpList }
                    data-componentid={ `${ componentId }-form` }
                    isSubmitting={ isSubmitting }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid>
                        <LinkButton
                            floated="left"
                            onClick={ () => closeWizard() }
                            disabled={ isSubmitting }
                            data-componentid={ `${ componentId }-cancel-button` }
                        >
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid>
                    <Grid>
                        <PrimaryButton
                            floated="right"
                            onClick={ () => setFinishSubmit() }
                            data-componentid={ `${ componentId }-finish-button` }
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
                        >
                            { t("common:finish") }
                        </PrimaryButton>
                    </Grid>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the outbound provisioning IDP create wizard.
 */
OutboundProvisioningConnectorSetupWizard.defaultProps = {
    "data-componentid": "outbound-provisioning-connector-setup-wizard"
};
