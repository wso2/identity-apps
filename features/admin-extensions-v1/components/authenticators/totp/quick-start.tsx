/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";
import { FeatureConfigInterface } from "../../../../admin-core-v1/models";
import { AppState } from "../../../../admin-core-v1/store";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import ApplicationSelectionModal from "../../shared/application-selection-modal";

/**
 * Prop types of the component.
 */
type TOTPQuickStartPropsInterface = TestableComponentInterface;

/**
 * Quick start content for the TOTP authenticator.
 *
 * @param props - Props injected into the component.
 *
 * @returns TOTP authenticator quick start component.
 */
const TOTPQuickStart: FunctionComponent<TOTPQuickStartPropsInterface> = (
    props: TOTPQuickStartPropsInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isApplicationReadAccessAllowed: boolean = useMemo(() => (
        hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.read, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    /**
     * Vertical Stepper steps.
     * @returns List of steps.
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.totp.quickStart.steps.selectApplication.content"
                            }
                        >
                            Choose the { isApplicationReadAccessAllowed ? (
                                <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                                application </Link>) : "application" }
                            for which you want to set up TOTP login.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.totp.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.totp.quickStart.steps.selectTOTP.content" }
                        >
                            Go to <strong>Login Flow</strong> tab and click on the <strong>Username & Password + TOTP
                            </strong> option from the Multi-factor login section to configure a basic TOTP flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.totp.quickStart.steps.selectTOTP.heading">
                    Select <strong>TOTP</strong> option
                </Trans>
            )
        }
    ];

    return (
        <>
            <Grid data-testid={ testId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            imageSpaced={ false }
                            bottomMargin={ false }
                            title={ t("extensions:develop.identityProviders.totp.quickStart.heading") }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.totp.quickStart.subHeading") }
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
                        data-testid={ `${ testId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={ t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.heading") }
                        subHeading={
                            t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid="connections"
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component
 */
TOTPQuickStart.defaultProps = {
    "data-testid": "totp-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TOTPQuickStart;
