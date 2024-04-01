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

import Chip from "@oxygen-ui/react/Chip";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Heading, InfoCard, Popup, Text } from "@wso2is/react-components";
import { AppState } from "../../../../../admin.core.v1";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, Label } from "semantic-ui-react";
import { applicationConfig } from "../../../../../admin-extensions-v1";
import { AuthenticatorManagementConstants } from "../../../../../admin.connections.v1";
import { ConnectionsManagementUtils } from "../../../../../admin.connections.v1/utils/connection-utils";
import {
    IdentityProviderManagementConstants
} from "../../../../../admin-identity-providers-v1/constants/identity-provider-management-constants";
import { AuthenticatorMeta } from "../../../../../admin-identity-providers-v1/meta/authenticator-meta";
import {
    AuthenticatorCategories,
    GenericAuthenticatorInterface
} from "../../../../../admin-identity-providers-v1/models/identity-provider";
import { ApplicationManagementConstants } from "../../../../constants/application-management";
import { AuthenticationStepInterface } from "../../../../models";
import { SignInMethodUtils } from "../../../../utils/sign-in-method-utils";

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
}

/**
 * Component to render the list of authenticators.
 *
 * @param props - Props injected to the component.
 * @returns React element.
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const [ selectedAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);

    const authenticatorCardClasses: string = classNames("authenticator", {
        "with-labels": showLabels
    });

    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

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

        if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
            // If there is only one step in the flow, backup code authenticator shouldn't be allowed.
            if (currentStep === 0) {
                return false;
            }

            // If there exist 2FAs in the current step backup code authenticator should be enabled.
            // Otherwise, it should be disabled.
            return SignInMethodUtils.countTwoFactorAuthenticatorsInCurrentStep(
                currentStep,
                authenticationSteps
            ) > 0;
        }

        if ([
            IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ].includes(authenticator.id)) {
            return SignInMethodUtils.isFirstFactorValid(currentStep, authenticationSteps);
        }

        if (authenticator.name === IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR) {
            if (authenticationSteps[currentStep]?.options?.length !== 0) {
                return false;
            }
            const [ leftSideSteps ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(
                currentStep, authenticationSteps);

            if (!SignInMethodUtils.hasSpecificFactorsInSteps(
                ApplicationManagementConstants.ACTIVE_SESSIONS_LIMIT_HANDLERS, leftSideSteps)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Resolve popup content.
     *
     * @param authenticator - Authenticator.
     *
     * @returns React element.
     */
    const resolvePopupContent = (authenticator: GenericAuthenticatorInterface): ReactElement => {
        const InfoLabel: JSX.Element = (
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
                                        "applications:edit.sections" +
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
                                            "applications:edit.sections" +
                                                ".signOnMethod.sections.authenticationFlow.sections" +
                                                ".stepBased.secondFactorDisabled"
                                        }
                                    >
                                            The second-factor authenticators can only be used if{ " " }
                                        <Code withBackground>Username & Password</Code>,{ " " }
                                        <Code withBackground>Social Login</Code>,
                                        <Code withBackground>Passkey</Code>
                                            or any other handlers that can handle these factors are
                                            present in a previous step.
                                    </Trans>
                                ) }
                            </Text>
                        </Fragment>
                    ) }
                </>
            );
        } else if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
            return (
                <>
                    { currentStep === 0 ? (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { t(
                                    "applications:edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".backupCodesDisabledInFirstStep"
                                ) }
                            </Text>
                        </Fragment>
                    ) : (
                        <Fragment>
                            { InfoLabel }
                            <Text>
                                { t(
                                    "applications:edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".backupCodesDisabled"
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
                            "applications:edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.authenticatorDisabled"
                        ) }
                    </Text>
                </Fragment>
            );
        } else if ([
            IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ].includes(authenticator.id)) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        {
                            t(
                                "applications:edit.sections" +
                                ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                ".firstFactorDisabled"
                            )
                        }
                    </Text>
                </Fragment>
            );
        } else if (authenticator.name === IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        {
                            (authenticationSteps[currentStep]?.options?.length !== 0)
                                ? t(
                                    "applications:edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".sessionExecutorDisabledInMultiOptionStep"
                                )
                                : t(
                                    "applications:edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                    ".sessionExecutorDisabledInFirstStep"
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
     * @param selectedAuthenticator - Selected Authenticator.
     */
    const handleAuthenticatorSelect = (selectedAuthenticator: GenericAuthenticatorInterface): void => {
        if (!selectedAuthenticator.isEnabled) {
            return;
        }

        if (selectedAuthenticators.some((authenticator: GenericAuthenticatorInterface) =>
            authenticator.id === selectedAuthenticator.id)) {
            const filtered: GenericAuthenticatorInterface[] = selectedAuthenticators
                .filter((authenticator: GenericAuthenticatorInterface) => {
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
     * @param authenticator - Authenticator.
     *
     * @returns Authenticator labels.
     */
    const resolveAuthenticatorLabels = (authenticator: GenericAuthenticatorInterface): string[] => {
        if (!authenticator) {
            return [];
        }

        return AuthenticatorMeta.getAuthenticatorLabels(authenticator?.defaultAuthenticator) ?? [];
    };

    /**
     * Render feature status chip.
     *
     * @param authenticator - Authenticator.
     *
     * @returns Feature status chip.
     */
    const renderFeatureStatusChip = (authenticator: GenericAuthenticatorInterface): ReactElement => {
        if (
            isSAASDeployment &&
          authenticator?.defaultAuthenticator?.authenticatorId === AuthenticatorManagementConstants
              .ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID
        ) {
            return (
                <Chip
                    size="small"
                    label={ t("common:beta").toUpperCase() }
                    className="oxygen-chip-beta"
                />
            );
        }

        return null;
    };

    return (
        <Fragment data-testid={ testId }>
            { heading && <Heading as="h6">{ heading }</Heading> }
            { authenticators.map((authenticator: GenericAuthenticatorInterface, index: number) => (
                authenticator.id === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ?
                    null :
                    (<Popup
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
                                    authenticator.displayName ||
                                    defaultName
                                }
                                disabled={ !isFactorEnabled(authenticator) }
                                selected={
                                    isFactorEnabled(authenticator) &&
                                    Array.isArray(selectedAuthenticators) &&
                                    selectedAuthenticators.some((evalAuthenticator: GenericAuthenticatorInterface) => {
                                        return evalAuthenticator.id === authenticator.id;
                                    })
                                }
                                subHeader={ authenticator.categoryDisplayName }
                                description={ authenticator.description }
                                featureStatus={ renderFeatureStatusChip(authenticator) }
                                image={
                                    authenticator.idp === AuthenticatorCategories.LOCAL ||
                                    authenticator
                                        .defaultAuthenticator?.authenticatorId === AuthenticatorManagementConstants
                                        .ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID
                                        ? authenticator.image
                                        : ConnectionsManagementUtils
                                            .resolveConnectionResourcePath(connectionResourcesUrl, authenticator.image)
                                }
                                tags={ showLabels && resolveAuthenticatorLabels(authenticator) }
                                onClick={ () => {
                                    isFactorEnabled(authenticator) && handleAuthenticatorSelect(authenticator);
                                } }
                                imageOptions={ {
                                    floated: false,
                                    inline: true
                                } }
                                data-testid={ `${ testId }-authenticator-${ authenticator.name }` }
                                showCardAction={ false }
                                showSetupGuideButton={ false }
                            />)
                        }
                    />)
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
