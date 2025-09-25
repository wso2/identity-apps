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

import PasswordRecoveryFlowBuilder from "../components/password-recovery-flow-builder";
import PasswordRecoveryFlowBuilderProvider from "../providers/password-recovery-flow-builder-provider";
import FlowBuilderPage from "@wso2is/admin.flow-builder-core.v1/components/flow-builder-page-skeleton/flow-builder-page";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useTranslation } from "react-i18next";
import usePasswordRecoveryFlowBuilder from "../hooks/use-password-recovery-flow-builder";

/**
 * Props interface of {@link PasswordRecoveryFlowBuilderPage}
 */
export type PasswordRecoveryFlowBuilderPageProps = IdentifiableComponentInterface & PropsWithChildren;

/**
 * Wraps the `PasswordRecoveryFlowBuilderPage` with the required context providers.
 *
 * @param props - Props injected to the component.
 * @returns PageWithContext component.
 */
const PasswordRecoveryFlowBuilderPageWithContext: FunctionComponent<PasswordRecoveryFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId,
    children
}: PasswordRecoveryFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = usePasswordRecoveryFlowBuilder();

    return (
        <FlowBuilderPage
            data-componentid={ componentId }
            flowType={ FlowTypes.PASSWORD_RECOVERY }
            flowTypeDisplayName={ t("flows:passwordRecovery.flowDisplayName") }
            isPublishing={ isPublishing }
            onPublish={ onPublish }
        >
            { children }
        </FlowBuilderPage>
    );
};

/**
 * Landing page for the Password Recovery Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns PasswordRecoveryFlowBuilderPage component.
 */
const PasswordRecoveryFlowBuilderPage: FunctionComponent<PasswordRecoveryFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "password-recovery-flow-builder-page"
}: PasswordRecoveryFlowBuilderPageProps): ReactElement => (
    <PasswordRecoveryFlowBuilderProvider>
        <PasswordRecoveryFlowBuilderPageWithContext data-componentid={ componentId }>
            <PasswordRecoveryFlowBuilder />
        </PasswordRecoveryFlowBuilderPageWithContext>
    </PasswordRecoveryFlowBuilderProvider>
);

export default PasswordRecoveryFlowBuilderPage;
