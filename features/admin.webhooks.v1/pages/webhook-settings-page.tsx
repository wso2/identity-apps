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

import Box from "@oxygen-ui/react/Box";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateWebhookMetadata from "../api/update-webhook-metadata";
import useGetWebhooksMetadata from "../api/use-get-webhooks-metadata";
import { EventPublishingOrgSharePolicy } from "../models/shared-access";
import {
    WebhookMetadataUpdateRequestInterface,
    WebhookSettingsFormPropsInterface,
    WebhookSettingsFormValuesInterface
} from "../models/webhook-settings";
import { useHandleWebhookError } from "../utils/alert-utils";
import "./webhook-settings-page.scss";

const FORM_ID: string = "webhook-settings";

/**
 * This will be used to render the event publishing organization policy radio options.
 */
const ORGANIZATION_POLICY_RADIO_OPTIONS: RadioChild[] = [
    {
        label: "webhooks:pages.settings.organizationPolicy.radioOptions.currentOrgOnly",
        value: EventPublishingOrgSharePolicy.NO_SHARING
    },
    {
        label: "webhooks:pages.settings.organizationPolicy.radioOptions.currentOrgAndImmediateChild",
        value: EventPublishingOrgSharePolicy.IMMEDIATE_EXISTING_AND_FUTURE_ORGS
    }
];

/**
 * Form to edit webhook settings.
 *
 * @param props - Props injected to the component.
 * @returns Functional Component.
 */
export const WebhookSettingsForm: FunctionComponent<WebhookSettingsFormPropsInterface> = ({
    ["data-componentid"]: componentId = "webhook-settings-page"
}: WebhookSettingsFormPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Get initial webhook metadata.
     */
    const {
        data: webhooksMetadata,
        isLoading: isWebhooksMetadataLoading,
        error: webhooksMetadataError
    } = useGetWebhooksMetadata();

    // Alert handlers
    const handleError: ReturnType<typeof useHandleWebhookError> = useHandleWebhookError();

    /**
     * Handles the error scenario of the webhooks metadata fetch.
     */
    useEffect(() => {
        if (webhooksMetadataError) {
            handleError(webhooksMetadataError, "fetchWebhooksMetadata");
        }
    }, [ webhooksMetadataError, handleError ]);

    /**
     * Handles the success scenario of the update.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("webhooks:notifications.updateWebhookSettings.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("webhooks:notifications.updateWebhookSettings.success.message")
            })
        );
    };

    /**
     * Handles the error scenario of the update.
     */
    const handleUpdateError = (error: AxiosError) => {
        if (error?.response?.data?.detail) {
            dispatch(
                addAlert({
                    description: t("webhooks:notifications.updateWebhookSettings.error.description",
                        { description: error.response.data.description }),
                    level: AlertLevels.ERROR,
                    message: t(
                        "webhooks:notifications.updateWebhookSettings.error.message"
                    )
                })
            );
        } else {
            // Generic error message.
            dispatch(
                addAlert({
                    description: t(
                        "webhooks:notifications.updateWebhookSettings.error.genericDescription"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "webhooks:notifications.updateWebhookSettings.error.message"
                    )
                })
            );
        }
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     */
    const updateWebhookSettings = (values: WebhookSettingsFormValuesInterface) => {
        setIsSubmitting(true);

        const updateMetadata: WebhookMetadataUpdateRequestInterface = {
            organizationPolicy: {
                policyName: values.organizationPolicy.policyName
            }
        };

        updateWebhookMetadata(updateMetadata)
            .then(() => {
                handleUpdateSuccess();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderLoadingPlaceholders = (): ReactElement => (
        <Box className="placeholder-box">
            <Skeleton variant="rectangular" height={ 21 } />
            <Skeleton variant="rectangular" height={ 14 }  />
            <Skeleton variant="rectangular" height={ 7 } />
        </Box>
    );

    /**
     * This handles back button navigation.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("WEBHOOKS"));
    };

    return (
        <div className="webhook-settings-page">
            {
                <PageLayout
                    title={ t("webhooks:pages.settings.heading") }
                    description={ (
                        <>
                            { t("webhooks:pages.settings.subHeading") }
                        </>
                    ) }
                    backButton={ {
                        "data-componentid": `${componentId}-page-back-button`,
                        onClick: handleBackButtonClick,
                        text: t("webhooks:pages.settings.backButton")
                    } }
                    bottomMargin={ false }
                    contentTopMargin={ true }
                    pageHeaderMaxWidth={ true }
                    data-componentid={ `${componentId}-page-layout` }
                >
                    <EmphasizedSegment padded="very">
                        { isWebhooksMetadataLoading ? renderLoadingPlaceholders() :

                            (<Form
                                id={ FORM_ID }
                                uncontrolledForm={ false }
                                onSubmit={ (values: WebhookSettingsFormValuesInterface) => {
                                    updateWebhookSettings(values);
                                } }
                                initialValues={ {
                                    organizationPolicy: {
                                        policyName: webhooksMetadata?.organizationPolicy?.policyName ||
                                        EventPublishingOrgSharePolicy.NO_SHARING
                                    }
                                } }
                                data-componentid={ `${componentId}-form` }
                            >
                                <Typography variant="h6" className="heading-container">
                                    { t("webhooks:pages.settings.organizationPolicy.heading") }
                                </Typography>
                                {
                                    ORGANIZATION_POLICY_RADIO_OPTIONS.map((option: RadioChild) => (
                                        <Field.Radio
                                            key={ option.value }
                                            ariaLabel={ t(option.label) }
                                            label={ t(option.label) }
                                            name="organizationPolicy.policyName"
                                            type="radio"
                                            value={ option.value }
                                            data-componentid={ `${ componentId }-organization-policy-radio-` +
                                                    `option-${ option.value }` }
                                        />
                                    ))
                                }
                                <Field.Button
                                    form={ FORM_ID }
                                    size="small"
                                    buttonType="primary_btn"
                                    ariaLabel="Update button"
                                    name="update-button"
                                    data-testid={ `${ componentId }-submit-button` }
                                    disabled={ isSubmitting }
                                    loading={ isSubmitting }
                                    label={ t("common:update") }
                                />
                            </Form>) }
                    </EmphasizedSegment>
                </PageLayout>
            }
        </div>
    );
};

export default WebhookSettingsForm;
