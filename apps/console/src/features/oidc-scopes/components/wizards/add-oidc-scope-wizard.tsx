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

import { AlertLevels, Claim, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddOIDCScopeForm } from "./add-oidc-scope-form";
import { getAllExternalClaims, getAllLocalClaims } from "../../../claims/api";
import { AttributeSelectList } from "../../../core";
import { createOIDCScope } from "../../api";
import { getOIDCScopeWizardStepIcons } from "../../configs";
import { OIDCScopesManagementConstants } from "../../constants";
import { OIDCScopesListInterface } from "../../models";

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    CLAIM_LIST = "ClaimList"
}

/**
 * Interface for the OIDC scope create wizard props.
 */
interface OIDCScopeCreateWizardPropsInterface extends TestableComponentInterface {
    closeWizard: () => void;
    currentStep?: number;
    onUpdate: () => void;
}

/**
 * OIDC scope create wizard component.
 *
 * @param {OIDCScopeCreateWizardPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const OIDCScopeCreateWizard: FunctionComponent<OIDCScopeCreateWizardPropsInterface> = (
    props: OIDCScopeCreateWizardPropsInterface
): ReactElement => {
    const { closeWizard, currentStep, onUpdate, [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ submitGeneralDetails, setSubmitGeneralDetails ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

    const [ OIDCAttributes, setOIDCAttributes ] = useState<ExternalClaim[]>(undefined);
    const [ selectedAttributes, setSelectedAttributes ] = useState<ExternalClaim[]>([]);
    const [ isClaimRequestLoading, setIsClaimRequestLoading ] = useState<boolean>(false);
    const [ claims, setClaims ] = useState<Claim[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        getAllLocalClaims(null)
            .then((response) => {
                setClaims(response);
            })
            .catch((error) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.response?.data?.message ||
                            t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                    })
                );
            });
    }, []);

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

    useEffect(() => {
        if (OIDCAttributes) {
            return;
        }

        if (!claims || claims.length === 0) {
            return;
        }

        const OIDCAttributeId = OIDCScopesManagementConstants.OIDC_ATTRIBUTE_ID;
        getOIDCAttributes(OIDCAttributeId);
    }, [ OIDCAttributes, claims ]);

    const getOIDCAttributes = (claimId: string) => {
        getAllExternalClaims(claimId, null)
            .then((response) => {
                setIsClaimRequestLoading(true);
                response?.forEach((externalClaim) => {
                    const mappedLocalClaimUri = externalClaim.mappedLocalClaimURI;
                    const matchedLocalClaim = claims.filter((localClaim) => {
                        return localClaim.claimURI === mappedLocalClaimUri;
                    });

                    if (matchedLocalClaim && matchedLocalClaim[ 0 ] && matchedLocalClaim[ 0 ].displayName) {
                        externalClaim.localClaimDisplayName = matchedLocalClaim[ 0 ].displayName;
                    }
                });

                setOIDCAttributes(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.oidcScopes.notifications.fetchOIDClaims.error" + ".message")
                    });

                    return;
                }
                setAlert({
                    description: t(
                        "console:manage.features.oidcScopes.notifications.fetchOIDClaims" + ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.oidcScopes.notifications.fetchOIDClaims.genericError" + ".message"
                    )
                });
            })
            .finally(() => {
                setIsClaimRequestLoading(false);
            });
    };

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setSubmitGeneralDetails();
                submitScopeForm();
                break;
            case 1:
                setFinishSubmit();
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    const handleWizardFormFinish = (attributes: string[]): void => {
        const data: OIDCScopesListInterface = {
            claims: attributes,
            description: wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.description
                ? wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.description
                : "This is the description of the scope",
            displayName: wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.displayName,
            name: wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.scopeName
        };

        setIsClaimRequestLoading(true);

        createOIDCScope(data)
            .then(() => {
                closeWizard();
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.addOIDCScope" + ".success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.oidcScopes.notifications.addOIDCScope" + ".success.message")
                    })
                );
                onUpdate();
            })
            .catch((error) => {
                closeWizard();
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.oidcScopes.notifications.addOIDCScope.error." + "message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.addOIDCScope" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.oidcScopes.notifications.addOIDCScope.genericError." + "message"
                        )
                    })
                );
            })
            .finally(() => {
                setIsClaimRequestLoading(false);
            });
    };

    let submitScopeForm: () => void;

    const STEPS = [
        {
            content: (
                <AddOIDCScopeForm
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    triggerSubmit={ submitGeneralDetails }
                    triggerSubmission={ (submitFunction: () => void) => {
                        submitScopeForm = submitFunction; } }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    data-testid={ `${ testId }-form` }
                />
            ),
            icon: getOIDCScopeWizardStepIcons().general,
            title: t("console:manage.features.oidcScopes.wizards.addScopeWizard.steps.basicDetails")
        },
        {
            content: (
                <AttributeSelectList
                    availableExternalClaims={ OIDCAttributes }
                    setAvailableExternalClaims={ () => null }
                    setInitialSelectedExternalClaims={ (response: ExternalClaim[]) => {
                        const claimURIs: string[] = response?.map((claim: ExternalClaim) => claim.claimURI);
                        if (claimURIs?.length > 0) {
                            setIsSubmitting(true);
                            handleWizardFormFinish(claimURIs);
                        } else {
                            setAlert({
                                description: t(
                                    "console:manage.features.oidcScopes.notifications.claimsMandatory"
                                    + ".error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.oidcScopes.notifications.claimsMandatory.error"
                                    + ".message"
                                )
                            });
                        }
                    } }
                    onUpdate={ () => null }
                    selectedExternalClaims={ selectedAttributes }
                    triggerSubmit={ finishSubmit }
                />
            ),
            icon: getOIDCScopeWizardStepIcons().claimConfig,
            title: t("console:manage.features.oidcScopes.wizards.addScopeWizard.steps.claims")
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
                { t("console:manage.features.oidcScopes.wizards.addScopeWizard.title") }
                <Heading as="h6">{ t("console:manage.features.oidcScopes.wizards.addScopeWizard.subTitle") }</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group current={ currentWizardStep } data-testid={ `${ testId }-steps` }>
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container attribute-list" scrolling>
                { alert && alertComponent }
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
                                    <Icon name="arrow right" />
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
                                    <Icon name="arrow left" />
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
 * Default props for the add OIDC scope form component.
 */
OIDCScopeCreateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "add-oidc-scope-wizard"
};
