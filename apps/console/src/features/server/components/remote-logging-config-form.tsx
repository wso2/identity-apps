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

import Checkbox from "@oxygen-ui/react/Checkbox";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import startCase from "lodash-es/startCase";
import toLower from "lodash-es/toLower";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "modules/core/src/models";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    restoreRemoteLogPublishingConfigurationByLogType,
    updateRemoteLogPublishingConfigurationByLogType
} from "../api/server";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/server";

interface RemoteLoggingConfigFormProps extends IdentifiableComponentInterface {
    logType: LogType;
    logConfig: RemoteLogPublishingConfigurationInterface,
    mutateRemoteLoggingRequest: () => void;
}

export const RemoteLoggingConfigForm = (props: RemoteLoggingConfigFormProps): ReactElement => {
    const {
        logType,
        logConfig,
        mutateRemoteLoggingRequest,
        ["data-componentid"]: componentId
    } = props;

    const [ isVerifyHostnameEnabled, setVerifyHostnameEnabled ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const [ resetForm, setResetForm ] = useTrigger();
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const handleRemoteLoggingConfigUpdate = (values: Map<string, string>) => {
        const remoteLogPublishConfig: RemoteLogPublishingConfigurationInterface = {
            connectTimeoutMillis: values.get("connectTimeoutMillis"),
            keystoreLocation: values.get("keystoreLocation"),
            keystorePassword: values.get("keystorePassword"),
            logType: logType,
            password: values.get("password"),
            remoteUrl: values.get("remoteUrl"),
            truststoreLocation: values.get("truststoreLocation"),
            truststorePassword: values.get("truststorePassword"),
            username: values.get("username"),
            verifyHostname: isVerifyHostnameEnabled
        };

        updateRemoteLogPublishingConfigurationByLogType(remoteLogPublishConfig)
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
                        description: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                        "notification.error.updateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                        "notification.error.updateError.message")
                    })
                );
            });
    };

    const restoreDefaultRemoteLoggingConfiguration = () => {
        restoreRemoteLogPublishingConfigurationByLogType(logType)
            .then(() => {
                setShowDeleteConfirmationModal(false);
                setResetForm();
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
                        description: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                        "notification.error.updateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                        "notification.error.updateError.message")
                    })
                );
            });
    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <div className="form-container with-max-width">
                    <Grid xs={ 12 } md={ 8 } lg={ 4 }>
                        <Forms onSubmit={ handleRemoteLoggingConfigUpdate } resetState={ resetForm }>
                            <Field
                                label={ "Destination URL" }
                                name={ "remoteUrl" }
                                required
                                requiredErrorMessage={ "Remote logging destination endpoint URL is missing" }
                                type="text"
                                value={ logConfig?.remoteUrl }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Heading as="h5" bold="500" className="pt-5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "title") }
                            </Heading>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "connectionTimeout.label"
                                ) }
                                name={ "connectTimeoutMillis" }
                                type="number"
                                min="0"
                                value={ logConfig?.connectTimeoutMillis }
                                data-componentid={ componentId + "-connection-timeout-input" }
                            />
                            <FormControlLabel
                                classes={ {
                                    label: "form-control-label"
                                } }
                                control={ (
                                    <Checkbox
                                        checked={ isVerifyHostnameEnabled }
                                        onChange={ (_event: React.SyntheticEvent, checked: boolean) => {
                                            setVerifyHostnameEnabled(checked);
                                        } }
                                        inputProps={ { "aria-label": "controlled" } }
                                        disableRipple
                                    />
                                ) }
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "verifyHostname.label"
                                ) }
                            />
                            <Heading as="h5" bold="500" className="pt-5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "basicAuthConfig.title") }
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
                            <Heading as="h5" bold="500" className="pt-5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.title") }
                            </Heading>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.keystorePath.label"
                                ) }
                                name={ "keystoreLocation" }
                                type="text"
                                value={ logConfig?.keystoreLocation }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.keystorePassword.label"
                                ) }
                                name={ "keystorePassword" }
                                hidePassword={ t("common:hidePassword") }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ logConfig?.keystorePassword }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.truststorePath.label"
                                ) }
                                name={ "truststoreLocation" }
                                type="text"
                                value={ logConfig?.truststoreLocation }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.truststorePassword.label"
                                ) }
                                name={ "truststorePassword" }
                                hidePassword={ t("common:hidePassword") }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ logConfig?.truststorePassword }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <PrimaryButton
                                className="mt-6"
                                size="small"
                                type="submit"
                                data-testid={ "remote-logging-submit-button" }
                                data-componentid={ "remote-logging-submit-button" }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        </Forms>
                    </Grid>
                </div>
            </EmphasizedSegment>
            <Divider hidden />
            <DangerZoneGroup
                sectionHeader={ t("console:develop.features.applications.dangerZoneGroup.header") }
            >
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
                    subheader={
                        t(
                            "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.subheader",  {
                                logType: toLower(logType)
                            }
                        )
                    }
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
                    "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                    "confirmation.hint"
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
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.header"
                    ) }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-testid={ "remote-logging-delete-confirmation-modal-message" }
                >
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.message",  {
                            logType: toLower(logType)
                        }
                    ) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ "remote-logging-delete-confirmation-modal-content" }>
                    { t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." +
                        "confirmation.content",  {
                            logType: toLower(logType)
                        }
                    ) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the component.
 */
RemoteLoggingConfigForm.defaultProps = {
    "data-componentid": "remote-logging-config-form"
};
