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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Code, ContentLoader, Heading, InfoCard, Link, Text } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Accordion, AccordionTitleProps, Checkbox, Icon, Label, Popup } from "semantic-ui-react";
import { applicationConfig } from "../../../../../../extensions";
import { AppConstants, history } from "../../../../../core";
import {
    AuthenticatorCategories,
    AuthenticatorMeta,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    ProvisioningInterface,
    updateJITProvisioningConfigs
} from "../../../../../identity-providers";
import { AuthenticationStepInterface } from "../../../../models";
import { GenericAuthenticatorWithProvisioningConfigs, SignInMethodUtils } from "../../../../utils";

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
    refreshAuthenticators: () => void;
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
        subjectStepId,
        attributeStepId,
        // refreshAuthenticators,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ selectedAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>(undefined);
    const [ isUpdatingJITConfigs, setIsUpdatingJITConfigs ] = useState<boolean>(false);
    const [ updatingIdPName, setUpdatingIdPName ] = useState<string | undefined>();
    const [ accordionActiveIndex, setAccordionActiveIndex ] = useState<number>(COLLAPSE_ACCORDION);

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

    const handleAccordionOnClick = (
        e: MouseEvent<HTMLDivElement>,
        accordionTitleProps: AccordionTitleProps
    ): void => {
        e.preventDefault();

        if (!accordionTitleProps) return;

        const showing = accordionActiveIndex === 0;

        if (showing) {
            setAccordionActiveIndex(COLLAPSE_ACCORDION);
        } else {
            setAccordionActiveIndex(SHOW_ACCORDION);
        }
    };

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

        return true;
    };

    /**
     * Since we use the same function {@link isFactorEnabled} to determine
     * the state of the disabled state of the popup in inversion, we use this
     * function to override the condition. This is similar to a a bitwise AND
     * operation but simpler to understand.
     *
     * @param {GenericAuthenticatorInterface} authenticator
     * @return {boolean}
     */
    const isPopUpDisabled = (authenticator: GenericAuthenticatorInterface): boolean => {

        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            const { conflicting } = SignInMethodUtils.isMFAConflictingWithProxyModeConfig({
                addingStep: currentStep,
                attributeStepId,
                authenticatorId: authenticator.defaultAuthenticator.authenticatorId,
                authenticators: authenticators,
                steps: authenticationSteps,
                subjectStepId
            });

            return !conflicting;
        }

        return true;

    };

    const onEnableJITConfigurationClick = (
        { provisioning: { jit }, id, name }: GenericAuthenticatorWithProvisioningConfigs
    ): void => {

        setIsUpdatingJITConfigs(true);
        setUpdatingIdPName(name);

        updateJITProvisioningConfigs(id, { ...jit, isEnabled: true })
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "console:develop.features.authenticationProvider." +
                        "notifications.updateJITProvisioning.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:develop.features.authenticationProvider." +
                        "notifications.updateJITProvisioning.success.message"
                    )
                }));
                // refreshAuthenticators();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t(
                        "console:develop.features.authenticationProvider.notifications." +
                        "updateJITProvisioning.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.features.authenticationProvider.notifications." +
                        "updateJITProvisioning.genericError.message"
                    )
                }));
            })
            .finally(() => {
                setIsUpdatingJITConfigs(false);
                setUpdatingIdPName(undefined);
            });

    };

    /**
     * When JIT provisioning config is being updated, we render
     * this loader inside the popup on top of the content as a
     * overlay.
     */
    const jitUpdatePopUpLoader = () => {
        if (isUpdatingJITConfigs) {
            return (
                <ContentLoader
                    text={ `Updating Connection ${ updatingIdPName }...` }
                />
            );
        }

        return <Fragment/>;
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
                <Icon name="info circle"/> Info
            </Label>
        );

        const WarningLabel = (
            <Label attached="top">
                <Icon name="warning circle"/> Warning
            </Label>
        );

        if (authenticator.category === AuthenticatorCategories.SECOND_FACTOR) {

            const result = SignInMethodUtils.isMFAConflictingWithProxyModeConfig({
                addingStep: currentStep,
                attributeStepId,
                authenticatorId: authenticator.defaultAuthenticator.authenticatorId,
                authenticators: authenticators,
                steps: authenticationSteps,
                subjectStepId
            });

            const { conflicting: proxyModeConflict, idpList } = result;

            if (proxyModeConflict) {
                if (idpList?.length === 1) {
                    const FIRST_ENTRY = 0;

                    return (
                        <div>
                            { WarningLabel }
                            <Text>
                                To configure <Code withBackground>{ authenticator.displayName }</Code>, you
                                should enable the Just-in-Time (JIT) User Provisioning for
                                the <span style={ INLINE_FLEX_STYLED }>
                                    <Link
                                        icon="linkify"
                                        onClick={ () => {
                                            history.push({
                                                pathname: AppConstants.getPaths()
                                                    .get("IDP_EDIT")
                                                    .replace(":id", idpList[ FIRST_ENTRY ].id)
                                            });
                                        } }>{ idpList[ FIRST_ENTRY ].name }</Link>
                                    <Checkbox
                                        toggle
                                        className="m-0 p-0 pl-2 mr-3"
                                        onClick={ () => onEnableJITConfigurationClick(idpList[ FIRST_ENTRY ]) }/>
                                </span> Identity Provider.
                            </Text>
                            <Accordion>
                                <Accordion.Title
                                    active={ accordionActiveIndex === SHOW_ACCORDION }
                                    onClick={ handleAccordionOnClick }
                                    content="More Information"/>
                                <Accordion.Content active={ accordionActiveIndex === SHOW_ACCORDION }>
                                    <Text>
                                        The above mentioned IdP is configured in the subject attribute step and have
                                        disabled JIT user provisioning. <Code withBackground>{
                                            authenticator.displayName
                                        }</Code> requires a user&apos;s reference to function as expected.
                                        Alternatively, you can use our <strong>conditional authentication
                                        script</strong> to write conditional logic and skip executing 2FA
                                        with this IdP.
                                    </Text>
                                </Accordion.Content>
                            </Accordion>
                            { jitUpdatePopUpLoader() }
                        </div>
                    );
                }
                if (idpList?.length > 1) {
                    return (
                        <div>
                            { WarningLabel }
                            <Text>
                                To configure <Code withBackground>{ authenticator.displayName }</Code>, you
                                should enable the Just-in-Time (JIT) User Provisioning for the following
                                Identity Providers.
                            </Text>
                            <ol className="mt-3 mb-3">
                                { idpList?.map((idp, index) => {
                                    const { name, id } = idp;

                                    return (
                                        <li key={ index } className="mb-1">
                                            <span style={ INLINE_FLEX_STYLED }>
                                                <Link
                                                    icon="linkify"
                                                    onClick={ () => {
                                                        history.push({
                                                            pathname: AppConstants.getPaths()
                                                                .get("IDP_EDIT")
                                                                .replace(":id", id)
                                                        });
                                                    } }>{ name }</Link>
                                                <Checkbox
                                                    toggle
                                                    className="m-0 p-0 pl-2 mr-3"
                                                    onClick={ () => onEnableJITConfigurationClick(idp) }/>
                                            </span>
                                        </li>
                                    );
                                }) }
                            </ol>
                            <Accordion>
                                <Accordion.Title
                                    active={ accordionActiveIndex === 0 }
                                    onClick={ handleAccordionOnClick }
                                    content="More Information"/>
                                <Accordion.Content active={ accordionActiveIndex === 0 }>
                                    <Text>
                                        The above-listed IdPs are configured in the subject attribute step and have
                                        disabled JIT user provisioning. <Code withBackground>{
                                            authenticator.displayName
                                        }</Code> requires a user&apos;s reference to function as expected.
                                        Alternatively, you can use our <strong>conditional authentication
                                        script</strong> to write conditional logic and skip executing 2FA
                                        with this IdP.
                                    </Text>
                                </Accordion.Content>
                            </Accordion>
                            { jitUpdatePopUpLoader() }
                        </div>
                    );
                }

                return <Fragment/>;
            }

            return (
                <>
                    {
                        (currentStep === 0)
                            ? (
                                <Fragment>
                                    { InfoLabel }
                                    <Text>
                                        {
                                            applicationConfig.signInMethod.authenticatorSelection.messages
                                                .secondFactorDisabledInFirstStep
                                            ?? t("console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                                ".secondFactorDisabledInFirstStep")
                                        }
                                    </Text>
                                </Fragment>
                            )
                            : (
                                <Fragment>
                                    { InfoLabel }
                                    <Text>
                                        {
                                            applicationConfig.signInMethod.authenticatorSelection.messages
                                                .secondFactorDisabled
                                            ?? (
                                                <Trans
                                                    i18nKey={
                                                        "console:develop.features.applications.edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.secondFactorDisabled"
                                                    }
                                                >
                                                    The second-factor authenticators can only be used if <Code
                                                        withBackground>Username & Password</Code>, <Code withBackground>
                                                    Social Login</Code> or any other handlers such as
                                                    <Code withBackground>Identifier First</Code> that can handle these
                                                    factors are present in a previous step.
                                                </Trans>
                                            )
                                        }
                                    </Text>
                                </Fragment>
                            )
                    }
                </>
            );
        } else if (authenticator.category === AuthenticatorCategories.SOCIAL) {
            return (
                <Fragment>
                    { InfoLabel }
                    <Text>
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.stepBased.authenticatorDisabled")
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

        /**
         * If selected authenticator falls into MFA category, then
         * re validate the selected authenticators list to make sure left side
         * has no proxy mode conflicts.
         */
        if (selectedAuthenticator.category === AuthenticatorCategories.SECOND_FACTOR) {
            const conflictingHandlers = new Set<string>(
                selectedAuthenticators
                    .filter(({ category }) => (
                        category === AuthenticatorCategories.SOCIAL.toString() ||
                        category === AuthenticatorCategories.ENTERPRISE.toString()
                    ))
                    .filter((auth: GenericAuthenticatorInterface & { provisioning: ProvisioningInterface }) => {
                        return !auth?.provisioning?.jit?.isEnabled;
                    })
                    .map(({ name }) => name)
                    .filter(Boolean)
            );
            const cleanedFilters = selectedAuthenticators.filter(({ name }) => !conflictingHandlers.has(name));

            onAuthenticatorSelect([ ...cleanedFilters, selectedAuthenticator ]);
            setSelectedAuthenticators([ ...cleanedFilters, selectedAuthenticator ]);

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
            {
                authenticators.map((authenticator: GenericAuthenticatorInterface, index) => (
                    <Popup
                        hoverable
                        hideOnScroll
                        position="top center"
                        key={ index }
                        on="hover"
                        disabled={ isFactorEnabled(authenticator) && isPopUpDisabled(authenticator) }
                        content={ resolvePopupContent(authenticator) }
                        trigger={ (
                            <InfoCard
                                showTooltips
                                imageSize="micro"
                                className={ authenticatorCardClasses }
                                header={
                                    AuthenticatorMeta.getAuthenticatorDisplayName(
                                        authenticator.defaultAuthenticator.authenticatorId)
                                    || authenticator.displayName
                                    || defaultName
                                }
                                disabled={ !isFactorEnabled(authenticator) }
                                selected={
                                    isFactorEnabled(authenticator) && Array.isArray(selectedAuthenticators)
                                    && selectedAuthenticators.some((evalAuthenticator) => {
                                        return evalAuthenticator.id === authenticator.id;
                                    })
                                }
                                subHeader={ authenticator.categoryDisplayName }
                                description={ authenticator.description }
                                image={ authenticator.image }
                                tags={ showLabels && resolveAuthenticatorLabels((authenticator?.defaultAuthenticator)) }
                                onClick={ () => {
                                    isFactorEnabled(authenticator) && handleAuthenticatorSelect(authenticator);
                                } }
                                imageOptions={ {
                                    floated: false,
                                    inline: true
                                } }
                                data-testid={ `${ testId }-authenticator-${ authenticator.name }` }
                            />
                        ) }
                    />
                ))
            }
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

const INLINE_FLEX_STYLED = {
    alignItems: "center",
    display: "inline-flex"
};
const COLLAPSE_ACCORDION = -1;
const SHOW_ACCORDION = 0;
