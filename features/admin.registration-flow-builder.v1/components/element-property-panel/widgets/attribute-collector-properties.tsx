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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import some from "lodash-es/some";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import useGetSupportedProfileAttributes from "../../../api/use-get-supported-profile-attributes";
import useRegistrationFlowBuilder from "../../../hooks/use-registration-flow-builder-core-context";
import { Attribute } from "../../../models/attributes";
import "./attribute-collector-properties.scss";

/**
 * Props interface of {@link AttributeCollectorProperties}
 */
export interface AttributeCollectorPropertiesPropsInterface extends IdentifiableComponentInterface {}

/**
 * Component to generate the properties for the attribute collector widget.
 *
 * @param props - Props injected to the component.
 * @returns The AttributeCollectorProperties component.
 */
const AttributeCollectorProperties: FunctionComponent<AttributeCollectorPropertiesPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-attribute-collector-properties"
}: AttributeCollectorPropertiesPropsInterface): ReactElement => {
    const { data: attributes } = useGetSupportedProfileAttributes();
    const { lastInteractedNodeId } = useAuthenticationFlowBuilderCore();
    const { selectedAttributes, setSelectedAttributes } = useRegistrationFlowBuilder();

    useEffect(() => {
        if (lastInteractedNodeId && isEmpty(selectedAttributes[lastInteractedNodeId]) && !isEmpty(attributes)) {
            setSelectedAttributes({
                ...selectedAttributes,
                [lastInteractedNodeId]: [ attributes[0] ]
            });
        }
    }, [ lastInteractedNodeId, attributes ]);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">Select and add user attributes you want to collect in this step</Typography>
            <Stack gap={ 1 }>
                { attributes?.map((attribute: Attribute) => {
                    return (
                        <Card
                            key={ attribute.id }
                            className="flow-builder-element-panel-draggable-node"
                            variant="elevation"
                        >
                            <CardContent>
                                <Stack direction="row" spacing={ 1 } alignItems="center">
                                    <Checkbox
                                        edge="start"
                                        tabIndex={ -1 }
                                        disableRipple
                                        inputProps={ { "aria-labelledby": attribute.id } }
                                        checked={ some(selectedAttributes[lastInteractedNodeId], attribute) }
                                        onChange={ () =>
                                            setSelectedAttributes({
                                                ...selectedAttributes,
                                                [lastInteractedNodeId]: [
                                                    ...selectedAttributes[lastInteractedNodeId],
                                                    attribute
                                                ]
                                            })
                                        }
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
