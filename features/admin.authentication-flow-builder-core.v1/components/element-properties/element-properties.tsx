/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ElementPropertyConfiguratorFactory from "./element-property-configurator-factory";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";

/**
 * Props interface of {@link ElementProperties}
 */
export interface ElementPropertiesPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {}

/**
 * Component to generate the properties panel for the selected element.
 *
 * @param props - Props injected to the component.
 * @returns The ElementProperties component.
 */
const ElementProperties: FunctionComponent<ElementPropertiesPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-element-properties",
    ...rest
}: ElementPropertiesPropsInterface): ReactElement => {
    const { activeElement } = useAuthenticationFlowBuilderCore();

    const hasVariants: boolean = !isEmpty(activeElement?.variants);

    return (
        <div className="authentication-flow-builder-element-properties" data-componentid={ componentId } { ...rest }>
            { activeElement ? (
                <Stack gap={ 1 }>
                    { hasVariants
                        ? activeElement.variants.map(variant => {
                            return Object.entries(variant?.config?.field).map(([ key, value ]) => (
                                <ElementPropertyConfiguratorFactory
                                    element={ variant }
                                    key={ key }
                                    propertyKey={ key }
                                    propertyValue={ value }
                                />
                            ));
                        })
                        : Object.entries(activeElement?.config?.field).map(([ key, value ]) => (
                            <ElementPropertyConfiguratorFactory
                                element={ activeElement }
                                key={ key }
                                propertyKey={ key }
                                propertyValue={ value }
                            />
                        )) }
                </Stack>
            ) : (
                <Typography variant="body2" color="textSecondary" sx={ { padding: 2 } }>
                    No properties available.
                </Typography>
            ) }
        </div>
    );
};

export default ElementProperties;
