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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Accordion, Divider, Form, Grid, Icon } from "semantic-ui-react";
import { getSelfSignUpConfigurations, updateSelfSignUpConfigurations } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { SelfSignUpConfigurationsInterface } from "../../models/server-configurations";

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

	const [selfSignUpConfigs, setSelfSignUpConfigs] = useState<SelfSignUpConfigurationsInterface>({});
	const [ accordionState, setAccordionState ] = useState<boolean>(false);
	const [reset] = useTrigger();

	const dispatch = useDispatch();

	const { t } = useTranslation();

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
				setSelfSignUpConfigsFromAPI();
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

	const setSelfSignUpConfigsFromAPI = () => {
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
	};

	/**
	 * Load self registration configurations from the API, on page load.
	 */
	useEffect(() => {
		setSelfSignUpConfigsFromAPI();
	}, [props]);

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

	const userSelfRegistrationSummary: ReactElement = (
		<Forms>
			<Grid padded={ true } className="middle aligned">
				<Grid.Row columns={ 2 } className="inner-list-item">
					<Grid.Column className="first-column" mobile={ 14 } tablet={ 14 } computer={ 14 } >
						<label>User self registration</label>
					</Grid.Column>
					<Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
						<Field
							name={ ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE }
							required={ false }
							requiredErrorMessage=""
							type="checkbox"
							children={ [
								{
									label: "",
									value: ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
								}
							] }
							value={ selfSignUpConfigs.enable }
							listen={
								(values) => {
									const value = values.get(ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE).
										length > 0 ? "true" : "false";
									saveSelfRegistrationConfigs(ServerConfigurationsConstants.
										SELF_REGISTRATION_ENABLE, value);
								}
							}
							toggle
						/>
					</Grid.Column>
				</Grid.Row>
				<Divider className="m-0 mr-5 ml-5" />
				<Grid.Row columns={ 2 } className="inner-list-item">
					<Grid.Column className="first-column" mobile={ 14 } tablet={ 14 } computer={ 14 } >
						<label className={ selfSignUpConfigs?.enable?.length > 0 ? "" : "meta" }>
							Lock user account on creation
						</label>
					</Grid.Column>
					<Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
						<Field
							name={ ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION }
							required={ false }
							requiredErrorMessage=""
							type="checkbox"
							children={ [
								{
									label: "",
									value: ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION
								}
							] }
							value={ selfSignUpConfigs.accountLockOnCreation }
							listen={
								(values) => {
									const value = values.get(ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION).
										length > 0 ? "true" : "false";
									saveSelfRegistrationConfigs(ServerConfigurationsConstants.
										ACCOUNT_LOCK_ON_CREATION, value);
								}
							}
							disabled={ !(selfSignUpConfigs?.enable?.length > 0) }
							toggle
						/>
					</Grid.Column>
				</Grid.Row>
				<Divider className="m-0 mr-5 ml-5" />
				<Grid.Row columns={ 2 } className="inner-list-item">
					<Grid.Column className="first-column" mobile={ 14 } tablet={ 14 } computer={ 14 } >
						<label className={ selfSignUpConfigs?.enable?.length > 0 ? "" : "meta" }>
							Internal notification management
						</label>
					</Grid.Column>
					<Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
                        <Field
                            name={ ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED }
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
								{
									label: "",
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
							disabled={ !(selfSignUpConfigs?.enable?.length > 0) }
                            toggle
                        />
					</Grid.Column>
				</Grid.Row>
				<Divider className="m-0 mr-5 ml-5" />
				<Grid.Row columns={ 2 } className="inner-list-item">
					<Grid.Column className="first-column" mobile={ 14 } tablet={ 14 } computer={ 14 } >
						<label className={ selfSignUpConfigs?.enable?.length > 0 ? "" : "meta" }>
							Enable reCaptcha
						</label>
					</Grid.Column>
					<Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }>
						<Field
							name={ ServerConfigurationsConstants.RE_CAPTCHA }
							required={ false }
							requiredErrorMessage=""
							type="checkbox"
							children={ [
								{
									label: "",
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
							disabled={ !(selfSignUpConfigs?.enable?.length > 0) }
							toggle
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Forms>
	);

	const showUserSelfRegistrationView: ReactElement = (
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
								width={ 9 }
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
								width={ 9 }
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
							<Hint>
								{ t("devPortal:components.serverConfigs.selfRegistration.form." +
									"callbackURLRegex.hint") }
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


	const handleAccordionClick = () => {
		setAccordionState(!accordionState)
	};

	const accordion: ReactElement = (
		<Accordion fluid styled>
			<Accordion.Title
				active={ accordionState }
				index={ 0 }
				onClick={ handleAccordionClick }
				className={ (selfSignUpConfigs?.enable?.length > 0) ? "" : "disabled" }
			>
				<Grid className="middle aligned">
					<Grid.Row columns={ 2 } className="inner-list-item">
						<Grid.Column className="first-column" >
							<LinkButton className="p-3">More</LinkButton>
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
			<Accordion.Content active={ accordionState }>
				{ showUserSelfRegistrationView }
			</Accordion.Content>
		</Accordion>
	);

	return (
		<Section
			description={ t("devPortal:components.serverConfigs.selfRegistration.description") }
			header={ t("devPortal:components.serverConfigs.selfRegistration.heading") }
			icon={ SettingsSectionIcons.changePassword }
			iconMini={ SettingsSectionIcons.changePasswordMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			accordion={ accordion }
		>
			<Divider className="m-0 mb-2"/>
			<div className="main-content-inner">
				{ userSelfRegistrationSummary }
			</div>
		</Section>
	);
};
