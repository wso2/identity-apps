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

import { useTheme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EdgeLabelRenderer, EdgeProps, BaseEdge as XYFlowBaseEdge, getBezierPath } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import "./social-connection-edge.scss";

/**
 * Props interface of {@link VisualFlow}
 */
export interface SocialConnectionEdgePropsInterface extends EdgeProps, IdentifiableComponentInterface {}

export const SocialConnectionEdgeKey: string = "social-connection-edge";

/**
 * A customized version of the SocialConnectionEdge component.
 *
 * @param props - Props injected to the component.
 * @returns SocialConnectionEdge component.
 */
const SocialConnectionEdge: FunctionComponent<SocialConnectionEdgePropsInterface> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    ...rest
}: SocialConnectionEdgePropsInterface): ReactElement => {
    const theme = useTheme();
    const [ edgePath, labelX, labelY ] = getBezierPath({
        sourcePosition,
        sourceX,
        sourceY,
        targetPosition,
        targetX,
        targetY
    });

    return (
        <>
            <XYFlowBaseEdge id={ id } path={ edgePath } { ...rest } />
            <EdgeLabelRenderer>
                <div
                    style={ {
                        pointerEvents: "all",
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
                    } }
                    className="edge-label-renderer__social-connection-edge nodrag nopan"
                >
                    <Card
                        sx={ {
                            backgroundColor: (theme as any).colorSchemes.dark.palette.background.default,
                            color: (theme as any).colorSchemes.dark.palette.text.primary
                        } }
                    >
                        <CardContent>
                            <Box display="flex" gap={ 1 }>
                                <img src={ data.img as string } height="20" />
                                <Typography variant="body1">{ data.label as ReactNode }</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default SocialConnectionEdge;
