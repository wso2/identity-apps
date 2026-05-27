/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import useAuthenticationFlowBuilderCore
    from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { Action, Element } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { ActionMetaConfigItemInterface } from "../../../models/actions";
import "./action-meta-properties.scss";

/**
 * Props interface of {@link ActionMetaProperties}
 */
interface ActionMetaPropertiesPropsInterface
    extends Pick<CommonResourcePropertiesPropsInterface, "resource" | "onChange">,
        IdentifiableComponentInterface {
    metaConfig: ActionMetaConfigItemInterface[];
}

/**
 * Generic renderer for action executor meta checkboxes.
 * Driven entirely by the `metaConfig` array — new checkboxes are added via
 * `actions.json`, not by modifying this component.
 *
 * Items with a `dependsOn` key are rendered indented beneath their parent,
 * matching the nesting pattern used in FlowCompletionProperties.
 */
const ActionMetaProperties: FunctionComponent<ActionMetaPropertiesPropsInterface> = ({
    "data-componentid": componentId = "action-meta-properties",
    metaConfig,
    resource,
    onChange
}: ActionMetaPropertiesPropsInterface): ReactElement => {
    const { lastInteractedResource, setLastInteractedResource } = useAuthenticationFlowBuilderCore();

    const getMeta = (key: string): boolean =>
        (lastInteractedResource as Element)?.action?.executor?.meta?.[key] === "true";

    const handleChange = (key: string, checked: boolean): void => {
        const currentAction: Action = (resource as Element)?.action ?? {};
        const currentMeta: Record<string, string> = currentAction?.executor?.meta ?? {};

        const updatedMeta: Record<string, string> = { ...currentMeta, [key]: String(checked) };

        // When a parent is unchecked, clear all items that depend on it.
        if (!checked) {
            metaConfig.forEach((item: ActionMetaConfigItemInterface) => {
                if (item.dependsOn === key) {
                    updatedMeta[item.key] = "false";
                }
            });
        }

        const updatedAction: Action = {
            ...currentAction,
            executor: { ...currentAction?.executor, meta: updatedMeta }
        };

        onChange("action", updatedAction, resource);
        setLastInteractedResource({ ...lastInteractedResource, action: updatedAction });
    };

    return (
        <Stack className="action-meta-properties" gap={ 1 } data-componentid={ componentId }>
            { metaConfig.map((item: ActionMetaConfigItemInterface): ReactElement => {
                const isChecked: boolean = getMeta(item.key);
                const isDisabled: boolean = item.dependsOn !== undefined ? !getMeta(item.dependsOn) : false;
                const isNested: boolean = item.dependsOn !== undefined;

                const control: ReactElement = (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={ isChecked }
                                disabled={ isDisabled }
                                onChange={ (e: ChangeEvent<HTMLInputElement>): void =>
                                    handleChange(item.key, e.target.checked)
                                }
                                data-componentid={ `${componentId}-${item.key}-checkbox` }
                            />
                        }
                        label={ item.label }
                        data-componentid={ `${componentId}-${item.key}` }
                    />
                );

                return (
                    <Box
                        key={ item.key }
                        sx={ isNested ? { display: "flex", flexDirection: "column", ml: 3 } : undefined }
                    >
                        { isDisabled && item.disabledTooltip ? (
                            <Tooltip
                                title={ item.disabledTooltip }
                                data-componentid={ `${componentId}-${item.key}-disabled-tooltip` }
                            >
                                { /* span wrapper: MUI tooltips don't fire on disabled controls. */ }
                                <span>{ control }</span>
                            </Tooltip>
                        ) : control }
                        { item.description && (
                            <FormHelperText>{ item.description }</FormHelperText>
                        ) }
                        { item.warning && (
                            <Alert
                                severity="warning"
                                className="action-meta-warning"
                                data-componentid={ `${componentId}-${item.key}-warning` }
                            >
                                { item.warning }
                            </Alert>
                        ) }
                    </Box>
                );
            }) }
        </Stack>
    );
};

export default ActionMetaProperties;
