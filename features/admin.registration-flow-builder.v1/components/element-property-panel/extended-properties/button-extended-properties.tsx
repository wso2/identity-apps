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

import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
// eslint-disable-next-line max-len
import { CommonComponentPropertyFactoryPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/common-component-property-factory";
import { Action, ActionType } from "@wso2is/admin.flow-builder-core.v1/models/actions";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import useGetRegistrationFlowCoreActions from "../../../api/use-get-registration-flow-builder-actions";
import "./button-extended-properties.scss";

/**
 * Props interface of {@link ButtonExtendedProperties}
 */
export type ButtonExtendedPropertiesPropsInterface = CommonComponentPropertyFactoryPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The ButtonExtendedProperties component.
 */
const ButtonExtendedProperties: FunctionComponent<ButtonExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "button-extended-properties"
}: ButtonExtendedPropertiesPropsInterface): ReactElement => {
    const { data: actions } = useGetRegistrationFlowCoreActions();

    return (
        <Stack className="button-extended-properties" gap={ 2 } data-componentid={ componentId }>
            <div>
                <Typography variant="h6">Action Type</Typography>
                { actions?.map((action: Action, index: number) => (
                    <Box key={ index }>
                        <Typography className="button-extended-properties-sub-heading" variant="body1">
                            { action?.display?.label }
                        </Typography>
                        <Grid container spacing={ 1 }>
                            { action.types?.map((type: ActionType, typeIndex: number) => (
                                <Grid key={ typeIndex } xs={ 6 }>
                                    <Card className="extended-property action-type" variant="outlined">
                                        <CardContent>
                                            <Box display="flex" flexDirection="row" gap={ 1 } alignItems="center">
                                                <Avatar
                                                    className="action-type-icon"
                                                    src={ type?.display?.image }
                                                    variant="rounded"
                                                />
                                                <Typography variant="body2" className="action-type-name">
                                                    { type?.display?.label }
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) }
                        </Grid>
                    </Box>
                )) }
            </div>
        </Stack>
    );
};

export default ButtonExtendedProperties;
