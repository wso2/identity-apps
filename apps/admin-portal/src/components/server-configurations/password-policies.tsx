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
import { getAllPasswordPolicies, updateAllPasswordPolicies } from "../../api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { PasswordPoliciesInterface } from "../../models/server-configurations";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { SettingsSectionIcons } from "../../configs";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * Constant to store the password policies from identifier.
 * @type {string}
 */
const PASSWORD_POLICIES_FORM_IDENTIFIER = "passwordPoliciesForm";

/**
 * Prop types for the password policies component.
 */
interface PasswordPoliciesProps {
	onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Password policies component.
 *
 * @param {Props} props - Props injected to the password policies component.
 * @return {JSX.Element}
 */
export const PasswordPolicies: FunctionComponent<PasswordPoliciesProps> = (props: PasswordPoliciesProps): JSX.Element => {

	const [editingForm, setEditingForm] = useState({
		[PASSWORD_POLICIES_FORM_IDENTIFIER]: false
	});

	const [passwordPoliciesConfigs, setPasswordPoliciesConfigs] = useState<PasswordPoliciesInterface>({});
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
		description: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
			"error.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
			"error.message")
	};

	const genericErrorMessage = {
		description: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
			"genericError.description"),
		level: AlertLevels.ERROR,
		message: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
			"genericError.message")
	};

	/**
	 * Calls the API and update the password policies configurations.
	 */
	const makePasswordPoliciesPatchCall = (data, successNotification) => {
		updateAllPasswordPolicies(data)
			.then(() => {
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

	const savePasswordPoliciesConfigs = (key, value) => {
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
			message: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
				"updateConfigurations.success.message")
		};
		switch (key) {
			case ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.passwordPolicies." +
					"notifications.accountLockEnable.success.description");
				break;
			case ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE:
				successNotification.description = t("devPortal:components.serverConfigs.passwordPolicies." +
					"notifications.accountDisablingEnable.success.description");
				break;
		}
		makePasswordPoliciesPatchCall(data, successNotification);
	};

	const savePasswordPoliciesAdvancedConfigs = (passwordPoliciesConfigs) => {
		const data = {
			"operation": "UPDATE",
			"properties": [
				{
					"name": ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT,
					"value": passwordPoliciesConfigs.passwordHistoryCount
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN,
					"value": passwordPoliciesConfigs.passwordPolicyPattern
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH,
					"value": passwordPoliciesConfigs.passwordPolicyMaxLength
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH,
					"value": passwordPoliciesConfigs.passwordPolicyMinLength
				},
				{
					"name": ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE,
					"value": passwordPoliciesConfigs.passwordPolicyErrorMessage
				}
			]
		};
		const successNotification = {
			description: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
				"updateConfigurations.success.description"),
			level: AlertLevels.SUCCESS,
			message: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
				"updateConfigurations.success.message")
		};
		makePasswordPoliciesPatchCall(data, successNotification);
	};

	const getFormValues = (values) => {
		return {
			passwordHistoryEnable: passwordPoliciesConfigs.passwordHistoryEnable,
			passwordHistoryCount: values.get(ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT),
			passwordPolicyEnable: passwordPoliciesConfigs.passwordPolicyEnable,
			passwordPolicyErrorMessage: values.get(
				ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE),
			passwordPolicyMaxLength: values.get(
				ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH),
			passwordPolicyMinLength: values.get(
				ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH),
			passwordPolicyPattern: values.get(
				ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN)
		};
	};

	/**
	 * Load password policies from the API, on page load.
	 */
	useEffect(() => {
		getAllPasswordPolicies()
			.then((response) => {
				const configs = {
					passwordHistoryCount: "",
					passwordHistoryEnable: [],
					passwordPolicyEnable: [],
					passwordPolicyErrorMessage: "",
					passwordPolicyMaxLength: "",
					passwordPolicyMinLength: "",
					passwordPolicyPattern: ""
				};
				response.connectors.map(connector => {
					if (connector.id === ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID) {
						configs.passwordHistoryEnable = extractArrayValue(connector,
							ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE);
						configs.passwordHistoryCount = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT).value;
					} else if (connector.id === ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID) {
						configs.passwordPolicyEnable = extractArrayValue(connector,
							ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE);
						configs.passwordPolicyMinLength = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH).value;
						configs.passwordPolicyMaxLength = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH).value;
						configs.passwordPolicyPattern = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN).value;
						configs.passwordPolicyErrorMessage = connector.properties.find(
							property => property.name ==
								ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE).value;
					}
				});
				setPasswordPoliciesConfigs(configs);
			});
	}, []);

	const extractArrayValue = (response, key) => {
		return response.properties.find(prop => prop.name === key).value === "true" ? [key] : [];
	};

	const showPasswordPoliciesSummary = (
		<Forms>
			<Grid padded={ true }>
				<Grid.Row columns={ 1 }>
					<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
						<Field
							name={ ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE }
							required={ false }
							requiredErrorMessage=""
							type="checkbox"
							children={ [
								{
									label: t("devPortal:components.serverConfigs.passwordPolicies." +
										"passwordHistory.form.enable.label"),
									value: ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE
								}
							] }
							value={ passwordPoliciesConfigs.passwordHistoryEnable }
							listen={
								(values) => {
									const value = values.get(ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE).
										length > 0 ? "true" : "false";
									savePasswordPoliciesConfigs(ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE,
										value);
								}
							}
							toggle
						/>
						<Field
							name={ ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE }
							required={ false }
							requiredErrorMessage=""
							type="checkbox"
							children={ [
								{
									label: t("devPortal:components.serverConfigs.passwordPolicies." +
										"passwordPatterns.form.enable.label"),
									value: ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE
								}
							] }
							value={ passwordPoliciesConfigs.passwordPolicyEnable }
							listen={
								(values) => {
									const value = values.get(ServerConfigurationsConstants.
										PASSWORD_POLICY_ENABLE).length > 0 ? "true" : "false";
									savePasswordPoliciesConfigs(ServerConfigurationsConstants.
										PASSWORD_POLICY_ENABLE, value);
								}
							}
							toggle
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Forms>
	);

	const showAdvancedPasswordPoliciesView = editingForm[PASSWORD_POLICIES_FORM_IDENTIFIER] && (
		<EditSection>
			<Forms
				onSubmit={ (values) => {
					savePasswordPoliciesAdvancedConfigs(getFormValues(values));
				} }
				resetState={ reset }
			>
				<Grid>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<h4>Password History</h4>
							<Field
								label={ t("devPortal:components.serverConfigs.passwordPolicies.passwordHistory." +
									"form.passwordHistoryCount.label") }
								name={ ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT }
								placeholder={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordHistory.form.passwordHistoryCount.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordHistory.form.passwordHistoryCount.validations.empty") }
								type="number"
								value={ passwordPoliciesConfigs.passwordHistoryCount }
								width={ 9 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.passwordPolicies.passwordHistory." +
									"form.passwordHistoryCount.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Divider/>
							<h4>Password Pattern</h4>
							<Field
								label={ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyMinLength.label") }
								name={ ServerConfigurationsConstants.PASSWORD_POLICY_MIN_LENGTH }
								placeholder={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyMinLength.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyMinLength.validations.empty") }
								type="number"
								value={ passwordPoliciesConfigs.passwordPolicyMinLength }
								width={ 9 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyMinLength.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyMaxLength.label") }
								name={ ServerConfigurationsConstants.PASSWORD_POLICY_MAX_LENGTH }
								placeholder={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyMaxLength.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyMaxLength.validations.empty") }
								type="number"
								value={ passwordPoliciesConfigs.passwordPolicyMaxLength }
								width={ 9 }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyMaxLength.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyPattern.label") }
								name={ ServerConfigurationsConstants.PASSWORD_POLICY_PATTERN }
								placeholder={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyPattern.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.policyPattern.validations.empty") }
								type="text"
								value={ passwordPoliciesConfigs.passwordPolicyPattern }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.policyPattern.hint") }
							</Hint>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={ 1 }>
						<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
							<Field
								label={ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.errorMessage.label") }
								name={ ServerConfigurationsConstants.PASSWORD_POLICY_ERROR_MESSAGE }
								placeholder={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.errorMessage.placeholder") }
								required={ true }
								requiredErrorMessage={ t("devPortal:components.serverConfigs.passwordPolicies." +
									"passwordPatterns.form.errorMessage.validations.empty") }
								type="text"
								value={ passwordPoliciesConfigs.passwordPolicyErrorMessage }
							/>
							<Hint>
								{ t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
									"form.errorMessage.hint") }
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
										hideFormEditView(PASSWORD_POLICIES_FORM_IDENTIFIER);
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
			description={ t("devPortal:components.serverConfigs.passwordPolicies.description") }
			header={ t("devPortal:components.serverConfigs.passwordPolicies.heading") }
			iconMini={ SettingsSectionIcons.profileExportMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => showFormEditView(PASSWORD_POLICIES_FORM_IDENTIFIER) }
			primaryAction={ t("devPortal:components.serverConfigs.passwordPolicies.actionTitles.config") }
			primaryActionIcon="key"
			showActionBar={ !editingForm[PASSWORD_POLICIES_FORM_IDENTIFIER] }
		>
			{ showPasswordPoliciesSummary }
			{ showAdvancedPasswordPoliciesView }
		</Section>
	);
};
