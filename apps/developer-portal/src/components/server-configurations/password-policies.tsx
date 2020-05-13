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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { GenericIcon, Hint, Section } from "@wso2is/react-components";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Accordion, Checkbox, CheckboxProps, Divider, Form, Grid, Icon } from "semantic-ui-react";
import { getAllPasswordPolicies, updateAllPasswordPolicies } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { PasswordPoliciesInterface } from "../../models/server-configurations";

/**
 * Prop types for the password policies component.
 */
interface PasswordPoliciesProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Password policies component.
 *
 * @param {PasswordPoliciesProps} props - Props injected to the password policies component.
 *
 * @return {React.ReactElement}
 */
export const PasswordPolicies: FunctionComponent<PasswordPoliciesProps> = (
    props: PasswordPoliciesProps
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const [ passwordPoliciesConfigs, setPasswordPoliciesConfigs ] = useState<PasswordPoliciesInterface>({});
    const [ subAccordionActiveIndex, setSubAccordionActiveIndex ] = useState<number>(undefined);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleUpdateError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "updateConfigurations.error.description", { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
                    "error.message")
            }));
        } else {
            // Generic error message
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "updateConfigurations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.passwordPolicies.notifications.updateConfigurations." +
                    "genericError.message")
            }));
        }
    };

    const handleRetrievalError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "getConfigurations.error.description", { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "getConfigurations.error.message")
            }));
        } else {
            // Generic error message
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "getConfigurations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.passwordPolicies.notifications." +
                    "getConfigurations.genericError.message")
            }));
        }
    };
    
    const handleSubAccordionClick = (index) => {
        if (subAccordionActiveIndex === index) {
            setSubAccordionActiveIndex(undefined)
        } else {
            setSubAccordionActiveIndex(index)
        }
    };

    /**
     * Calls the API and update the password policies configurations.
     */
    const makePasswordPoliciesPatchCall = (data, successNotification) => {
        updateAllPasswordPolicies(data)
            .then(() => {
                setPasswordPolicyConfigsFromAPI();
                setSubAccordionActiveIndex(undefined);
                dispatch(addAlert(successNotification));
            })
            .catch((error) => {
                handleUpdateError(error);
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
            passwordHistoryCount: values.get(ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT),
            passwordHistoryEnable: passwordPoliciesConfigs.passwordHistoryEnable,
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

    const setPasswordPolicyConfigsFromAPI = () => {
        getAllPasswordPolicies()
            .then((response) => {
                const configs = {
                    passwordHistoryCount: "",
                    passwordHistoryEnable: false,
                    passwordPolicyEnable: false,
                    passwordPolicyErrorMessage: "",
                    passwordPolicyMaxLength: "",
                    passwordPolicyMinLength: "",
                    passwordPolicyPattern: ""
                };
                response.connectors.map(connector => {
                    if (connector.id === ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID) {
                        configs.passwordHistoryEnable = extractBooleanValue(connector,
                            ServerConfigurationsConstants.PASSWORD_HISTORY_ENABLE);
                        configs.passwordHistoryCount = connector.properties.find(
                            property => property.name ==
                                ServerConfigurationsConstants.PASSWORD_HISTORY_COUNT).value;
                    } else if (connector.id === ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID) {
                        configs.passwordPolicyEnable = extractBooleanValue(connector,
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
            })
            .catch((error) => {
                handleRetrievalError(error);
            });
    };

    /**
     * Load password policies from the API, on page load.
     */
    useEffect(() => {
        setPasswordPolicyConfigsFromAPI()
    }, [props]);

    const extractBooleanValue = (response, key) => {
        return response.properties.find(prop => prop.name === key).value === "true";
    };
    
    const showPasswordHistoryOtherSettings: ReactElement = (
        <Grid className="middle aligned mt-1">
            <Grid.Row columns={ 2 } className="inner-list-item mt-3 mb-3">
                <Grid.Column className="first-column" mobile={ 1 } tablet={ 1 } computer={ 1 }>
                </Grid.Column>
                <Grid.Column mobile={ 15 } tablet={ 15 } computer={ 15 }>
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
                        disabled={ !passwordPoliciesConfigs.passwordHistoryEnable }
                        data-testid={ `${ testId }-password-history-other-settings-form-password-history-count-input` }
                    />
                    <Hint disabled={ !passwordPoliciesConfigs.passwordHistoryEnable }>
                        { t("devPortal:components.serverConfigs.passwordPolicies.passwordHistory." +
                            "form.passwordHistoryCount.hint") }
                    </Hint>
                    <Form.Group
                        className={ !passwordPoliciesConfigs.passwordHistoryEnable ? "disabled" : "" }
                    >
                        <Field
                            name=""
                            required={ false }
                            requiredErrorMessage=""
                            size="small"
                            type="submit"
                            value={ t("common:update").toString() }
                            data-testid={ `${ testId }-password-history-other-settings-form-submit-button` }
                        />
                    </Form.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    const passwordHistoryAccordion: ReactElement = (
        <Accordion data-testid={ `${ testId }-password-history-accordion` }>
            <Accordion.Title
                active={ subAccordionActiveIndex === 1 }
                index={ 0 }
                onClick={ () => { handleSubAccordionClick(1) } }
            >
                <Grid className="middle aligned mt-1">
                    <Grid.Row columns={ 3 } className="inner-list-item">
                        <Grid.Column className="first-column pl-3" mobile={ 14 } tablet={ 14 } computer={ 14 } >
                            { t("devPortal:components.serverConfigs.passwordPolicies." +
                            "passwordHistory.form.enable.label") }
                        </Grid.Column>
                        <Grid.Column mobile={ 1 } tablet={ 1 } computer={ 1 }>
                            <Checkbox
                                toggle
                                onChange={
                                    (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                                        e.stopPropagation();
                                        const value = data.checked ? "true" : "false";
                                        savePasswordPoliciesConfigs(ServerConfigurationsConstants.
                                            PASSWORD_HISTORY_ENABLE, value);
                                    }
                                }
                                checked={ passwordPoliciesConfigs.passwordHistoryEnable }
                            />
                        </Grid.Column>
                        <Grid.Column
                            className="last-column pb-2" textAlign="right" mobile={ 1 } tablet={ 1 } computer={ 1 }
                        >
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
            <Accordion.Content active={ subAccordionActiveIndex === 1 }>
                { showPasswordHistoryOtherSettings }
            </Accordion.Content>
        </Accordion>
    );

    const showPasswordPolicyOtherSettings: ReactElement = (
        <Grid className="middle aligned mt-1">
            <Grid.Row columns={ 2 } className="inner-list-item mt-3 mb-3">
                <Grid.Column className="first-column" mobile={ 1 } tablet={ 1 } computer={ 1 }>
                </Grid.Column>
                <Grid.Column mobile={ 15 } tablet={ 15 } computer={ 15 }>
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
                        disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }
                        data-testid={ `${ testId }-password-policy-other-settings-policy-min-length-input` }
                    />
                    <Hint disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }>
                        { t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
                            "form.policyMinLength.hint") }
                    </Hint>
                    <Divider hidden />
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
                        disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }
                        data-testid={ `${ testId }-password-policy-other-settings-policy-max-length-input` }
                    />
                    <Hint disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }>
                        { t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
                            "form.policyMaxLength.hint") }
                    </Hint>
                    <Divider hidden />
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
                        disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }
                        data-testid={ `${ testId }-password-policy-other-settings-policy-pattern-input` }
                    />
                    <Hint disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }>
                        { t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
                            "form.policyPattern.hint") }
                    </Hint>
                    <Divider hidden />
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
                        disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }
                        data-testid={ `${ testId }-password-policy-other-settings-policy-pattern-error-message-input` }
                    />
                    <Hint disabled={ !passwordPoliciesConfigs.passwordPolicyEnable }>
                        { t("devPortal:components.serverConfigs.passwordPolicies.passwordPatterns." +
                            "form.errorMessage.hint") }
                    </Hint>
                    <Divider hidden />
                    <Form.Group
                        className={ passwordPoliciesConfigs.passwordPolicyEnable ? "" : "disabled" }
                    >
                        <Field
                            name=""
                            required={ false }
                            requiredErrorMessage=""
                            size="small"
                            type="submit"
                            value={ t("common:update").toString() }
                            data-testid={ `${ testId }-password-policy-other-settings-submit-button` }
                        />
                    </Form.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    const passwordPolicyAccordion: ReactElement = (
        <Accordion data-testid={ `${ testId }-password-policy-accordion` }>
            <Accordion.Title
                active={ subAccordionActiveIndex === 2 }
                index={ 0 }
                onClick={ () => { handleSubAccordionClick(2) } }
            >
                <Grid className="middle aligned">
                    <Grid.Row columns={ 3 } className="inner-list-item">
                        <Grid.Column className="first-column pl-3" mobile={ 14 } tablet={ 14 } computer={ 14 } >
                            { t("devPortal:components.serverConfigs.passwordPolicies." +
                                "passwordPatterns.form.enable.label") }
                        </Grid.Column>
                        <Grid.Column mobile={ 1 } tablet={ 1 } computer={ 1 }>
                            <Checkbox
                                toggle
                                onChange={
                                    (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                                        e.stopPropagation();
                                        const value = data.checked ? "true" : "false";
                                        savePasswordPoliciesConfigs(ServerConfigurationsConstants.
                                            PASSWORD_POLICY_ENABLE, value);
                                    }
                                }
                                checked={ passwordPoliciesConfigs.passwordPolicyEnable }
                            />
                        </Grid.Column>
                        <Grid.Column
                            className="last-column pb-2" textAlign="right" mobile={ 1 } tablet={ 1 } computer={ 1 }
                        >
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
            <Accordion.Content active={ subAccordionActiveIndex === 2 }>
                { showPasswordPolicyOtherSettings }
            </Accordion.Content>
        </Accordion>
    );

    const showPasswordPolicies = (
        <Forms
            onSubmit={ (values) => {
                savePasswordPoliciesAdvancedConfigs(getFormValues(values))
            } }
        >
            <Grid padded={ true } className="middle aligned">
                <Grid.Row columns={ 1 } className="inner-list-item">
                    <Grid.Column className="first-column">
                        { passwordHistoryAccordion }
                    </Grid.Column>
                </Grid.Row>
                <Divider className="mr-5 ml-5" />
                <Grid.Row columns={ 1 } className="inner-list-item">
                    <Grid.Column className="first-column">
                        { passwordPolicyAccordion }
                    </Grid.Column>
                </Grid.Row>
                <Divider className="mr-5 ml-5" hidden />
            </Grid>
        </Forms>
    );

    return (
        <Section
            description={ t("devPortal:components.serverConfigs.passwordPolicies.description") }
            header={ t("devPortal:components.serverConfigs.passwordPolicies.heading") }
            icon={ SettingsSectionIcons.changePassword }
            iconMini={ SettingsSectionIcons.changePasswordMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            data-testid={ `${ testId }-section` }
        >
            <Divider className="m-0 mb-2"/>
            <div className="main-content-inner">
                { showPasswordPolicies }
            </div>
        </Section>
    );
};

/**
 * Default props for the component.
 */
PasswordPolicies.defaultProps = {
    "data-testid": "password-policies"
};
