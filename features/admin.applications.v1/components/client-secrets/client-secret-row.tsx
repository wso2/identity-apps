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
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import ClientSecretStatus from "./client-secret-status";
import ClientSecretValueField from "./client-secret-value-field";
import "./client-secret-row.scss";
import { ClientSecretInterface } from "../../models/application-inbound";

/**
 * Props for the client secret row.
 */
interface ClientSecretRowPropsInterface extends IdentifiableComponentInterface {
    /**
     * Client secret rendered by this row.
     */
    secret: ClientSecretInterface;
    /**
     * Whether the secret value is unavailable (client secret hashing enabled).
     */
    hideSecretValue?: boolean;
    /**
     * Action rendered beside the secret value — the "Generate New Secret" button for the current
     * secret, or the delete icon for a previous secret.
     */
    action?: ReactNode;
}

/**
 * A client secret row composed of two parts: the secret value field and an action (generate button
 * or delete icon), with the coloured status line beneath.
 *
 * @param props - Props injected to the component.
 * @returns Client secret row.
 */
const ClientSecretRow: FunctionComponent<ClientSecretRowPropsInterface> = (
    props: ClientSecretRowPropsInterface
): ReactElement => {

    const {
        secret,
        hideSecretValue,
        action,
        [ "data-componentid" ]: componentId = "client-secret-row"
    } = props;

    return (
        <div className="client-secret-row" data-componentid={ componentId }>
            <div className="client-secret-row-main">
                <ClientSecretValueField
                    value={ secret?.secretValue }
                    hideSecretValue={ hideSecretValue }
                    data-componentid={ `${ componentId }-value` }
                />
                { action && (
                    <div className="client-secret-row-action">
                        { action }
                    </div>
                ) }
            </div>
            <ClientSecretStatus secret={ secret } data-componentid={ `${ componentId }-status` } />
        </div>
    );
};

export default ClientSecretRow;
