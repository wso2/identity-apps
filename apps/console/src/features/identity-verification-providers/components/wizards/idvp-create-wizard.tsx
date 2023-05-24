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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {Field, FormValue, Wizard2, WizardPage} from "@wso2is/form";
import {
    ContentLoader,
    GenericIcon,
    Heading,
    LinkButton,
    PrimaryButton,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon } from "semantic-ui-react";
import { ModalWithSidePanel } from "../../../core";
import { createIdentityVerificationProvider, useIdentityVerificationProviderList } from "../../api";
import { useIDVPTemplate, useUIMetadata } from "../../api/ui-metadata";
import { getIdentityVerificationProviderWizardStepIcons } from "../../configs/ui";
import { IdentityVerificationProviderConstants } from "../../constants/identity-verification-provider-constants";
import { IDVPClaimMappingInterface, IdentityVerificationProviderInterface } from "../../models";
import { IDVPTypeMetadataInterface } from "../../models/ui-metadata";
import {
    getInitialClaimFromTemplate,
    handleIDVPTemplateFetchRequestError,
    handleIdvpListFetchRequestError,
    handleUIMetadataLoadError,
    resolveIDVPImage,
    validateIDVPName
} from "../../utils";
import { performValidations, renderFormUIWithMetadata } from "../forms/helpers";
import { AttributesSelectionWizardPage } from "../settings/attribute-management";

enum WizardSteps {
    GENERAL_DETAILS = "GeneralDetails",
    IDVP_SETTINGS = "Identity Verification Provider Settings",
    ATTRIBUTES = "Attributes"
}

interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

interface WizardFormValuesInterface {
    name: string;
    description: string;
    [ key: string ]: any;
}


const WIZARD_ID: string = "idvp-create-wizard-content";
const wizardSteps: WizardStepInterface[] = [
    {
        icon: getIdentityVerificationProviderWizardStepIcons().general,
        name: WizardSteps.GENERAL_DETAILS,
        title: "General"
    },
    {
        icon: getIdentityVerificationProviderWizardStepIcons().idvpSettings,
        name: WizardSteps.IDVP_SETTINGS,
        title: "Settings"
    },
    {
        icon: getIdentityVerificationProviderWizardStepIcons().general,
        name: WizardSteps.ATTRIBUTES,
        title: "Attributes"
    }
] as WizardStepInterface[];

/**
 * Proptypes for the Authenticator Create Wizard factory.
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
     * Callback to be triggered on successful IDP create.
     */
    onIDVPCreate: (id?: string) => void;
    /**
     * Type of the wizard.
     */
    type: string;
    selectedTemplateType: IDVPTypeMetadataInterface;
}

