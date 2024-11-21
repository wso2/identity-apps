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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import some from "lodash-es/some";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import useGetSupportedProfileAttributes from "../../../api/use-get-supported-profile-attributes";
import useAuthenticationFlowBuilderCore from "../../../hooks/use-authentication-flow-builder-core-context";
import "./attribute-collector-properties.scss";

/**
 * Props interface of {@link AttributeCollectorProperties}
 */
export interface AttributeCollectorPropertiesPropsInterface extends IdentifiableComponentInterface {}

/**
 * Factory to generate the property configurator for the given element.
 *
 * @param props - Props injected to the component.
 * @returns The AttributeCollectorProperties component.
 */
const AttributeCollectorProperties: FunctionComponent<AttributeCollectorPropertiesPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-attribute-collector-properties"
}: AttributeCollectorPropertiesPropsInterface): ReactElement => {
    const { data: attributes } = useGetSupportedProfileAttributes();
    const { selectedAttributes, setSelectedAttributes, activeElementNodeId } = useAuthenticationFlowBuilderCore();

    useEffect(() => {
        if (activeElementNodeId && isEmpty(selectedAttributes[activeElementNodeId]) && !isEmpty(attributes)) {
            setSelectedAttributes({
                ...selectedAttributes,
                [activeElementNodeId]: [ attributes[0] ]
            });
        }
    }, [ activeElementNodeId, attributes ]);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">Select the attributes to collect</Typography>
            <Stack gap={ 1 }>
                { attributes?.map(attribute => {
                    return (
                        <Card
                            key={ attribute.id }
                            className="authentication-flow-builder-element-panel-draggable-node"
                            variant="elevation"
                        >
                            <CardContent>
                                <Stack direction="row" spacing={ 1 } alignItems="center">
                                    <Checkbox
                                        edge="start"
                                        tabIndex={ -1 }
                                        disableRipple
                                        inputProps={ { "aria-labelledby": attribute.id } }
                                        checked={ some(selectedAttributes[activeElementNodeId], attribute) }
                                        onChange={ () => setSelectedAttributes({
                                            ...selectedAttributes,
                                            [activeElementNodeId]: [
                                                ...selectedAttributes[activeElementNodeId],
                                                attribute
                                            ]
                                        }) }
                                    />
                                    <Typography>{ attribute.displayName }</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                }) }
            </Stack>
        </Stack>
    );
};

export default AttributeCollectorProperties;
