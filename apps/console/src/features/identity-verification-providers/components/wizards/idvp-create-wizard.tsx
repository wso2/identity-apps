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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import {
    ContentLoader,
    GenericIcon,
    Heading,
    LinkButton,
    PrimaryButton,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon } from "semantic-ui-react";
import { ModalWithSidePanel } from "../../../core";
import {
    createIdentityVerificationProvider,
    useIDVPTemplate,
    useIdentityVerificationProviderList,
    useUIMetadata
} from "../../api";
import { getIDVPCreateWizardStepIcons } from "../../configs/ui";
import { IdentityVerificationProviderConstants } from "../../constants";
import {
    IDVPClaimMappingInterface,
    IDVPTypeMetadataInterface,
    IdentityVerificationProviderInterface
} from "../../models";
import {
    getInitialClaimMappingsFromTemplate,
    handleIDVPTemplateFetchRequestError,
    handleIdvpListFetchRequestError,
    handleUIMetadataLoadError,
    resolveIDVPImage,
    validateIDVPName
} from "../../utils";
import { performValidations, renderFormUIWithMetadata } from "../forms/helpers/dynamic-ui-helper";
import { AttributesSelectionWizardPage } from "../settings/attribute-management/attribute-selection-wizard-page";

/**
 * Enum for representing the wizard steps.
 */
enum WizardSteps {
    CONFIGURATION = "Configuration",
    IDVP_SETTINGS = "Identity Verification Provider Settings",
    ATTRIBUTES = "Attributes"
}

/**
 * Interface that represents wizard steps
 */
interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

/**
 * Interface that represents IDVP template form values.
 */
interface WizardFormValuesInterface {
    name: string;
    description: string;
    [ key: string ]: any;
}

const WIZARD_ID: string = "idvp-create-wizard-content";
const wizardSteps: WizardStepInterface[] = [
    {
        icon: getIDVPCreateWizardStepIcons().idvpSettings,
        name: WizardSteps.CONFIGURATION,
        title: "Configuration"
    },
    {
        icon: getIDVPCreateWizardStepIcons().general,
        name: WizardSteps.ATTRIBUTES,
        title: "Attributes"
    }
] as WizardStepInterface[];

/**
 * Proptypes for the IDVP create wizard component.
 */
interface IDVPCreateWizardInterface extends IdentifiableComponentInterface {
    /**
     * Show/Hide the wizard
     */
    showWizard: boolean;
    /**
     * Callback to be triggered on wizard close.
     */
    onWizardClose: () => void;
    /**
     * Callback to be triggered on successful IDVP create.
     */
    onIDVPCreate: (id?: string) => void;
    /**
     * Type of the wizard.
     */
    type: string;
    /**
     * Type of the selected template.
     */
    selectedTemplateType: IDVPTypeMetadataInterface;
}

/**
 * IDVP create wizard component.
 *
 * @param props - Props injected to the component.
 * @returns ReactElement
 */
