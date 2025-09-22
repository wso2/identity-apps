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

import RegistrationFlowBuilder from "../components/registration-flow-builder";
import RegistrationFlowBuilderProvider from "../providers/registration-flow-builder-provider";
import FlowBuilderPage from "@wso2is/admin.flow-builder-core.v1/components/flow-builder-page-skeleton/flow-builder-page";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useTranslation } from "react-i18next";
import useRegistrationFlowBuilder from "../hooks/use-registration-flow-builder";

/**
 * Props interface of {@link RegistrationFlowBuilderPage}
 */
export type RegistrationFlowBuilderPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderPage component.
 */
const RegistrationFlowBuilderPage: FunctionComponent<RegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page"
}: RegistrationFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = useRegistrationFlowBuilder();

    return (
        <RegistrationFlowBuilderProvider>
            <FlowBuilderPage
                data-componentid={ componentId }
                flowType={ FlowTypes.REGISTRATION }
                flowTypeDisplayName={ t("flows:registrationFlow.flowDisplayName") }
                isPublishing={ isPublishing }
                onPublish={ onPublish }
            >
                <RegistrationFlowBuilder />
            </FlowBuilderPage>
        </RegistrationFlowBuilderProvider>
    );
};

export default RegistrationFlowBuilderPage;
