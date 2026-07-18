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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import FunctionLibraryContentEditor from "./function-library-content-editor";
import { deleteFunctionLibrary, updateFunctionLibrary } from "../api/function-library";
import { FUNCTION_LIBRARY_FORM } from "../constants/component-ids";
import { FunctionLibraryConstants } from "../constants/function-library-constants";
import { FunctionLibraryResponseInterface } from "../models/function-library";

/**
 * Props interface of {@link EditFunctionLibrary}.
 */
interface EditFunctionLibraryPropsInterface extends IdentifiableComponentInterface {
    /**
     * Function library being edited, along with its current content.
     */
    functionLibrary: FunctionLibraryResponseInterface;
    /**
     * Current content of the function library.
     */
    content: string;
}

interface EditFunctionLibraryFormValuesInterface {
    description: string;
}

const FORM_ID: string = "edit-function-library-form";

/**
 * Editing view for a single function library — description, content and delete.
 *
 * @param props - Props injected to the component.
 * @returns Edit function library component.
 */
const EditFunctionLibrary: FunctionComponent<EditFunctionLibraryPropsInterface> = (
    props: EditFunctionLibraryPropsInterface
): ReactElement => {
    const {
        functionLibrary,
        content: initialContent,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const hasUpdatePermission: boolean = useRequiredScopes(featureConfig?.functionLibraries?.scopes?.update);
    const hasDeletePermission: boolean = useRequiredScopes(featureConfig?.functionLibraries?.scopes?.delete);

    const [ content, setContent ] = useState<string>(initialContent);
    const [ contentError, setContentError ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const handleSubmit: (values: EditFunctionLibraryFormValuesInterface) => void = (
        values: EditFunctionLibraryFormValuesInterface
    ): void => {
        if (!content) {
            setContentError(t("functionLibraries:forms.content.validations.empty"));

            return;
        }

        setIsSubmitting(true);

        updateFunctionLibrary(functionLibrary.name, {
            content,
            description: values.description
        })
            .then(() => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.update.success.message")
                }));
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("functionLibraries:notifications.update.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("functionLibraries:notifications.update.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleDelete: () => void = (): void => {
        setIsDeleting(true);

        deleteFunctionLibrary(functionLibrary.name)
            .then(() => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.delete.success.description",
                        { name: functionLibrary.name }),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.delete.success.message")
                }));
                history.push(AppConstants.getPaths().get("APPLICATIONS_SETTINGS_FUNCTION_LIBRARIES"));
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("functionLibraries:notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("functionLibraries:notifications.delete.genericError.message")
                }));
            })
            .finally(() => {
                setIsDeleting(false);
                setShowDeleteConfirmationModal(false);
            });
    };

    return (
        <EmphasizedSegment padded="very" data-componentid={ componentId }>
            <Form
                id={ FORM_ID }
                uncontrolledForm={ false }
                onSubmit={ handleSubmit }
                initialValues={ {
                    description: functionLibrary?.description ?? ""
                } }
            >
                <Field.Input
                    ariaLabel="Function library name"
                    inputType="name"
                    name="name"
                    label={ t("functionLibraries:forms.name.label") }
                    required={ false }
                    readOnly={ true }
                    maxLength={ FunctionLibraryConstants.NAME_MAX_LENGTH }
                    minLength={ FunctionLibraryConstants.NAME_MIN_LENGTH }
                    value={ functionLibrary?.name }
                    width={ 16 }
                    listen={ null }
                    data-componentid={ `${ componentId }-name-input` }
                />
                <Field.Textarea
                    ariaLabel="Function library description"
                    name="description"
                    label={ t("functionLibraries:forms.description.label") }
                    placeholder={ t("functionLibraries:forms.description.placeholder") }
                    required={ false }
                    maxLength={ FunctionLibraryConstants.DESCRIPTION_MAX_LENGTH }
                    minLength={ 0 }
                    readOnly={ !hasUpdatePermission }
                    width={ 16 }
                    data-componentid={ `${ componentId }-description-input` }
                />
                <FunctionLibraryContentEditor
                    value={ content }
                    onChange={ (value: string) => {
                        setContent(value);
                        if (value) {
                            setContentError(undefined);
                        }
                    } }
                    readOnly={ !hasUpdatePermission }
                    data-componentid={ `${ componentId }-content-editor` }
                />
                { contentError && (
                    <div className="field error function-library-content-error">
                        { contentError }
                    </div>
                ) }
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Function library update button"
                    name="update-button"
                    disabled={ isSubmitting || !hasUpdatePermission }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    data-componentid={ `${ componentId }-submit-button` }
                />
            </Form>
            { hasDeletePermission && (
                <>
                    <Divider hidden />
                    <DangerZoneGroup sectionHeader={ t("functionLibraries:dangerZone.header") }>
                        <DangerZone
                            data-componentid={ `${ componentId }-delete-danger-zone` }
                            actionTitle={ t("functionLibraries:dangerZone.delete.actionTitle") }
                            header={ t("functionLibraries:dangerZone.delete.heading") }
                            subheader={ t("functionLibraries:dangerZone.delete.subHeading") }
                            onActionClick={ () => setShowDeleteConfirmationModal(true) }
                        />
                    </DangerZoneGroup>
                    <ConfirmationModal
                        primaryActionLoading={ isDeleting }
                        onClose={ () => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("functionLibraries:modals.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ () => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ handleDelete }
                        data-componentid={ `${ componentId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("functionLibraries:modals.deleteConfirmation.heading") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("functionLibraries:modals.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("functionLibraries:modals.deleteConfirmation.content",
                                { name: functionLibrary?.name }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            ) }
        </EmphasizedSegment>
    );
};

EditFunctionLibrary.defaultProps = {
    "data-componentid": FUNCTION_LIBRARY_FORM
};

export default EditFunctionLibrary;
