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

import Button from "@oxygen-ui/react/Button";
import { FeatureAccessConfigInterface, Show, useRequiredScopes } from "@wso2is/access-control";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/forms";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import deleteFlowExtension from "../../api/delete-flow-extension";
import updateFlowExtension from "../../api/update-flow-extension";
import { FlowExtensionConstants } from "../../constants/flow-extension-constants";
import {
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../../models/flow-extension";

/**
 * Props for the Flow Extension general settings tab.
 */
interface FlowExtensionGeneralSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The Flow Extension being edited.
     */
    flowExtension: FlowExtensionResponseInterface;
    /**
     * Whether the parent resource is still loading.
     */
    isLoading?: boolean;
    /**
     * Whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Callback to refresh the Flow Extension after an update.
     */
    mutateFlowExtension: () => void;
}

/**
 * Form values collected by the general settings form.
 */
interface FlowExtensionGeneralFormValuesInterface {
    name: string;
    description?: string;
    iconUrl?: string;
}

/**
 * General settings tab of the Flow Extension edit page.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension general settings component.
 */
const FlowExtensionGeneralSettings: FunctionComponent<FlowExtensionGeneralSettingsPropsInterface> = ({
    flowExtension,
    isLoading,
    isReadOnly,
    mutateFlowExtension,
    ["data-componentid"]: componentId = "flow-extension-general-settings"
}: FlowExtensionGeneralSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const flowExtensionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.flowExtensions
    );
    const hasDeletePermission: boolean = useRequiredScopes(flowExtensionsFeatureConfig?.scopes?.delete);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const initialValues: FlowExtensionGeneralFormValuesInterface = useMemo(
        (): FlowExtensionGeneralFormValuesInterface => ({
            description: flowExtension?.description ?? "",
            iconUrl: flowExtension?.iconUrl ?? "",
            name: flowExtension?.name ?? ""
        }),
        [ flowExtension ]
    );

    const validateForm = (
        values: FlowExtensionGeneralFormValuesInterface
    ): Partial<Record<keyof FlowExtensionGeneralFormValuesInterface, string>> => {
        const errors: Partial<Record<keyof FlowExtensionGeneralFormValuesInterface, string>> = {};

        if (!values?.name || !FlowExtensionConstants.FLOW_EXTENSION_NAME_REGEX.test(values.name)) {
            errors.name = t("flowExtension:edit.general.name.validations.invalid");
        }

        if (values?.description
            && values.description.length > FlowExtensionConstants.FLOW_EXTENSION_MAX_DESCRIPTION_LENGTH) {
            errors.description = t("flowExtension:edit.general.description.validations.maxLength");
        }

        if (values?.iconUrl && !FormValidation.url(values.iconUrl)) {
            errors.iconUrl = t("flowExtension:edit.general.iconUrl.validations.invalid");
        }

        return errors;
    };

    const handleSubmit = (values: FlowExtensionGeneralFormValuesInterface): void => {
        setIsSubmitting(true);
        const body: FlowExtensionUpdateRequestInterface = {
            ...(values.name !== flowExtension.name && { name: values.name }),
            ...((values.description ?? "") !== (flowExtension.description ?? "") && { description: values.description }),
            ...((values.iconUrl ?? "") !== (flowExtension.iconUrl ?? "") && { iconUrl: values.iconUrl })
        };

        // Nothing changed - skip the request.
        if (Object.keys(body).length === 0) {
            return;
        }

        updateFlowExtension(flowExtension.id, body)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.updateSuccess.message")
                }));
                mutateFlowExtension();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.updateError.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    const handleDelete = (): void => {
        setIsDeleting(true);
        deleteFlowExtension(flowExtension.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.deleteSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.deleteSuccess.message")
                }));
                setShowDeleteConfirmationModal(false);
                history.push(AppConstants.getPaths().get("IDP"));
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.deleteError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.deleteError.message")
                }));
            })
            .finally((): void => setIsDeleting(false));
    };

    if (isLoading) {
        return <ContentLoader />;
    }

    return (
        <>
            <EmphasizedSegment padded="very">
                <FinalForm
                    initialValues={ initialValues }
                    validate={ validateForm }
                    onSubmit={ handleSubmit }
                    render={ ({ handleSubmit }: FormRenderProps): ReactElement => (
                        <form onSubmit={ handleSubmit } className="form-container with-max-width">
                            <FinalFormField
                                key="name"
                                width={ 16 }
                                sx={ { marginBottom: 1, marginTop: 1 } }
                                FormControlProps={ { margin: "dense" } }
                                ariaLabel="name"
                                required={ true }
                                data-componentid={ `${componentId}-name` }
                                name="name"
                                type="text"
                                label={ t("flowExtension:edit.general.name.label") }
                                placeholder={ t("flowExtension:edit.general.name.placeholder") }
                                helperText={
                                    (<Hint className="hint" compact>
                                        { t("flowExtension:edit.general.name.hint") }
                                    </Hint>)
                                }
                                component={ TextFieldAdapter }
                                maxLength={ 255 }
                                minLength={ 1 }
                                disabled={ isReadOnly }
                            />
                            <FinalFormField
                                key="description"
                                width={ 16 }
                                sx={ { marginBottom: 1, marginTop: 1 } }
                                FormControlProps={ { margin: "dense" } }
                                ariaLabel="description"
                                required={ false }
                                data-componentid={ `${componentId}-description` }
                                name="description"
                                type="text"
                                label={ t("flowExtension:edit.general.description.label") }
                                placeholder={ t("flowExtension:edit.general.description.placeholder") }
                                component={ TextFieldAdapter }
                                maxLength={ FlowExtensionConstants.FLOW_EXTENSION_MAX_DESCRIPTION_LENGTH }
                                minLength={ 0 }
                                disabled={ isReadOnly }
                            />
                            <FinalFormField
                                key="iconUrl"
                                width={ 16 }
                                sx={ { marginBottom: 1, marginTop: 1 } }
                                FormControlProps={ { margin: "dense" } }
                                ariaLabel="iconUrl"
                                required={ false }
                                data-componentid={ `${componentId}-icon-url` }
                                name="iconUrl"
                                type="url"
                                label={ t("flowExtension:edit.general.iconUrl.label") }
                                placeholder={ t("flowExtension:edit.general.iconUrl.placeholder") }
                                helperText={
                                    (<Hint className="hint" compact>
                                        { t("flowExtension:edit.general.iconUrl.hint") }
                                    </Hint>)
                                }
                                component={ TextFieldAdapter }
                                maxLength={ 2048 }
                                minLength={ 0 }
                                disabled={ isReadOnly }
                            />
                            <Button
                                size="medium"
                                variant="contained"
                                type="submit"
                                sx={ { marginTop: 3.75 } }
                                data-componentid={ `${componentId}-update-button` }
                                loading={ isSubmitting }
                                disabled={ isReadOnly || isSubmitting }
                            >
                                { t("common:update") }
                            </Button>
                        </form>
                    ) }
                />
            </EmphasizedSegment>
            <Show when={ flowExtensionsFeatureConfig?.scopes?.delete }>
                <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                    <DangerZone
                        actionTitle={ t("flowExtension:edit.dangerZone.delete.actionTitle") }
                        header={ t("flowExtension:edit.dangerZone.delete.header") }
                        subheader={ t("flowExtension:edit.dangerZone.delete.subheader") }
                        onActionClick={ (): void => setShowDeleteConfirmationModal(true) }
                        isButtonDisabled={ !hasDeletePermission }
                        data-componentid={ `${componentId}-delete-danger-zone` }
                    />
                </DangerZoneGroup>
            </Show>
            { showDeleteConfirmationModal && (
                <ConfirmationModal
                    primaryActionLoading={ isDeleting }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("flowExtension:edit.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleDelete() }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                        { t("flowExtension:edit.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                    >
                        { t("flowExtension:edit.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                        { t("flowExtension:edit.confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default FlowExtensionGeneralSettings;
