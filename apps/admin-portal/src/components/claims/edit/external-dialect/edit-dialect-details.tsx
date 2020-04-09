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

import { AlertLevels, ClaimDialect } from "../../../../models";
import { Divider, Grid } from "semantic-ui-react";
import { Field, Forms, FormValue } from "@wso2is/forms";
import React, { ReactElement } from "react";
import { addAlert } from "@wso2is/core/store";
import { EDIT_EXTERNAL_DIALECT } from "../../../../constants";
import { history } from "../../../../helpers";
import { PrimaryButton } from "@wso2is/react-components";
import { updateADialect } from "../../../../api";
import { useDispatch } from "react-redux";

/**
 * Prop types for the `EditDialectDetails` component
 */
interface EditDialectDetailsPropsInterface {
    dialect: ClaimDialect;
}

/**
 * This renders the dialect details tab pane of the edit external dialect page.
 * 
 * @return {ReactElement}
 */
export const EditDialectDetails = (props: EditDialectDetailsPropsInterface): ReactElement => {

    const { dialect } = props;

    const dispatch = useDispatch();

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const dialectURI = values.get("dialectURI").toString();
                            updateADialect(dialect.id, dialectURI)
                                .then(() => {
                                    dispatch(addAlert({
                                        description: "The dialect has been successfully updated.",
                                        level: AlertLevels.SUCCESS,
                                        message: "Dialect update successful"
                                    }));
                                    history.push(
                                        `${EDIT_EXTERNAL_DIALECT}/${window.btoa(dialectURI).replace(/=/g, "")}`
                                    )
                                })
                                .catch((error) => {
                                    dispatch(addAlert({
                                        description: error?.description
                                            || "An error occurred while updating the dialect",
                                        level: AlertLevels.ERROR,
                                        message: error?.message || "Something went wrong"
                                    }))
                                });
                        } }
                    >
                        <Field
                            type="text"
                            placeholder="Enter a dialect URI"
                            value={ dialect?.dialectURI }
                            required={ true }
                            requiredErrorMessage="Enter a dialect URI"
                            label="Dialect URI"
                            name="dialectURI"
                        />
                        <Divider hidden />
                        <PrimaryButton type="submit">
                            Update
                        </PrimaryButton>
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
