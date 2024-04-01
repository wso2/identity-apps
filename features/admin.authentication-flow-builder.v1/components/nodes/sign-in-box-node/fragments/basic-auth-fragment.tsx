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

import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BasicSignInOptionControls from "./basic-sign-in-option-controls";
import {
    IdentityProviderManagementConstants
} from "../../../../../admin.identity-providers.v1/constants/identity-provider-management-constants";

/**
 * Proptypes for the Basic Auth fragment component.
 */
export interface BasicAuthFragmentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to be fired when the option is removed.
     * @param event - Click event.
     * @param data - Data to be passed to the callback.
     */
    onOptionRemove: (
        event: MouseEvent<HTMLButtonElement>,
        data: {
            toRemove: string;
        }
    ) => void;
    /**
     * Callback to be fired when the option is switched.
     * @param event - Click event.
     * @param data - Data to be passed to the callback.
     */
    onOptionSwitch: (
        event: MouseEvent<HTMLButtonElement>,
        data: {
            toAdd: string;
            toRemove: string;
        }
    ) => void;
}

/**
 * Basic Auth fragment login option component with input fields.
 *
 * @param props - Props injected to the component.
 * @returns Basic Auth fragment login option as a React component.
 */
const BasicAuthFragment = (props: BasicAuthFragmentPropsInterface): ReactElement => {
    const {
        onOptionRemove,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <div className="basic-auth-fragment" data-componentid={ componentId }>
            <Typography align="center" className="oxygen-sign-in-header" variant="h4">
                { t("authenticationFlow:nodes.signIn.header") }
            </Typography>
            <BasicSignInOptionControls
                onOptionRemove={ (event: MouseEvent<HTMLButtonElement>) => {
                    onOptionRemove(event, {
                        toRemove: IdentityProviderManagementConstants.BASIC_AUTHENTICATOR
                    });
                } }
                optionSwitchTooltipContent={ t("authenticationFlow:nodes.signIn.controls.optionSwitchTooltipContent") }
                optionRemoveTooltipContent={ t("authenticationFlow:nodes.signIn.controls.optionRemoveTooltipContent") }
            >
                <TextField
                    required
                    fullWidth
                    autoComplete="off"
                    label={ t("authenticationFlow:nodes.signIn.form.fields.username.label") }
                    name="text"
                    value={ null }
                    placeholder={ t("authenticationFlow:nodes.signIn.form.fields.username.placeholder") }
                    className="non-interactive"
                />
                <TextField
                    required
                    fullWidth
                    name="password"
                    autoComplete="new-password"
                    label={ t("authenticationFlow:nodes.signIn.form.fields.password.label") }
                    type="password"
                    value={ null }
                    placeholder={ t("authenticationFlow:nodes.signIn.form.fields.password.placeholder") }
                    className="non-interactive"
                />
            </BasicSignInOptionControls>
            <FormGroup className="non-interactive">
                <FormControlLabel
                    control={ <Checkbox color="secondary" /> }
                    label={ t("authenticationFlow:nodes.signIn.form.fields.rememberMe.label") }
                />
            </FormGroup>
            <Button
                color="primary"
                variant="contained"
                className="oxygen-sign-in-cta non-interactive"
                type="submit"
                fullWidth
            >
                { t("authenticationFlow:nodes.signIn.form.actions.primary") }
            </Button>
        </div>
    );
};

/**
 * Default props for the Basic Auth fragment component.
 */
BasicAuthFragment.defaultProps = {
    "data-componentid": "basic-auth-fragment"
};

export default BasicAuthFragment;
