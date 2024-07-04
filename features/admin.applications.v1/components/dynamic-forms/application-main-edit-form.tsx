/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormApi, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import unset from "lodash-es/unset";
import React, { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import { updateApplicationDetails } from "../../api";
import useDynamicFieldValidations from "../../hooks/use-dynamic-field-validation";
import {
    ApplicationInterface
} from "../../models";
import { DynamicFieldInterface, DynamicFormInterface } from "../../models/dynamic-fields";

/**
 * Prop types of the `ApplicationEditForm` component.
 */
export interface ApplicationEditFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The tab metadata to be used for the application edit form generation.
     */
    formMetadata: DynamicFormInterface
    /**
     * Current editing application data.
     */
    application: ApplicationInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Exposing the function to trigger form submission.
     */
    formSubmission?: (submissionFunction: (e: MouseEvent<HTMLButtonElement>) => void) => void;
    /**
     * Flag to check whether the internal submit button should be hidden.
     */
    hideSubmitBtn?: boolean;
}

/**
 * Dynamic application edit form component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationEditForm: FunctionComponent<ApplicationEditFormPropsInterface> = (
    props: ApplicationEditFormPropsInterface
): ReactElement => {
    const {
        formMetadata,
        application,
        isLoading,
        onUpdate,
        readOnly,
        formSubmission,
        hideSubmitBtn,
        ["data-componentid"]: componentId
    } = props;

    const { validate } = useDynamicFieldValidations();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    /**
     * Callback function triggered when clicking the form submit button.
     *
     * @param values - Submission values from the form fields.
     */
    const onSubmit = (values: ApplicationInterface, form: FormApi): void => {
        if (!form?.getState()?.dirty) {
            return;
        }

        setIsSubmitting(true);
        const formValues: ApplicationInterface = cloneDeep(values);

        formMetadata?.fields?.forEach((field: DynamicFieldInterface) => {
            if (!form?.getFieldState(field?.name)?.dirty) {
                unset(formValues, field?.name);
            }
        });

        /**
         * Make sure that cleared text fields are set to an empty string.
         * Additionally, include the auto-submit properties in the form submission.
         */
        formMetadata?.fields?.forEach((field: DynamicFieldInterface) => {
            // TODO: Need to modify this. Conflict with above logic.
            // if (!has(formValues, field?.name)) {
            //     const initialValue: any = get(application, field?.name);
            //     if (initialValue && typeof initialValue === "string") {
            //         set(formValues, field?.name, "");
            //     }
            // }

            if (field?.meta?.dependentProperties
                && Array.isArray(field?.meta?.dependentProperties)
                && field?.meta?.dependentProperties?.length > 0) {
                const fieldValue: string = get(formValues, field?.name);

                if (typeof fieldValue === "string") {
                    field.meta.dependentProperties.forEach(
                        (property: string) => {
                            const propertyValue: string = get(formValues, property);

                            if (propertyValue && typeof propertyValue === "string") {
                                set(formValues, property, propertyValue.replace(`\${${field?.name}}`, fieldValue));
                            }
                        }
                    );
                }
            }

            if (field?.disable) {
                unset(formValues, field?.name);
            }
        });

        updateApplicationDetails(formValues)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateApplication.success.message")
                }));

                onUpdate(application?.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => setIsSubmitting(false));
    };

    /**
     * Prepare the initial values before assigning them to the form fields.
     *
     * @param application - application data.
     * @returns Moderated initial values.
     */
    const moderateInitialValues = (application: ApplicationInterface): Partial<ApplicationInterface> => {
        if (!formMetadata?.submitDefinedFieldsOnly) {
            return application;
        }

        const paths: string[] = formMetadata?.fields?.map((field: DynamicFieldInterface) => field?.name);

        // The ID needs to be submitted to perform the update operation.
        paths.push("id");

        return pick(application, paths);
    };

    return isLoading
        ? <ContentLoader inline="centered" active/>
        : (
            <FinalForm
                initialValues={ moderateInitialValues(application) }
                keepDirtyOnReinitialize
                onSubmit={ onSubmit }
                mutators={ {
                    setFormAttribute: (
                        [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                        state: MutableState<
                            Partial<ApplicationInterface>,
                            Partial<ApplicationInterface>
                        >,
                        { changeValue }: Tools<
                            Partial<ApplicationInterface>,
                            Partial<ApplicationInterface>
                        >
                    ) => {
                        changeValue(state, fieldName, () => fieldVal);
                    }
                } }
                validate={
                    (formValues: ApplicationInterface) =>
                        validate(formValues, formMetadata?.fields)
                }
                render={ ({ form, handleSubmit }: FormRenderProps) => {
                    formSubmission(handleSubmit);

                    return (
                        <form id={ `${formMetadata?.api}-form` } onSubmit={ handleSubmit }>
                            <Grid>
                                { formMetadata?.fields?.map(
                                    (field: DynamicFieldInterface) => {
                                        return (
                                            <Grid.Row
                                                key={ field?.id }
                                                columns={ 1 }
                                                className=
                                                    "application-edit-form-dynamic-fields"
                                            >
                                                <Grid.Column
                                                    mobile={ 16 }
                                                    tablet={ 14 }
                                                    computer={ 12 }
                                                >
                                                    <ApplicationFormDynamicField
                                                        field={ field }
                                                        form={ form }
                                                        readOnly={ readOnly
                                                            || !hasRequiredScopes(
                                                                UIConfig?.features?.applications,
                                                                UIConfig?.features
                                                                    ?.applications?.scopes?.update,
                                                                allowedScopes
                                                            )
                                                        }
                                                        application={ application }
                                                        onApplicationUpdate={ onUpdate }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        );
                                    })
                                }
                                {
                                    !hideSubmitBtn && (
                                        <Grid.Row column={ 1 }>
                                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                <PrimaryButton
                                                    type="submit"
                                                    data-componentid={ `${componentId}-update-button` }
                                                    loading={ isSubmitting }
                                                    disabled={ isSubmitting }
                                                >
                                                    { t("common:update") }
                                                </PrimaryButton>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }
                            </Grid>
                        </form>
                    );
                } }
            />
        );
};

/**
 * Default props for the application edit form component.
 */
ApplicationEditForm.defaultProps = {
    "data-componentid": "application-edit-form"
};
