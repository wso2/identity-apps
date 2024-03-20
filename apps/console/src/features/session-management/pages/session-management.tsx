/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { EmphasizedSegment, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../../features/core";
import { updateSessionManagmentConfigurations, useSessionManagementConfig } from "../api/session-management";
import { SessionManagementConstants } from "../constants/session-management";
import {
    PatchData,
    SessionManagementConfigFormErrorValidationsInterface,
    SessionManagementConfigFormValuesInterface
} from "../models/session-management";

/**
 * Props for session management settings page.
 */
type SessionManagementSettingsPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "session-management-config-form";

/**
 * Session management page.
 */
export const SessionManagementSettingsPage: FunctionComponent<SessionManagementSettingsPageInterface> = (
    props: SessionManagementSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes : string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly : boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.governanceConnectors,
        featureConfig?.governanceConnectors?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);

    const dispatch : Dispatch<any> = useDispatch();

    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ sessionManagementConfig , setSessionManagementConfig ] =
        useState<SessionManagementConfigFormValuesInterface>(undefined);

    const {
        data: originalSessionManagementConfig,
        isLoading: isSessionManagementFetchRequestLoading,
        mutate: mutateSessionManagementConfig,
        error: sessionManagementConfigFetchRequestError
    } = useSessionManagementConfig();

    useEffect(() => {
        if (originalSessionManagementConfig instanceof IdentityAppsApiException
            || sessionManagementConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalSessionManagementConfig) {
            return;
        }

        // Validate if the email provider config exists.
        if (originalSessionManagementConfig.idleSessionTimeoutPeriod
            && originalSessionManagementConfig.rememberMePeriod) {
            setSessionManagementConfig({
                idleSessionTimeout: parseInt(originalSessionManagementConfig.idleSessionTimeoutPeriod),
                rememberMePeriod: parseInt(originalSessionManagementConfig.rememberMePeriod)
            });
        }
    }, [ originalSessionManagementConfig ]);

    /**
     * Displays the error banner when unable to fetch session management configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("console:sessionManagement.notifications." +
                "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:sessionManagement.notifications." +
                "getConfiguration.error.message")
            })
        );
    };

    /**
     * Displays the sucess banner when session management configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("console:sessionManagement.notifications." +
                "updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:sessionManagement.notifications." +
                "updateConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to update session management configurations.
     */
    const handleUpdateError = () => {
        dispatch(
            addAlert({
                description: t("console:sessionManagement.notifications." +
                "updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:sessionManagement.notifications." +
                "updateConfiguration.error.message")
            })
        );
    };

    /**
     * Validate input data.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (
        values: SessionManagementConfigFormValuesInterface
    ): SessionManagementConfigFormErrorValidationsInterface => {
        const error: SessionManagementConfigFormErrorValidationsInterface = {
            idleSessionTimeout: undefined,
            rememberMePeriod: undefined
        };

        if (values?.idleSessionTimeout && (!FormValidation.isInteger(values.idleSessionTimeout as number)
            || values.idleSessionTimeout as number < 0)) {
            error.idleSessionTimeout = t(
                "console:sessionManagement.form.validation.idleSessionTimeout"
            );
        }

        if (values?.rememberMePeriod && (!FormValidation.isInteger(values.rememberMePeriod as number)
            || values.rememberMePeriod as number < 0)) {
            error.rememberMePeriod = t(
                "console:sessionManagement.form.validation.rememberMePeriod"
            );
        }


        return error;
    };

    /**
     * Handle session management form submit.
     */
    const handleSubmit = (values: SessionManagementConfigFormValuesInterface) => {
        setIsSubmitting(true);
        const updateValues: PatchData[] = [
            {
                "operation": SessionManagementConstants.REPLACE_OPERATION,
                "path": SessionManagementConstants.IDLE_SESSION_TIMEOUT_PATH,
                "value": values.idleSessionTimeout.toString()
            },
            {
                "operation": SessionManagementConstants.REPLACE_OPERATION,
                "path": SessionManagementConstants.REMEMBER_ME_PERIOD_PATH,
                "value": values.rememberMePeriod.toString()
            }
        ];

        updateSessionManagmentConfigurations(updateValues)
            .then(() => {
                handleUpdateSuccess();
                mutateSessionManagementConfig();
            })
            .catch(() => {
                handleUpdateError();
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * This function returns loading placeholder.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        return (
            <Grid.Row columns={ 1 }>
                <div>
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${componentId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                                <Divider hidden />
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                    <Divider hidden/>
                </div>
            </Grid.Row>
        );
    };

    return (
        <PageLayout
            title={ t("console:sessionManagement.title") }
            pageTitle={ t("console:sessionManagement.title") }
            description={ t("console:sessionManagement.description") }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { isSessionManagementFetchRequestLoading
                                    ? renderLoadingPlaceholder()
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ handleSubmit }
                                                initialValues={ sessionManagementConfig }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                                validate={ validateForm }
                                                autoComplete="new-password"
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 2 } key={ 1 }>
                                                        <Grid.Column key="idleSessionTimeout">
                                                            <Field.Input
                                                                min={ SessionManagementConstants
                                                                    .SESSION_MANAGEMENT_CONFIG_FIELD_MIN_LENGTH }
                                                                ariaLabel="Idle Session Timeout Field"
                                                                inputType="number"
                                                                name="idleSessionTimeout"
                                                                label={ t("console:sessionManagement.form." +
                                                                    "idleSessionTimeout.label") }
                                                                placeholder={ t("console:sessionManagement.form." +
                                                                    "idleSessionTimeout.placeholder") }
                                                                hint={ t("console:sessionManagement.form." +
                                                                    "idleSessionTimeout.hint") }
                                                                required={ true }
                                                                value={ sessionManagementConfig?.idleSessionTimeout }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ null }
                                                                minLength={ SessionManagementConstants
                                                                    .SESSION_MANAGEMENT_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${componentId}-idle-session-timeout` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                        <Grid.Column key="rememberMePeriod">
                                                            <Field.Input
                                                                min={ SessionManagementConstants
                                                                    .SESSION_MANAGEMENT_CONFIG_FIELD_MIN_LENGTH }
                                                                ariaLabel="Remember Me Period Field"
                                                                inputType="number"
                                                                name="rememberMePeriod"
                                                                label={ t("console:sessionManagement.form." +
                                                                    "rememberMePeriod.label") }
                                                                placeholder={ t("console:sessionManagement.form." +
                                                                    "rememberMePeriod.placeholder") }
                                                                hint={ t("console:sessionManagement.form." +
                                                                    "rememberMePeriod.hint") }
                                                                required={ true }
                                                                value={ sessionManagementConfig?.rememberMePeriod }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ null }
                                                                minLength={ SessionManagementConstants
                                                                    .SESSION_MANAGEMENT_CONFIG_FIELD_MIN_LENGTH }
                                                                width={ 16 }
                                                                data-componentid={ `${componentId}-remember-me-period` }
                                                                autoComplete="new-password"
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                            {
                                                !isReadOnly && (
                                                    <>
                                                        <Divider hidden />
                                                        <Grid.Row columns={ 1 } className="mt-6">
                                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                                <PrimaryButton
                                                                    size="small"
                                                                    loading={ isSubmitting }
                                                                    onClick={ () => {
                                                                        formRef?.current?.triggerSubmit();
                                                                    } }
                                                                    ariaLabel="Session management form update button"
                                                                    data-componentid={
                                                                        `${ componentId }-update-button`
                                                                    }
                                                                >
                                                                    { t("common:update") }
                                                                </PrimaryButton>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
SessionManagementSettingsPage.defaultProps = {
    "data-componentid": "session-management-settings-page"
};

export default SessionManagementSettingsPage;
