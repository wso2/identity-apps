/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Heading, InfoCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Responsive, Segment } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface, FeatureConfigInterface, EventPublisher } from "../../../../core";
import { IdentityProviderManagementConstants } from "../../../../identity-providers";
import { getAuthenticatorIcons } from "../../../configs";
import { LoginFlowTypes } from "../../../models";

/**
 * Proptypes for the sign in methods landing component.
 */
interface SignInMethodLandingPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Client ID of the application.
     */
    clientId?: string;
    /**
     * Callback to set the selected login flow option.
     */
    onLoginFlowSelect: (type: LoginFlowTypes) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Set of login flow options to hide.
     */
    hiddenOptions?: LoginFlowTypes[];
}

/**
 * Landing component for Application Sign-in method configurations.
 *
 * @param {SignInMethodLandingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SignInMethodLanding: FunctionComponent<SignInMethodLandingPropsInterface> = (
    props: SignInMethodLandingPropsInterface
): ReactElement => {
    const { isLoading, onLoginFlowSelect, hiddenOptions, ["data-testid"]: testId, clientId } = props;

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const eventPublisher = EventPublisher.getInstance();

    return (
        <Segment basic loading={isLoading} data-testid={testId} className="sign-in-method-landing">
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Heading
                            as="h2"
                            textAlign={window.innerWidth <= Responsive.onlyTablet.maxWidth ? "center" : "left"}
                        >
                            {t(
                                "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "landing.flowBuilder.heading"
                            )}
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={8} tablet={16} mobile={16} className="flow-options-column">
                        <div className="pr-5 pl-5">
                            {!hiddenOptions.includes(LoginFlowTypes.DEFAULT) && (
                                <>
                                    <Heading as="h4">
                                        {t(
                                            "console:develop.features.applications.edit." +
                                            "sections.signOnMethod.sections." +
                                            "landing.flowBuilder.headings.default"
                                        )}
                                    </Heading>
                                    <InfoCard
                                        fluid
                                        data-testid="basic-configuration-flow-card"
                                        image={getAuthenticatorIcons().basic}
                                        imageSize="mini"
                                        header={t(
                                            "console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.landing.flowBuilder.types.defaultConfig.heading"
                                        )}
                                        description={t(
                                            "console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.landing.flowBuilder.types.defaultConfig.description"
                                        )}
                                        onClick={() => {
                                            eventPublisher.publish("application-begin-sign-in-default-configuration", {
                                                "client-id": clientId
                                            });
                                            onLoginFlowSelect(LoginFlowTypes.DEFAULT)
                                        }}
                                    />
                                </>
                            )}

                            {(!hiddenOptions.includes(LoginFlowTypes.GOOGLE_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.FACEBOOK_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.GITHUB_LOGIN)) && (
                                    <>
                                        <Heading as="h4">
                                            {t(
                                                "console:develop.features.applications.edit." +
                                                "sections.signOnMethod.sections." +
                                                "landing.flowBuilder.headings.socialLogin"
                                            )}
                                        </Heading>
                                        {!hiddenOptions.includes(LoginFlowTypes.GOOGLE_LOGIN) && (
                                            <InfoCard
                                                fluid
                                                data-testid="google-login-flow-card"
                                                imageSize="mini"
                                                image={getAuthenticatorIcons().google}
                                                header={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder.types.google.heading"
                                                )}
                                                description={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder." +
                                                    "types.google.description"
                                                )}
                                                onClick={() => {
                                                    eventPublisher.publish("application-begin-sign-in-google-social-login", {
                                                        type: clientId
                                                    });
                                                    onLoginFlowSelect(LoginFlowTypes.GOOGLE_LOGIN)
                                                }}
                                            />
                                        )}

                                        {!hiddenOptions.includes(LoginFlowTypes.GITHUB_LOGIN) && (
                                            <InfoCard
                                                fluid
                                                data-testid="github-login-flow-card"
                                                imageSize="mini"
                                                image={getAuthenticatorIcons().github}
                                                header={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder.types.github.heading"
                                                )}
                                                description={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder." +
                                                    "types.github.description"
                                                )}
                                                onClick={() => onLoginFlowSelect(LoginFlowTypes.GITHUB_LOGIN)}
                                            />
                                        )}
                                        {!hiddenOptions.includes(LoginFlowTypes.FACEBOOK_LOGIN) && (
                                            <InfoCard
                                                fluid
                                                data-testid="facebook-login-flow-card"
                                                imageSize="mini"
                                                image={getAuthenticatorIcons().facebook}
                                                header={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder.types.facebook.heading"
                                                )}
                                                description={t(
                                                    "console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder." +
                                                    "types.facebook.description"
                                                )}
                                                onClick={() => onLoginFlowSelect(LoginFlowTypes.FACEBOOK_LOGIN)}
                                            />
                                        )}
                                    </>
                                )}
                        </div>
                    </Grid.Column>
                    <Grid.Column computer={8} tablet={16} mobile={16} className="flow-options-column">
                        <div className="pr-5 pl-5">
                            <Heading as="h4">
                                {t(
                                    "console:develop.features.applications.edit." +
                                    "sections.signOnMethod.sections." +
                                    "landing.flowBuilder.headings.multiFactorLogin"
                                )}
                            </Heading>
                            {!hiddenOptions.includes(LoginFlowTypes.SECOND_FACTOR_TOTP) && (
                                <InfoCard
                                    fluid
                                    data-testid="totp-mfa-flow-card"
                                    image={getAuthenticatorIcons().totp}
                                    imageSize="mini"
                                    header={t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.totp.heading"
                                    )}
                                    description={t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.totp.description"
                                    )}
                                    onClick={() => {
                                        eventPublisher.publish("application-begin-sign-in-totp-mfa", {
                                            "client-id": clientId
                                        });
                                        onLoginFlowSelect(LoginFlowTypes.SECOND_FACTOR_TOTP)
                                    }}
                                />
                            )}
                            <Heading as="h4">
                                {t(
                                    "console:develop.features.applications.edit." +
                                    "sections.signOnMethod.sections." +
                                    "landing.flowBuilder.headings.passwordlessLogin"
                                )}
                            </Heading>
                            {!hiddenOptions?.includes(LoginFlowTypes.FIDO_LOGIN) &&
                                !config.ui?.hiddenAuthenticators.includes(
                                    IdentityProviderManagementConstants.FIDO_AUTHENTICATOR
                                ) && (
                                    <InfoCard
                                        fluid
                                        data-testid="usernameless-flow-card"
                                        image={getAuthenticatorIcons().fido}
                                        imageSize="mini"
                                        header={t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.usernameless.heading"
                                        )}
                                        description={t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.usernameless.description"
                                        )}
                                        onClick={() => onLoginFlowSelect(LoginFlowTypes.FIDO_LOGIN)}
                                    />
                                )}
                            {!hiddenOptions?.includes(LoginFlowTypes.MAGIC_LINK) &&
                                !config.ui?.hiddenAuthenticators.includes(
                                    IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR
                                ) && (
                                    <InfoCard
                                        fluid
                                        data-testid="magic-link-flow-card"
                                        image={getAuthenticatorIcons().magicLink}
                                        imageSize="mini"
                                        header={t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.magicLink.heading"
                                        )}
                                        description={t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.magicLink.description"
                                        )}
                                        onClick={() => onLoginFlowSelect(LoginFlowTypes.MAGIC_LINK)}
                                    />
                                )}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

/**
 * Default props for the Application Sign-in method landing component.
 */
SignInMethodLanding.defaultProps = {
    "data-testid": "sign-in-method-landing",
    hiddenOptions: [LoginFlowTypes.FACEBOOK_LOGIN, LoginFlowTypes.GITHUB_LOGIN]
};
