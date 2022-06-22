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
import { Field, Forms } from "@wso2is/forms";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import {
    CustomInboundProtocolMetaDataInterface,
    CustomInboundProtocolPropertyInterface,
    CustomTypeEnum,
    PropertyModelInterface,
    SubmitFormCustomPropertiesInterface
} from "../../models";

/**
 * Proptypes for the inbound custom protocol form component.
 */
interface InboundCustomProtocolWizardFormPropsInterface extends TestableComponentInterface {
    metadata?: CustomInboundProtocolMetaDataInterface;
    protocolName: string;
    initialValues?: any;
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
}

/**
 * Inbound Custom protocol configurations form.
 *
 * @param {InboundCustomProtocolWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundCustomProtocolWizardForm: FunctionComponent<InboundCustomProtocolWizardFormPropsInterface> = (
    props: InboundCustomProtocolWizardFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        protocolName,
        triggerSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const createInputComponent = (
        (config: CustomInboundProtocolPropertyInterface, initialValue?: PropertyModelInterface) => {
            if (config?.availableValues?.length > 0) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                type="dropdown"
                                value={ initialValue?.value }
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.dropdown" +
                                        ".validations.empty", { name: config?.displayName })
                                }
                                default={ config?.defaultValue }
                                children={ createDropDownOption(config?.availableValues) }
                                data-testid={ `${ testId }-${ config?.name }-select` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else if (config?.isConfidential) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                hidePassword={ t("common:hide") + " " + config?.displayName }
                                showPassword={ t("common:show") + " " + config?.displayName }
                                value={ initialValue?.value }
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.password" +
                                        ".validations.empty",
                                    { name: config?.displayName })
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.password" +
                                        ".placeholder",
                                    { name: config?.displayName })
                                }
                                type="password"
                                default={ config?.defaultValue }
                                data-testid={ `${ testId }-${ config?.name }-password-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else if (config?.type === CustomTypeEnum.BOOLEAN) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name={ config?.name }
                                label=""
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.checkbox" +
                                        ".validations.empty",
                                    { user: config?.displayName })
                                }
                                value={ initialValue?.value ? [ config.name ] : [] }
                                type="checkbox"
                                children={ [
                                    {
                                        label: config.displayName,
                                        value: config.name
                                    }
                                ] }
                                data-testid={ `${ testId }-${ config?.name }-checkbox` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                required={ config?.required }
                                value={ initialValue?.value }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.generic" +
                                        ".validations.empty",
                                    { name: config?.displayName })
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.generic" +
                                        ".placeholder",
                                    { name: config?.displayName })
                                }
                                type={ (config?.type === CustomTypeEnum.INTEGER) ? "number" : "text" }
                                data-testid={ `${ testId }-${ config?.name }-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });

    const generateFormElements = (() => {
        if (metadata) {
            const configs: CustomInboundProtocolPropertyInterface[] = metadata?.properties;

            if (configs.length > 0) {
                configs.sort(
                    (a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            }

            return configs.map((config) => {
                const initialValue: PropertyModelInterface = initialValues?.properties.find(
                    (prop) => prop.key === config.name
                );

                if (initialValue) {
                    return createInputComponent(config, initialValue);
                } else {
                    return (createInputComponent(config));
                }
            });
        }
    });

    /**
     * Create drop down options.
     * @param options property to create the option.
     */
    const createDropDownOption = (options: string[]) => {
        const allowedOptions = [];

        if (options) {
            options.map((ele) => {
                allowedOptions.push({ key: options.indexOf(ele), text: ele, value: ele });
            });
        }

        return allowedOptions;
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: Map<string, string | string[]>): any => {
        const valueProperties: SubmitFormCustomPropertiesInterface[] = [];

        //Iterate over map entries
        for (const [ key, value ] of values) {
            let property: SubmitFormCustomPropertiesInterface = undefined;

            if (value instanceof Array) {
                property = {
                    key: key,
                    value: value.length > 0
                };
            } else {
                property = {
                    key: key,
                    value: value
                };
            }
            valueProperties.push(property);
        }

        return {
            inboundProtocolConfiguration: {
                [protocolName]: {
                    configName: protocolName,
                    name: protocolName,
                    properties: [
                        ...valueProperties
                    ]
                }
            }
        };
    };

    useEffect(() => {
        if (metadata) {
            generateFormElements();
        }
    }, [ metadata ]);

    return (
        metadata
            ? (
                <Forms
                    onSubmit={ (values) => {
                        onSubmit(updateConfiguration(values));
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        { generateFormElements() }
                    </Grid>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the custom protocol settings wizard form component.
 */
InboundCustomProtocolWizardForm.defaultProps = {
    "data-testid": "custom-protocol-settings-wizard-form"
};
