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
}

/**
 * Transfer list component.
 *
 * @param {TransferListSearchPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TransferListSearch: FunctionComponent<TransferListSearchPropsInterface> = (
    props: TransferListSearchPropsInterface
): ReactElement => {

    const {
        handleListSearch,
        placeholder,
        isLoading,
        iconPosition,
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
    isLoading: false
};
