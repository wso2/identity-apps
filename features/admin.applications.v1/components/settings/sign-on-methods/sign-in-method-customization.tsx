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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import {
    Code,
    DocumentationLink,
    Heading,
    Hint,
    Link,
    LinkButton,
    Message,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon  } from "semantic-ui-react";
import { ScriptBasedFlow } from "./script-based-flow";
import { StepBasedFlow } from "./step-based-flow";
import DefaultFlowConfigurationSequenceTemplate from "./templates/default-sequence.json";
import useAuthenticationFlow from "../../../../admin.authentication-flow-builder.v1/hooks/use-authentication-flow";
import { AuthenticatorManagementConstants } from "../../../../admin-connections-v1";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    FeatureConfigInterface,
    history
} from "../../../../admin-core-v1";
import { getMultiFactorAuthenticatorDetails } from "../../../../admin-identity-providers-v1/api";
import {
    IdentityProviderManagementConstants
} from "../../../../admin-identity-providers-v1/constants/identity-provider-management-constants";
import { GenericAuthenticatorInterface } from "../../../../admin-identity-providers-v1/models/identity-provider";
import { OrganizationType } from "../../../../admin-organizations-v1/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../../../admin-server-configurations-v1/models/governance-connectors";
import { getRequestPathAuthenticators, updateAuthenticationSequence } from "../../../api";
import {
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface,
    AuthenticatorInterface,
    FederatedConflictWithSMSOTPReturnValueInterface
} from "../../../models";
import { AdaptiveScriptUtils } from "../../../utils/adaptive-script-utils";
import { ConnectionsJITUPConflictWithMFAReturnValue, SignInMethodUtils } from "../../../utils/sign-in-method-utils";
import "./sign-in-method-customization.scss";

/**
 * Proptypes for the sign in methods customization entry point component.
 */
interface SignInMethodCustomizationPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {

    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Name of the application.
     */
    applicationName?: string;
    /**
     * Whether the application is shared between organizations or not.
     */
    isApplicationShared: boolean;
    /**
     * All authenticators in the system.
     */
    authenticators: GenericAuthenticatorInterface[][];
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * ClientId of the application.
     */
    clientId?: string;
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
}

/**
 * Entry point component for Application Sign-in method customization.
 *
 * @param props - Props injected to the component.
 *
 * @returns React.ReactElement
 */
