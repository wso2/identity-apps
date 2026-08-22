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

import { AxiosError } from "axios";
import { Show } from "@wso2is/access-control";
import { getApplicationDetails } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationBasicInterface } from "@wso2is/admin.applications.v1/models/application";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, HttpErrorResponseDataInterface, HttpMethods, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { ConfirmationModal, ContentLoader, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    CheckboxProps,
    Divider,
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Form as SUIForm,
    Icon,
    Input,
    InputOnChangeData,
    List
} from "semantic-ui-react";
import {
    deleteConnection,
    getConnectedApps,
    getFederatedAuthenticatorDetails,
    updateFederatedAuthenticator,
    updateIdentityProviderDetails,
    useGetConnections
} from "../../../api/connections";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    CommonPluggableComponentPropertyInterface,
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface,
    FederatedAuthenticatorListItemInterface,
    GeneralDetailsFormValuesInterface,
    StrictConnectionInterface
} from "../../../models/connection";
import { handleConnectionDeleteError, handleConnectionUpdateError } from "../../../utils/connection-utils";

const FORM_ID: string = "digital-wallet-general-settings-form";
const I18N_PREFIX: string = "authenticationProvider:templates.digitalWallet";

const MANAGED_KEYS: string[] = [ "presentationDefinitionId", "timeout" ];

interface PresentationDefinitionListItemInterface {
    id: string;
    displayName: string;
    description?: string;
}

interface PresentationDefinitionListInterface {
    totalResults?: number;
    presentationDefinitions: PresentationDefinitionListItemInterface[];
}

