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

import FlowBuilderPage from
    "@wso2is/admin.flow-builder-core.v1/components/flow-builder-page-skeleton/flow-builder-page";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ProfileUpdateFlowBuilder from "../components/profile-update-flow-builder";
import useProfileUpdateFlowBuilder from "../hooks/use-profile-update-flow-builder";
import ProfileUpdateFlowBuilderProvider from "../providers/profile-update-flow-builder-provider";

/**
 * Props interface of {@link ProfileUpdateFlowBuilderPage}
 */
export type ProfileUpdateFlowBuilderPageProps = IdentifiableComponentInterface & PropsWithChildren;

/**
 * Wraps the `ProfileUpdateFlowBuilderPage` with the required context providers.
 *
 * @param props - Props injected to the component.
 * @returns PageWithContext component.
 */
const ProfileUpdateFlowBuilderPageWithContext: FunctionComponent<ProfileUpdateFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId,
    children
}: ProfileUpdateFlowBuilderPageProps): ReactElement => {
    const { t } = useTranslation();
    const { isPublishing, onPublish } = useProfileUpdateFlowBuilder();
    const { setRefetchFlow } = useAuthenticationFlowBuilderCore();

    return (
        <FlowBuilderPage
            data-componentid={ componentId }
            flowType={ FlowTypes.PROFILE_UPDATE }
            flowTypeDisplayName={ t("flows:profileUpdate.flowDisplayName") }
            isPublishing={ isPublishing }
            onPublish={ onPublish }
            onRevert={ () => setRefetchFlow(true) }
        >
            { children }
        </FlowBuilderPage>
    );
};

/**
 * Landing page for the Profile Update Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns ProfileUpdateFlowBuilderPage component.
 */
const ProfileUpdateFlowBuilderPage: FunctionComponent<ProfileUpdateFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "profile-update-flow-builder-page"
}: ProfileUpdateFlowBuilderPageProps): ReactElement => (
    <ProfileUpdateFlowBuilderProvider>
        <ProfileUpdateFlowBuilderPageWithContext data-componentid={ componentId }>
            <ProfileUpdateFlowBuilder />
        </ProfileUpdateFlowBuilderPageWithContext>
    </ProfileUpdateFlowBuilderProvider>
);

export default ProfileUpdateFlowBuilderPage;
