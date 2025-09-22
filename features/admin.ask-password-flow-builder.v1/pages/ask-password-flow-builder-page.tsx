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

import AskPasswordFlowBuilderProvider from "../providers/ask-password-flow-builder-provider";
import FlowBuilderPage from "@wso2is/admin.flow-builder-core.v1/components/flow-builder-page-skeleton/flow-builder-page";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useTranslation } from "react-i18next";
import useAskPasswordFlowBuilder from "../hooks/use-ask-password-flow-builder";
import AskPasswordFlowBuilder from "../components/ask-password-flow-builder";

/**
 * Props interface of {@link AskPasswordFlowBuilderPage}
 */
export type AskPasswordFlowBuilderPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns AskPasswordFlowBuilderPage component.
 */
const AskPasswordFlowBuilderPage: FunctionComponent<AskPasswordFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page"
}: AskPasswordFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = useAskPasswordFlowBuilder();

    return (
        <AskPasswordFlowBuilderProvider>
            <FlowBuilderPage
                data-componentid={ componentId }
                flowType={ FlowTypes.INVITED_USER_REGISTRATION }
                flowTypeDisplayName={ t("flows:askPassword.flowDisplayName") }
                isPublishing={ isPublishing }
                onPublish={ onPublish }
            >
                <AskPasswordFlowBuilder />
            </FlowBuilderPage>
        </AskPasswordFlowBuilderProvider>
    );
};

export default AskPasswordFlowBuilderPage;
