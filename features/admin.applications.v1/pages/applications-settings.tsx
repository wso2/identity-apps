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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    PageLayout,
    useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    AppConstants,
    history
} from "../../admin.core.v1";
import { getOIDCApplicationConfigurations } from "../api/application";
import { updateDCRConfigurations } from "../api/applications-settings";
import { useGetDCRConfigurations } from "../api/use-get-dcr-configurations";
import { OIDCApplicationConfigurationInterface } from "../models/application";
import { ApplicationsSettingsFormErrorValidationsInterface,
    ApplicationsSettingsFormValuesInterface,
    ApplicationsSettingsPropsInterface,
    DCRConfigUpdateType } from "../models/applications-settings";

const FORM_ID: string = "applications-settings";

/**
 * Form to edit applications settings.
 *
 * @param props - Props injected to the component.
 * @returns Functional Component.
 */
export const ApplicationsSettingsForm: FunctionComponent<ApplicationsSettingsPropsInterface> = (
    props: ApplicationsSettingsPropsInterface
): ReactElement => {

    const {
        mandateSSA,
        authenticationRequired,
        ssaJwks,
        dcrEndpoint,
        enableFapiEnforcement,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ isAuthenticationRequired = true, setAuthenticationRequired ] = useState<boolean>(authenticationRequired);
    const [ isMandateSSA = !isAuthenticationRequired, setMandateSSA ] = useState<boolean>(mandateSSA);
    const [ isEnableFapiEnforcement, setEnableFapiEnforcement ] = useState<boolean>(enableFapiEnforcement);
    const [ ssaJwksState, setSsaJwks ] = useState<string>(ssaJwks);
    const [ dcrEndpointState, setDCREndpoint ] = useState<string>(dcrEndpoint);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(undefined);

    /**
     * Get initial DCR Configurations.
     */
    const {
        data: dcrConfigs,
        error: getDCRConfigsRequestError,
        isLoading: isGetDCRConfigsRequestLoading
    } = useGetDCRConfigurations();

    /**
     * Sets the internal state of the application loading status when the SWR `isLoading` state changes.
     */
    useEffect(() => {
        setIsLoading(isGetDCRConfigsRequestLoading);
    }, [ isGetDCRConfigsRequestLoading ]);

    /**
     * Set initial values for the form.
     */
    useEffect(() => {
        if (dcrConfigs) {
            setMandateSSA(dcrConfigs?.mandateSSA);
            setAuthenticationRequired(dcrConfigs?.authenticationRequired);
            setEnableFapiEnforcement(dcrConfigs?.enableFapiEnforcement);
            setSsaJwks(dcrConfigs?.ssaJwks);
        }
    }, [ dcrConfigs ]);

    /**
     * Handles the DCR Configurations GET request error.
     */
    useEffect(() => {
        if (!getDCRConfigsRequestError) {
            return;
        }

        if (getDCRConfigsRequestError.response?.data?.description) {
            dispatch(addAlert({
                description: getDCRConfigsRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:develop.pages.applicationsSettings.notifications.genericError.message")
            }));

            return;
        }

        dispatch(addAlert(addAlert({
            description: t(
                "console:develop.pages.applicationsSettings.notifications.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: t(
                "console:develop.pages.applicationsSettings.notifications.genericError.message"
            )
        })));
    }, [ getDCRConfigsRequestError ]);

    /**
     * Fetch DCR endpoint from the OIDCApplicationConfigurations.
     */
    useEffect(() => {
        if (dcrEndpoint !== undefined) {
            return;
        }

        getOIDCApplicationConfigurations()
            .then((response: OIDCApplicationConfigurationInterface) => {
                setDCREndpoint(response.dynamicClientRegistrationEndpoint);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.fetchOIDCIDPConfigs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchOIDCIDPConfigs.genericError.message")
                }));
            });
    });

    /**
     * Handles the success scenario of the update.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("jwtPrivateKeyConfiguration:notifications.success.description"),
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
    const updateConfigurations = (values: ApplicationsSettingsFormValuesInterface) => {
        setIsSubmitting(true);
        const updateData: Array<DCRConfigUpdateType> = [
            {
                operation: "REPLACE",
                path: "/authenticationRequired",
                value: values.authenticationRequired
            },
            {
                operation: "REPLACE",
                path: "/enableFapiEnforcement",
                value: values.enableFapiEnforcement
            },
            {
                operation: "REPLACE",
                path: "/mandateSSA",
                value: values.mandateSSA
            }
        ];

        if (values.ssaJwks != undefined) {
            updateData.push(
                {
                    operation: "REPLACE",
                    path: "/ssaJwks",
                    value: values.ssaJwks
                }
            );
        }

        updateDCRConfigurations(updateData)
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

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: ApplicationsSettingsFormValuesInterface):
        ApplicationsSettingsFormErrorValidationsInterface => {

        const errors: ApplicationsSettingsFormErrorValidationsInterface = {
            ssaJwks: undefined
        };

        if (isMandateSSA && !values.ssaJwks) {
            errors.ssaJwks = t("applications:forms.applicationsSettings.fields.ssaJwks.validations.empty");
        }

        return errors;
    };

    /**
     * This handles back button navigation
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    return (
        !isLoading ?
            (<PageLayout
                title={ t("console:develop.pages.applicationsSettings.title") }
                description={ (
                    <>
                        { t("console:develop.pages.applicationsSettings.subTitle") }
                        <DocumentationLink
                            link={ getLink("develop.applications.applicationsSettings.dcr.learnMore") }
                        >
                            { t("console:develop.pages.applicationsSettings.learnMore") }
                        </DocumentationLink>
                    </>
                ) }
                backButton={ {
                    "data-componentid": `${componentId}-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.applicationsSettings.backButton")
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
                        onSubmit={ (values: ApplicationsSettingsFormValuesInterface) => {
                            updateConfigurations(values);
                        } }
                        initialValues={ {
                            authenticationRequired: isAuthenticationRequired,
                            dcrEndpoint: dcrEndpointState,
                            enableFapiEnforcement: isEnableFapiEnforcement,
                            mandateSSA: isMandateSSA,
                            ssaJwks: ssaJwksState
                        } }
                        validate={ validateForm }
                        data-componentid={ `${componentId}-form` }
                    >

                        <Field.Input
                            ariaLabel="DCR Endpoint"
                            inputType="text"
                            name="dcrEndpoint"
                            label={ t("applications:forms.applicationsSettings.fields.dcrEndpoint.label") }
                            hint={ t("applications:forms.applicationsSettings.fields.dcrEndpoint.hint") }
                            required={ false }
                            readOnly={ true }
                            maxLength={ 150 }
                            minLength={ 10 }
                            width={ 16 }
                            listen={ null }
                            data-componentid={ `${componentId}-dcr-endpoint-url` }
                        >
                            <CopyInputField
                                value={ dcrEndpointState }
                            />
                        </Field.Input>
                        <Field.Checkbox
                            ariaLabel="Require Authentication"
                            name="authenticationRequired"
                            label={ t("applications:forms.applicationsSettings.fields.authenticationRequired.label") }
                            hint={ (
                                <>
                                    { t("applications:forms.applicationsSettings.fields.authenticationRequired.hint") }
                                    <DocumentationLink
                                        link={ getLink("develop.applications.applicationsSettings.dcr" +
                                        ".authenticationRequired.learnMore") }
                                    >
                                        { t("console:develop.pages.applicationsSettings.learnMore") }
                                    </DocumentationLink>
                                </>
                            ) }
                            tabIndex={ 3 }
                            width={ 16 }
                            listen={ (value: boolean) => {
                                setAuthenticationRequired(value);
                                if (!value) {
                                    setMandateSSA(true);
                                }
                            }
                            }
                            data-componentid={ `${componentId}-authenticationRequired-checkbox` }
                        />
                        <Field.Checkbox
                            ariaLabel="Mandate SSA"
                            name="mandateSSA"
                            label={ t("applications:forms.applicationsSettings.fields.mandateSSA.label") }
                            hint={ t("applications:forms.applicationsSettings.fields.mandateSSA.hint") }
                            tabIndex={ 3 }
                            width={ 16 }
                            readOnly={ !isAuthenticationRequired }
                            listen={ (value: boolean) => setMandateSSA(value) }
                            data-componentid={ `${componentId}-mandateSSA-checkbox` }
                        />
                        <Field.Input
                            ariaLabel="JWKS Endpoint"
                            inputType="url"
                            name="ssaJwks"
                            label={ t("applications:forms.applicationsSettings.fields.ssaJwks.label") }
                            placeholder={ t("applications:forms.applicationsSettings.fields.ssaJwks.placeholder") }
                            hint={ t("applications:forms.applicationsSettings.fields.ssaJwks.hint") }
                            required={ isMandateSSA || !isAuthenticationRequired }
                            maxLength={ 150 }
                            minLength={ 10 }
                            width={ 16 }
                            data-componentid={ `${componentId}-ssaJwks-checkbox` }
                        />
                        <Field.Checkbox
                            ariaLabel="Enforce Fapi"
                            name="enableFapiEnforcement"
                            label={ t("applications:forms.applicationsSettings.fields.enforceFapi.label") }
                            hint={ t("applications:forms.applicationsSettings.fields.enforceFapi.hint") }
                            tabIndex={ 3 }
                            width={ 16 }
                            listen={ (value: boolean) => setEnableFapiEnforcement(value) }
                            data-componentid={ `${componentId}-enableFapiEnforcement-checkbox` }
                        />
                        <Field.Button
                            form={ FORM_ID }
                            size="small"
                            buttonType="primary_btn"
                            ariaLabel="DCR Configuration update button"
                            name="update-button"
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                            label={ t("common:update") }
                            data-componentid={ `${componentId}-submit-button` }
                        />
                    </Form>
                </EmphasizedSegment>
            </PageLayout>) :
            (
                <EmphasizedSegment padded="very">
                    <ContentLoader inline="centered" active />
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for the component.
 */
ApplicationsSettingsForm.defaultProps = {
    "data-componentid": "applications-settings-page"
};

export default ApplicationsSettingsForm;
