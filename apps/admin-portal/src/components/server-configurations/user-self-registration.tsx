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
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { getSelfSignUpConfigurations, updateSelfSignUpConfigurations } from "../../api/user-self-registration";
import { SelfSignUpConfigurationsInterface } from "../../models/server-configurations";
import { addAlert } from "@wso2is/core/store";
import { useDispatch } from "react-redux";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";

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
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
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
	const getSelfSignUpPatchCallData = () => {
		return {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE,
					"value": selfSignUpConfigs.checkboxValues.includes(
						ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION,
					"value": selfSignUpConfigs.checkboxValues.includes(
						ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) ? "true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED,
					"value": selfSignUpConfigs.checkboxValues.includes(
						ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED) ?
						"true" : "false"
				},
				{
					"name": ServerConfigurationsConstants.RE_CAPTCHA,
					"value": selfSignUpConfigs.checkboxValues.includes(
						ServerConfigurationsConstants.RE_CAPTCHA) ? "true" : "false"
				},
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
				},
			]
		};
	};

	/**
	 * Calls the API and updates the self registrations configurations.
	 */
	const saveSelfRegistrationConfigs = () => {
		const data = getSelfSignUpPatchCallData();
		updateSelfSignUpConfigurations(data)
			.then(() => {
				dispatch(addAlert({
					description: t(
						"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
						"success.description"
					),
					level: AlertLevels.SUCCESS,
					message: t(
						"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
						"success.message"
					)
				}));
				handleConfirmationModalClose();
				hideFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER);
			})
			.catch((error) => {
				// Axios throws a generic `Network Error` for 401 status.
				// As a temporary solution, a check to see if a response is available has been used.
				if (!error.response || error.response.status === 401) {
					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"error.description"
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"error.message"
						)
					}));
				} else if (error.response && error.response.data && error.response.data.detail) {

					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"error.description",
							{description: error.response.data.detail}
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"error.message"
						)
					}));
				} else {
					// Generic error message
					dispatch(addAlert({
						description: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"genericError.description"
						),
						level: AlertLevels.ERROR,
						message: t(
							"devPortal:components.serverConfigs.selfRegistration.notifications.updateConfigurations." +
							"genericError.message"
						)
					}));
				}
			});
	};

	/**
	 * Load self registration configurations from the API, on page load.
	 */
	useEffect(() => {
		getSelfSignUpConfigurations()
			.then((response) => {
				const checkboxValues = getSelfRegistrationCheckboxValues(response);
				const configs = {
					checkboxValues: checkboxValues,
					verificationCodeExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME).value,
					smsOTPExpiryTime: response.properties.find(
						property => property.name == ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME).value,
					callbackRegex: response.properties.find(
						property => property.name == ServerConfigurationsConstants.CALLBACK_REGEX).value
				};
				setSelfSignUpConfigs(configs);
			});
	}, []);

	/**
	 * Loop through the properties array of the API response and extract the checkbox values.
	 *
	 * @param data API Response data.
	 * @return String array. Ex: [ "Enable", "LockOnCreation", ...]
	 */
	const getSelfRegistrationCheckboxValues = (data) => {
		const values = [];
		data.properties.map((property => {
			if (property.name === ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE) {
				property.value === "true" ? values.push(ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE) : "";
			}
			if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) {
				property.value === "true" ? values.push(ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) : "";
			}
			if (property.name === ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED) {
				property.value === "true" ? values.push(
					ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED) : "";
			}
			if (property.name === ServerConfigurationsConstants.RE_CAPTCHA) {
				property.value === "true" ? values.push(ServerConfigurationsConstants.RE_CAPTCHA) : "";
			}
		}));
		return values;
	};

	const confirmationModal = (
		<Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
			<Modal.Content>
				<Container>
					<h3>{ t("devPortal:components.serverConfigs.selfRegistration.confirmation.heading") }</h3>
				</Container>
				<Divider hidden={ true }/>
				<p>{ t("devPortal:components.serverConfigs.selfRegistration.confirmation.message") }</p>
			</Modal.Content>
			<Modal.Actions>
				<Button className="link-button" onClick={ handleConfirmationModalClose }>
					{ t("common:cancel") }
				</Button>
				<Button primary={ true } onClick={ saveSelfRegistrationConfigs }>
					{ t("common:continue") }
				</Button>
			</Modal.Actions>
		</Modal>
	);

	const getFormValues = (values) => {
		return {
			checkboxValues: values.get("SelfRegistrationCheckBoxes"),
			verificationCodeExpiryTime: values.get(ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME),
			smsOTPExpiryTime: values.get(ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME),
			callbackRegex: values.get(ServerConfigurationsConstants.CALLBACK_REGEX)
		}
	};

	const showUserSelfRegistrationView = editingForm[USER_SELF_REGISTRATION_FORM_IDENTIFIER] ? (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					setSelfSignUpConfigs(getFormValues(values));
					handleSubmit();
				} }
				resetState={ reset }
			>
				<Field
					name="SelfRegistrationCheckBoxes"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form.enable.label"),
							value: ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
						},
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"enableAccountLockOnCreation.label"),
							value: ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION
						},
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form." +
								"internalNotificationManagement.label"),
							value: ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED
						},
						{
							label: t("devPortal:components.serverConfigs.selfRegistration.form.enableReCaptcha.label"),
							value: ServerConfigurationsConstants.RE_CAPTCHA
						}
					] }
					value={ selfSignUpConfigs.checkboxValues }
				/>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime.label"
					) }
					name={ ServerConfigurationsConstants.VERIFICATION_CODE_EXPIRY_TIME }
					placeholder={
						t("devPortal:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime" +
							".placeholder")
					}
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime." +
						"validations.empty"
					) }
					type="number"
					value={ selfSignUpConfigs.verificationCodeExpiryTime }
					width={ 9 }
				/>
				<Hint>
					{
						t("devPortal:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime" +
							".placeholder")
					}
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.label"
					) }
					name={ ServerConfigurationsConstants.SMS_OTP_EXPIRY_TIME }
					placeholder={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.placeholder"
					) }
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.validations.empty"
					) }
					type="number"
					value={ selfSignUpConfigs.smsOTPExpiryTime }
					width={ 9 }
				/>
				<Hint>
					{ t("devPortal:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.placeholder") }
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.callbackURLRegex.label"
					) }
					name={ ServerConfigurationsConstants.CALLBACK_REGEX }
					placeholder={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.callbackURLRegex.placeholder"
					) }
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.selfRegistration.form.callbackURLRegex.validations.empty"
					) }
					type="text"
					value={ selfSignUpConfigs.callbackRegex }
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
							hideFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER);
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
		>
			{ showUserSelfRegistrationView }
			{ confirmationModal }
		</Section>
	);
};
