/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Divider from "@oxygen-ui/react/Divider";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
// eslint-disable-next-line max-len
import useAuthenticationFlowBuilderCore from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import useValidationStatus from "@wso2is/admin.flow-builder-core.v1/hooks/use-validation-status";
import { Element } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useRef } from "react";
import useGetPasswordRecoveryFlowCoreActions from "../../../api/use-get-password-recovery-flow-builder-actions";
import {
    ActionGroupInterface,
    ActionMetaConfigItemInterface,
    ActionTypeInterface
} from "../../../models/actions";
import ActionMetaProperties from "./action-meta-properties";
import "./button-extended-properties.scss";

/**
 * Props interface of {@link ButtonExtendedProperties}
 */
type ButtonExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The ButtonExtendedProperties component.
 */
const ButtonExtendedProperties: FunctionComponent<ButtonExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "button-extended-properties",
    resource,
    onChange
}: ButtonExtendedPropertiesPropsInterface): ReactElement => {
    const { data: actions } = useGetPasswordRecoveryFlowCoreActions();
    const { lastInteractedResource, setLastInteractedResource } = useAuthenticationFlowBuilderCore();
    const { selectedNotification } = useValidationStatus();

    /**
     * Per-executor meta cache keyed by executor name.
     * Populated from lastInteractedResource so that switching away from an executor
     * and coming back restores its last configured meta without requiring an additional
     * "save" step — matching the expected behaviour described in the flow builder spec.
     */
    const executorMetaCacheRef: React.MutableRefObject<Record<string, Record<string, string>>> =
        useRef<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const executorName: string | undefined =
            (lastInteractedResource as Element)?.action?.executor?.name;
        const meta: Record<string, string> | undefined =
            (lastInteractedResource as Element)?.action?.executor?.meta;

        // Only cache when there is actual meta — avoids clearing a previous entry
        // when the user switches to an executor that carries no meta (e.g. PasswordProvisioningExecutor).
        if (executorName && meta) {
            executorMetaCacheRef.current[executorName] = meta;
        }
    }, [ lastInteractedResource ]);

    /**
     * Resolve the metaConfig for whichever action type is currently selected,
     * or null when the selected action exposes no configurable meta options.
     * Matched by executor name so that saved flows (which carry existing meta values)
     * are handled correctly regardless of what is stored in executor.meta.
     */
    const selectedActionMetaConfig: ActionMetaConfigItemInterface[] | null = useMemo(() => {
        const currentExecutorName: string | undefined =
            (lastInteractedResource as Element)?.action?.executor?.name;

        if (!currentExecutorName) {
            return null;
        }

        for (const group of ((actions as unknown as ActionGroupInterface[]) ?? [])) {
            for (const actionType of (group.types ?? [])) {
                const templateExecutorName: string | undefined =
                    (actionType.action?.executor as Record<string, string>)?.name;

                if (templateExecutorName === currentExecutorName && actionType.metaConfig?.length > 0) {
                    return actionType.metaConfig;
                }
            }
        }

        return null;
    }, [ actions, lastInteractedResource ]);

    /**
     * Get the error message for the identifier field.
     */
    const errorMessage: string = useMemo(() => {
        const key: string = `${resource?.id}_action`;

        if (selectedNotification?.hasResourceFieldNotification(key)) {
            return selectedNotification?.getResourceFieldNotification(key);
        }

        return "";
    }, [ resource, selectedNotification ]);

    return (
        <Stack className="button-extended-properties" gap={ 2 } data-componentid={ componentId }>
            <div>
                <Typography className="button-extended-properties-heading">Type</Typography>
                { (actions as unknown as ActionGroupInterface[])?.map(
                    (action: ActionGroupInterface, index: number) => (
                        <Box key={ index }>
                            <Typography className="button-extended-properties-sub-heading" variant="body1">
                                { action?.display?.label }
                            </Typography>
                            <Grid container spacing={ 1 }>
                                { action.types?.map((actionType: ActionTypeInterface, typeIndex: number) => (
                                    <Grid
                                        key={ typeIndex }
                                        xs={ 6 }
                                        onClick={ () => {
                                            const clickedExecutorName: string | undefined =
                                                (actionType.action?.executor as Record<string, string>)?.name;

                                            // Restore any previously configured meta for this executor
                                            // so that switching away and coming back preserves state.
                                            const restoredMeta: Record<string, string> | undefined =
                                                clickedExecutorName
                                                    ? executorMetaCacheRef.current[clickedExecutorName]
                                                    : undefined;

                                            const newAction: Record<string, unknown> = {
                                                ...actionType.action,
                                                executor: {
                                                    ...(actionType.action?.executor as Record<string, unknown>),
                                                    ...(restoredMeta ? { meta: restoredMeta } : {})
                                                },
                                                ...((resource as Element)?.action?.next
                                                    ? { next: (resource as Element)?.action?.next }
                                                    : {})
                                            };

                                            onChange("action", newAction, resource);
                                            setLastInteractedResource({
                                                ...lastInteractedResource,
                                                action: newAction
                                            });
                                        } }
                                    >
                                        <Card
                                            className={ classNames("extended-property action-type", {
                                                error: !!errorMessage,
                                                // Compare only on executor name so that the card
                                                // stays selected regardless of what is in executor.meta.
                                                selected: (lastInteractedResource as Element)
                                                    ?.action?.executor?.name ===
                                                    (actionType.action?.executor as Record<string, string>)?.name
                                            }) }
                                            variant="outlined"
                                        >
                                            <CardContent>
                                                <Box display="flex" flexDirection="row" gap={ 1 } alignItems="center">
                                                    <Avatar
                                                        className="action-type-icon"
                                                        src={ loadStaticResource(actionType?.display?.image) }
                                                        variant="rounded"
                                                    />
                                                    <Typography variant="body2" className="action-type-name">
                                                        { actionType?.display?.label }
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )) }
                            </Grid>
                        </Box>
                    )) }
                {
                    errorMessage && (
                        <FormHelperText error>
                            { errorMessage }
                        </FormHelperText>
                    )
                }
            </div>
            { selectedActionMetaConfig && (
                <ActionMetaProperties
                    metaConfig={ selectedActionMetaConfig }
                    resource={ resource }
                    onChange={ onChange }
                    data-componentid={ `${componentId}-meta` }
                />
            ) }
            <Divider />
        </Stack>
    );
};

export default ButtonExtendedProperties;