interface DigitalWalletGeneralSettingsPropsInterface extends IdentifiableComponentInterface {
    editingIDP: ConnectionInterface;
    isLoading?: boolean;
    onDelete: () => void;
    onUpdate: (id: string) => void;
    isReadOnly: boolean;
    loader: () => ReactElement;
}

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
    const [ isAuthenticatorLoading, setIsAuthenticatorLoading ] = useState<boolean>(false);
    const [ presentationDefinitionId, setPresentationDefinitionId ] = useState<string>("");
    const [ timeoutSeconds, setTimeoutSeconds ] = useState<string>("");
    const [ timeoutError, setTimeoutError ] = useState<string>("");
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [ showDeleteErrorDueToConnectedAppsModal, setShowDeleteErrorDueToConnectedAppsModal ] =
        useState<boolean>(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState<boolean>(true);

    const { data: idpList } = useGetConnections();

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.vpTemplates
    };

    const {
        data: pdListData,
        isLoading: isPdListLoading
    }: RequestResultInterface<PresentationDefinitionListInterface, RequestErrorInterface> =
        useRequest<PresentationDefinitionListInterface, RequestErrorInterface>(requestConfig);

    useEffect(() => {
        const authenticatorId: string =
            editingIDP?.federatedAuthenticators?.defaultAuthenticatorId;

        if (!editingIDP?.id || !authenticatorId) {
            return;
        }

        setIsAuthenticatorLoading(true);
        getFederatedAuthenticatorDetails(editingIDP.id, authenticatorId)
            .then((data: FederatedAuthenticatorListItemInterface) => {
                const getPropertyValue = (key: string): string => {
                    const property: CommonPluggableComponentPropertyInterface | undefined =
                        data?.properties?.find(
                            (p: CommonPluggableComponentPropertyInterface) => p.key === key
                        );

                    return property?.value ?? "";
                };

                setPresentationDefinitionId(getPropertyValue("presentationDefinitionId"));
                const loadedTimeout: string = getPropertyValue("timeout") || "120";
                const loadedVal: number = parseInt(loadedTimeout, 10);

                setTimeoutSeconds(loadedTimeout);
                if (isNaN(loadedVal) || loadedVal < 1 || loadedVal > 180) {
                    setTimeoutError(t(`${ I18N_PREFIX }.form.timeout.validationError`));
                }
            })
            .catch(() => {
                // values stay empty if fetch fails
            })
            .finally(() => {
                setIsAuthenticatorLoading(false);
            });
    }, [ editingIDP?.id, editingIDP?.federatedAuthenticators?.defaultAuthenticatorId ]);

    const pdOptions: DropdownItemProps[] = (pdListData?.presentationDefinitions ?? []).map(
        (pd: PresentationDefinitionListItemInterface): DropdownItemProps => ({
            description: pd.description,
            key: pd.id,
            text: pd.displayName,
            value: pd.id
        })
    );

    const idpNameValidation = (value: string): string => {
        if (!FormValidation.isValidResourceName(value)) {
            return t("authenticationProvider:templates.enterprise.validation.name");
        }

        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp: StrictConnectionInterface) => {
                if (idp?.name === value && editingIDP.name !== value) {
                    nameExist = true;
                }
            });
        }

        if (nameExist) {
            return t("authenticationProvider:forms.generalDetails.name.validations.duplicate");
        }
    };

    const handleDeleteInitiation = (): void => {
        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response?.count === 0) {
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    const appRequests: Promise<ApplicationBasicInterface>[] =
                        response?.connectedApps?.map((app: ConnectedAppInterface) =>
                            getApplicationDetails(app.appId)
                        );
                    const results: ApplicationBasicInterface[] = (await Promise.all(
                        appRequests?.map((req: Promise<ApplicationBasicInterface>) =>
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
                    setConnectedApps(results?.map((app: ApplicationBasicInterface) => app?.name));
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
        setLoading(true);
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
                setLoading(false);
            });
    };

    const handleDisableToggle = (_event: FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        if (data.checked) {
            updateIdentityProviderDetails(
                { id: editingIDP.id, isEnabled: true },
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

    const handleFormSubmit = (values: GeneralDetailsFormValuesInterface): void => {
        if (timeoutError) {
            return;
        }

        const authenticatorId: string =
            editingIDP?.federatedAuthenticators?.defaultAuthenticatorId;

        setIsSubmitting(true);

        getFederatedAuthenticatorDetails(editingIDP.id, authenticatorId)
            .then((currentAuthenticator: FederatedAuthenticatorListItemInterface) => {
                const unchangedProperties: CommonPluggableComponentPropertyInterface[] =
                    (currentAuthenticator?.properties ?? []).filter(
                        (p: CommonPluggableComponentPropertyInterface) => !MANAGED_KEYS.includes(p.key)
                    );

                const updatedAuthenticator: FederatedAuthenticatorListItemInterface = {
                    ...currentAuthenticator,
                    properties: [
                        ...unchangedProperties,
                        { key: "presentationDefinitionId", value: presentationDefinitionId },
                        { key: "timeout", value: timeoutSeconds }
                    ]
                };

                return updateIdentityProviderDetails(
                    {
                        description: values.description?.toString(),
                        id: editingIDP.id,
                        name: values.name?.toString()
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
            <Form
                id={ FORM_ID }
                uncontrolledForm={ false }
                onSubmit={ (values: GeneralDetailsFormValuesInterface): void => {
                    handleFormSubmit(values);
                } }
                data-componentid={ componentId }
            >
                <Field.Input
                    ariaLabel="name"
                    inputType="resource_name"
                    name="name"
                    label={ t("authenticationProvider:forms.generalDetails.name.label") }
                    required
                    message={ t("authenticationProvider:forms.generalDetails.name.validations.empty") }
                    placeholder={ editingIDP.name }
                    validation={ (value: string) => idpNameValidation(value) }
                    value={ editingIDP.name }
                    maxLength={ ConnectionUIConstants.IDP_NAME_LENGTH.max }
                    minLength={ ConnectionUIConstants.IDP_NAME_LENGTH.min }
                    data-componentid={ `${ componentId }-idp-name` }
                    hint={ t(`${ I18N_PREFIX }.form.name.hint`) }
                    readOnly={ isReadOnly }
                />
                <Field.Textarea
                    name="description"
                    ariaLabel="description"
                    label={ t("authenticationProvider:forms.generalDetails.description.label") }
                    required={ false }
                    placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                    value={ editingIDP.description }
                    data-componentid={ `${ componentId }-idp-description` }
                    maxLength={ ConnectionUIConstants.IDP_NAME_LENGTH.max }
                    minLength={ ConnectionUIConstants.IDP_NAME_LENGTH.min }
                    hint={ t(`${ I18N_PREFIX }.form.description.hint`) }
                    readOnly={ isReadOnly }
                />
                { isAuthenticatorLoading || isPdListLoading
                    ? <ContentLoader active inline="centered" />
                    : (
                        <>
                            <SUIForm.Field required>
                                <label>{ t(`${ I18N_PREFIX }.form.presentationDefinition.label`) }</label>
                                <Dropdown
                                    placeholder={
                                        pdOptions.length === 0
                                            ? t(`${ I18N_PREFIX }.form.presentationDefinition.emptyPlaceholder`)
                                            : t(`${ I18N_PREFIX }.form.presentationDefinition.placeholder`)
                                    }
                                    fluid
                                    selection
                                    options={ pdOptions }
                                    value={ presentationDefinitionId }
                                    disabled={ isReadOnly }
                                    onChange={ (_e: SyntheticEvent, data: DropdownProps): void => {
                                        setPresentationDefinitionId(data.value as string);
                                    } }
                                    data-componentid={ `${ componentId }-presentation-definition-dropdown` }
                                />
                                <p className="ui-hint">
                                    <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                                    { t(`${ I18N_PREFIX }.form.presentationDefinition.hint`) }
                                </p>
                            </SUIForm.Field>
                            <SUIForm.Field>
                                <label>{ t(`${ I18N_PREFIX }.form.timeout.label`) }</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={ timeoutSeconds }
                                    readOnly={ isReadOnly }
                                    error={ !!timeoutError }
                                    onChange={ (
                                        _e: React.ChangeEvent<HTMLInputElement>,
                                        data: InputOnChangeData
                                    ): void => {
                                        const val: number = parseInt(data.value, 10);

                                        if (data.value === "" || isNaN(val) || val < 1 || val > 180) {
                                            setTimeoutError(
                                                t(`${ I18N_PREFIX }.form.timeout.validationError`)
                                            );
                                        } else {
                                            setTimeoutError("");
                                        }
                                        setTimeoutSeconds(data.value);
                                    } }
                                    data-componentid={ `${ componentId }-timeout-input` }
                                />
                                { timeoutError && (
                                    <p className="ui-hint" style={ { color: "var(--oxygen-palette-error-main)" } }>
                                        <Icon floated="left" aria-hidden="true"
                                            className="red exclamation circle icon" />
                                        { timeoutError }
                                    </p>
                                ) }
                                { !timeoutError && (
                                    <p className="ui-hint">
                                        <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                                        { t(`${ I18N_PREFIX }.form.timeout.hint`) }
                                    </p>
                                ) }
                            </SUIForm.Field>
                        </>
                    )
                }
                { !isReadOnly && (
                    <Field.Button
                        form={ FORM_ID }
                        ariaLabel="Update"
                        size="small"
                        buttonType="primary_btn"
                        label={ t("common:update") }
                        name="submit"
                        disabled={ isSubmitting || isAuthenticatorLoading || isEmpty(presentationDefinitionId)
                            || isEmpty(timeoutSeconds) || !!timeoutError }
                        loading={ isSubmitting }
                    />
                ) }
            </Form>
        </EmphasizedSegment>
        <Divider hidden />
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
                primaryActionLoading={ loading }
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
                    <Divider hidden />
                    <List ordered className="ml-6">
                        { isAppsLoading ? (
                            <ContentLoader />
                        ) : (
                            connectedApps?.map((app: string, index: number) => (
                                <List.Item key={ index }>{ app }</List.Item>
                            ))
                        ) }
                    </List>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        ) }
        </>
    );
};
