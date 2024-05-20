/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import {
    ConnectionInterface,
    ConnectionTemplateInterface
} from "@wso2is/admin.connections.v1/models/connection";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "@wso2is/admin.core.v1";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import ApplicationSelectionModal
    from "@wso2is/admin.extensions.v1/components/shared/application-selection-modal";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CodeEditor, GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowStep01Illustration from "./assets/build-login-flow-01.png";
import BuildLoginFlowStep02Illustration from "./assets/build-login-flow-02.png";
import BuildLoginFlowStep03Illustration from "./assets/build-login-flow-03.png";
import ConditionalAuthIllustration from "./assets/conditional-auth.png";

interface HyprAuthenticatorQuickStartPropsInterface extends IdentifiableComponentInterface {
    /**
     * Identity provider object.
     */
    identityProvider: ConnectionInterface;
    /**
     * Identity provider template object.
     */
    template: ConnectionTemplateInterface;
}

const HyprAuthenticatorQuickStart: FunctionComponent<HyprAuthenticatorQuickStartPropsInterface> = (
    props: HyprAuthenticatorQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isApplicationReadAccessAllowed: boolean = useMemo(() => (
        hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.read, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    const authScript: string = `var onLoginRequest = function onLoginRequest(context) {

        var fedUser;
        executeStep(1,
            {
                onSuccess: function (context) {
                    var idpName = context.steps[1].idp;

                    if (idpName === "HYPR") {
                        fedUser = context.currentKnownSubject;

                        var associatedUser = getAssociatedLocalUser(fedUser);
                        if (associatedUser == null) {
                            var claimMap = {};
                            claimMap["http://wso2.org/claims/username"] = fedUser.username;
                            var storedLocalUser = getUniqueUserWithClaimValues(claimMap, context);
                            if (storedLocalUser !== null) {
                                doAssociationWithLocalUser(fedUser, storedLocalUser.username,
                                    storedLocalUser.tenantDomain, storedLocalUser.userStoreDomain);
                            }
                        }
                    }
                }
            });
    };`;

    /**
     * Vertical Stepper steps.
     * @returns VerticalStepperStepInterface
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.hypr.quickStart" +
                            ".steps.selectApplication.content"
                        }
                    >
                        Choose the { isApplicationReadAccessAllowed ? (
                            <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                            application </Link>) : "application" }
                        for which you want to set up HYPR login.
                    </Trans>
                </Text>
            ),
            stepTitle: t("extensions:develop.identityProviders.hypr.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.hypr.quickStart.steps." +
                                "selectDefaultConfig.content"
                            }
                        >
                            Go to <strong>Login Flow</strong> tab and click on the <strong>Add Sign In Option</strong>
                            button inside the login box. And select a HYPR connection.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowStep01Illustration } size="huge"/>
                    <GenericIcon inline transparent icon={ BuildLoginFlowStep02Illustration } size="huge"/>
                    <GenericIcon inline transparent icon={ BuildLoginFlowStep03Illustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans
                    i18nKey={
                        "extensions:develop.identityProviders.hypr.quickStart.steps.selectDefaultConfig.heading"
                    }
                >
                    Add a <strong>HYPR</strong> connection
                </Trans>
            )
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.hypr.quickStart.steps." +
                                    "configureLogin.conditionalAuth"
                            }
                        >
                            Turn on <strong>Conditional Authentication</strong> by switching the toggle and
                            add the following conditional authentication script.
                        </Trans>
                    </Text>

                    <div className="connection-code-segment">
                        <CodeEditor
                            height={ "100%" }
                            readOnly
                            withClipboardCopy
                            language="typescript"
                            sourceCode={ authScript }
                        />
                    </div>

                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.hypr.quickStart.steps.configureLogin.update"
                            }
                        >
                            Click <strong>Update</strong> to confirm.
                        </Trans>
                    </Text>

                    <GenericIcon inline transparent icon={ ConditionalAuthIllustration } size="huge"/>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.hypr.quickStart.steps.configureLogin.heading")
        }
    ];

    return (
        <>
            <Grid data-testid={ componentId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            title={ t("extensions:develop.identityProviders.hypr.quickStart.heading") }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.hypr.quickStart.subHeading") }
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
                            t("extensions:develop.identityProviders.hypr.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.hypr.quickStart.addLoginModal.subHeading")
                        }
                    />
                )
            }
        </>
    );

};

/**
 * Default props for the component.
 */
HyprAuthenticatorQuickStart.defaultProps = {
    "data-componentid": "hypr-authenticator-quick-start"
};

export default HyprAuthenticatorQuickStart;
