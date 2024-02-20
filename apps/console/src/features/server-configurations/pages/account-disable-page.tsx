/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Icon, Message } from "semantic-ui-react";
import { AppConstants, history } from "../../core";
import { updateGovernanceConnector } from "../api/governance-connectors";
import { useGetConnectorDetails } from "../api/use-get-connector-details";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { ConnectorPropertyInterface, UpdateGovernanceConnectorConfigInterface } from "../models/governance-connectors";

/**
 * Account Disable configuration page.
 *
 * @param props - Props injected to the component.
 */
export const AccountDisableConfigurePage: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isAccountDisablingEnabled, setIsAccountDisablingEnabled ] = useState<boolean>(false);

    const {
        data: connectorData,
        isLoading: isConnectorFetchRequestLoading,
        error: connectorFetchError,
        mutate: mutateConnectorData
    } = useGetConnectorDetails(
        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
        ServerConfigurationsConstants.ACCOUNT_DISABLING_DYNAMIC_CONNECTOR_ID
    );

    /**
     * Fetch the connector details on component load.
     */
    useEffect(() => {
        if (!isConnectorFetchRequestLoading && connectorData) {
            let isEnabled: boolean = false;

            const enableProperty: ConnectorPropertyInterface = connectorData.properties?.find(
                (property: ConnectorPropertyInterface) => property.name === ServerConfigurationsConstants
                    .ACCOUNT_DISABLING_ENABLE
            );

            if (enableProperty) {
                isEnabled = enableProperty.value === "true";
            }
            setIsAccountDisablingEnabled(isEnabled);
        }
    }, [ isConnectorFetchRequestLoading, connectorData ]);

    /**
     * Show an error notification if the connector fetch request failed.
     */
    useEffect(() => {
        if (connectorFetchError) {
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.jwtPrivateKeyConfiguration.notifications." +
                        "fetchConnectorError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.jwtPrivateKeyConfiguration.notifications." +
                        "fetchConnectorError.message"
                    )
                })
            );
        }
    }, [ connectorFetchError ]);

    /**
     * Handles back button click event
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * Handles the account disabling toggle change event.
     *
     * @param _ - Event.
     * @param data - Checkbox data.
     */
    const handleToggle = (_: SyntheticEvent, data: CheckboxProps) => {
        setIsAccountDisablingEnabled(data.checked);
        const updatePayload: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [
                {
                    name: ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE,
                    value: data.checked.toString()
                }
            ]
        };

        updateGovernanceConnector(
            updatePayload,
            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
            ServerConfigurationsConstants.ACCOUNT_DISABLING_DYNAMIC_CONNECTOR_ID
        ).then(() => {
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.success.description",
                        { name: "Account Disabling" }
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications.updateConnector.success.message"
                    )
                })
            );
        }).catch(() => {
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications.updateConnector.error.message"
                    )
                })
            );
        }).finally(() => {
            mutateConnectorData();
        });
    };

    return (
        <PageLayout
            pageTitle={ t("console:manage.features.governanceConnectors.connectorCategories." +
                "accountManagement.connectors.accountDisableHandler.friendlyName") }
            title={ t("console:manage.features.governanceConnectors.connectorCategories." +
                "accountManagement.connectors.accountDisableHandler.friendlyName") }
            description={ t("console:manage.features.governanceConnectors.connectorCategories.accountManagement." +
                "connectors.accountDisableHandler.description") }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-componentid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:manage.features.governanceConnectors.goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin
            pageHeaderMaxWidth
        >
            <Checkbox
                label={ isAccountDisablingEnabled ? t("common:enabled") : t("common:disabled") }
                onChange={ handleToggle }
                checked={ isAccountDisablingEnabled }
                readOnly={ false }
                data-componentid={ `${ componentId }-enable-toggle` }
                toggle
            />
            {
                <Grid className="mt-2" >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 10 }>
                            <Message
                                content={ (
                                    <>
                                        <Icon name="info circle"/>
                                        { t("console:manage.features.governanceConnectors.connectorCategories." +
                                            "accountManagement.connectors.accountDisableHandler." +
                                            "properties.accountDisableHandlerEnable.hint") }
                                    </>
                                ) }
                                info
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AccountDisableConfigurePage.defaultProps = {
    "data-componentid": "account-disable-configure-page"
};

export default AccountDisableConfigurePage;
