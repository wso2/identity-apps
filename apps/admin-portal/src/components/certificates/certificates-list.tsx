/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "../../store/actions";
import { AppConfig } from "../../helpers";
import { AppState } from "../../store";
import { pki } from "forge";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { deleteKeystoreCertificate, retrieveCertificateAlias } from "../../api";
import { AlertLevels, AppConfigInterface, Certificate } from "../../models";

/**
 * @constant
 * @type {string}
 */
const KEYSTORE = "keystore";

/**
 * @constant
 * @type {string}
 */
const TRUSTSTORE = "truststore";

/**
 * Prop types of the `CertificatesList` component
 */
interface CertificatesListPropsInterface {
    /**
     * The certificate list
     */
    list: Certificate[];
    /**
     * Initiate an update
     */
    update: () => void;
    type: typeof TRUSTSTORE | typeof KEYSTORE;
}

/**
 * This component renders the certificate List
 * @param {CertificatesListPropsInterface} props
 * @return {ReactElement}
 */
export const CertificatesList = (props: CertificatesListPropsInterface): ReactElement => {

    const { list, update, type } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ startDownload, setStartDownload ] = useState<string>("");
    const [ isSuper, setIsSuper ] = useState(true);
    
    const tenantDomain: string = useSelector<AppState,string>((state: AppState) => state.config.deployment.tenant);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    /**
     * Delete a certificate
     * @param {string} id certificate id
     */
    const initDelete = (id: string) => {
        setDeleteID(id);
        setDeleteConfirm(true);
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteID(null);
    };

    useEffect(() => {
        if (tenantDomain === "carbon.super") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }, [ tenantDomain ]);

    /**
     * Shows the delete confirmation modal
     * @return {ReactElement}
     */
    const showDeleteConfirm = (): ReactElement => {
        return (
            <Modal
                open={ deleteConfirm }
                onClose={ closeDeleteConfirm }
                size="mini"
                dimmer="blurring"
            >
                <Modal.Header>
                    Confirm Delete
                </Modal.Header>
                <Modal.Content>
                    This will delete the certificate permanently. Do you want to continue?
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ closeDeleteConfirm }>
                        Cancel
                    </LinkButton>
                    <PrimaryButton onClick={ () => {
                        deleteKeystoreCertificate(deleteID).then(() => {
                            dispatch(addAlert({
                                description: "The certificate has been successfully deleted.",
                                level: AlertLevels.SUCCESS,
                                message: "Certificate deleted successfully"
                            }));
                            update();
                        }).catch((error) => {
                            dispatch(addAlert({
                                description: error?.description
                                    ?? "There was an error while deleting the certificate",
                                level: AlertLevels.ERROR,
                                message: error?.message ?? "Something went wrong!"
                            }));
                        }).finally(() => {
                            closeDeleteConfirm();
                        });
                    } }>
                        Delete
                    </PrimaryButton>
                </Modal.Actions>
            </Modal>
        )
    };

    return (
        <>
            { showDeleteConfirm() }
            <ResourceList>
                {
                    (
                        type === KEYSTORE 
                        && appConfig?.certificates?.features?.keystore?.permissions?.read
                    )
                    || (
                        type === TRUSTSTORE
                        && appConfig?.certificates?.features?.truststore?.permissions?.read
                    )
                    ? list?.map((certificate: Certificate, index: number) => {
                        return (
                            <ResourceList.Item
                                key={ index }
                                actions={ [
                                    {
                                        icon: "upload",
                                        onClick: () => {
                                            retrieveCertificateAlias(certificate.alias).then((response) => {
                                                setStartDownload(response);
                                            }).catch(error => {
                                                dispatch(addAlert({
                                                    description: error?.description
                                                        ?? "There was an error while downloading the certificate",
                                                    level: AlertLevels.ERROR,
                                                    message: error?.message ?? "Something went wrong!"
                                                }));
                                            })
                                        },
                                        popupText: "Export",
                                        type: "button"
                                    },
                                    {
                                        hidden: !(
                                            type === KEYSTORE
                                            && appConfig?.certificates?.features?.keystore?.permissions?.delete
                                        )
                                        || isSuper,
                                        icon: "trash alternate",
                                        onClick: () => { initDelete(certificate?.alias) },
                                        popupText: "Delete",
                                        type: "dropdown"
                                    }
                                ] }
                                actionsFloated="right"
                                itemHeader={ certificate.alias }                                
                            />
                        )
                    })
                    :null
                }
            </ResourceList>
        </>
    )
};