export const SignInMethodCustomization: FunctionComponent<SignInMethodCustomizationPropsInterface> = (
    props: SignInMethodCustomizationPropsInterface
): ReactElement => {

    const {
        appId,
        applicationName,
        authenticators,
        authenticationSequence,
        clientId,
        isLoading,
        setIsLoading,
        onIDPCreateWizardTrigger,
        onReset,
        onUpdate,
        readOnly,
        isApplicationShared,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const { isSystemApplication } = useAuthenticationFlow();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const orgType: OrganizationType = useSelector((state: AppState) =>
        state?.organization?.organizationType);

    const [ sequence, setSequence ] = useState<AuthenticationSequenceInterface>(undefined);
    const [ updateTrigger, setUpdateTrigger ] = useState<boolean>(false);
    const [ adaptiveScript, setAdaptiveScript ] = useState<string | string[]>(undefined);
    const [ requestPathAuthenticators, setRequestPathAuthenticators ] = useState<any>(undefined);
    const [ selectedRequestPathAuthenticators, setSelectedRequestPathAuthenticators ] = useState<any>(undefined);
    const [ steps, setSteps ] = useState<number>(1);
    const [ isDefaultScript, setIsDefaultScript ] = useState<boolean>(false);
    const [ isButtonDisabled, setIsButtonDisabled ] = useState<boolean>(false);
    const [ updatedSteps, setUpdatedSteps ] = useState<AuthenticationStepInterface[]>();
    const [ isPasskeyProgressiveEnrollmentEnabled, setIsPasskeyProgressiveEnrollmentEnabled ] =
        useState<boolean>(false);

    const [ validationResult, setValidationResult ] =
        useState<ConnectionsJITUPConflictWithMFAReturnValue | undefined>(undefined);
    const [ smsValidationResult, setSmsValidationResult ] =
        useState<FederatedConflictWithSMSOTPReturnValueInterface>(null);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {

        const FEDERATED_CONNECTIONS: number = 1;

        const result: ConnectionsJITUPConflictWithMFAReturnValue = SignInMethodUtils.isConnectionsJITUPConflictWithMFA({
            federatedAuthenticators: authenticators && authenticators[FEDERATED_CONNECTIONS],
            steps: updatedSteps,
            subjectStepId: authenticationSequence?.subjectStepId
        });

        setValidationResult(result);

        const federatedSMSConflictResult: FederatedConflictWithSMSOTPReturnValueInterface =
        SignInMethodUtils.isFederatedConflictWithSMSOTP({
            federatedAuthenticators: authenticators && authenticators[FEDERATED_CONNECTIONS],
            steps: updatedSteps,
            subjectStepId: authenticationSequence?.subjectStepId
        });

        setSmsValidationResult(federatedSMSConflictResult);

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
        if (readOnly) return;

        fetchRequestPathAuthenticators();
    }, []);

    useEffect(() => {
        if (readOnly) return;

        getMultiFactorAuthenticatorDetails(AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID)
            .then((response: GovernanceConnectorInterface) => {
                const properties: ConnectorPropertyInterface[] = response?.properties;
                const passkeyProgressiveEnrollmentProperty: ConnectorPropertyInterface | undefined =
                    properties?.find((property: ConnectorPropertyInterface) =>
                        property.name === "FIDO.EnablePasskeyProgressiveEnrollment");
                const isPasskeyProgressiveEnrollmentEnabled: boolean =
                    passkeyProgressiveEnrollmentProperty?.value === "true";

                setIsPasskeyProgressiveEnrollmentEnabled(isPasskeyProgressiveEnrollmentEnabled);
            });
    }, []);

    /**
     * Updates the steps when the authentication sequence updates.
     */
    useEffect(() => {

        if (!authenticationSequence || !authenticationSequence?.steps || !Array.isArray(authenticationSequence.steps)) {
            return;
        }

        setSequence(authenticationSequence);
        setSteps(authenticationSequence.steps.length);
    }, [ authenticationSequence ]);

    /**
     * Updates the number of authentication steps.
     *
     * @param add - Set to `true` to add and `false` to remove.
     */
    const updateSteps = (add: boolean): void => {
        setSteps(add ? steps + 1 : steps - 1);
    };

    /**
     * Handles the data loading from a adaptive auth template when it is selected
     * from the panel.
     *
     * @param template - Adaptive authentication templates.
     */
    const handleLoadingDataFromTemplate = (template: AdaptiveAuthTemplateInterface): void => {
        if (!template) {
            return;
        }

        setIsDefaultScript(false);
        let newSequence: AuthenticationSequenceInterface = { ...sequence };

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
                    options: value.local.map((authenticator: string) => {
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
     * @param sequence - New authentication sequence.
     * @param forceReset - Force reset to default configuration.
     */
    const handleSequenceUpdate = (sequence: AuthenticationSequenceInterface, forceReset?: boolean): void => {

        let requestBody: any;

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

        // If the updating application is a system application,
        // we need to send the application name in the PATCH request.
        if (isSystemApplication) {
            requestBody.name = applicationName;
        }

        setIsLoading(true);
        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateAuthenticationFlow" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateAuthenticationFlow" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {

                const DISALLOWED_PROGRAMMING_CONSTRUCTS: string = "APP-60001";

                if (error.response && error.response.data?.code === DISALLOWED_PROGRAMMING_CONSTRUCTS) {
                    dispatch(addAlert({
                        description: (
                            <p>
                                <Trans
                                    i18nKey={
                                        "applications:notifications" +
                                        ".conditionalScriptLoopingError.description"
                                    }>
                                    Looping constructs such as <Code>for</Code>, <Code>while</Code> and,
                                    <Code>forEach</Code> are not allowed in the conditional authentication
                                    script.
                                </Trans>
                            </p>
                        ),
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications" +
                            ".conditionalScriptLoopingError.message")
                    }));

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateAuthenticationFlow" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateAuthenticationFlow" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateAuthenticationFlow" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchRequestPathAuthenticators = (): void => {
        getRequestPathAuthenticators()
            .then((response: AxiosResponse) => {
                setRequestPathAuthenticators(response);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("applications:edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("applications:edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.message")
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t("applications:edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError." +
                            "description"),
                        level: AlertLevels.ERROR,
                        message: t("applications:edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError.message")
                    }));
                }
            });
    };

    /**
     * Handles adaptive script change event.
     *
     * @param script - Adaptive script from the editor.
     */
    const handleAdaptiveScriptChange = (script: string | string[]): void => {
        setAdaptiveScript(script);
    };

    /**
     * Handles the update button click event.
     */
    const handleUpdateClick = (): void => {
        if (AdaptiveScriptUtils.isEmptyScript(adaptiveScript)) {
            if (!isAdaptiveAuthenticationAvailable || (orgType === OrganizationType.SUBORGANIZATION)) {
                setAdaptiveScript("");
            } else {
                setAdaptiveScript(AdaptiveScriptUtils.generateScript(steps + 1).join("\n"));
                setIsDefaultScript(true);
            }
        }

        eventPublisher.compute(() => {
            const eventPublisherProperties : {
                "script-based": boolean,
                "step-based": Array<Record<number, string>>
            } = {
                "script-based": !AdaptiveScriptUtils.isDefaultScript(adaptiveScript, steps),
                "step-based": []
            };

            updatedSteps.forEach((updatedStep: AuthenticationStepInterface) => {
                const step : Record<number, string> = {};

                if (Array.isArray(updatedStep?.options) && updatedStep.options.length > 0) {
                    updatedStep.options.forEach((element: AuthenticatorInterface, id: number) => {
                        step[id] = kebabCase(element?.authenticator);
                    });
                    eventPublisherProperties["step-based"].push(step);
                }
            });

            eventPublisher.publish(
                "application-sign-in-method-click-update-button",
                { "client-id": clientId, type: eventPublisherProperties }
            );
        });

        setUpdateTrigger(true);
    };

    const showRequestPathAuthenticators: ReactElement = (
        <>
            <Heading as="h4">{ t("applications:edit.sections.signOnMethod.sections." +
                "requestPathAuthenticators.title") }</Heading>
            <Hint>{ t("applications:edit.sections.signOnMethod.sections." +
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
                                    requestPathAuthenticators?.map((authenticator: GenericAuthenticatorInterface) => {
                                        return {
                                            label: authenticator.displayName,
                                            value: authenticator.name
                                        };
                                    })
                                }
                                listen={
                                    (values: Map<string, FormValue>) => {
                                        setSelectedRequestPathAuthenticators(values.get("requestPathAuthenticators"));
                                    }
                                }
                                readOnly={ readOnly }
                                data-componentid={ `${ componentId }-request-path-authenticators` }
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
     * @returns React.ReactElement
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
                    data-componentid={ `${ componentId }-update-button` }
                    disabled={ isButtonDisabled || isLoading }
                    loading={ isLoading }
                >
                    { t("common:update") }
                </PrimaryButton>
            </>
        );
    };


    const JITConflictMessage = () => {

        const FIRST_ENTRY: number = 0;
        const { idpList } = validationResult;
        const moreThan1IdP: boolean = idpList.length > 1;

        return (
            <Message
                data-componentid="jit-provisioning-mfa-in-sequence-warning-message"
                type="warning"
                // Semantic hides warning messages inside <form> by default.
                // Overriding the behaviour here to make sure it renders properly.
                header="Warning"
                content={ (
                    <>
                        {
                            moreThan1IdP
                                ? (
                                    <>
                                        Currently, Just-in-Time (JIT) user provisioning
                                        is <strong>disabled</strong> for the following connections:
                                        <ul className="mb-3">
                                            { idpList?.map(({ name }:{name: string}, index: number) => (
                                                <li key={ index }>
                                                    <strong>{ name }</strong>
                                                </li>
                                            )) }
                                        </ul>
                                    </>
                                )
                                : (
                                    <>
                                        Currently, Just-in-Time(JIT) user provisioning is disabled
                                        for the <strong>{ idpList[FIRST_ENTRY].name }</strong> connection.
                                    </>
                                )
                        }
                        {
                            moreThan1IdP
                                ? (
                                    <>
                                        To use MFA with these connections, <em>enable JIT provisioning</em> or
                                        use an <em>authentication script</em> to skip the MFA options for
                                        these connections during user login.
                                    </>
                                )
                                : (
                                    <>
                                        To use MFA with this connection, <em>enable JIT provisioning</em> or
                                        use an <em>authentication script</em> to skip the MFA options for this
                                        connection during user login.
                                    </>
                                )
                        }
                        <DocumentationLink link={ getLink("develop.connections.edit.advancedSettings.jit") }>
                            Learn More
                        </DocumentationLink>
                    </>
                ) }
            />
        );
    };

    const SMSOTPConflictMessage = () => {

        const { idpList } = smsValidationResult;

        return (
            <Message
                data-componentid="jit-provisioning-mfa-in-sequence-warning-message"
                type="info"
                // Semantic hides warning messages inside <form> by default.
                // Overriding the behaviour here to make sure it renders properly.
                content={ (
                    <>
                        {
                            idpList.length > 1
                                ? (
                                    <>
                                        <Trans
                                            i18nKey={
                                                "applications:edit.sections." +
                                                "signOnMethod.sections.authenticationFlow.sections." +
                                                "stepBased.federatedSMSOTPConflictNote.multipleIdps"
                                            }>
                                            Asgardeo requires the user&apos;s profile containing the
                                            <i> mobile number</i> to configure
                                            <strong> SMS OTP</strong> with the following connections.
                                        </Trans>

                                        <ul className="mb-3">
                                            { idpList?.map(({ name }:{name: string}) => (
                                                <li key={ name }>
                                                    <strong>{ name }</strong>
                                                </li>
                                            )) }
                                        </ul>
                                    </>
                                )
                                : (
                                    <>
                                        <Trans
                                            i18nKey={
                                                "applications:edit.sections." +
                                                "signOnMethod.sections.authenticationFlow.sections." +
                                                "stepBased.federatedSMSOTPConflictNote.singleIdp"
                                            }
                                            values={ { idpName: idpList[0].name } }
                                        >
                                            Asgardeo requires the user&apos;s profile containing the
                                            <i> mobile number</i> to configure <strong> SMS OTP </strong>
                                            with <strong>{ idpList[0].name }</strong> connection.
                                        </Trans>
                                    </>
                                )
                        }
                    </>
                ) }
            />
        );
    };

    const renderPasskeyWarnMessages = (): ReactElement => {
        const isPasskeyIncludedInAnyStep: boolean = authenticationSequence?.steps.some(
            (step: AuthenticationStepInterface) =>
                !!step?.options.find(
                    (authenticator: AuthenticatorInterface) =>
                        authenticator?.authenticator === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR
                )
        );

        if (isPasskeyIncludedInAnyStep) {
            if (isPasskeyProgressiveEnrollmentEnabled) {
                const isPasskeyIncludedAsAFirstFatorOption: boolean = !!authenticationSequence?.steps[0]?.options.find(
                    (authenticator: AuthenticatorInterface) =>
                        authenticator?.authenticator === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR
                );

                if (isPasskeyIncludedAsAFirstFatorOption) {
                    return (
                        <Message
                            type="info"
                            content={
                                (
                                    <>
                                        { t("applications:edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.passkey.info.progressiveEnrollmentEnabled") }
                                        <p>
                                            <Trans
                                                i18nKey={
                                                    t("applications:edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder.types.passkey." +
                                                    "info.passkeyAsFirstStepWhenprogressiveEnrollmentEnabled")
                                                }
                                            >
                                                <strong>Note : </strong> For on-the-fly user enrollment with passkeys,
                                                use the <strong>Passkeys Progressive Enrollment</strong> template in
                                                <strong> Conditional Authentication</strong> section.
                                            </Trans>
                                            <DocumentationLink
                                                link={
                                                    getLink("develop.applications.editApplication.signInMethod.fido")
                                                }
                                                showEmptyLink={ false }
                                            >
                                                { t("common:learnMore") }
                                            </DocumentationLink>
                                        </p>
                                    </>
                                )
                            }
                        />
                    );
                } else {
                    return (
                        <Message
                            type="info"
                            content={
                                (<>
                                    {
                                        t("applications:edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder." +
                                        "types.passkey.info.progressiveEnrollmentEnabled")
                                    }
                                    <p>
                                        <Trans
                                            i18nKey={
                                                t("applications:edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.passkey." +
                                                "info.passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled")
                                            }
                                        >
                                            Users can enroll passkeys on-the-fly. If users wish to enroll multiple
                                            passkeys they should do so via <strong>My Account</strong>.
                                        </Trans>
                                        <DocumentationLink
                                            link={ getLink("develop.applications.editApplication.signInMethod.fido") }
                                            showEmptyLink={ false }
                                        >
                                            { t("common:learnMore") }
                                        </DocumentationLink>
                                    </p>
                                </>)
                            }
                        />
                    );
                }
            } else {
                return (
                    <Message
                        type="info"
                        content={
                            (<>
                                <Trans
                                    i18nKey={
                                        t("applications:edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder." +
                                        "types.passkey.info.progressiveEnrollmentDisabled")
                                    }
                                >
                                    <Link
                                        external={ false }
                                        onClick={ () => {
                                            history.push(
                                                AppConstants.getPaths().get("IDP_EDIT")
                                                    .replace(
                                                        ":id", AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID)
                                            );
                                        } }
                                    >
                                    Passkey progressive enrollment
                                    </Link>
                                    &nbsp; is disabled. Users must enroll
                                    their passkeys through <strong>My Account</strong> to use passwordless sign-in.
                                </Trans>
                                <DocumentationLink
                                    link={ getLink("develop.applications.editApplication.signInMethod.fido") }
                                    showEmptyLink={ false }
                                >
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </>)
                        }
                    />
                );
            }
        }
    };

    return (
        <div>
            <div>
                <Heading
                    as="h4"
                    className="display-inline-block"
                >
                    {
                        t("applications:edit.sections.signOnMethod.sections." +
                            "customization.heading")
                    }
                </Heading>
                {
                    !readOnly && (
                        <div className="display-inline-block floated right">
                            <LinkButton
                                className="pr-0"
                                onClick={ () => {
                                    eventPublisher.publish(
                                        "application-revert-sign-in-method-default",
                                        { "client-id": clientId }
                                    );
                                    handleSequenceUpdate(null, true);
                                    onReset();
                                } }
                            >
                                <Icon
                                    name="refresh"
                                >
                                </Icon>
                                {
                                    t("applications:edit.sections.signOnMethod.sections." +
                                        "customization.revertToDefaultButton.label")
                                }
                            </LinkButton>
                            <Hint inline popup>
                                {
                                    t("applications:edit.sections.signOnMethod.sections." +
                                        "customization.revertToDefaultButton.hint")
                                }
                            </Hint>
                        </div>
                    )
                }
            </div>
            <Divider hidden />
            { renderPasskeyWarnMessages() }
            { !validationResult?.conflicting && smsValidationResult?.conflicting && smsValidationResult?.idpList.length
                ? SMSOTPConflictMessage()
                : null
            }
            <StepBasedFlow
                isApplicationShared={ isApplicationShared }
                authenticators={ authenticators }
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onUpdate={ handleSequenceUpdate }
                triggerUpdate={ updateTrigger }
                readOnly={ readOnly }
                updateSteps={ updateSteps }
                onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                onAuthenticationSequenceChange={ (isDisabled: boolean, updatedSteps: AuthenticationStepInterface[]) => {
                    handleButtonDisabledStateChange(isDisabled);
                    setUpdatedSteps(updatedSteps);
                } }
                data-componentid={ `${ componentId }-step-based-flow` }
            />
            <Divider className="x1" hidden/>
            { validationResult?.conflicting && validationResult?.idpList.length
                ? JITConflictMessage()
                : null
            }
            <Divider className="x2"/>
            {
                (isAdaptiveAuthenticationAvailable && orgType !== OrganizationType.SUBORGANIZATION)
                && (
                    <ScriptBasedFlow
                        authenticationSequence={ sequence }
                        isLoading={ isLoading }
                        onTemplateSelect={ handleLoadingDataFromTemplate }
                        onScriptChange={ handleAdaptiveScriptChange }
                        readOnly={ readOnly }
                        authenticationSteps={ steps }
                        isDefaultScript={ isDefaultScript }
                        onAdaptiveScriptReset={ () => setIsDefaultScript(true) }
                        data-componentid={ `${ componentId }-script-based-flow` }
                    />
                )
            }
            {
                (config?.ui?.legacyMode?.applicationRequestPathAuthentication && requestPathAuthenticators)
                    ? showRequestPathAuthenticators
                    : null
            }
            { renderUpdateButton() }
        </div>
    );
};

/**
 * Default props for the Application Sign-in method customization.
 */
SignInMethodCustomization.defaultProps = {
    "data-componentid": "sign-in-method-customization"
};
