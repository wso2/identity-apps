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
import { Divider, Form, Grid } from "semantic-ui-react";
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { getAllLoginPoliciesConfigurations, updateAccountLockingConfigurations } from "../../api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { LoginPoliciesInterface } from "../../models/server-configurations";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { SettingsSectionIcons } from "../../configs";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * Constant to store the login policies from identifier.
 * @type {string}
 */
const LOGIN_POLICIES_FORM_IDENTIFIER = "loginPoliciesForm";

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

	const [editingForm, setEditingForm] = useState({
		[LOGIN_POLICIES_FORM_IDENTIFIER]: false
	});

	const [loginPoliciesConfigs, setLoginPoliciesConfigs] = useState<LoginPoliciesInterface>({});
	const [reset] = useTrigger();

	const dispatch = useDispatch();

	const { t } = useTranslation();

	/**
	 * Handles the onClick event of the cancel button.
	 *
	 * @param formName - Name of the form
	 */
	const hideFormEditView = (formName: string): void => {
		setEditingForm({
			...editingForm,
			[formName]: false
		});
	};

	/**
	 * Handles the onClick event of the edit button.
	 *
	 * @param formName - Name of the form
	 */
	const showFormEditView = (formName: string): void => {
		setEditingForm({
			...editingForm,
			[formName]: true
		});
	};

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
		updateAccountLockingConfigurations(data)
			.then(() => {
				dispatch(addAlert(successNotification));
			})
			.catch((error) => {
				// Axios throws a generic `Network Error` for 401 status.
				// As a temporary solution, a check to see if a response is available has been used.
				if (!error.response || error.response.status === 401) {
					dispatch(addAlert(errorMessage));
				} else if (error.response && error.response.data && error.response.data.detail) {
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
					"notifications.accountLockEnable.success.description");
				break;
			case ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.loginPolicies." +
					"notifications.accountDisablingEnable.success.description");
				break;
		}
		makeLoginPoliciesPatchCall(data, successNotification);
	};

	const saveLoginPoliciesAdvancedConfigs = (loginPoliciesConfigs) => {
		const data = {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK,
					"value": loginPoliciesConfigs.maxFailedLoginAttemptsToAccountLock
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_LOCK_TIME,
					"value": loginPoliciesConfigs.accountLockTime
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR,
					"value": loginPoliciesConfigs.accountLockTimeIncrementFactor
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT,
					"value": loginPoliciesConfigs.accountLockInternalNotificationManagement.length > 0 ?
						"true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT,
					"value": loginPoliciesConfigs.accountDisableInternalNotificationManagement.length > 0 ?
						"true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE,
					"value": loginPoliciesConfigs.reCaptchaAlwaysEnable.length > 0 ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE,
					"value": loginPoliciesConfigs.reCaptchaAfterMaxFailedAttemptsEnable.length > 0 ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA,
					"value": loginPoliciesConfigs.maxFailedLoginAttemptsToReCaptcha
				}
			]
		};
		const successNotification = {
			description: t("devPortal:components.serverConfigs.loginPolicies.notifications." +
				"updateConfigurations.success.description"),
			level: AlertLevels.SUCCESS,
			message: t("devPortal:components.serverConfigs.loginPolicies.notifications." +
				"updateConfigurations.success.message")
		};
		makeLoginPoliciesPatchCall(data, successNotification);
	};

	const getFormValues = (values) => {
		return {
			accountDisableInternalNotificationManagement: values.get(
				ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT),
			accountDisablingEnable: loginPoliciesConfigs.accountDisablingEnable,
			accountLockEnable: loginPoliciesConfigs.accountLockEnable,
			accountLockInternalNotificationManagement: values.get(
				ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT),
			accountLockTime: values.get(
				ServerConfigurationsConstants.ACCOUNT_LOCK_TIME),
			accountLockTimeIncrementFactor: values.get(
				ServerConfigurationsConstants.ACCOUNT_LOCK_TIME_INCREMENT_FACTOR),
			maxFailedLoginAttemptsToAccountLock: values.get(
				ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK),
			maxFailedLoginAttemptsToReCaptcha: values.get(
				ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA),
			reCaptchaAfterMaxFailedAttemptsEnable: values.get(
				ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE),
			reCaptchaAlwaysEnable: values.get(
				ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE)
		};
	};

	/**
	 * Load login policies from the API, on page load.
	 */
	useEffect(() => {
		getAllLoginPoliciesConfigurations()
			.then((response) => {
				const configs = {
					accountDisableInternalNotificationManagement: [],
					accountDisablingEnable: [],
					accountLockEnable: [],
					accountLockInternalNotificationManagement: [],
					accountLockTime: "",
					accountLockTimeIncrementFactor: "",
					maxFailedLoginAttemptsToAccountLock: "",
					maxFailedLoginAttemptsToReCaptcha: "",
					reCaptchaAfterMaxFailedAttemptsEnable: [],
					reCaptchaAlwaysEnable: []
				};
				response.connectors.map(connector => {
					if (connector.id === ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID) {
						configs.accountLockEnable = extractArrayValue(connector,
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
						configs.reCaptchaAlwaysEnable = extractArrayValue(connector,
							ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE);
						configs.reCaptchaAfterMaxFailedAttemptsEnable = extractArrayValue(connector,
							ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE);
						configs.maxFailedLoginAttemptsToReCaptcha = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA).value;
					}
				});
				setLoginPoliciesConfigs(configs);
			});
	}, []);

	const extractArrayValue = (response, key) => {
		return response.properties.find(prop => prop.name === key).value === "true" ? [key] : [];
	};

	const showLoginPoliciesSummary = (
		<EditSection>
			<Forms>
				<Field
					name={ ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.loginPolicies." +
								"accountLock.form.accountLockEnable.label"),
							value: ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE
						}
					] }
					value={ loginPoliciesConfigs.accountLockEnable }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE).length > 0
								? "true" : "false";
							saveLoginPoliciesConfigs(ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.loginPolicies." +
								"accountDisable.form.accountDisablingEnable.label"),
							value: ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE
						}
					] }
					value={ loginPoliciesConfigs.accountDisablingEnable }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE).length > 0
								? "true" : "false";
							saveLoginPoliciesConfigs(ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE, value);
						}
					}
					toggle
				/>
			</Forms>
		</EditSection>
	);

	const showAdvancedLoginPoliciesView = editingForm[LOGIN_POLICIES_FORM_IDENTIFIER] && (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					saveLoginPoliciesAdvancedConfigs(getFormValues(values));
				} }
				resetState={ reset }
			>
				<Grid>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<h4>Account Locking</h4>
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
								width={ 5 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
									"form.maxFailedLoginAttemptsToAccountLock.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
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
								width={ 5 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
									"form.accountLockTime.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
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
								width={ 5 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
									"form.accountLockTimeIncrementFactor.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
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
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies.accountLock." +
									"form.accountLockInternalNotificationManagement.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<h4>Account Disabling</h4>
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
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies." +
									"accountDisable.form.accountDisableInternalNotificationManagement.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<h4>Captcha for SSO Login</h4>
							<Field
								name={ ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.loginPolicies." +
											"reCaptcha.form.reCaptchaAlwaysEnable.label"),
										value: ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE
									}
								] }
								value={ loginPoliciesConfigs.reCaptchaAlwaysEnable }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies." +
									"reCaptcha.form.reCaptchaAlwaysEnable.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								name={ ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.loginPolicies." +
											"reCaptcha.form.reCaptchaAfterMaxFailedAttemptsEnable.label"),
										value: ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE
									}
								] }
								value={ loginPoliciesConfigs.reCaptchaAfterMaxFailedAttemptsEnable }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.loginPolicies.reCaptcha." +
									"form.reCaptchaAfterMaxFailedAttemptsEnable.hint") }
							</Hint>
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
								width={ 5 }
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
								<Field
									name=""
									required={ false }
									requiredErrorMessage=""
									className="link-button"
									onClick={ () => {
										hideFormEditView(LOGIN_POLICIES_FORM_IDENTIFIER);
									} }
									size="small"
									type="button"
									value={ t("common:close").toString() }
								/>
							</Form.Group>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Forms>
		</EditSection>
	);

	return (
		<Section
			description={ t("devPortal:components.serverConfigs.loginPolicies.description") }
			header={ t("devPortal:components.serverConfigs.loginPolicies.heading") }
			icon={ SettingsSectionIcons.profileExport }
			iconMini={ SettingsSectionIcons.profileExportMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(LOGIN_POLICIES_FORM_IDENTIFIER) }
			primaryAction={ t("devPortal:components.serverConfigs.loginPolicies.actionTitles.config") }
			primaryActionIcon="key"
			showActionBar={ !editingForm[LOGIN_POLICIES_FORM_IDENTIFIER] }
		>
			{ showLoginPoliciesSummary }
			{ showAdvancedLoginPoliciesView }
		</Section>
	);
};
