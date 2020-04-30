/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { EditSection, GenericIcon, Hint, LinkButton, Section } from "@wso2is/react-components";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Accordion, Checkbox, CheckboxProps, Divider, Form, Grid, Icon } from "semantic-ui-react";
import { getAllLoginPolicies, updateAllLoginPolicies } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { LoginPoliciesInterface } from "../../models/server-configurations";

/**
 * Prop types for the login policies component.
 */
interface LoginPoliciesProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Login policies component.
 *
 * @param {Props} props - Props injected to the login policies component.
 * @return {JSX.Element}
 */
export const LoginPolicies: FunctionComponent<LoginPoliciesProps> = (props: LoginPoliciesProps): JSX.Element => {

    const [ loginPoliciesConfigs, setLoginPoliciesConfigs ] = useState<LoginPoliciesInterface>({});
    const [ mainAccordionActiveState, setMainAccordionActiveState ] = useState<boolean>(false);
    const [ subAccordionActiveIndex, setSubAccordionActiveIndex ] = useState<number>(undefined);
    const [ reset ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const errorMessage = {
        description: t("devPortal:components.serverConfigs.loginPolicies.notifications.updateConfigurations." +
            "error.description"),
        level: AlertLevels.ERROR,
        message: t("devPortal:components.serverConfigs.loginPolicies.notifications.updateConfigurations." +
            "error.message")
    };

    const genericErrorMessage = {
        description: t("devPortal:components.serverConfigs.loginPolicies.notifications.updateConfigurations." +
            "genericError.description"),
        level: AlertLevels.ERROR,
        message: t("devPortal:components.serverConfigs.loginPolicies.notifications.updateConfigurations." +
            "genericError.message")
    };

    /**
     * Calls the API and update the login policies configurations.
     */
    const makeLoginPoliciesPatchCall = (data, successNotification) => {
        updateAllLoginPolicies(data)
            .then(() => {
                setLoginPoliciesConfigsFromAPI();
                setSubAccordionActiveIndex(undefined);
                dispatch(addAlert(successNotification));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert(errorMessage));
                } else {
                    // Generic error message
                    dispatch(addAlert(genericErrorMessage));
                }
            });
    };

    const saveLoginPoliciesConfigs = (key, value) => {
        const data = {
            "operation": "UPDATE",
            "properties": [
                {
                    "name": key,
                    "value": value
                }
            ]
        };
        const successNotification = {
            description: "",
            level: AlertLevels.SUCCESS,
            message: t("devPortal:components.serverConfigs.loginPolicies.notifications." +
                "updateConfigurations.success.message")
        };
        switch (key) {
            case ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE:
                successNotification.description = t("devPortal:components.serverConfigs.loginPolicies." +
                    "notifications.updateAccountLockEnable.success.description");
                break;
            case ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE:
                successNotification.description = t("devPortal:components.serverConfigs.loginPolicies." +
                    "notifications.updateAccountDisablingEnable.success.description");
                break;
            case ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT:
                successNotification.description = t("devPortal:components.serverConfigs.loginPolicies." +
                    "notifications.updateAccountDisablingEnable.success.description");
                break;
        }
        makeLoginPoliciesPatchCall(data, successNotification);
    };

    const saveLoginPoliciesAdvancedConfigs = (values) => {
        const configs = {
            maxFailedLoginAttemptsToReCaptcha: values.get(
                ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA),
            reCaptchaPreference: values.get("reCaptchaPreference")
        };
        const data = {
            "operation": "UPDATE",
            "properties": [
                {
                    "name": ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA,
                    "value": configs.maxFailedLoginAttemptsToReCaptcha
                }
            ]
        };
        if (configs.reCaptchaPreference === ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE) {
            data.properties.push(
                {
                    "name": ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE,
                    "value": "true"
                },
                {
                    "name": ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE,
                    "value": "false"
                }
            )
        } else if (configs.reCaptchaPreference ===
            ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE) {
            data.properties.push(
                {
                    "name": ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE,
                    "value": "false"
                },
                {
                    "name": ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE,
                    "value": "true"
                }
            )
        }
        const successNotification = {
            description: t("devPortal:components.serverConfigs.loginPolicies.notifications." +
                "updateConfigurations.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("devPortal:components.serverConfigs.loginPolicies.notifications." +
                "updateConfigurations.success.message")
        };
        makeLoginPoliciesPatchCall(data, successNotification);
    };

    const saveAccountLockSettings = (values) => {
        const configs = {
            accountLockInternalNotificationManagement: values.get(
                ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT),
            accountLockTime: values.get(
                ServerConfigurationsConstants.ACCOUNT_LOCK_TIME),
            accountLockTimeIncrementFactor: values.get(
                ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR),
            maxFailedLoginAttemptsToAccountLock: values.get(
                ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK)
        };
        const data = {
            "operation": "UPDATE",
            "properties": [
                {
                    "name": ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK,
                    "value": configs.maxFailedLoginAttemptsToAccountLock
                },
                {
                    "name": ServerConfigurationsConstants.ACCOUNT_LOCK_TIME,
                    "value": configs.accountLockTime
                },
                {
                    "name": ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR,
                    "value": configs.accountLockTimeIncrementFactor
                },
                {
                    "name": ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT,
                    "value": configs.accountLockInternalNotificationManagement.length > 0 ?
                        "true" : "false"
                }
            ]
        };
        const successNotification = {
            description: t("devPortal:components.serverConfigs.accountRecovery.notifications." +
                "updateConfigurations.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("devPortal:components.serverConfigs.accountRecovery.notifications." +
                "updateConfigurations.success.message")
        };
        makeLoginPoliciesPatchCall(data, successNotification);
    };

    const setLoginPoliciesConfigsFromAPI = () => {
        getAllLoginPolicies()
            .then((response) => {
                const configs = {
                    accountDisableInternalNotificationManagement: [],
                    accountDisablingEnable: [],
                    accountLockEnable: false,
                    accountLockInternalNotificationManagement: [],
                    accountLockTime: "",
                    accountLockTimeIncrementFactor: "",
                    maxFailedLoginAttemptsToAccountLock: "",
                    maxFailedLoginAttemptsToReCaptcha: "",
                    reCaptchaPreference: ""
                };
                response.connectors.map(connector => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID) {
                        configs.accountLockEnable = extractBooleanValue(connector,
                            ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE);
                        configs.maxFailedLoginAttemptsToAccountLock = connector.properties.find(
                            property => property.name ==
                                ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK).value;
                        configs.accountLockTime = connector.properties.find(
                            property => property.name == ServerConfigurationsConstants.ACCOUNT_LOCK_TIME).value;
                        configs.accountLockTimeIncrementFactor = connector.properties.find(
                            property => property.name ==
                                ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR).value;
                        configs.accountLockInternalNotificationManagement = extractArrayValue(connector,
                            ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT);
                    } else if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID) {
                        configs.accountDisablingEnable = extractArrayValue(connector,
                            ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE);
                        configs.accountDisableInternalNotificationManagement = extractArrayValue(connector,
                            ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT);
                    } else if(connector.id === ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID) {
                        const reCaptchaAlwaysEnable = extractArrayValue(connector,
                            ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE);
                        const reCaptchaAfterMaxFailedAttemptsEnable = extractArrayValue(connector,
                            ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE);
                        if (reCaptchaAlwaysEnable.length > 0) {
                            configs.reCaptchaPreference =
                                ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE;
                        } else if (reCaptchaAfterMaxFailedAttemptsEnable.length > 0) {
                            configs.reCaptchaPreference =
                                ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE;
                        }
                        configs.maxFailedLoginAttemptsToReCaptcha = connector.properties.find(
                            property => property.name ==
                                ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA).value;
                    }
                });
                setLoginPoliciesConfigs(configs);
            });
    };

    /**
     * Load login policies from the API, on page load.
     */
    useEffect(() => {
        setLoginPoliciesConfigsFromAPI()
    }, [props]);

    const extractArrayValue = (response, key) => {
        return response.properties.find(prop => prop.name === key).value === "true" ? [key] : [];
    };

    const extractBooleanValue = (response, key) => {
        return response.properties.find(prop => prop.name === key).value === "true";
    };
    
    const handleSubAccordionClick = (index) => {
        if (subAccordionActiveIndex === index) {
            setSubAccordionActiveIndex(undefined)
        } else {
            setSubAccordionActiveIndex(index)
        }
    };

    const handleMainAccordionClick = () => {
        setMainAccordionActiveState(!mainAccordionActiveState)
    };

    const showAccountLockOtherSettings: ReactElement = (
        <Grid className="middle aligned mt-1">
            <Grid.Row columns={ 2 } className="inner-list-item mt-3 mb-3">
                <Grid.Column className="first-column" mobile={ 1 } tablet={ 1 } computer={ 1 }>
                </Grid.Column>
                <Grid.Column mobile={ 15 } tablet={ 15 } computer={ 15 }>
                    <Field
                        label={ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.maxFailedLoginAttemptsToAccountLock.label") }
                        name={ ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK }
                        placeholder={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.maxFailedLoginAttemptsToAccountLock.placeholder") }
                        required={ true }
                        requiredErrorMessage={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.maxFailedLoginAttemptsToAccountLock.validations.empty") }
                        type="number"
                        value={ loginPoliciesConfigs.maxFailedLoginAttemptsToAccountLock }
                        width={ 9 }
                        disabled={ !loginPoliciesConfigs?.accountLockEnable }
                    />
                    <Hint disabled={ !loginPoliciesConfigs?.accountLockEnable }>
                        { t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.maxFailedLoginAttemptsToAccountLock.hint") }
                    </Hint>
                    <Divider className="hidden"/>
                    <Field
                        label={ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.accountLockTime.label") }
                        name={ ServerConfigurationsConstants.ACCOUNT_LOCK_TIME }
                        placeholder={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.accountLockTime.placeholder") }
                        required={ true }
                        requiredErrorMessage={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.accountLockTime.validations.empty") }
                        type="number"
                        value={ loginPoliciesConfigs.accountLockTime }
                        width={ 9 }
                        disabled={ !loginPoliciesConfigs?.accountLockEnable }
                    />
                    <Hint disabled={ !loginPoliciesConfigs?.accountLockEnable }>
                        { t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.accountLockTime.hint") }
                    </Hint>
                    <Divider className="hidden"/>
                    <Field
                        label={ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.accountLockTimeIncrementFactor.label") }
                        name={ ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR }
                        placeholder={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.accountLockTimeIncrementFactor.placeholder") }
                        required={ true }
                        requiredErrorMessage={ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountLock.form.accountLockTimeIncrementFactor.validations.empty") }
                        type="number"
                        value={ loginPoliciesConfigs.accountLockTimeIncrementFactor }
                        width={ 9 }
                        disabled={ !loginPoliciesConfigs?.accountLockEnable }
                    />
                    <Hint disabled={ !loginPoliciesConfigs?.accountLockEnable }>
                        { t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.accountLockTimeIncrementFactor.hint") }
                    </Hint>
                    <Divider className="hidden"/>
                    <Field
                        name={ ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT }
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                                    "form.accountLockInternalNotificationManagement.label"),
                                value: ServerConfigurationsConstants.
                                    ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT
                            }
                        ] }
                        value={ loginPoliciesConfigs.accountLockInternalNotificationManagement }
                        disabled={ !loginPoliciesConfigs?.accountLockEnable }
                    />
                    <Hint disabled={ !loginPoliciesConfigs?.accountLockEnable }>
                        { t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
                            "form.accountLockInternalNotificationManagement.hint") }
                    </Hint>
                    <Form.Group
                        className={ !loginPoliciesConfigs?.accountLockEnable ?  "disabled" : "" }
                    >
                        <Field
                            name=""
                            required={ false }
                            requiredErrorMessage=""
                            size="small"
                            type="submit"
                            value={ t("common:update").toString() }
                        />
                    </Form.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    const accountLockAccordion: ReactElement = (
        <Accordion>
            <Accordion.Title
                active={ subAccordionActiveIndex === 1 }
                index={ 0 }
                onClick={ () => { handleSubAccordionClick(1) } }
            >
                <Grid className="middle aligned mt-1">
                    <Grid.Row columns={ 3 } className="inner-list-item">
                        <Grid.Column className="first-column pl-3" mobile={ 14 } tablet={ 14 } computer={ 14 } >
                            { t("devPortal:components.serverConfigs.loginPolicies." +
                                "accountLock.form.accountLockEnable.label") }
                        </Grid.Column>
                        <Grid.Column mobile={ 1 } tablet={ 1 } computer={ 1 }>
                            <Checkbox
                                toggle
                                onChange={
                                    (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                                        e.stopPropagation();
                                        const value = data.checked ? "true" : "false";
                                        saveLoginPoliciesConfigs(ServerConfigurationsConstants.
                                            ACCOUNT_LOCK_ENABLE, value);
                                    }
                                }
                                checked={ loginPoliciesConfigs.accountLockEnable }
                            />
                        </Grid.Column>
                        <Grid.Column
                            className="last-column pb-2" textAlign="right" mobile={ 1 } tablet={ 1 } computer={ 1 }
                        >
                            <GenericIcon
                                size="default"
                                defaultIcon
                                link
                                inline
                                transparent
                                verticalAlign="middle"
                                className="pr-3"
                                icon={ <Icon name="angle right" className="chevron"/> }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={ subAccordionActiveIndex === 1 }>
                { showAccountLockOtherSettings }
            </Accordion.Content>
        </Accordion>
    );

    const showAccountDisableInternalNotificationManagement: ReactElement = (
        <Grid className="middle aligned mt-1">
            <Grid.Row columns={ 2 } className="inner-list-item mt-3 mb-3">
                <Grid.Column className="first-column" mobile={ 1 } tablet={ 1 } computer={ 1 }>
                </Grid.Column>
                <Grid.Column mobile={ 15 } tablet={ 15 } computer={ 15 }>
                    <Field
                        name={ ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT }
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("devPortal:components.serverConfigs.loginPolicies." +
                                    "accountDisable.form.accountDisableInternalNotificationManagement.label"),
                                value: ServerConfigurationsConstants.
                                    ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT
                            }
                        ] }
                        value={ loginPoliciesConfigs.accountDisableInternalNotificationManagement }
                        listen={
                            (values) => {
                                const value = values.get(ServerConfigurationsConstants.
                                    ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT).length > 0 ? "true" : "false";
                                saveLoginPoliciesConfigs(ServerConfigurationsConstants.
                                    ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT, value);
                            }
                        }
                    />
                    <Hint>
                        { t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountDisable.form.accountDisableInternalNotificationManagement.hint") }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    const accountDisableAccordion: ReactElement = (
        <Accordion>
            <Accordion.Title
                active={ subAccordionActiveIndex === 2 }
                index={ 0 }
                onClick={ () => { handleSubAccordionClick(2) } }
                className={ (loginPoliciesConfigs?.accountDisablingEnable?.length > 0) ? "" : "disabled" }
            >
                <Grid className="middle aligned mt-1">
                    <Grid.Row columns={ 2 } className="inner-list-item">
                        <Grid.Column className="first-column" mobile={ 12 } tablet={ 12 } computer={ 12 }>
                            <Icon
                                className="modal-icon"
                                name={ loginPoliciesConfigs?.accountDisableInternalNotificationManagement?.length > 0 ?
                                    "check circle" : "circle outline" }
                                size="large"
                                color={ (loginPoliciesConfigs.accountDisablingEnable?.length > 0 &&
                                    loginPoliciesConfigs?.accountDisableInternalNotificationManagement?.length > 0)
                                    ? "orange" : "grey" }
                            />
                            { t("devPortal:components.serverConfigs.loginPolicies.accountDisable." +
                                "form.accountDisableInternalNotificationManagement.label") }
                        </Grid.Column>
                        <Grid.Column
                            className="last-column pb-2"
                            textAlign="right"
                            mobile={ 4 } tablet={ 4 } computer={ 4 }
                        >
                            <GenericIcon
                                size="default"
                                defaultIcon
                                link
                                inline
                                transparent
                                verticalAlign="middle"
                                className="pr-3"
                                icon={ <Icon name="angle right" className="chevron"/> }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={ subAccordionActiveIndex === 2 }>
                { showAccountDisableInternalNotificationManagement }
            </Accordion.Content>
        </Accordion>
    );

    const showAdvancedLoginPoliciesView: ReactElement = (
        <EditSection>
            <Forms
                onSubmit={ (values) => {
                    saveLoginPoliciesAdvancedConfigs(values);
                } }
                resetState={ reset }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name={ "reCaptchaPreference" }
                                required={ false }
                                requiredErrorMessage=""
                                default={ "" }
                                label={ t("devPortal:components.serverConfigs.loginPolicies.reCaptcha." +
                                    "form.reCaptchaPreference.label") }
                                type="radio"
                                children={ [
                                    {
                                        label: t("devPortal:components.serverConfigs.loginPolicies." +
                                            "reCaptcha.form.reCaptchaPreference.reCaptchaAlwaysEnable.label"),
                                        value: ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE
                                    },
                                    {
                                        label: t("devPortal:components.serverConfigs.loginPolicies.reCaptcha." +
                                            "form.reCaptchaPreference.reCaptchaAfterMaxFailedAttemptsEnable.label"),
                                        value: ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE
                                    }
                                ] }
                                value={ loginPoliciesConfigs.reCaptchaPreference }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                label={ t("devPortal:components.serverConfigs.loginPolicies.reCaptcha." +
                                    "form.maxFailedLoginAttemptsToReCaptcha.label") }
                                name={ ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA }
                                placeholder={ t("devPortal:components.serverConfigs.loginPolicies." +
                                    "reCaptcha.form.maxFailedLoginAttemptsToReCaptcha.placeholder") }
                                required={ true }
                                requiredErrorMessage={ t("devPortal:components.serverConfigs.loginPolicies." +
                                    "reCaptcha.form.maxFailedLoginAttemptsToReCaptcha.validations.empty") }
                                type="number"
                                value={ loginPoliciesConfigs.maxFailedLoginAttemptsToReCaptcha }
                                width={ 9 }
                            />
                            <Hint>
                                { t("devPortal:components.serverConfigs.loginPolicies.reCaptcha." +
                                    "form.maxFailedLoginAttemptsToReCaptcha.hint") }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Form.Group>
                                <Field
                                    name=""
                                    required={ false }
                                    requiredErrorMessage=""
                                    size="small"
                                    type="submit"
                                    value={ t("common:save").toString() }
                                />
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </EditSection>
    );

    const mainAccordion: ReactElement = (
        <Accordion fluid styled>
            <Accordion.Title
                active={ mainAccordionActiveState }
                index={ 0 }
                onClick={ handleMainAccordionClick }
            >
                <Grid className="middle aligned">
                    <Grid.Row columns={ 2 } className="inner-list-item">
                        <Grid.Column className="first-column" >
                            <LinkButton className="p-3">Captcha for SSO login</LinkButton>
                        </Grid.Column>
                        <Grid.Column className="last-column" textAlign="right" >
                            <GenericIcon
                                size="default"
                                defaultIcon
                                link
                                inline
                                transparent
                                verticalAlign="middle"
                                className="pr-3"
                                icon={ <Icon name="angle right" className="chevron"/> }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={ mainAccordionActiveState }>
                { showAdvancedLoginPoliciesView }
            </Accordion.Content>
        </Accordion>
    );

    const showLoginPolicies = (
        <Forms
            onSubmit={ (values) => {
                saveAccountLockSettings(values)
            } }
        >
            <Grid padded={ true } className="middle aligned">
                <Grid.Row columns={ 1 } className="inner-list-item">
                    <Grid.Column className="first-column">
                        { accountLockAccordion }
                    </Grid.Column>
                </Grid.Row>
                <Divider className="mr-5 ml-5" />
                <Grid.Row columns={ 2 } className="inner-list-item">
                    <Grid.Column className="first-column" mobile={ 14 } tablet={ 14 } computer={ 14 } >
                        <label>{ t("devPortal:components.serverConfigs.loginPolicies." +
                            "accountDisable.form.accountDisablingEnable.label") }</label>
                    </Grid.Column>
                    <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
                        <Field
                            name={ ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE }
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: "",
                                    value: ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE
                                }
                            ] }
                            value={ loginPoliciesConfigs.accountDisablingEnable }
                            listen={
                                (values) => {
                                    const value = values.get(ServerConfigurationsConstants.
                                        ACCOUNT_DISABLING_ENABLE).length > 0 ? "true" : "false";
                                    saveLoginPoliciesConfigs(ServerConfigurationsConstants.
                                        ACCOUNT_DISABLING_ENABLE, value);
                                }
                            }
                            toggle
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 } className="inner-list-item mt-3 mb-3">
                    <Grid.Column className="first-column">
                        { accountDisableAccordion }
                    </Grid.Column>
                </Grid.Row>

                <Divider className="mr-5 ml-5" hidden />
            </Grid>
        </Forms>
    );

    return (
        <Section
            description={ t("devPortal:components.serverConfigs.loginPolicies.description") }
            header={ t("devPortal:components.serverConfigs.loginPolicies.heading") }
            icon={ SettingsSectionIcons.federatedAssociations }
            iconMini={ SettingsSectionIcons.federatedAssociationsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            accordion={ mainAccordion }
        >
            <Divider className="m-0 mb-2"/>
            <div className="main-content-inner">
                { showLoginPolicies }
            </div>
        </Section>
    );
};
