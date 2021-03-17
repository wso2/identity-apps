/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Popup, Table } from "semantic-ui-react";

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
 * @param {SubjectAttributeListItemPropInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
