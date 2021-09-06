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
 * TODO: Add event publishers & i18n Support & Access control
 *       https://github.com/wso2/product-is/issues/12447
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
            subtitle={ [ "There are no secrets added for this secret type." ] }
            data-testid={ testId }
        />
    );

};

EmptySecretListPlaceholder.defaultProps = {
    "data-componentid": "empty-secret-list-placeholder"
};
