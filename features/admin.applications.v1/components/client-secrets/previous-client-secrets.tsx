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

import IconButton from "@oxygen-ui/react/IconButton";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Message, Popup } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ClientSecretRow from "./client-secret-row";
import "./previous-client-secrets.scss";
import { ClientSecretInterface } from "../../models/application-inbound";

/**
 * Number of previous secrets shown before the list becomes scrollable.
 */
const MAX_VISIBLE_ROWS: number = 3;

/**
 * Props for the previous client secrets list.
 */
interface PreviousClientSecretsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Previous (non-latest) client secrets.
     */
    secrets: ClientSecretInterface[];
    /**
     * Whether the list is being fetched.
     */
    isLoading: boolean;
    /**
     * Whether the list is rendered in read-only mode.
     */
    readOnly?: boolean;
    /**
     * Whether secret values are unavailable (client secret hashing enabled).
     */
    hideSecretValue?: boolean;
    /**
     * Callback fired when a secret's delete icon is clicked.
     */
    onDelete: (secret: ClientSecretInterface) => void;
}

/**
 * Renders the lazily-loaded list of previous client secrets, each with a delete action.
 *
 * @param props - Props injected to the component.
 * @returns Previous client secrets list.
 */
const PreviousClientSecrets: FunctionComponent<PreviousClientSecretsPropsInterface> = (
    props: PreviousClientSecretsPropsInterface
): ReactElement => {

    const {
        secrets,
        isLoading,
        readOnly,
        hideSecretValue,
        onDelete,
        [ "data-componentid" ]: componentId = "previous-client-secrets"
    } = props;

    const { t } = useTranslation();

    if (isLoading) {
        return <ContentLoader data-componentid={ `${ componentId }-loader` } />;
    }

    return (
        <div className="previous-client-secrets" data-componentid={ componentId }>
            { /* The rotation hint guides generating/deleting secrets, so hide it in read-only mode. */ }
            { !readOnly && (
                <div className="previous-client-secrets-info">
                    <Message
                        type="info"
                        content={ t("applications:clientSecrets.rotationInfo") }
                        data-componentid={ `${ componentId }-info` }
                    />
                </div>
            ) }
            <div
                className={ classNames("previous-client-secrets-list", {
                    "previous-client-secrets-list-scroll": secrets?.length > MAX_VISIBLE_ROWS
                }) }
            >
                { secrets?.map((secret: ClientSecretInterface, index: number) => (
                    <ClientSecretRow
                        key={ secret?.secretId ?? index }
                        secret={ secret }
                        hideSecretValue={ hideSecretValue }
                        action={ !readOnly && (
                            <Popup
                                trigger={ (
                                    <IconButton
                                        type="button"
                                        onClick={ (): void => onDelete(secret) }
                                        aria-label={ t("common:delete") }
                                        data-componentid={ `${ componentId }-delete-${ index }` }
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                ) }
                                position="top center"
                                content={ t("common:delete") }
                                inverted
                            />
                        ) }
                        data-componentid={ `${ componentId }-row-${ index }` }
                    />
                )) }
            </div>
        </div>
    );
};

export default PreviousClientSecrets;
