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

import React, { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { Forms, Field, useTrigger, FormValue } from "@wso2is/forms";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { getADialect, updateADialect, addDialect } from "../../api";
import { ClaimDialect, AlertLevels } from "../../models";
import { useDispatch } from "react-redux";
import { addAlert } from "../../store/actions";

interface AddEditDialectPropsInterface {
    open: boolean;
    onClose: () => void;
    update: () => void;
    edit: boolean;
    dialectID?: string;
}
export const AddEditDialect = (props: AddEditDialectPropsInterface): React.ReactElement => {

    const [dialect, setDialect] = useState<ClaimDialect>(null);

    const { open, onClose, update, edit, dialectID } = props;

    const [submit, setSubmit] = useTrigger();

    const dispatch = useDispatch();

    useEffect(() => {
        if (dialectID) {
            getADialect(dialectID).then(response => {
                setDialect(response)
            }).catch(error => {
                dispatch(addAlert(
                    {
                        description: error?.description,
                        level: AlertLevels.ERROR,
                        message: error?.message
                    }
                ));
            })
        }
    },[dialectID])

    return (
        <Modal
            open={open}
            onClose={onClose}
            dimmer="blurring"
            size="mini"
        >
            <Modal.Header>
                {edit ? "Edit the Claim Dialect" :"Add a Claim Dialect"}
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={
                        (values:Map<string,FormValue>) => {
                            if (edit) {
                                updateADialect(
                                    dialectID,
                                    values.get("dialectURI").toString()
                                ).then(response => {
                                    update();
                                    onClose();
                                    dispatch(addAlert(
                                        {
                                            description: "The dialect has been updates successfully!",
                                            level: AlertLevels.SUCCESS,
                                            message: "Dialect updated successfully"
                                        }
                                    ));
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description,
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                        }
                                    ));
                                });
                            } else {
                                addDialect(values.get("dialectURI").toString()).then(response => {
                                    update();
                                    onClose();
                                    dispatch(addAlert(
                                        {
                                            description: "The dialect has been added successfully!",
                                            level: AlertLevels.ERROR,
                                            message: "Dialect added successfully"
                                        }
                                    ));
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description,
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                        }
                                    ));
                                })
                            }
                        }
                    }
                    submitState={submit}
                >
                    <Field
                        type="text"
                        name="dialectURI"
                        label="Dialect URI"
                        required={true}
                        requiredErrorMessage="Enter a Dialect URI"
                        placeholder="Enter a Dialect URI"
                        value={edit?dialect?.dialectURI:""}
                    />
                </Forms>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={onClose}
                >
                    Cancel
                </LinkButton>
                <PrimaryButton
                    onClick={() => {
                        setSubmit();
                    }}
                >
                    {edit?"Update":"Add"}
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
