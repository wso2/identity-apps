/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import Skeleton from "@oxygen-ui/react/Skeleton";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "@wso2is/admin.core.v1/components/vertical-stepper/vertical-stepper";
import { AppState } from "@wso2is/admin.core.v1/store";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import AttributeMappingsStep from "./setup-guide/attribute-mapping-step";
import ConfigureStep from "./setup-guide/configure-step";
import GenerateTokenStep from "./setup-guide/generate-token-step";
import OnPremDownloadAgentStep from "./setup-guide/on-prem/download-step";
import OnPremRunAgentStep from "./setup-guide/on-prem/run-step";
import RemoteDownloadAgentStep, { AgentDownloadInfoInterface } from "./setup-guide/remote/download-step";
import RemoteRunAgentStep from "./setup-guide/remote/run-step";
import "./userstore-setup-guide.scss";

/**
 * Props for the remote customer user store page.
 */
interface SetupGuideTabPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store ID
     */
    userStoreId: string;
    /**
     * User store manager type.
     */
    userStoreManager: RemoteUserStoreManagerType;
    /**
     * Flag to check if the user store is created.
     */
    isUserStoreLoading: boolean;
    /**
     * Whether the user store is disabled.
     */
    isUserStoreDisabled: boolean;
}

/**
 * A function returning a ReactElement to render tab panes.
 */
export const SetupGuideTab: FunctionComponent<SetupGuideTabPropsInterface> = (
    props: SetupGuideTabPropsInterface
): ReactElement => {
    const {
        isUserStoreLoading,
        userStoreId,
        userStoreManager,
        isUserStoreDisabled,
        ["data-componentid"]: testId = "user-store-setup-guide"
    } = props;

    const { t } = useTranslation();

    // Read the agent download URLs from the deployment config.
    const agentDownloadURLs: {
        onPrem: string;
        remote: {
            linux: AgentDownloadInfoInterface;
            linuxArm: AgentDownloadInfoInterface;
            mac: AgentDownloadInfoInterface;
            windows: AgentDownloadInfoInterface;
        };
    } = useSelector((state: AppState) => state.config?.deployment?.extensions?.userStoreAgentUrls);

    // Deprecated onPrem agent URL will be used as a fallback.
    const deprecatedOnPremAgentURL: string = useSelector(
        (state: AppState) => state.config?.deployment?.extensions?.userStoreAgentUrl);

    const setupGuideSteps: VerticalStepperStepInterface[] = [
        {
            stepContent:
                userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager ? (
                    <RemoteDownloadAgentStep downloadURLs={ agentDownloadURLs?.remote } />
                ) : (
                    <OnPremDownloadAgentStep downloadURL={ agentDownloadURLs?.onPrem ?? deprecatedOnPremAgentURL } />
                ),
            stepTitle: t("remoteUserStores:pages.edit.guide.steps.download.heading")
        },
        {
            stepContent: <ConfigureStep docLinkKey="manage.userStores.userStoreProperties.learnMore" />,
            stepTitle: t("remoteUserStores:pages.edit.guide.steps.configure.heading")
        },
        {
            stepContent: (
                <GenerateTokenStep
                    userStoreManager={ userStoreManager }
                    userStoreID={ userStoreId }
                    isUserStoreDisabled={ isUserStoreDisabled }
                />
            ),
            stepTitle: t("remoteUserStores:pages.edit.guide.steps.token.heading")
        },
        {
            stepContent:
                userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager ? (
                    <RemoteRunAgentStep userStoreId={ userStoreId } userStoreManager={ userStoreManager } />
                ) : (
                    <OnPremRunAgentStep userStoreId={ userStoreId } userStoreManager={ userStoreManager } />
                ),
            stepTitle: t("remoteUserStores:pages.edit.guide.steps.run.heading")
        },
        {
            stepContent: <AttributeMappingsStep />,
            stepTitle: t("remoteUserStores:pages.edit.guide.steps.attributeMapping.heading")
        }
    ];

    if (isUserStoreLoading) {
        return (
            <EmphasizedSegment padded="very">
                <Skeleton component="h1" width={ "50%" } />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </EmphasizedSegment>
        );
    }

    return (
        <EmphasizedSegment padded="very" className="userstore-setup-guide">
            <Heading as="h3">
                { t("remoteUserStores:pages.edit.guide.heading") }
                <Heading subHeading as="h6">
                    { t("remoteUserStores:pages.edit.guide.subHeading") }
                </Heading>
            </Heading>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={ 10 }>
                                    <VerticalStepper
                                        alwaysOpen={ true }
                                        isSidePanelOpen={ false }
                                        stepContent={ setupGuideSteps }
                                        isNextEnabled={ true }
                                        data-testid={ `${testId}-vertical-stepper` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};
