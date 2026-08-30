/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import MenuItem from "@oxygen-ui/react/MenuItem";
import TextField from "@oxygen-ui/react/TextField";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { TextFieldAdapter } from "@wso2is/forms";
import { Field as FinalFormField, Form as FinalForm, FormRenderProps } from "react-final-form";
import {
    DocumentationLink,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid as SemanticGrid } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import CreateConnectionWizardHelp from "./create-wizard-help";
import { createConnection } from "../../api/connections";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { useGetPresentationDefinitionList } from "../../hooks/use-get-presentation-definition-list";
import {
    ConnectionInterface,
    DigitalWalletConnectionCreateWizardPropsInterface,
    DigitalWalletWizardFormValuesInterface,
    PresentationDefinitionListItemInterface
} from "../../models/connection";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";


export const DigitalWalletConnectionCreateWizard: FunctionComponent<
    DigitalWalletConnectionCreateWizardPropsInterface
> = (
    props: DigitalWalletConnectionCreateWizardPropsInterface
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        template,
        [ "data-componentid" ]: componentId = "digital-wallet"
    } = props;


    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

    const [ selectedPresentationDefinitionId, setSelectedPresentationDefinitionId ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const formId: string = `${ componentId }-form`;
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: presentationDefinitionListData,
        isLoading: isPresentationDefinitionListLoading
    } = useGetPresentationDefinitionList();

    const presentationDefinitionOptions: Array<{ description?: string; key: string; text: string; value: string }> =
        (presentationDefinitionListData?.presentationDefinitions ?? []).map(
            (definition: PresentationDefinitionListItemInterface) => ({
                description: definition.description,
                key: definition.id,
                text: definition.displayName,
                value: definition.id
            })
        );

    const initialValues: DigitalWalletWizardFormValuesInterface = {
        name: t("authenticationProvider:templates.digitalWallet.form.name.defaultValue")
    };

    const resolveConnectionIcon = (): string => {
        return ConnectionsManagementUtils.resolveConnectionResourcePath("", template?.image);
    };

    const handleFormSubmit = async (values: DigitalWalletWizardFormValuesInterface): Promise<void> => {
        if (isEmpty(selectedPresentationDefinitionId)) {
            setAlert({
                description: t("authenticationProvider:templates.digitalWallet.notifications.noPresentationDefinition.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:templates.digitalWallet.notifications.noPresentationDefinition.message")
            });

            return;
        }

        setIsSubmitting(true);

        try {
            const connection: ConnectionInterface = cloneDeep(template.idp);

            connection.name = values.name;
            connection.description = values.description || "";
            connection.templateId = template.templateId;

            connection.federatedAuthenticators.authenticators[ 0 ].properties = [
                { key: "presentationDefinitionId", value: selectedPresentationDefinitionId },
                { key: "timeout", value: String(ConnectionUIConstants
                    .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.TIMEOUT_DEFAULT_VALUE) }
            ];

            if (!isEmpty(UIConfig?.connectionResourcesUrl)) {
                connection.image = UIConfig.connectionResourcesUrl + template.image;
            } else {
                connection.image = resolveConnectionIcon();
            }

            const response: AxiosResponse<ConnectionInterface> = await createConnection(connection);

            eventPublisher.publish("connections-finish-adding-connection", {
                type: componentId
            });

            dispatch(addAlert({
                description: t("authenticationProvider:notifications.addIDP.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("authenticationProvider:notifications.addIDP.success.message")
            }));

            // The 201 response includes a Location header pointing to the new resource URL.
            // Extract the IDP ID from the tail to navigate directly to its edit page.
            // Falls back to the connections list if the header is absent.
            if (!isEmpty(response.headers.location)) {
                const location: string = response.headers.location;
                const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                onIDPCreate(createdIdpID);

                return;
            }

            onIDPCreate();
        } catch (error) {
            const axiosError: AxiosError<HttpErrorResponseDataInterface> =
                error as AxiosError<HttpErrorResponseDataInterface>;
            const identityAppsError: IdentityAppsError = ConnectionUIConstants.ERROR_CREATE_LIMIT_REACHED;

            if (axiosError.response?.status === 403 &&
                axiosError.response?.data?.code === identityAppsError.getErrorCode()) {

                setAlert({
                    code: identityAppsError.getErrorCode(),
                    description: t(identityAppsError.getErrorDescription()),
                    level: AlertLevels.ERROR,
                    message: t(identityAppsError.getErrorMessage()),
                    traceId: identityAppsError.getErrorTraceId()
                });
                setTimeout(() => setAlert(undefined), 4000);

                return;
            }

            if (axiosError.response && axiosError.response.data && axiosError.response.data.description) {
                setAlert({
                    description: t("authenticationProvider:notifications.addIDP.error.description",
                        { description: axiosError.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.addIDP.error.message")
                });
                setTimeout(() => setAlert(undefined), 4000);

                return;
            }

            setAlert({
                description: t("authenticationProvider:notifications.addIDP.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications.addIDP.genericError.message")
            });
            setTimeout(() => setAlert(undefined), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = (values: DigitalWalletWizardFormValuesInterface): Record<string, string> => {
        const errors: Record<string, string> = {};
        const name: string = values.name ?? "";

        if (!name) {
            errors.name = t("authenticationProvider:templates.digitalWallet.form.name.validations.required");
        } else if (name.length > ConnectionUIConstants.DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
            .IDP_NAME_MAX_LENGTH) {
            errors.name = t("authenticationProvider:templates.digitalWallet.form.name.validations.maxLength",
                { max: ConnectionUIConstants.DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                    .IDP_NAME_MAX_LENGTH });
        } else if (name.length < ConnectionUIConstants.DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
            .IDP_NAME_MIN_LENGTH) {
            errors.name = t("authenticationProvider:templates.digitalWallet.form.name.validations.minLength",
                { min: ConnectionUIConstants.DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                    .IDP_NAME_MIN_LENGTH });
        }

        return errors;
    };

    const renderHelpPanel = (): ReactElement => {
        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">{ t("common:help") }</div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <CreateConnectionWizardHelp
                        wizardHelp={{
                            fields: [
                                {
                                    fieldName: t("authenticationProvider:templates.digitalWallet.wizardHelp.name.heading"),
                                    hint: t("authenticationProvider:templates.digitalWallet.wizardHelp.name.hint")
                                },
                                {
                                    fieldName: t("authenticationProvider:templates.digitalWallet.wizardHelp.presentationDefinition.heading"),
                                    hint: t("authenticationProvider:templates.digitalWallet.wizardHelp.presentationDefinition.hint")
                                }
                            ]
                        }}
                    />
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${ componentId }-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${ componentId }-modal-header` }
                >
                    <div className="display-flex">
                        <GenericIcon
                            icon={ resolveConnectionIcon() }
                            size="mini"
                            transparent
                            spaced="right"
                            data-componentid={ `${ componentId }-image` }
                        />
                        <div className="ml-1">
                            { t("authenticationProvider:templates.digitalWallet.title") }
                            <Heading as="h6">
                                { t("authenticationProvider:templates.digitalWallet.subTitle") }
                                <DocumentationLink link={ template?.docLink }>
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content className="content-container">
                    { alert && alertComponent }
                    <FinalForm
                        initialValues={ initialValues }
                        onSubmit={ handleFormSubmit }
                        validate={ validateForm }
                        render={ ({ handleSubmit }: FormRenderProps) => (
                            <form id={ formId } onSubmit={ handleSubmit }>
                                <FinalFormField
                                    fullWidth
                                    FormControlProps={ { margin: "dense" } }
                                    data-componentid={ `${ componentId }-form-wizard-name` }
                                    aria-label="Connection name"
                                    name="name"
                                    type="text"
                                    label={ t("authenticationProvider:templates.digitalWallet.form.name.label") }
                                    placeholder={ t("authenticationProvider:templates.digitalWallet.form.name.placeholder") }
                                    component={ TextFieldAdapter }
                                    required={ true }
                                    maxLength={ ConnectionUIConstants
                                        .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                        .IDP_NAME_MAX_LENGTH }
                                    minLength={ ConnectionUIConstants
                                        .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                        .IDP_NAME_MIN_LENGTH }
                                />
                                <FinalFormField
                                    fullWidth
                                    FormControlProps={ { margin: "dense" } }
                                    data-componentid={ `${ componentId }-form-wizard-description` }
                                    aria-label="Connection description"
                                    name="description"
                                    type="text"
                                    label={ t("authenticationProvider:forms.generalDetails.description.label") }
                                    placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                                    component={ TextFieldAdapter }
                                    multiline
                                    rows={ 4 }
                                    maxLength={ ConnectionUIConstants
                                        .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                        .IDP_DESCRIPTION_MAX_LENGTH }
                                />
                                <TextField
                                    select
                                    fullWidth
                                    required
                                    margin="dense"
                                    label={ t("authenticationProvider:templates.digitalWallet.form.presentationDefinition.label") }
                                    value={ selectedPresentationDefinitionId }
                                    disabled={ isPresentationDefinitionListLoading || presentationDefinitionOptions.length === 0 }
                                    onChange={ (event: React.ChangeEvent<HTMLInputElement>): void => {
                                        setSelectedPresentationDefinitionId(event.target.value);
                                    } }
                                    data-componentid={ `${ componentId }-presentation-definition-dropdown` }
                                    SelectProps={ { displayEmpty: true } }
                                >
                                    <MenuItem value="" disabled>
                                        { isPresentationDefinitionListLoading
                                            ? t("authenticationProvider:templates.digitalWallet.form.presentationDefinition.loadingPlaceholder")
                                            : presentationDefinitionOptions.length === 0
                                                ? t("authenticationProvider:templates.digitalWallet.form.presentationDefinition.emptyPlaceholder")
                                                : t("authenticationProvider:templates.digitalWallet.form.presentationDefinition.placeholder")
                                        }
                                    </MenuItem>
                                    { presentationDefinitionOptions.map((option: { key: string; text: string; value: string }): ReactElement => (
                                        <MenuItem key={ option.key } value={ option.value }>
                                            { option.text }
                                        </MenuItem>
                                    )) }
                                </TextField>
                                <Hint>
                                    { t("authenticationProvider:templates.digitalWallet.form.presentationDefinition.hint") }
                                </Hint>
                            </form>
                        ) }
                    />
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <SemanticGrid>
                        <SemanticGrid.Row column={ 1 }>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onWizardClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    type="submit"
                                    form={ formId }
                                    loading={ isSubmitting }
                                    disabled={ isEmpty(selectedPresentationDefinitionId) || isSubmitting }
                                    floated="right"
                                >
                                    { t("common:create") }
                                </PrimaryButton>
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { renderHelpPanel() }
        </ModalWithSidePanel>
    );
};
