/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo } from "react";
import { View } from "../view/view";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import { useNodeId } from "@xyflow/react";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import "./end.scss";
import Stack from "@oxygen-ui/react/Stack";
import Avatar from "@oxygen-ui/react/Avatar";
import Typography from "@oxygen-ui/react/Typography";
import { useTranslation } from "react-i18next";

/**
 * Props interface of {@link End}
 */
export interface EndPropsInterface
    extends Pick<CommonStepFactoryPropsInterface, "data" | "resource">,
        IdentifiableComponentInterface {
    /**
     * Custom heading for the end node. Defaults to "End".
     */
    heading?: string;
    /**
     * Custom restricted component types that are not allowed in the end node.
     */
    restrictedComponentTypes?: string[];
}

/**
 * End Node component that composes with View and applies restrictions.
 * End nodes typically don't allow certain flow control components and don't have source handles.
 *
 * @param props - Props injected to the component.
 * @returns End node component.
 */
const End: FunctionComponent<EndPropsInterface> = memo(
    ({
        heading = "End",
        restrictedComponentTypes = [],
        data,
        resource,
        "data-componentid": componentId = "end"
    }: EndPropsInterface): ReactElement => {
        const { t } = useTranslation();
        const stepId: string = useNodeId();
        const { setLastInteractedResource, setLastInteractedStepId, setResourcePropertiesPanelHeading } = useAuthenticationFlowBuilderCore();

        /**
         * Get allowed types by filtering out restricted types from the default allowed types.
         *
         * @returns Array of allowed component types for the end node droppable area.
         */
        const getAllowedTypes = (): string[] => {
            const allowedTypes: string[] = VisualFlowConstants.FLOW_BUILDER_FLOW_COMPLETION_VIEW_ALLOWED_RESOURCE_TYPES;

            return allowedTypes.filter((type: string) => !restrictedComponentTypes.includes(type));
        };

        return (
            <View
                heading={ heading }
                droppableAllowedTypes={ getAllowedTypes() }
                enableSourceHandle={ false }
                data={ data }
                resource={ resource }
                className="flow-builder-end-step"
                deletable={ false }
                configurable={ true }
                data-componentid={ componentId }
                onConfigure={ (): void => {
                    setLastInteractedStepId(stepId);
                    setLastInteractedResource({
                        ...resource,
                        config: {
                            ...(resource?.config || {}),
                            ...((typeof data?.config === "object" && data?.config !== null) ? data.config : {})
                        }
                    });

                    // Override the property panel heading.
                    setResourcePropertiesPanelHeading(
                        <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                            <Avatar src={ resource?.display?.image } variant="square" />
                            <Typography variant="h6">{ t("flows.core.steps.end.flowCompletionProperties") }</Typography>
                        </Stack>
                    );
                } }
            />
        );
    },
    (prevProps: EndPropsInterface, nextProps: EndPropsInterface) => {
        return (
            prevProps.data === nextProps.data &&
            prevProps.heading === nextProps.heading &&
            JSON.stringify(prevProps.restrictedComponentTypes) === JSON.stringify(nextProps.restrictedComponentTypes)
        );
    }
);

export default End;
