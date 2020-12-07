/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";

/**
 * Proptypes for add OIDC scope form component.
 */
interface AddOIDCScopeFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Add OIDC scope form component.
 *
 * @param {AddOIDCScopeFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AddOIDCScopeForm: FunctionComponent<AddOIDCScopeFormPropsInterface> = (
    props: AddOIDCScopeFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const getFormValues = (values: Map<string, FormValue>) => {
        return {
            description: values.get("description").toString(),
            displayName: values.get("displayName").toString(),
            scopeName: values.get("scopeName").toString()
        };
    };

    return (
        <Forms
            onSubmit={ (values) => onSubmit(getFormValues(values)) }
            submitState={ triggerSubmit && triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-testid={ `${ testId }-oidc-scope-form-name-input` }
                            name="scopeName"
                            label={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs.scopeName.label") }
                            required={ true }
                            requiredErrorMessage={ "Scope name is required" }
                            placeholder={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs." +
                                "scopeName.validations.empty") }
                            type="text"
                            value={ initialValues?.scopeName }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-testid={ `${ testId }-oidc-scope-form-name-input` }
                            name="displayName"
                            label={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs.displayName.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs." +
                                "displayName.validations.empty") }
                            placeholder={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs." +
                                "displayName.placeholder") }
                            type="text"
                            value={ initialValues?.displayName }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-testid={ `${ testId }-oidc-scope-form-name-input` }
                            name="description"
                            label={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs.description.label") }
                            required={ false }
                            requiredErrorMessage={ "Description is optional" }
                            placeholder={ t("console:manage.features.oidcScopes.forms.addScopeForm.inputs." +
                                "description.placeholder") }
                            type="text"
                            value={ initialValues?.description }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
