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

import { Divider,  Grid, Typography } from "@oxygen-ui/react";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ConfirmationModal, DangerZone, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import { AlertInterface, AlertLevels } from "modules/core/src/models/core";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Form } from "semantic-ui-react";
import { 
    restoreRemoteLogPublishingConfiguration, 
    updateRemoteLogPublishingConfiguration, 
    useRemoteLogPublishingConfigs 
} from "../api/server-config";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/governance-connectors";

interface RemoteLoggingConfig {
    remoteUrl: string,
    connectTimeoutMillis: string,
    verifyHostname: boolean,
    logType: LogType,
    /**
     * Remote server username
     */
    username: string,
    /**
     * Remote server password
     */
    password: string,
    keystoreLocation: string,
    keystorePassword: string,
    truststoreLocation: string,
    truststorePassword: string
}

export default function RemoteLogging (): ReactElement {
    const [ remoteLoggingConfig, setRemoteLoggingConfig ] = useState<RemoteLoggingConfig>();
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const {
        data: remoteLogPublishingConfigs,
        isLoading: isRemoteLogPublishingConfigsLoading,
        error: remoteLogPublishingConfigRetrievalError
    } = useRemoteLogPublishingConfigs();

    useEffect(() => {
        if (!remoteLogPublishingConfigRetrievalError) {
            return;
        }

        dispatch(addAlert<AlertInterface>({
            description: t("extensions:develop.branding.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.branding.notifications.fetch.genericError.message")
        }));
    }, [ remoteLogPublishingConfigRetrievalError ]);

    useEffect(() => {
        if (remoteLogPublishingConfigs) {
            let existingConfig: RemoteLoggingConfig = remoteLogPublishingConfigs.find(
                (config: RemoteLogPublishingConfigurationInterface) => config.logType === LogType.AUDIT);
            
            if (remoteLogPublishingConfigs?.length === 2) {
                existingConfig = { ...existingConfig, logType: LogType.ALL };
            }

            setRemoteLoggingConfig(existingConfig);
        }
    },[ remoteLogPublishingConfigs ]);

    const restoreDefaultRemoteLoggingConfiguration = () => {
        restoreRemoteLogPublishingConfiguration().then(() => {
            dispatch(addAlert<AlertInterface>({
                description: t("Updated successfully."),
                level: AlertLevels.SUCCESS,
                message: t("Restored the default remote logging configuration successfully.")
            }));
        }).catch((_err: AxiosError) => {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.branding.notifications.fetch.genericError.message"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.serverConfigs.remoteLogPublishing.errors.genericError")
            }));
        });
    };
    
    const handleRemoteLoggingConfigUpdate = (values: Map<string,string>) => {
        const remoteLogPublishingConfiguration: RemoteLogPublishingConfigurationInterface[] = [ ];

        const remoteLogPublishConfig: Omit<RemoteLogPublishingConfigurationInterface,"logType"> = {
            connectTimeoutMillis: values.get("connectTimeoutMillis"),
            keystoreLocation: values.get("keystoreLocation"),
            keystorePassword: values.get("keystorePassword"),
            password: values.get("password"),
            remoteUrl: values.get("remoteUrl"),
            truststoreLocation: values.get("truststoreLocation"),
            truststorePassword: values.get("truststorePassword"),
            username: values.get("username"),
            verifyHostname: values.get("verifyHostname") === "true"
        };

        if (values.get("logType") === "ALL") {
            remoteLogPublishingConfiguration.push({
                ...remoteLogPublishConfig,
                logType: LogType.AUDIT
            });
            remoteLogPublishingConfiguration.push({
                ...remoteLogPublishConfig,
                logType: LogType.CARBON
            });
        } else {
            remoteLogPublishingConfiguration.push({
                ...remoteLogPublishConfig,
                logType: values.get("logType") as LogType.CARBON | LogType.AUDIT
            });
        }

        updateRemoteLogPublishingConfiguration(remoteLogPublishingConfiguration).then(() => {
            dispatch(addAlert<AlertInterface>({
                description: t("console:manage.features.serverConfigs.remoteLogPublishing." + 
                "notification.success.message"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.serverConfigs.remoteLogPublishing.notification.success.description")
            }));
        }).catch((_err: AxiosError) => {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.branding.notifications.fetch.genericError.message"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.serverConfigs.remoteLogPublishing.errors.genericError")
            }));
        });
    };

    const handleVerifyHostnameToggleChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        event.preventDefault();

        setRemoteLoggingConfig({
            ...remoteLoggingConfig,
            verifyHostname: data.checked
        });
    };

    return (
        <PageLayout
            title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
            pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
            description={ (<>
                { t("console:manage.features.serverConfigs.remoteLogPublishing.description") }
            </>) }
            isLoading={ isRemoteLogPublishingConfigsLoading }
        >
            <Grid
                container
                spacing={ 2 }
                style={ {
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "2rem"
                } }
            >
                <Grid
                    xs={ 12 }
                    md={ 8 }
                    lg={ 6 }
                    xl={ 6 }
                >
                    <Forms
                        onSubmit={ handleRemoteLoggingConfigUpdate }
                    >
                        <Field
                            children={ [
                                {
                                    text: t("console:manage.features.serverConfigs.remoteLogPublishing.fields." + 
                                        "logTypes.values.carbonLogs"),
                                    value: "CARBON"
                                },
                                {
                                    text: t("console:manage.features.serverConfigs.remoteLogPublishing.fields." + 
                                        "logTypes.values.auditLogs"),
                                    value: "AUDIT"
                                },
                                {
                                    text: t("console:manage.features.serverConfigs.remoteLogPublishing.fields." + 
                                        "logTypes.values.allLogs"),
                                    value: "ALL"
                                }
                            ] }
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.logTypes.label")
                            }
                            name={ "logType" }
                            type="dropdown"
                            listen={ (data: Map<string, FormValue>) => {
                                const logType: string = data.get("logType")?.toString();

                                setRemoteLoggingConfig({
                                    ...remoteLoggingConfig,
                                    logType: logType as LogType
                                });
                                
                            } }
                            value={ remoteLoggingConfig?.logType }
                            data-componentid="remote-logging-logtype-dropdown"
                        />

                        <Field
                            label={ 
                                "Destination URL"
                            }
                            name={ "remoteUrl" }
                            required
                            requiredErrorMessage={ 
                                "Remote logging destination endpoint URL is missing"
                            }
                            type="text"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.remoteUrl }
                            data-componentid={ "remote-logging-url-value-input" }
                        /> 

                        <Typography variant="subtitle1" style={ { marginBottom: "1em" } }>
                            <b>
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "title") }
                            </b>
                        </Typography>

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "connectionTimeout.label")
                            }
                            name={ "connectTimeoutMillis" }
                            type="number"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.connectTimeoutMillis }
                            data-componentid={ "remote-logging-connection-timeout-input" }
                        />

                        <Grid container style={ { marginBottom: "1em" } }>
                            <Grid xs={ 12 } sm={ 6 } md={ 6 } lg={ 6 } xl={ 6 }>
                                <Typography variant="body1">
                                    { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                        "verifyHostname.label") }
                                </Typography>
                            </Grid>
                            <Grid 
                                xs={ 12 } 
                                sm={ 6 } 
                                md={ 6 }
                                lg={ 6 }
                                xl={ 6 } 
                                display="flex"
                                justifyContent={ "flex-end" }>
                                <Checkbox
                                    label={ remoteLoggingConfig?.verifyHostname
                                        ? t("common:enabled")
                                        : t("common:disabled")
                                    }
                                    toggle
                                    onChange={ handleVerifyHostnameToggleChange }
                                    checked={ remoteLoggingConfig?.verifyHostname }
                                    readOnly={ null }
                                    data-componentid="remote-logging-verify-hostname-toggle"
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle1" style={ { marginBottom: "1em" } }>
                            { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                "basicAuthConfig.title") }
                        </Typography>

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "basicAuthConfig.serverUsername.label")
                            }
                            name={ "username" }
                            type="text"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.username }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "basicAuthConfig.serverPassword.label")
                            }
                            name={ "password" }
                            type="password"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.password }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Typography variant="subtitle1" style={ { marginBottom: "1em" } }>
                            { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                "sslConfig.title") }
                        </Typography>

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "sslConfig.keystorePath.label")
                            }
                            name={ "keystoreLocation" }
                            type="text"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.keystoreLocation }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "sslConfig.keystorePassword.label")
                            }
                            name={ "keystorePassword" }
                            type="password"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.keystorePassword }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "sslConfig.truststorePath.label")
                            }
                            name={ "truststoreLocation" }
                            type="text"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.truststoreLocation }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Field
                            label={ 
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." + 
                                    "sslConfig.truststorePassword.label")
                            }
                            name={ "truststorePassword" }
                            type="password"
                            validation={ (value: string, _validation: Validation) => {
                                // TODO: perform the validation
                                _validation.isValid = true;
                            } }
                            value={ remoteLoggingConfig?.truststorePassword }
                            data-componentid={ "remote-logging-url-value-input" }
                        />

                        <Divider hidden/>
                        <Form.Group inline>
                            <PrimaryButton
                                size="small"
                                type="submit"
                                data-testid={ "remote-logging-submit-button" }
                                data-componentid={ "remote-logging-submit-button" }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        </Form.Group>
                    </Forms>
                </Grid>
            </Grid>

            <div style={ { marginLeft: "-10px", marginTop: "1.5rem" } }>
                <Typography variant="title1" >
                    <b>{ t("common:dangerZone") }</b>
                </Typography>
                <DangerZone
                    data-testid={ "remote-logging-danger-zone" }
                    actionTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.title") }
                    header={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.header") }
                    subheader={ 
                        t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone.subheader")
                    }
                    onActionClick={ (): void => {
                        setShowDeleteConfirmationModal(true);
                    } }
                    isButtonDisabled={ false }
                />
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." + 
                    "confirmation.hint") }
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
                    <ConfirmationModal.Header
                        data-testid={ "remote-logging-delete-confirmation-modal-header" }
                    >
                        { t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." + 
                        "confirmation.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-testid={ "remote-logging-delete-confirmation-modal-message" }
                    >
                        { t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." + 
                        "confirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-testid={ "remote-logging-delete-confirmation-modal-content" }
                    >
                        { t("console:manage.features.serverConfigs.remoteLogPublishing.dangerZone." + 
                        "confirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </div>
        </PageLayout>
    );
}
