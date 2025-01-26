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

import { useRequiredScopes } from "@wso2is/access-control";
import ApplicationSelectionModal from "@wso2is/admin.applications.v1/components/application-selection-modal";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "@wso2is/admin.core.v1/components/vertical-stepper/vertical-stepper";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";

/**
 * Prop types of the component.
 */
type PushAuthQuickStartPropsInterface = IdentifiableComponentInterface;

/**
 * Quick start content for the Push authenticator.
 *
 * @param props - Props injected into the component.
 *
 * @returns Push Authenticator Quick start component.
 */
const PushAuthQuickStart: FunctionComponent<PushAuthQuickStartPropsInterface> = (
    props: PushAuthQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId = "push-authenticator-quick-start"
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasApplicationReadPermissions: boolean = useRequiredScopes(
        featureConfig?.applications?.scopes?.read
    );

    /**
     * Vertical Stepper steps.
     * @returns An array of Vertical Stepper steps.
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.pushAuth." +
                                "quickStart.steps.selectApplication.content"
                        }
                    >
                            Choose the { hasApplicationReadPermissions ? (
                            <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                                application </Link>) : "application" }
                            for which you want to set up Push Authentication login.
                    </Trans>
                </Text>
            ),
            stepTitle: t("extensions:develop.identityProviders.pushAuth.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.pushAuth.quickStart.steps.selectPushAuth" +
                                ".content" }
                        >
                            Go to <strong>Login Flow</strong> tab and click on the <strong>Username & Password + Push
                            </strong> option from the Multi-factor login section to configure a basic
                            Push Authentication flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.pushAuth.quickStart.steps.selectPushAuth.heading">
                    Select <strong>Push Notification</strong> option
                </Trans>
            )
        }
    ];

    return (
        <>
            <Grid data-testid={ componentId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            title={ t("extensions:develop.identityProviders.pushAuth.quickStart.heading") }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.pushAuth.quickStart.subHeading") }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <VerticalStepper
                            alwaysOpen
                            isSidePanelOpen
                            stepContent={ steps }
                            isNextEnabled={ true }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-testid={ `${ componentId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={
                            t("extensions:develop.identityProviders.pushAuth.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.pushAuth.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid={ componentId + "-application-selection-modal" }
                    />
                )
            }
        </>
    );
};


export default PushAuthQuickStart;
