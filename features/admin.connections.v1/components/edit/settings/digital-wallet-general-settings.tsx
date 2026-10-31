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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Show } from "@wso2is/access-control";
import { getApplicationDetails } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationBasicInterface } from "@wso2is/admin.applications.v1/models/application";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalFormField, TextFieldAdapter } from "@wso2is/forms";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import MenuItem from "@oxygen-ui/react/MenuItem";
import TextField from "@oxygen-ui/react/TextField";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Form as FinalForm, FormRenderProps } from "react-final-form";
import { Grid } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    deleteConnection,
    getConnectedApps,
    getFederatedAuthenticatorDetails,
    updateFederatedAuthenticator,
    updateIdentityProviderDetails,
    useGetConnections
} from "../../../api/connections";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import { useGetFederatedAuthenticator } from "../../../hooks/use-get-federated-authenticator";
import { useGetPresentationDefinitionList } from "../../../hooks/use-get-presentation-definition-list";
import {
    CommonPluggableComponentPropertyInterface,
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface,
    DigitalWalletGeneralSettingsFormValuesInterface,
    DigitalWalletGeneralSettingsPropsInterface,
    FederatedAuthenticatorListItemInterface,
    PresentationDefinitionListItemInterface,
    PresentationDefinitionOptionInterface,
    StrictConnectionInterface
} from "../../../models/connection";
import { handleConnectionDeleteError, handleConnectionUpdateError } from "../../../utils/connection-utils";

const FORM_ID: string = "digital-wallet-general-settings-form";

// Keys managed by this form; all other authenticator properties are preserved on submit.
const MANAGED_AUTHENTICATOR_PROPERTY_KEYS: string[] = [ "presentationDefinitionId" ];

