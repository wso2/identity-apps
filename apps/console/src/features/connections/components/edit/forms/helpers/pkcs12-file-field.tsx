/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import React, { FC, PropsWithChildren, ReactElement, useState } from "react";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models/connection";
import { Grid, Icon } from "semantic-ui-react";
import { ResourceList, ResourceListActionInterface, ResourceListItem } from "@wso2is/react-components";


/**
 * Props interface of {@link IdpCertificatesList}
 */
export interface Pkcs12FileFieldProps extends IdentifiableComponentInterface {
    /**
     * Type of the template.
     */
    eachProp?: CommonPluggableComponentPropertyInterface;
    propertyMetadata?: CommonPluggableComponentMetaPropertyInterface;
    onCertificateChange?: ( newFile: string) => void;
}

/**
 * List of added certificates.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const Pkcs12FileField: FC<Pkcs12FileFieldProps> = (
    props: PropsWithChildren<Pkcs12FileFieldProps>
): ReactElement => {

    const {
        [ "data-componentid" ]: testId,
        eachProp,
        onCertificateChange
    } = props;

    const [ deletingCertificateIndex, setDeletingCertificateIndex ] = useState<number>(null);
    const [data, setData] = useState<string>(eachProp?.value);

    /**
     * Handles the deletion of a certificate.
     *
     * @param certificateIndex - Index of the certificate to be deleted.
     */
    const updateData = newData => {
        setData(newData);
        onCertificateChange(newData);
    };

    /**
     * Creates the certificate actions.
     *
     * @param certificate - Certificate.
     * @param index - Cert index.
     */
    const createCertificateActions = (index: number) => {
        return [
            {
                "data-componentid": `${ testId }-delete-cert-${ index }-button`,
                icon: "trash alternate",
                onClick: () => handleDelete(),
                popupText: "Delete",
                type: "button"
            }
        ] as (ResourceListActionInterface & IdentifiableComponentInterface)[];
    };

    /**
     * Creates what to show as the resource list item avatar.
     *
     * @param certificate - Certificate.
     */
    const createCertificateResourceAvatar = (): ReactElement => {
        return (
            <Icon name="key" size="large" className="mr-3"/>
        );
    };

    /**
     * Handles the deletion of a certificate.
     *
     * @param certificateIndex - Index of the certificate to be deleted.
     */
    const handleDelete = () => {
        onCertificateChange("");
    };

    return (
        <>
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <ResourceList
                            fill
                            relaxed={ false }
                            className="application-list"
                            loadingStateOptions={ {
                                count: 2,
                                imageType: "circular"
                            } }
                            readOnly={ true }>
                            <ResourceListItem
                                key={ 1 }
                                actionsColumnWidth={ 3 }
                                descriptionColumnWidth={ 9 }
                                actions={ createCertificateActions(1) }
                                actionsFloated="right"
                                avatar={ createCertificateResourceAvatar() }
                                itemHeader={
                                    "Private Key"
                                }
                                itemDescription={
                                    "PKCS12 private key file"
                                }
                            />

                        </ResourceList>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

/**
 * Default properties of Pkcs12FileField.
 */
Pkcs12FileField.defaultProps = {
    "data-componentid": "idp-certificates-list"
};
