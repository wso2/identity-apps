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

import { PlusIcon } from "@oxygen-ui/react-icons";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import Link from "@oxygen-ui/react/Link";
import Paper from "@oxygen-ui/react/Paper";
import Radio from "@oxygen-ui/react/Radio";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    SVGAttributes,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { Handle, Node, Position } from "reactflow";
import ActiveSessionsLimitFragment from "./fragments/active-sessions-limit-fragment";
import BasicAuthFragment from "./fragments/basic-auth-fragment";
import EmailOTPFragment from "./fragments/email-otp-fragment";
import IdentifierFirstFragment from "./fragments/identifier-first-fragment";
import SMSOTPFragment from "./fragments/sms-otp-fragment";
import TOTPFragment from "./fragments/totp-fragment";
import {
    AuthenticationSequenceInterface,
    AuthenticatorInterface
} from "../../../../admin.applications.v1/models/application";
import useUIConfig from "../../../../admin.core.v1/hooks/use-ui-configs";
import {
    IdentityProviderManagementConstants
} from "../../../../admin.identity-providers.v1/constants/identity-provider-management-constants";
import { GenericAuthenticatorInterface } from "../../../../admin.identity-providers.v1/models/identity-provider";
import { useGetCurrentOrganizationType } from "../../../../admin.organizations.v1/hooks/use-get-organization-type";
import useAuthenticationFlow from "../../../hooks/use-authentication-flow";
import "./sign-in-box-node.scss";

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const CrossIcon = ({ ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 384 512" className="cross-icon" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
);

/**
 * Proptypes for the sign in box node component.
 */
export interface SignInBoxNodePropsInterface extends IdentifiableComponentInterface {
    /**
     * Data passed in to the node.
     */
    data: {
        /**
         * Authenticators.
         */
        authenticators: {
            local: GenericAuthenticatorInterface[];
            social: GenericAuthenticatorInterface[];
            enterprise: GenericAuthenticatorInterface[];
            secondFactor: GenericAuthenticatorInterface[];
            recovery: GenericAuthenticatorInterface[];
        };
        /**
         * Authentication sequence.
         */
        authenticationSequence: AuthenticationSequenceInterface;
        /**
         * Step index.
         */
        stepIndex: number;
        /**
         * Show self sign up.
         */
        showSelfSignUp?: boolean;
        /**
         * Callback to trigger when an sign in option is added.
         */
        onSignInOptionAdd: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
                toAdd?: string;
            }
        ) => void;
        /**
         * Callback to trigger when an sign in option is removed.
         */
        onSignInOptionRemove: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
                toRemove: string;
            }
        ) => void;
        /**
         * Callback to trigger when an sign in option is switched.
         */
        onSignInOptionSwitch: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
                toAdd: string;
                toRemove: string;
            }
        ) => void;
        /**
         * Callback to trigger when a step is removed.
         */
        onSignInStepRemove: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
            }
        ) => void;
        /**
         * Callback to trigger when the attribute identifier step is changed.
         */
        onAttributeIdentifierStepChange: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
            }
        ) => void;
        /**
         * Callback to trigger when the subject identifier step is changed.
         */
        onSubjectIdentifierStepChange: (
            event: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
            data: {
                stepIndex: number;
            }
        ) => void;
    } & IdentifiableComponentInterface;
}

/**
 * Sign in box node component.
 *
 * @param props - Props injected to the component.
 * @returns Sign in box node component.
 */