export const IdvpCreateWizard: FunctionComponent<IDVPCreateWizardInterface> = (
    props: IDVPCreateWizardInterface
): ReactElement => {

    const {
        showWizard,
        onWizardClose,
        selectedTemplateType,
        onIDVPCreate
    } = props;

    const wizardRef: React.MutableRefObject<any> = useRef(null);
    const componentId: string = "idvp-create-wizard-factory";

    const { t } = useTranslation();

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();
    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ] = useState<IDVPClaimMappingInterface[]>([]);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const {
        data: idvpList,
        isLoading: isIDVPListRequestLoading,
        error: idvpListFetchRequestError
    } = useIdentityVerificationProviderList();

    const {
        data: idvpTemplate,
        isLoading: isIDVPTemplateRequestLoading,
        error: idvpTemplateFetchRequestError
    } = useIDVPTemplate(selectedTemplateType?.id);

    const {
        data: uiMetaData,
        error: uiMetaDataLoadError,
        isLoading: isUIMetadataLoading
    } = useUIMetadata(selectedTemplateType?.id);

    const [ isNextDisabled, setIsNextDisabled ] = useState<boolean>(false);

    /**
     * Called when idvpListFetchRequestError changes to handle IDVP list fetch request error.
     */
    useEffect(() => {
        if(!idvpListFetchRequestError) {
            return;
        }
        handleIdvpListFetchRequestError(idvpListFetchRequestError);
    }, [ idvpListFetchRequestError ]);

    /**
     * Called when uiMetaDataLoadError changes to handle UI metadata load error.
     */
    useEffect(() => {
        if(!uiMetaDataLoadError) {
            return;
        }
        handleUIMetadataLoadError(uiMetaDataLoadError);
    }, [ uiMetaDataLoadError ]);

    /**
     * Called when idvpTemplateFetchRequestError changes to handle IDVP template fetch request error.
     */
    useEffect(() => {
        if (!idvpTemplateFetchRequestError) {
            return;
        }
        handleIDVPTemplateFetchRequestError(idvpTemplateFetchRequestError);
    }, [ idvpTemplateFetchRequestError ]);


    /**
     * Creates a new identity verification provider.
     *
     * @param modifiedIDVPTemplate - IDVP template with user modifications.
     * @returns void
     */
    const createNewIDVP = (modifiedIDVPTemplate: IdentityVerificationProviderInterface): void => {

        setIsSubmitting(true);

        createIdentityVerificationProvider(modifiedIDVPTemplate)
            .then((response:AxiosResponse) => {

                dispatch(addAlert({
                    description: t("console:develop.features.idvp.notifications.addIDVP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idvp.notifications.addIDVP.success.message")
                }));

                // The id of the created IDVP is sent in the response body.If that's available,
                // navigate to the edit page.
                if (response?.data?.id) {
                    onIDVPCreate(response.data.id);

                    return;
                }

                // Since the id is not present in the response body, trigger callback without the id.
                onIDVPCreate();
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    setAlert({
                        description: t("console:develop.features.idvp.notifications.addIDVP.error.description",
                            { description: error.response.data.description }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.idvp.notifications.addIDVP.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.idvp.notifications.addIDVP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idvp.notifications.addIDVP.genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            })
        ;
    };

    /**
     * Handles closing the IDVP create wizard.
     * @returns void
     */
    const handleWizardClose = (): void => {
        // Clear alerts if any.
        if(alert){
            setAlert(undefined);
        }
        onWizardClose();
    };

    /**
     * Resolve the step wizard actions.
     *
     * @returns Resolved step wizard actions.
     */
    const resolveStepActions = (): ReactElement => {

        return (
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton
                            floated="left"
                            onClick={ handleWizardClose }
                            data-componentid={ `${ componentId }-modal-cancel-button` }>
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        { /*Check whether we have more steps*/ }
                        { currentWizardStep < wizardSteps.length - 1 && (
                            <PrimaryButton
                                disabled={ isNextDisabled }
                                floated="right"
                                onClick={ () => {
                                    wizardRef.current.gotoNextPage();
                                } }
                                data-componentid={ `${ componentId }-modal-next-button` }>
                                { t("authenticationProvider:wizards.buttons.next") }
                                <Icon name="arrow right"/>
                            </PrimaryButton>
                        ) }
                        { /*Check whether it's the last step*/ }
                        { currentWizardStep === wizardSteps.length - 1 && (
                            // Note that we use the same logic as the next button
                            // element. This is because we pass a callback to
                            // onSubmit which triggers a dedicated handler.
                            <PrimaryButton
                                disabled={ isNextDisabled || isSubmitting }
                                type="submit"
                                floated="right"
                                onClick={ () => {
                                    wizardRef.current.gotoNextPage();
                                } }
                                data-componentid={ `${ componentId }-modal-finish-button` }
                                loading={ isSubmitting }
                            >
                                { t("authenticationProvider:wizards.buttons.finish") }
                            </PrimaryButton>
                        ) }
                        { currentWizardStep > 0 && (
                            <LinkButton
                                type="submit"
                                floated="right"
                                onClick={ () => wizardRef.current.gotoPreviousPage() }
                                data-componentid={ `${ componentId }-modal-previous-button` }>
                                <Icon name="arrow left"/>
                                { t("authenticationProvider:wizards.buttons." +
                                    "previous") }
                            </LinkButton>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
     * Resolves the content of wizard pages.
     */
    const resolveWizardPages = (): Array<ReactElement> => {
        return [
            wizardConfigurationPage(),
            wizardAttributesPage()
        ];
    };

    /**
     * Renders the configurations wizard page.
     *
     * @returns Configurations wizard page.
     */
    const wizardConfigurationPage = (): ReactElement => {

        /**
         * Validates the configuration page data.
         *
         * @param values - values of the configuration form.
         * @returns error message to be displayed if there is a validation error.
         */
        const validateConfigurationPage = (values: any): string => {

            const nameValidationError: string = validateIDVPName(values?.name, idvpList.identityVerificationProviders);

            if(nameValidationError) {
                setIsNextDisabled(true);

                return nameValidationError;
            }

            for(const setting of uiMetaData?.pages?.edit?.settings) {
                const configurationValidationError: string = performValidations( values[setting.name], setting);

                if(configurationValidationError) {
                    setIsNextDisabled(true);

                    return configurationValidationError;
                }
            }
            setIsNextDisabled(false);
        };

        return (
            <WizardPage
                validate={ validateConfigurationPage }
            >
                <Field.Input
                    ariaLabel="name"
                    inputType="resource_name"
                    name="name"
                    label={ t("console:develop.features.idvp.forms.generalDetails.name.label") }
                    required={ true }
                    message={ t("console:develop.features.idvp.forms.generalDetails.name.validations.empty") }
                    placeholder={ t("console:develop.features.idvp.forms.generalDetails.name.placeholder") }
                    validate={ (value: string) => validateIDVPName(value, idvpList.identityVerificationProviders) }
                    maxLength={ IdentityVerificationProviderConstants.IDVP_NAME_MAX_LENGTH }
                    minLength={ IdentityVerificationProviderConstants.IDVP_NAME_MIN_LENGTH }
                    format={ (values: any) => values.toString().trimStart() }
                    data-componentid={ `${ componentId }-form-wizard-idvp-name` }
                    hint={ t("console:develop.features.idvp.forms.generalDetails.name.hint") }
                />
                { renderFormUIWithMetadata(uiMetaData?.pages?.edit?.settings, idvpTemplate) }
            </WizardPage>);
    };

    /**
     * Renders the attribute settings wizard page.
     *
     * @returns Attribute Settings wizard page.
     */
    const wizardAttributesPage = (): ReactElement => (
        <WizardPage>
            <AttributesSelectionWizardPage
                mappedAttributesList={ selectedClaimsWithMapping }
                initialClaims={ getInitialClaimMappingsFromTemplate(idvpTemplate.claims) }
                hideIdentityClaimAttributes={ true }
                data-componentid={ `${ componentId }-attribute-settings` }
                setMappedAttributeList={ setSelectedClaimsWithMapping }
            />
        </WizardPage>
    );

    /**
     * Handles the form submit action.
     *
     * @param values - Form values.
     * @returns void
     */
    const handleFormSubmit = (values: WizardFormValuesInterface): void => {

        // Update the name and description on the template with the values from the form.
        idvpTemplate.Name = values?.name ?? idvpTemplate.Name;
        idvpTemplate.description = values?.description ?? idvpTemplate.description;

        // Update the config properties on the template with the values from the form.
        for(const configs of idvpTemplate?.configProperties) {
            if(values[configs?.key]){
                configs.value = values[configs?.key];
            }
        }

        // Update the claims on the template with the claim mappings selected by the user.
        idvpTemplate.claims = selectedClaimsWithMapping.map((claim: IDVPClaimMappingInterface) => {
            return {
                idvpClaim: claim.idvpClaim,
                localClaim: claim.localClaim.uri
            };
        });
        createNewIDVP(idvpTemplate);
    };

    /**
     * Render the wizard header.
     *
     * @returns Wizard header.
     */
    const renderWizardHeader = (): ReactElement => (
        <div className="display-flex">
            <GenericIcon
                icon={ resolveIDVPImage(selectedTemplateType.image) }
                size="x30"
                transparent
                spaced={ "right" }
                data-componentid={ `${ componentId }-image` }/>
            <div>
                { selectedTemplateType.name }
                { selectedTemplateType.description && (
                    <Heading as="h6">
                        { selectedTemplateType.description }
                    </Heading>
                ) }
            </div>
        </div>
    );

    /**
     * Renders the wizard steps group.
     *
     * @returns rendered step
     */
    const renderStepsGroup = (): ReactElement => (
        <Steps.Group
            current={ currentWizardStep }>
            { wizardSteps.map((step: WizardStepInterface, index: number) => (
                <Steps.Step
                    active
                    key={ index }
                    icon={ step.icon }
                    title={ step.title }/>
            )) }
        </Steps.Group>
    );

    /**
     * Renders the wizard pages and alerts onto the modal.
     *
     * @returns Wizard content.
     */
    const renderWizardContent = () => (
        <>
            { alert && alertComponent }
            { isIDVPListRequestLoading ? <ContentLoader/> : (
                <Wizard2
                    id={ WIZARD_ID }
                    ref={ wizardRef }
                    onSubmit={ handleFormSubmit }
                    uncontrolledForm={ true }
                    pageChanged={ (index: number) => setCurrentWizardStep(index) }
                    data-componentid={ componentId }>
                    { resolveWizardPages() }
                </Wizard2>
            ) }
        </>
    );

    return (showWizard && !isIDVPListRequestLoading && !isIDVPTemplateRequestLoading && !isUIMetadataLoading)
        ? (
            <ModalWithSidePanel
                open={ showWizard }
                className="wizard identity-verification-provider-create-wizard"
                dimmer="blurring"
                onClose={ onWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-componentid={ `${ componentId }-modal` }>
                <ModalWithSidePanel.MainPanel>
                    <ModalWithSidePanel.Header
                        className="wizard-header"
                        data-componentid={ `${ componentId }-modal-header` }>
                        { renderWizardHeader() }
                    </ModalWithSidePanel.Header>
                    <React.Fragment>
                        <ModalWithSidePanel.Content
                            className="steps-container"
                            data-componentid={ `${ componentId }-modal-content-1` }>
                            { renderStepsGroup() }
                        </ModalWithSidePanel.Content>
                        <ModalWithSidePanel.Content
                            className="content-container"
                            data-componentid={ `${ componentId }-modal-content-2` }>
                            { renderWizardContent() }
                        </ModalWithSidePanel.Content>
                    </React.Fragment>
                    <ModalWithSidePanel.Actions
                        data-componentid={ `${ componentId }-modal-actions` }>
                        { resolveStepActions() }
                    </ModalWithSidePanel.Actions>
                </ModalWithSidePanel.MainPanel>
            </ModalWithSidePanel>
        )
        : null;
};

/**
 * Default props for the Authenticator Create Wizard factory.
 */
IdvpCreateWizard.defaultProps = {
    "data-componentid": "idvp-create-wizard"
};
