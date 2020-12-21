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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Button, Grid, Icon, Segment } from "semantic-ui-react";
import { TransferListSearch } from "./transfer-list-search";

/**
 * Proptypes transfer component.
 */
export interface TransferComponentPropsInterface extends TestableComponentInterface {
    handleUnelectedListSearch: (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => void;
    handleSelectedListSearch: (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => void;
    addItems: () => void;
    removeItems: () => void;
    searchPlaceholder: string;
}

/**
 * Transfer list component.
 *
 * @param {TransferComponentPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TransferComponent: FunctionComponent<PropsWithChildren<TransferComponentPropsInterface>> = (
    props: PropsWithChildren<TransferComponentPropsInterface>
): ReactElement => {

    const {
        addItems,
        removeItems,
        children,
        searchPlaceholder,
        handleUnelectedListSearch,
        handleSelectedListSearch,
        [ "data-testid" ]: testId
    } = props;

    return (
        <Grid className="transfer-list">
            {
                React.Children.count(children) > 0 && (
                    <Grid.Row columns={ 3 } className="transfer-list-row">
                        {
                            React.Children.map(children, (list: ReactElement, index: number) => {
                                return (
                                    <>
                                        {
                                            list.props.listType === "unselected" && (
                                                <Grid.Column width={ 7 }>
                                                    <Segment
                                                        data-testid={
                                                            `${ testId }-unselected-groups`
                                                        }
                                                        className="transfer-segment"
                                                    >
                                                        <TransferListSearch
                                                            data-testid={ testId + "-unselected-groups-search-input" }
                                                            handleListSearch={ handleUnelectedListSearch }
                                                            placeholder={ searchPlaceholder }
                                                        />
                                                        <Segment className="transfer-list-segment">
                                                            { list }
                                                        </Segment>
                                                    </Segment>
                                                </Grid.Column>
                                            )
                                        }
                                        {
                                            index === 0 && (
                                                <Grid.Column
                                                    verticalAlign="middle"
                                                    width={ 1 }
                                                    className="transfer-list-button-column"
                                                >
                                                    <Grid.Row>
                                                        <Button
                                                            data-testid={
                                                                `${ testId }-unselected-groups-add-button`
                                                            }
                                                            type="button"
                                                            basic
                                                            size="mini"
                                                            onClick={ addItems }
                                                        >
                                                            <Icon name="chevron right" />
                                                        </Button>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Button
                                                            data-testid={ testId + "-unselected-groups-remove-button" }
                                                            type="button"
                                                            basic
                                                            size="mini"
                                                            onClick={ removeItems }
                                                        >
                                                            <Icon name="chevron left" />
                                                        </Button>
                                                    </Grid.Row>
                                                </Grid.Column>
                                            )
                                        }
                                        {
                                            list.props.listType === "selected" && (
                                                <Grid.Column width={ 7 } className="transfer-list-assigned-column">
                                                    <Segment
                                                        data-testid={ `${ testId }-selected-groups` }
                                                        className="transfer-segment"
                                                    >
                                                        <TransferListSearch
                                                            data-testid={ `${ testId }-selected-groups-search-input` }
                                                            handleListSearch={ handleSelectedListSearch }
                                                            placeholder={ searchPlaceholder }
                                                        />
                                                        <Segment className="transfer-list-segment">
                                                            { list }
                                                        </Segment>
                                                    </Segment>
                                                </Grid.Column>
                                            )
                                        }
                                    </>
                                )
                            })
                        }
                    </Grid.Row>
                )
            }
        </Grid>
    );
};

/**
 * Default props for the transfer component.
 */
TransferComponent.defaultProps = {
    "data-testid": "transfer-component"
};
