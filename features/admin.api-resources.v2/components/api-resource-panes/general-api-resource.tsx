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

import { Show } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
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
type GeneralAPIResourceInterface = SBACInterface<FeatureConfigInterface> &
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
        isSubmitting,
        handleUpdateAPIResource,
        apiResourceData,
        isAPIResourceDataLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

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
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                        ".genericError.message")
                }));
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
                            when={ featureConfig?.apiResources?.scopes?.delete }
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
            name: values.displayName?.toString().trim()
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
                    <EmphasizedSegment padded="very">
                        <Form
                            data-testid={ `${componentId}-form` }
                            onSubmit={ updateConfigurations }
                            id={ FORM_ID }
                            validate={ validateForm }
                            uncontrolledForm={ false }
                        >
                            {
                                apiResourceData.name && (
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
                                        initialValue={ apiResourceData.name }
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
                    <Divider hidden />
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
