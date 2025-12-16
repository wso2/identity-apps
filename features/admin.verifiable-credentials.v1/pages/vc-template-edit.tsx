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

import { AppConstants as CommonAppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    PageLayout
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import {
    deleteVCTemplate,
    getVCTemplate,
    updateVCTemplate
} from "../api/verifiable-credentials";
import {
    VCTemplate,
    VCTemplateUpdateModel
} from "../models/verifiable-credentials";

/**
 * Prop types for the VC Template Edit page component.
 */
type VCTemplateEditPageProps = IdentifiableComponentInterface;

/**
 * Form values interface for the VC template edit form.
 */
interface VCTemplateEditFormValues {
    displayName: string;
}

const FORM_ID: string = "vc-template-edit-form";

/**
 * VC Template Edit page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const VCTemplateEditPage: FunctionComponent<VCTemplateEditPageProps> = ({
    "data-componentid": componentId = "vc-template-edit"
}: VCTemplateEditPageProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ templateId, setTemplateId ] = useState<string>(null);
    const [ vcTemplate, setVCTemplate ] = useState<VCTemplate>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    /**
     * Get the template ID from the URL path.
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[path.length - 1];

        setTemplateId(id);
    }, []);

    /**
     * Fetch the VC template when templateId is available.
     */
    useEffect(() => {
        if (!templateId) {
            return;
        }

        fetchVCTemplate();
    }, [ templateId ]);

    /**
     * Fetch the VC template.
     */
    const fetchVCTemplate = (): void => {
        setIsLoading(true);

        getVCTemplate(templateId)
            .then((response: VCTemplate) => {
                setVCTemplate(response);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.fetchTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.fetchTemplate.error.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handle form submission for updating the VC template.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: VCTemplateEditFormValues): void => {
        setIsSubmitting(true);

        const updateData: VCTemplateUpdateModel = {
            displayName: values.displayName
        };

        updateVCTemplate(templateId, updateData)
            .then((response: VCTemplate) => {
                setVCTemplate(response);
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.updateTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.updateTemplate.success.message")
                }));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.updateTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.updateTemplate.error.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handle deleting the VC template.
     */
    const handleDelete = (): void => {
        setIsDeleting(true);

        deleteVCTemplate(templateId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.deleteTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.deleteTemplate.success.message")
                }));

                setShowDeleteConfirmation(false);
                history.push(CommonAppConstants.getPaths().get("VC_TEMPLATES"));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.deleteTemplate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:notifications.deleteTemplate.error.message")
                }));
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(CommonAppConstants.getPaths().get("VC_TEMPLATES"));
    };

    if (isLoading) {
        return (
            <PageLayout
                pageTitle={ t("verifiableCredentials:editPage.title") }
                title={ t("verifiableCredentials:editPage.title") }
                data-componentid={ `${componentId}-page-layout` }
            >
                <ContentLoader />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            pageTitle={ vcTemplate?.displayName || t("verifiableCredentials:editPage.title") }
            title={ vcTemplate?.displayName || t("verifiableCredentials:editPage.title") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("verifiableCredentials:editPage.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${componentId}-page-layout` }
        >
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    onSubmit={ handleFormSubmit }
                    data-componentid={ `${componentId}-form` }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field.Input
                                    ariaLabel="displayName"
                                    inputType="name"
                                    name="displayName"
                                    label={ t("verifiableCredentials:editPage.form.displayName.label") }
                                    placeholder={
                                        t("verifiableCredentials:editPage.form.displayName.placeholder")
                                    }
                                    hint={ t("verifiableCredentials:editPage.form.displayName.hint") }
                                    required={ true }
                                    value={ vcTemplate?.displayName }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${componentId}-display-name-input` }
                                    width={ 16 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <label className="form-label">
                                    { t("verifiableCredentials:editPage.form.identifier.label") }
                                </label>
                                <CopyInputField
                                    value={ vcTemplate?.identifier || "" }
                                    data-componentid={ `${componentId}-identifier-copy-field` }
                                />
                                <p className="hint-description">
                                    { t("verifiableCredentials:editPage.form.identifier.hint") }
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field.Button
                                    form={ FORM_ID }
                                    ariaLabel="update"
                                    size="small"
                                    buttonType="primary_btn"
                                    label={ t("common:update") }
                                    name="update"
                                    disabled={ isSubmitting }
                                    loading={ isSubmitting }
                                    data-componentid={ `${componentId}-update-button` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </EmphasizedSegment>

            <Divider hidden />

            <DangerZoneGroup
                sectionHeader={ t("verifiableCredentials:editPage.dangerZone.header") }
            >
                <DangerZone
                    actionTitle={ t("verifiableCredentials:editPage.dangerZone.delete.actionTitle") }
                    header={ t("verifiableCredentials:editPage.dangerZone.delete.header") }
                    subheader={ t("verifiableCredentials:editPage.dangerZone.delete.subheader") }
                    onActionClick={ () => setShowDeleteConfirmation(true) }
                    data-componentid={ `${componentId}-danger-zone` }
                />
            </DangerZoneGroup>

            <ConfirmationModal
                primaryActionLoading={ isDeleting }
                open={ showDeleteConfirmation }
                onClose={ () => setShowDeleteConfirmation(false) }
                type="negative"
                assertionHint={ t("verifiableCredentials:editPage.confirmations.deleteTemplate.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                onPrimaryActionClick={ handleDelete }
                data-componentid={ `${componentId}-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                >
                    { t("verifiableCredentials:editPage.confirmations.deleteTemplate.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </PageLayout>
    );
};

export default VCTemplateEditPage;
