/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import {
    FederatedAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/federated-authenticator-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BasicSignInOptionControls from "./basic-sign-in-option-controls";
import { StepOptionActionsDataInterface } from "../../../../models/visual-editor";

/**
 * Proptypes for the Password Reset Enforcer fragment component.
 */
export interface PasswordResetEnforcerFragmentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to be fired when the option is removed.
     * @param event - Click event.
     * @param data - Data to be passed to the callback.
     */
    onOptionRemove: (
        event: MouseEvent<HTMLButtonElement>,
        data: StepOptionActionsDataInterface
    ) => void;
}

/**
 * Password Reset Enforcer fragment component with a non-interactive preview of the change password form.
 *
 * @param props - Props injected to the component.
 * @returns Password Reset Enforcer fragment as a React component.
 */
const PasswordResetEnforcerFragment = (props: PasswordResetEnforcerFragmentPropsInterface): ReactElement => {
    const {
        onOptionRemove,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <div className="password-reset-enforcer-fragment" data-componentid={ componentId }>
            <Typography align="center" className="oxygen-sign-in-header" variant="h4">
                { t("authenticationFlow:nodes.passwordResetEnforcer.header") }
            </Typography>
            <BasicSignInOptionControls
                onOptionRemove={ (event: MouseEvent<HTMLButtonElement>) => {
                    onOptionRemove(event, {
                        toRemove: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES
                            .PASSWORD_RESET_ENFORCER_AUTHENTICATOR_NAME
                    });
                } }
                optionRemoveTooltipContent={ t("authenticationFlow:nodes.signIn.controls.optionRemoveTooltipContent") }
            >
                <TextField
                    fullWidth
                    autoComplete="current-password"
                    label={ t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.currentPassword.label") }
                    name="currentPassword"
                    type="password"
                    value={ null }
                    placeholder={
                        t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.currentPassword.placeholder")
                    }
                    className="non-interactive"
                />
                <TextField
                    fullWidth
                    autoComplete="new-password"
                    label={ t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.newPassword.label") }
                    name="newPassword"
                    type="password"
                    value={ null }
                    placeholder={
                        t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.newPassword.placeholder")
                    }
                    className="non-interactive mb-1"
                />
                <ul className="password-reset-enforcer-validation-hints">
                    { (t("authenticationFlow:nodes.passwordResetEnforcer.form.validationHints",
                        { returnObjects: true }) as string[]).map((hint: string, index: number) => (
                        <li key={ index }>
                            <Typography variant="caption" color="text.secondary">
                                { hint }
                            </Typography>
                        </li>
                    )) }
                </ul>
                <TextField
                    fullWidth
                    autoComplete="new-password"
                    label={ t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.repeatPassword.label") }
                    name="repeatPassword"
                    type="password"
                    value={ null }
                    placeholder={
                        t("authenticationFlow:nodes.passwordResetEnforcer.form.fields.repeatPassword.placeholder")
                    }
                    className="non-interactive mb-1"
                />
                <ul className="password-reset-enforcer-validation-hints">
                    <li>
                        <Typography variant="caption" color="text.secondary">
                            { t("authenticationFlow:nodes.passwordResetEnforcer.form.matchHint") }
                        </Typography>
                    </li>
                </ul>
                <Button
                    color="primary"
                    variant="contained"
                    className="oxygen-sign-in-cta non-interactive"
                    type="submit"
                    fullWidth
                >
                    { t("authenticationFlow:nodes.passwordResetEnforcer.form.actionButton") }
                </Button>
            </BasicSignInOptionControls>
        </div>
    );
};

/**
 * Default props for the Password Reset Enforcer fragment component.
 */
PasswordResetEnforcerFragment.defaultProps = {
    "data-componentid": "password-reset-enforcer-fragment"
};

export default PasswordResetEnforcerFragment;
