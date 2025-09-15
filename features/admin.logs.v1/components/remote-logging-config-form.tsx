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

import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Grid from "@oxygen-ui/react/Grid";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CheckboxFieldAdapter, FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form/src";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    Heading
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError } from "axios";
import startCase from "lodash-es/startCase";
import toLower from "lodash-es/toLower";
import React, { ReactElement, useState } from "react";
import { FormRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import restoreRemoteLogPublishingConfiguration from "../api/restore-remote-log-publishing-configuration";
import updateRemoteLogPublishingConfiguration from "../api/update-remote-log-publishing-configuration";
import useTestRemoteLogPublishingConfiguration from "../api/use-test-log-publishing-configuration";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/remote-log-publishing";
import "./remote-logging-config-form.scss";

/**
 * Props interface of {@link RemoteLoggingConfigForm}
 */
export interface RemoteLoggingConfigFormProps extends IdentifiableComponentInterface {
    /**
     * Log type such as `AUDIT`, `DEBUG`, etc.
     */
    logType: LogType;
    /**
     * Remote logging configuration such as `remoteUrl`, `connectTimeoutMillis`, etc.
     */
    initialData: RemoteLogPublishingConfigurationInterface;
    /**
     * Remote log publishing configs loading.
     */
    isLoading: boolean,
    /**
     * Callback to mutate the remote logging request.
     */
    mutateRemoteLoggingRequest: () => void;
}

/**
 * Component to hold the remote logging configurations.
 *
 * @param props - Props injected to the component.
 * @returns Remote logging component.
 */
export const RemoteLoggingConfigForm = ({
    logType,
    initialData,
    mutateRemoteLoggingRequest,
    isLoading,
    "data-componentid": componentId = "remote-logging-config-form"
}: RemoteLoggingConfigFormProps): ReactElement => {

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ testNow, setTestNow ] = useState(false);

    const { isLoading: isTesting, mutate: mutateTest } =
        useTestRemoteLogPublishingConfiguration(testNow, logType);

    const handleRemoteLoggingConfigUpdate = (remoteLogPublishConfig: RemoteLogPublishingConfigurationInterface) => {

        if (!remoteLogPublishConfig.connectTimeoutMillis) {
            remoteLogPublishConfig.connectTimeoutMillis = 1000;
        }
        remoteLogPublishConfig.logType = logType;
        updateRemoteLogPublishingConfiguration(
            remoteLogPublishConfig, !initialData || Object.keys(initialData).length === 0)
            .then((): void => {
                mutateRemoteLoggingRequest();
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing.notification.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.success.message"
                        )
                    })
                );
            })
            .catch((_err: AxiosError) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.error.updateError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.error.updateError.message"
                        )
                    })
                );
            });
    };

    const restoreDefaultRemoteLoggingConfiguration = (): void => {
        restoreRemoteLogPublishingConfiguration(logType)
            .then((): void => {
                setShowDeleteConfirmationModal(false);
                mutateRemoteLoggingRequest();
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing.notification.success." +
                            "description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.success.message"
                        )
                    })
                );
            })
            .catch((_err: AxiosError) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.error.updateError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.serverConfigs.remoteLogPublishing." +
                            "notification.error.updateError.message"
                        )
                    })
                );
            });
    };

    const handleTestNow = (): void => {
        setTestNow(true);
        mutateTest();
    };

    /**
     * Validates the configuration form values and returns any validation errors.
     *
     * @param values - The form values to validate.
     * @returns An object containing validation errors, if any.
     */
    const validateForm = (
        values: RemoteLogPublishingConfigurationInterface
    ): Partial<RemoteLogPublishingConfigurationInterface> => {
        const errors: Partial<RemoteLogPublishingConfigurationInterface> = {};

        if (!values.url) {
            errors.url = t("console:manage.features.serverConfigs." +
                "remoteLogPublishing.fields.remoteURL.error.required");
        } else if (!FormValidation.url(values.url.toString())) {
            errors.url = t("console:manage.features.serverConfigs." +
                "remoteLogPublishing.fields.remoteURL.error.invalid");
        }

        if (!values.publishInterval) {
            errors.publishInterval = t("console:manage.features.serverConfigs." +
                "remoteLogPublishing.fields.publishInterval.error.required");
        } else if (parseInt(values.publishInterval.toString()) < 15) {
            errors.publishInterval = t("console:manage.features.serverConfigs." +
                "remoteLogPublishing.fields.publishInterval.error.invalid");
        }

        if (values.connectTimeoutMillis && (parseInt(values.connectTimeoutMillis.toString()) < 1000 ||
            parseInt(values.connectTimeoutMillis.toString()) > 60000)) {
            errors.connectTimeoutMillis =  t(
                "console:manage.features.serverConfigs.remoteLogPublishing." +
                "fields.advanced.connectionTimeout.error.invalid");
        }

        return errors;
    };

    if (isLoading) {
        return (
            <Card className="remote-logging-content">
                <div className="remote-logging-form">
                    <Stack direction="column" spacing={ 2 }>
                        <Skeleton variant="rectangular" height={ 7 } width="30%"/>
                        <Skeleton variant="rectangular" height={ 28 }/>
                        <Skeleton variant="rectangular" height={ 7 } width="90%"/>
                        <Skeleton variant="rectangular" height={ 7 }/>
                    </Stack>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card className="remote-logging-content">
                <div className="remote-logging-form">
                    <Grid xs={ 12 } md={ 8 } lg={ 4 }>
                        <FinalForm
                            onSubmit={ (values: RemoteLogPublishingConfigurationInterface) =>
                                handleRemoteLoggingConfigUpdate(values) }
                            data-componentid={ `${componentId}-${logType}` }
                            initialValues={ initialData }
                            validate={ validateForm }
                            render={ ({ handleSubmit }: FormRenderProps) => (
                                <form onSubmit={ handleSubmit }>
                                    <FinalFormField
                                        key="url"
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        width={ 16 }
                                        className="text-field-container"
                                        ariaLabel="url"
                                        required={ true }
                                        data-componentid={ `${componentId}-url` }
                                        name="url"
                                        type="text"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.remoteURL.label") }
                                        placeholder={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.remoteURL.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                    <FinalFormField
                                        key="publishInterval"
                                        width={ 16 }
                                        className="text-field-container form-field-margin-top"
                                        ariaLabel="publishInterval"
                                        required={ true }
                                        data-componentid={ `${componentId}-publishInterval` }
                                        name="publishInterval"
                                        type="number"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.publishInterval.label") }
                                        placeholder={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.publishInterval.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        minValue={ 15 }
                                        maxValue={ 1440 }
                                    />
                                    <FinalFormField
                                        key="connectTimeoutMillis"
                                        width={ 16 }
                                        className="text-field-container form-field-margin-top"
                                        ariaLabel="connectTimeoutMillis"
                                        data-componentid={ `${componentId}-connectTimeoutMillis` }
                                        name="connectTimeoutMillis"
                                        type="number"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.connectionTimeout.label") }
                                        placeholder={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.connectionTimeout.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        minValue={ 1000 }
                                        maxValue={ 60000 }
                                    />
                                    <FinalFormField
                                        data-componentid={ `${componentId}-verifyHostname` }
                                        name="verifyHostname"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.verifyHostname.label") }
                                        component={ CheckboxFieldAdapter }
                                    />
                                    <Heading as="h5" bold="500">
                                        { t("console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                                            "advanced.basicAuthConfig.title") }
                                    </Heading>
                                    <FinalFormField
                                        key="username"
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        width={ 16 }
                                        className="text-field-container form-field-margin-top"
                                        ariaLabel="username"
                                        required={ false }
                                        data-componentid={ `${componentId}-username` }
                                        name="username"
                                        type="text"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.basicAuthConfig." +
                                            "serverUsername.label") }
                                        placeholder={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.basicAuthConfig." +
                                            "serverUsername.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                    <FinalFormField
                                        key="password"
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        width={ 16 }
                                        className="text-field-container form-field-margin-top"
                                        ariaLabel="password"
                                        required={ false }
                                        data-componentid={ `${componentId}-password` }
                                        name="password"
                                        type="password"
                                        label={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.basicAuthConfig." +
                                            "serverPassword.label") }
                                        placeholder={ t("console:manage.features.serverConfigs." +
                                            "remoteLogPublishing.fields.advanced.basicAuthConfig." +
                                            "serverPassword.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                    <Button
                                        size="medium"
                                        variant="contained"
                                        onClick={ handleSubmit }
                                        className={ "button-container form-field-margin-top" }
                                        data-componentid={ `${componentId}-submit-button` }
                                        loading={ isLoading }
                                    >
                                        { t("common:update") }
                                    </Button>
                                    <Button
                                        size="medium"
                                        variant="contained"
                                        onClick={ handleTestNow }
                                        className={ "button-container form-field-margin-top form-field-margin-left" }
                                        data-componentid={ `${componentId}-test-button` }
                                        loading={ isTesting }
                                        disabled={ !initialData || Object.keys(initialData).length === 0 }
                                    >
                                        { t("console:manage.features.serverConfigs.remoteLogPublishing." +
                                            "testButtonText") }
                                    </Button>
                                </form>
                            ) }
                        />
                    </Grid>
                </div>
            </Card>
            <DangerZoneGroup sectionHeader={ t("applications:dangerZoneGroup.header") }>
                <DangerZone
                    isButtonDisabled={ !initialData || Object.keys(initialData).length === 0 }
                    data-componentid={ `${componentId}-danger-zone` }
                    actionTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.title", {
                        logType: startCase(toLower(logType))
                    }) }
                    buttonText={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.button") }
                    header={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.header", {
                        logType: startCase(toLower(logType))
                    }) }
                    subheader={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.subheader", {
                        logType: toLower(logType)
                    }) }
                    onActionClick={ (): void => {
                        setShowDeleteConfirmationModal(true);
                    } }
                />
            </DangerZoneGroup>
            <ConfirmationModal
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                assertionHint={ t(
                    "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." + "confirmation.hint"
                ) }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowDeleteConfirmationModal(false);
                } }
                onPrimaryActionClick={ (): void => restoreDefaultRemoteLoggingConfiguration() }
                data-componentid={ "remote-logging-delete-confirmation-modal" }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-componentid={ "remote-logging-delete-confirmation-modal-header" }>
                    { t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ "remote-logging-delete-confirmation-modal-message" }
                >
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.message",
                        {
                            logType: toLower(logType)
                        }
                    ) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-componentid={ "remote-logging-delete-confirmation-modal-content" }>
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.content",
                        {
                            logType: toLower(logType)
                        }
                    ) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

export default RemoteLoggingConfigForm;
