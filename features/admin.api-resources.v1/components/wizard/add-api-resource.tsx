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

import { history } from "@wso2is/admin.core.v1";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddAPIResourceAuthorization, AddAPIResourceBasic, AddAPIResourcePermissions } from "./add-api-resource-steps";
import { createAPIResource } from "../../api";
import { getAPIResourceWizardStepIcons } from "../../configs";
import { APIResourcesConstants } from "../../constants";
import {
    APIResourceInterface,
    APIResourcePermissionInterface,
    APIResourceWizardStepInterface,
    AddAPIResourceWizardStepsFormTypes,
    BasicAPIResourceInterface
} from "../../models";

interface AddAPIResourcePropsInterface extends IdentifiableComponentInterface {
    /**
     * Close the wizard.
     */
    closeWizard: () => void;
    /**
     * Current step.
     */
    currentStep?: number;
    /**
     * Last step form type.
     */
    lastStepFormType?: AddAPIResourceWizardStepsFormTypes;
}

/**
 * API resource wizard.
 */
export const AddAPIResource: FunctionComponent<AddAPIResourcePropsInterface> = (
    props: AddAPIResourcePropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        lastStepFormType,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    //External trigger to submit the authorization step.
    let submitAuthorization: () => void;

    const [ submitBasicDetails, setSubmitBasicDetails ] = useTrigger();
    const [ addPermission, setAddPermission ] = useTrigger();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ latestPermissionFormValues, setLatestPermissionFormValues ] = useState<Map<string, FormValue>>(undefined);
    const [ basicDetails, setBasicDetails ] = useState<BasicAPIResourceInterface>(undefined);
    const [ requiredAuthorization, setRequiredAuthorization ] = useState<boolean>(true);
    const [ permissions, setPermissions ] = useState<Map<string, APIResourcePermissionInterface>>(new Map());
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ currentWizardFormType, setCurrentWizardFormType ]
        = useState<AddAPIResourceWizardStepsFormTypes>(AddAPIResourceWizardStepsFormTypes.BASIC_DETAILS);
    const [ isIdentifierValidationLoading, setIdentifierValidationLoading ] = useState<boolean>(false);
    const [ isPermissionValidationLoading, setPermissionValidationLoading ] = useState<boolean>(false);

    /**
    * Handles the wizard form submission.
    */
    const handleWizardFormSubmit = () => {
        switch (currentWizardFormType) {
            case AddAPIResourceWizardStepsFormTypes.BASIC_DETAILS:
                setSubmitBasicDetails();

                break;
            case AddAPIResourceWizardStepsFormTypes.PERMISSIONS: {
                if (latestPermissionFormValues?.get("displayName")?.toString().trim() !==
                    latestPermissionFormValues?.get("identifier")?.toString().trim()) {
                    setAddPermission();
                }
                handleNext();

                break;
            }
            case AddAPIResourceWizardStepsFormTypes.AUTHORIZATION:
                submitAuthorization();

                break;
            default:
                break;
        }
    };

    /**
     * Handles the next button click.
     */
    const handleNext = () => {
        const newStep: number = currentWizardStep + 1;

        setCurrentWizardStep(newStep);
        setCurrentWizardFormType(steps[newStep].addAPIResourceWizardStepsFormType);
    };

    /**
     * Handles the previous button click.
     */
    const handlePrevious = () => {
        const newStep: number = currentWizardStep - 1;

        setCurrentWizardStep(newStep);
        setCurrentWizardFormType(steps[newStep].addAPIResourceWizardStepsFormType);
    };

    /**
     * Handles the API resource creation.
     */
    const handleCreateAPIResource = (requiresAuthorization: boolean): void => {
        setIsSubmitting(true);

        const apiResourceBody: APIResourceInterface = {
            displayName: basicDetails.displayName,
            gwName: APIResourcesConstants.EMPTY_STRING,
            identifier: basicDetails.identifier,
            permissions: [ ...permissions.values() ],
            requiresAuthorization: requiresAuthorization
        };

        createAPIResource(apiResourceBody)
            .then((apiResource: APIResourceInterface) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.addAPIResource.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.apiResource.notifications.addAPIResource.success.message")
                }));

                // Open the created API resource.
                history.push(APIResourcesConstants.getPaths().get("API_RESOURCE_EDIT").replace(":id", apiResource.id));
            })
            .catch((error: AxiosError) => {
                switch (error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".unauthorizedError.message")
                        }));

                        break;

                    case APIResourcesConstants.API_RESOURCE_ALREADY_EXISTS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".alreadyExistsError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".alreadyExistsError.message")
                        }));

                        break;

                    case APIResourcesConstants.PERMISSION_ALREADY_EXISTS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".permissionAlreadyExistsError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".permissionAlreadyExistsError.message")
                        }));

                        break;

                    case APIResourcesConstants.INVALID_REQUEST_PAYLOAD:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".invalidPayloadError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".invalidPayloadError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.addAPIResource" +
                                ".genericError.message")
                        }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);

                closeWizard();
            });
    };

    /**
     * Steps of the add API resource wizard.
     */
    const steps: APIResourceWizardStepInterface[] = [
        {
            addAPIResourceWizardStepsFormType: AddAPIResourceWizardStepsFormTypes.BASIC_DETAILS,
            content: (
                <AddAPIResourceBasic
                    initalBasicDetails={ basicDetails }
                    setBasicDetails={ setBasicDetails }
                    triggerSubmission={ submitBasicDetails }
                    submitCallback={ handleNext }
                    isIdentifierValidationLoading={ isIdentifierValidationLoading }
                    setIdentifierValidationLoading={ setIdentifierValidationLoading }
                />
            ),
            icon: getAPIResourceWizardStepIcons().general,
            title: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.stepTitle")
        },
        {
            addAPIResourceWizardStepsFormType: AddAPIResourceWizardStepsFormTypes.PERMISSIONS,
            content: (
                <AddAPIResourcePermissions
                    setPermissionsList={ setPermissions }
                    initialPermissions={ permissions }
                    triggerAddPermission={ addPermission }
                    setAddPermission={ setAddPermission }
                    setLatestPermissionFormValues={ setLatestPermissionFormValues }
                    isPermissionValidationLoading={ isPermissionValidationLoading }
                    setPermissionValidationLoading={ setPermissionValidationLoading }
                />
            ),
            icon: getAPIResourceWizardStepIcons().permissions,
            title: t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions.stepTitle")
        },
        {
            addAPIResourceWizardStepsFormType: AddAPIResourceWizardStepsFormTypes.AUTHORIZATION,
            content: (
                <AddAPIResourceAuthorization
                    triggerSubmission={ (submitFunctionCb: () => void) => {
                        submitAuthorization = submitFunctionCb;
                    } }
                    initalRequiredAuthorizationValue = { requiredAuthorization }
                    setRequiredAuthorization = { setRequiredAuthorization }
                    submitCallback={ handleCreateAPIResource }
                />
            ),
            icon: getAPIResourceWizardStepIcons().authorize,
            title: t("extensions:develop.apiResource.wizard.addApiResource.steps.authorization.stepTitle")
        }
    ];

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard api-resource-create-wizard"
            dimmer="blurring"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("extensions:develop.apiResource.wizard.addApiResource.title") }
                <Heading as="h6">{ t("extensions:develop.apiResource.wizard.addApiResource.subtitle") }</Heading>
            </Modal.Header>
            <Modal.Content scrolling className="steps-container">
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { steps.map((step: APIResourceWizardStepInterface) => (
                        <Steps.Step
                            key={ step.title }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { steps[currentWizardStep].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                tabIndex={ 6 }
                                data-testid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("extensions:develop.apiResource.wizard.addApiResource.cancelButton") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardFormType !== lastStepFormType && (
                                <PrimaryButton
                                    tabIndex={ 7 }
                                    data-testid={ `${componentId}-next-button` }
                                    floated="right"
                                    onClick={ () => handleWizardFormSubmit() }
                                    loading={ isIdentifierValidationLoading }
                                    disabled={ isIdentifierValidationLoading }
                                >
                                    { t("extensions:develop.apiResource.wizard.addApiResource.nextButton") }
                                    <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardFormType === lastStepFormType && (
                                <PrimaryButton
                                    tabIndex={ 8 }
                                    data-testid={ `${componentId}-finish-button` }
                                    floated="right"
                                    onClick={ () => handleWizardFormSubmit() }
                                    loading={ isSubmitting || isPermissionValidationLoading }
                                >
                                    { t("extensions:develop.apiResource.wizard.addApiResource.submitButton") }
                                </PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    tabIndex={ 9 }
                                    data-testid={ `${componentId}-previous-button` }
                                    floated="right"
                                    onClick={ () => handlePrevious() }
                                    loading={ isSubmitting }
                                >
                                    <Icon name="arrow left" />
                                    { t("extensions:develop.apiResource.wizard.addApiResource.previousButton") }
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
 * Default props for the add API resource wizard.
 */
AddAPIResource.defaultProps = {
    currentStep: 0,
    "data-componentid": "add-api-resource",
    lastStepFormType: AddAPIResourceWizardStepsFormTypes.AUTHORIZATION
};
