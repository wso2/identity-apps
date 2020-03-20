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
import {
	Section,
	EditSection, Hint
} from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { Field, Forms, useTrigger, Validation } from "@wso2is/forms";

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
export const UserSelfRegistration: FunctionComponent<UserSelfRegistrationProps> = (props: UserSelfRegistrationProps): JSX.Element => {

	const [editingForm, setEditingForm] = useState({
		[USER_SELF_REGISTRATION_FORM_IDENTIFIER]: false
	});

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [reset, resetForm] = useTrigger();

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
		console.log("Save self registration configs...");
	};

	const confirmationModal = (
		<Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
			<Modal.Content>
				<Container>
					<h3>{ t("views:components.serverConfigs.selfRegistration.confirmation.heading") }</h3>
				</Container>
				<Divider hidden={ true } />
				<p>{ t("views:components.serverConfigs.selfRegistration.confirmation.message") }</p>
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

	const showUserSelfRegistrationView = editingForm[USER_SELF_REGISTRATION_FORM_IDENTIFIER] ? (
		<EditSection>
			<Forms
				onSubmit={ (value) => {
					// Todo complete method
					// setCurrentPassword(value.get("currentPassword").toString());
					console.log(value);
					handleSubmit();
				} }
				resetState={ reset }
			>
				<Field
					name="UserSelfRegistrationOptions"
					required={ false }
					requiredErrorMessage=""
					type="checkbox"
					children={ [
						{
							label: t("views:components.serverConfigs.selfRegistration.form.enable.label"),
							value: "enableUserSelfRegistration"
						},
						{
							label: t("views:components.serverConfigs.selfRegistration.form.enableAccountLockOnCreation.label"),
							value: "enableAccountLockOnCreation"
						},
						{
							label: t("views:components.serverConfigs.selfRegistration.form.internalNotificationManagement.label"),
							value: "internalNotificationManagement"
						},
						{
							label: t("views:components.serverConfigs.selfRegistration.form.enableReCaptcha.label"),
							value: "enableReCaptcha"
						}
					] }
					value={ ["enableAccountLockOnCreation", "internalNotificationManagement", "enableReCaptcha"] }
					// value={ isDiscoverable ? [ "discoverable" ] : [] }
				/>
				<Field
					label={ t(
						"views:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime.label"
					) }
					name="verificationExpiryTime"
					placeholder={ t(
						"views:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime.placeholder"
					) }
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime.validations.empty"
					) }
					type="text"
					value="1440"
					width={ 9 }
				/>
				<Hint>
					{ t("views:components.serverConfigs.selfRegistration.form.verificationLinkExpiryTime.placeholder") }
				</Hint>
				<Field
					label={ t(
						"views:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.label"
					) }
					name="smsOTPExpiryTime"
					placeholder={ t(
						"views:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.placeholder"
					) }
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.validations.empty"
					) }
					type="text"
					value="1"
					width={ 9 }
				/>
				<Hint>
					{ t("views:components.serverConfigs.selfRegistration.form.smsOTPExpiryTime.placeholder") }
				</Hint>
				<Field
					label={ t(
						"views:components.serverConfigs.selfRegistration.form.callbackURLRegex.label"
					) }
					name="callbackURLRegex"
					placeholder={ t(
						"views:components.serverConfigs.selfRegistration.form.callbackURLRegex.placeholder"
					) }
					required={ true }
					requiredErrorMessage={ t(
						"views:components.serverConfigs.selfRegistration.form.callbackURLRegex.validations.empty"
					) }
					type="text"
					value="https://localhost:9443/authenticationendpoint/login.do"
					width={ 9 }
				/>
				<Hint>
					{ t("views:components.serverConfigs.selfRegistration.form.callbackURLRegex.placeholder" ) }
				</Hint>
				<Field
					hidden={ true }
					type="divider"
				/>
				<Form.Group>
					<Field
						size="small"
						type="submit"
						value={ t("common:submit").toString() }
					/>
					<Field
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
			description={ t("views:components.serverConfigs.selfRegistration.description") }
			header={ t("views:components.serverConfigs.selfRegistration.heading") }
			icon={ SettingsSectionIcons.federatedAssociations }
			iconMini={ SettingsSectionIcons.federatedAssociationsMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(USER_SELF_REGISTRATION_FORM_IDENTIFIER) }
			primaryAction={ t("views:components.serverConfigs.selfRegistration.actionTitles.config") }
			primaryActionIcon="key"
		>
			{ showUserSelfRegistrationView }
			{ confirmationModal }
		</Section>
	);
};
