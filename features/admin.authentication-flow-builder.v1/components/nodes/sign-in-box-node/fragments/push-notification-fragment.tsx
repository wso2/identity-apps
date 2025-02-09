/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Typography from "@oxygen-ui/react/Typography";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BasicSignInOptionControls from "./basic-sign-in-option-controls";

/**
 * Proptypes for the Push Notification fragment component.
 */
export interface PushNotificationFragmentPropsInterface extends IdentifiableComponentInterface {
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
 * Push Notification fragment login option component with input fields.
 *
 * @param props - Props injected to the component.
 * @returns Push Notification fragment login option as a React component.
 */
const PushNotificationFragment = (props: PushNotificationFragmentPropsInterface): ReactElement => {
    const {
        onOptionRemove,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <div className="push-fragment" data-componentid={ componentId }>
            <Typography align="center" className="oxygen-sign-in-header" variant="h4">
                { t("authenticationFlow:nodes.push.header") }
            </Typography>
            <BasicSignInOptionControls
                onOptionRemove={ (event: MouseEvent<HTMLButtonElement>) => {
                    onOptionRemove(event, {
                        toRemove: LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.PUSH_AUTHENTICATOR_NAME
                    });
                } }
                optionRemoveTooltipContent={ t("authenticationFlow:nodes.push.controls.optionRemoveTooltipContent") }
            >
                <Typography align="center" className="oxygen-sign-in-sub-header" variant="subtitle1">
                    { t("authenticationFlow:nodes.push.form.fields.code.label") }
                </Typography>
                <Button
                    color="primary"
                    variant="contained"
                    className="oxygen-sign-in-cta non-interactive resend-button"
                    type="submit"
                    fullWidth
                    disabled
                >
                    { t("authenticationFlow:nodes.push.form.actions.primary") }
                </Button>
            </BasicSignInOptionControls>
        </div>
    );
};

export default PushNotificationFragment;
