/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { WizardStepInterface } from "../../../admin-users-v1/models";
import { addDialect, addExternalClaim } from "../../api";
import { getAddDialectWizardStepIcons } from "../../configs";
import { ClaimManagementConstants } from "../../constants";
import { AddExternalClaim } from "../../models";
import { resolveType } from "../../utils/resolve-type";
import { DialectDetails, ExternalClaims, SummaryAddDialect } from "../wizard";

/**
 * Prop types for `AddDialect` component.
 */
interface AddDialectPropsInterface extends TestableComponentInterface {
    /**
     * Open the modal.
     */
    open: boolean;
    /**
     * Handler to be called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Function to be called to initiate an update.
     */
    update: () => void;
    /**
     * Attribute type
     */
    attributeType?: string;
}

/**
 * A component that lets you add a dialect.
 *
 * @param props - Props injected to the component.
 *
 * @returns AddDialect component.
 */
export const AddDialect: FunctionComponent<AddDialectPropsInterface> = (
    props: AddDialectPropsInterface
): ReactElement => {

    const {
        open,
        onClose,
        update,
        attributeType,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ dialectDetailsData, setDialectDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ externalClaims, setExternalClaims ] = useState<AddExternalClaim[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    /**
     * Submit handler that sends the API request to add the local claim.
     */
    const handleSubmit = () => {
        setIsSubmitting(true);

        addDialect(dialectDetailsData?.get("dialectURI").toString())
            .then(() => {

                const dialectID: string = 
                    window.btoa(dialectDetailsData?.get("dialectURI").toString()).replace(/=/g, "");
                const externalClaimPromises: Promise<any>[] = [];

                externalClaims.forEach((claim: AddExternalClaim) => {
                    externalClaimPromises.push(addExternalClaim(dialectID, claim));
                });

                Promise.all(externalClaimPromises)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("claims:dialects.notifications." +
                                "addDialect.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("claims:dialects.notifications.addDialect" +
                                ".success.message")
                        }));
                    }).catch(() => {
                        dispatch(addAlert({
                            description: t("claims:dialects.notifications." +
                                "addDialect.genericError.description"),
                            level: AlertLevels.WARNING,
                            message: t("claims:dialects.notifications." +
                                "addDialect.genericError.message")
                        }));
                    }).finally(() => {
                        // `onClose()` closes the modal and `update()` re-fetches the list.
                        // Check `ClaimDialectsPage` component for the respective callback actions.
                        onClose();
                        update();
                    });
            }).catch((error: any) => {

                setAlert({
                    description: error?.description
                        || t("claims:dialects.notifications." +
                            "addDialect.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:dialects.notifications.addDialect.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handler that is called when the `Dialect Details` wizard step is completed.
     *
     * @param values - Form values.
     */
    const onSubmitDialectDetails = (values: Map<string, FormValue>): void => {
        setCurrentWizardStep(1);
        setDialectDetailsData(values);
    };

    /**
     * Handler that is called when the `Add External Claims` step of the wizard is completed.
     *
     * @param claims - Claim Values.
     */
    const onSubmitExternalClaims = (claims: AddExternalClaim[]): void => {
        setCurrentWizardStep(2);
        setExternalClaims(claims);
    };

    /**
     * This component {@link AddDialect} delegates the wizard claim
     * adding, editing, and deleting functionality to child components
     * {@link ExternalClaims}, {@link ClaimsList} respectively.
     *
     * So, this will also delegate the state changes {@link externalClaims}
     * to its child components down below to keep itself updated. Since,
     * this is a wizard, the user is able go back and fourth to different steps
     * and we need to ensure the state is preserved till the wizard submission.
     *
     * @see ExternalClaims nested handler functions for further information.
     * @param claims - Claim Values.
     */
    const onExternalClaimsChanged = (claims: AddExternalClaim[]) => {
        setExternalClaims([ ...claims ]);
    };

    /**
     * An array of objects that contains data of each step of the wizard.
     */
    const STEPS: WizardStepInterface[] = [
        {
            content: (
                <DialectDetails
                    submitState={ firstStep }
                    onSubmit={ onSubmitDialectDetails }
                    values={ dialectDetailsData }
                    data-testid={ `${ testId }-dialect-details` }
                />
            ),
            icon: getAddDialectWizardStepIcons().general,
            title: t("claims:dialects.wizard.steps.dialectURI")
        },
        {
            content: (
                <ExternalClaims
                    submitState={ secondStep }
                    onSubmit={ onSubmitExternalClaims }
                    values={ externalClaims }
                    onExternalClaimsChanged={ onExternalClaimsChanged }
                    data-testid={ `${ testId }-external-claims` }
                    attributeType={ attributeType }
                />
            ),
            icon: getAddDialectWizardStepIcons().general,
            title: t(
                "claims:dialects.wizard.steps.externalAttribute",
                { type: resolveType(attributeType, true) }
            )
        },
        {
            content: (
                <SummaryAddDialect
                    dialectURI={ dialectDetailsData?.get("dialectURI").toString() }
                    claims={ externalClaims }
                    data-testid={ `${ testId }-summary` }
                    attributeType={ attributeType }
                />
            ),
            icon: getAddDialectWizardStepIcons().general,
            title: t("claims:dialects.wizard.steps.summary")

        }
    ];

    /**
     * Moves the wizard to the next step.
     */
    const next = () => {
        switch (currentWizardStep) {
            case 0:
                setFirstStep();

                break;
            case 1:
                setSecondStep();

                break;
            case 2:
                handleSubmit();

                break;
        }
    };

    /**
     * Moves wizard to the previous step.
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    return (
        <Modal
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            open={ open }
            onClose={ onClose }
            data-testid={ testId }
            closeOnDimmerClick={ false }
        >
            <Modal.Header className="wizard-header">
                { t("claims:dialects.wizard.header") }
                {
                    dialectDetailsData && dialectDetailsData.get("dialectURI")
                        ? " - " + dialectDetailsData.get("dialectURI")
                        : ""
                }
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step: WizardStepInterface, index: number) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => onClose() }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:next") } <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-finish-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:finish") }</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ previous }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" /> { t("common:previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    );
};

/**
 * Default props for the component.
 */
AddDialect.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "add-dialect-wizard"
};
