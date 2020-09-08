/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { addDialect, addExternalClaim } from "../../api";
import { AddDialectWizardStepIcons } from "../../configs";
import { AddExternalClaim } from "../../models";
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
}

/**
 * A component that lets you add a dialect.
 *
 * @param {AddDialectPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement} component.
 */
export const AddDialect: FunctionComponent<AddDialectPropsInterface> = (
    props: AddDialectPropsInterface
): ReactElement => {

    const {
        open,
        onClose,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ dialectDetailsData, setDialectDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ externalClaims, setExternalClaims ] = useState<AddExternalClaim[]>([]);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Submit handler that sends the API request to add the local claim.
     */
    const handleSubmit = () => {
        addDialect(dialectDetailsData?.get("dialectURI").toString()).then(() => {
            const dialectID = window.btoa(dialectDetailsData?.get("dialectURI").toString()).replace(/=/g, "");
            const externalClaimPromises = [];
            externalClaims.forEach(claim => {
                externalClaimPromises.push(addExternalClaim(dialectID, claim));
            });
            Promise.all(externalClaimPromises).then(() => {
                dispatch(addAlert({
                    description: t("adminPortal:components.claims.dialects.notifications." +
                        "addDialect.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:components.claims.dialects.notifications.addDialect.success.message")
                }))
            }).catch(() => {
                dispatch(addAlert({
                    description: t("adminPortal:components.claims.dialects.notifications." +
                        "addDialect.genericError.description"),
                    level: AlertLevels.WARNING,
                    message: t("adminPortal:components.claims.dialects.notifications." +
                        "addDialect.genericError.message")
                }))
            }).finally(() => {
                onClose();
                update();
            });
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description
                    || t("adminPortal:components.claims.dialects.notifications." +
                        "addDialect.error.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    || t("adminPortal:components.claims.dialects.notifications.addDialect.error.message")
            }));
        })
    };

    /**
     * Handler that is called when the `Dialect Details` wizard step is completed.
     *
     * @param {Map<string, FormValue>} values Form values.
     */
    const onSubmitDialectDetails = (values: Map<string, FormValue>): void => {
        setCurrentWizardStep(1);
        setDialectDetailsData(values);
    };

    /**
     * Handler that is called when the `Add External CLaims` step of the wizard is completed.
     *
     * @param {AddExternalClaim[]} claims - Claim Values.
     */
    const onSubmitExternalClaims = (claims: AddExternalClaim[]): void => {
        setCurrentWizardStep(2);
        setExternalClaims(claims);
    };

    /**
     * An array of objects that contains data of each step of the wizard.
     */
    const STEPS = [
        {
            content: (
                <DialectDetails
                    submitState={ firstStep }
                    onSubmit={ onSubmitDialectDetails }
                    values={ dialectDetailsData }
                    data-testid={ `${ testId }-dialect-details` }
                />
            ),
            icon: AddDialectWizardStepIcons.general,
            title: t("adminPortal:components.claims.dialects.wizard.steps.dialectURI")
        },
        {
            content: (
                <ExternalClaims
                    submitState={ secondStep }
                    onSubmit={ onSubmitExternalClaims }
                    values={ externalClaims }
                    data-testid={ `${ testId }-external-claims` }
                />
            ),
            icon: AddDialectWizardStepIcons.general,
            title: t("adminPortal:components.claims.dialects.wizard.steps.externalAttribute")
        },
        {
            content: (
                <SummaryAddDialect
                    dialectURI={ dialectDetailsData?.get("dialectURI").toString() }
                    claims={ externalClaims }
                    data-testid={ `${ testId }-summary` }
                />
            ),
            icon: AddDialectWizardStepIcons.general,
            title: t("adminPortal:components.claims.dialects.wizard.steps.summary")

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
        >
            <Modal.Header className="wizard-header">
                { t("adminPortal:components.claims.dialects.wizard.header") }
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
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
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
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
    )
};

/**
 * Default props for the component.
 */
AddDialect.defaultProps = {
    "data-testid": "add-dialect-wizard"
};