export const DigitalWalletGeneralSettings: FunctionComponent<DigitalWalletGeneralSettingsPropsInterface> = (
    props: DigitalWalletGeneralSettingsPropsInterface
): ReactElement => {

    const {
        editingIDP,
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        loader: Loader,
        [ "data-componentid" ]: componentId = "digital-wallet-general-settings-form"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ selectedPresentationDefinitionId, setSelectedPresentationDefinitionId ] = useState<string>("");
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeletingConnection, setIsDeletingConnection ] = useState<boolean>(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [ showDeleteErrorDueToConnectedAppsModal, setShowDeleteErrorDueToConnectedAppsModal ] =
        useState<boolean>(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState<boolean>(true);

    const { data: existingConnections } = useGetConnections();

    const {
        data: presentationDefinitionListData,
        isLoading: isPresentationDefinitionListLoading
    } = useGetPresentationDefinitionList();

    const {
        data: authenticatorData,
        isLoading: isAuthenticatorDataLoading
    } = useGetFederatedAuthenticator(
        editingIDP?.id,
        editingIDP?.federatedAuthenticators?.defaultAuthenticatorId
    );

    useEffect((): void => {
        if (!authenticatorData?.properties) {
            return;
        }

        const getPropertyValue = (key: string): string => {
            const property: CommonPluggableComponentPropertyInterface | undefined =
                authenticatorData.properties.find(
                    (authenticatorProperty: CommonPluggableComponentPropertyInterface) =>
                        authenticatorProperty.key === key
                );

            return property?.value ?? "";
        };

        setSelectedPresentationDefinitionId(getPropertyValue("presentationDefinitionId"));
    }, [ authenticatorData ]);

    const presentationDefinitionOptions: PresentationDefinitionOptionInterface[] =
        (presentationDefinitionListData?.presentationDefinitions ?? []).map(
            (definition: PresentationDefinitionListItemInterface): PresentationDefinitionOptionInterface => ({
                description: definition.description,
                key: definition.id,
                text: definition.displayName,
                value: definition.id
            })
        );

    const validateForm = (
        values: DigitalWalletGeneralSettingsFormValuesInterface
    ): Record<string, string> => {
        const errors: Record<string, string> = {};
        const name: string = values.name ?? "";

        if (!name) {
            errors.name = t("authenticationProvider:forms.generalDetails.name.validations.empty");
        } else if (!FormValidation.isValidResourceName(name)) {
            errors.name = t("authenticationProvider:templates.enterprise.validation.name");
        } else {
            const isDuplicateName: boolean = (existingConnections?.identityProviders ?? []).some(
                (connection: StrictConnectionInterface) =>
                    connection?.name === name && editingIDP.name !== name
            );

            if (isDuplicateName) {
                errors.name = t("authenticationProvider:forms.generalDetails.name.validations.duplicate");
            }
        }

        return errors;
    };

    const handleDeleteInitiation = (): void => {
        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response?.count === 0) {
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    const appDetailRequests: Promise<ApplicationBasicInterface>[] =
                        response?.connectedApps?.map((app: ConnectedAppInterface) =>
                            getApplicationDetails(app.appId)
                        );
                    const appDetails: ApplicationBasicInterface[] = (await Promise.all(
                        appDetailRequests?.map((req: Promise<ApplicationBasicInterface>) =>
                            req.catch((error: IdentityAppsError) => {
                                dispatch(addAlert({
                                    description:
                                        error?.description ||
                                        "Error occurred while trying to retrieve connected applications.",
                                    level: AlertLevels.ERROR,
                                    message: error?.message || "Error Occurred."
                                }));
                            })
                        )
                    )) as ApplicationBasicInterface[];
                    setConnectedApps(appDetails?.map((app: ApplicationBasicInterface) => app?.name));
                }
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description || t("idp:connectedApps.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("idp:connectedApps.genericError.message")
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    };

    const handleConnectionDeleteAction = (): void => {
        setIsDeletingConnection(true);
        deleteConnection(editingIDP.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.deleteIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.deleteIDP.success.message")
                }));
                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                handleConnectionDeleteError(error);
            })
            .finally(() => {
                setIsDeletingConnection(false);
            });
    };

    const handleDisableToggle = (_event: FormEvent<HTMLInputElement>, data: { checked?: boolean }): void => {
        if (data.checked) {
            updateIdentityProviderDetails(
                { id: editingIDP.id, isEnabled: true },
                editingIDP.idpIssuerName === undefined
            )
                .then(() => {
                    dispatch(addAlert({
                        description: t("authenticationProvider:notifications.updateIDP.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("authenticationProvider:notifications.updateIDP.success.message")
                    }));
                    onUpdate(editingIDP.id);
                })
                .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                    handleConnectionUpdateError(error);
                });

            return;
        }

        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    updateIdentityProviderDetails(
                        { id: editingIDP.id, isEnabled: false },
                        editingIDP.idpIssuerName === undefined
                    )
                        .then(() => {
                            dispatch(addAlert({
                                description: t(
                                    "authenticationProvider:notifications.updateIDP.success.description"
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t("authenticationProvider:notifications.updateIDP.success.message")
                            }));
                            onUpdate(editingIDP.id);
                        })
                        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                            handleConnectionUpdateError(error);
                        });
                } else {
                    dispatch(addAlert({
                        description: t(
                            "authenticationProvider:notifications.disableIDPWithConnectedApps.error.description"
                        ),
                        level: AlertLevels.WARNING,
                        message: t(
                            "authenticationProvider:notifications.disableIDPWithConnectedApps.error.message"
                        )
                    }));
                }
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description:
                        error?.description ||
                        "Error occurred while trying to retrieve connected applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    };

    const handleFormSubmit = (values: DigitalWalletGeneralSettingsFormValuesInterface): void => {
        const authenticatorId: string =
            editingIDP?.federatedAuthenticators?.defaultAuthenticatorId;

        setIsSubmitting(true);

        // Re-fetch the authenticator to get the full latest properties before merging.
        getFederatedAuthenticatorDetails(editingIDP.id, authenticatorId)
            .then((currentAuthenticator: FederatedAuthenticatorListItemInterface) => {
                const unchangedProperties: CommonPluggableComponentPropertyInterface[] =
                    (currentAuthenticator?.properties ?? []).filter(
                        (property: CommonPluggableComponentPropertyInterface) =>
                            !MANAGED_AUTHENTICATOR_PROPERTY_KEYS.includes(property.key)
                    );

                const updatedAuthenticator: FederatedAuthenticatorListItemInterface = {
                    ...currentAuthenticator,
                    properties: [
                        ...unchangedProperties,
                        { key: "presentationDefinitionId", value: selectedPresentationDefinitionId }
                    ]
                };

                return updateIdentityProviderDetails(
                    {
                        description: values.description,
                        id: editingIDP.id,
                        name: values.name
                    },
                    editingIDP.idpIssuerName === undefined
                ).then(() =>
                    updateFederatedAuthenticator(editingIDP.id, updatedAuthenticator)
                        .catch((authenticatorError: AxiosError<HttpErrorResponseDataInterface>) =>
                            updateIdentityProviderDetails(
                                {
                                    description: editingIDP.description,
                                    id: editingIDP.id,
                                    name: editingIDP.name
                                },
                                editingIDP.idpIssuerName === undefined
                            ).finally(() => {
                                throw authenticatorError;
                            })
                        )
                );
            })
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                handleConnectionUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <EmphasizedSegment padded="very">
                <FinalForm
                    initialValues={ {
                        description: editingIDP.description,
                        name: editingIDP.name
                    } }
                    onSubmit={ handleFormSubmit }
                    validate={ validateForm }
                    render={ ({ handleSubmit }: FormRenderProps) => (
                        <form
                            id={ FORM_ID }
                            onSubmit={ handleSubmit }
                            data-componentid={ componentId }
                        >
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } computer={ 12 }>
                                        <FinalFormField
                                            fullWidth
                                            FormControlProps={ { margin: "dense" } }
                                            data-componentid={ `${ componentId }-idp-name` }
                                            aria-label="name"
                                            name="name"
                                            type="text"
                                            label={ t(
                                                "authenticationProvider:forms.generalDetails.name.label"
                                            ) }
                                            placeholder={ editingIDP.name }
                                            component={ TextFieldAdapter }
                                            required={ true }
                                            maxLength={ ConnectionUIConstants
                                                .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                                .IDP_NAME_MAX_LENGTH }
                                            minLength={ ConnectionUIConstants
                                                .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                                .IDP_NAME_MIN_LENGTH }
                                            hint={ (
                                                <Hint compact>
                                                    { t(
                                                        "authenticationProvider:templates.digitalWallet" +
                                                        ".form.name.hint"
                                                    ) }
                                                </Hint>
                                            ) }
                                            disabled={ isReadOnly }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } computer={ 12 }>
                                        <FinalFormField
                                            fullWidth
                                            FormControlProps={ { margin: "dense" } }
                                            data-componentid={ `${ componentId }-idp-description` }
                                            aria-label="description"
                                            name="description"
                                            type="text"
                                            label={ t(
                                                "authenticationProvider:forms.generalDetails.description.label"
                                            ) }
                                            placeholder={ t(
                                                "authenticationProvider:forms.generalDetails" +
                                                ".description.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            multiline
                                            rows={ 4 }
                                            maxLength={ ConnectionUIConstants
                                                .DIGITAL_WALLET_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS
                                                .IDP_DESCRIPTION_MAX_LENGTH }
                                            hint={ (
                                                <Hint compact>
                                                    { t(
                                                        "authenticationProvider:templates.digitalWallet" +
                                                        ".form.description.hint"
                                                    ) }
                                                </Hint>
                                            ) }
                                            disabled={ isReadOnly }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                { isAuthenticatorDataLoading || isPresentationDefinitionListLoading
                                    ? (
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } computer={ 12 }>
                                                <ContentLoader active inline="centered" />
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                    : (
                                        <>
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 16 } computer={ 12 }>
                                                    <TextField
                                                        select
                                                        required
                                                        fullWidth
                                                        margin="dense"
                                                        label={ t(
                                                            "authenticationProvider:templates.digitalWallet" +
                                                            ".form.presentationDefinition.label"
                                                        ) }
                                                        value={ selectedPresentationDefinitionId }
                                                        disabled={ isReadOnly }
                                                        onChange={ (
                                                            e: React.ChangeEvent<HTMLInputElement>
                                                        ): void => {
                                                            setSelectedPresentationDefinitionId(e.target.value);
                                                        } }
                                                        SelectProps={ { displayEmpty: true } }
                                                        data-componentid={
                                                            `${ componentId }-presentation-definition-dropdown`
                                                        }
                                                    >
                                                        <MenuItem value="" disabled>
                                                            { presentationDefinitionOptions.length === 0
                                                                ? t(
                                                                    "authenticationProvider:templates.digitalWallet" +
                                                                    ".form.presentationDefinition.emptyPlaceholder"
                                                                )
                                                                : t(
                                                                    "authenticationProvider:templates.digitalWallet" +
                                                                    ".form.presentationDefinition.placeholder"
                                                                )
                                                            }
                                                        </MenuItem>
                                                        { presentationDefinitionOptions.map(
                                                            (
                                                                option: PresentationDefinitionOptionInterface
                                                            ): ReactElement => (
                                                                <MenuItem key={ option.key } value={ option.value }>
                                                                    { option.text }
                                                                </MenuItem>
                                                            )
                                                        ) }
                                                    </TextField>
                                                    <Hint compact>
                                                        { t(
                                                            "authenticationProvider:templates.digitalWallet" +
                                                            ".form.presentationDefinition.hint"
                                                        ) }
                                                    </Hint>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </>
                                    )
                                }
                                { !isReadOnly && (
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } computer={ 12 }>
                                            <PrimaryButton
                                                type="submit"
                                                loading={ isSubmitting }
                                                disabled={
                                                    isSubmitting
                                                    || isAuthenticatorDataLoading
                                                    || isEmpty(selectedPresentationDefinitionId)
                                                }
                                                data-componentid={ `${ componentId }-update-button` }
                                            >
                                                { t("common:update") }
                                            </PrimaryButton>
                                        </Grid.Column>
                                    </Grid.Row>
                                ) }
                            </Grid>
                        </form>
                    ) }
                />
            </EmphasizedSegment>
            <Divider sx={ { borderColor: "transparent", my: 2 } } />
            <Show
                when={
                    featureConfig?.identityProviders?.scopes?.update ||
                    featureConfig?.identityProviders?.scopes?.delete
                }
            >
                <DangerZoneGroup sectionHeader={ t("authenticationProvider:dangerZoneGroup.header") }>
                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                        <DangerZone
                            actionTitle={ t("authenticationProvider:dangerZoneGroup.disableIDP.actionTitle", {
                                state: editingIDP.isEnabled ? t("common:disable") : t("common:enable")
                            }) }
                            header={ t("authenticationProvider:dangerZoneGroup.disableIDP.header", {
                                state: editingIDP.isEnabled ? t("common:disable") : t("common:enable")
                            }) }
                            subheader={
                                editingIDP.isEnabled
                                    ? t("authenticationProvider:dangerZoneGroup.disableIDP.subheader")
                                    : t("authenticationProvider:dangerZoneGroup.disableIDP.subheader2")
                            }
                            onActionClick={ undefined }
                            toggle={ {
                                checked: editingIDP.isEnabled,
                                onChange: handleDisableToggle
                            } }
                            data-componentid={ `${ componentId }-disable-idp-danger-zone` }
                        />
                    </Show>
                    <Show when={ featureConfig?.identityProviders?.scopes?.delete }>
                        <DangerZone
                            actionTitle={ t("authenticationProvider:dangerZoneGroup.deleteIDP.actionTitle") }
                            header={ t("authenticationProvider:dangerZoneGroup.deleteIDP.header") }
                            subheader={ t("authenticationProvider:dangerZoneGroup.deleteIDP.subheader") }
                            onActionClick={ handleDeleteInitiation }
                            data-componentid={ `${ componentId }-delete-idp-danger-zone` }
                        />
                    </Show>
                </DangerZoneGroup>
            </Show>
            { showDeleteConfirmationModal && (
                <ConfirmationModal
                    primaryActionLoading={ isDeletingConnection }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertion={ editingIDP.name }
                    assertionHint={ t("authenticationProvider:confirmations.deleteIDP.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleConnectionDeleteAction() }
                    data-componentid={ `${ componentId }-delete-idp-confirmation` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${ componentId }-delete-idp-confirmation` }>
                        { t("authenticationProvider:confirmations.deleteIDP.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-delete-idp-confirmation` }
                    >
                        { t("authenticationProvider:confirmations.deleteIDP.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${ componentId }-delete-idp-confirmation` }>
                        { t("authenticationProvider:confirmations.deleteIDP.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showDeleteErrorDueToConnectedAppsModal && (
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                    type="negative"
                    open={ showDeleteErrorDueToConnectedAppsModal }
                    secondaryAction={ t("common:close") }
                    onSecondaryActionClick={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                    data-componentid={ `${ componentId }-delete-idp-confirmation` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${ componentId }-delete-idp-confirmation` }>
                        { t("authenticationProvider:confirmations.deleteIDPWithConnectedApps.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-delete-idp-confirmation` }
                    >
                        { t("authenticationProvider:confirmations.deleteIDPWithConnectedApps.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${ componentId }-delete-idp-confirmation` }>
                        { t("authenticationProvider:confirmations.deleteIDPWithConnectedApps.content") }
                        <Box component="ol" sx={ { mt: 1, pl: 3 } }>
                            { isAppsLoading ? (
                                <ContentLoader />
                            ) : (
                                connectedApps?.map((app: string, index: number) => (
                                    <Box component="li" key={ index }>{ app }</Box>
                                ))
                            ) }
                        </Box>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
