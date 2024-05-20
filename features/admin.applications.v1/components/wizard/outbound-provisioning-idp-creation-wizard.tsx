/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { getIdentityProviderList } from "@wso2is/admin.identity-providers.v1/api/identity-provider";
import {
    IdentityProviderInterface,
    IdentityProviderListResponseInterface
} from "@wso2is/admin.identity-providers.v1/models/identity-provider";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { OutboundProvisioningWizardIdpForm } from "./outbound-provisioining-idp-wizard-form";
import { updateApplicationConfigurations } from "../../api";
import { getApplicationWizardStepIcons } from "../../configs/ui";
import { ApplicationInterface, OutboundProvisioningConfigurationInterface } from "../../models";

/**
 * Interface for the outbound provisioning IDP create wizard props.
 */
interface OutboundProvisioningIdpCreateWizardPropsInterface extends TestableComponentInterface {
    application: ApplicationInterface;
    closeWizard: () => void;
    currentStep?: number;
    onUpdate: (id: string) => void;
}

/**
 * Outbound provisioning IDP create wizard form component.
 *
 * @param props - Props injected to the component.
 * @returns Outbound provisioning IDP create wizard component.
 */
export const OutboundProvisioningIdpCreateWizard: FunctionComponent<
    OutboundProvisioningIdpCreateWizardPropsInterface
    > = (props: OutboundProvisioningIdpCreateWizardPropsInterface): ReactElement => {

        const {
            application,
            closeWizard,
            currentStep,
            onUpdate,
            [ "data-testid" ]: testId
        } = props;

        const { t } = useTranslation();

        const dispatch: Dispatch = useDispatch();

        const [ finishSubmit, setFinishSubmit ] = useTrigger();

        const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
        const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
        const [ idpList, setIdpList ] = useState<IdentityProviderInterface[]>(undefined);
        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


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
                .then((response: IdentityProviderListResponseInterface) => {
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
            setIsSubmitting(true);
            updateApplicationConfigurations(id, values)
                .then(() => {
                    dispatch(addAlert({
                        description: t("applications:notifications.updateApplication" +
                        ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("applications:notifications" +
                            ".updateApplication.success.message")
                    }));

                    onUpdate(application.id);
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "applications:notifications.updateApplication.error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications" +
                            ".updateApplication.genericError.message")
                    }));
                })
                .finally(() => {
                    setIsSubmitting(false);
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
            };
        };

        /**
     * Handles the final wizard submission.
     */
        const handleWizardFormFinish = (values: any): void => {
        // Validate whether an IDP with the same connector already exists.
            if (application?.provisioningConfigurations?.outboundProvisioningIdps.find(
                (idp: OutboundProvisioningConfigurationInterface) =>
                    (idp.connector === values.connector) && (idp.idp === values.idp))
            ) {
                dispatch(addAlert({
                    description: t("applications:notifications.updateOutboundProvisioning" +
                    ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateOutboundProvisioning" +
                    ".genericError.message")
                }));
                closeWizard();

                return;
            }

            addIdentityProvider(application.id, updateConfiguration(values));
        };

        const STEPS: {
            content: JSX.Element;
            icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
            title: string;
        }[] = [
            {
                content: (
                    <OutboundProvisioningWizardIdpForm
                        initialValues={ null }
                        triggerSubmit={ finishSubmit }
                        //TODO: [Type fix] Define the type of `values` in form component.
                        onSubmit={ (values: any): void => {
                            handleWizardFormFinish(values);
                        } }
                        idpList={ idpList }
                        data-testid={ `${ testId }-form` }
                        isSubmitting={ isSubmitting }
                    />
                ),
                icon: getApplicationWizardStepIcons().general,
                title: t("applications:edit.sections.provisioning.outbound.addIdpWizard" +
                ".steps.details")
            }
        ];

        return (
            <Modal
                open={ true }
                className="wizard application-create-wizard"
                dimmer="blurring"
                size="small"
                onClose={ closeWizard }
                data-testid={ testId }
                closeOnDimmerClick={ false }
                closeOnEscape
            >
                <Modal.Header className="wizard-header">
                    { t("applications:edit.sections.provisioning.outbound.addIdpWizard" +
                    ".heading") }
                    <Heading as="h6">
                        { t("applications:edit.sections.provisioning.outbound.addIdpWizard" +
                        ".subHeading") }
                    </Heading>
                </Modal.Header>
                <Modal.Content className="steps-container">
                    <Steps.Group
                        current={ currentWizardStep }
                        data-testid={ `${ testId }-steps` }
                    >
                        { STEPS.map((
                            step: {
                                content: JSX.Element;
                                icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
                                title: string;
                            },
                            index: number
                        ) => (
                            <Steps.Step
                                key={ index }
                                icon={ step.icon }
                                title={ step.title }
                                data-testid={ `${ testId }-step-${ index }` }
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
                                    data-testid={ `${ testId }-cancel-button` }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { currentWizardStep < STEPS.length - 1 && (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ navigateToNext }
                                        data-testid={ `${ testId }-next-button` }
                                    >
                                        { t("common:next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === STEPS.length - 1 && (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ navigateToNext }
                                        data-testid={ `${ testId }-finish-button` }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("common:finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                        data-testid={ `${ testId }-previous-button` }
                                    >
                                        <Icon name="arrow left"/>
                                        { t("common:previous") }
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
    currentStep: 0,
    "data-testid": "outbound-provisioning-idp-create-wizard"
};
