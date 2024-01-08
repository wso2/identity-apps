/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import { Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AccessControlConstants } from "../../../../../features/access-control/constants/access-control";
import { history } from "../../../../../features/core";
import { ExtendedFeatureConfigInterface } from "../../../../configs/models";
import { deleteAPIResource } from "../../api/api-resources";
import { APIResourcesConstants } from "../../constants/api-resources-constants";
import {
    APIResourceInterface,
    APIResourcePanesCommonPropsInterface,
    GeneralErrorAPIResourceInterface,
    GeneralUpdateAPIResourceInterface
} from "../../models";

/**
 * Prop-types for the API resources page component.
 */
type GeneralAPIResourceInterface = SBACInterface<ExtendedFeatureConfigInterface> &
    IdentifiableComponentInterface & APIResourcePanesCommonPropsInterface;

const FORM_ID: string = "apiResource-general-details";

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const GeneralAPIResource: FunctionComponent<GeneralAPIResourceInterface> = (
    props: GeneralAPIResourceInterface
): ReactElement => {

    const {
        isReadOnly,
        isManagedByChoreo,
        isSubmitting,
        handleUpdateAPIResource,
        apiResourceData,
        isAPIResourceDataLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isFormValidationError, setIsFormValidationError ] = useState<boolean>(true);
    const [ deleteAPIResourceLoading, setDeleteAPIResourceLoading ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingAPIResource, setDeletingAPIResource ] = useState<APIResourceInterface>(undefined);

    /**
     * Deletes an API resource when the delete API resource button is clicked.
     *
     * @param apiResourceId - API resource ID.
     */
    const handleAPIResourceDelete = (apiResourceId: string): void => {

        setDeleteAPIResourceLoading(true);
        deleteAPIResource(apiResourceId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.deleteAPIResource.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.apiResource.notifications.deleteAPIResource.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                history.push(APIResourcesConstants.getPaths().get("API_RESOURCES"));
            })
            .catch((error: IdentityAppsApiException) => {
                switch(error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".unauthorizedError.message")
                        }));

                        break;

                    case APIResourcesConstants.NO_VALID_API_RESOURCE_ID_FOUND:
                    case APIResourcesConstants.API_RESOURCE_NOT_FOUND:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".notFoundError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".notFoundError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".genericError.message")
                        }));
                }
            })
            .finally(() => {
                setDeleteAPIResourceLoading(false);
                setDeletingAPIResource(undefined);
            });
    };

    /**
     * Show danger zone component
     *
     * @returns `ReactElement`
     */
    const resolveDangerActions = (): ReactElement => {
        return (
            <>
                { !isReadOnly &&
                    (
                        <Show
                            when={ AccessControlConstants.API_RESOURCES_DELETE }
                        >
                            <DangerZoneGroup
                                sectionHeader={
                                    t("extensions:develop.apiResource.tabs.general.dangerZoneGroup.header") }
                            >
                                <DangerZone
                                    data-testid={ `${componentId}-danger-zone` }
                                    actionTitle={ t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                                        ".deleteApiResource.button") }
                                    header={ t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                                        ".deleteApiResource.header") }
                                    subheader={ t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                                        ".deleteApiResource.subHeading")
                                    }
                                    onActionClick={ (): void => {
                                        setShowDeleteConfirmationModal(true);
                                        setDeletingAPIResource(apiResourceData);
                                    } }
                                    isButtonDisabled={ false }
                                />
                            </DangerZoneGroup>
                        </Show>
                    )
                }
            </>
        );
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: GeneralUpdateAPIResourceInterface): void => {
        handleUpdateAPIResource({
            displayName: values.displayName?.toString().trim()
        });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: GeneralUpdateAPIResourceInterface): GeneralErrorAPIResourceInterface=> {

        const errors: GeneralErrorAPIResourceInterface = {
            displayName: undefined
        };

        if (!values.displayName?.toString().trim()) {
            errors.displayName = t("extensions:develop.apiResource.tabs.general.form" +
            ".fields.name.emptyValidate");

            setIsFormValidationError(true);
        } else {

            setIsFormValidationError(false);
        }

        return errors;
    };

    return (
        !isAPIResourceDataLoading
            ? (
                <>
                    {
                        isManagedByChoreo && (
                            <Alert severity="warning">
                                <Trans i18nKey={ "extensions:develop.apiResource.tabs.choreoApiEditWarning" }>
                                    Updating this API resource will create unforeseen errors as this is an API
                                    resource managed by Choreo. <b>Proceed with caution.</b>
                                </Trans>
                            </Alert>
                        )
                    }
                    <EmphasizedSegment padded="very">
                        <Form
                            data-testid={ `${componentId}-form` }
                            onSubmit={ updateConfigurations }
                            id={ FORM_ID }
                            validate={ validateForm }
                            uncontrolledForm={ false }
                        >
                            {
                                apiResourceData.displayName && (
                                    <Field.Input
                                        ariaLabel="Site title input field"
                                        inputType="name"
                                        name="displayName"
                                        label={ t("extensions:develop.apiResource.tabs.general.form" +
                                                ".fields.name.label") }
                                        placeholder={ t("extensions:develop.apiResource.tabs." +
                                                "general.form.fields.name.placeholder") }
                                        readOnly={ isReadOnly }
                                        required
                                        initialValue={ apiResourceData.displayName }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        width={ 16 }
                                        data-componentid={ `${componentId}-general-form-displayName` }
                                    />
                                )
                            }
                            {
                                apiResourceData.identifier && (
                                    <Field.Input
                                        ariaLabel="Site title input field"
                                        inputType="url"
                                        name="identifier"
                                        label={ t("extensions:develop.apiResource.tabs.general.form" +
                                                ".fields.identifier.label") }
                                        readOnly
                                        required
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        width={ 16 }
                                        data-componentid={ `${componentId}-general-form-identifier` }
                                    >
                                        <CopyInputField
                                            value={ apiResourceData.identifier }
                                        />
                                    </Field.Input>
                                )
                            }
                            <Field.Button
                                form={ FORM_ID }
                                size="small"
                                buttonType="primary_btn"
                                ariaLabel="Update button"
                                name="update-button"
                                hidden={ isReadOnly }
                                disabled={ isSubmitting || isFormValidationError }
                                loading={ isSubmitting }
                                data-componentid={ `${componentId}-submit-button` }
                                label={ t("extensions:develop.apiResource.tabs.general.form" +
                                        ".updateButton") }
                            />
                        </Form>
                    </EmphasizedSegment>
                    { resolveDangerActions() }
                    {
                        deletingAPIResource && (
                            <ConfirmationModal
                                primaryActionLoading={ deleteAPIResourceLoading }
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="negative"
                                open={ showDeleteConfirmationModal }
                                assertionHint={ t("extensions:develop.apiResource.confirmations.deleteAPIResource." +
                                    "assertionHint") }
                                assertionType="checkbox"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => {
                                    setShowDeleteConfirmationModal(false);
                                } }
                                onPrimaryActionClick={ (): void => handleAPIResourceDelete(deletingAPIResource.id) }
                                data-testid={ `${componentId}-delete-confirmation-modal` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header
                                    data-testid={ `${componentId}-delete-confirmation-modal-header` }
                                >
                                    { t("extensions:develop.apiResource.confirmations.deleteAPIResource.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-testid={ `${componentId}-delete-confirmation-modal-message` }
                                >
                                    { t("extensions:develop.apiResource.confirmations.deleteAPIResource.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content
                                    data-testid={ `${componentId}-delete-confirmation-modal-content` }
                                >
                                    { t("extensions:develop.apiResource.confirmations.deleteAPIResource.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </>
            )
            : <ContentLoader dimmer />
    );
};

/**
 * Default props for the component.
 */
GeneralAPIResource.defaultProps = {
    "data-componentid": "general-api-resource"
};
