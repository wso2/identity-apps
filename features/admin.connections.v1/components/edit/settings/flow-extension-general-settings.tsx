/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Divider from "@oxygen-ui/react/Divider";
import checkFlowExtensionName from "@wso2is/admin.flow-builder-core.v1/api/check-flow-extension-name";
import deleteFlowExtension from "@wso2is/admin.flow-builder-core.v1/api/delete-flow-extension";
import updateFlowExtension from "@wso2is/admin.flow-builder-core.v1/api/update-flow-extension";
import {
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "@wso2is/admin.flow-builder-core.v1/models/flow-extension";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";

const ACTION_NAME_REGEX: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,254}$/;
const FORM_ID: string = "flow-extension-general-settings-form";

interface FlowExtensionGeneralSettingsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: FlowExtensionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    onDelete: () => void;
    onUpdate: () => void;
    loader: () => ReactElement;
}

export const FlowExtensionGeneralSettings: FunctionComponent<FlowExtensionGeneralSettingsPropsInterface> = ({
    action,
    isLoading,
    isReadOnly,
    onDelete,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "flow-extension-general-settings"
}: FlowExtensionGeneralSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isNameTaken, setIsNameTaken ] = useState<boolean>(false);
    const nameCheckTimer: MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCheckedName: MutableRefObject<string> = useRef<string>("");

    const debouncedCheckName: (name: string) => void = useCallback((name: string) => {
        if (name === action?.name) {
            setIsNameTaken(false);

            return;
        }
        if (lastCheckedName.current === name) {
            return;
        }
        if (nameCheckTimer.current) {
            clearTimeout(nameCheckTimer.current);
        }
        lastCheckedName.current = name;
        if (!name || !ACTION_NAME_REGEX.test(name)) {
            setIsNameTaken(false);

            return;
        }
        nameCheckTimer.current = setTimeout(() => {
            checkFlowExtensionName(name, action?.id)
                .then((response: { available: boolean }) => {
                    setIsNameTaken(!response.available);
                })
                .catch(() => {
                    setIsNameTaken(false);
                });
        }, 500);
    }, [ action?.name, action?.id ]);

    useEffect(() => {
        return () => {
            if (nameCheckTimer.current) {
                clearTimeout(nameCheckTimer.current);
            }
        };
    }, []);

    const validateForm = (
        values: { name: string; description?: string }
    ): Partial<{ name: string; description: string }> => {
        const errors: Partial<{ name: string; description: string }> = {};

        if (!values?.name || !ACTION_NAME_REGEX.test(values.name)) {
            errors.name = t("flowExtension:createWizard.steps.generalSettings.name.validations.invalid");
        } else if (isNameTaken) {
            errors.name = t("flowExtension:createWizard.steps.generalSettings.name.validations.duplicate");
        }

        if (values?.description && values.description.length > 255) {
            errors.description = t(
                "flowExtension:createWizard.steps.generalSettings.description.validations.maxLength"
            );
        }

        debouncedCheckName(values?.name);

        return errors;
    };

    const handleFormSubmit = (values: { name: string; description?: string; image?: string }): void => {
        setIsSubmitting(true);

        const updateBody: FlowExtensionUpdateRequestInterface = {
            description: values.description?.toString() ?? "",
            iconUrl: values.image?.toString() ?? "",
            name: values.name?.toString()
        };

        updateFlowExtension(action.id, updateBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                onUpdate();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.updateIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.updateIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleDelete = (): void => {
        setIsDeleting(true);

        deleteFlowExtension(action.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.deleteConnection.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.deleteConnection.success.message")
                }));
                setShowDeleteConfirmation(false);
                onDelete();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.deleteIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.deleteIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    if (isLoading || !action) {
        return <Loader />;
    }

    return (
        <>
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    enableReinitialize
                    onSubmit={ handleFormSubmit }
                    validate={ validateForm }
                    initialValues={ {
                        description: action.description ?? "",
                        image: action.iconUrl ?? "",
                        name: action.name ?? ""
                    } }
                    data-componentid={ componentId }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="text"
                        name="name"
                        label={ t("flowExtension:createWizard.steps.generalSettings.name.label") }
                        placeholder={
                            t("flowExtension:createWizard.steps.generalSettings.name.placeholder")
                        }
                        required={ true }
                        maxLength={ 255 }
                        minLength={ 1 }
                        data-componentid={ `${componentId}-name` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        name="image"
                        ariaLabel="image"
                        inputType="url"
                        label="Icon URL"
                        required={ false }
                        placeholder={ t("authenticationProvider:forms.generalDetails.image.placeholder") }
                        data-componentid={ `${componentId}-image` }
                        maxLength={
                            ConnectionUIConstants.GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MAX_LENGTH as number
                        }
                        minLength={
                            ConnectionUIConstants.GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MIN_LENGTH as number
                        }
                        hint={ t("customAuthenticator:fields.editPage.generalTab.iconUrl.hint") }
                        readOnly={ isReadOnly }
                    />
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("authenticationProvider:forms.generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                        data-componentid={ `${componentId}-description` }
                        maxLength={ 255 }
                        minLength={ 0 }
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
                            data-componentid={ `${componentId}-update-button` }
                        />
                    ) }
                </Form>
            </EmphasizedSegment>
            <Divider hidden />
            { !isReadOnly && (
                <DangerZoneGroup
                    sectionHeader={ t("authenticationProvider:dangerZoneGroup.header") }
                >
                    <DangerZone
                        actionTitle={ t("authenticationProvider:dangerZoneGroup.deleteIDP.actionTitle") }
                        header={ t("authenticationProvider:dangerZoneGroup.deleteIDP.header") }
                        subheader={
                            "Deleting this flow extension may break flows that reference it. " +
                            "This action is irreversible."
                        }
                        onActionClick={ (): void => setShowDeleteConfirmation(true) }
                        data-componentid={ `${componentId}-delete-danger-zone` }
                    />
                </DangerZoneGroup>
            ) }
            { showDeleteConfirmation && (
                <ConfirmationModal
                    primaryActionLoading={ isDeleting }
                    onClose={ (): void => setShowDeleteConfirmation(false) }
                    type="negative"
                    open={ showDeleteConfirmation }
                    assertion={ action.name }
                    assertionHint={ t("authenticationProvider:confirmations.deleteIDP.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmation(false) }
                    onPrimaryActionClick={ handleDelete }
                    data-componentid={ `${componentId}-delete-confirmation` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${componentId}-delete-confirmation-header` }
                    >
                        { t("authenticationProvider:confirmations.deleteIDP.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-confirmation-message` }
                    >
                        { t("authenticationProvider:confirmations.deleteIDP.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${componentId}-delete-confirmation-content` }
                    >
                        Deleting this flow extension will break any flows that currently use it.
                        Please proceed with caution.
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
