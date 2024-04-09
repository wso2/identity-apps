/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, EmphasizedSegment, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, FinalForm } from "@wso2is/form";
import {
    AppConstants,
    history,
} from "../../admin-core-v1";
import { useGetDCRConfigurations } from "../api/use-get-dcr-configurations";
import { updateDCRConfigurations } from "../api/applications-settings";
import { AxiosError } from "axios";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { getOIDCApplicationConfigurations } from "../api/application";

/**
 * Proptypes for the applications settings form component.
 */
interface ApplicationsSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the mandateSSA enabled.
     */
    mandateSSA?: boolean;
    /**
     * Is the requireAuthentication enabled.
     */
    authenticationRequired?: boolean;
    /**
     * JWKS Endpoint Url.
     */
    ssaJwks?: string;
    /**
     * DCR Endpoint Url.
     */
    dcrEndpoint?: string;
    /**
     * Is fapi complience enforced for the dcr apps.
     */
    enableFapiEnforcement?:boolean
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form values interface.
 */
export interface ApplicationsSettingsFormValuesInterface {
    /**
     * Is the mandateSSA enabled.
     */
    mandateSSA?: boolean;
    /**
     * Is the requireAuthentication enabled.
     */
    authenticationRequired?: boolean;
    /**
     * JWKS Endpoint Url.
     */
    ssaJwks?: string;
    /**
     * Is fapi complience enforced for the dcr apps.
     */
    enableFapiEnforcement?:boolean
}

/**
 * Proptypes for the applications settings form error messages.
 */
