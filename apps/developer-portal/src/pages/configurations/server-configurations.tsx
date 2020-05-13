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

import { AlertInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AccountRecovery, LoginPolicies, PasswordPolicies, UserSelfRegistration } from "../../components";
import { PageLayout } from "../../layouts";

/**
 * Props for the Server Configurations page.
 */
type ServerConfigurationsPageInterface = TestableComponentInterface;

/**
 * Governance Features page.
 *
 * @param {ServerConfigurationsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ServerConfigurationsPage: FunctionComponent<ServerConfigurationsPageInterface> = (
    props: ServerConfigurationsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <PageLayout
            title={ t("devPortal:pages.serverConfigurations.title") }
            description={ t("devPortal:pages.serverConfigurations.subTitle") }
            showBottomDivider={ true }
            data-testid={ `${ testId }-page-layout` }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 10 }>
                        <UserSelfRegistration
                            onAlertFired={ handleAlerts }
                            data-testid={ `${ testId }-user-self-registration` }
                        />
                        <Divider hidden={ true } />
                        <AccountRecovery
                            onAlertFired={ handleAlerts }
                            data-testid={ `${ testId }-account-recovery` }
                        />
                        <Divider hidden={ true } />
                        <LoginPolicies
                            onAlertFired={ handleAlerts }
                            data-testid={ `${ testId }-login-policies` }
                        />
                        <Divider hidden={ true } />
                        <PasswordPolicies
                            onAlertFired={ handleAlerts }
                            data-testid={ `${ testId }-password-policies` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ServerConfigurationsPage.defaultProps = {
    "data-testid": "server-configurations"
};
