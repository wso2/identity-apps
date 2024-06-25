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
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import {
    IdentityProviderManagementConstants
} from "@wso2is/admin.identity-providers.v1/constants/identity-provider-management-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BasicSignInOptionControls from "./basic-sign-in-option-controls";

/**
 * Proptypes for the TOTP fragment component.
 */
export interface TOTPFragmentPropsInterface extends IdentifiableComponentInterface {
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
}

/**
 * TOTP fragment login option component with input fields.
 *
 * @param props - Props injected to the component.
 * @returns TOTP fragment login option as a React component.
 */
const TOTPFragment = (props: TOTPFragmentPropsInterface): ReactElement => {
    const {
        onOptionRemove,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <div className="totp-fragment" data-componentid={ componentId }>
            <Typography align="center" className="oxygen-sign-in-header" variant="h4">
                { t("authenticationFlow:nodes.totp.header") }
            </Typography>
            <Typography align="center" className="oxygen-sign-in-sub-header" variant="subtitle1">
                { t("authenticationFlow:nodes.totp.form.fields.code.label") }
            </Typography>
            <BasicSignInOptionControls
                onOptionRemove={ (event: MouseEvent<HTMLButtonElement>) => {
                    onOptionRemove(event, {
                        toRemove: IdentityProviderManagementConstants.TOTP_AUTHENTICATOR
                    });
                } }
                optionRemoveTooltipContent={ t("authenticationFlow:nodes.totp.controls.optionRemoveTooltipContent") }
            >
                <div className="pin-code-input-fields">
                    { [ ...Array(6) ].map((_: number, index: number) => (
                        <TextField
                            key={ `pincode-${index + 1}` }
                            id={ `pincode-${index + 1}` }
                            name="number"
                            placeholder="."
                            className="non-interactive"
                        />
                    )) }
                </div>
            </BasicSignInOptionControls>
            <Button
                color="primary"
                variant="contained"
                className="oxygen-sign-in-cta non-interactive"
                type="submit"
                fullWidth
            >
                { t("authenticationFlow:nodes.totp.form.actions.primary") }
            </Button>
            <Typography align="center" className="oxygen-sign-in-sub-header" variant="subtitle2">
                { t("authenticationFlow:nodes.totp.form.help") }
            </Typography>
        </div>
    );
};

/**
 * Default props for the TOTP fragment component.
 */
TOTPFragment.defaultProps = {
    "data-componentid": "totp-fragment"
};

export default TOTPFragment;