export interface ApplicationsSettingsFormErrorValidationsInterface {
    /**
     *  Error message for the JWKS URL.
     */
    ssaJwks?: string;
}

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
        isSubmitting,
        ["data-componentid"]: componentId 
    } = props;
   
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ isAuthenticationRequired = true , setAuthenticationRequired ] = useState<boolean>(authenticationRequired);
    const [ isMandateSSA = !isAuthenticationRequired, setMandateSSA ] = useState<boolean>(mandateSSA);
    const [ isEnableFapiEnforcement, setEnableFapiEnforcement ] = useState<boolean>(enableFapiEnforcement);
    const [ ssaJwksState, setSsaJwks ] = useState<string>(ssaJwks);
    const [ dcrEndpointState, setDCREndpoint ] = useState<string>(dcrEndpoint);


    const {
        data: dcrConfigs,
        isLoading: isDCRConfigsFetchRequestLoading,
        error: getDCRConfigsError,
        mutate: mutateApplicationListFetchRequest
    } = useGetDCRConfigurations();

    // set initial values
    useEffect(() => {
        if (dcrConfigs) {
            setMandateSSA(dcrConfigs?.mandateSSA);
            setAuthenticationRequired(dcrConfigs?.authenticationRequired);
            setEnableFapiEnforcement(dcrConfigs?.enableFapiEnforcement);
            setSsaJwks(dcrConfigs?.ssaJwks);
        }
    }, [ dcrConfigs ]);

    useEffect(() => {
        if (dcrEndpoint !== undefined) {
            return;
        }

        // Fetch the server endpoints for OIDC applications.
        getOIDCApplicationConfigurations()
            .then((response) => {
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

    const resolveConnectorUpdateErrorMessage = (error: AxiosError): string => {
        
        return (
            t("console:develop.pages.applicationsSettings.notifications.error.description",
                { description: error.response.data.description })
        );
    };

    const handleUpdateError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: resolveConnectorUpdateErrorMessage(error),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.pages.applicationsSettings.notifications.error.message"
                    )
                })
            );
        } else {
            // Generic error message
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
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: ApplicationsSettingsFormValuesInterface) => {
        const updateData: any = [
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
            },
        ];

        if (values.ssaJwks != undefined) {
            updateData.push(
                {
                    operation: "REPLACE",
                    path: "/ssaJwks",
                    value: values.ssaJwks
                }
            )
        }

        updateDCRConfigurations(updateData).then(() => {
            handleUpdateSuccess();
        }).catch((error: AxiosError) => {
            handleUpdateError(error);
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
        <PageLayout
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
                "data-componentid": `${ componentId }-page-back-button`,
                onClick:  handleBackButtonClick,
                text: t("console:develop.pages.applicationsSettings.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    // ref={ "ref" }
                    uncontrolledForm={ false }
                    
                    onSubmit={ (values: ApplicationsSettingsFormValuesInterface) => {
                        updateConfigurations(values);
                    } }
                    initialValues={ {
                        ssaJwks: ssaJwksState,
                        authenticationRequired: isAuthenticationRequired,
                        mandateSSA: isMandateSSA,
                        enableFapiEnforcement: isEnableFapiEnforcement,
                        dcrEndpoint: dcrEndpointState

                    } }
                    validate={ validateForm }
                    data-componentid={ `${ componentId }-form` }
                >
                
                    <Field.Input
                        ariaLabel="DCR Endpoint"
                        inputType="text"
                        name="dcrEndpoint"
                        label={ t("applications:forms.applicationsSettings.fields.dcrEndpoint.label") }
                        placeholder={ t("applications:forms.applicationsSettings.fields.dcrEndpoint.placeholder") }
                        hint={ t("applications:forms.applicationsSettings.fields.dcrEndpoint.hint") }
                        required={ false }
                        readOnly={ true }
                        maxLength={ 150 }
                        minLength={ 10 }
                        width={ 16 }
                        listen={ null }
                        data-componentid={ `${componentId}-dcr-endpoint-url` }
                    />
                    <Field.Checkbox
                        ariaLabel="Require Authentication"
                        name="authenticationRequired"
                        label={ t("applications:forms.applicationsSettings.fields.authenticationRequired.label") }
                        hint={ (
                            <>
                                { t("applications:forms.applicationsSettings.fields.authenticationRequired.hint") }
                                <DocumentationLink
                                    link={ getLink("develop.applications.applicationsSettings.dcr.authenticationRequired.learnMore") }
                                >
                                    { t("console:develop.pages.applicationsSettings.learnMore") }
                                </DocumentationLink>
                            </>
                        ) }
                        tabIndex={ 3 }
                        width={ 16 }
                        listen={ 
                            function (value: boolean) {
                                setAuthenticationRequired(value);
                                if (!value) {
                                    setMandateSSA(true);
                                }
                            }
                        }
                        data-componentid={ `${ componentId }-authenticationRequired-checkbox` }
                    />
                    <Field.Checkbox
                        ariaLabel="Mandate SSA"
                        name="mandateSSA"
                        label={ t("applications:forms.applicationsSettings.fields.mandateSSA.label") }
                        hint={ t("applications:forms.applicationsSettings.fields.mandateSSA.hint") }
                        tabIndex={ 3 }
                        width={ 16 }
                        data-testid={ `${ componentId }-applications-settings-mandateSSA-checkbox` }
                        readOnly={ !isAuthenticationRequired }
                        listen={ (value: boolean) => setMandateSSA(value) }
                        data-componentid={ `${ componentId }-mandateSSA-checkbox` }
                    />
                    <Field.Input
                        ariaLabel="JWKS Endpoint "
                        inputType="url"
                        name="ssaJwks"
                        label={ t("applications:forms.applicationsSettings.fields.ssaJwks.label") }
                        placeholder={ t("applications:forms.applicationsSettings.fields.ssaJwks.placeholder") }
                        hint={ t("applications:forms.applicationsSettings.fields.ssaJwks.hint") }
                        required={ isMandateSSA || !isAuthenticationRequired}
                        maxLength={ 150 }
                        minLength={ 10 }
                        width={ 16 }
                        data-componentid={ `${ componentId }-ssaJwks-checkbox` }
                    />
                    <Field.Checkbox
                        ariaLabel="Enforce Fapi"
                        name="enableFapiEnforcement"
                        label={ t("applications:forms.applicationsSettings.fields.enforceFapi.label")}
                        hint={ t("applications:forms.applicationsSettings.fields.enforceFapi.hint") }
                        tabIndex={ 3 }
                        width={ 16 }
                        listen={ (value: boolean) => setEnableFapiEnforcement(value) }
                        data-componentid={ `${ componentId }-enableFapiEnforcement-checkbox` }
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
                        hidden={ null }
                        data-componentid={ `${ componentId }-submit-button` }
                    />
                </Form>
            </EmphasizedSegment>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationsSettingsForm.defaultProps = {
    "data-componentid": "applications-settings-page"
};

export default ApplicationsSettingsForm;
