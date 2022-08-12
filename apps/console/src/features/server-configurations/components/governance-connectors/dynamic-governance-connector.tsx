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

import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Message, Text } from "@wso2is/react-components";
import camelCase from "lodash-es/camelCase";
import get from "lodash-es/get";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon } from "semantic-ui-react";
import DynamicConnectorForm from "./dynamic-connector-form";
import { serverConfigurationConfig } from "../../../../extensions";
import { updateGovernanceConnector } from "../../api";
import { getGovernanceConnectorIllustrations } from "../../configs";
import { ServerConfigurationsConstants } from "../../constants";
import { GovernanceConnectorInterface } from "../../models";
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
 * @param {DynamicGovernanceConnectorProps} props - Props injected to the dynamic connector component.
 *
 * @return {React.ReactElement}
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

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ connectorIllustration, setConnectorIllustration ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Set the connector illustration.
     */
    useEffect(() => {
        if (!connector || !connector.id) {
            return;
        }

        const illustration: string = get(getGovernanceConnectorIllustrations(), connector.id,
            getGovernanceConnectorIllustrations()?.default);

        setConnectorIllustration(illustration);
    }, [ connector, getGovernanceConnectorIllustrations ]);

    const handleUpdateError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.error.description",
                        { description: error.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications." + "updateConnector.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.genericError.message"
                    )
                })
            );
        }
    };

    const handleSubmit = (values) => {
        const data = {
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

        updateGovernanceConnector(data, connector.categoryId, connector.id)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.governanceConnectors.notifications." +
                            "updateConnector.success.description",
                            { name: connector.friendlyName }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.governanceConnectors.notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );

                onUpdate();
            })
            .catch((error) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const getConnectorInitialValues = (connector: GovernanceConnectorInterface) => {
        const values = {};

        connector?.properties.map((property) => {
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
                properties: connector.properties.filter(
                    (property => serverConfigurationConfig.connectorPropertiesToShow.includes(property.name)
                        || serverConfigurationConfig.connectorPropertiesToShow
                            .includes(ServerConfigurationsConstants.ALL)))
            } }
            form={ kebabCase(connector.friendlyName) + "-form" }
            initialValues={ getConnectorInitialValues(connector) }
            data-testid={ `${ testId }-${ connector.name }-form` }
            isSubmitting={ isSubmitting }
        />
    );

    /**
     * Resolve connector title.
     *
     * @param {GovernanceConnectorInterface} connector - Connector object.
     * @returns {ReactNode}
     */
    const resolveConnectorTitle = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        let connectorName: string = connector.friendlyName;
    
        if (connectorName.includes(ServerConfigurationsConstants.DEPRECATION_MATCHER)) {
            connectorName = connectorName.replace(ServerConfigurationsConstants.DEPRECATION_MATCHER, "");
        }

        // eslint-disable-next-line max-len
        return t(`console:manage.features.governanceConnectors.connectorCategories.${camelCase(connector?.category)}.connectors.${camelCase(connector?.name)}.friendlyName`);
    };

    /**
     * Resolve connector description.
     *
     * @param {GovernanceConnectorInterface} connector - Connector object.
     * @returns {ReactNode}
     */
    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        let connectorName: string = connector.friendlyName;
    
        if (connectorName.includes(ServerConfigurationsConstants.DEPRECATION_MATCHER)) {
            connectorName = connectorName.replace(ServerConfigurationsConstants.DEPRECATION_MATCHER, "");
        }

        return t("console:manage.features.governanceConnectors.connectorSubHeading", {
            name: connectorName
        });
    };

    /**
     * Resolve connector message.
     *
     * @param {GovernanceConnectorInterface} connector - Connector object.
     * @returns {ReactNode}
     */
    const resolveConnectorMessage = (connector: GovernanceConnectorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (connector.id === ServerConfigurationsConstants.WSO2_ANALYTICS_ENGINE_CONNECTOR_CATEGORY_ID) {
            return (
                <Message
                    warning
                    className="mb-5 connector-info"
                    data-componentid={ `${ componentId }-${ connector.id }-deprecation-warning` }
                >
                    <Icon name="warning sign" />
                    {
                        t("console:manage.features.governanceConnectors.connectorCategories." +
                            "otherSettings.connectors.analyticsEngine.messages.deprecation.heading")
                    }
                    <Text spaced="top">
                        <Trans
                            i18nKey={
                                "console:manage.features.governanceConnectors.connectorCategories." +
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
        connectorIllustration,
        resolveConnectorTitle(connector),
        resolveConnectorDescription(connector),
        resolveConnectorMessage(connector)
    );
};

/**
 * Default props for the component.
 */
DynamicGovernanceConnector.defaultProps = {
    "data-componentid": "dynamic-governance-connector",
    "data-testid": "dynamic-governance-connector"
};
