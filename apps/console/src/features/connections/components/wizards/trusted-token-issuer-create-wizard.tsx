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

import Alert from "@oxygen-ui/react/Alert";
import Grid from "@oxygen-ui/react/Grid";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import {
    CertFileStrategy,
    DocumentationLink,
    FilePicker,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PickerResult,
    PrimaryButton,
    Steps,
    Switcher,
    SwitcherOptionProps,
    useDocumentation,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FC,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Icon, Modal } from "semantic-ui-react";
import { commonConfig } from "../../../../extensions";
import {
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    TierLimitReachErrorModal,
    getCertificateIllustrations
} from "../../../core";
import {
    CertificateType,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderFormValuesInterface,
    IdentityProviderInitialValuesInterface,
    IdentityProviderInterface,
    TrsutedTokenIssuerWizardStep,
    TrustedTokenIssuerWizardStepInterface
} from "../../../identity-providers/models";
import { createConnection } from "../../api/connections";
import { getConnectionIcons, getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

/**
 * Proptypes for the enterprise identity provider
 * creation wizard component.
 */
type TrustedTokenIssuerCreateWizardProps = GenericIdentityProviderCreateWizardPropsInterface &
    IdentifiableComponentInterface;

export const TrustedTokenIssuerCreateWizard: FC<TrustedTokenIssuerCreateWizardProps> = (
    props: PropsWithChildren<TrustedTokenIssuerCreateWizardProps>
): ReactElement => {

    const {
        onWizardClose,
        currentStep,
        onIDPCreate,
        title,
        subTitle,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    // General constants
    const CERT_FILE_PROCESSING_STRATEGY: CertFileStrategy = new CertFileStrategy();

    const wizardRef: MutableRefObject<any> = useRef(null);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ jwksUrl, setJwksURL ] = useState<string>(null);
    const [ pemString, setPemString ] = useState<string>("");
    const [ selectedCertificateFile, setSelectedCertificateFile ] = useState<File>(null);
    const [ isPemCertValid, setIsPemCertValid ] = useState<boolean>(false);
    const [ selectedCertInputType, setSelectedCertInputType ] = useState<CertificateType>(CertificateType.JWKS);
    const [ pastedPEMContent, setPastedPEMContent ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);
    const [ finishShouldBeDisabled, setFinishShouldBeDisabled ] = useState<boolean>(true);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);

    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    // Options list for the certificate type switcher.
    const certificateOptions: [SwitcherOptionProps, SwitcherOptionProps] = [
        {
            label: t("console:develop.features.authenticationProvider." +
                "templates.trustedTokenIssuer.forms.jwksUrl.optionLabel"),
            value: CertificateType.JWKS
        },
        {
            label: t("console:develop.features.authenticationProvider." +
                "templates.trustedTokenIssuer.forms.pem.optionLabel"),
            value: CertificateType.PEM
        }
    ];

    /**
     * Initial values of the form.
     */
    const initialValues: IdentityProviderInitialValuesInterface = {
        NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
        RequestMethod: "post",
        name: ""
    };

    /**
     * Get the list of steps for the wizard.
     *
     * @returns `TrustedTokenIssuerWizardStepInterface[]`
     */
    const getWizardSteps = (): TrustedTokenIssuerWizardStepInterface[] => [
        {
            content: wizardCommonFirstPage(),
            icon: getConnectionWizardStepIcons().general,
            name: TrsutedTokenIssuerWizardStep.GENERAL_DETAILS,
            title: t("console:develop.features.authenticationProvider.templates.trustedTokenIssuer.forms.steps.general")
        },
        {
            content: certificatesPage(),
            icon: getConnectionWizardStepIcons().general,
            name: TrsutedTokenIssuerWizardStep.CERTIFICATES,
            title: t("console:develop.features.authenticationProvider.templates.trustedTokenIssuer.forms.steps." +
                "certificate")
        }
    ];

    /**
     * Check if the typed IDP name is already taken.
     *
     * @param userInput - User input for the IDP name.
     * @returns `true` if the IDP name is already taken else `false`.
     */
    const isIdpNameAlreadyTaken = (userInput: string): Promise<boolean> =>  {
        return ConnectionsManagementUtils.searchIdentityProviderName(userInput)
            .then((isIdpExist: boolean) => {
                return Promise.resolve(isIdpExist);
            })
            .catch(() => {
                /**
                 * Ignore the error, as a failed identity provider search
                 * should not result in user blocking. However, if the
                 * identity provider name already exists, it will undergo
                 * validation from the backend, and any resulting errors
                 * will be displayed in the user interface.
                 */
                return Promise.resolve(false);
            });
    };

    /**
     * Check whether loop back call is allowed or not.
     *
     * @param value - URL to check.
     */
    const isLoopBackCall = (value: string): string =>
        !(URLUtils.isLoopBackCall(value) && commonConfig?.blockLoopBackCalls)
            ? undefined
            : t("console:develop.features.idp.forms.common.internetResolvableErrorMessage");

    /**
     * Create the token issuer body.
     *
     * @param values - Form values
     * @returns - `IdentityProviderFormValuesInterface`
     */
    const createTokenIssuerBody = (values: IdentityProviderFormValuesInterface): IdentityProviderInterface => {
        const identityProvider: IdentityProviderInterface = template.idp;

        identityProvider.templateId = template.templateId;
        identityProvider.description = template.description;

        // Populate general settings.
        identityProvider.name = values?.name?.toString();
        identityProvider.idpIssuerName = values?.issuer?.toString();
        identityProvider.alias = values?.alias?.toString();

        // Trusted token placeholder image.
        identityProvider.image = "assets/images/icons/trusted-token-issuer.svg";

        // Populate certificate settings.
        identityProvider[ "certificate" ][ "jwksUri" ] = jwksUrl ?? "";
        identityProvider[ "certificate" ][ "certificates" ] = [ pemString ? btoa(pemString) : "" ];

        return identityProvider;
    };

    /**
     * Handle the form submit action.
     *
     * @param values - Form values
     */
    const handleFormSubmit = (values: IdentityProviderFormValuesInterface) => {
        setIsSubmitting(true);

        const identityProvider: IdentityProviderInterface = createTokenIssuerBody(values);

        createConnection(identityProvider)
            .then((response: AxiosResponse) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId
                });

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.message")
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }
                onIDPCreate();
            })
            .catch((error: AxiosError) => {
                const identityAppsError: IdentityAppsError = ConnectionManagementConstants.ERROR_CREATE_LIMIT_REACHED;

                if (error?.response?.status === 403 &&
                    error?.response?.data?.code ===identityAppsError.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error?.response?.data?.description) {
                    setAlert({
                        description: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications.addIDP." +
                        "genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });

    };

    /**
     * This function returns the first page of the wizard.
     *
     * @returns `ReactElement`
     */
    const wizardCommonFirstPage = () => (
        <WizardPage>
            <Field.Input
                data-componentid={ `${ componentId }-form-wizard-name` }
                aria-label="name"
                ariaLabel="name"
                name="name"
                inputType="resource_name"
                placeholder={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.name.placeholder") }
                label= { t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.name.label") }
                maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                required={ true }
                width={ 15 }
                format = { (values: string) => values.trimStart() }
                validation={ async (values: string) => {
                    let errorMsg: string;

                    if (values && await isIdpNameAlreadyTaken(values)) {
                        errorMsg = t("console:develop.features.authenticationProvider." +
                            "forms.generalDetails.name.validations.duplicate");
                    }

                    if (!FormValidation.isValidResourceName(values)) {
                        errorMsg = t("console:develop.features.authenticationProvider." +
                            "templates.enterprise.validation.invalidName", { idpName: values });
                    }

                    setNextShouldBeDisabled(errorMsg !== undefined);

                    return errorMsg;
                } }
            />
            <Field.Input
                data-componentid={ `${ componentId }-form-wizard-issuer` }
                ariaLabel="issuer"
                aria-label="issuer"
                inputType="resource_name"
                name="issuer"
                placeholder={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.issuer.placeholder") }
                label={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.issuer.label") }
                hint={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.issuer.hint") }
                maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                required={ true }
                width={ 15 }
                format = { (values: string) => values.trimStart() }
                validation={ (values: string) => {
                    let errorMsg: string;

                    if (!FormValidation.resourceName(values)) {
                        errorMsg = t("console:develop.features.authenticationProvider." +
                            "templates.trustedTokenIssuer.forms.issuer.validation.notValid", { issuer: values });
                    }

                    setNextShouldBeDisabled(errorMsg !== undefined);

                    return errorMsg;
                } }
            />
            <Field.Input
                data-componentid={ `${ componentId }-form-wizard-alias` }
                ariaLabel="alias"
                aria-label="alias"
                inputType="resource_name"
                name="alias"
                placeholder={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.alias.placeholder") }
                label={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.alias.label") }
                hint={ t("console:develop.features.authenticationProvider." +
                    "templates.trustedTokenIssuer.forms.alias.hint", { productName: config.ui.productName }) }
                maxLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.max }
                minLength={ ConnectionManagementConstants.IDP_NAME_LENGTH.min }
                width={ 15 }
                format = { (values: string) => values.trimStart() }
                validation={ (values: string) => {
                    let errorMsg: string;

                    if (!FormValidation.resourceName(values)) {
                        errorMsg =  t("console:develop.features.authenticationProvider." +
                        "templates.trustedTokenIssuer.forms.alias.validation.notValid", { alias: values });
                    }

                    setNextShouldBeDisabled(errorMsg !== undefined);

                    return errorMsg;
                } }
            />
        </WizardPage>
    );

    /**
     * This function returns the certificates page of the wizard.
     *
     * @returns `ReactElement`
     */
    const certificatesPage = () => (
        <WizardPage>
            <Grid container rowSpacing={ 4 }>
                <Grid className="switcher-grid" container rowSpacing={ 2 }>
                    <Grid xs={ 12 }>
                        <Alert severity="info">
                            { t("console:develop.features.authenticationProvider." +
                                "templates.trustedTokenIssuer.forms.certificateType.requiredCertificate") }
                        </Alert>
                    </Grid>
                    <Grid md={ 12 } lg={ 8 }>
                        <div className="required-certificate-label">
                            { t("console:develop.features.authenticationProvider." +
                                "templates.trustedTokenIssuer.forms.certificateType.label") }
                        </div>
                        <Switcher
                            compact
                            defaultOptionValue={ certificateOptions[0].value }
                            selectedValue={ selectedCertInputType }
                            onChange={ ({ value }: SwitcherOptionProps) => {

                                switch (value) {
                                    case CertificateType.JWKS:
                                        setFinishShouldBeDisabled(jwksUrl === null);

                                        break;
                                    case CertificateType.PEM:
                                        setFinishShouldBeDisabled(!isPemCertValid);

                                        break;
                                }

                                setSelectedCertInputType(value as CertificateType);
                            } }
                            options={ certificateOptions }
                        />
                    </Grid>
                </Grid>
                <Grid xs={ 12 }>
                    { selectedCertInputType === CertificateType.JWKS && (
                        <Field.Input
                            ariaLabel="JWKS endpoint URL"
                            inputType="url"
                            name="jwks_endpoint"
                            label={ t("console:develop.features.authenticationProvider." +
                                "templates.trustedTokenIssuer.forms.jwksUrl.label") }
                            required
                            maxLength={ ConnectionManagementConstants.JWKS_URL_LENGTH.max }
                            minLength={ ConnectionManagementConstants.JWKS_URL_LENGTH.min }
                            width={ 15 }
                            initialValue={ "" }
                            placeholder={ t("console:develop.features.authenticationProvider." +
                                "templates.trustedTokenIssuer.forms.jwksUrl.placeholder") }
                            data-componentid={ `${ componentId }-form-wizard-oidc-jwks-endpoint-url` }
                            hint={ t("console:develop.features.authenticationProvider." +
                                "templates.trustedTokenIssuer.forms.jwksUrl.hint") }
                            validation={ (values: string) => {
                                let errorMsg: string;

                                if (!FormValidation.url(values)) {
                                    errorMsg = t("console:develop.features.authenticationProvider." +
                                        "templates.trustedTokenIssuer.forms.jwksUrl.validation.notValid");
                                }

                                if(!errorMsg) {
                                    errorMsg = isLoopBackCall(values);
                                }

                                if (errorMsg || values === "") {
                                    setJwksURL(null);
                                    !finishShouldBeDisabled && setFinishShouldBeDisabled(true);
                                } else {
                                    setJwksURL(values);
                                    finishShouldBeDisabled && setFinishShouldBeDisabled(false);
                                }

                                return errorMsg;
                            } }
                        />
                    ) }
                    { selectedCertInputType === CertificateType.PEM && (
                        <>
                            <FilePicker
                                key={ 2 }
                                file={ selectedCertificateFile }
                                pastedContent={ pastedPEMContent }
                                fileStrategy={ CERT_FILE_PROCESSING_STRATEGY }
                                normalizeStateOnRemoveOperations={ true }
                                onChange={ (result: PickerResult<string | File>) => {
                                    setPastedPEMContent(result.pastedContent);
                                    setSelectedCertificateFile(result.file);
                                    setPemString(result.serialized?.pem);
                                    setIsPemCertValid(result.valid);
                                    /**
                                     * If there's pasted content or a file, but it hasn't been serialized
                                     * and if it's not valid then we must disable the next button. This condition
                                     * implies =\> that when the input is optional but the user tries to enter
                                     * invalid content to the picker we can't enable next because it's invalid.
                                     */
                                    setFinishShouldBeDisabled(
                                        ((result.pastedContent?.length > 0 || result.file) &&
                                        !result.serialized) ||
                                        !result.valid
                                    );
                                } }
                                uploadButtonText={ t("console:develop.features.authenticationProvider." +
                                    "templates.trustedTokenIssuer.forms.pem.uploadCertificateButtonLabel") }
                                dropzoneText={ t("console:develop.features.authenticationProvider." +
                                    "templates.trustedTokenIssuer.forms.pem.dropzoneText") }
                                pasteAreaPlaceholderText={ t("console:develop.features.authenticationProvider." +
                                    "templates.trustedTokenIssuer.forms.pem.pasteAreaPlaceholderText") }
                                icon={ getCertificateIllustrations().uploadPlaceholder }
                                placeholderIcon={ <Icon name="file alternate" size={ "huge" }/> }
                                data-componentid={ `${ componentId }-form-wizard-pem-certificate` }
                            />
                            <Hint>
                                { t("console:develop.features.authenticationProvider." +
                                    "templates.trustedTokenIssuer.forms.pem.hint") }
                            </Hint>
                        </>
                    ) }
                </Grid>
            </Grid>
        </WizardPage>
    );

    /**
     * Resolves the documentation link when a protocol is selected.
     *
     * @returns Documentation link.
     */
    const resolveDocumentationLink = (): ReactElement => (
        <DocumentationLink
            link={ getLink("develop.connections.newConnection.trustedTokenIssuer.learnMore") }
        >
            { t("common:learnMore") }
        </DocumentationLink>
    );

    /**
     * Close the limit reached modal.
     */
    const handleLimitReachedModalClose = (): void => {
        setOpenLimitReachedModal(false);
        onWizardClose();
    };

    return (
        <>
            { openLimitReachedModal &&
                (
                    <TierLimitReachErrorModal
                        actionLabel={ t("console:develop.features.idp.notifications.tierLimitReachedError." +
                            "emptyPlaceholder.action") }
                        handleModalClose={ handleLimitReachedModalClose }
                        header={ t("console:develop.features.idp.notifications.tierLimitReachedError.heading") }
                        description={ t("console:develop.features.idp.notifications.tierLimitReachedError." +
                            "emptyPlaceholder.subtitles") }
                        message={ t("console:develop.features.idp.notifications.tierLimitReachedError." +
                            "emptyPlaceholder.title") }
                        openModal={ openLimitReachedModal }
                    />
                )
            }
            <Modal
                open={ !openLimitReachedModal }
                className="wizard trusted-token-issuer-modal identity-provider-create-wizard"
                dimmer="blurring"
                onClose={ onWizardClose }
                size="small"
                closeOnDimmerClick={ false }
                closeOnEscape
                data-componentid={ `${ componentId }-modal` }>
                <Modal.Header
                    className="wizard-header"
                    data-componentid={ `${ componentId }-modal-header` }>
                    <div className={ "display-flex" }>
                        <GenericIcon
                            icon={ getConnectionIcons().trustedTokenIssuer }
                            size="x30"
                            transparent
                            spaced={ "right" }
                            data-componentid={ `${ componentId }-image` }
                        />
                        <div>
                            { title }
                            { subTitle && (
                                <Heading as="h6">
                                    { subTitle }
                                    { resolveDocumentationLink() }
                                </Heading>
                            ) }
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Content
                    className="steps-container"
                    data-componentid={ `${ componentId }-modal-content-1` }
                >
                    <Steps.Group
                        current={ currentWizardStep }
                    >
                        { getWizardSteps().map((step: TrustedTokenIssuerWizardStepInterface, index: number) => (
                            <Steps.Step
                                active
                                key={ index }
                                icon={ step.icon }
                                title={ step.title }
                            />
                        )) }
                    </Steps.Group>
                </Modal.Content>
                <Modal.Content
                    className="content-container"
                    data-componentid={ `${ componentId }-modal-content-2` }
                >
                    { alert && alertComponent }
                    <Wizard2
                        ref={ wizardRef }
                        initialValues={ initialValues }
                        onSubmit={ handleFormSubmit }
                        uncontrolledForm={ true }
                        pageChanged={ (index: number) => setCurrentWizardStep(index) }
                        data-componentid={ componentId }
                        validateOnBlur
                    >
                        { getWizardSteps().map((step: TrustedTokenIssuerWizardStepInterface) => step?.content) }
                    </Wizard2>
                </Modal.Content>
                <Modal.Actions
                    data-componentid={ `${ componentId }-modal-actions` }
                >
                    <Grid container>
                        <Grid
                            xs={ 6 }
                            container
                            justifyContent="flex-start"
                        >
                            <LinkButton
                                floated="left"
                                onClick={ onWizardClose }
                                data-componentid={ `${ componentId }-modal-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid>
                        <Grid xs={ 6 }>
                            { currentWizardStep < getWizardSteps().length - 1 && (
                                <PrimaryButton
                                    disabled={ nextShouldBeDisabled }
                                    floated="right"
                                    onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                    } }
                                    data-testid="add-connection-modal-next-button"
                                    data-componentid="add-connection-modal-next-button"
                                >
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === getWizardSteps().length - 1 && (
                                <PrimaryButton
                                    disabled={ finishShouldBeDisabled || isSubmitting }
                                    type="submit"
                                    floated="right"
                                    onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                    } }
                                    data-testid="add-connection-modal-finish-button"
                                    data-componentid="add-connection-modal-finish-button"
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
                                    data-testid="add-connection-modal-previous-button"
                                    data-componentid="add-connection-modal-previous-button"
                                >
                                    <Icon name="arrow left"/>
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.previous") }
                                </LinkButton>
                            ) }
                        </Grid>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </>
    );
};

/**
 * Default props for the trusted token issuer creation wizard.
 */
TrustedTokenIssuerCreateWizard.defaultProps = {
    currentStep: 0,
    "data-componentid": "trusted-token-issuer"
};
