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

import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../../../core";
import { updateADialect } from "../../../api";
import { ClaimManagementConstants } from "../../../constants";
import { resolveType } from "../../../utils";

/**
 * Prop types for the `EditDialectDetails` component
 */
interface EditDialectDetailsPropsInterface extends TestableComponentInterface {
    dialect: ClaimDialect;
    /**
     * Attribute type.
     */
    attributeType?: string;
    /**
     * Callback function to be fired on successful update.
     */
    onUpdate: (id?: string) => void;
}

/**
 * This renders the dialect details tab pane of the edit external dialect page.
 *
 * @param {EditDialectDetailsPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditDialectDetails: FunctionComponent<EditDialectDetailsPropsInterface> = (
    props: EditDialectDetailsPropsInterface
): ReactElement => {

    const {
        dialect,
        attributeType,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 6 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const dialectURI = values.get("dialectURI").toString();

                            setIsSubmitting(true);
                            updateADialect(dialect.id, dialectURI)
                                .then(() => {
                                    dispatch(addAlert({
                                        description: t("console:manage.features.claims.dialects.notifications" +
                                            ".updateDialect.success.description"),
                                        level: AlertLevels.SUCCESS,
                                        message: t("console:manage.features.claims.dialects.notifications" +
                                            ".updateDialect.success.message")
                                    }));
                                    onUpdate(window.btoa(dialectURI).replace(/=/g, ""));
                                })
                                .catch((error) => {
                                    dispatch(addAlert({
                                        description: error?.description
                                            || t("console:manage.features.claims.dialects.notifications" +
                                                ".updateDialect.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: error?.message
                                            || t("console:manage.features.claims.dialects.notifications" +
                                                ".updateDialect.genericError.message")
                                    }));
                                })
                                .finally(() => {
                                    setIsSubmitting(false);
                                });
                        } }
                    >
                        <Field
                            type="text"
                            placeholder={ t("console:manage.features.claims.dialects.forms.dialectURI.placeholder",
                                { type: resolveType(attributeType, true) }) }
                            value={ dialect?.dialectURI }
                            required={ true }
                            readOnly={
                                config.ui?.isDefaultDialectEditingEnabled === false
                                    ? ClaimManagementConstants.DEFAULT_DIALECTS.includes(dialect?.id)
                                    : false
                            }
                            requiredErrorMessage={ t("console:manage.features.claims.dialects." +
                                "forms.dialectURI.requiredErrorMessage") }
                            label={ t("console:manage.features.claims.dialects.forms.dialectURI.label") }
                            name="dialectURI"
                            data-testid={ `${ testId }-form-dialect-uri-input` }
                        />
                        {
                            config.ui?.isDefaultDialectEditingEnabled === false
                                && ClaimManagementConstants.DEFAULT_DIALECTS.includes(dialect?.id)
                                ? null
                                :(
                                    <>
                                        <Divider hidden />
                                        <PrimaryButton
                                            type="submit"
                                            data-testid={ `${ testId }-form-submit-button` }
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting }
                                        >
                                            { t("console:manage.features.claims.dialects.forms.submit") }
                                        </PrimaryButton>
                                    </>
                                )
                        }

                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
EditDialectDetails.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "edit-dialect-details"
};