export const SignInBoxNode: FunctionComponent<SignInBoxNodePropsInterface> = (
    props: SignInBoxNodePropsInterface & Node
): ReactElement => {
    const {
        id,
        data
    } = props;

    const {
        authenticators: classifiedAuthenticators,
        authenticationSequence,
        onSignInOptionAdd,
        onSignInOptionRemove,
        onSignInOptionSwitch,
        onSignInStepRemove,
        onAttributeIdentifierStepChange,
        onSubjectIdentifierStepChange,
        stepIndex,
        showSelfSignUp,
        "data-componentid": componentId
    } = data;

    const { t } = useTranslation();

    const { updateVisualEditorFlowNodeMeta } = useAuthenticationFlow();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const { UIConfig } = useUIConfig();

    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const authenticators: GenericAuthenticatorInterface[] = Object.values(
        classifiedAuthenticators
    ).flat() as GenericAuthenticatorInterface[];

    /**
     * No need to show Basic Auth, Identifier first, Backup Code authenticator .etc, as a Sign In option button.
     */
    const getAuthenticatorsToNotShowAsOptions: string[] = useMemo(
        () => [ IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR ],
        []
    );

    /**
     * Update the node meta when the height changes.
     */
    useEffect(() => {
        if (ref && ref.current) {
            updateVisualEditorFlowNodeMeta(id, {
                height: ref.current.clientHeight,
                width: ref.current.clientWidth
            });
        }
    }, [ ref?.current?.clientHeight ]);

    /**
     * Get the basic sign in option.
     *
     * @returns The basic sign in option or returns undefined.
     */
    const getBasicSignInOption = (): string | undefined => {
        let basicSignInOption: string = undefined;

        const filteredOptions: AuthenticatorInterface[] = authenticationSequence?.steps?.[stepIndex]?.options?.filter(
            (option: AuthenticatorInterface) => {
                return !getAuthenticatorsToNotShowAsOptions.includes(option.authenticator);
            }
        );

        filteredOptions.forEach((option: AuthenticatorInterface) => {
            if (option.authenticator === IdentityProviderManagementConstants.BASIC_AUTHENTICATOR) {
                basicSignInOption = IdentityProviderManagementConstants.BASIC_AUTHENTICATOR;
            } else if (option.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR) {
                basicSignInOption = IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR;
            } else if (option.authenticator === IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR) {
                basicSignInOption = IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR;
            }

            if (filteredOptions.length === 1) {
                if (option.authenticator === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR) {
                    basicSignInOption = IdentityProviderManagementConstants.TOTP_AUTHENTICATOR;
                } else if (option.authenticator === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR) {
                    basicSignInOption = IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR;
                } else if (option.authenticator === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR) {
                    basicSignInOption = IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR;
                }
            }
        });

        return basicSignInOption;
    };

    /**
     * Generate dynamic sign in option.
     *
     * @param option - Authentication option.
     * @returns The sign in option.
     */
    const generateDynamicSignInOption = (option: AuthenticatorInterface): ReactElement => {
        if (!(authenticators && authenticators instanceof Array && authenticators.length > 0)) {
            return null;
        }

        let authenticator: GenericAuthenticatorInterface = null;

        if (option.idp === IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER) {
            authenticator = authenticators.find(
                (item: GenericAuthenticatorInterface) => item.defaultAuthenticator.name === option.authenticator
            );
        } else {
            authenticator = authenticators.find((item: GenericAuthenticatorInterface) => item.idp === option.idp);
        }

        if (!authenticator) {
            return null;
        }

        if (
            getAuthenticatorsToNotShowAsOptions.includes(authenticator.name) ||
            authenticator.name === getBasicSignInOption()
        ) {
            return null;
        }

        return (
            <div className="oxygen-sign-in-option with-cancel-button">
                <Tooltip title={ t("authenticationFlow:options.controls.remove") }>
                    <IconButton
                        size="small"
                        onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                            onSignInOptionRemove(e, {
                                stepIndex,
                                toRemove: authenticator?.defaultAuthenticator?.name
                            });
                        } }
                        className="remove-button"
                    >
                        <CrossIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    startIcon={ <img className="oxygen-sign-in-option-image" src={ authenticator.image } /> }
                    variant="contained"
                    className="oxygen-sign-in-option"
                    type="button"
                    fullWidth
                >
                    {
                        authenticator.displayName.startsWith("Sign In With")
                            ? authenticator.displayName
                            : t("authenticationFlow:options.displayName", { displayName: authenticator.displayName })
                    }
                </Button>
            </div>
        );
    };

    /**
     * Generate the basic sign in option.
     *
     * @returns Generated basic sign in option.
     */
    const generateBasicSignInOption = (): ReactElement => {
        const activeBasicSignInOption: string = getBasicSignInOption();

        if (activeBasicSignInOption === IdentityProviderManagementConstants.BASIC_AUTHENTICATOR) {
            return (
                <>
                    <BasicAuthFragment
                        onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                            onSignInOptionRemove(e, {
                                stepIndex,
                                toRemove
                            });
                        } }
                        onOptionSwitch={ (
                            e: MouseEvent<HTMLButtonElement>,
                            { toAdd, toRemove }: { toAdd: string; toRemove: string }
                        ) => {
                            onSignInOptionSwitch(e, {
                                stepIndex,
                                toAdd,
                                toRemove
                            });
                        } }
                    />
                    <Divider>{ t("authenticationFlow:options.divider") }</Divider>
                </>
            );
        }

        if (activeBasicSignInOption === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR) {
            return (
                <>
                    <IdentifierFirstFragment
                        onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                            onSignInOptionRemove(e, {
                                stepIndex,
                                toRemove
                            });
                        } }
                        onOptionSwitch={ (
                            e: MouseEvent<HTMLButtonElement>,
                            { toAdd, toRemove }: { toAdd: string; toRemove: string }
                        ) => {
                            onSignInOptionSwitch(e, {
                                stepIndex,
                                toAdd,
                                toRemove
                            });
                        } }
                    />
                    <Divider>{ t("authenticationFlow:options.divider") }</Divider>
                </>
            );
        }

        if (activeBasicSignInOption === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR) {
            return (
                <TOTPFragment
                    onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                        onSignInOptionRemove(e, {
                            stepIndex,
                            toRemove
                        });
                    } }
                />
            );
        }

        if (activeBasicSignInOption === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR) {
            return (
                <EmailOTPFragment
                    onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                        onSignInOptionRemove(e, {
                            stepIndex,
                            toRemove
                        });
                    } }
                />
            );
        }

        if (activeBasicSignInOption === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR) {
            return (
                <SMSOTPFragment
                    onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                        onSignInOptionRemove(e, {
                            stepIndex,
                            toRemove
                        });
                    } }
                />
            );
        }

        if (activeBasicSignInOption === IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR) {
            return (
                <>
                    <ActiveSessionsLimitFragment
                        onOptionRemove={ (e: MouseEvent<HTMLButtonElement>, { toRemove }: { toRemove: string }) => {
                            onSignInOptionRemove(e, {
                                stepIndex,
                                toRemove
                            });
                        } }
                        onOptionSwitch={ (
                            e: MouseEvent<HTMLButtonElement>,
                            { toAdd, toRemove }: { toAdd: string; toRemove: string }
                        ) => {
                            onSignInOptionSwitch(e, {
                                stepIndex,
                                toAdd,
                                toRemove
                            });
                        } }
                    />
                </>
            );
        }

        return (
            <></>
        );
    };

    /**
     * Check whether the backup codes is enabled for the step
     */
    const isBackupCodesEnabled: boolean = useMemo(() => {
        let isBackupCodesEnabled: boolean = false;

        authenticationSequence?.steps?.[stepIndex]?.options.map((option: AuthenticatorInterface) => {
            if (option.authenticator === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                isBackupCodesEnabled = true;
            }
        });

        return isBackupCodesEnabled;
    }, [ authenticationSequence ]);

    /**
     * Get the visibility of the sign in step configs.
     *
     * @returns The visibility of the sign in step configs.
     */
    const signInStepConfigsVisibility: [boolean, boolean, boolean] = useMemo(() => {
        let shouldShowSubjectIdentifierCheck: boolean = false;
        let shouldShowBackupCodesEnableCheck: boolean = false;

        authenticationSequence?.steps?.[stepIndex]?.options?.map((option: AuthenticatorInterface) => {
            if (
                [
                    IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR,
                    IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
                ].includes(option.authenticator)
            ) {
                shouldShowSubjectIdentifierCheck = false;
            } else {
                shouldShowSubjectIdentifierCheck = true;
            }

            // if the authenticator is TOTP, Email OTP, SMS OTP or Backup Code,
            // show the backup codes enable checkbox.
            if (
                [
                    IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR
                ].includes(option.authenticator)
            ) {
                // Disabling backup codes option for suborganization users until the IS7 migration is completed.
                if (
                    !isSubOrganization()
                    || (isSubOrganization() && UIConfig?.legacyMode?.backupCodesForSubOrganizations)
                ) {
                    shouldShowBackupCodesEnableCheck = true;
                }
            }
        });

        return [ shouldShowSubjectIdentifierCheck, shouldShowBackupCodesEnableCheck, isBackupCodesEnabled ];
    }, [ authenticationSequence ]);

    return (
        <div
            ref={ ref }
            className="sign-in-box-node"
            data-componentid={ `${componentId}-step-${stepIndex}` }
        >
            <div className="step-id">
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-step-${stepIndex}-id` }
                >
                    Step { stepIndex + 1 }
                </Typography>
            </div>
            { authenticationSequence?.steps?.length > 1 && (
                <Tooltip title={ t("authenticationFlow:options.controls.remove") }>
                    <IconButton
                        size="small"
                        onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                            onSignInStepRemove(e, { stepIndex });
                        } }
                        className="remove-button"
                    >
                        <CrossIcon />
                    </IconButton>
                </Tooltip>
            ) }
            { stepIndex !== 0 && <Handle type="target" position={ Position.Left } /> }
            <Box className="oxygen-sign-in" data-componentid={ `${componentId}-inner` }>
                <Paper className="oxygen-sign-in-box" elevation={ 0 } variant="outlined">
                    <Box className="oxygen-sign-in-form">
                        { generateBasicSignInOption() }
                        <div className="oxygen-sign-in-options-wrapper">
                            <div className="oxygen-sign-in-options">
                                { authenticationSequence?.steps?.[stepIndex]?.options?.map(
                                    (option: AuthenticatorInterface) => {
                                        return generateDynamicSignInOption(option);
                                    }
                                ) }
                                {
                                    (getBasicSignInOption() !==
                                        IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR)
                                    &&
                                    (<Button
                                        fullWidth
                                        startIcon={ <PlusIcon /> }
                                        variant="outlined"
                                        className="oxygen-sign-in-option oxygen-sign-in-option-add"
                                        type="button"
                                        onClick={ (e: MouseEvent<HTMLButtonElement>) =>
                                            onSignInOptionAdd(e, {
                                                stepIndex
                                            })
                                        }
                                        data-componentid={ `${componentId}-add-sign-in-option` }
                                    >
                                        { t("authenticationFlow:steps.controls.addOption") }
                                    </Button>)
                                }
                            </div>
                        </div>
                        { showSelfSignUp && (
                            <Grid container className="oxygen-sign-in-sign-up-link">
                                <Grid>{ t("authenticationFlow:steps.controls.signUp.hint") }</Grid>
                                <Grid>
                                    <Link href="#" className="oxygen-sign-in-sign-up-link-action">
                                        { t("authenticationFlow:steps.controls.signUp.label") }
                                    </Link>
                                </Grid>
                            </Grid>
                        ) }
                    </Box>
                </Paper>
            </Box>
            <Handle type="source" position={ Position.Right } id="a" />
            <FormGroup className="additional-behaviors">
                { signInStepConfigsVisibility[0] && (
                    <>
                        <FormControlLabel
                            checked={
                                authenticationSequence?.subjectStepId === authenticationSequence?.steps?.[stepIndex]?.id
                            }
                            control={ <Radio /> }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                onSubjectIdentifierStepChange(e, {
                                    stepIndex: authenticationSequence?.steps?.[stepIndex]?.id
                                });
                            } }
                            label={ t("authenticationFlow:nodes.controls.userAttributeSelector.label") }
                            data-componentid={ `${componentId}-user-identifier-picker` }
                        />
                        <FormControlLabel
                            checked={
                                authenticationSequence?.attributeStepId ===
                                authenticationSequence?.steps?.[stepIndex]?.id
                            }
                            control={ <Radio /> }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                onAttributeIdentifierStepChange(e, {
                                    stepIndex: authenticationSequence?.steps?.[stepIndex]?.id
                                });
                            } }
                            label={ t("authenticationFlow:nodes.controls.attributeSelector.label") }
                            data-componentid={ `${componentId}-attribute-identifier-picker` }
                        />
                    </>
                ) }
                { signInStepConfigsVisibility[1] && (
                    <FormControlLabel
                        checked={ isBackupCodesEnabled }
                        control={ <Checkbox /> }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                                onSignInOptionAdd(e, {
                                    stepIndex,
                                    toAdd: IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR
                                });
                            } else {
                                onSignInOptionRemove(e, {
                                    stepIndex,
                                    toRemove: IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR
                                });
                            }
                        } }
                        label={ t("authenticationFlow:nodes.controls.enableBackupCodes.label") }
                        data-componentid={ `${componentId}-enable-backup-code-picker` }
                    />
                ) }
            </FormGroup>
        </div>
    );
};

/**
 * Default props for the sign in box node component.
 */
SignInBoxNode.defaultProps = {
    "data-componentid": "sign-in-box-node"
};

export default SignInBoxNode;
