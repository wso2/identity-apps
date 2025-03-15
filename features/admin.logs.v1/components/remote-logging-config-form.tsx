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

import Card from "@oxygen-ui/react/Card";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import startCase from "lodash-es/startCase";
import toLower from "lodash-es/toLower";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import restoreRemoteLogPublishingConfigurationByLogType from
    "../api/restore-remote-log-publishing-configuration-by-log-type";
import updateRemoteLogPublishingConfigurationByLogType from
    "../api/update-remote-log-publishing-configuration-by-log-type";
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
    logConfigData: RemoteLogPublishingConfigurationInterface;
    /**
     * Remote log publishing configs loading.
     */
    isLoading: boolean,
    /**
     * Errpr fetching log config.
     */
    error: AxiosError,
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
    logConfigData,
    mutateRemoteLoggingRequest,
    isLoading,
    error,
    "data-componentid": componentId = "remote-logging-config-form"
}: RemoteLoggingConfigFormProps): ReactElement => {
    const [ isVerifyHostnameEnabled, setVerifyHostnameEnabled ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ logConfig, setLogConfig ] = useState(null);

    const [ resetForm, setResetForm ] = useTrigger();
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ testNow, setTestNow ] = useState(false);

    // Conditionally call the hook when shouldFetch is true
    const { isLoading: isTesting, mutate: mutateTest } =
        useTestRemoteLogPublishingConfiguration(testNow, logType);

    useEffect(() => {
        if (error) {
            return;
        }
        setVerifyHostnameEnabled(logConfigData?.verifyHostname);
        if (logConfigData && (!logConfigData.publishInterval || logConfigData.publishInterval < 15)) {
            logConfigData.publishInterval = 15;
        }
        if (logConfigData && !logConfigData.connectTimeoutMillis) {
            logConfigData.connectTimeoutMillis = 30000;
        }
        setLogConfig(logConfigData);
    }, [ logConfigData, error ]);

    const handleRemoteLoggingConfigUpdate = (values: Map<string, string>) => {
        const remoteLogPublishConfig: RemoteLogPublishingConfigurationInterface = {
            connectTimeoutMillis: values.get("connectTimeoutMillis") ?
                Number.parseInt(values.get("connectTimeoutMillis")) : 30000,
            logType: logType,
            password: values.get("password"),
            publishInterval: Number.parseInt(values.get("publishInterval")),
            url: values.get("remoteUrl"),
            username: values.get("username"),
            verifyHostname: isVerifyHostnameEnabled
        };

        updateRemoteLogPublishingConfigurationByLogType(remoteLogPublishConfig, logConfig === null)
            .then(() => {
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

    const restoreDefaultRemoteLoggingConfiguration = () => {
        restoreRemoteLogPublishingConfigurationByLogType(logType)
            .then(() => {
                setShowDeleteConfirmationModal(false);
                setResetForm();
                setLogConfig(null);
                setVerifyHostnameEnabled(false);
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

    function handleTestNow() {
        setTestNow(true);
        mutateTest();
    }

    return (
        <>
            <Card className="remote-logging-content">
                <div className="remote-logging-form">
                    <Grid xs={ 12 } md={ 8 } lg={ 4 }>
                        <Forms onSubmit={ handleRemoteLoggingConfigUpdate } resetState={ resetForm }>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL.label"
                                ) }
                                name={ "remoteUrl" }
                                required
                                requiredErrorMessage={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL" +
                                    ".remoteURL.error.required"
                                ) }
                                type="text"
                                value={ logConfig?.url }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL" +
                                    ".publishInterval.label"
                                ) }
                                name={ "publishInterval" }
                                type="number"
                                required
                                requiredErrorMessage={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL" +
                                    ".publishInterval.error.required"
                                ) }
                                min="15"
                                value={ logConfig?.publishInterval ?? 15 }
                                data-componentid={ componentId + "-publish-interval-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "connectionTimeout.label"
                                ) }
                                name={ "connectTimeoutMillis" }
                                type="number"
                                min="0"
                                value={ logConfig?.connectTimeoutMillis ?? 30000 }
                                data-componentid={ componentId + "-connection-timeout-input" }
                            />
                            <FormControlLabel
                                classes={ {
                                    label: "form-control-label"
                                } }
                                control={
                                    (<Checkbox
                                        checked={ isVerifyHostnameEnabled }
                                        onChange={ (_event: React.SyntheticEvent, checked: boolean) => {
                                            setVerifyHostnameEnabled(checked);
                                        } }
                                        inputProps={ { "aria-label": "controlled" } }
                                        disableRipple
                                    />)
                                }
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "verifyHostname.label"
                                ) }
                            />
                            <Heading as="h5" bold="500" className="pt-5">
                                { t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "basicAuthConfig.title"
                                ) }
                            </Heading>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "basicAuthConfig.serverUsername.label"
                                ) }
                                name={ "username" }
                                type="text"
                                value={ logConfig?.username }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "basicAuthConfig.serverPassword.label"
                                ) }
                                name={ "password" }
                                hidePassword={ t("common:hidePassword") }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ logConfig?.password }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <div>
                                <PrimaryButton
                                    className="mt-6"
                                    size="small"
                                    type="submit"
                                    data-testid={ "remote-logging-submit-button" }
                                    data-componentid={ "remote-logging-submit-button" }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                                {
                                    !logConfig ? <></> : (<PrimaryButton
                                        className="mt-6"
                                        size="small"
                                        onClick={ handleTestNow }
                                        disabled={ isTesting }
                                        type="button"
                                        data-testid={ "remote-logging-test-button" }
                                        data-componentid={ "remote-logging-test-button" }
                                    >
                                        { "Test" }
                                    </PrimaryButton>)
                                }
                            </div>
                        </Forms>
                    </Grid>
                </div>
            </Card>
            <DangerZoneGroup sectionHeader={ t("applications:dangerZoneGroup.header") }>
                <DangerZone
                    isButtonDisabled={ !logConfig || Object.keys(logConfig).length === 0 }
                    data-componentid={ componentId + "-danger-zone" }
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
                data-testid={ "remote-logging-delete-confirmation-modal" }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-testid={ "remote-logging-delete-confirmation-modal-header" }>
                    { t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-testid={ "remote-logging-delete-confirmation-modal-message" }
                >
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.message",
                        {
                            logType: toLower(logType)
                        }
                    ) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ "remote-logging-delete-confirmation-modal-content" }>
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
