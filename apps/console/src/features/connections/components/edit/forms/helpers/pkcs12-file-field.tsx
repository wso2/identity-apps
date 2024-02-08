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
import { ResourceList, ResourceListActionInterface, ResourceListItem } from "@wso2is/react-components";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import { Grid, Icon } from "semantic-ui-react";

/**
 * Props interface of {@link Pkcs12FileField}
 */
export interface Pkcs12FileFieldProps extends IdentifiableComponentInterface {
    onCertificateChange?: ( newFile: string) => void;
}

/**
 * PKCS file field.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const Pkcs12FileField: FC<Pkcs12FileFieldProps> = (
    props: PropsWithChildren<Pkcs12FileFieldProps>
): ReactElement => {

    const {
        [ "data-componentid" ]: testId,
        onCertificateChange
    } = props;

    /**
     * Creates the certificate actions.
     */
    const createCertificateActions = () => {
        return [
            {
                "data-componentid": `${ testId }-delete-cert-button`,
                icon: "trash alternate",
                onClick: () => handleDelete(),
                popupText: "Delete",
                type: "button"
            }
        ] as (ResourceListActionInterface & IdentifiableComponentInterface)[];
    };

    /**
     * Creates certificate item avatar.
     */
    const createCertificateResourceAvatar = (): ReactElement => {
        return (
            <Icon name="key" size="large" className="mr-3"/>
        );
    };

    /**
     * Handles the deletion of a certificate.
     */
    const handleDelete = () => {
        onCertificateChange("");
    };

    return (
        <Grid columns={ 2 }>
            <Grid.Row>
                <Grid.Column>
                    <ResourceList
                        fill
                        relaxed={ false }
                        className="certificate"
                        loadingStateOptions={ {
                            count: 2,
                            imageType: "circular"
                        } }
                        readOnly={ true }>
                        <ResourceListItem
                            key={ 1 }
                            actionsColumnWidth={ 3 }
                            descriptionColumnWidth={ 9 }
                            actions={ createCertificateActions() }
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
    );
};

/**
 * Default properties of Pkcs12FileField.
 */
Pkcs12FileField.defaultProps = {
    "data-componentid": "google-private-key-file"
};
