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

import { I18n } from "@wso2is/i18n";
import { Hint, RenderInput, RenderToggle } from "@wso2is/react-components";
import React from "react"
import { Field, reduxForm } from "redux-form"
import { Grid } from "semantic-ui-react";
import { ConnectorPropertyInterface } from "../../models";
import { GovernanceConnectorUtils } from "../../utils";

/**
 * Determine the matching Form component based on the property attributes.
 * 
 * @param property
 */
const getFieldComponent = (property: ConnectorPropertyInterface) => {
    if (property.value === "true" || property.value === "false") {
        return RenderToggle;
    } else {
        return RenderInput;
    }
};

const getFieldType = (property: ConnectorPropertyInterface) => {
    if (property.name.startsWith("__secret__")) {
        return "password";
    } else {
        return "text";
    }
};

/**
 * Dynamically render governance connector forms.
 *
 * @param props
 * @constructor
 */
const DynamicConnectorForm = (props) => {
    const {
        handleSubmit,
        [ "data-testid" ]: testId
    } = props;
    const properties: ConnectorPropertyInterface[] = props.props.properties;

    return (
        <form onSubmit={ handleSubmit }>
            <Grid padded={ true }>
            {
                properties?.map((property, index) => {
                    return (
                        <Grid.Row columns={ 1 } className="pl-3" key={ index }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                {
                                    (getFieldComponent(property) === RenderInput) &&
                                    <label htmlFor={ property.name }>{ property.displayName }</label>
                                }
                                <Field
                                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(property.name) }
                                    component={ getFieldComponent(property) }
                                    type={ getFieldType(property) }
                                    required={ true }
                                    width={ 10 }
                                    placeholder={ property.value }
                                    data-testid={ `${ testId }-${ property.name }` }
                                    label={ property.displayName }
                                />
                                {
                                    (property.description !== "" &&
                                        <Hint>
                                            { property.description }
                                        </Hint>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    )
                })
            }
                <Grid.Row columns={ 1 } className="pl-3">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <button type="submit" >
                            { I18n.instance.t("common:update").toString() }
                        </button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </form>
    )
};

export default reduxForm({
    enableReinitialize: true
})(DynamicConnectorForm)

/**
 * Default props for the component.
 */
DynamicConnectorForm.defaultProps = {
    "data-testid": "dynamic-connector-form"
};
