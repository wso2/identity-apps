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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Popup } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ClientSecretExpiryState, resolveClientSecretExpiry } from "./client-secret-utils";
import "./client-secret-status.scss";
import { ClientSecretInterface } from "../../models/application-inbound";

/**
 * Status text class name of each expiry state.
 */
const STATE_CLASS_NAMES: Record<ClientSecretExpiryState, string> = {
    [ ClientSecretExpiryState.ACTIVE ]: "client-secret-status-active",
    [ ClientSecretExpiryState.NEVER ]: "client-secret-status-active",
    [ ClientSecretExpiryState.EXPIRING ]: "client-secret-status-expiring",
    [ ClientSecretExpiryState.EXPIRED ]: "client-secret-status-expired"
};

/**
 * Props for the client secret status line.
 */
interface ClientSecretStatusPropsInterface extends IdentifiableComponentInterface {
    /**
     * Client secret whose status is rendered.
     */
    secret: ClientSecretInterface;
}

/**
 * Renders the expiry status of a client secret as coloured text; hovering reveals the exact date.
 *
 * @param props - Props injected to the component.
 * @returns Client secret status line.
 */
const ClientSecretStatus: FunctionComponent<ClientSecretStatusPropsInterface> = (
    props: ClientSecretStatusPropsInterface
): ReactElement => {

    const {
        secret,
        [ "data-componentid" ]: componentId = "client-secret-status"
    } = props;

    const { t } = useTranslation();

    const { state, humanizedExpiry, formattedDate } = resolveClientSecretExpiry(secret);

    let statusMessage: string;

    if (state === ClientSecretExpiryState.NEVER) {
        statusMessage = t("applications:clientSecrets.expiry.neverExpires");
    } else if (state === ClientSecretExpiryState.EXPIRED) {
        statusMessage = humanizedExpiry
            ? t("applications:clientSecrets.expiry.expiredAgo", { duration: humanizedExpiry })
            : t("applications:clientSecrets.expiry.expired");
    } else {
        statusMessage = t("applications:clientSecrets.expiry.expiresIn", { duration: humanizedExpiry });
    }

    let tooltipMessage: string | null = null;

    if (formattedDate) {
        tooltipMessage = state === ClientSecretExpiryState.EXPIRED
            ? t("applications:clientSecrets.expiry.expiredOn", { date: formattedDate })
            : t("applications:clientSecrets.expiry.expiresOn", { date: formattedDate });
    }

    const statusElement: ReactElement = (
        <span
            className={ classNames("client-secret-status-text", STATE_CLASS_NAMES[ state ]) }
            data-componentid={ `${ componentId }-text` }
        >
            { statusMessage }
        </span>
    );

    return (
        <div className="client-secret-status" data-componentid={ componentId }>
            { tooltipMessage
                ? (
                    <Popup
                        trigger={ statusElement }
                        content={ tooltipMessage }
                        position="right center"
                        size="mini"
                        inverted
                    />
                )
                : statusElement }
        </div>
    );
};

export default ClientSecretStatus;
