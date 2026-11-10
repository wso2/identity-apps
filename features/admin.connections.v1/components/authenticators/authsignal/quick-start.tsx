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

import { useRequiredScopes } from "@wso2is/access-control";
import ApplicationSelectionModal from "@wso2is/admin.applications.v1/components/application-selection-modal";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "@wso2is/admin.core.v1/components/vertical-stepper/vertical-stepper";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type AuthsignalQuickStartPropsInterface = IdentifiableComponentInterface;

/**
 * Quick start content for the Authsignal authenticator.
 *
 * @param props - Props injected into the component.
 *
 * @returns Authsignal authenticator quick start component.
 */
const AuthsignalQuickStart: FunctionComponent<AuthsignalQuickStartPropsInterface> = (
    props: AuthsignalQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId = "authsignal-authenticator-quick-start"
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
                            "extensions:develop.identityProviders.authsignal.quickStart.steps.configureSettings.content"
                        }
                    >
                        Go to the <strong>Settings</strong> tab and enter the secret key, region and other details
                        of your Authsignal tenant.
                    </Trans>
                </Text>
            ),
            stepTitle: t("extensions:develop.identityProviders.authsignal.quickStart.steps.configureSettings.heading")
        },
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.authsignal.quickStart.steps.selectApplication.content"
                        }
                    >
                        Choose the { hasApplicationReadPermissions ? (
                            <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                                application </Link>) : "application" }
                        for which you want to set up Authsignal.
                    </Trans>
                </Text>
            ),
            stepTitle: t("extensions:develop.identityProviders.authsignal.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.authsignal.quickStart.steps.addAuthsignal.content"
                        }
                    >
                        Go to the <strong>Login Flow</strong> tab. Add <strong>Authsignal</strong> as the second
                        step, after a step that identifies the user, such as Username & Password or Identifier First.
                    </Trans>
                </Text>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.authsignal.quickStart.steps.addAuthsignal.heading">
                    Add <strong>Authsignal</strong> to the login flow
                </Trans>
            )
        },
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.authsignal.quickStart.steps.addToRegistration.content"
                        }
                    >
                        To also use Authsignal at registration, go to <strong>Flows</strong>{ " > " }
                        <strong>Registration</strong>. Add the <strong>Authsignal</strong> node after the form that
                        collects the email address or mobile number, and before the user onboarding step. The node uses
                        the default action code unless you set a different one in its properties.
                    </Trans>
                </Text>
            ),
            stepTitle: (
                <Trans
                    i18nKey="extensions:develop.identityProviders.authsignal.quickStart.steps.addToRegistration.heading"
                >
                    Add <strong>Authsignal</strong> to the registration flow (optional)
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
                            title={ t("extensions:develop.identityProviders.authsignal.quickStart.heading") }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.authsignal.quickStart.subHeading") }
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
                            t("extensions:develop.identityProviders.authsignal.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.authsignal.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid={ componentId + "-application-selection-modal" }
                    />
                )
            }
        </>
    );
};

export default AuthsignalQuickStart;
