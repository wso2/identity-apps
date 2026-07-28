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
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Label, SemanticCOLORS } from "semantic-ui-react";
import { ClientSecretExpiryState, resolveClientSecretExpiry } from "./client-secret-utils";
import "./client-secret-status.scss";
import { ClientSecretInterface } from "../../models/application-inbound";

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
 * Renders the coloured status line of a client secret — e.g. "● Active : Expires on Sat, Sep 1 2026".
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

    const { state, formattedDate } = resolveClientSecretExpiry(secret);

    const resolveLabel = (): string => {
        switch (state) {
            case ClientSecretExpiryState.EXPIRED:
                return t("applications:clientSecrets.status.expired");
            case ClientSecretExpiryState.EXPIRING_WARNING:
            case ClientSecretExpiryState.EXPIRING_CRITICAL:
                return t("applications:clientSecrets.status.expiresSoon");
            default:
                return t("applications:clientSecrets.status.active");
        }
    };

    const resolveExpiryText = (): string => {
        switch (state) {
            case ClientSecretExpiryState.NEVER:
                return t("applications:clientSecrets.expiry.neverExpires");
            case ClientSecretExpiryState.EXPIRED:
                return t("applications:clientSecrets.expiry.expiredOn", { date: formattedDate });
            default:
                return t("applications:clientSecrets.expiry.expiresOn", { date: formattedDate });
        }
    };

    /* Colours match the connection status dot (LabelWithPopup) used across the console. */
    const resolveColor = (): SemanticCOLORS => {
        switch (state) {
            case ClientSecretExpiryState.EXPIRED:
                return "grey";
            case ClientSecretExpiryState.EXPIRING_CRITICAL:
                return "red";
            case ClientSecretExpiryState.EXPIRING_WARNING:
                return "yellow";
            default:
                return "green";
        }
    };

    return (
        <div className="client-secret-status" data-componentid={ componentId }>
            <Label circular empty size="mini" color={ resolveColor() } className="client-secret-status-dot" />
            <span className="client-secret-status-text">
                { `${ resolveLabel() } : ${ resolveExpiryText() }` }
            </span>
        </div>
    );
};

export default ClientSecretStatus;
