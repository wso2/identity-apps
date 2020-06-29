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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Section } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider } from "semantic-ui-react";
import DynamicConnectorForm from "./dynamic-connector-form";
import { SettingsSectionIcons } from "../../configs";
import { GovernanceConnectorInterface } from "../../models";
import { GovernanceConnectorUtils } from "../../utils/governance-connector";

/**
 * Prop types for the realm configurations component.
 */
interface DynamicGovernanceConnectorProps extends TestableComponentInterface {
    connector: GovernanceConnectorInterface;
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
        ["data-testid"]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const handleSubmit = (values) => {
        console.log(values)
    };

    const getConnectorInitialValues = (connector: GovernanceConnectorInterface) => {
        const values = {};
        connector?.properties.map(property => {
            if (property.value === "true") {
                values[GovernanceConnectorUtils.encodeConnectorPropertyName(property.name)] = true;
            } else if (property.value === "false") {
                values[GovernanceConnectorUtils.encodeConnectorPropertyName(property.name)] = false;
            } else {
                values[GovernanceConnectorUtils.encodeConnectorPropertyName(property.name)] = property.value;
            }
        });
        return values;
    };

    const connectorForm: ReactElement = (
        <DynamicConnectorForm onSubmit={ handleSubmit }
                              props={ { properties: connector.properties } }
                              form={ connector.name + "-form" }
                              initialValues={ getConnectorInitialValues(connector) }
                              data-testid={ `${ testId }-${ connector.name }-form` }
        />
    );

    return (
        <Section
            header={ connector?.friendlyName }
            description={ connector?.description }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            data-testid={ `${ testId }-section` }
        >
            <Divider className="m-0 mb-2"/>
            <div className="main-content-inner">
                { connectorForm }
            </div>
        </Section>
    );
};

/**
 * Default props for the component.
 */
DynamicGovernanceConnector.defaultProps = {
    "data-testid": "dynamic-governance-connector"
};
