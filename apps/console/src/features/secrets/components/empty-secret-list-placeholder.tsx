/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { AppConstants, getEmptyPlaceholderIllustrations, history } from "../../core";
import { FEATURE_BASE_PATH } from "../constants/secrets.common";

/**
 * Props interface of {@link EmptySecretListPlaceholder}
 */
export type EmptySecretListPlaceholderProps = {
    onAddNewSecret: () => void;
    resourceNotFound?: boolean;
} & IdentifiableComponentInterface;

/**
 * Show this component when a given secret-type has no secrets
 * added to it. It can be either adaptive script secrets or custom
 * created secret-types.
 *
 * @constructor
 * @return {ReactElement}
 */
export const EmptySecretListPlaceholder: FC<EmptySecretListPlaceholderProps> = (
    props: EmptySecretListPlaceholderProps
): ReactElement => {

    const {
        onAddNewSecret,
        resourceNotFound,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Navigate back to feature base.
     */
    const whenTheRequestedResourceIsNotFound = (): void => {
        history.push(AppConstants.getPaths().get(FEATURE_BASE_PATH));
    };

    if (resourceNotFound) {
        return (
            <EmptyPlaceholder
                action={
                    <LinkButton
                        aria-label={ t("console:develop.features.secrets.emptyPlaceholders" +
                            ".buttons.backToSecrets.ariaLabel") }
                        onClick={ whenTheRequestedResourceIsNotFound }>
                        <Icon name="backward"/>
                        { t("console:develop.features.secrets.emptyPlaceholders.buttons.backToSecrets.label") }
                    </LinkButton>
                }
                image={ getEmptyPlaceholderIllustrations().pageNotFound }
                imageSize="tiny"
                subtitle={ [
                    t("console:develop.features.secrets.emptyPlaceholders.resourceNotFound.messages.0"),
                    t("console:develop.features.secrets.emptyPlaceholders.resourceNotFound.messages.1")
                ] }
                data-testid={ testId }
            />
        );
    }

    return (
        <EmptyPlaceholder
            action={
                <Show when={ AccessControlConstants.SECRET_WRITE }>
                    <PrimaryButton
                        aria-label={
                            t("console:develop.features.secrets.emptyPlaceholders.buttons.addSecret.ariaLabel")
                        }
                        onClick={ onAddNewSecret }>
                        <Icon name="add"/>
                        { t("console:develop.features.secrets.emptyPlaceholders.buttons.addSecret.label") }
                    </PrimaryButton>
                </Show>
            }
            image={ getEmptyPlaceholderIllustrations().newList }
            imageSize="tiny"
            subtitle={ [ t("console:develop.features.secrets.emptyPlaceholders.emptyListOfSecrets.messages.0") ] }
            data-testid={ testId }
        />
    );

};

/**
 * Default props of {@link EmptySecretListPlaceholder}
 */
EmptySecretListPlaceholder.defaultProps = {
    "data-componentid": "empty-secret-list-placeholder"
};
