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
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import { ConfirmationModal, EmphasizedSegment, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { updateApplicationConfigurations } from "../../api/application";

/**
 * Props interface for the OrganizationLoginSettings component.
 */
interface OrganizationLoginSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Saved value of the enhanced organization login setting.
     */
    isEnhancedOrganizationLoginEnabled: boolean;
    /**
     * Saved value of the organization custom roles setting.
     */
    isOrganizationCustomRolesEnabled: boolean;
    /**
     * Whether to show the organization custom roles option.
     */
    showOrganizationCustomRoles: boolean;
    /**
     * Role audience of the application.
     */
    roleAudience: string;
    /**
     * Callback to refresh the application after the settings are updated.
     */
    onUpdate: () => void;
    /**
     * Whether an application share is in progress.
     */
    isSharingInProgress?: boolean;
    /**
     * If true, renders the settings in read-only mode.
     */
    readOnly?: boolean;
}

const FORM_ID: string = "application-organization-login-settings-form";

/**
 * Organization login settings of a shared application.
 *
 * @param props - Props injected to the component.
 * @returns Organization login settings component.
 */
const OrganizationLoginSettings: FunctionComponent<OrganizationLoginSettingsPropsInterface> = ({
    appId,
    isEnhancedOrganizationLoginEnabled,
    isOrganizationCustomRolesEnabled,
    showOrganizationCustomRoles,
    roleAudience,
    onUpdate,
    isSharingInProgress,
    readOnly,
    "data-componentid": componentId = "application-organization-login-settings"
}: OrganizationLoginSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ enhancedOrganizationLogin, setEnhancedOrganizationLogin ] =
        useState<boolean>(isEnhancedOrganizationLoginEnabled);
    const [ organizationCustomRoles, setOrganizationCustomRoles ] =
        useState<boolean>(isOrganizationCustomRolesEnabled);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        setEnhancedOrganizationLogin(isEnhancedOrganizationLoginEnabled);
    }, [ isEnhancedOrganizationLoginEnabled ]);

    useEffect(() => {
        setOrganizationCustomRoles(isOrganizationCustomRolesEnabled);
    }, [ isOrganizationCustomRolesEnabled ]);

    const isOrganizationAudience: boolean = roleAudience?.toUpperCase() === RoleAudienceTypes.ORGANIZATION;
    const isEnhancedOrganizationLoginChanged: boolean =
        enhancedOrganizationLogin !== isEnhancedOrganizationLoginEnabled;
    const isOrganizationCustomRolesChanged: boolean = showOrganizationCustomRoles
        && organizationCustomRoles !== isOrganizationCustomRolesEnabled;

    const isOrganizationCustomRolesDisabled: boolean = isOrganizationCustomRolesChanged && !organizationCustomRoles;
    // Disabling organization custom roles deletes application custom roles, but not organization roles.
    const isDeletingOrganizationCustomRoles: boolean = isOrganizationCustomRolesDisabled && !isOrganizationAudience;

    /**
     * Updates the organization login settings of the application.
     */
    const updateSettings = (): void => {
        const configurations: Record<string, unknown> = {
            enhancedOrgAuthenticationEnabled: enhancedOrganizationLogin,
            ...(showOrganizationCustomRoles ? { organizationCustomRolesEnabled: organizationCustomRoles } : {})
        };

        setIsSubmitting(true);

        updateApplicationConfigurations(appId, configurations)
            .then((): void => {
                dispatch(addAlert({
                    description: t("applications:edit.sections.organizationLoginSettings.notifications." +
                        "update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:edit.sections.organizationLoginSettings.notifications." +
                        "update.success.message")
                }));
                onUpdate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("applications:edit.sections.organizationLoginSettings.notifications." +
                        "update.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.organizationLoginSettings.notifications." +
                        "update.error.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handles the update button. Changing enhanced organization login or disabling organization custom roles
     * needs a confirmation. Enabling organization custom roles does not.
     */
    const handleUpdate = (): void => {
        if (isEnhancedOrganizationLoginChanged || isOrganizationCustomRolesDisabled) {
            setShowConfirmationModal(true);

            return;
        }

        updateSettings();
    };

    /**
     * Renders the confirmation modal for the changes. When both settings are disabled, a combined message is shown.
     */
    const renderConfirmationModal = (): ReactElement => {
        const resolveMessage = (): string => {
            if (isDeletingOrganizationCustomRoles) {
                return t("applications:edit.sections.organizationCustomRoles.confirmation.disableMessage");
            }

            return isEnhancedOrganizationLoginChanged
                ? t("applications:edit.sections.enhancedOrganizationLogin.confirmation.message")
                : t("applications:edit.sections.organizationCustomRoles.confirmation.message");
        };

        const resolveOrganizationCustomRolesContent = (): string => {
            if (isOrganizationAudience) {
                return t("applications:edit.sections.organizationCustomRoles.confirmation.content." +
                    "disableOrganizationAudience");
            }

            // Disabling enhanced organization login also disables organization custom roles.
            return isEnhancedOrganizationLoginChanged
                ? t("applications:edit.sections.enhancedOrganizationLogin.confirmation.content.1")
                : t("applications:edit.sections.organizationCustomRoles.confirmation.content." +
                    "disableApplicationAudience");
        };

        return (
            <ConfirmationModal
                data-componentid={ `${ componentId }-confirmation-modal` }
                onClose={ (): void => setShowConfirmationModal(false) }
                type={ isDeletingOrganizationCustomRoles ? "negative" : "warning" }
                open={ showConfirmationModal }
                assertionHint={ isDeletingOrganizationCustomRoles
                    ? t("applications:edit.sections.organizationCustomRoles.confirmation.assertionHint")
                    : undefined }
                assertionType={ isDeletingOrganizationCustomRoles ? "checkbox" : undefined }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ (): void => {
                    setShowConfirmationModal(false);
                    updateSettings();
                } }
                onSecondaryActionClick={ (): void => setShowConfirmationModal(false) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { isEnhancedOrganizationLoginChanged
                        ? t("applications:edit.sections.enhancedOrganizationLogin.confirmation.header")
                        : t("applications:edit.sections.organizationCustomRoles.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning={ !isDeletingOrganizationCustomRoles }
                    negative={ isDeletingOrganizationCustomRoles }
                >
                    { resolveMessage() }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { isEnhancedOrganizationLoginChanged && (
                        <p>
                            { t("applications:edit.sections.enhancedOrganizationLogin.confirmation.content.0") }
                        </p>
                    ) }
                    { isOrganizationCustomRolesDisabled && (
                        <p>
                            { resolveOrganizationCustomRolesContent() }
                        </p>
                    ) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    return (
        <EmphasizedSegment
            className="advanced-configuration-section mt-5"
            padded="very"
            data-componentid={ componentId }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">
                            { t("applications:edit.sections.organizationLoginSettings.heading") }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Form
                            id={ FORM_ID }
                            uncontrolledForm={ true }
                            onSubmit={ (): void => undefined }
                        >
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.CheckboxLegacy
                                            listen={ setEnhancedOrganizationLogin }
                                            // Organization custom roles require enhanced organization login.
                                            disabled={ showOrganizationCustomRoles && organizationCustomRoles }
                                            ariaLabel="Enhanced organization login"
                                            name="enhancedOrgAuthenticationEnabled"
                                            checked={ enhancedOrganizationLogin }
                                            label={
                                                t("applications:edit.sections.enhancedOrganizationLogin.title")
                                            }
                                            required={ false }
                                            value={
                                                enhancedOrganizationLogin
                                                    ? [ "enhancedOrgAuthenticationEnabled" ]
                                                    : []
                                            }
                                            readOnly={ readOnly || isSharingInProgress || isSubmitting }
                                            data-componentid={
                                                `${ componentId }-enhanced-organization-login-checkbox`
                                            }
                                            hint={
                                                t("applications:edit.sections.enhancedOrganizationLogin." +
                                                    "description")
                                            }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                { showOrganizationCustomRoles && (
                                    <div className="ml-3">
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                <Field.CheckboxLegacy
                                                    listen={ setOrganizationCustomRoles }
                                                    disabled={ !enhancedOrganizationLogin }
                                                    ariaLabel="Allow organizations to create custom roles"
                                                    name="organizationCustomRolesEnabled"
                                                    checked={ organizationCustomRoles }
                                                    label={
                                                        t("applications:edit.sections.organizationCustomRoles." +
                                                            "title")
                                                    }
                                                    required={ false }
                                                    value={
                                                        organizationCustomRoles
                                                            ? [ "organizationCustomRolesEnabled" ]
                                                            : []
                                                    }
                                                    readOnly={ readOnly || isSharingInProgress || isSubmitting }
                                                    data-componentid={
                                                        `${ componentId }-organization-custom-roles-checkbox`
                                                    }
                                                    hint={ t("applications:edit.sections.organizationCustomRoles." +
                                                        "description") }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </div>
                                ) }
                            </Grid>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                { !readOnly && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Button
                                className="mt-5"
                                variant="contained"
                                size="small"
                                onClick={ handleUpdate }
                                loading={ isSubmitting }
                                disabled={ isSharingInProgress || isSubmitting }
                                data-componentid={ `${ componentId }-update-button` }
                            >
                                { t("common:update") }
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
            { renderConfirmationModal() }
        </EmphasizedSegment>
    );
};

export default OrganizationLoginSettings;
