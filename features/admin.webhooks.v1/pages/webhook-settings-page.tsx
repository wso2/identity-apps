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

import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import {
    ContentLoader,
    EmphasizedSegment,
    PageLayout,
    useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetWebhooksMetadata from "../api/use-get-webhooks-metadata";
import { EventPublishingOrgSharePolicy } from "../models/shared-access";
import {
    WebhookMetadataUpdateRequestInterface,
    WebhookSettingsFormValuesInterface,
    WebhookSettingsPropsInterface
} from "../models/webhook-settings";
import { useHandleWebhookError } from "../utils/alert-utils";
import "./webhook-settings-page.scss";
import updateWebhookMetadata from "../api/update-webhook-metadata";

const FORM_ID: string = "webhook-settings";

/**
 * Enum for event publishing organization policy settings in webhooks.
 */
enum OrganizationPolicyOptionType {
    CURRENT_ORG_ONLY = "currentOrgOnly",
    CURRENT_ORG_AND_IMMEDIATE_CHILD = "currentOrgAndImmediateChild"
}

/**
 * This will be used to render the event publishing organization policy radio options.
 */
const ORGANIZATION_POLICY_RADIO_OPTIONS: RadioChild[] = [
    {
        label: "webhooks:pages.settings.organizationPolicy.radioOptions.currentOrgOnly",
        value: OrganizationPolicyOptionType.CURRENT_ORG_ONLY
    },
    {
        label: "webhooks:pages.settings.organizationPolicy.radioOptions.currentOrgAndImmediateChild",
        value: OrganizationPolicyOptionType.CURRENT_ORG_AND_IMMEDIATE_CHILD
    }
];

/**
 * Form to edit webhook settings.
 *
 * @param props - Props injected to the component.
 * @returns Functional Component.
 */
export const WebhookSettingsForm: FunctionComponent<WebhookSettingsPropsInterface> = (
    props: WebhookSettingsPropsInterface
): ReactElement => {

    const {
        organizationPolicy,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // const [ isEnabledForCurrentOrgOnly, setIsEnabledForCurrentOrgOnly ] =
    //     useState<boolean>(organizationPolicy?.publishEventsOfThisOrgOnly);
    // const [ isEnabledForCurrentOrgAndImmediateChild, setIsEnabledForCurrentOrgAndImmediateChild ] =
    //     useState<boolean>(organizationPolicy?.publishEventsOfThisOrgAndImmediateChild);
    // const [ eventPublishingSettingsRadioOption, setEventPublishingSettingsRadioOption ] =
    //     useState<string>(OrganizationPolicyOptionType.CURRENT_ORG_ONLY);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /**
     * Get initial webhook settings.
     */
    const {
        data: webhooksMetadata,
        isLoading: isWebhooksMetadataLoading,
        error: webhooksMetadataError
    } = useGetWebhooksMetadata();

    // Alert handlers
    const handleError: ReturnType<typeof useHandleWebhookError> = useHandleWebhookError();

    /**
     * Sets the internal loading state when the SWR `isLoading` state changes.
     */
    useEffect(() => {
        setIsLoading(isWebhooksMetadataLoading);
    }, [ isWebhooksMetadataLoading ]);

    /**
     * Set initial values for the form.
     */
    // useEffect(() => {
    //     if (webhooksMetadata) {
    //         setIsEnabledForCurrentOrgOnly(webhooksMetadata.organizationPolicy ===
    //             EventPublishingOrgSharePolicy.CURRENT_ORG_ONLY);
    //         setIsEnabledForCurrentOrgAndImmediateChild(webhooksMetadata.organizationPolicy ===
    //             EventPublishingOrgSharePolicy.CURRENT_ORG_AND_IMMEDIATE_CHILD);
    //     }
    // }, [ webhooksMetadata ]);

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
                description: t("console:develop.pages.applicationsSettings.notifications.success.description"),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:develop.pages.applicationsSettings.notifications.success.message"
                )
            })
        );
    };

    /**
     * Resolve the error message when the update fails.
     */
    const resolveUpdateErrorMessage = (error: AxiosError): string => {

        return (
            t("console:develop.pages.applicationsSettings.notifications.error.description",
                { description: error.response.data.description })
        );
    };

    /**
     * Handles the error scenario of the update.
     */
    const handleUpdateError = (error: AxiosError) => {
        if (error?.response?.data?.detail) {
            dispatch(
                addAlert({
                    description: resolveUpdateErrorMessage(error),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.pages.applicationsSettings.notifications.error.message"
                    )
                })
            );
        } else {
            // Generic error message.
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.pages.applicationsSettings.notifications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.pages.applicationsSettings.notifications.genericError.message"
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
    // const updateConfigurations = (values: WebhookSettingsFormValuesInterface) => {
    //     setIsSubmitting(true);

    //     const updateData: WebhookMetadataUpdateRequestInterface = { // EventPublishingOrgSharePolicy
    //         // organizationPolicy: values.organizationPolicy === OrganizationPolicyOptionType.CURRENT_ORG_ONLY
    //         //     ? EventPublishingOrgSharePolicy.CURRENT_ORG_ONLY
    //         //     : EventPublishingOrgSharePolicy.CURRENT_ORG_AND_IMMEDIATE_CHILD
    //         organizationPolicy: values.organizationPolicy
    //         // organizationPolicy: EventPublishingOrgSharePolicy.CURRENT_ORG_ONLY
    //     };

    //     updateWebhookMetadata(updateData)
    //         .then(() => {
    //             handleUpdateSuccess();
    //         })
    //         .catch((error: AxiosError) => {
    //             handleUpdateError(error);
    //         })
    //         .finally(() => {
    //             setIsSubmitting(false);
    //         });
    // };

    /**
     * This handles back button navigation.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("WEBHOOKS"));
    };

    return (
        <div className="webhook-settings-page">
            { !isLoading ?
                (<PageLayout
                    title={ t("webhooks:pages.settings.heading") }
                    description={ (
                        <>
                            { t("webhooks:pages.settings.subHeading") }
                            { /* <DocumentationLink
                            link={ getLink("develop.applications.applicationsSettings.dcr.learnMore") }
                        >
                            { t("console:develop.pages.applicationsSettings.learnMore") }
                        </DocumentationLink> */ }
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
                        <Form
                            id={ FORM_ID }
                            uncontrolledForm={ false }
                            // onSubmit={ (values: WebhookSettingsFormValuesInterface) => {
                            //     updateConfigurations(values);
                            // } }
                            // onSubmit={ (values) => updateConfigurations(values) }
                            onSubmit={ () => {} }
                            // initialValues={ {
                            //     organizationPolicy: isEnabledForCurrentOrgOnly ?
                            //         OrganizationPolicyOptionType.CURRENT_ORG_ONLY :
                            //         OrganizationPolicyOptionType.CURRENT_ORG_AND_IMMEDIATE_CHILD
                            // } }
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
                                        name="organizationPolicy"
                                        type="radio"
                                        value={ option.value }
                                        // checked={ organizationPolicy === option.value }
                                        // listen={ () => setOrganizationPolicy(option.value) }
                                        // readOnly={ readOnly }
                                        data-componentid={ `${ componentId }-organization-policy-radio-` +
                                                    `option-${ option.value }` }
                                    // disabled={ !isDiscoverable }
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
                            // hidden={
                            //     isSharedApp || !hasRequiredScope || (
                            //         readOnly
                            //                     && applicationConfig.generalSettings.getFieldReadOnlyStatus(
                            //                         application, "ACCESS_URL"
                            //                     )
                            //     )
                            // }
                            />
                        </Form>
                    </EmphasizedSegment>
                </PageLayout>) :
                (
                    <EmphasizedSegment padded="very">
                        <ContentLoader inline="centered" active />
                    </EmphasizedSegment>
                )
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
WebhookSettingsForm.defaultProps = {
    "data-componentid": "webhook-settings-page"
};

export default WebhookSettingsForm;