/**
 * Authenticator Create Wizard factory.
 *
 * @param props - Props injected to the component.
 *
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
    const componentId: string = "idp-create-wizard-factory";

    const { t } = useTranslation();

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();
    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ] = useState<IDVPClaimMappingInterface[]>([]);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const {
        data: idvpList,
        isLoading: isIDVPListRequestLoading,
        error: idvpListFetchRequestError,
    } = useIdentityVerificationProviderList();

    const {
        data: idvpTemplate,
        isLoading: isIDVPTemplateRequestLoading,
        error: idvpTemplateFetchRequestError,
    } = useIDVPTemplate(selectedTemplateType?.id);

    const {
        data: uiMetaData,
        error: uiMetaDataLoadError,
        isLoading: isUIMetadataLoading
    } = useUIMetadata(selectedTemplateType?.id);

    const [ isNextDisabled, setIsNextDisabled ] = useState<boolean>(false);

    useEffect(() => {
        handleIdvpListFetchRequestError(idvpListFetchRequestError);
    }, [ idvpListFetchRequestError ]);

    useEffect(() => {
        handleUIMetadataLoadError(uiMetaDataLoadError);
    }, [ uiMetaDataLoadError ]);

    useEffect(() => {
        handleIDVPTemplateFetchRequestError(idvpTemplateFetchRequestError);
    }, [ idvpTemplateFetchRequestError ]);


    /**
     * Creates a new identity provider.
     *
     * @param modifiedIDVPTemplate - Identity provider object.
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
            .catch((error: AxiosError) => {
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

    const handleWizardClose = (): void => {
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
                            data-testid={ `${ componentId }-modal-cancel-button` }>
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
                                data-testid={ `${ componentId }-modal-next-button` }>
                                { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
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
                                data-testid={ `${ componentId }-modal-finish-button` }
                                loading={ isSubmitting }
                            >
                                { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                            </PrimaryButton>
                        ) }
                        { currentWizardStep > 0 && (
                            <LinkButton
                                type="submit"
                                floated="right"
                                onClick={ () => wizardRef.current.gotoPreviousPage() }
                                data-testid={ `${ componentId }-modal-previous-button` }>
                                <Icon name="arrow left"/>
                                { t("console:develop.features.authenticationProvider.wizards.buttons." +
                                    "previous") }
                            </LinkButton>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    const resolveWizardPages = (): Array<ReactElement> => {
        return [
            wizardCommonFirstPage(),
            wizardConfigurationPage(),
            wizardAttributesPage()
        ];
    };

    const wizardCommonFirstPage = () => (
        <WizardPage>
            <Field.Input
                ariaLabel="name"
                inputType="resource_name"
                name="name"
                label={ t("console:develop.features.idvp.forms.generalDetails.name.label") }
                required={ true }
                message={ t("console:develop.features.idvp.forms.generalDetails.name.validations.empty") }
                placeholder={ t("console:develop.features.idvp.forms.generalDetails.name.placeholder") }
                validate={ (value: string) => {
                    setIsNextDisabled(true);
                    const validationError: string = validateIDVPName(value, idvpList.identityVerificationProviders);

                    if (!validationError) {
                        setIsNextDisabled(false);
                    }

                    return validationError;
                } }
                maxLength={ IdentityVerificationProviderConstants.IDVP_NAME_MAX_LENGTH }
                minLength={ IdentityVerificationProviderConstants.IDVP_NAME_MIN_LENGTH
                }
                format={ (values: any) => {
                    return values.toString().trimStart();
                } }
                data-testid={ `${ componentId }-form-wizard-idvp-name` }
                hint={ t("console:develop.features.idvp.forms.generalDetails.name.hint") }
            />
            <Field.Textarea
                name="description"
                ariaLabel="description"
                label={ t("console:develop.features.idvp.forms.generalDetails.description.label") }
                required={ false }
                placeholder={ t("console:develop.features.idvp.forms.generalDetails.description.placeholder") }
                data-testid={ `${ componentId }-idp-description` }
                maxLength={ IdentityVerificationProviderConstants.IDVP_DESCRIPTION_MAX_LENGTH }
                minLength={ IdentityVerificationProviderConstants.IDVP_DESCRIPTION_MIN_LENGTH }
                hint={ t("console:develop.features.idvp.forms.generalDetails.description.hint") }
            />
        </WizardPage>
    );

    const wizardConfigurationPage = () => {

        const validateConfigurationData = (values: any) => {
            for(const setting of uiMetaData?.pages?.edit?.settings) {
                const validationError: string = performValidations( values[setting.name], setting);

                if(validationError) {
                    setIsNextDisabled(true);

                    return validationError;
                }
            }
            setIsNextDisabled(false);
        };

        return (
            <WizardPage
                validate={ validateConfigurationData }>
                { renderFormUIWithMetadata(uiMetaData?.pages?.edit?.settings, idvpTemplate) }
            </WizardPage>);
    };

    const wizardAttributesPage = () => (


        <WizardPage>

            <AttributesSelectionWizardPage
                mappedAttributesList={ selectedClaimsWithMapping }
                initialClaims={ getInitialClaimFromTemplate(idvpTemplate.claims) }
                hideIdentityClaimAttributes={ true }
                data-componentid={ `${ componentId }-attribute-settings` }
                setMappedAttributeList={ setSelectedClaimsWithMapping }
            />
        </WizardPage>
    );

    /**
     * - @param form - form instance
     * - @param callback - callback to update the form values
     */
    const handleFormSubmit = (values: WizardFormValuesInterface) => {

        idvpTemplate.Name = values?.name ?? idvpTemplate.Name;
        idvpTemplate.description = values?.description ?? idvpTemplate.description;

        for(const configs of idvpTemplate?.configProperties) {
            if(values[configs?.key]){
                configs.value = values[configs?.key];
            }
        }

        idvpTemplate.claims = selectedClaimsWithMapping.map((claim: IDVPClaimMappingInterface) => {
            return {
                idvpClaim: claim.idvpClaim,
                localClaim: claim.localClaim.uri
            };
        });
        createNewIDVP(idvpTemplate);

    };

    const renderWizardHeader = () => (
        <div className={ "display-flex" }>
            <GenericIcon
                icon={ resolveIDVPImage(selectedTemplateType.image) }
                size="x30"
                transparent
                spaced={ "right" }
                data-testid={ `${ componentId }-image` }/>
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

    const renderStepsGroup = () => (
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
                    data-testid={ componentId }>
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
                data-testid={ `${ componentId }-modal` }>
                <ModalWithSidePanel.MainPanel>
                    <ModalWithSidePanel.Header
                        className="wizard-header"
                        data-testid={ `${ componentId }-modal-header` }>
                        { renderWizardHeader() }
                    </ModalWithSidePanel.Header>
                    <React.Fragment>
                        <ModalWithSidePanel.Content
                            className="steps-container"
                            data-testid={ `${ componentId }-modal-content-1` }>
                            { renderStepsGroup() }
                        </ModalWithSidePanel.Content>
                        <ModalWithSidePanel.Content
                            className="content-container"
                            data-testid={ `${ componentId }-modal-content-2` }>
                            { renderWizardContent() }
                        </ModalWithSidePanel.Content>
                    </React.Fragment>
                    <ModalWithSidePanel.Actions
                        data-testid={ `${ componentId }-modal-actions` }>
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
