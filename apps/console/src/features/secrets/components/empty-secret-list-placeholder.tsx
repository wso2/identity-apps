/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { Icon } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../core";

/**
 * Props interface of {@link EmptySecretListPlaceholder}
 */
export type EmptySecretListPlaceholderProps = {
    onAddNewSecret: () => void;
} & IdentifiableComponentInterface;

/**
 * Show this component when a given secret-type has no secrets
 * added to it. It can be either adaptive script secrets or custom
 * created secret-types.
 *
 * TODO: Address https://github.com/wso2/product-is/issues/12447
 * @constructor
 */
export const EmptySecretListPlaceholder: FC<EmptySecretListPlaceholderProps> = (
    props: EmptySecretListPlaceholderProps
): ReactElement => {

    const {
        onAddNewSecret,
        ["data-componentid"]: testId
    } = props;

    return (
        <EmptyPlaceholder
            action={
                <PrimaryButton
                    onClick={ onAddNewSecret }>
                    <Icon name="add"/>
                    New Secret
                </PrimaryButton>
            }
            image={ getEmptyPlaceholderIllustrations().newList }
            imageSize="tiny"
            subtitle={ [
                "There are no secrets added for this secret type.",
                <>Click <strong>New Secret</strong> to start adding secrets!</>
            ] }
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
