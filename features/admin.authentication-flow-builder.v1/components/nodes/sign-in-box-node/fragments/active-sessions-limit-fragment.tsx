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

import Checkbox from "@oxygen-ui/react/Checkbox";
import Typography from "@oxygen-ui/react/Typography";
import {
    IdentityProviderManagementConstants
} from "@wso2is/admin.identity-providers.v1/constants/identity-provider-management-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BasicSignInOptionControls from "./basic-sign-in-option-controls";
import {
    CHROME_BROWSER_CONSTANT,
    FIREFOX_BROWSER_CONSTANT
} from "../../../../constants/active-sessions-limit-constants";
import { StepOptionActionsDataInterface } from "../../../../models/visual-editor";

/**
 * Proptypes for the Active Sessions Limit fragment component.
 */
export interface ActiveSessionsLimitFragmentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to be fired when the option is removed.
     * @param event - Click event.
     * @param data - Data to be passed to the callback.
     */
    onOptionRemove: (
        event: MouseEvent<HTMLButtonElement>,
        data: StepOptionActionsDataInterface
    ) => void;
    /**
     * Callback to be fired when the option is switched.
     * @param event - Click event.
     * @param data - Data to be passed to the callback.
     */
    onOptionSwitch: (
        event: MouseEvent<HTMLButtonElement>,
        data: StepOptionActionsDataInterface
    ) => void;
}

/**
 * Active Sessions Limit fragment login option component with input fields.
 *
 * @param props - Props injected to the component.
 * @returns Active Sessions Limit fragment login option as a React component.
 */
const ActiveSessionsLimitFragment = (props: ActiveSessionsLimitFragmentPropsInterface): ReactElement => {
    const {
        onOptionRemove,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const getDummyLastAccessedTime = () => {
        const start: Date = new Date();
        const end: Date = new Date();

        start.setDate(end.getDate() - 5);
        const lastAccessedDate: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

        return lastAccessedDate.toLocaleString([], {
            day: "2-digit",
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getActiveSessionsTable = () => {
        return (
            <table>
                <tr>
                    <th><Checkbox className="non-interactive" /></th>
                    <th>{ t("authenticationFlow:nodes.activeSessionsLimit.form.sessions.browserLabel") }</th>
                    <th>{ t("authenticationFlow:nodes.activeSessionsLimit.form.sessions.lastAccessedLabel") }</th>
                </tr>
                <tr>
                    <td><Checkbox className="non-interactive" /></td>
                    <td>{ CHROME_BROWSER_CONSTANT }</td>
                    <td> { getDummyLastAccessedTime() } </td>
                </tr>
                <tr>
                    <td><Checkbox className="non-interactive" /></td>
                    <td>{ FIREFOX_BROWSER_CONSTANT }</td>
                    <td> { getDummyLastAccessedTime() } </td>
                </tr>
            </table>);
    };

    return (
        <div className="active-sessions-limit-fragment" data-componentid={ componentId }>
            <Typography align="center" className="oxygen-sign-in-header" variant="h4">
                { t("authenticationFlow:nodes.activeSessionsLimit.header") }
            </Typography>
            <Typography align="center" className="oxygen-sign-in-sub-header" variant="subtitle1">
                { t("authenticationFlow:nodes.activeSessionsLimit.form.help") }
            </Typography>
            <BasicSignInOptionControls
                onOptionRemove={ (event: MouseEvent<HTMLButtonElement>) => {
                    onOptionRemove(event, {
                        toRemove: IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
                    });
                } }
                optionRemoveTooltipContent={ t("authenticationFlow:nodes.signIn.controls.optionRemoveTooltipContent") }
            >
                {
                    getActiveSessionsTable()
                }
            </BasicSignInOptionControls>
        </div>
    );
};

/**
 * Default props for the Active Sessions Limit fragment component.
 */
ActiveSessionsLimitFragment.defaultProps = {
    "data-componentid": "active-sessions-limit-fragment"
};

export default ActiveSessionsLimitFragment;
