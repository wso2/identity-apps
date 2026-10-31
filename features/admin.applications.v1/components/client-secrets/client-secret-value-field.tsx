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
import { CopyInputField } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "semantic-ui-react";
import "./client-secret-value-field.scss";

const MASKED_PLACEHOLDER: string = "••••••••••••••••••••••••••••";

/**
 * Props for the client secret value field.
 */
interface ClientSecretValueFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The client secret value to display (masked with show/copy).
     */
    value: string;
    /**
     * Whether the secret value is unavailable (e.g. when client secret hashing is enabled).
     * When true, a masked read-only field is shown without the show/copy actions.
     */
    hideSecretValue?: boolean;
}

/**
 * Single source of truth for how a client secret value is displayed. Fixing the field's width here
 * guarantees every secret (current and previous) renders at the same size.
 *
 * @param props - Props injected to the component.
 * @returns Client secret value field.
 */
const ClientSecretValueField: FunctionComponent<ClientSecretValueFieldPropsInterface> = (
    props: ClientSecretValueFieldPropsInterface
): ReactElement => {

    const {
        value,
        hideSecretValue,
        [ "data-componentid" ]: componentId = "client-secret-value-field"
    } = props;

    const { t } = useTranslation();

    return (
        <div className="client-secret-value-field" data-componentid={ componentId }>
            { hideSecretValue
                ? (
                    <Input
                        fluid
                        readOnly
                        type="password"
                        value={ MASKED_PLACEHOLDER }
                        data-componentid={ `${ componentId }-masked` }
                    />
                )
                : (
                    <CopyInputField
                        secret
                        value={ value }
                        hideSecretLabel={ t("applications:forms.inboundOIDC.fields.clientSecret.hideSecret") }
                        showSecretLabel={ t("applications:forms.inboundOIDC.fields.clientSecret.showSecret") }
                        data-componentid={ `${ componentId }-value` }
                    />
                )
            }
        </div>
    );
};

export default ClientSecretValueField;
