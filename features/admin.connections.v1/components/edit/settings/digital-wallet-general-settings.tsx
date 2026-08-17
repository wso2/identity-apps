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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, HttpMethods, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Form as SUIForm,
    Icon,
    Input,
    InputOnChangeData
} from "semantic-ui-react";
import {
    getFederatedAuthenticatorDetails,
    updateFederatedAuthenticator,
    updateIdentityProviderDetails,
    useGetConnections
} from "../../../api/connections";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    ConnectionInterface,
    FederatedAuthenticatorListItemInterface,
    GeneralDetailsFormValuesInterface,
    StrictConnectionInterface
} from "../../../models/connection";
import { handleConnectionUpdateError } from "../../../utils/connection-utils";

const FORM_ID: string = "digital-wallet-general-settings-form";
const I18N_PREFIX: string = "authenticationProvider:templates.digitalWallet";

const MANAGED_KEYS: string[] = [ "presentationDefinitionId", "timeout" ];

interface PresentationDefinitionListItemInterface {
    id: string;
    name: string;
    description?: string;
}

interface PresentationDefinitionListInterface {
    totalResults?: number;
    presentationDefinitions: PresentationDefinitionListItemInterface[];
}

interface DigitalWalletGeneralSettingsPropsInterface extends TestableComponentInterface {
    editingIDP: ConnectionInterface;
    isLoading?: boolean;
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
        onUpdate,
        isReadOnly,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isAuthenticatorLoading, setIsAuthenticatorLoading ] = useState<boolean>(false);
    const [ presentationDefinitionId, setPresentationDefinitionId ] = useState<string>("");
    const [ timeoutSeconds, setTimeoutSeconds ] = useState<string>("");
    const [ timeoutError, setTimeoutError ] = useState<string>("");

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
                    const property: any = data?.properties?.find((p: any) => p.key === key);

                    return property?.value ?? "";
                };

                setPresentationDefinitionId(getPropertyValue("presentationDefinitionId"));
                setTimeoutSeconds(getPropertyValue("timeout"));
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
            text: pd.name,
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

    const handleFormSubmit = (values: GeneralDetailsFormValuesInterface): void => {
        if (timeoutError) {
            return;
        }

        const authenticatorId: string =
            editingIDP?.federatedAuthenticators?.defaultAuthenticatorId;

        setIsSubmitting(true);

        getFederatedAuthenticatorDetails(editingIDP.id, authenticatorId)
            .then((currentAuthenticator: FederatedAuthenticatorListItemInterface) => {
                const unchangedProperties: any[] = (currentAuthenticator?.properties ?? []).filter(
                    (p: any) => !MANAGED_KEYS.includes(p.key)
                );

                const updatedAuthenticator: FederatedAuthenticatorListItemInterface = {
                    ...currentAuthenticator,
                    properties: [
                        ...unchangedProperties,
                        { key: "presentationDefinitionId", value: presentationDefinitionId },
                        { key: "timeout", value: timeoutSeconds }
                    ]
                };

                return Promise.all([
                    updateIdentityProviderDetails(
                        {
                            description: values.description?.toString(),
                            id: editingIDP.id,
                            name: values.name?.toString()
                        },
                        editingIDP.idpIssuerName === undefined
                    ),
                    updateFederatedAuthenticator(editingIDP.id, updatedAuthenticator)
                ]);
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
        <EmphasizedSegment padded="very">
            <Form
                id={ FORM_ID }
                uncontrolledForm={ false }
                onSubmit={ (values: GeneralDetailsFormValuesInterface): void => {
                    handleFormSubmit(values);
                } }
                data-testid={ testId }
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
                    data-testid={ `${ testId }-idp-name` }
                    hint={ t("authenticationProvider:forms.generalDetails.name.hint") }
                    readOnly={ isReadOnly }
                />
                <Field.Textarea
                    name="description"
                    ariaLabel="description"
                    label={ t("authenticationProvider:forms.generalDetails.description.label") }
                    required={ false }
                    placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                    value={ editingIDP.description }
                    data-testid={ `${ testId }-idp-description` }
                    maxLength={ ConnectionUIConstants.IDP_NAME_LENGTH.max }
                    minLength={ ConnectionUIConstants.IDP_NAME_LENGTH.min }
                    hint={ t("authenticationProvider:forms.generalDetails.description.hint") }
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
                                    data-testid={ `${ testId }-presentation-definition-dropdown` }
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
                                    min="30"
                                    max="3600"
                                    value={ timeoutSeconds }
                                    readOnly={ isReadOnly }
                                    error={ !!timeoutError }
                                    onChange={ (
                                        _e: React.ChangeEvent<HTMLInputElement>,
                                        data: InputOnChangeData
                                    ): void => {
                                        const val: number = parseInt(data.value, 10);

                                        if (data.value !== "" && (isNaN(val) || val < 30 || val > 3600)) {
                                            setTimeoutError(
                                                t(`${ I18N_PREFIX }.form.timeout.validationError`)
                                            );
                                        } else {
                                            setTimeoutError("");
                                        }
                                        setTimeoutSeconds(data.value);
                                    } }
                                    data-testid={ `${ testId }-timeout-input` }
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
                            || !!timeoutError }
                        loading={ isSubmitting }
                    />
                ) }
            </Form>
        </EmphasizedSegment>
    );
};

DigitalWalletGeneralSettings.defaultProps = {
    "data-testid": "digital-wallet-general-settings-form"
};
