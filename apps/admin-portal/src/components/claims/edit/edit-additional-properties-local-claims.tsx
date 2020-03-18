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

import React from "react";
import { Grid } from "semantic-ui-react";
import { useTrigger } from "@wso2is/forms";
import { Claim, AlertLevels } from "../../../models";
import { updateAClaim } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";
import { DynamicField } from "../dynamic-fields";
import { PrimaryButton } from "@wso2is/react-components";

interface EditAdditionalPropertiesLocalClaimsPropsInterface {
    claim: Claim;
    update: () => void;
}
export const EditAdditionalPropertiesLocalClaims = (
    props: EditAdditionalPropertiesLocalClaimsPropsInterface
): React.ReactElement => {

    const { claim, update } = props;

    const [submit, setSubmit] = useTrigger();

    const dispatch = useDispatch();

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column tablet={ 16 } computer={ 6 } mobile={ 16 }>
                    <DynamicField
                        data={ claim.properties }
                        keyType="text"
                        keyName="Name"
                        valueName="Value"
                        submit={ submit }
                        keyRequiredMessage="Enter a name"
                        valueRequiredErrorMessage="Enter a value"
                        requiredField={ true }
                        update={ (data) => {
                            const claimData = { ...claim };
                            delete claimData.id;
                            delete claimData.dialectURI;
                            const submitData = {
                                ...claimData,
                                properties: [...data]
                            }

                            updateAClaim(claim.id, submitData).then(() => {
                                dispatch(addAlert(
                                    {
                                        description: "Additional Properties of this local claim have been updated successfully!",
                                        level: AlertLevels.SUCCESS,
                                        message: "Additional Properties updated successfully"
                                    }
                                ));
                                update();
                            }).catch(error => {
                                dispatch(addAlert(
                                    {
                                        description: error?.description,
                                        level: AlertLevels.ERROR,
                                        message: error?.message || "Something went wrong"
                                    }
                                ));
                            })
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 6 }>
                    <PrimaryButton
                        onClick={ () => {
                            setSubmit();
                        } }
                    >
                        Update
                    </PrimaryButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    );
};
