/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid, Icon, Input } from "semantic-ui-react";

/**
 * Proptypes transfer list search component.
 */
export interface TransferListSearchPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    placeholder: string;
    handleListSearch?: (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => void;
    /**
     * Is the search content loading.
     */
    isLoading?: boolean;
    /**
     * position of the search icon
     */
    iconPosition?: "left";
    disabled?: boolean;
}

/**
 * Transfer list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const TransferListSearch: FunctionComponent<TransferListSearchPropsInterface> = (
    props: TransferListSearchPropsInterface
): ReactElement => {

    const {
        handleListSearch,
        placeholder,
        isLoading,
        iconPosition,
        disabled,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
            <Input
                loading={ isLoading }
                data-componentid={ componentId }
                data-testid={ testId }
                icon={ <Icon name="search"/> }
                iconPosition={ iconPosition }
                fluid
                onChange={ handleListSearch }
                placeholder={ placeholder }
                disabled={ disabled }
            />
        </Grid.Column>
    );
};

/**
 * Default props for the transfer list search component.
 */
TransferListSearch.defaultProps = {
    "data-componentid": "transfer-list-search",
    "data-testid": "transfer-list-search",
    disabled: false,
    isLoading: false
};
