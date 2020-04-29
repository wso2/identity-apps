/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { ApplicationWizardStepIcons } from "../../../configs";
import { addAlert } from "@wso2is/core/dist/src/store";
import { AlertLevels } from "@wso2is/core/dist/src/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import {
    IdentityProviderInterface,
    OutboundProvisioningConfigurationInterface
} from "../../../models";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { OutboundProvisioningWizardIdpForm } from "./outbound-provisioining-idp-wizard-form";
import { getIdentityProviderList, updateApplicationConfigurations } from "../../../api";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useTrigger } from "@wso2is/forms";

/**
 * Interface for the outbound provisioning IDP create wizard props.
 */
interface OutboundProvisioningIdpCreateWizardPropsInterface {
    application: any;
    closeWizard: () => void;
    currentStep?: number;
    onUpdate: (id: string) => void;
}

/**
 * Outbound provisioning IDP create wizard form component.
 *
 * @param {OutboundProvisioningIdpCreateWizardPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */

export const OutboundProvisioningIdpCreateWizard: FunctionComponent<OutboundProvisioningIdpCreateWizardPropsInterface> = (
    props: OutboundProvisioningIdpCreateWizardPropsInterface
): ReactElement => {

    const {
        application,
        closeWizard,
        currentStep,
        onUpdate
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ idpList, setIdpList ] = useState<IdentityProviderInterface[]>(undefined);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    /**
     * Fetch the IDP list.
     */
    useEffect(() => {
        if (idpList) {
            return;
        }

        getIdentityProviderList()
            .then((response) => {
                setIdpList(response.identityProviders);
            });
    }, []);

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setFinishSubmit();
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    const addIdentityProvider = (id: string, values: any) => {
        updateApplicationConfigurations(id, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(application.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            })
            .finally(() => {
                closeWizard();
            });
    };

    const updateConfiguration = (values: any) => {
        const outboundConfigs: OutboundProvisioningConfigurationInterface[] =
            application?.provisioningConfigurations?.outboundProvisioningIdps;
        outboundConfigs.push(values);
        return {
            provisioningConfigurations: {
                outboundProvisioningIdps: outboundConfigs
            }
        }
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (values: any): void => {
        addIdentityProvider(application.id, updateConfiguration(values));
    };

    const STEPS = [
        {
            content: (
                <OutboundProvisioningWizardIdpForm
                    initialValues={ null }
                    triggerSubmit={ finishSubmit }
                    onSubmit={ (values): void => {
                        handleWizardFormFinish(values)
                    } }
                    idpList={ idpList }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "IDP Details"
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                Add Outbound Provisioning IDP
                <Heading as="h6">Select the IDP to provision users that self-register to your application.</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                >
                                    Next
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                >
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                >
                                    <Icon name="arrow left"/>
                                    Previous
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the outbound provisioning IDP create wizard.
 */
OutboundProvisioningIdpCreateWizard.defaultProps = {
    currentStep: 0
};
