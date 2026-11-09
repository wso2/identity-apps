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
import {
    ConfirmationModal,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Form as SemanticForm } from "semantic-ui-react";
import FunctionLibraryContentEditor from "./function-library-content-editor";
import { deleteFunctionLibrary, updateFunctionLibrary } from "../api/function-library";
import { FUNCTION_LIBRARY_FORM, FunctionLibraryConstants } from "../constants";
import { FunctionLibraryResponseInterface } from "../models/function-library";
import {
    FunctionLibraryNameValidationError,
    getFunctionLibraryImportStatement,
    validateFunctionLibraryName
} from "../utils/function-library-utils";

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
    /**
     * Called with the updated function library after a successful update. Its id changes when it is renamed.
     */
    onUpdate?: (functionLibrary: FunctionLibraryResponseInterface) => void;
}

interface EditFunctionLibraryFormValuesInterface {
    name: string;
    description: string;
}

const FORM_ID: string = "edit-function-library-form";

/**
 * Editing view for a single function library — name, description, content and delete.
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
        onUpdate,
        ["data-componentid"]: componentId = FUNCTION_LIBRARY_FORM
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
    const [ pendingRenameValues, setPendingRenameValues ] = useState<EditFunctionLibraryFormValuesInterface>(null);

    const updateLibrary: (values: EditFunctionLibraryFormValuesInterface) => void = (
        values: EditFunctionLibraryFormValuesInterface
    ): void => {
        setIsSubmitting(true);

        updateFunctionLibrary(functionLibrary.id, {
            content,
            description: values.description,
            name: values.name.trim()
        })
            .then((response: AxiosResponse<FunctionLibraryResponseInterface>) => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.update.success.message")
                }));
                onUpdate?.(response.data);
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

    const handleSubmit: (values: EditFunctionLibraryFormValuesInterface) => void = (
        values: EditFunctionLibraryFormValuesInterface
    ): void => {
        if (!content) {
            setContentError(t("functionLibraries:forms.content.validations.empty"));

            return;
        }

        // Scripts import a library by name, so renaming it is confirmed first (as in the legacy console).
        if (values.name.trim() !== functionLibrary.name) {
            setPendingRenameValues(values);

            return;
        }

        updateLibrary(values);
    };

    const handleDelete: () => void = (): void => {
        setIsDeleting(true);

        deleteFunctionLibrary(functionLibrary.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.delete.success.description",
                        { name: functionLibrary.name }),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.delete.success.message")
                }));
                history.push(AppConstants.getPaths().get("FUNCTION_LIBRARIES"));
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
        <>
            <EmphasizedSegment padded="very" data-componentid={ componentId }>
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    onSubmit={ handleSubmit }
                    initialValues={ {
                        description: functionLibrary?.description ?? "",
                        name: functionLibrary?.name ?? ""
                    } }
                >
                    <Field.Input
                        ariaLabel="Function library name"
                        inputType="name"
                        name="name"
                        label={ t("functionLibraries:forms.name.label") }
                        hint={ t("functionLibraries:forms.name.hint") }
                        required={ true }
                        readOnly={ !hasUpdatePermission }
                        maxLength={ FunctionLibraryConstants.NAME_MAX_LENGTH }
                        minLength={ FunctionLibraryConstants.NAME_MIN_LENGTH }
                        validate={ (value: string): string | undefined => {
                            const error: FunctionLibraryNameValidationError = validateFunctionLibraryName(value);

                            return error ? t(`functionLibraries:forms.name.validations.${ error }`) : undefined;
                        } }
                        width={ 16 }
                        data-componentid={ `${ componentId }-name-input` }
                    />
                    <SemanticForm.Field>
                        <label>{ t("functionLibraries:forms.usage.label") }</label>
                        <CopyInputField
                            value={ getFunctionLibraryImportStatement(functionLibrary?.name ?? "") }
                            data-componentid={ `${ componentId }-usage-copy-field` }
                        />
                        <Hint>{ t("functionLibraries:forms.usage.hint") }</Hint>
                    </SemanticForm.Field>
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
                        error={ contentError }
                        data-componentid={ `${ componentId }-content-editor` }
                    />
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
                <ConfirmationModal
                    primaryActionLoading={ isSubmitting }
                    onClose={ () => setPendingRenameValues(null) }
                    type="warning"
                    open={ !!pendingRenameValues }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setPendingRenameValues(null) }
                    onPrimaryActionClick={ () => {
                        const values: EditFunctionLibraryFormValuesInterface = pendingRenameValues;

                        setPendingRenameValues(null);
                        updateLibrary(values);
                    } }
                    data-componentid={ `${ componentId }-rename-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("functionLibraries:modals.renameConfirmation.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("functionLibraries:modals.renameConfirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("functionLibraries:modals.renameConfirmation.content", {
                            newName: pendingRenameValues?.name?.trim(),
                            oldName: functionLibrary?.name
                        }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </EmphasizedSegment>
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
        </>
    );
};

export default EditFunctionLibrary;
