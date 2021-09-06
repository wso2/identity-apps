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
import { Message, PageLayout, PrimaryButton, Text } from "@wso2is/react-components";
import React, { FC, ReactElement, useState } from "react";
import { Icon } from "semantic-ui-react";
import AddSecretWizard from "../components/add-secret-wizard";
import SecretsList from "../components/secrets-list";

export type SecretsPageProps = {} & IdentifiableComponentInterface;

/**
 * TODO: Add <Show> component & Event publishers & i18n strings.
 * The secrets list of page.
 * @constructor
 */
const SecretsPage: FC<SecretsPageProps> = (props: SecretsPageProps): ReactElement => {

    const [ showAddSecretModal, setShowAddSecretModal ] = useState<boolean>(false);

    const onAddNewSecret = (): void => {
        setShowAddSecretModal(true);
    };

    const onAddNewSecretModalClose: () => void = (): void => {
        setShowAddSecretModal(false);
    };

    return (
        <PageLayout
            title={ "Secrets" }
            description={ "Create and manage secrets for External APIs or Adaptive Authentication" }
            action={ <AddNewSecretActionButton onClick={ onAddNewSecret }/> }>

            <Message>
                <Text>
                    These secrets can be used in the Adaptive Authentication script of a registered application
                    when accessing external APIs.
                </Text>
            </Message>
            <SecretsList secretType="ADAPTIVE_AUTH_CALL_CHOREO"/>
            { showAddSecretModal && (
                <AddSecretWizard
                    onClose={ onAddNewSecretModalClose }
                />
            ) }
        </PageLayout>
    );

};

SecretsPage.defaultProps = {};

// --

export type AddNewSecretActionButtonProps = {
    onClick: () => void;
} & IdentifiableComponentInterface;

/**
 * TODO: Add <Show> component & Event publishers & i18n strings.
 * @constructor
 */
export const AddNewSecretActionButton: FC<AddNewSecretActionButtonProps> = (
    props: AddNewSecretActionButtonProps
): ReactElement => {

    const {
        onClick,
        ["data-componentid"]: testId
    } = props;

    return (
        <PrimaryButton
            onClick={ onClick }
            data-testid={ `${ testId }-add-button` }>
            <Icon name="add"/>
            New Secret
        </PrimaryButton>
    );

};

AddNewSecretActionButton.defaultProps = {
    "data-componentid": "add-new-secret-action-button"
};

// --

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsPage;
