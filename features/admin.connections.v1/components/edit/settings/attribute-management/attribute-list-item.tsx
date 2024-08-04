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
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Input, Label, Table } from "semantic-ui-react";
import { 
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface 
} from "../../../../models/connection";

interface AttributeListItemPropInterface extends TestableComponentInterface {
    attribute: ConnectionClaimInterface;
    placeholder: string;
    updateMapping?: (mapping: ConnectionCommonClaimMappingInterface) => void;
    mapping?: string;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
}

/**
 * Selected Attribute list item.
 *
 * @param props AttributeListItemPropInterface
 */
export const AttributeListItem: FunctionComponent<AttributeListItemPropInterface> = (
    props: AttributeListItemPropInterface
): ReactElement => {

    const {
        attribute,
        updateMapping,
        mapping,
        placeholder,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const handleClaimMapping = (e) => {
        const mappingValue = e.target.value;
        updateMapping({
            claim: attribute,
            mappedValue: mappingValue
        } as ConnectionCommonClaimMappingInterface);
    };

    return (
        <Table.Row data-testid={ testId }>
            <Table.Cell>
                { attribute?.displayName }
            </Table.Cell>
            {
                <>
                    <Table.Cell error={ isEmpty(mapping) }>
                        <Input
                            placeholder={ placeholder }
                            value={ isEmpty(mapping) ? "" : mapping }
                            onChange={ handleClaimMapping }
                            required
                            data-testid={ `${ testId }-input` }
                            readOnly={ isReadOnly }
                        />
                        { isEmpty(mapping) &&
                        (
                            <Label
                                basic color="red"
                                pointing="left">
                                { t("authenticationProvider:forms.attributeSettings." +
                                    "attributeListItem.validation.empty") }
                            </Label>
                        ) }
                    </Table.Cell>
                </>
            }
        </Table.Row>
    );
};
/**
 * Default proptypes for the attribute list item component.
 */
AttributeListItem.defaultProps = {
    "data-testid": "attribute-list-item"
};
