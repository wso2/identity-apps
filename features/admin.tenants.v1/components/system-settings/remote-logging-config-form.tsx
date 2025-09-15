/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    Heading,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import startCase from "lodash-es/startCase";
import toLower from "lodash-es/toLower";
import React, { ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Form, Select } from "semantic-ui-react";
import { AuthenticationType, AuthenticationTypeDropdownOption } from "../../../admin.actions.v1/models/actions";
import restoreRemoteLogPublishingConfigurationByLogType from
    "../../api/system-settings/restore-remote-log-publishing-configuration-by-log-type";
import updateRemoteLogPublishingConfigurationByLogType from
    "../../api/system-settings/update-remote-log-publishing-configuration-by-log-type";
import useRemoteLogPublishingConfiguration from "../../api/system-settings/use-remote-log-publishing-configuration";
import TenantConstants from "../../constants/tenant-constants";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../../models/system-settings/remote-log-publishing";
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
    logConfig: RemoteLogPublishingConfigurationInterface;
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
    logConfig,
    mutateRemoteLoggingRequest,
    "data-componentid": componentId = "remote-logging-config-form"
}: RemoteLoggingConfigFormProps): ReactElement => {
    const [ isVerifyHostnameEnabled, setVerifyHostnameEnabled ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(AuthenticationType.NONE);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);
    const [ isSslConfigUpdateFormState, setIsSslConfigUpdateFormState ] = useState<boolean>(false);
    const [ isAddSslConfigState, setIsAddSslConfigState ] = useState<boolean>(true);
    const [ isSslConfigClearState, setIsSslConfigClearState ] = useState<boolean>(false);

    const [ resetForm, setResetForm ] = useTrigger();
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const { isLoading: isRemoteLogPublishingConfigsLoading } = useRemoteLogPublishingConfiguration();

    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.remoteLogging;
    });
    const hideConfigSecrets: boolean = isFeatureEnabled(
        featureConfig,
        TenantConstants.FEATURE_DICTIONARY.HIDE_REMOTE_LOG_CONFIG_SECRETS
    );

    const isAddAuthConfigState: boolean = !logConfig?.username;

    useEffect(() => {
        if (logConfig) {
            setAuthenticationType(logConfig.username ? AuthenticationType.BASIC : AuthenticationType.NONE);
            setIsAddSslConfigState(!logConfig?.keystoreLocation || !logConfig?.truststoreLocation);
            setIsSslConfigUpdateFormState(false);
        }
    }, [ logConfig ]);

    const renderAuthenticationSection = (): ReactElement => {

        const handleChange = (): void => {
            setIsAuthenticationUpdateFormState(true);
            setIsSslConfigClearState(false);
        };

        const handleChangeCancel = (): void => {
            setAuthenticationType(logConfig?.username ? AuthenticationType.BASIC : AuthenticationType.NONE);
            setIsAuthenticationUpdateFormState(false);
        };
        const renderAuthenticationSectionInfoBox = (): ReactElement => {

            const resolveAuthTypeDisplayName = (): string => {
                switch (authenticationType) {
                    case AuthenticationType.NONE:
                        return t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.types.none.name");
                    case AuthenticationType.BASIC:
                        return t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.types.basic.name");
                    default:
                        return t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.types.none.name");
                }
            };

            return (
                <Alert className="alert-nutral" icon={ false }>
                    <AlertTitle
                        className="alert-title"
                        data-componentid={ `${componentId}-authentication-info-box-title` }
                    >
                        <Trans
                            i18nKey={
                                authenticationType === AuthenticationType.NONE ?
                                    t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "basicAuthConfig.info.title.noneAuthType") :
                                    t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "basicAuthConfig.info.title.otherAuthType",
                                    { authType: resolveAuthTypeDisplayName() } )
                            }
                            components={ { strong: <strong/> } }
                        />
                    </AlertTitle>
                    { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.info.message") }
                    <div>
                        <Button
                            onClick={ handleChange }
                            variant="outlined"
                            size="small"
                            className={ "secondary-button" }
                            data-componentid={ `${componentId}-change-authentication-button` }
                        >
                            { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                "basicAuthConfig.buttons.changeAuthentication") }
                        </Button>
                    </div>
                </Alert>
            );
        };

        const renderAuthenticationUpdateWidget = (): ReactElement => {
            const renderAuthentication = (): ReactElement => {
                const renderAuthenticationPropertyFields = (): ReactElement => {

                    switch (authenticationType) {
                        case AuthenticationType.NONE:
                            break;
                        case AuthenticationType.BASIC:
                            return (
                                <>
                                    { renderAuthFields() }
                                </>
                            );
                        default:
                            break;
                    }
                };

                const handleAuthTypeChange = (
                    _: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps
                ) => {
                    switch (value) {
                        case AuthenticationType.NONE.toString():
                            setAuthenticationType(AuthenticationType.NONE);

                            break;
                        case AuthenticationType.BASIC.toString():
                            setAuthenticationType(AuthenticationType.BASIC);

                            break;
                        default:
                            setAuthenticationType(AuthenticationType.NONE);
                    }
                    renderAuthenticationPropertyFields();
                };

                return (
                    <>
                        <Form.Field
                            control={ Select }
                            ariaLabel="Authentication Type"
                            className="select-field-container"
                            name="authenticationType"
                            label={ t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                "basicAuthConfig.authenticationType.label") }
                            options={
                                [ ...TenantConstants.AUTH_TYPES.map(
                                    (option: AuthenticationTypeDropdownOption) => ({
                                        key: option.key,
                                        text: t(option.text),
                                        value: option.value.toString()
                                    }))
                                ]
                            }
                            required={ true }
                            data-componentid={ `${componentId}-authentication-type-dropdown` }
                            placeholder={ t("console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                                "advanced.basicAuthConfig.authenticationType.placeholder") }
                            defaultValue={ logConfig?.username ? AuthenticationType.BASIC : AuthenticationType.NONE }
                            onChange={ handleAuthTypeChange }
                        />
                        { renderAuthenticationPropertyFields() }
                    </>
                );
            };

            return (
                <Box className="box-container">
                    <div className="box-field">
                        { renderAuthentication() }
                        { !isAddAuthConfigState && (
                            <Button
                                onClick={ handleChangeCancel }
                                variant="outlined"
                                size="small"
                                className="secondary-button"
                                data-componentid={ `${componentId}-cancel-edit-authentication-button` }
                            >
                                { t("common:cancel") }
                            </Button>
                        ) }
                    </div>
                </Box>
            );
        };

        return (!isAuthenticationUpdateFormState && !isAddAuthConfigState ?
            renderAuthenticationSectionInfoBox() : renderAuthenticationUpdateWidget());
    };

    const renderSslConfigSection = (): ReactElement => {

        const handleChange = (): void => {
            setIsSslConfigUpdateFormState(true);
        };

        const handleChangeCancel = (): void => {
            setIsSslConfigUpdateFormState(false);
            setIsAddSslConfigState(!logConfig?.keystoreLocation || !logConfig?.truststoreLocation);
        };

        const handleClear = (): void => {
            setIsSslConfigUpdateFormState(false);
            setIsAddSslConfigState(true);
            setIsSslConfigClearState(true);
            logConfig.keystoreLocation = "";
            logConfig.keystorePassword = "";
            logConfig.truststoreLocation = "";
            logConfig.truststorePassword = "";
        };

        const renderSslConfigUpdateWidget = (): ReactElement => {

            return (
                <div className="ssl-configs-component" data-componentid={ componentId + "-ssl-configs-component" }>
                    <Card
                        sx={ {
                            mb: 2,
                            position: "relative"
                        } }
                    >
                        { !isAddSslConfigState && (
                            <Grid container alignItems="center" sx={ { mb: 2 } }>
                                <Grid>
                                    <FormControl sx={ { mb: 1, minWidth: 0, mt: 1 } } size="small">
                                &nbsp;
                                    </FormControl>
                                </Grid>
                            </Grid>
                        ) }
                        <Box sx={ { mt: 2 } }>
                            <Box
                                sx={ { position: "relative" } }
                                className="box-container"
                                data-componentid={ componentId + "-ssl-configs-box-container" }
                            >
                                { renderSslConfigFields() }
                            </Box>
                        </Box>
                        { !isAddSslConfigState && (
                            <Button
                                aria-label="Clear rule"
                                variant="outlined"
                                size="small"
                                className={
                                    "clear-button"
                                }
                                sx={ {
                                    position: "absolute",
                                    right: 14,
                                    top: 14
                                } }
                                onClick={ handleClear }
                                data-componentid={ `${ componentId }-clear-rule-button` }
                            >
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "sslConfig.buttons.clearSslConfig") }
                            </Button>
                        ) }
                        <Button
                            onClick={ handleChangeCancel }
                            variant="outlined"
                            size="small"
                            className="secondary-button"
                            data-componentid={ `${componentId}-cancel-edit-authentication-button` }
                        >
                            { t("common:cancel") }
                        </Button>
                    </Card>
                </div>
            );
        };

        const renderSslConfigSectionInfoBox = (): ReactElement => {

            return (
                <Alert
                    className="alert-nutral"
                    icon={ false }
                    data-componentid={ `${ componentId }-no-ssl-config-box` }
                >
                    <AlertTitle
                        className="alert-title"
                        data-componentid={ `${ componentId }-ssl-config-box-title` }
                    >
                        { isAddSslConfigState ?
                            t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                            "sslConfig.info.notConfigured.title") :
                            t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                            "sslConfig.info.sslConfigured.title")
                        }
                    </AlertTitle>
                    { isAddSslConfigState ?
                        t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.info.notConfigured.message") :
                        t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.info.sslConfigured.message") }
                    <div>
                        <Button
                            onClick={ handleChange }
                            variant="outlined"
                            size="small"
                            className={ "secondary-button" }
                            data-componentid={ `${ componentId }-configure-ssl-config-button` }
                        >
                            { isAddSslConfigState ?
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "sslConfig.buttons.addSslConfig") :
                                t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "sslConfig.buttons.changeSslConfig") }
                        </Button>
                    </div>
                </Alert>
            );
        };

        return (!isSslConfigUpdateFormState ? renderSslConfigSectionInfoBox() : renderSslConfigUpdateWidget());
    };

    const renderAuthFields = (): ReactElement => {
        const showAuthSecretsHint = (): ReactElement => (
            <Hint className="hint-text" compact>
                {
                    isAddAuthConfigState ?
                        t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.authenticationType.hint.create")
                        : t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.authenticationType.hint.update")
                }
            </Hint>
        );

        return(
            <>
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverUsername.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverUsername.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverUsername.placeholder"
                    ) }
                    name={ "username" }
                    required= { hideConfigSecrets }
                    type="text"
                    value={ logConfig?.username }
                    data-componentid={ componentId + "-url-value-input" }
                />
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverPassword.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverPassword.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                            "advanced.basicAuthConfig.serverPassword.placeholder"
                    ) }
                    name={ "password" }
                    required= { hideConfigSecrets }
                    hidePassword={ t("common:hidePassword") }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    value={ logConfig?.password }
                    data-componentid={ componentId + "-url-value-input" }
                />
                { hideConfigSecrets && showAuthSecretsHint() }
            </>
        );
    };

    const renderSslConfigFields = (): ReactElement => {
        const showAuthSecretsHint = (): ReactElement => (
            <Hint className="hint-text" compact>
                {
                    isAddAuthConfigState ?
                        t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.authenticationType.hint.create")
                        : t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "basicAuthConfig.authenticationType.hint.update")
                }
            </Hint>
        );

        return (
            <>
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePath.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePath.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePath.placeholder"
                    ) }
                    name={ "keystoreLocation" }
                    required= { hideConfigSecrets }
                    type="text"
                    value={ logConfig?.keystoreLocation }
                    data-componentid={ componentId + "-url-value-input" }
                />
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePassword.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePassword.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.keystorePassword.placeholder"
                    ) }
                    name={ "keystorePassword" }
                    required= { hideConfigSecrets }
                    hidePassword={ t("common:hidePassword") }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    value={ logConfig?.keystorePassword }
                    data-componentid={ componentId + "-url-value-input" }
                />
                { hideConfigSecrets && showAuthSecretsHint() }
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePath.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePath.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePath.placeholder"
                    ) }
                    name={ "truststoreLocation" }
                    required= { hideConfigSecrets }
                    type="text"
                    value={ logConfig?.truststoreLocation }
                    data-componentid={ componentId + "-url-value-input" }
                />
                <Field
                    label={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePassword.label"
                    ) }
                    requiredErrorMessage={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePassword.error.required"
                    ) }
                    placeholder={ t(
                        "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                            "sslConfig.truststorePassword.placeholder"
                    ) }
                    name={ "truststorePassword" }
                    required= { hideConfigSecrets }
                    hidePassword={ t("common:hidePassword") }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    value={ logConfig?.truststorePassword }
                    data-componentid={ componentId + "-url-value-input" }
                />
                { hideConfigSecrets && showAuthSecretsHint() }
            </>
        );
    };

    const handleRemoteLoggingConfigUpdate = (values: Map<string, string>) => {
        const remoteLogPublishConfig: RemoteLogPublishingConfigurationInterface = {
            connectTimeoutMillis: values.get("connectTimeoutMillis"),
            keystoreLocation: (hideConfigSecrets && isSslConfigClearState)
                ? "" : values.get("keystoreLocation"),
            keystorePassword: (hideConfigSecrets && isSslConfigClearState)
                ? "" : values.get("keystorePassword"),
            logType: logType,
            password: (hideConfigSecrets && authenticationType === AuthenticationType.NONE)
                ? "" : values.get("password"),
            remoteUrl: values.get("remoteUrl"),
            truststoreLocation: (hideConfigSecrets && isSslConfigClearState)
                ? "" : values.get("truststoreLocation"),
            truststorePassword: (hideConfigSecrets && isSslConfigClearState)
                ? "" : values.get("truststorePassword"),
            username: (hideConfigSecrets && authenticationType === AuthenticationType.NONE)
                ? "" : values.get("username"),
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
                setAuthenticationType(AuthenticationType.NONE);
                setIsAddSslConfigState(true);
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

    if (isRemoteLogPublishingConfigsLoading) {
        return (
            <Card className="remote-logging-content">
                <div className="remote-logging-form">
                    <Stack direction="column" spacing={ 2 }>
                        <Skeleton variant="rectangular" height={ 7 } width="30%" />
                        <Skeleton variant="rectangular" height={ 28 } />
                        <Skeleton variant="rectangular" height={ 7 } width="90%" />
                        <Skeleton variant="rectangular" height={ 7 } />
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
                        <Forms onSubmit={ handleRemoteLoggingConfigUpdate } resetState={ resetForm }>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL.label"
                                ) }
                                name={ "remoteUrl" }
                                required
                                requiredErrorMessage={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.remoteURL." +
                                        "error.required"
                                ) }
                                placeholder={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields." +
                                        "remoteURL.placeholder"
                                ) }
                                type="text"
                                value={ logConfig?.remoteUrl }
                                data-componentid={ componentId + "-url-value-input" }
                            />
                            <Heading as="h5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                    "title") }
                            </Heading>
                            <Field
                                label={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "connectionTimeout.label"
                                ) }
                                placeholder={ t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "connectionTimeout.placeholder"
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
                            <Hint className="hint-text" compact>
                                { t(
                                    "console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "verifyHostname.hint"
                                ) }
                            </Hint>
                            <Heading as="h5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "basicAuthConfig.title") }
                            </Heading>
                            { hideConfigSecrets ? renderAuthenticationSection() : renderAuthFields() }
                            <Heading as="h5">
                                { t("console:manage.features.serverConfigs.remoteLogPublishing.fields.advanced." +
                                        "sslConfig.title") }
                            </Heading>
                            { hideConfigSecrets ? renderSslConfigSection() : renderSslConfigFields() }
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
