import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Message, PageLayout, PrimaryButton, Text } from "@wso2is/react-components";
import React, { FC, ReactElement, useState } from "react";
import { Icon } from "semantic-ui-react";
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
