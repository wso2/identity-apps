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

import { createApplication } from "@wso2is/admin.applications.v1/api";
import { ApplicationShareModal } from "@wso2is/admin.applications.v1/components/modals/application-share-modal";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import useApplicationSharingEligibility from "@wso2is/admin.applications.v1/hooks/use-application-sharing-eligibility";
import { MainApplicationInterface, URLFragmentTypes } from "@wso2is/admin.applications.v1/models";
import { AppState, TierLimitReachErrorModal } from "@wso2is/admin.core.v1";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { ResourceCreateWizard } from "@wso2is/admin.template-core.v1/components/resource-create-wizard";
import { DynamicFieldInterface, DynamicFormInterface } from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import unset from "lodash-es/unset";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ModalProps } from "semantic-ui-react";
import { ApplicationTemplateConstants } from "../constants/templates";
import useApplicationTemplate from "../hooks/use-application-template";
import useApplicationTemplateMetadata from "../hooks/use-application-template-metadata";
import useInitializeHandlers from "../hooks/use-custom-initialize-handlers";
import useSubmissionHandlers from "../hooks/use-custom-submission-handlers";
import useValidationHandlers from "../hooks/use-custom-validation-handlers";

/**
 * Prop types of the `ApplicationCreateWizard` component.
 */
export interface ApplicationCreateWizardPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * Callback triggered when closing the application creation wizard.
     */
    onClose: () => void;
}

