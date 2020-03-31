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
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { Divider, Form, Grid } from "semantic-ui-react";
import { getSelfSignUpConfigurations, updateSelfSignUpConfigurations } from "../../api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { SelfSignUpConfigurationsInterface } from "../../models/server-configurations";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { SettingsSectionIcons } from "../../configs";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * Constant to store the self registration from identifier.
 * @type {string}
 */
const USER_SELF_REGISTRATION_FORM_IDENTIFIER = "userSelfRegistrationForm";

/**
 * Prop types for the change password component.
 */
interface UserSelfRegistrationProps {
	onAlertFired: (alert: AlertInterface) => void;
}

/**
 * User Self Registration component.
 *
 * @param {UserSelfRegistrationProps} props - Props injected to the change password component.
 * @return {JSX.Element}
 */
export const UserSelfRegistration: FunctionComponent<UserSelfRegistrationProps> = (props: UserSelfRegistrationProps):
	JSX.Element => {

	const [editingForm, setEditingForm] = useState({
		[USER_SELF_REGISTRATION_FORM_IDENTIFIER]: false
	});

	const [selfSignUpConfigs, setSelfSignUpConfigs] = useState<SelfSignUpConfigurationsInterface>({});
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
		description: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
			"updateConfigurations.error.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
			"updateConfigurations.error.message")
	};

	const genericErrorMessage = {
		description: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
			"updateConfigurations.genericError.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
			"updateConfigurations.genericError.message")
	};

	/**
	 * Call the API to update configs.
	 *
	 * @param data Payload to be sent to the API.
	 * @param successNotification Notification data for success instance. If errors occurred, common error notification
	 * will be user.
	 */
	const makeSelfRegistrationPatchCall = (data, successNotification) => {
		updateSelfSignUpConfigurations(data)
			.then(() => {
				dispatch(addAlert(successNotification));
				// handleConfirmationModalClose();
				// hideFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER);
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

	const saveSelfRegistrationConfigs = (key, value) => {
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
			message: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
				"updateConfigurations.success.message")
		};
		switch (key) {
			case ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.selfRegistration." +
					"notifications.updateEnable.success.description");
				break;
			case ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION:
				successNotification.description = t("devPortal:components.serverConfigs.selfRegistration." +
					"notifications.updateAccountLockOnCreation.success.description");
				break;
			case ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED:
				successNotification.description = t("devPortal:components.serverConfigs.selfRegistration." +
					"notifications.updateInternalNotificationManagement.success.description");
				break;
			case ServerConfigurationsConstants.RE_CAPTCHA:
				successNotification.description = t("devPortal:components.serverConfigs.selfRegistration." +
					"notifications.updateReCaptcha.success.description");
				break;
		}
		makeSelfRegistrationPatchCall(data, successNotification);
	};

	const saveSelfRegistrationAdvancedConfigs = (selfSignUpConfigs) => {
		const data = {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME,
					"value": selfSignUpConfigs.verificationCodeExpiryTime
				},
				{
					"name": ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME,
					"value": selfSignUpConfigs.smsOTPExpiryTime
				},
				{
					"name": ServerConfigurationsConstants.CALLBACK_REGEX,
					"value": selfSignUpConfigs.callbackRegex
				}
			]
		};
		const successNotification = {
			description: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
				"updateConfigurations.success.description"),
			level: AlertLevels.SUCCESS,
			message: t("devPortal:components.serverConfigs.selfRegistration.notifications." +
				"updateConfigurations.success.message")
		};
		makeSelfRegistrationPatchCall(data, successNotification);
	};

	/**
	 * Load self registration configurations from the API, on page load.
	 */
	useEffect(() => {
		getSelfSignUpConfigurations()
			.then((response) => {
				const configs = {
					accountLockOnCreation: extractArrayValue(response,
						ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION),
					callbackRegex: response.properties.find(
						property => property.name == ServerConfigurationsConstants.CALLBACK_REGEX).value,
					enable: extractArrayValue(response, ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE),
					internalNotificationManagement: extractArrayValue(response,
						ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED),
					reCaptcha: extractArrayValue(response, ServerConfigurationsConstants.RE_CAPTCHA),
					smsOTPExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME).value,
					verificationCodeExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME).value
				};
				setSelfSignUpConfigs(configs);
			});
	}, []);

	const extractArrayValue = (response, key) => {
		return response.properties.find(prop => prop.name === key).value === "true" ? [key] : [];
	};

	const getFormValues = (values) => {
		return {
			accountLockOnCreation: selfSignUpConfigs.accountLockOnCreation,
			callbackRegex: values.get(ServerConfigurationsConstants.CALLBACK_REGEX),
			enable: selfSignUpConfigs.enable,
			internalNotificationManagement: selfSignUpConfigs.internalNotificationManagement,
			reCaptcha: selfSignUpConfigs.reCaptcha,
			smsOTPExpiryTime: values.get(ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME),
			verificationCodeExpiryTime: values.get(ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME)
		}
	};

	const userSelfRegistrationSummary = (
		<EditSection>
			<Forms>
				<Field
					name={ ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"enable.label"),
							value: ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
						}
					] }
					value={ selfSignUpConfigs.enable }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE).length > 0
								? "true" : "false";
							saveSelfRegistrationConfigs(ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"enableAccountLockOnCreation.label"),
							value: ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION
						}
					] }
					value={ selfSignUpConfigs.accountLockOnCreation }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION).length > 0
								? "true" : "false";
							saveSelfRegistrationConfigs(ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"internalNotificationManagement.label"),
							value: ServerConfigurationsConstants.
								SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED
						}
					] }
					value={ selfSignUpConfigs.internalNotificationManagement }
					listen={
						(values) => {
							const value = values.get(ServerConfigurationsConstants.
								SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED).length > 0 ? "true" : "false";
							saveSelfRegistrationConfigs(ServerConfigurationsConstants.
									SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED, value);
						}
					}
					toggle
				/>
				<Field
					name={ ServerConfigurationsConstants.RE_CAPTCHA }
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"enableReCaptcha.label"),
							value: ServerConfigurationsConstants.RE_CAPTCHA
						}
					] }
					value={ selfSignUpConfigs.reCaptcha }
					listen={
						(values) => {
							const value = (values.get(ServerConfigurationsConstants.RE_CAPTCHA) &&
								values.get(ServerConfigurationsConstants.RE_CAPTCHA).length > 0)
								? "true" : "false";
							saveSelfRegistrationConfigs(ServerConfigurationsConstants.RE_CAPTCHA, value);
						}
					}
					toggle
				/>
			</Forms>
		</EditSection>
	);

	const showUserSelfRegistrationView = editingForm[USER_SELF_REGISTRATION_FORM_IDENTIFIER] && (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					saveSelfRegistrationAdvancedConfigs(getFormValues(values));
				} }
				resetState={ reset }
			>
				<Grid>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<Field
								label={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"verificationLinkExpiryTime.label") }
								name={ ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME }
								placeholder={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"verificationLinkExpiryTime.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"verificationLinkExpiryTime.validations.empty") }
								type="number"
								value={ selfSignUpConfigs.verificationCodeExpiryTime }
								width={ 4 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"verificationLinkExpiryTime.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"smsOTPExpiryTime.label") }
								name={ ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME }
								placeholder={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"smsOTPExpiryTime.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"smsOTPExpiryTime.validations.empty") }
								type="number"
								value={ selfSignUpConfigs.smsOTPExpiryTime }
								width={ 4 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"callbackURLRegex.label") }
								name={ ServerConfigurationsConstants.CALLBACK_REGEX }
								placeholder={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"callbackURLRegex.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"callbackURLRegex.validations.empty") }
								type="text"
								value={ selfSignUpConfigs.callbackRegex }
								width={ 9 }
							/>
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
										hideFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER);
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
			description={ t("devPortal:components.serverConfigs.selfRegistration.description") }
			header={ t("devPortal:components.serverConfigs.selfRegistration.heading") }
			icon={ SettingsSectionIcons.federatedAssociations }
			iconMini={ SettingsSectionIcons.federatedAssociationsMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER) }
			primaryAction={ t("devPortal:components.serverConfigs.selfRegistration.actionTitles.config") }
			primaryActionIcon="key"
			showActionBar={ !editingForm[USER_SELF_REGISTRATION_FORM_IDENTIFIER] }
		>
			{ userSelfRegistrationSummary }
			{ showUserSelfRegistrationView }
		</Section>
	);
};
