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

import Box from "@oxygen-ui/react/Box";
import Code from "@oxygen-ui/react/Code/Code";
import Typography from "@oxygen-ui/react/Typography";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore
    from "../../../../../hooks/use-authentication-flow-builder-core-context";
import useRequiredFields, { RequiredFieldInterface }
    from "../../../../../hooks/use-required-fields";
import { FlowExtensionConnectionInterface } from "../../../../../models/metadata";
import { ExecutionMinimalPropsInterface } from "../execution-minimal";

const DEFAULT_ICON: string = "assets/images/icons/flow-extension.svg";

/**
 * Props interface of {@link FlowExtensionExecution}.
 */
type FlowExtensionExecutionPropsInterface = ExecutionMinimalPropsInterface
    & IdentifiableComponentInterface;

const FlowExtensionExecution = ({
    resource,
    "data-componentid": componentId = "flow-extension-execution"
}: FlowExtensionExecutionPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { metadata } = useAuthenticationFlowBuilderCore();

    const generalMessage: ReactElement = useMemo(() => (
        <Trans
            i18nKey="flows:core.validation.fields.flowExtension.general"
            values={ { id: resource?.id } }
        >
            Required fields are not properly configured for the flow extension with ID
            <Code>{ resource?.id }</Code>.
        </Trans>
    ), [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => [
        {
            errorMessage: t("flows:core.validation.fields.flowExtension.actionId"),
            name: "data.action.executor.meta.actionId"
        }
    ], []);

    useRequiredFields(resource, generalMessage, fields);

    const selectedConnection: FlowExtensionConnectionInterface | null = useMemo(() => {
        const actionId: string = resource?.data?.action?.executor?.meta?.actionId;

        if (!actionId || !metadata?.inflowExtensionConnections?.length) {
            return null;
        }

        return metadata.inflowExtensionConnections.find(
            (c: FlowExtensionConnectionInterface) => c.actionId === actionId
        ) || null;
    }, [ resource?.data?.action?.executor?.meta?.actionId, metadata?.inflowExtensionConnections ]);

    const iconSrc: string = selectedConnection?.iconUrl
        || loadStaticResource(DEFAULT_ICON);

    const isDefaultIcon: boolean = !selectedConnection?.iconUrl;

    const displayName: string = selectedConnection?.name || t("flows:core.executions.names.flowExtension");

    return (
        <Box
            display="flex"
            gap={ 1 }
            data-componentid={ componentId }
            className="flow-builder-execution flow-extension"
        >
            <img
                src={ iconSrc }
                alt={ displayName }
                height="20"
                style={ { filter: isDefaultIcon ? "invert(1)" : "none", objectFit: "contain" } }
            />
            <Typography variant="body1">
                { displayName }
            </Typography>
        </Box>
    );
};

export default FlowExtensionExecution;
