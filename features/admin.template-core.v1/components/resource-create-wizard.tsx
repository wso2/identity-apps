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

import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Typography from "@oxygen-ui/react/Typography";
import buildCallBackUrlsWithRegExp from "@wso2is/admin.application-templates.v1/utils/build-callback-urls-with-regexp";
import { createApplication } from "@wso2is/admin.applications.v1/api";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import { MainApplicationInterface } from "@wso2is/admin.applications.v1/models";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    Heading,
    LinkButton,
    Markdown,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import has from "lodash-es/has";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import unset from "lodash-es/unset";
import React, { ChangeEvent, FunctionComponent, MouseEvent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, ModalProps } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import useInitializeHandlers, { CustomInitializeFunction } from "./forms/handlers/initialize/use-initialize-handlers";
import useValidationHandlers, { CustomValidationsFunction } from "./forms/handlers/validation/use-validation-handlers";
import { DynamicFieldInterface, DynamicFormInterface } from "../models/dynamic-fields";
import "./resource-create-wizard.scss";

/**
 * Prop types of the `ResourceCreateWizard` component.
 */
export interface ResourceCreateWizardPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * Whether the resource creation wizard should be displayed.
     */
    showWizard?: boolean;
    /**
     * Callback triggered when closing the resource creation wizard.
     */
    onClose?: () => void;
    /**
     * Custom validation functions for form validations.
     */
    customValidations?: CustomValidationsFunction;
    /**
     * Custom initialize functions.
     */
    customInitializers?: CustomInitializeFunction;
    /**
     * Definition of the form for the resource creation wizard.
     */
    form: DynamicFormInterface;
    /**
     * Wizard guide as an array of strings.
     */
    guide: string[],
    /**
     * Initial values for the form fields.
     */
    initialFormValues: Record<string, any>;
    /**
     * Identifier of the extension template.
     */
    templateId: string;
    /**
     * Name of the extension template.
     */
    templateName: string;
    /**
     * Description of the extension template.
     */
    templateDescription: string;
    /**
     * Template payload values.
     */
    templatePayload: Record<string, any>;
    /**
     * i18n key of the form main button text.
     */
    buttonText: string;
    /**
     * Function to handle form submission.
     */
    onFormSubmit: (values: Record<string, any>, callback: () => void) => void;
}

