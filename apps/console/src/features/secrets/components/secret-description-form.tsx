/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, Fragment, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { patchSecret } from "../api/secret";
import { SecretModel } from "../models/secret";
import { SECRET_DESCRIPTION_LENGTH } from "../utils/secrets.validation.utils";

export type SecretDescriptionFormProps = {
    editingSecret: SecretModel;
} & IdentifiableComponentInterface;

const FORM_ID: string = "secrets-description-form";

/**
 * Secret description form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const SecretDescriptionForm: FC<SecretDescriptionFormProps> = (
    props: SecretDescriptionFormProps
): ReactElement => {

    const {
        editingSecret,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ copyOfEditingSecret, setCopyOfEditingSecret ] = useState<SecretModel>();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ canUpdateDescription, setCanUpdateDescription ] = useState<boolean>(false);
    const [ secretDescription, setSecretDescription ] = useState<string>();

    useEffect(() => {
        setCopyOfEditingSecret(cloneDeep(editingSecret));
    }, []);

    /**
     * This is used only for validation. Even though `secretDescription`
     * and form submission value is equal, we use the submission's `values`.
     */
    useEffect(() => {
        if (!secretDescription ||
            !secretDescription?.trim() ||
            secretDescription === copyOfEditingSecret?.description) {
            setCanUpdateDescription(false);
        } else {
            setCanUpdateDescription(true);
        }
    }, [ secretDescription, copyOfEditingSecret ]);

    /**
     * Updates a secret. To update both `value` and `description` must
     * be in the form values otherwise the API will complain with 400.
     * @param values - Form values.
     */
    const updateSecretDescription = (values: Record<string, any>): void => {

        if (!canUpdateDescription) {
            return;
        }

        setLoading(true);
        patchSecret({
            body: {
                operation: "REPLACE",
                path: "/description",
                value: values?.secret_description
            },
            params: {
                secretName: copyOfEditingSecret?.secretName,
                secretType: copyOfEditingSecret?.type
            }
        }).then(({ data }): void => {
            setCopyOfEditingSecret({
                ...copyOfEditingSecret,
                description: data?.description
            });
            dispatch(addAlert({
                description: t("console:develop.features.secrets.alerts.updatedSecret.description", {
                    secretName: copyOfEditingSecret?.secretName,
                    secretType: copyOfEditingSecret?.type
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
        }).finally(() => {
            setLoading(false);
        });

    };

    return (
        <Fragment>
            <Form
                id={ FORM_ID }
                uncontrolledForm={ true }
                onSubmit={ updateSecretDescription }
            >
                <Field.Textarea
                    data-componentid={ `${ testId }-description-field` }
                    ariaLabel={
                        t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.ariaLabel")
                    }
                    label={
                        t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.label")
                    }
                    placeholder={
                        t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.placeholder")
                    }
                    hint={ t("console:develop.features.secrets.forms.editSecret.secretDescriptionField.hint") }
                    name="secret_description"
                    value={ copyOfEditingSecret?.description }
                    minLength={ SECRET_DESCRIPTION_LENGTH.min }
                    maxLength={ SECRET_DESCRIPTION_LENGTH.max }
                    listen={ (value: string): void => setSecretDescription(value) }
                />
                <Show when={ AccessControlConstants.SECRET_EDIT }>
                    <Field.Button
                        form={ FORM_ID }
                        data-componentid={ `${ testId }-update-button` }
                        loading={ loading }
                        disabled={ !canUpdateDescription || loading }
                        type="submit"
                        buttonType="primary_btn"
                        ariaLabel={ t("console:develop.features.secrets.forms.actions.submitButton.ariaLabel") }
                        label={ t("console:develop.features.secrets.forms.actions.submitButton.label") }
                        name="submit"/>
                </Show>
            </Form>
        </Fragment>
    );

};

SecretDescriptionForm.defaultProps = {
    "data-componentid": "secret-description-form"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretDescriptionForm;
