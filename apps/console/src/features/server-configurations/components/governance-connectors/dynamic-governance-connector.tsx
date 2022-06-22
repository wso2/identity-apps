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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import get from "lodash-es/get";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
interface DynamicGovernanceConnectorProps extends TestableComponentInterface {
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
    const { connector, [ "data-testid" ]: testId, onUpdate } = props;

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


    return serverConfigurationConfig.renderConnector(
        connector,
        connectorForm,
        connectorIllustration,
        t("console:manage.features.governanceConnectors.connectorSubHeading",
            {
                name: connector?.friendlyName
            })
    );
};

/**
 * Default props for the component.
 */
DynamicGovernanceConnector.defaultProps = {
    "data-testid": "dynamic-governance-connector"
};