/**
 * Dynamic resource create wizard component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ResourceCreateWizard: FunctionComponent<ResourceCreateWizardPropsInterface> = (
    props: ResourceCreateWizardPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        form,
        initialFormValues,
        showWizard,
        templateId,
        templateName,
        templateDescription,
        templatePayload,
        guide,
        buttonText,
        customValidations,
        customInitializers,
        onClose,
        ...rest
    } = props;

    const { validate } = useValidationHandlers(customValidations);
    const { initialize } = useInitializeHandlers(customInitializers);
    const [ alert, setAlert, notification ] = useWizardAlert();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ installGuideActivePage, setInstallGuideActivePage ] = useState<number>(1);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Moderate the initially provided data for the form.
     */
    const formInitialValues: Record<string, any> = useMemo(async () => {
        if (!initialFormValues) {
            return null;
        }

        let initialValues: Record<string, any>;

        if (form?.submitDefinedFieldsOnly) {
            const paths: string[] = form?.fields?.map((field: DynamicFieldInterface) => field?.name);

            initialValues = pick(initialFormValues, paths);
        } else {
            initialValues = cloneDeep(initialFormValues);
        }

        await initialize(initialValues, form?.fields, templatePayload);

        /**
         * Template ID must be submitted when creating the application.
         */
        if (!initialValues?.templateId) {
            initialValues.templateId = initialFormValues?.templateId;
        }

        return initialValues;
    }, [ initialFormValues ]);

    /**
     * This function will navigate the user to the notification message if there are any errors.
     */
    const scrollToNotification = () => {
        document.getElementById("notification-div")?.scrollIntoView({ behavior: "smooth" });
    };

    /**
     * Callback function triggered when clicking the form submit button.
     *
     * @param values - Submission values from the form fields.
     */
    const onSubmit = (values: Record<string, any>): void => {
        setIsSubmitting(true);
        const formValues: Record<string, any> = cloneDeep(values);

        /**
         * Make sure that cleared text fields are set to an empty string.
         */
        form?.fields?.forEach((field: DynamicFieldInterface) => {
            if (!has(formValues, field?.name)) {
                const initialValue: any = get(formInitialValues, field?.name);

                if (initialValue && typeof initialValue === "string") {
                    set(formValues, field?.name, "");
                }
            }
        });

        // Moderate Values to match API restrictions.
        if (formValues?.inboundProtocolConfiguration?.oidc?.callbackURLs) {
            formValues.inboundProtocolConfiguration.oidc.callbackURLs = buildCallBackUrlsWithRegExp(
                formValues.inboundProtocolConfiguration.oidc.callbackURLs
            );
        }

        createApplication(formValues)
            .then((response: AxiosResponse) => {
                eventPublisher.compute(() => {
                    eventPublisher.publish("application-register-new-application", {
                        type: templateData?.id
                    });
                });

                dispatch(
                    addAlert({
                        description: t(
                            "applications:notifications." +
                            "addApplication.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "applications:notifications." +
                            "addApplication.success.message"
                        )
                    })
                );

                const location: string = response.headers.location;
                const createdAppID: string = location.substring(location.lastIndexOf("/") + 1);

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
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "applications:notifications." +
                            "addApplication.error.message"
                        )
                    });
                    scrollToNotification();

                    return;
                }

                setAlert({
                    description: t(
                        "applications:notifications." +
                        "addApplication.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "applications:notifications." +
                        "addApplication.genericError.message"
                    )
                });
                scrollToNotification();
            })
            .finally(() => setIsSubmitting(false));
    };

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    return (
        <ModalWithSidePanel
            open={ showWizard }
            className="wizard resource-create-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ componentId }
            onClose={ onClose }
            { ...rest }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { templateName }
                    <Heading as="h6">{ templateDescription }</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    {
                        !formInitialValues
                            ? <ContentLoader />
                            : (
                                <>
                                    { alert && (
                                        <Grid>
                                            <Grid.Row columns={ 1 } id="notification-div">
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                                    { notification }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    ) }
                                    <FinalForm
                                        initialValues={ formInitialValues }
                                        onSubmit={ onSubmit }
                                        mutators={ {
                                            setFormAttribute: (
                                                [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                                                state: MutableState<
                                                    Record<string, any>,
                                                    Record<string, any>
                                                >,
                                                { changeValue }: Tools<
                                                    Record<string, any>,
                                                    Record<string, any>
                                                >
                                            ) => {
                                                changeValue(state, fieldName, () => fieldVal);
                                            }
                                        } }
                                        validate={
                                            (formValues: Record<string, any>) => validate(formValues, form?.fields)
                                        }
                                        render={ ({ form: formState, handleSubmit }: FormRenderProps) => {
                                            formSubmit = handleSubmit;

                                            return (
                                                <form id={ `${templateId}-form` } onSubmit={ handleSubmit }>
                                                    <Grid>
                                                        { form?.fields.map(
                                                            (field: DynamicFieldInterface) => {
                                                                if (field?.hidden) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <Grid.Row
                                                                        key={ field?.id }
                                                                        columns={ 1 }
                                                                        className=
                                                                            "resource-create-wizard-dynamic-fields"
                                                                    >
                                                                        <Grid.Column
                                                                            mobile={ 16 }
                                                                            tablet={ 16 }
                                                                            computer={ 14 }
                                                                        >
                                                                            <ApplicationFormDynamicField
                                                                                field={ field }
                                                                                form={ formState }
                                                                            />
                                                                        </Grid.Column>
                                                                    </Grid.Row>
                                                                );
                                                            })
                                                        }
                                                    </Grid>
                                                </form>
                                            );
                                        } }
                                    />
                                </>
                            )
                    }
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => formSubmit(e) }
                                    floated="right"
                                    data-componentid={ `${componentId}-create-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t(buttonText) }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { guide && (
                <ModalWithSidePanel.SidePanel>
                    <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                        <div className="help-panel-header-text">
                            { t("applications:wizards.minimalAppCreationWizard.help.heading") }
                        </div>
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content className="installation-guide-content">
                        { Array.isArray(guide) && (
                            <>
                                <Markdown
                                    source={ guide[installGuideActivePage - 1] }
                                />
                                { guide.length > 1 && (
                                    <div className="installation-guide-stepper">
                                        <div className="installation-guide-stepper-progress">
                                            <Typography variant="body3">
                                                Page { installGuideActivePage } of{ " " }
                                                { guide.length }
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    (installGuideActivePage / guide.length) * 100
                                                }
                                            />
                                        </div>
                                        <Pagination
                                            siblingCount={ 0 }
                                            boundaryCount={ 0 }
                                            count={ guide.length }
                                            variant="outlined"
                                            shape="rounded"
                                            className="installation-guide-stepper-pagination"
                                            onChange={ (_: ChangeEvent, page: number) => {
                                                setInstallGuideActivePage(page);
                                            } }
                                        />
                                    </div>
                                ) }
                            </>
                        ) }
                    </ModalWithSidePanel.Content>
                </ModalWithSidePanel.SidePanel>
            ) }
        </ModalWithSidePanel>
    );
};

/**
 * Default props for the resource creation wizard.
 */
ResourceCreateWizard.defaultProps = {
    "data-componentid": "resource-create-wizard"
};
