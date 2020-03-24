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

import React, { FunctionComponent, useState } from "react";
import { SettingsSectionIcons } from "../../configs";
import { AlertInterface } from "../../models";
import { EditSection, Hint, Section } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";

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

	const [isSecQuestionBasedRecoveryEnabled, setSecQuestionBasedRecoveryEnabled] = useState(false);
	const [isNotificationInternallyManaged, setNotificationInternallyManaged] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [reset] = useTrigger();

	const {t} = useTranslation();

	/**
	 * Handles the `onSubmit` event of the forms.
	 *
	 * @param {string} formName - Name of the form
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
	const saveSelfRegistrationConfigs = () => {
		// Todo Implement method.
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

	const showUserSelfRegistrationView = editingForm[ACCOUNT_RECOVERY_FORM_IDENTIFIER] ? (
		<EditSection>
			<Forms
				onSubmit={ (value) => {
					// Todo complete method
					handleSubmit();
				} }
				resetState={ reset }
			>
				<h4>Username Recovery</h4>
				<Field
					name="UsernameRecoveryOptions"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.usernameRecovery." +
								"form.enable.label"),
							value: "enableUsernameRecovery"
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.usernameRecovery." +
								"form.enableReCaptcha.label"),
							value: "enableReCaptchaForUsernameRecovery"
						}
					] }
					value={ [] }
				/>
				<h4>Password Recovery</h4>
				<Field
					name="PasswordRecoveryOptions"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableNotificationBasedRecovery.label"),
							value: "enableNotificationBasedRecovery"
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaBasedRecovery.label"),
							value: "enableReCaptchaBasedRecovery"
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableSecurityQuestionBasedRecovery.label"),
							value: "enableSecurityQuestionBasedRecovery"
						}
					] }
					listen={
						(values) => {
							setSecQuestionBasedRecoveryEnabled(
								values.get("PasswordRecoveryOptions").includes("enableSecurityQuestionBasedRecovery")
							);
						}
					}
					value={ [] }
				/>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.label"
					) }
					name="NoOfQuestionsRequired"
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.validations.empty"
					) }
					type="number"
					value="2"
					disabled={ !isSecQuestionBasedRecoveryEnabled }
					width={ 9 }
				/>
				<Hint disabled={ !isSecQuestionBasedRecoveryEnabled }>
					{ t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
						"form.noOfQuestionsRequired.hint") }
				</Hint>
				<Field
					name="EnableReCaptchaForSecurityQuestionBasedRecovery"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.passwordRecovery." +
								"form.enableReCaptchaForSecurityQuestionBasedRecovery.label"),
							value: "enableReCaptchaForSecurityQuestionBasedRecovery"
						}
					] }
					disabled={ !isSecQuestionBasedRecoveryEnabled }
					value={ ["enableReCaptchaForSecurityQuestionBasedRecovery"] }
				/>
				<Hint disabled={ !isSecQuestionBasedRecoveryEnabled }>
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
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.reCaptchaMaxFailedAttempts.label"
					) }
					name="NoOfQuestionsRequired"
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.reCaptchaMaxFailedAttempts.validations.empty"
					) }
					type="number"
					value="2"
					width={ 9 }
				/>
				<Field
					name="EnableInternalNotificationManagement"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.enableInternalNotificationManagement.label"),
							value: "enableInternalNotificationManagement"
						}
					] }
					listen={
						(values) => {
							setNotificationInternallyManaged(
								values.get("EnableInternalNotificationManagement").
								includes("enableInternalNotificationManagement")
							);
						}
					}
					value={ [] }
				/>
				<Hint>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.enableInternalNotificationManagement.hint") }
				</Hint>
				<Field
					name="NotifyRecoverySuccess"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyRecoverySuccess.label"),
							value: "notifyRecoverySuccess"
						},
						{
							label: t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
								"form.notifyQuestionRecoveryStart.label"),
							value: "notifyQuestionRecoveryStart"
						}
					] }
					disabled={ !isNotificationInternallyManaged }
					value={ [] }
				/>
				<Field
					label={ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.label") }
					name="RecoveryLinkExpiryTime"
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.validations.empty"
					) }
					type="number"
					value="1440"
					disabled={ !isNotificationInternallyManaged }
					width={ 9 }
				/>
				<Hint disabled={ !isNotificationInternallyManaged }>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryLinkExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.label"
					) }
					name="SMSOTPExpiryTime"
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.validations.empty"
					) }
					type="number"
					value="5"
					disabled={ !isNotificationInternallyManaged }
					width={ 9 }
				/>
				<Hint disabled={ !isNotificationInternallyManaged }>
					{ t("devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.smsOTPExpiryTime.hint") }
				</Hint>
				<Field
					label={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.label"
					) }
					name="RecoveryCallbackURLRegex"
					placeholder=""
					required={ true }
					requiredErrorMessage={ t(
						"devPortal:components.serverConfigs.accountRecovery.otherSettings." +
						"form.recoveryCallbackURLRegex.validations.empty"
					) }
					type="text"
					value=".*"
					width={ 9 }
				/>
				<Hint>
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
			{ showUserSelfRegistrationView }
			{ confirmationModal }
		</Section>
	);
};
