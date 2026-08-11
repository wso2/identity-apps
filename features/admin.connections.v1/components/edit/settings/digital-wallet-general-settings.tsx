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

import { TestableComponentInterface } from "@wso2is/core/models";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { EmphasizedSegment } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateIdentityProviderDetails, useGetConnections } from "../../../api/connections";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    ConnectionInterface,
    GeneralDetailsFormValuesInterface,
    StrictConnectionInterface
} from "../../../models/connection";
import { handleConnectionUpdateError } from "../../../utils/connection-utils";

const FORM_ID: string = "digital-wallet-general-settings-form";

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

    const { data: idpList } = useGetConnections();

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
        setIsSubmitting(true);

        updateIdentityProviderDetails(
            { id: editingIDP.id, description: values.description?.toString(), name: values.name?.toString() },
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
            .catch((error: Error) => {
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
                { !isReadOnly && (
                    <Field.Button
                        form={ FORM_ID }
                        ariaLabel="Update General Details"
                        size="small"
                        buttonType="primary_btn"
                        label={ t("common:update") }
                        name="submit"
                        disabled={ isSubmitting }
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
