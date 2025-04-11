/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Checkbox, Table, TableProps } from "semantic-ui-react";
import { ContentLoader } from "../loader";
import { EmptyPlaceholder } from "../placeholder";

interface TransferListItemInterface {
    itemName: string;
    itemId: string;
}

/**
 * Proptypes transfer list component.
 */
export interface TransferListPropsInterface extends TableProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    listValues?: TransferListItemInterface[] | string[];
    listHeaders?: any;
    listType: "selected" | "unselected";
    isListEmpty: boolean;
    emptyPlaceholderContent?: string;
    handleHeaderCheckboxChange?: () => void;
    selectionComponent?: boolean;
    isHeaderCheckboxChecked?: boolean;
    /**
     * Show loading placeholders.
     */
    isLoading?: boolean;
    /**
     * Resolve i18n tag for empty placeholder content
     */
    emptyPlaceholderDefaultContent?: string;
    disabled?: boolean;
    bordered?: boolean;
}

/**
 * Transfer list component.
 *
 * @param props - Props injected to the component.
 * @returns
 */
export const TransferList: FunctionComponent<TransferListPropsInterface> = (
    props: TransferListPropsInterface
): ReactElement => {

    const {
        bordered,
        children,
        listHeaders,
        isListEmpty,
        handleHeaderCheckboxChange,
        isHeaderCheckboxChecked,
        emptyPlaceholderContent,
        selectionComponent,
        isLoading,
        emptyPlaceholderDefaultContent,
        disabled,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    if (isLoading) {
        return <ContentLoader/>;
    }

    return (
        <>
            {
                !isListEmpty
                    ? (
                        <Table basic={ bordered ? "very" : true } padded={ bordered }>
                            {
                                listHeaders instanceof Array && (
                                    <Table.Header>
                                        <Table.Row>
                                            {
                                                !selectionComponent && (
                                                    <Table.HeaderCell>
                                                        <Checkbox
                                                            data-componentid={ componentId }
                                                            data-testid={ testId }
                                                            checked={ isHeaderCheckboxChecked }
                                                            onChange={ handleHeaderCheckboxChange }
                                                            disabled={ disabled }
                                                        />
                                                    </Table.HeaderCell>
                                                )
                                            }
                                            {
                                                listHeaders?.map((header, index) => {
                                                    return (
                                                        <Table.HeaderCell key={ index }>
                                                            <strong>{ header }</strong>
                                                        </Table.HeaderCell>
                                                    );
                                                })
                                            }
                                        </Table.Row>
                                    </Table.Header>
                                )
                            }
                            <Table.Body>
                                { children }
                            </Table.Body>
                        </Table>
                    ) : (
                        /**
                         * TODO : React Components should not depend on the product
                         * locale bundles.
                         * Issue to track. {@link https://github.com/wso2/product-is/issues/10693}
                         */
                        <div className={ "empty-placeholder-center" }>
                            <EmptyPlaceholder
                                subtitle={ [
                                    emptyPlaceholderContent
                                        ? emptyPlaceholderContent
                                        : (emptyPlaceholderDefaultContent
                                            ? emptyPlaceholderDefaultContent
                                            : "There are no items in this list at the moment.")
                                ] }
                                data-componentid={ `${ componentId }-placeholder` }
                                data-testid={ `${ testId }-placeholder` }
                            />
                        </div>
                    )

            }
        </>
    );
};

/**
 * Default props for the transfer list component.
 */
TransferList.defaultProps = {
    bordered: false,
    "data-componentid": "transfer-list",
    "data-testid": "transfer-list",
    disabled: false
};
