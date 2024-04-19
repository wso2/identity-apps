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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import useDynamicFieldValidations from "features/admin.applications.v1/hooks/use-dynamic-field-validation";
import get from "lodash-es/get";
import has from "lodash-es/has";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import { AppState } from "../../../admin.core.v1";
import useUIConfig from "../../../admin.core.v1/hooks/use-ui-configs";
import { updateApplicationDetails } from "../../api";
import {
    ApplicationInterface
} from "../../models";
import { ApplicationEditTabMetadataInterface } from "../../models/application-templates";
import { DynamicFieldAutoSubmitPropertyInterface, DynamicFieldInterface } from "../../models/dynamic-fields";
import "./application-edit-form.scss";

/**
 * Prop types of the `ApplicationEditForm` component.
 */
export interface ApplicationEditFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The tab metadata to be used for the application edit form generation.
     */
    tab: ApplicationEditTabMetadataInterface
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
        tab,
        application,
        isLoading,
        onUpdate,
        readOnly,
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
    const onSubmit = (values: ApplicationInterface): void => {
        setIsSubmitting(true);

        /**
         * Make sure that cleared text fields are set to an empty string.
         * Additionally, include the auto-submit properties in the form submission.
         */
        tab?.form?.fields?.forEach((field: DynamicFieldInterface) => {
            if (!has(values, field?.name)) {
                const initialValue: any = get(application, field?.name);

                if (initialValue && typeof initialValue === "string") {
                    set(values, field?.name, "");
                }
            }

            if (field?.meta?.autoSubmitProperties
                && Array.isArray(field?.meta?.autoSubmitProperties)
                && field?.meta?.autoSubmitProperties?.length > 0) {
                field?.meta?.autoSubmitProperties.forEach(
                    (property: DynamicFieldAutoSubmitPropertyInterface) =>
                        set(values, property?.path, property?.value)
                );
            }
        });

        updateApplicationDetails(values)
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
                        description: error?.response?.data?.description,
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
        if (!tab?.form?.submitDefinedFieldsOnly) {
            return application;
        }

        const paths: string[] = tab?.form?.fields.map((field: DynamicFieldInterface) => field?.name);

        // The ID needs to be submitted to perform the update operation.
        paths.push("id");

        return pick(application, paths);
    };

    return (
        <EmphasizedSegment className="application-dynamic-edit-form" padded="very">
            {
                isLoading
                    ? <ContentLoader inline="centered" active/>
                    : (
                        <>
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
                                        validate(formValues, tab?.form?.fields)
                                }
                                render={ ({ form, handleSubmit }: FormRenderProps) => {
                                    return (
                                        <form id={ `${tab?.id}-form` } onSubmit={ handleSubmit }>
                                            <Grid>
                                                { tab?.form?.fields?.map(
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
                                                                    tablet={ 16 }
                                                                    computer={ 14 }
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
                                                                    />
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        );
                                                    })
                                                }
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
                                            </Grid>
                                        </form>
                                    );
                                } }
                            />
                        </>
                    )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application edit form component.
 */
ApplicationEditForm.defaultProps = {
    "data-componentid": "application-edit-form"
};
