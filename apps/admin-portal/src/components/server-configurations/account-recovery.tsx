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
import { AlertInterface } from "../../models";
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { getAccountRecoveryConfigurations } from "../../api/server-configurations";
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
	const [accountRecoveryConfigs, setAccountRecoveryConfigs] = useState<AccountRecoveryConfigurationsInterface>({});
	const [reset] = useTrigger();

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
	 * Calls the API and updates the user password.
	 */
	const saveAccountRecoveryConfigs = () => {
		// Todo Implement method.
	};

	const getUsernameRecoveryCheckBoxes = (data) => {
		const values = [];
		data.properties.map((property => {
			if (property.name === ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE) : "";
			}
			if (property.name === ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA) : "";
			}
		}));
		return values;
	};

	const getPasswordRecoveryCheckBoxes = (data) => {
		const values = [];
		data.properties.map((property => {
			if (property.name === ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE) : "";
			}
			if (property.name === ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA) : "";
			}
			if (property.name === ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) : "";
			}
		}));
		return values;
	};

	const getNotificationCheckBoxes = (data) => {
		const values = [];
		data.properties.map((property => {
			if (property.name === ServerConfigurationsConstants.NOTIFY_SUCCESS) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.NOTIFY_SUCCESS) : "";
			}
			if (property.name === ServerConfigurationsConstants.NOTIFY_RECOVERY_START) {
				property.value === "true" ?
					values.push(ServerConfigurationsConstants.NOTIFY_RECOVERY_START) : "";
			}
		}));
		return values;
	};

	const getEnablePasswordReCaptcha = (data) => {
		const element = data.properties.find(
			property => property.name ==
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE).value;
		return element === "true" ?
			ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE :
			""
	};

	const getNotificationInternallyManaged = (data) => {
		const element = data.properties.find(
			property => property.name ==
				ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED).value;
		return element === "true" ?
			ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED :
			""
	};

	const getFormValues = (values) => {
		return {
			usernameRecoveryCheckBoxes: values.get("UsernameRecoveryCheckBoxes"),
			passwordRecoveryCheckBoxes: values.get("PasswordRecoveryCheckBoxes"),
			passwordRecoveryMinAnswers: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS),
			enablePasswordReCaptcha: values.get(
				ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE),
			reCaptchaMaxFailedAttempts: values.get(
				ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS
			),
			notificationInternallyManaged: values.get(
				ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
			),
			notificationCheckBoxes: values.get("NotificationCheckBoxes"),

			recoveryLinkExpiryTime: values.get(
				ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME
			),
			smsOTPExpiryTime: values.get(ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME),
			callbackRegex: values.get(ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX),
		}
	};

	/**
	 * Load account recovery configurations from the API, on page load.
	 */
	useEffect(() => {
		getAccountRecoveryConfigurations()
			.then((response) => {
				const configs = {
					usernameRecoveryCheckBoxes: getUsernameRecoveryCheckBoxes(response),
					passwordRecoveryCheckBoxes: getPasswordRecoveryCheckBoxes(response),
					passwordRecoveryMinAnswers: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS).value,
					enablePasswordReCaptcha: getEnablePasswordReCaptcha(response),
					reCaptchaMaxFailedAttempts: response.properties.find(
						property => property.name ==
							ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS).value,
					notificationInternallyManaged: getNotificationInternallyManaged(response),
					notificationCheckBoxes: getNotificationCheckBoxes(response),
					recoveryLinkExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME).value,
					smsOTPExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME).value,
					callbackRegex: response.properties.find(
						property => property.name == ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX).value
				};
				setAccountRecoveryConfigs(configs);
			});
	}, []);

	const confirmationModal = (
		<Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
			<Modal.Content>
				<Container>
					<h3>{ t("views:components.serverConfigs.selfRegistration.confirmation.heading") }</h3>
				</Container>
				<Divider hidden={ true }/>
				<p>{ t("views:components.serverConfigs.selfRegistration.confirmation.message") }</p>
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

	const showUserSelfRegistrationView = editingForm[ACCOUNT_RECOVERY_FORM_IDENTIFIER] ? (
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
							label: t("views:components.serverConfigs.accountRecovery.usernameRecovery." +
								"form.enable.label"),
							value: ServerConfigurationsConstants.USERNAME_RECOVERY_ENABLE
						},
						{
							label: t("views:components.serverConfigs.accountRecovery.usernameRecovery." +
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
							label: t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableNotificationBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE
						},
						{
							label: t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA
						},
						{
							label: t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
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
						"views:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.label"
					) }
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.accountRecovery.passwordRecovery." +
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
					{ t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.hint") }
				</Hint>
				<Field
					name={ ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaForSecurityQuestionBasedRecovery.label"),
							value: ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE
						}
					] }
					disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
						ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }
					value={ [accountRecoveryConfigs.enablePasswordReCaptcha] }
				/>
				<Hint disabled={ !accountRecoveryConfigs.passwordRecoveryCheckBoxes.includes(
					ServerConfigurationsConstants.PASSWORD_RECOVERY_QUESTION_BASED_ENABLE) }>
					{ t("views:components.serverConfigs.accountRecovery.passwordRecovery." +
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
					label={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.reCaptchaMaxFailedAttempts.label"
					) }
					name={ ServerConfigurationsConstants.RE_CAPTCHA_MAX_FAILED_ATTEMPTS }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
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
							label: t("views:components.serverConfigs.accountRecovery.otherSettings." +
								"form.enableInternalNotificationManagement.label"),
							value: ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
						}
					] }
					listen={
						(values) => {
							setAccountRecoveryConfigs(getFormValues(values));
						}
					}
					value={ [accountRecoveryConfigs.notificationInternallyManaged] }
				/>
				<Hint>
					{ t("views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.enableInternalNotificationManagement.hint") }
				</Hint>
				<Field
					name="NotificationCheckBoxes"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("views:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyRecoverySuccess.label"),
							value: ServerConfigurationsConstants.NOTIFY_SUCCESS
						},
						{
							label: t("views:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyQuestionRecoveryStart.label"),
							value: ServerConfigurationsConstants.NOTIFY_RECOVERY_START
						}
					] }
					disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
						ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }
					value={ accountRecoveryConfigs.notificationCheckBoxes }
				/>
				<Field
					label={ t("views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.label") }
					name={ ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.recoveryLinkExpiryTime }
					disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
						ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }
					width={ 9 }
				/>
				<Hint disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
					ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }>
					{ t("views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.label"
					) }
					name={ ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.validations.empty"
					) }
					type="number"
					value={ accountRecoveryConfigs.smsOTPExpiryTime }
					disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
						ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }
					width={ 9 }
				/>
				<Hint disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
					ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }>
					{ t("views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.label"
					) }
					name={ ServerConfigurationsConstants.RECOVERY_CALLBACK_REGEX }
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.validations.empty"
					) }
					type="text"
					value={ accountRecoveryConfigs.callbackRegex }
					disabled={ !accountRecoveryConfigs.notificationInternallyManaged.includes(
						ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED) }
					width={ 9 }
				/>
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
			description={ t("views:components.serverConfigs.accountRecovery.description") }
			header={ t("views:components.serverConfigs.accountRecovery.heading") }
			icon={ SettingsSectionIcons.profileExport }
			iconMini={ SettingsSectionIcons.profileExportMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(ACCOUNT_RECOVERY_FORM_IDENTIFIER) }
			primaryAction={ t("views:components.serverConfigs.accountRecovery.actionTitles.config") }
			primaryActionIcon="key"
		>
			{ showUserSelfRegistrationView }
			{ confirmationModal }
		</Section>
	);
};
