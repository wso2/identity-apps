/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { PropertyAttribute, TypeProperty } from "../../models";

/**
 * Props interface of {@link UserDetails}
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
    /**
     * The type of the userstore.
     */
    type: string;
}

/**
 * This component renders the User Details step of the wizard.
 *
 * @param props - Props injected to the component.
 * @returns User Details wizard form component.
 */
export const UserDetails: FunctionComponent<UserDetailsPropsInterface> = (
    props: UserDetailsPropsInterface
): ReactElement => {
    const {
        submitState,
        onSubmit,
        values,
        properties,
        type,
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
                            properties.map((selectedTypeDetail: TypeProperty, index: number) => {
                                const name: string = selectedTypeDetail.description.split("#")[ 0 ];
                                const toggle: boolean = selectedTypeDetail.attributes
                                    .find((attribute: PropertyAttribute) => {
                                        return attribute.name === "type";
                                    })?.value === "boolean";
                                const isRequired: boolean = !isEmpty(selectedTypeDetail?.defaultValue);

                                // FIXME: Temp fix to hide the `ReadOnly` property from ReadOnly Userstores.
                                // This should be handled in the backend and reverted from the UI.
                                // Tracker: https://github.com/wso2/product-is/issues/19769#issuecomment-1957415262
                                const isHidden: boolean = type === "UniqueIDReadOnlyLDAPUserStoreManager"
                                    && selectedTypeDetail.name === "ReadOnly";

                                if (toggle) {
                                    return (
                                        <Field
                                            key={ index }
                                            label={ name }
                                            name={ selectedTypeDetail.name }
                                            type="toggle"
                                            required={ false }
                                            requiredErrorMessage={
                                                t("userstores:forms." +
                                                        "custom.requiredErrorMessage",
                                                {
                                                    name: name
                                                })
                                            }
                                            placeholder={
                                                t("userstores:forms." +
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
                                            hidden={ isHidden }
                                            data-testid={ `${ testId }-form-toggle-${
                                                selectedTypeDetail.name }` }
                                        />
                                    );
                                }

                                return (
                                    <Field
                                        key={ index }
                                        label={ name }
                                        name={ selectedTypeDetail.name }
                                        type="text"
                                        required={ isRequired }
                                        requiredErrorMessage={
                                            t("userstores:forms." +
                                                    "custom.requiredErrorMessage",
                                            {
                                                name: name
                                            })
                                        }
                                        placeholder={
                                            t("userstores:forms." +
                                                    "custom.placeholder",
                                            {
                                                name: name
                                            })
                                        }
                                        value={
                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                ?? selectedTypeDetail.defaultValue
                                        }
                                        hidden={ isHidden }
                                        data-testid={ `${ testId }-form-text-input-${
                                            selectedTypeDetail.name }` }
                                    />
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