/**
 * Dynamic application create wizard component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationCreateWizard: FunctionComponent<ApplicationCreateWizardPropsInterface> = ({
    ["data-componentid"]: componentId = "application-create-wizard",
    onClose
}: ApplicationCreateWizardPropsInterface): ReactElement => {

    const { customValidations } = useValidationHandlers();
    const { customInitializers } = useInitializeHandlers();
    const { customSubmissionHandlers } = useSubmissionHandlers();
    const {
        template: templateData,
        isTemplateRequestLoading: isTemplateDataFetchRequestLoading
    } = useApplicationTemplate();
    const {
        templateMetadata,
        isTemplateMetadataRequestLoading: isTemplateMetadataFetchRequestLoading
    } = useApplicationTemplateMetadata();
    const isApplicationSharable: boolean = useApplicationSharingEligibility();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showApplicationShareModal, setShowApplicationShareModal ] = useState<boolean>(false);
    const [ lastCreatedApplicationId, setLastCreatedApplicationId ] = useState<string>(null);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);

    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isClientSecretHashEnabled);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Apply additional conditions to filter the form fields.
     */
    const formDefinition: DynamicFormInterface = useMemo(() => {
        if (!templateMetadata) {
            return null;
        }

        const form: DynamicFormInterface = cloneDeep(templateMetadata?.create?.form);

        if (!isApplicationSharable) {
            form.fields = form?.fields?.filter((field: DynamicFieldInterface) =>
                field?.name !== ApplicationTemplateConstants.APPLICATION_CREATE_WIZARD_SHARING_FIELD_NAME);
        }

        return form;
    }, [ templateMetadata, isApplicationSharable ]);

    /**
     * Prepare initial values for the resource create wizard.
     */
    const formInitialValues: Record<string, unknown> = useMemo(() => {
        if (templateData?.payload) {
            const clonedPayload: MainApplicationInterface = cloneDeep(templateData?.payload);

            if (!clonedPayload?.templateId) {
                clonedPayload.templateId = templateData?.id;
            }
            if (!clonedPayload?.templateVersion && templateData?.version) {
                clonedPayload.templateVersion = templateData?.version;
            }

            return clonedPayload  as unknown as Record<string, unknown>;
        }

        return null;
    }, [ templateData ]);

    /**
     * After the application is created, the user will be redirected to the
     * edit page using this function.
     *
     * @param createdAppId - ID of the created application.
     */
    const handleAppCreationComplete = (createdAppId: string): void => {
        // The created resource's id is sent as a location header.
        // If that's available, navigate to the edit page.
        if (createdAppId) {
            let searchParams: string = "?";
            const defaultTabIndex: number | string = templateMetadata?.edit?.defaultActiveTabId ?? 0;

            if (isClientSecretHashEnabled) {
                searchParams = `${ searchParams }${
                    ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY }=true`;
            }

            history.push({
                hash: `#${URLFragmentTypes.TAB_INDEX}${defaultTabIndex}`,
                pathname: AppConstants.getPaths()?.get("APPLICATION_EDIT")?.replace(":id", createdAppId),
                search: searchParams
            });

            return;
        }

        // Fallback to applications page, if the location header is not present.
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * Function to handle wizard form submission.
     *
     * @param values - Submission values from the form fields.
     * @param callback - Callback function to execute after form submission is complete.
     */
    const handleFormSubmission = (
        values: Record<string, unknown>,
        callback: (errorMsg: string, errorDescription: string) => void
    ): void => {
        const isApplicationSharingEnabled: boolean = get(
            values,
            ApplicationTemplateConstants.APPLICATION_CREATE_WIZARD_SHARING_FIELD_NAME
        ) as boolean ?? false;

        unset(values, ApplicationTemplateConstants.APPLICATION_CREATE_WIZARD_SHARING_FIELD_NAME);

        createApplication(values as unknown as MainApplicationInterface)
            .then((response: AxiosResponse) => {
                eventPublisher.compute(() => {
                    eventPublisher.publish("application-register-new-application", {
                        type: templateData?.id
                    });
                });

                dispatch(addAlert({
                    description: t("applications:notifications.addApplication.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.addApplication.success.message")
                }));

                const location: string = response.headers.location;
                const createdAppID: string = location.substring(location.lastIndexOf("/") + 1);

                callback(null, null);

                if (isApplicationSharingEnabled) {
                    setLastCreatedApplicationId(createdAppID);
                    setShowApplicationShareModal(true);
                } else {
                    handleAppCreationComplete(createdAppID);
                }
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 403
                    && error?.response?.data?.code === ApplicationManagementConstants
                        .ERROR_CREATE_LIMIT_REACHED.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error?.response?.data?.description) {
                    callback(error.response.data.description, t(
                        "applications:notifications.addApplication.error.message"
                    ));

                    return;
                }

                callback(
                    t("applications:notifications.addApplication.genericError.description"),
                    t("applications:notifications.addApplication.error.message")
                );
            });
    };

    if (openLimitReachedModal) {
        return (
            <TierLimitReachErrorModal
                actionLabel={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.action"
                ) }
                handleModalClose={
                    () => {
                        setOpenLimitReachedModal(false);
                        onClose();
                    }
                }
                header={ t(
                    "applications:notifications.tierLimitReachedError.heading"
                ) }
                description={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.subtitles"
                ) }
                message={ t(
                    "applications:notifications." +
                    "tierLimitReachedError.emptyPlaceholder.title"
                ) }
                openModal={ openLimitReachedModal }
            />
        );
    }

    if (showApplicationShareModal) {
        return (
            <ApplicationShareModal
                open={ showApplicationShareModal }
                applicationId={ lastCreatedApplicationId }
                onClose={ () => setShowApplicationShareModal(false) }
                onApplicationSharingCompleted={ () => {
                    setShowApplicationShareModal(false);
                    handleAppCreationComplete(lastCreatedApplicationId);
                    setLastCreatedApplicationId(null);
                } }
            />
        );
    }

    return (
        <ResourceCreateWizard
            showWizard={ true }
            onClose={ onClose }
            customValidations={ customValidations }
            customInitializers={ customInitializers }
            customSubmissionHandlers={ customSubmissionHandlers }
            form={ formDefinition }
            guide={ templateMetadata?.create?.guide }
            initialFormValues={ formInitialValues }
            templateId={ templateData?.id }
            templateName={ templateData?.name }
            templateDescription={ templateData?.description }
            templatePayload={ templateData?.payload as unknown as Record<string, unknown> }
            buttonText={ t("common:create") }
            onFormSubmit={ handleFormSubmission }
            isLoading={ isTemplateDataFetchRequestLoading || isTemplateMetadataFetchRequestLoading }
            data-componentid={ componentId }
        />
    );
};
