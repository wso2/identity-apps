/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Message } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../core";
import { updateSecret } from "../api/secret";
import { SecretModel } from "../models/secret";
import {
    SECRET_DESCRIPTION_LENGTH,
    SECRET_VALUE_LENGTH,
    secretValueValidator
} from "../utils/secrets.validation.utils";
import { useTranslation } from "react-i18next";
import { EMPTY_JSON_OBJECT_STRING, EMPTY_STRING, FEATURE_LOCAL_STORAGE_KEY } from "../constants/secrets.common";

/**
 * Interface indicates what will be stored in the localstorage.
 */
type EditSecretLocalStorage = {
    hideInfoMessage: boolean;
}

/**
 * Props type interface of {@link EditSecret}
 */
export type EditSecretProps = {
    editingSecret: SecretModel
} & IdentifiableComponentInterface;

/**
 * Don't get confused with the component {@link SecretEdit}. This component
 * is basically the inner component that actually does the editing. The
 * other one {@link SecretEdit} is the page.
 *
 * TODO(yasinmiran): https://github.com/wso2/product-is/issues/12447
 * @param props {EditSecretProps}
 * @constructor
 */
const EditSecret: FC<EditSecretProps> = (props: EditSecretProps): ReactElement => {

    const {
        editingSecret,
        ["data-componentid"]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ showInfoMessage, setShowInfoMessage ] = useState<boolean>(false);
    const [ secretValueInvalid, setSecretValueInvalid ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<Record<string, any>>({});
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    useEffect(() => {
        if (editingSecret) {
            setInitialFormValues({
                secret_description: editingSecret.description,
                secret_value: EMPTY_STRING
            });
        }
        checkAndRenderInfoMessage();
    }, []);

    const checkAndRenderInfoMessage = (): void => {
        try {
            // If message dismissed already shown, then don't show it again :xD:.
            const local = JSON.parse(
                LocalStorageUtils.getValueFromLocalStorage(FEATURE_LOCAL_STORAGE_KEY)
                ?? EMPTY_JSON_OBJECT_STRING
            ) as EditSecretLocalStorage;
            if (local && local.hideInfoMessage === true) {
                setShowInfoMessage(false);
            } else {
                setShowInfoMessage(true);
            }
        } catch (e) {
            setShowInfoMessage(true);
        }
    };

    /**
     * Updates a secret. To update both `value` and `description` must
     * be in the form values otherwise the API will complain with 400.
     * @param values {Record<string, any>}
     */
    const updateFormSubmission = (values: Record<string, any>): void => {

        updateSecret({
            body: {
                description: values?.secret_description,
                value: values?.secret_value
            },
            params: {
                secretName: editingSecret?.secretName,
                secretType: editingSecret?.type
            }
        }).then(({ data }): void => {
            setInitialFormValues({
                secret_description: data?.description,
                secret_value: EMPTY_STRING
            });
            dispatch(addAlert({
                description: t("console:develop.features.secrets.alerts.updatedSecret.description", {
                    secretName: editingSecret?.secretName,
                    secretType: editingSecret?.type
                }),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.secrets.alerts.updatedSecret.message")
            }));
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));
                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.secrets.errors.generic.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.secrets.errors.generic.message")
            }));
        });

    };

    /**
     * Information banner explaining why the user cannot see the
     * secret value.
     */
    const InfoMessage: ReactElement = (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 10 }>
                    <Message
                        data-componentid={ `${ testId }-page-message` }
                        info
                        onDismiss={ () => {
                            LocalStorageUtils.setValueInLocalStorage(
                                FEATURE_LOCAL_STORAGE_KEY,
                                JSON.stringify({ hideInfoMessage: true } as EditSecretLocalStorage)
                            );
                            setShowInfoMessage(false);
                        } }>
                        <Message.Header
                            data-componentid={ `${ testId }-page-message-header` }>
                            <strong>{ t("console:develop.features.secrets.banners.secretIsHidden.title") }</strong>
                        </Message.Header>
                        <Message.Content
                            className="mt-2"
                            data-componentid={ `${ testId }-page-message-content` }>
                            { t(
                                "console:develop.features.secrets.banners.secretIsHidden.content",
                                { productName: config.ui?.productName }
                            ) }
                        </Message.Content>
                    </Message>
                    <Divider hidden/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    return (
        <EmphasizedSegment padded="very">

            { showInfoMessage && InfoMessage }

            <Form
                uncontrolledForm={ false }
                onSubmit={ updateFormSubmission }
                initialValues={ initialFormValues }>
                <Field.Input
                    ariaLabel={ t("console:develop.features.secrets.forms.editSecret.secretValueField.ariaLabel") }
                    label={ t("console:develop.features.secrets.forms.editSecret.secretValueField.label") }
                    placeholder={ t("console:develop.features.secrets.forms.editSecret.secretValueField.placeholder") }
                    value={ initialFormValues?.secret_value }
                    name="secret_value"
                    minLength={ SECRET_VALUE_LENGTH.min }
                    maxLength={ SECRET_VALUE_LENGTH.max }
                    type="password"
                    inputType="password"
                    hint={
                        t("console:develop.features.secrets.forms.editSecret.secretValueField.hint", {
                            minLength: SECRET_VALUE_LENGTH.min,
                            maxLength: SECRET_VALUE_LENGTH.max
                        })
                    }
                    validate={ (value): string | undefined => {
                        const error = secretValueValidator(value);
                        setSecretValueInvalid(Boolean(error));
                        return error;
                    } }
                />
                <Field.Textarea
                    ariaLabel={ t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.ariaLabel") }
                    label="Secret Description"
                    placeholder={
                        t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.placeholder")
                    }
                    hint={ t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.hint") }
                    name="secret_description"
                    value={ initialFormValues?.secret_description }
                    minLength={ SECRET_DESCRIPTION_LENGTH.min }
                    maxLength={ SECRET_DESCRIPTION_LENGTH.max }
                />
                <Field.Button
                    disabled={ secretValueInvalid }
                    type="submit"
                    buttonType="primary_btn"
                    ariaLabel={ t("console:develop.features.secrets.forms.actions.submitButton.ariaLabel") }
                    label={ t("console:develop.features.secrets.forms.actions.submitButton.label") }
                    name="submit"/>
            </Form>

        </EmphasizedSegment>
    );

};

/**
 * Default props of {@link EditSecret}
 */
EditSecret.defaultProps = {
    "data-componentid": "edit-secret"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EditSecret;
