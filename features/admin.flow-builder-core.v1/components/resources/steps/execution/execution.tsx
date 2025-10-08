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
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, ReactElement, memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ExecutionMinimal from "./execution-minimal";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useValidationStatus from "../../../../hooks/use-validation-status";
import Notification, { NotificationType } from "../../../../models/notification";
import { ExecutionStepViewTypes, ExecutionTypes, Step } from "../../../../models/steps";
import { ValidationErrorBoundary } from "../../../validation-panel/validation-error-boundary";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import View from "../view/view";

/**
 * Props interface of {@link Execution}
 */
export type ExecutionPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Execution Node component.
 *
 * @param props - Props injected to the component.
 * @returns Execution node component.
 */
const Execution: FC<ExecutionPropsInterface> = memo(({
    id,
    data,
    resources
}: ExecutionPropsInterface): ReactElement => {
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();
    const {
        addNotification, removeNotification, setOpenValidationPanel, setSelectedNotification
    } = useValidationStatus();
    const { t } = useTranslation();

    const components: Element[] = data?.components as Element[] || [];

    /*
    * Resolve resource for the execution step.
    */
    const resolveResource = (executionType: ExecutionTypes): Step | undefined => {
        switch (executionType) {
            case ExecutionTypes.PasskeyEnrollment: {
                const resource: Step | undefined = resources?.find((resource: Step) =>
                    resource.display.label === ExecutionStepViewTypes.PasskeyView);

                if (resource) {
                    const resourceCopy: Step | undefined = cloneDeep(resource);

                    resourceCopy.display.displayname = t("flows:core.executions.names.passkeyEnrollment");

                    return resourceCopy;
                }

                return resource;
            }
            case ExecutionTypes.MagicLinkExecutor: {
                const resource: Step | undefined = resources?.find((resource: Step) =>
                    resource.display.label === ExecutionStepViewTypes.MagicLinkView);

                if (resource) {
                    const resourceCopy: Step | undefined = cloneDeep(resource);

                    resourceCopy.display.displayname = t("flows:core.executions.names.magicLink");

                    return resourceCopy;
                }

                return resource;
            }
            case ExecutionTypes.ConfirmationCode: {
                const resource: Step | undefined = resources?.find((resource: Step) =>
                    resource.display.label === ExecutionStepViewTypes.Default);

                if (resource) {
                    const resourceCopy: Step | undefined = cloneDeep(resource);

                    resourceCopy.display.displayname = t("flows:core.executions.names.confirmationCode");

                    return resourceCopy;
                }

                return resource;
            }
            default: {
                return resources?.find((resource: Step) =>
                    resource.display.label === ExecutionStepViewTypes.Default);
            }
        }
    };

    /**
     * Full resource object with data included.
     */
    const fullResource: Step = useMemo(() => {

        const resource: Step | undefined = resolveResource((data?.action as any)?.executor?.name);

        if (!resource || !data) {
            return;
        }

        return cloneDeep({
            id,
            ...resource,
            data
        }) as Step;
    }, [ data, resources, JSON.stringify(data?.action) ]);

    useEffect(() => {

        // Executors that need to show the landing info notification.
        const executorsWithLandingInfo: ExecutionTypes[] = [
            ExecutionTypes.ConfirmationCode
        ];

        if (executorsWithLandingInfo.includes((data?.action as any)?.executor?.name)) {

            const infoNotification: Notification = new Notification(
                `${id}_info_landing`,
                t("flows:core.executions.landing.message", {
                    executor: (fullResource?.display as any)?.displayname || fullResource.display.label
                }),
                NotificationType.INFO
            );

            addNotification(infoNotification);

            return () => {
                // Remove the notification on unmount.
                removeNotification(infoNotification.getId());
            };
        }
    }, [ fullResource ]);


    /**
     * Resolves the execution name based on the type.
     *
     * @param executionType - The type of the execution.
     * @returns Resolved execution name.
     */
    const resolveExecutionName = (executionType: ExecutionTypes): string => {
        switch (executionType) {
            case ExecutionTypes.GoogleFederation:
                return t("flows:core.executions.names.google");
            case ExecutionTypes.AppleFederation:
                return t("flows:core.executions.names.apple");
            case ExecutionTypes.GithubFederation:
                return t("flows:core.executions.names.github");
            case ExecutionTypes.FacebookFederation:
                return t("flows:core.executions.names.facebook");
            case ExecutionTypes.MicrosoftFederation:
                return t("flows:core.executions.names.microsoft");
            case ExecutionTypes.PasskeyEnrollment:
                return t("flows:core.executions.names.passkeyEnrollment");
            case ExecutionTypes.ConfirmationCode:
                return t("flows:core.executions.names.confirmationCode");
            case ExecutionTypes.MagicLinkExecutor:
                return t("flows:core.executions.names.magicLink");
            default:
                return t("flows:core.executions.names.default");
        }
    };

    return (
        <ValidationErrorBoundary disableErrorBoundaryOnHover={ false } resource={ fullResource }>
            {
                components && components.length > 0
                    ? (
                        <View
                            heading={ resolveExecutionName((data?.action as any)?.executor?.name) }
                            data={ data }
                            enableSourceHandle={ true }
                            droppableAllowedTypes={
                                VisualFlowConstants.FLOW_BUILDER_STATIC_CONTENT_ALLOWED_RESOURCE_TYPES }
                            onActionPanelDoubleClick={
                                () => {
                                    setOpenValidationPanel(false);
                                    setSelectedNotification(null);
                                    setLastInteractedStepId(id);
                                    setLastInteractedResource(fullResource);
                                }
                            }
                            resources={ resources }
                        />
                    )
                    : <ExecutionMinimal resource={ fullResource } />
            }
        </ValidationErrorBoundary>
    );
}, (prevProps: ExecutionPropsInterface, nextProps: ExecutionPropsInterface) => {
    return prevProps.id === nextProps.id &&
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
        JSON.stringify(prevProps.resources) === JSON.stringify(nextProps.resources);
});

export default Execution;
