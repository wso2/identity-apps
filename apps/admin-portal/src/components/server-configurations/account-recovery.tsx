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

import React, { FunctionComponent, useEffect, useState } from "react";
import { SettingsSectionIcons } from "../../configs";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useDispatch } from "react-redux";
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { getAccountRecoveryConfigurations, updateAccountRecoveryConfigurations } from "../../api";
import { AccountRecoveryConfigurationsInterface } from "../../models/server-configurations";

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
	const [notificationInternallyManaged, setNotificationInternallyManaged] = useState(false);
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

	/**
	 * Create and return the PATCH request data by reading the form values.
	 */
	const getAccountRecoveryPatchCallData = () => {
		return {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE,
					"value": accountRecoveryConfigs.usernameRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA,
					"value": accountRecoveryConfigs.usernameRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE,
					"value": accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA,
					"value": accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA) ? "true" :
						"false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE,
					"value": accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS,
					"value": accountRecoveryConfigs.passwordRecoveryMinAnswers
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE,
					"value": accountRecoveryConfigs.enablePasswordReCaptcha.length > 0 ? "true" : "false"
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
	};

	/**
	 * Calls the API and updates the user password.
	 */
	const saveAccountRecoveryConfigs = () => {
		updateAccountRecoveryConfigurations(getAccountRecoveryPatchCallData())
			.then(() => {
				dispatch(addAlert({
					description: t(
						"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
						"success.description"
					),
					level: AlertLevels.SUCCESS,
					message: t(
						"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
						"success.message"
					)
				}));
				handleConfirmationModalClose();
				hideFormEditView(ACCOUNT_RECOVERY_FORM_IDENTIFIER);
			})
			.catch((error) => {
				// Axios throws a generic `Network Error` for 401 status.
				// As a temporary solution, a check to see if a response is available has been used.
				if (!error.response || error.response.status === 401) {
					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"error.description"
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"error.message"
						)
					}));
				} else if (error.response && error.response.data && error.response.data.detail) {

					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"error.description",
							{ description: error.response.data.detail }
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"error.message"
						)
					}));
				} else {
					// Generic error message
					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"genericError.description"
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.accountRecovery.notifications.updateConfigurations." +
							"genericError.message"
						)
					}));
				}
			});
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

	const getUsernameRecoveryCheckBoxes = (data) => {
		return getCheckBoxes(data, [
			ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE,
			ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA
		]);
	};

	const getPasswordRecoveryCheckBoxes = (data) => {
		return getCheckBoxes(data, [
			ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE,
			ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA,
			ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE
		]);
	};

	const getNotificationCheckBoxes = (data) => {
		return getCheckBoxes(data, [
			ServerConfigurationsConstants.NOTIFY_SUCCESS,
			ServerConfigurationsConstants.NOTIFY_RECOVERY_START
		]);
	};

	const getEnablePasswordReCaptcha = (data) => {
		const element = data.properties.find(
			property => property.name ==
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE).value;
		return element === "true" ?
			[ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE] :
			[]
	};

	const getNotificationInternallyManaged = (data) => {
		const element = data.properties.find(
			property => property.name ==
				ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED).value;
		return element === "true" ?
			[ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED] :
			[]
	};

	const getEnableForcedChallengeQuestions = (data) => {
		const element = data.properties.find(
			property => property.name ==
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE).value;
		return element === "true" ?
			[ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE] :
			[]
	};

	const getFormValues = (values) => {
		return {
			callbackRegex: values.get(ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX),
			enableForcedChallengeQuestions: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE),
			enablePasswordReCaptcha: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE),
			notificationCheckBoxes: values.get("NotificationCheckBoxes"),
			notificationInternallyManaged: values.get(
				ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
			),
			passwordRecoveryCheckBoxes: values.get("PasswordRecoveryCheckBoxes"),
			passwordRecoveryMinAnswers: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS),
			reCaptchaMaxFailedAttempts: values.get(
				ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS
			),

			recoveryLinkExpiryTime: values.get(
				ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME
			),
			smsOTPExpiryTime: values.get(ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME),
			usernameRecoveryCheckBoxes: values.get("UsernameRecoveryCheckBoxes"),
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
					enableForcedChallengeQuestions: getEnableForcedChallengeQuestions(response),
					enablePasswordReCaptcha: getEnablePasswordReCaptcha(response),
					notificationCheckBoxes: getNotificationCheckBoxes(response),
					notificationInternallyManaged: getNotificationInternallyManaged(response),
					passwordRecoveryCheckBoxes: getPasswordRecoveryCheckBoxes(response),
					passwordRecoveryMinAnswers: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS).value,
					reCaptchaMaxFailedAttempts: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS).value,
					recoveryLinkExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME).value,
					smsOTPExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME).value,
					usernameRecoveryCheckBoxes: getUsernameRecoveryCheckBoxes(response)
				};
				setAccountRecoveryConfigs(configs);
			});
	}, []);

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
				<Button primary={ true } onClick={ saveAccountRecoveryConfigs }>
					{ t("common:continue") }
				</Button>
			</Modal.Actions>
		</Modal>
	);

	const showUserAccountRecoveryView = editingForm[ACCOUNT_RECOVERY_FORM_IDENTIFIER] ? (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					setAccountRecoveryConfigs(getFormValues(values));
					handleSubmit();
				} }
				resetState={ reset }
			>
				<h4>Username Recovery</h4>
				<Field
					name="UsernameRecoveryCheckBoxes"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.usernameRecovery." +
								"form.enable.label"),
							value: ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.usernameRecovery." +
								"form.enableReCaptcha.label"),
							value: ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA
						}
					] }
					value={ accountRecoveryConfigs.usernameRecoveryCheckBoxes }
				/>
				<h4>Password Recovery</h4>
				<Field
					name="PasswordRecoveryCheckBoxes"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableNotificationBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableSecurityQuestionBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE
						}
					] }
					listen={
						(values) => {
							setAccountRecoveryConfigs(getFormValues(values));
						}
					}
					value={ accountRecoveryConfigs.passwordRecoveryCheckBoxes }
				/>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.label"
					) }
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.passwordRecoveryMinAnswers }
					disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }
					width={ 9 }
				/>
				<Hint disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
					ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }>
					{ t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.hint") }
				</Hint>
				<Field
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaForSecurityQuestionBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE
						}
					] }
					disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }
					value={ accountRecoveryConfigs.enablePasswordReCaptcha }
				/>
				<Hint disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
					ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }>
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
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.reCaptchaMaxFailedAttempts.label"
					) }
					name={ ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.reCaptchaMaxFailedAttempts.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.reCaptchaMaxFailedAttempts }
					width={ 9 }
				/>
				<Field
					name={ ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.enableInternalNotificationManagement.label"),
							value: ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
						}
					] }
					listen={
						(values) => {
							console.log(values.get(
								ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED))
							if (values.get(
								ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED).
								length > 0) {
								setNotificationInternallyManaged(true);
							} else {
								setNotificationInternallyManaged(false);
							}
						}
					}
					value={ accountRecoveryConfigs.notificationInternallyManaged }
				/>
				<Hint>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.enableInternalNotificationManagement.hint") }
				</Hint>
				<Field
					name="NotificationCheckBoxes"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyRecoverySuccess.label"),
							value: ServerConfigurationsConstants.NOTIFY_SUCCESS
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyQuestionRecoveryStart.label"),
							value: ServerConfigurationsConstants.NOTIFY_RECOVERY_START
						}
					] }
					disabled={ notificationInternallyManaged }
					value={ accountRecoveryConfigs.notificationCheckBoxes }
				/>
				<Field
					label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.label") }
					name={ ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.recoveryLinkExpiryTime }
					disabled={ notificationInternallyManaged }
					width={ 9 }
				/>
				<Hint disabled={ notificationInternallyManaged }>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.label"
					) }
					name={ ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.smsOTPExpiryTime }
					disabled={ notificationInternallyManaged }
					width={ 9 }
				/>
				<Hint disabled={ notificationInternallyManaged }>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.label"
					) }
					name={ ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.validations.empty"
					) }
					type="text"
					value={ accountRecoveryConfigs.callbackRegex }
					disabled={ notificationInternallyManaged }
					width={ 9 }
				/>
				<Hint disabled={ notificationInternallyManaged }>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.hint") }
				</Hint>
				<Field
					name=""
					required={ false }
					requiredErrorMessage=""
					hidden={ true }
					type="divider"
				/>
				<Form.Group>
					<Field
						name=""
						required={ false }
						requiredErrorMessage=""
						size="small"
						type="submit"
						value={ t("common:submit").toString() }
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

			</Forms>
		</EditSection>
	) : null;

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
		>
			{ showUserAccountRecoveryView }
			{ confirmationModal }
		</Section>
	);
};
