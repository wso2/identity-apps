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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { TypeProperty } from "../../models";

/**
 * Prop types of the `UserDetails` component 
 */
interface UserDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits values
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * The saved values
     */
    values: Map<string, FormValue>;
    /**
     * The properties to be shown in this component.
     */
    properties: TypeProperty[];
}

/**
 * This component renders the User Details step of the wizard.
 *
 * @param {UserDetailsPropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
 */
export const UserDetails: FunctionComponent<UserDetailsPropsInterface> = (
    props: UserDetailsPropsInterface
): ReactElement => {

    const {
        submitState,
        onSubmit,
        values,
        properties,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <Grid data-testid={ testId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            onSubmit(values);
                        } }
                        submitState={ submitState }
                    >
                        {
                            properties.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    return (
                                        toggle
                                            ? (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="toggle"
                                                    required={ false }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                    toggle
                                                    data-testid={ `${ testId }-form-toggle-${
                                                        selectedTypeDetail.name }` }
                                                />
                                            )
                                            : (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="text"
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: name
                                                            })
                                                    }
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                    data-testid={ `${ testId }-form-text-input-${
                                                        selectedTypeDetail.name }` }
                                                />

                                            )
                                    );
                                })
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
UserDetails.defaultProps = {
    "data-testid": "userstore-user-details"
};
