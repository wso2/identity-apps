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

import { Button, Grid } from "semantic-ui-react";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    CommonPluggableComponentFormPropsInterface
} from "../../../../models";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonConstants } from "../helpers";
import { CommonPluggableComponentForm } from "../components";
import { getPropertyField } from "../../utils";

/**
 * Common outbound provisioning connector configurations form.
 *
 * @param {CommonPluggableComponentFormPropsInterface} props
 * @return { ReactElement }
 */
export const CommonOutboundProvisioningConnectorForm: FunctionComponent<
    CommonPluggableComponentFormPropsInterface> = (props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton
    } = props;

    const getInterpretedFormValue = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface, values: any,
                                     eachProp: CommonPluggableComponentPropertyInterface) => {
        switch (propertyMetadata?.type.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                return values.get(eachProp?.key)?.includes(eachProp?.key);
            }
            default: {
                return values.get(eachProp?.key)
            }
        }
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const getUpdatedConfigurations = (values: any): any => {
        const properties = initialValues?.properties.map((eachProp) => {
            const propertyMetadata = metadata.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            return {
                key: eachProp?.key,
                value: getInterpretedFormValue(propertyMetadata, values, eachProp)
            };
        });
        return {
            ...initialValues,
            properties: [...properties]
        };
    };

    const getOutboundProvisioningConnectorPropertyFields = (): ReactElement[] => {
        return initialValues?.properties?.map((eachProp: CommonPluggableComponentPropertyInterface) => {
            const propertyMetadata = metadata?.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            return (
                <Grid.Row columns={ 1 } key={ propertyMetadata?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        { getPropertyField(eachProp, propertyMetadata) }
                    </Grid.Column>
                </Grid.Row>

            )
        });
    };

    const getSubmitButton = () => {
        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Button primary type="submit" size="small" className="form-button">
                        Update
                    </Button>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <CommonPluggableComponentForm
            onSubmit={ onSubmit }
            initialValues={ initialValues }
            enableSubmitButton={ enableSubmitButton }
            triggerSubmit={ triggerSubmit }
            metadata={ metadata }
        />
    );
};

CommonOutboundProvisioningConnectorForm.defaultProps = {
    enableSubmitButton: true
};
