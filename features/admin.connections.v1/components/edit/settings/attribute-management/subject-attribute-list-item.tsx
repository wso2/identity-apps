/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Popup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Table } from "semantic-ui-react";

export interface SubjectAttributeListItemPropInterface extends TestableComponentInterface {
    key: string;
    displayName: string;
    localClaimDisplayName?: string;
    claimURI: string;
    value: string;
}

/**
 * Selected Attribute list item component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const SubjectAttributeListItem: FunctionComponent<SubjectAttributeListItemPropInterface> = (
    props: SubjectAttributeListItemPropInterface
): ReactElement => {

    const {
        claimURI,
        displayName,
        localClaimDisplayName,
        [ "data-testid" ]: testId
    } = props;

    return (
        <Table.Row data-testid={ testId }>
            <Table.Cell>
                <div>{ displayName ? displayName : localClaimDisplayName }</div>
                {
                    <Popup
                        content={ claimURI }
                        inverted
                        trigger={ (
                            <Code compact withBackground={ false }>{ claimURI }</Code>
                        ) }
                        position="bottom left">
                    </Popup>
                }
            </Table.Cell>
        </Table.Row>
    );
};
