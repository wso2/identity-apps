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

import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import {
    Code,
    DocumentationLink,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import kebabCase from "lodash-es/kebabCase";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Icon, Message } from "semantic-ui-react";
import { ScriptBasedFlow } from "./script-based-flow";
import { StepBasedFlow } from "./step-based-flow";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import { AppState, ConfigReducerStateInterface, EventPublisher, FeatureConfigInterface } from "../../../../core";
import { GenericAuthenticatorInterface, IdentityProviderManagementConstants } from "../../../../identity-providers";
import { getRequestPathAuthenticators, updateAuthenticationSequence } from "../../../api";
import {
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface
} from "../../../models";
import { AdaptiveScriptUtils, ConnectionsJITUPConflictWithMFAReturnValue, SignInMethodUtils } from "../../../utils";

/**
 * Proptypes for the sign in methods customization entry point component.
 */
interface SignInMethodCustomizationPropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {

    /**
     * ID of the application.
     */
    appId: string;
    /**
     * All authenticators in the system.
     */
    authenticators: GenericAuthenticatorInterface[][];
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    setIsLoading?: any;
    /**
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void, template?: any) => void;
    /**
     * Callback for sequence reset.
     */
    onReset: () => void;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    refreshAuthenticators: () => Promise<void>;
}

/**
 * Entry point component for Application Sign-in method customization.
 *
 * @param {SignInMethodCustomizationPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SignInMethodCustomization: FunctionComponent<SignInMethodCustomizationPropsInterface> = (
    props: SignInMethodCustomizationPropsInterface
): ReactElement => {

    const {
        appId,
        authenticators,
        authenticationSequence,
        isLoading,
        setIsLoading,
        onIDPCreateWizardTrigger,
        onReset,
        onUpdate,
        readOnly,
        refreshAuthenticators,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ sequence, setSequence ] = useState<AuthenticationSequenceInterface>(authenticationSequence);
    const [ updateTrigger, setUpdateTrigger ] = useState<boolean>(false);
    const [ adaptiveScript, setAdaptiveScript ] = useState<string | string[]>(undefined);
    const [ requestPathAuthenticators, setRequestPathAuthenticators ] = useState<any>(undefined);
    const [ selectedRequestPathAuthenticators, setSelectedRequestPathAuthenticators ] = useState<any>(undefined);
    const [ steps, setSteps ] = useState<number>(1);
    const [ isDefaultScript, setIsDefaultScript ] = useState<boolean>(true);
    const [ isButtonDisabled, setIsButtonDisabled ] = useState<boolean>(false);
    const [ updatedSteps, setUpdatedSteps ] = useState<AuthenticationStepInterface[]>();

    const [ validationResult, setValidationResult ] =
        useState<ConnectionsJITUPConflictWithMFAReturnValue | undefined>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {

        const FEDERATED_CONNECTIONS = 1;

        const result = SignInMethodUtils.isConnectionsJITUPConflictWithMFA({
            federatedAuthenticators: authenticators[FEDERATED_CONNECTIONS],
            steps: updatedSteps,
            subjectStepId: authenticationSequence?.subjectStepId
        });

        setValidationResult(result);

    }, [ steps, authenticators, updatedSteps ]);

    /**
     * Toggles the update trigger.
     */
    useEffect(() => {
        if (!updateTrigger) {
            return;
        }

        setUpdateTrigger(false);
    }, [ updateTrigger ]);

    /**
     * Fetch data on component load
     */
    useEffect(() => {
        fetchRequestPathAuthenticators();
    }, []);

    /**
     * Updates the steps when the authentication sequence updates.
     */
    useEffect(() => {

        if (!authenticationSequence || !authenticationSequence?.steps || !Array.isArray(authenticationSequence.steps)) {
            return;
        }

        setSteps(authenticationSequence.steps.length);
    }, [ authenticationSequence ]);

    /**
     * Updates the number of authentication steps.
     *
     * @param {boolean} add - Set to `true` to add and `false` to remove.
     */
    const updateSteps = (add: boolean): void => {
        setSteps(add ? steps + 1 : steps - 1);
    };

    /**
     * Handles the data loading from a adaptive auth template when it is selected
     * from the panel.
     *
     * @param {AdaptiveAuthTemplateInterface} template - Adaptive authentication templates.
     */
    const handleLoadingDataFromTemplate = (template: AdaptiveAuthTemplateInterface): void => {
        if (!template) {
            return;
        }

        setIsDefaultScript(false);
        let newSequence = { ...sequence };

        if (template.code) {
            newSequence = {
                ...newSequence,
                requestPathAuthenticators: selectedRequestPathAuthenticators,
                script: JSON.stringify(template.code)
            };
        }

        if (template.defaultAuthenticators) {
            const steps: AuthenticationStepInterface[] = [];

            for (const [ key, value ] of Object.entries(template.defaultAuthenticators)) {
                steps.push({
                    id: parseInt(key, 10),
                    options: value.local.map((authenticator) => {
                        return {
                            authenticator,
                            idp: "LOCAL"
                        };
                    })
                });
            }

            newSequence = {
                ...newSequence,
                attributeStepId: 1,
                steps,
                subjectStepId: 1
            };
        }

        setSequence(newSequence);
    };

    /**
     * Handles authentication sequence update.
     *
     * @param {AuthenticationSequenceInterface} sequence - New authentication sequence.
     * @param {boolean} forceReset - Force reset to default configuration.
     */
    const handleSequenceUpdate = (sequence: AuthenticationSequenceInterface, forceReset?: boolean): void => {

        let requestBody;

        if (forceReset) {
            requestBody = {
                authenticationSequence: {
                    ...DefaultFlowConfigurationSequenceTemplate,
                    requestPathAuthenticators: selectedRequestPathAuthenticators,
                    script: ""
                }
            };
        } else {
            requestBody = {
                authenticationSequence: {
                    ...sequence,
                    requestPathAuthenticators: selectedRequestPathAuthenticators,
                    script: adaptiveScript
                }
            };
        }

        setIsLoading(true);
        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error) => {

                const DISALLOWED_PROGRAMMING_CONSTRUCTS = "APP-60001";

                if (error.response && error.response.data?.code === DISALLOWED_PROGRAMMING_CONSTRUCTS) {
                    dispatch(addAlert({
                        description: (
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.applications.notifications" +
                                        ".conditionalScriptLoopingError.description"
                                    }>
                                    Looping constructs such as <Code>for</Code>, <Code>while</Code> and,
                                    <Code>forEach</Code> are not allowed in the conditional authentication
                                    script.
                                </Trans>
                            </p>
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications" +
                            ".conditionalScriptLoopingError.message")
                    }));

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchRequestPathAuthenticators = (): void => {
        getRequestPathAuthenticators()
            .then((response) => {
                setRequestPathAuthenticators(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.message")
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError." +
                            "description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError.message")
                    }));
                }
            });
    };

    /**
     * Handles adaptive script change event.
     *
     * @param {string | string[]} script - Adaptive script from the editor.
     */
    const handleAdaptiveScriptChange = (script: string | string[]): void => {
        setAdaptiveScript(script);
    };

    /**
     * Handles the update button click event.
     */
    const handleUpdateClick = (): void => {
        if (AdaptiveScriptUtils.isEmptyScript(adaptiveScript)) {
            setAdaptiveScript(AdaptiveScriptUtils.generateScript(steps + 1).join("\n"));
            setIsDefaultScript(true);
        }

        eventPublisher.compute(() => {
            const eventPublisherProperties : {
                "script-based": boolean,
                "step-based": Array<Record<number, string>>
            } = {
                "script-based": !AdaptiveScriptUtils.isDefaultScript(adaptiveScript, steps),
                "step-based": []
            };

            updatedSteps.forEach((updatedStep) => {
                const step : Record<number, string> = {};

                if (Array.isArray(updatedStep?.options) && updatedStep.options.length > 0) {
                    updatedStep.options.forEach((element,id) => {
                        step[id] = kebabCase(element?.authenticator);
                    });
                    eventPublisherProperties["step-based"].push(step);
                }
            });

            eventPublisher.publish("application-sign-in-method-click-update-button", {
                type: eventPublisherProperties
            });
        });

        setUpdateTrigger(true);
    };

    const showRequestPathAuthenticators: ReactElement = (
        <>
            <Heading as="h4">{ t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                "requestPathAuthenticators.title") }</Heading>
            <Hint>{ t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                "requestPathAuthenticators.subTitle") }</Hint>
            <Forms>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="requestPathAuthenticators"
                                label=""
                                type="checkbox"
                                required={ false }
                                value={ authenticationSequence?.requestPathAuthenticators }
                                requiredErrorMessage=""
                                children={
                                    requestPathAuthenticators?.map(authenticator => {
                                        return {
                                            label: authenticator.displayName,
                                            value: authenticator.name
                                        };
                                    })
                                }
                                listen={
                                    (values) => {
                                        setSelectedRequestPathAuthenticators(values.get("requestPathAuthenticators"));
                                    }
                                }
                                readOnly={ readOnly }
                                data-testid={ `${ testId }-request-path-authenticators` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    );

    /**
     * Handles the update button disable state.
     */
    const handleButtonDisabledStateChange = (buttonStateDisabled: boolean): void => {
        setIsButtonDisabled(buttonStateDisabled);
    };

    /**
     * Renders update button.
     *
     * @return {React.ReactElement}
     */
    const renderUpdateButton = (): ReactElement => {

        if (readOnly) {
            return null;
        }

        return (
            <>
                <Divider hidden/>
                <PrimaryButton
                    onClick={ handleUpdateClick }
                    data-testid={ `${ testId }-update-button` }
                    disabled={ isButtonDisabled || isLoading }
                    loading={ isLoading }
                >
                    { t("common:update") }
                </PrimaryButton>
            </>
        );
    };


    const JITConflictMessage = () => {

        const FIRST_ENTRY = 0;
        const { idpList } = validationResult;
        const moreThan1IdP = idpList.length > 1;

        return (
            <Message
                size="large"
                data-componentid="jit-provisioning-mfa-in-sequence-warning-message"
                data-testid="jit-provisioning-mfa-in-sequence-warning-message"
                warning
                // Semantic hides warning messages inside <form> by default.
                // Overriding the behaviour here to make sure it renders properly.
                className="warning visible"
                header={ (
                    <Fragment>
                        <Icon name="exclamation triangle" className="mr-2"/>
                        Warning
                    </Fragment>
                ) }
                content={ (
                    <div className="mt-3 mb-2">
                        {
                            moreThan1IdP
                                ? (
                                    <Text>
                                        Currently, Just-in-Time (JIT) user provisioning
                                        is <strong>disabled</strong> for the following connections:
                                        <ul className="mb-3">
                                            { idpList?.map(({ name }, index) => (
                                                <li key={ index }>
                                                    <strong>{ name }</strong>
                                                </li>
                                            )) }
                                        </ul>
                                    </Text>
                                )
                                : (
                                    <Text>
                                        Currently, Just-in-Time(JIT) user provisioning is disabled
                                        for the <strong>{ idpList[FIRST_ENTRY].name }</strong> connection.
                                    </Text>
                                )
                        }
                        {
                            moreThan1IdP
                                ? (
                                    <Text>
                                        To use MFA with these connections, <em>enable JIT provisioning</em> or
                                        use an <em>authentication script</em> to skip the MFA options for
                                        these connections during user login.
                                    </Text>
                                )
                                : (
                                    <Text>
                                        To use MFA with this connection, <em>enable JIT provisioning</em> or
                                        use an <em>authentication script</em> to skip the MFA options for this
                                        connection during user login.
                                    </Text>
                                )
                        }
                        <Text className="mt-3 mb-0">
                            <DocumentationLink link={ getLink("develop.connections.edit.advancedSettings.jit") }>
                                Learn More
                            </DocumentationLink>
                        </Text>
                    </div>
                ) }
            />
        );
    };

    return (
        <div>
            <div>
                <Heading
                    as="h4"
                    className="display-inline-block"
                >
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "customization.heading")
                    }
                </Heading>
                {
                    !readOnly && (
                        <div className="display-inline-block floated right">
                            <LinkButton
                                className="pr-0"
                                onClick={ () => {
                                    handleSequenceUpdate(null, true);
                                    onReset();
                                } }
                            >
                                <Icon
                                    name="refresh"
                                >
                                </Icon>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "customization.revertToDefaultButton.label")
                                }
                            </LinkButton>
                            <Hint inline popup>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "customization.revertToDefaultButton.hint")
                                }
                            </Hint>
                        </div>
                    )
                }
            </div>
            <Divider hidden />
            {
                authenticationSequence.steps[ 0 ].options.find(authenticator =>
                    authenticator.authenticator === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR)
                && (
                    <Message warning>
                        <Trans
                            i18nKey={
                                t("console:develop.features.applications.edit.sections" +
                                ".signOnMethod.sections.landing.flowBuilder." +
                                "types.usernameless.info")
                            }>
                            To sign in with passwordless authentication, your users
                            should have their FIDO2 security keys or biometrics
                            registered via My Account. Learn more about
                            this in our { window[ "AppUtils" ].getConfig().docSiteUrl
                                ? (<a
                                    href={ window[ "AppUtils" ].getConfig().docSiteUrl }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-testid={ `fido-documentation-${ testId }` }>documentation</a>)
                                : <span>documentation</span> }.
                        </Trans>
                    </Message>
                )
            }
            <StepBasedFlow
                refreshAuthenticators={ refreshAuthenticators }
                authenticators={ authenticators }
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onUpdate={ handleSequenceUpdate }
                triggerUpdate={ updateTrigger }
                readOnly={ readOnly }
                data-testid={ `${ testId }-step-based-flow` }
                updateSteps={ updateSteps }
                onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                onAuthenticationSequenceChange={ (isDisabled, updatedSteps) => {
                    handleButtonDisabledStateChange(isDisabled);
                    setUpdatedSteps(updatedSteps);
                } }
            />
            <Divider className="x1" hidden/>
            { validationResult?.conflicting && validationResult?.idpList.length
                ? JITConflictMessage()
                : null
            }
            <Divider className="x2"/>
            <ScriptBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onTemplateSelect={ handleLoadingDataFromTemplate }
                onScriptChange={ handleAdaptiveScriptChange }
                readOnly={ readOnly }
                data-testid={ `${ testId }-script-based-flow` }
                authenticationSteps={ steps }
                isDefaultScript={ isDefaultScript }
                onAdaptiveScriptReset={ () => setIsDefaultScript(true) }
            />
            {
                (config?.ui?.isRequestPathAuthenticationEnabled === false)
                    ? null
                    : requestPathAuthenticators && showRequestPathAuthenticators
            }
            { renderUpdateButton() }
        </div>
    );
};

/**
 * Default props for the Application Sign-in method customization.
 */
SignInMethodCustomization.defaultProps = {
    "data-testid": "sign-in-method-customization"
};
