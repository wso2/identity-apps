/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Heading, InfoCard, Text } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Label, Popup } from "semantic-ui-react";
import { applicationConfig } from "../../../../../../extensions";
import {
    AuthenticatorCategories,
    AuthenticatorMeta,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants
} from "../../../../../identity-providers";
import { AuthenticationStepInterface } from "../../../../models";
import { SignInMethodUtils } from "../../../../utils";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface extends TestableComponentInterface {
    /**
     * List of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Configured authentication steps.
     */
    authenticationSteps: AuthenticationStepInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Current step.
     */
    currentStep: number;
    /**
     * Default name for authenticators with no name.
     */
    defaultName?: string;
    /**
     * Heading for the authenticators section.
     */
    heading?: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback triggered when authenticators are selected.
     */
    onAuthenticatorSelect: (selectedAuthenticators: GenericAuthenticatorInterface[]) => void;
    /**
     * Already selected set of authenticators.
     */
    selected: GenericAuthenticatorInterface[];
    /**
     * Show/Hide authenticator labels in UI.
     */
    showLabels?: boolean;
    attributeStepId: number;
    refreshAuthenticators: () => Promise<void>;
    subjectStepId: number;
}

/**
 * Component to render the list of authenticators.
 *
 * @param {AuthenticatorsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): ReactElement => {
    const {
        authenticators,
        authenticationSteps,
        currentStep,
        defaultName,
        heading,
        onAuthenticatorSelect,
        selected,
        showLabels,
        // refreshAuthenticators,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ selectedAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);

    const authenticatorCardClasses = classNames("authenticator", {
        "with-labels": showLabels
    });

    /**
     * Updates the internal selected authenticators state when the prop changes.
     */
    useEffect(() => {
        if (!selected) {
            return;
        }

        setSelectedAuthenticators(selected);
    }, [ selected ]);

    const isFactorEnabled = (authenticator: GenericAuthenticatorInterface): boolean => {
        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            // If there is only one step in the flow, second factor authenticators shouldn't be allowed.
            if (currentStep === 0) {
                return false;
            }

            return SignInMethodUtils.isSecondFactorAdditionValid(
                authenticator.defaultAuthenticator.authenticatorId,
                currentStep,
                authenticationSteps
            );
        }

        // Check if the authenticator is a magic link authenticator
        if (authenticator.id === IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID) {
            return SignInMethodUtils.isMagicLinkAuthenticatorValid(currentStep, authenticationSteps);
        }

        return true;
    };

    /**
     * Resolve popup content.
     *
     * @param {GenericAuthenticatorInterface} authenticator - Authenticator.
     *
     * @return {React.ReactElement}
     */
    const resolvePopupContent = (authenticator: GenericAuthenticatorInterface): ReactElement => {
        const InfoLabel = (
            <Label attached="top">
                <Icon name="info circle" /> Info
            </Label>
        );

        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            return (
                <>
                    { currentStep === 0 ? (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { applicationConfig.signInMethod.authenticatorSelection.messages
                                    .secondFactorDisabledInFirstStep ??
                                    t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                        ".secondFactorDisabledInFirstStep"
                                    ) }
                            </Text>
                        </Fragment>
                    ) : (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { applicationConfig.signInMethod.authenticatorSelection.messages
                                    .secondFactorDisabled ?? (
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.authenticationFlow.sections" +
                                                ".stepBased.secondFactorDisabled"
                                        }
                                    >
                                            The second-factor authenticators can only be used if{ " " }
                                        <Code withBackground>Username & Password</Code>,{ " " }
                                        <Code withBackground>Social Login</Code>,
                                        <Code withBackground>Security Key/Biometrics</Code>
                                            or any other handlers such as
                                        <Code withBackground>Identifier First</Code>
                                                that can handle these factors are
                                            present in a previous step.
                                    </Trans>
                                ) }
                            </Text>
                        </Fragment>
                    ) }
                </>
            );
        } else if (authenticator.category === AuthenticatorCategories.SOCIAL) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        { t(
                            "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.authenticatorDisabled"
                        ) }
                    </Text>
                </Fragment>
            );
        } else if (authenticator.id === IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID
            && !SignInMethodUtils.isMagicLinkAuthenticatorValid(currentStep, authenticationSteps)) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        {
                            t(
                                "console:develop.features.applications.edit.sections" +
                                ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                ".magicLinkDisabled"
                            )
                        }
                    </Text>
                </Fragment>
            );
        }
    };

    /**
     * Handles authenticator select.
     *
     * @param {GenericAuthenticatorInterface} selectedAuthenticator - Selected Authenticator.
     */
    const handleAuthenticatorSelect = (selectedAuthenticator: GenericAuthenticatorInterface): void => {
        if (!selectedAuthenticator.isEnabled) {
            return;
        }

        if (selectedAuthenticators.some((authenticator) => authenticator.id === selectedAuthenticator.id)) {
            const filtered = selectedAuthenticators.filter((authenticator) => {
                return authenticator.id !== selectedAuthenticator.id;
            });

            onAuthenticatorSelect(filtered);
            setSelectedAuthenticators(filtered);

            return;
        }

        onAuthenticatorSelect([ ...selectedAuthenticators, selectedAuthenticator ]);
        setSelectedAuthenticators([ ...selectedAuthenticators, selectedAuthenticator ]);
    };

    /**
     * Resolve Authenticator labels.
     *
     * @param {FederatedAuthenticatorInterface} authenticator - Authenticator.
     *
     * @return {any[] | string[]}
     */
    const resolveAuthenticatorLabels = (authenticator: FederatedAuthenticatorInterface): string[] => {
        if (!authenticator) {
            return [];
        }

        return AuthenticatorMeta.getAuthenticatorLabels(authenticator.authenticatorId) ?? [];
    };

    return (
        <Fragment data-testid={ testId }>
            { heading && <Heading as="h6">{ heading }</Heading> }
            { authenticators.map((authenticator: GenericAuthenticatorInterface, index) => (
                <Popup
                    hoverable
                    hideOnScroll
                    position="top center"
                    key={ index }
                    on="hover"
                    disabled={ isFactorEnabled(authenticator) }
                    content={ resolvePopupContent(authenticator) }
                    trigger={
                        (<InfoCard
                            showTooltips
                            imageSize="micro"
                            className={ authenticatorCardClasses }
                            header={
                                AuthenticatorMeta.getAuthenticatorDisplayName(
                                    authenticator.defaultAuthenticator.authenticatorId
                                ) ||
                                authenticator.displayName ||
                                defaultName
                            }
                            disabled={ !isFactorEnabled(authenticator) }
                            selected={
                                isFactorEnabled(authenticator) &&
                                Array.isArray(selectedAuthenticators) &&
                                selectedAuthenticators.some((evalAuthenticator) => {
                                    return evalAuthenticator.id === authenticator.id;
                                })
                            }
                            subHeader={ authenticator.categoryDisplayName }
                            description={ authenticator.description }
                            image={ authenticator.image }
                            tags={ showLabels && resolveAuthenticatorLabels(authenticator?.defaultAuthenticator) }
                            onClick={ () => {
                                isFactorEnabled(authenticator) && handleAuthenticatorSelect(authenticator);
                            } }
                            imageOptions={ {
                                floated: false,
                                inline: true
                            } }
                            data-testid={ `${ testId }-authenticator-${ authenticator.name }` }
                        />)
                    }
                />
            )) }
        </Fragment>
    );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    "data-testid": "authenticators",
    defaultName: "Unknown",
    showLabels: true
};
