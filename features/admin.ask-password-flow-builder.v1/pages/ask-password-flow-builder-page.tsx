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

import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import AskPasswordFlowBuilderPageHeader from "./ask-password-flow-builder-page-header";
import FloatingPublishButton from "./floating-publish-button";
import AskPasswordFlowBuilder from
    "../components/ask-password-flow-builder";
import AskPasswordFlowBuilderProvider from
    "../providers/ask-password-flow-builder-provider";
import "./ask-password-flow-builder-page.scss";

/**
 * Props interface of {@link AskPasswordFlowBuilderPage}
 */
export type AskPasswordFlowBuilderPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the Password Recovery Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns AskPasswordFlowBuilderPage component.
 */
const AskPasswordFlowBuilderPage: FunctionComponent<AskPasswordFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "ask-password-flow-builder-page"
}: AskPasswordFlowBuilderPageProps): ReactElement => {
    const { setPreferences, leftNavbarCollapsed } = useUserPreferences();

    /**
     * If the user doesn't have a `leftNavbarCollapsed` preference saved, collapse the navbar for better UX.
     * @remarks Since the builder needs more real estate, it's better to have the navbar collapsed.
     */
    useEffect(() => {
        if (leftNavbarCollapsed === undefined) {
            setPreferences({ leftNavbarCollapsed: true });
        }
    }, [ leftNavbarCollapsed, setPreferences ]);

    return (
        <AskPasswordFlowBuilderProvider>
            <div className="ask-password-flow-builder-page" data-componentid={ componentId }>
                <div className="page-layout">
                    <AskPasswordFlowBuilderPageHeader />
                </div>
                <AskPasswordFlowBuilder />
                <FloatingPublishButton />
            </div>
        </AskPasswordFlowBuilderProvider>
    );
};

export default AskPasswordFlowBuilderPage;
