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
import { Button, Container, Divider, Form, Grid, Modal } from "semantic-ui-react";
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { getAccountRecoveryConfigurations, updateAccountRecoveryConfigurations } from "../../api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { AccountRecoveryConfigurationsInterface } from "../../models/server-configurations";
import { addAlert } from "@wso2is/core/store";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { SettingsSectionIcons } from "../../configs";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * Constant to store the self registration from identifier.
 * @type {string}
 */
const ACCOUNT_RECOVERY_FORM_IDENTIFIER = "accountRecoveryForm";

/**
 * Prop types for the account recovery component.
 */
interface AccountRecoveryProps {
	onAlertFired: (alert: AlertInterface) => void;
}

/**
 * User Self Registration component.
 *
 * @param {AccountRecoveryProps} props - Props injected to the account recovery component.
 * @return {JSX.Element}
 */
export const AccountRecovery: FunctionComponent<AccountRecoveryProps> = (props: AccountRecoveryProps): JSX.Element => {

	const [editingForm, setEditingForm] = useState({
		[ACCOUNT_RECOVERY_FORM_IDENTIFIER]: false
	});

	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [accountRecoveryConfigs, setAccountRecoveryConfigs] = useState<AccountRecoveryConfigurationsInterface>({});
	const [reset] = useTrigger();

	const dispatch = useDispatch();

	const {t} = useTranslation();

	/**
	 * Handles the `onSubmit` event of the forms.
	 */
	const handleSubmit = (): void => {
		setShowConfirmationModal(true);
	};

	/**
	 * Handle the confirmation modal close event.
	 */
	const handleConfirmationModalClose = (): void => {
		setShowConfirmationModal(false);
	};

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
		description: t("devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
			"error.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
			"error.message")
	};

	const genericErrorMessage = {
		description: t("devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
			"genericError.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
			"genericError.message")
	};

	/**
	 * Calls the API and update the account recovery configurations.
	 */
	const makeAccountRecoveryPatchCall = (data, successNotification) => {
		updateAccountRecoveryConfigurations(data)
			.then(() => {
				dispatch(addAlert(successNotification));
				handleConfirmationModalClose();
				hideFormEditView(ACCOUNT_RECOVERY_FORM_IDENTIFIER);
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

	const saveAccountRecoveryConfigs = (key, value) => {
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
			message: t("devPortal:components.serverConfigs.accountRecovery.notifications." +
				"updateConfigurations.success.message")
		};
		switch (key) {
			case ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.accountRecovery." +
					"notifications.updateEnableUsernameRecovery.success.description");
				break;
			case ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA:
				successNotification.description = t("devPortal:components.serverConfigs.accountRecovery." +
					"notifications.updateUsernameRecoveryReCaptcha.success.description");
				break;
			case ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.accountRecovery." +
					"notifications.updateEnableNotificationPasswordRecovery.success.description");
				break;
			case ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA:
				successNotification.description = t("devPortal:components.serverConfigs.accountRecovery." +
					"notifications.updateNotificationPasswordRecoveryReCaptcha.success.description");
				break;
		}
		makeAccountRecoveryPatchCall(data, successNotification);
	};

	const saveAccountRecoveryAdvancedConfigs = () => {
		const data = {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE,
					"value": accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery.length > 0 ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS,
					"value": accountRecoveryConfigs.passwordRecoveryMinAnswers
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE,
					"value": accountRecoveryConfigs.enableReCaptchaForQuestionPasswordRecovery.length > 0 ? "true" :
						"false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE,
					"value": accountRecoveryConfigs.enableForcedChallengeQuestions.length > 0 ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS,
					"value": accountRecoveryConfigs.reCaptchaMaxFailedAttempts
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED,
					"value": accountRecoveryConfigs.notificationInternallyManaged.length > 0 ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.NOTIFY_RECOVERY_START,
					"value": accountRecoveryConfigs.notificationCheckBoxes.includes(
						ServerConfigurationsConstants.NOTIFY_RECOVERY_START) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.NOTIFY_SUCCESS,
					"value": accountRecoveryConfigs.notificationCheckBoxes.includes(
						ServerConfigurationsConstants.NOTIFY_SUCCESS) ? "true" :
						"false"
				},
				{
					"name": ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME,
					"value": accountRecoveryConfigs.recoveryLinkExpiryTime
				},
				{
					"name": ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME,
					"value": accountRecoveryConfigs.smsOTPExpiryTime
				},
				{
					"name": ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX,
					"value": accountRecoveryConfigs.callbackRegex
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
		makeAccountRecoveryPatchCall(data, successNotification);
	};

	/**
	 * Loop through API response and extract check box values.
	 *
	 * @param data API response data.
	 * @param checkBoxes Names of the checkboxes as an array.
	 */
	const getCheckBoxes = (data, checkBoxes) => {
		const values = [];
		checkBoxes.map(checkBox => {
			data.properties.map((property => {
				if (property.name === checkBox) {
					property.value === "true" ? values.push(checkBox) : "";
				}
			}))
		});
		return values;
	};

	const getNotificationCheckBoxes = (data) => {
		return getCheckBoxes(data, [
			ServerConfigurationsConstants.NOTIFY_SUCCESS,
			ServerConfigurationsConstants.NOTIFY_RECOVERY_START
		]);
	};

	const getFormValues = (values) => {
		return {
			callbackRegex: values.get(ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX),
			enableForcedChallengeQuestions: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE),
			enableNotificationPasswordRecovery: accountRecoveryConfigs.enableNotificationPasswordRecovery,
			enableReCaptchaForNotificationPasswordRecovery: accountRecoveryConfigs.
				enableReCaptchaForNotificationPasswordRecovery,
			enableReCaptchaForQuestionPasswordRecovery: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE),
			enableReCaptchaForUsernameRecovery: accountRecoveryConfigs.enableReCaptchaForUsernameRecovery,
			enableSecurityQuestionPasswordRecovery: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE),
			enableUsernameRecovery: accountRecoveryConfigs.enableUsernameRecovery,
			notificationCheckBoxes: values.get("NotificationCheckBoxes"),
			notificationInternallyManaged: values.get(
				ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
			),
			passwordRecoveryMinAnswers: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS),
			reCaptchaMaxFailedAttempts: values.get(ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS),
			recoveryLinkExpiryTime: values.get(ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME),
			smsOTPExpiryTime: values.get(ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME)
		}
	};

	/**
	 * Load account recovery configurations from the API, on page load.
	 */
	useEffect(() => {
		getAccountRecoveryConfigurations()
			.then((response) => {
				const configs = {
					callbackRegex: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX).value,
					enableForcedChallengeQuestions:  extractArrayValue(response,
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE),
					enableNotificationPasswordRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE),
					enableReCaptchaForNotificationPasswordRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA),
					enableReCaptchaForQuestionPasswordRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE),
					enableReCaptchaForUsernameRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA),
					enableSecurityQuestionPasswordRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE),
					enableUsernameRecovery: extractArrayValue(response,
						ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE),
					notificationCheckBoxes: getNotificationCheckBoxes(response),
					notificationInternallyManaged: extractArrayValue(response,
						ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED),
					passwordRecoveryMinAnswers: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS).value,
					reCaptchaMaxFailedAttempts: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS).value,
					recoveryLinkExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME).value,
					smsOTPExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME).value
				};
				setAccountRecoveryConfigs(configs);
			});
	}, []);

	const extractArrayValue = (response, key) => {
		return response.properties.find(prop => prop.name === key).value === "true" ? [key] : [];
	};

	const confirmationModal = (
		<Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
			<Modal.Content>
				<Container>
					<h3>{ t("devPortal:components.serverConfigs.accountRecovery.confirmation.heading") }</h3>
				</Container>
				<Divider hidden={ true }/>
				<p>{ t("devPortal:components.serverConfigs.accountRecovery.confirmation.message") }</p>
			</Modal.Content>
			<Modal.Actions>
				<Button className="link-button" onClick={ handleConfirmationModalClose }>
					{ t("common:cancel") }
				</Button>
				<Button primary={ true } onClick={ saveAccountRecoveryAdvancedConfigs }>
					{ t("common:continue") }
				</Button>
			</Modal.Actions>
		</Modal>
	);

	const showAccountRecoverySummary = (
		<EditSection>
			<Forms>
				<Field
					name={ ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery." +
								"usernameRecovery.form.enable.label"),
							value: ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE
						}
					] }
					value={ accountRecoveryConfigs.enableUsernameRecovery }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE).length > 0
								? "true" : "false";
							saveAccountRecoveryConfigs(ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery." +
								"usernameRecovery.form.enableReCaptcha.label"),
							value: ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA
						}
					] }
					value={ accountRecoveryConfigs.enableReCaptchaForUsernameRecovery }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA).
								length > 0 ? "true" : "false";
							saveAccountRecoveryConfigs(ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA,
								value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery." +
								"passwordRecovery.form.enableNotificationBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE
						}
					] }
					value={ accountRecoveryConfigs.enableNotificationPasswordRecovery }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.
								PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE).length > 0 ? "true" : "false";
							saveAccountRecoveryConfigs(ServerConfigurationsConstants.
								PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery." +
								"passwordRecovery.form.enableReCaptchaForNotificationBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA
						}
					] }
					value={ accountRecoveryConfigs.enableReCaptchaForNotificationPasswordRecovery }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.
								PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA).length > 0 ? "true" : "false";
							saveAccountRecoveryConfigs(ServerConfigurationsConstants.
								PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA, value);
						}
					}
					toggle
				/>
			</Forms>
		</EditSection>
	);

	const showUserAccountRecoveryView = editingForm[ACCOUNT_RECOVERY_FORM_IDENTIFIER] && (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					setAccountRecoveryConfigs(getFormValues(values));
					handleSubmit();
				} }
				resetState={ reset }
			>
				<Grid>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<h4>Password Recovery</h4>
							<Field
								name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.accountRecovery." +
											"passwordRecovery.form.enableSecurityQuestionBasedRecovery.label"),
										value: ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE
									}
								] }
								listen={
									(values) => {
										setAccountRecoveryConfigs(getFormValues(values));
									}
								}
								value={ accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery }
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.accountRecovery." +
									"passwordRecovery.form.noOfQuestionsRequired.label") }
								name={ ServerConfigurationsConstants.
									PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS }
								placeholder={ t("devPortal:components.serverConfigs.accountRecovery." +
									"passwordRecovery.form.noOfQuestionsRequired.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs." +
									"accountRecovery.passwordRecovery.form.noOfQuestionsRequired." +
									"validations.empty") }
								type="number"
								value={ accountRecoveryConfigs.passwordRecoveryMinAnswers }
								width={ 5 }
								hidden={ accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery.length == 0 }
							/>
							<Hint hidden={ accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery.length == 0 }>
								{ t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
									"form.noOfQuestionsRequired.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								name={ ServerConfigurationsConstants.
									PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.accountRecovery." +
											"passwordRecovery.form." +
											"enableReCaptchaForSecurityQuestionBasedRecovery.label"),
										value: ServerConfigurationsConstants.
											PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE
									}
								] }
								value={ accountRecoveryConfigs.enableReCaptchaForQuestionPasswordRecovery }
								hidden={ accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery.length == 0 }
							/>
							<Hint hidden={ accountRecoveryConfigs.enableSecurityQuestionPasswordRecovery.length == 0 }>
								{ t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
									"form.enableReCaptchaForSecurityQuestionBasedRecovery.hint") }
							</Hint>
							<Field
								name=""
								required={ false }
								requiredErrorMessage=""
								hidden={ true }
								type="divider"
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<h4>Other Settings</h4>
							<Field
								name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
											"form.enableForcedChallengeQuestions.label"),
										value: ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE
									}
								] }
								value={ accountRecoveryConfigs.enableForcedChallengeQuestions }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.enableForcedChallengeQuestions.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.reCaptchaMaxFailedAttempts.label") }
								name={ ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS }
								placeholder={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.reCaptchaMaxFailedAttempts.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.reCaptchaMaxFailedAttempts.validations.empty") }
								type="number"
								value={ accountRecoveryConfigs.reCaptchaMaxFailedAttempts }
								width={ 5 }
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								name={ ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED }
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
											"form.enableInternalNotificationManagement.label"),
										value: ServerConfigurationsConstants.
											ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
									}
								] }
								listen={
									(values) => {
										setAccountRecoveryConfigs(getFormValues(values));
									}
								}
								value={ accountRecoveryConfigs.notificationInternallyManaged }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.enableInternalNotificationManagement.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								name="NotificationCheckBoxes"
								required={ false }
								requiredErrorMessage=""
								type="checkbox"
								children={ [
									{
										label: t("devPortal:components.serverConfigs.accountRecovery." +
											"otherSettings.form.notifyRecoverySuccess.label"),
										value: ServerConfigurationsConstants.NOTIFY_SUCCESS
									},
									{
										label: t("devPortal:components.serverConfigs.accountRecovery." +
											"otherSettings.form.notifyQuestionRecoveryStart.label"),
										value: ServerConfigurationsConstants.NOTIFY_RECOVERY_START
									}
								] }
								value={ accountRecoveryConfigs.notificationCheckBoxes }
								hidden={ accountRecoveryConfigs.notificationInternallyManaged.length == 0 }
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.recoveryLinkExpiryTime.label") }
								name={ ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME }
								placeholder={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.recoveryLinkExpiryTime.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.recoveryLinkExpiryTime.validations.empty") }
								type="number"
								value={ accountRecoveryConfigs.recoveryLinkExpiryTime }
								width={ 5 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.recoveryLinkExpiryTime.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.smsOTPExpiryTime.label") }
								name={ ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME }
								placeholder={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.smsOTPExpiryTime.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.smsOTPExpiryTime.validations.empty") }
								type="number"
								value={ accountRecoveryConfigs.smsOTPExpiryTime }
								width={ 5 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.smsOTPExpiryTime.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.recoveryCallbackURLRegex.label") }
								name={ ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX }
								placeholder={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.recoveryCallbackURLRegex.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.accountRecovery." +
									"otherSettings.form.recoveryCallbackURLRegex.validations.empty") }
								type="text"
								value={ accountRecoveryConfigs.callbackRegex }
								width={ 9 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
									"form.recoveryCallbackURLRegex.hint") }
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
										hideFormEditView(ACCOUNT_RECOVERY_FORM_IDENTIFIER);
									} }
									size="small"
									type="button"
									value={ t("common:cancel").toString() }
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
			description={ t("devPortal:components.serverConfigs.accountRecovery.description") }
			header={ t("devPortal:components.serverConfigs.accountRecovery.heading") }
			icon={ SettingsSectionIcons.profileExport }
			iconMini={ SettingsSectionIcons.profileExportMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(ACCOUNT_RECOVERY_FORM_IDENTIFIER) }
			primaryAction={ t("devPortal:components.serverConfigs.accountRecovery.actionTitles.config") }
			primaryActionIcon="key"
			showActionBar={ !editingForm[ACCOUNT_RECOVERY_FORM_IDENTIFIER] }
		>
			{ showAccountRecoverySummary }
			{ showUserAccountRecoveryView }
			{ confirmationModal }
		</Section>
	);
};
