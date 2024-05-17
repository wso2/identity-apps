/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { 
    AlertLevels, 
    IdentifiableComponentInterface, 
    TestableComponentInterface 
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { 
    Message, 
    Text 
} from "@wso2is/react-components";
import camelCase from "lodash-es/camelCase";
import kebabCase from "lodash-es/kebabCase";
import React, { 
    Dispatch, 
    FunctionComponent, 
    ReactElement, 
    ReactNode, 
    useState 
} from "react";
import { 
    Trans, 
    useTranslation 
} from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon } from "semantic-ui-react";
import DynamicConnectorForm from "./dynamic-connector-form";
import { 
    IdentityAppsApiException 
} from "@wso2is/core/dist/types/exceptions/identity-apps-api-exception";
import { AddAlertAction } from "@wso2is/core/dist/types/store/actions/types/global";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1/configs/server-configuration";
import { updateGovernanceConnector } from "../../api";
import { ServerConfigurationsConstants } from "../../constants";
import { 
    ConnectorPropertyInterface, 
    GovernanceConnectorInterface, 
    UpdateGovernanceConnectorConfigInterface 
} from "../../models";
import { GovernanceConnectorUtils } from "../../utils";

/**
 * Prop types for the realm configurations component.
 */
interface DynamicGovernanceConnectorProps extends TestableComponentInterface, IdentifiableComponentInterface {
    connector: GovernanceConnectorInterface;
    onUpdate: () => void;
}

/**
 * Dynamic governance connector component.
 *
 * @param props - Props injected to the dynamic connector component.
 *
 * @returns React.ReactElement
 */
export const DynamicGovernanceConnector: FunctionComponent<DynamicGovernanceConnectorProps> = (
    props: DynamicGovernanceConnectorProps
): ReactElement => {

    const {
        connector,
        onUpdate,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch<AddAlertAction<{
            description: string;
            level: AlertLevels;
            message: string;
        }>> = useDispatch();

    const { t, i18n } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleUpdateError = (error: IdentityAppsApiException) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.error.description",
                        { description: error.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." + "updateConnector.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.message"
                    )
                })
            );
        }
    };

    const handleSubmit = (values: Record<string, string | boolean>) => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };
        
        for (const key in values) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                value: values[ key ]
            });
        }

        if (serverConfigurationConfig.connectorToggleName[ connector?.name ]
            && serverConfigurationConfig.autoEnableConnectorToggleProperty) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]),
                value: "true"
            });
        }

        setIsSubmitting(true);

        updateGovernanceConnector(data, connector?.categoryId, connector?.id)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.description",
                            { name: resolveConnectorTitle(connector) }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );

                onUpdate();
            })
            .catch((error: IdentityAppsApiException) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const getConnectorInitialValues = (connector: GovernanceConnectorInterface) => {
        const values: Record<string, string | boolean>= {};

        connector?.properties.map((property: ConnectorPropertyInterface) => {
            if (property.value === "true") {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = true;
            } else if (property.value === "false") {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = false;
            } else {
                values[ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) ] = property.value;
            }
        });

        return values;
    };

    const connectorForm: ReactElement = (
        <DynamicConnectorForm
            onSubmit={ handleSubmit }
            connector={ connector }
            props={ {
                properties: connector?.properties.filter(
                    ((property: ConnectorPropertyInterface) => 
                        serverConfigurationConfig.connectorPropertiesToShow.includes(property.name)
                        || serverConfigurationConfig.connectorPropertiesToShow
                            .includes(ServerConfigurationsConstants.ALL)))
            } }
            form={ kebabCase(connector?.friendlyName) + "-form" }
            initialValues={ getConnectorInitialValues(connector) }
            data-testid={ `${ testId }-${ connector?.name }-form` }
            isSubmitting={ isSubmitting }
        />
    );

    /**
     * Resolve connector title.
     *
     * @param connector - Connector object.
     * @returns ReactNode
     */
    const resolveConnectorTitle = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (connector?.id === ServerConfigurationsConstants.PASSWORD_EXPIRY_CONNECTOR_ID) {
            return t("governanceConnectors:connectorCategories.passwordPolicies." +
            "connectors.passwordExpiry.friendlyName");
        }

        if (connector?.id === ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID) {
            return t("governanceConnectors:connectorCategories.userOnboarding." +
            "connectors.askPassword.friendlyName");
        }

        if (connector?.id === ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID) {
            return t("governanceConnectors:connectorCategories.otherSettings." +
            "connectors.userClaimUpdate.friendlyName");
        }

        const connectorTitleKey: string = "governanceConnectors:connectorCategories." +
            camelCase(connector?.category) + ".connectors." + camelCase(connector?.name) + ".friendlyName";
        let connectorTitle: string = connector?.friendlyName;

        if (i18n.exists(connectorTitleKey)) {
            connectorTitle = t(connectorTitleKey);
        }

        return connectorTitle;
    };

    /**
     * Resolve connector description.
     *
     * @param connector - Connector object.
     * @returns ReactNode
     */
    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        let connectorName: string = connector?.friendlyName;

        if (connector?.id === ServerConfigurationsConstants.PASSWORD_EXPIRY_CONNECTOR_ID) {
            connectorName = t("governanceConnectors:connectorCategories.passwordPolicies." +
            "connectors.passwordExpiry.friendlyName");
        }

        if (connector?.id === ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID) {
            connectorName = t("governanceConnectors:connectorCategories.userOnboarding." +
            "connectors.askPassword.friendlyName");
        }

        if (connector?.id === ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID) {
            connectorName = t("governanceConnectors:connectorCategories.otherSettings." +
            "connectors.userClaimUpdate.friendlyName");
        }

        if (connectorName.includes(ServerConfigurationsConstants.DEPRECATION_MATCHER)) {
            connectorName = connectorName.replace(ServerConfigurationsConstants.DEPRECATION_MATCHER, "");
        }

        return t("governanceConnectors:connectorSubHeading", {
            name: connectorName
        });
    };

    /**
     * Resolve connector message.
     *
     * @param connector - Connector object.
     * @returns ReactNode
     */
    const resolveConnectorMessage = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (connector?.id === ServerConfigurationsConstants.WSO2_ANALYTICS_ENGINE_CONNECTOR_CATEGORY_ID) {
            return (
                <Message
                    warning
                    className="mb-5 connector-info"
                    data-componentid={ `${ componentId }-${ connector?.id }-deprecation-warning` }
                >
                    <Icon name="warning sign" />
                    {
                        t("governanceConnectors:connectorCategories." +
                            "otherSettings.connectors.analyticsEngine.messages.deprecation.heading")
                    }
                    <Text spaced="top">
                        <Trans
                            i18nKey={
                                "governanceConnectors:connectorCategories." +
                                "otherSettings.connectors.analyticsEngine.messages.deprecation.description"
                            }
                        >
                            WSO2 Identity Server Analytics is now deprecated. Use <Text
                                inline
                                weight="bold"
                            >
                                ELK Analytics
                            </Text> instead.
                        </Trans>
                    </Text>
                </Message>
            );
        }

        return null;
    };

    return serverConfigurationConfig.renderConnector(
        connector,
        connectorForm,
        String(resolveConnectorTitle(connector)),
        resolveConnectorDescription(connector),
        resolveConnectorMessage(connector),
        ""
    );
};

/**
 * Default props for the component.
 */
DynamicGovernanceConnector.defaultProps = {
    "data-componentid": "dynamic-governance-connector",
    "data-testid": "dynamic-governance-connector"
};
