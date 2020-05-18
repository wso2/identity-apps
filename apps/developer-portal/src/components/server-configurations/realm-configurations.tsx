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
import { Hint, Section } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { getServerConfigurations, updateServerConfigurations } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { ServerConfigurationsConstants } from "../../constants";
import { RealmConfigurationsInterface } from "../../models";
import { URLInputComponent } from "../applications/components";

/**
 * Prop types for the realm configurations component.
 */
interface RealmConfigurationProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * User Account Recovery component.
 *
 * @param {RealmConfigurationProps} props - Props injected to the realm configurations component.
 *
 * @return {React.ReactElement}
 */
export const RealmConfiguration: FunctionComponent<RealmConfigurationProps> = (
    props: RealmConfigurationProps
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const [realmConfigurations, setRealmConfigurations] = useState<RealmConfigurationsInterface>({});
    const [homeRealmIdentifiers, setHomeRealmIdentifiers] = useState<string>(undefined);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleUpdateError = (error): void => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "updateConfigurations.error.description", { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.realmConfiguration.notifications.updateConfigurations." +
                    "error.message")
            }));
        } else {
            // Generic error message
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "updateConfigurations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.realmConfiguration.notifications.updateConfigurations." +
                    "genericError.message")
            }));
        }
    };

    const handleRetrievalError = (error): void => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "getConfigurations.error.description", { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "getConfigurations.error.message")
            }));
        } else {
            // Generic error message
            dispatch(addAlert({
                description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "getConfigurations.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                    "getConfigurations.genericError.message")
            }));
        }
    };

    const setRealmConfigurationConfigsFromAPI = (): void => {
        getServerConfigurations()
            .then((response) => {
                const configs = {
                    homeRealmIdentifiers: response.homeRealmIdentifiers,
                    idleSessionTimeoutPeriod: response.idleSessionTimeoutPeriod,
                    rememberMePeriod: response.rememberMePeriod
                };
                setRealmConfigurations(configs);
            })
            .catch((error) => {
                handleRetrievalError(error);
            });
    };

    /**
     * Load realm configurations from the API, on page load.
     */
    useEffect((): void => {
        setRealmConfigurationConfigsFromAPI();
    }, [props]);

    const saveRealmConfigurations = (values): void => {
        const data = [
            {
                "operation": "REPLACE",
                "path": "/idleSessionTimeoutPeriod",
                "value": values.get(ServerConfigurationsConstants.IDLE_SESSION_TIMEOUT_PERIOD)
            },
            {
                "operation": "REPLACE",
                "path": "/rememberMePeriod",
                "value": values.get(ServerConfigurationsConstants.REMEMBER_ME_PERIOD)
            }
        ];
        // Decode home realm identifiers
        const splitHomeRealmIdentifiers = homeRealmIdentifiers.split(",");
        data.push({
            "operation": "REPLACE",
            "path": "/homeRealmIdentifiers/0",
            "value": splitHomeRealmIdentifiers[0]
        });
        for (let i = 1; i < realmConfigurations.homeRealmIdentifiers.length; i++) {
            data.push({
                "operation": "REMOVE",
                "path": "/homeRealmIdentifiers/1",
                "value": ""
            })
        }
        for (let i = 1; i < splitHomeRealmIdentifiers.length; i++) {
            data.push({
                "operation": "ADD",
                "path": "/homeRealmIdentifiers/1",
                "value": splitHomeRealmIdentifiers[i]
            })
        }
        updateServerConfigurations(data)
            .then(() => {
                setRealmConfigurationConfigsFromAPI();
                dispatch(addAlert({
                    description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                        "updateConfigurations.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                        "updateConfigurations.success.message")
                }));
            })
            .catch((error) => {
                handleUpdateError(error);
            });
    };

    const getHomeRealmIdentifiersString = (): string => {
        return realmConfigurations?.homeRealmIdentifiers?.toString()
    };

    const realmConfigurationView: ReactElement = (
        <Forms
            onSubmit={ (values) => {
                if (homeRealmIdentifiers.length == 0) {
                    dispatch(addAlert({
                        description: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                            "emptyHomeRealmIdentifiers.error.description"),
                        level: AlertLevels.WARNING,
                        message: t("devPortal:components.serverConfigs.realmConfiguration.notifications." +
                            "emptyHomeRealmIdentifiers.error.message")
                    }));
                } else {
                    saveRealmConfigurations(values);
                }
            } }
        >
            <Grid padded={ true }>
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <URLInputComponent
                            urlState={ homeRealmIdentifiers }
                            setURLState={ setHomeRealmIdentifiers }
                            labelName={
                                t("devPortal:components.serverConfigs.realmConfiguration.form." +
                                    "homeRealmIdentifiers.label")
                            }
                            required={ true }
                            value={ getHomeRealmIdentifiersString() }
                            placeholder={
                                t("devPortal:components.serverConfigs.realmConfiguration.form." +
                                    "homeRealmIdentifiers.placeholder")
                            }
                            validationErrorMsg={ "" }
                            validation={ () => {
                                return true;
                            } }
                            hint={
                                t("devPortal:components.serverConfigs.realmConfiguration.form." +
                                    "homeRealmIdentifiers.hint")
                            }
                            data-testid={ `${ testId }-callback-url-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            name={ ServerConfigurationsConstants.IDLE_SESSION_TIMEOUT_PERIOD }
                            required={ false }
                            requiredErrorMessage=""
                            type="number"
                            value={ realmConfigurations.idleSessionTimeoutPeriod }
                            toggle
                            data-testid={ `${ testId }-idle-session-timeout` }
                            label={ t("devPortal:components.serverConfigs.realmConfiguration." +
                                "form.idleSessionTimeoutPeriod.label") }
                        />
                        <Hint>
                            { t("devPortal:components.serverConfigs.realmConfiguration." +
                                "form.idleSessionTimeoutPeriod.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            name={ ServerConfigurationsConstants.REMEMBER_ME_PERIOD }
                            required={ false }
                            requiredErrorMessage=""
                            type="number"
                            value={ realmConfigurations.rememberMePeriod }
                            toggle
                            data-testid={ `${ testId }-remember-me-period` }
                            label={ t("devPortal:components.serverConfigs.realmConfiguration." +
                                "form.rememberMePeriod.label") }
                        />
                        <Hint>
                            { t("devPortal:components.serverConfigs.realmConfiguration." +
                                "form.rememberMePeriod.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            name=""
                            required={ false }
                            requiredErrorMessage=""
                            size="small"
                            type="submit"
                            value={ t("common:update").toString() }
                            data-testid={ `${ testId }-form-submit-button` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );

    return (
        <Section
            description={ t("devPortal:components.serverConfigs.realmConfiguration.description") }
            header={ t("devPortal:components.serverConfigs.realmConfiguration.heading") }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            data-testid={ `${ testId }-section` }
        >
            <Divider className="m-0 mb-2"/>
            <div className="main-content-inner">
                { realmConfigurationView }
            </div>
        </Section>
    );
};

/**
 * Default props for the component.
 */
RealmConfiguration.defaultProps = {
    "data-testid": "realm-configurations"
};
