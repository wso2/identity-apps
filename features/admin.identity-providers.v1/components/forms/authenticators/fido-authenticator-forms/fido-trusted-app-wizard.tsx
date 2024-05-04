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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    URLInput
} from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider, Grid, Modal } from "semantic-ui-react";
import { getTechnologyLogos } from "../../../../../admin.core.v1";
import { FIDOTrustedAppTypes } from "../../../../models";
import "./fido-trusted-app-wizard.scss";
import { isValidSHA256 } from "../../../../utils/validation-utils";

/**
 * The props interface for the 'FIDOTrustedAppWizard' component.
 */
interface FIDOTrustedAppWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Function for adding a new trusted app.
     */
    updateTrustedApps: (
        appName: string, appType: FIDOTrustedAppTypes, deleteApp?: boolean, shaValues?: string[]) => void,
    /**
     * Close the wizard.
     */
    closeWizard: () => void;
}

const APP_NAME_MAX_LENGTH: number = 255;
const APP_NAME_MIN_LENGTH: number = 1;

/**
 * FIDO Trusted App wizard.
 */
export const FIDOTrustedAppWizard: FunctionComponent<FIDOTrustedAppWizardPropsInterface> = (
    props: FIDOTrustedAppWizardPropsInterface
): ReactElement => {

    const {
        updateTrustedApps,
        closeWizard,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ selectedAppType, setSelectedAppType ] = useState<FIDOTrustedAppTypes>(FIDOTrustedAppTypes.ANDROID);
    const [ shaValues, setSHAValues ] = useState<string>("");

    /**
     * Handle the form submission.
     */
    const handleFormSubmit = (values: { appName: string }) => {
        updateTrustedApps(values?.appName, selectedAppType, false, shaValues?.split(","));
        closeWizard();
    };

    /**
     * Function to trigger the submission.
     */
    let triggerFormSubmission: () => void;

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("authenticationProvider:forms.authenticatorSettings." +
                    "fido2.trustedApps.wizard.title") }
                <Heading as="h6">
                    { t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.wizard.subTitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container fido-trusted-apps-wizard-form-modal" scrolling>
                <Form
                    id={ `${componentId}-form` }
                    uncontrolledForm={ false }
                    onSubmit={ handleFormSubmit }
                    triggerSubmit={ (submitFunction: () => void) => triggerFormSubmission = submitFunction }
                    validate={
                        (values: { appName: string }) => {
                            if (!values.appName) {
                                return {
                                    appName: t("authenticationProvider:forms.authenticatorSettings." +
                                    "fido2.trustedApps.wizard.fields.appName.requiredErrorMessage")
                                };
                            }

                            return null;
                        }
                    }
                >
                    <Field.Input
                        ariaLabel="appName"
                        inputType="default"
                        name="appName"
                        label={ t("authenticationProvider:forms.authenticatorSettings." +
                            "fido2.trustedApps.wizard.fields.appName.label") }
                        required
                        placeholder={ t("authenticationProvider:forms.authenticatorSettings." +
                            "fido2.trustedApps.wizard.fields.appName.placeholder") }
                        data-testid={ `${ componentId }-app-name` }
                        maxLength={ APP_NAME_MAX_LENGTH }
                        minLength={ APP_NAME_MIN_LENGTH }
                        className="fido-trusted-app-name-field"
                    />
                    <div className="app-type-selection-section">
                        <label className="app-type-label">
                            { t("authenticationProvider:forms.authenticatorSettings." +
                                "fido2.trustedApps.wizard.fields.appType.label") }
                        </label>
                        <Card.Group itemsPerRow={ 3 } className="app-type-selection-card-group">
                            <SelectionCard
                                image={ getTechnologyLogos()?.android }
                                size="small"
                                className="app-type-selection-card"
                                header={ t("authenticationProvider:forms.authenticatorSettings." +
                                        "fido2.trustedApps.types.android") }
                                selected={ selectedAppType === FIDOTrustedAppTypes.ANDROID }
                                onClick={ () => setSelectedAppType(FIDOTrustedAppTypes.ANDROID) }
                                imageSize="x30"
                                imageOptions={ {
                                    relaxed: true,
                                    square: false,
                                    width: "auto"
                                } }
                                contentTopBorder={ false }
                                showTooltips={ false }
                                renderDisabledItemsAsGrayscale={ false }
                                data-testid={ `${ componentId }-${ FIDOTrustedAppTypes.ANDROID }-card` }
                            />
                            <SelectionCard
                                image={ getTechnologyLogos()?.apple }
                                size="small"
                                className="app-type-selection-card"
                                header={ t("authenticationProvider:forms.authenticatorSettings." +
                                        "fido2.trustedApps.types.ios") }
                                selected={ selectedAppType === FIDOTrustedAppTypes.IOS }
                                onClick={ () => setSelectedAppType(FIDOTrustedAppTypes.IOS) }
                                imageSize="x30"
                                imageOptions={ {
                                    relaxed: true,
                                    square: false,
                                    width: "auto"
                                } }
                                contentTopBorder={ false }
                                showTooltips={ false }
                                renderDisabledItemsAsGrayscale={ false }
                                data-testid={ `${ componentId }-${ FIDOTrustedAppTypes.IOS }-card` }
                            />
                        </Card.Group>
                    </div>
                    <URLInput
                        urlState={ shaValues }
                        setURLState={ (shaValues: string) => {
                            if (shaValues !== undefined) {
                                setSHAValues(shaValues);
                            }
                        } }
                        labelName={
                            t("authenticationProvider:forms." +
                                    "authenticatorSettings.fido2.trustedAppSHAValues.label")
                        }
                        placeholder={
                            t("authenticationProvider:forms." +
                                    "authenticatorSettings.fido2.trustedAppSHAValues.placeholder")
                        }
                        validationErrorMsg={
                            t("authenticationProvider:forms." +
                                    "authenticatorSettings.fido2.trustedAppSHAValues.validations.invalid")
                        }
                        computerWidth={ 10 }
                        hint={
                            t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.hint")
                        }
                        addURLTooltip={ t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.add") }
                        duplicateURLErrorMessage={ t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.validations.duplicate") }
                        data-testid={ `${ componentId }-fido-trusted-app-key-hashes-input` }
                        required = { false }
                        showPredictions={ false }
                        isAllowEnabled={ false }
                        skipInternalValidation
                        validation={ isValidSHA256 }
                        readOnly={ selectedAppType === FIDOTrustedAppTypes.IOS }
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                type="button"
                                tabIndex={ 5 }
                                data-testid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ closeWizard }
                            >
                                { t("authenticationProvider:forms.authenticatorSettings." +
                                        "fido2.trustedApps.wizard.buttons.cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                type="button"
                                tabIndex={ 6 }
                                data-testid={ `${componentId}-finish-button` }
                                floated="right"
                                onClick={ () => triggerFormSubmission() }
                            >
                                { t("authenticationProvider:forms.authenticatorSettings." +
                                        "fido2.trustedApps.wizard.buttons.finish") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

FIDOTrustedAppWizard.defaultProps = {
    "data-componentid": "fido-trusted-app-wizard"
};
