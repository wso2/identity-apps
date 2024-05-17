/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Typography from "@oxygen-ui/react/Typography";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    GenericIcon,
    Heading,
    Link,
    PageHeader,
    Text
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from
    "@wso2is/admin.connections.v1/components/authenticators/fido/assets/build-login-flow.png";
import ConfigureParametersIllustration from
    "@wso2is/admin.connections.v1/components/authenticators/fido/assets/configure-parameters.png";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import ApplicationSelectionModal from "../../shared/application-selection-modal";

/**
 * Prop types of the component.
 */
type FIDOQuickStartPropsInterface = TestableComponentInterface;

/**
 * Quick start content for the FIDO authenticator.
 *
 * @param props - Props injected into the component.
 *
 * @returns FIDO Quick Start ReactElement.
 */
const FIDOQuickStart: FunctionComponent<FIDOQuickStartPropsInterface> = (
    props: FIDOQuickStartPropsInterface
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
     *
     * @returns VerticalStepperStepInterface List.
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.fido.quickStart.steps.selectApplication.content"
                            }
                        >
                            Choose the { isApplicationReadAccessAllowed ? (
                                <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                                application </Link>) : "application" }
                            for which you want to set up passkey login.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.fido.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.fido.quickStart.steps.selectFIDO.content" }
                        >
                            Go to <strong>Login Flow</strong> tab and click on the <strong>Passkey</strong>
                            option from the Passwordless login section to configure a basic Passkey flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.fido.quickStart.steps.selectFIDO.heading">
                    Select <strong>Passkey</strong> option
                </Trans>
            )
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    { t("extensions:develop.identityProviders.fido.quickStart.steps." +
                                        "configureParameters.content.steps.info") }
                                    <ol>
                                        <li>
                                            <Trans
                                                i18nKey={ "extensions:develop.identityProviders.fido." +
                                                    "quickStart.steps.configureParameters.content.steps.1" }
                                            >
                                                Navigate to the <strong>Connections</strong> area.
                                            </Trans>
                                        </li>
                                        <li>
                                            <Trans
                                                i18nKey={ "extensions:develop.identityProviders.fido." +
                                                "quickStart.steps.configureParameters.content.steps.2" }
                                            >
                                                Locate and select the <strong>Passkey</strong> connection.
                                            </Trans>
                                        </li>
                                        <li>
                                            <Trans
                                                i18nKey={ "extensions:develop.identityProviders.fido." +
                                                "quickStart.steps.configureParameters.content.steps.3" }
                                            >
                                                Navigate to the <strong>Settings</strong> tab.
                                            </Trans>
                                        </li>
                                    </ol>
                                </Grid.Column>
                                <Grid.Row>
                                    <Grid.Column>
                                        <GenericIcon
                                            inline
                                            transparent
                                            icon={ ConfigureParametersIllustration }
                                            size="huge"/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Typography variant="h6">
                                        { t("extensions:develop.identityProviders.fido.quickStart.steps." +
                                        "configureParameters.content.parameters.progressiveEnrollment.label") }
                                    </Typography>
                                    { t("extensions:develop.identityProviders.fido.quickStart." +
                                        "steps.configureParameters.content.parameters." +
                                        "progressiveEnrollment.description") }
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Alert severity="info">
                                        <Trans
                                            i18nKey={ "extensions:develop.identityProviders.fido." +
                                            "quickStart.steps.configureParameters.content.parameters." +
                                            "progressiveEnrollment.note" }
                                        >
                                            When the Passkey is set as a <strong>first factor</strong> option,
                                            users need to add an <strong>adaptive script</strong> to verify the
                                            user&apos;s identity prior to passkey enrollment. To include the script,
                                            users can use the <strong>Passkeys Progressive Enrollment</strong> template
                                            available in the <strong>Sign-In-Method</strong> tab of the application.
                                        </Trans>
                                    </Alert>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Typography variant="h6">
                                        { t("extensions:develop.identityProviders.fido.quickStart." +
                                        "steps.configureParameters.content.parameters." +
                                        "usernamelessAuthentication.label") }
                                    </Typography>
                                    { t("extensions:develop.identityProviders.fido.quickStart.steps." +
                                        "configureParameters.content.parameters.usernamelessAuthentication." +
                                        "description") }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.fido.quickStart.steps.configureParameters.heading")
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
                            title={ t("extensions:develop.identityProviders.fido.quickStart.heading") }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.fido.quickStart.subHeading") }
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
                        heading={ t("extensions:develop.identityProviders.fido.quickStart.addLoginModal.heading") }
                        subHeading={
                            t("extensions:develop.identityProviders.fido.quickStart.addLoginModal.subHeading")
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
FIDOQuickStart.defaultProps = {
    "data-testid": "FIDO-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default FIDOQuickStart;
