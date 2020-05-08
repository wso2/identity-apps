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

import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { updateADialect } from "../../../../api";
import { EDIT_EXTERNAL_DIALECT } from "../../../../constants";
import { history } from "../../../../helpers";
import { AlertLevels, ClaimDialect } from "../../../../models";

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

    const { t } = useTranslation();

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const dialectURI = values.get("dialectURI").toString();
                            updateADialect(dialect.id, dialectURI)
                                .then(() => {
                                    dispatch(addAlert({
                                        description: t("devPortal:components.claims.dialect.notifications" +
                                            ".updateDialect.success.description"),
                                        level: AlertLevels.SUCCESS,
                                        message: t("devPortal:components.claims.dialect.notifications" +
                                            ".updateDialect.success.message")
                                    }));
                                    history.push(
                                        `${EDIT_EXTERNAL_DIALECT}/${window.btoa(dialectURI).replace(/=/g, "")}`
                                    )
                                })
                                .catch((error) => {
                                    dispatch(addAlert({
                                        description: error?.description
                                            || t("devPortal:components.claims.dialect.notifications" +
                                                ".updateDialect.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: error?.message
                                            || t("devPortal:components.claims.dialect.notifications" +
                                                ".updateDialect.genericError.message")
                                    }))
                                });
                        } }
                    >
                        <Field
                            type="text"
                            placeholder={ t("devPortal:components.claims.dialect.forms.dialectURI.placeholder") }
                            value={ dialect?.dialectURI }
                            required={ true }
                            requiredErrorMessage={ t("devPortal:components.claims.dialect." +
                                "forms.dialectURI.requiredErrorMessage") }
                            label={ t("devPortal:components.claims.dialect.forms.dialectURI.label") }
                            name="dialectURI"
                        />
                        <Divider hidden />
                        <PrimaryButton type="submit">
                            { t("devPortal:components.claims.dialect.forms.submit") }
                        </PrimaryButton>
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
