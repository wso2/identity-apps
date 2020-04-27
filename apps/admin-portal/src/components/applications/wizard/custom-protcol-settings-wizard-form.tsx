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

import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import {
    CustomInboundProtocolMetaDataInterface,
    CustomInboundProtocolPropertyInterface,
    CustomTypeEnum,
    PropertyModelInterface,
    SubmitFormCustomPropertiesInterface
} from "../../../models";
import { ContentLoader } from "@wso2is/react-components";


/**
 * Proptypes for the inbound custom protocol form component.
 */
interface InboundCustomProtocolWizardFormPropsInterface {
    metadata?: CustomInboundProtocolMetaDataInterface;
    protocolName: string;
    initialValues?: any;
    onSubmit: (values: any) => void;
    triggerSubmit: boolean;
}

/**
 * Inbound Custom protocol configurations form.
 *
 * @param {InboundCustomProtocolWizardFormPropsInterface} props
 * @return ReactElement
 */
export const InboundCustomProtocolWizardForm: FunctionComponent<InboundCustomProtocolWizardFormPropsInterface> = (
    props: InboundCustomProtocolWizardFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        protocolName,
        triggerSubmit
    } = props;

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
                                requiredErrorMessage={ "Select the " + config?.displayName }
                                default={ config?.defaultValue }
                                children={ createDropDownOption(config?.availableValues) }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )
            } else if (config?.isConfidential) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                hidePassword={ "Hide " + config?.displayName }
                                showPassword={ "Show " + config?.displayName }
                                value={ initialValue?.value }
                                required={ config?.required }
                                requiredErrorMessage={ "Provide  " + config?.displayName }
                                placeholder={ "Enter  " + config?.displayName }
                                type="password"
                                default={ config?.defaultValue }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )
            } else if (config?.type === CustomTypeEnum.BOOLEAN) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name={ config?.name }
                                label=""
                                required={ config?.required }
                                requiredErrorMessage={ "Provide  " + config?.displayName }
                                value={ initialValue?.value ? [config.name] : [] }
                                type="checkbox"
                                children={ [
                                    {
                                        label: config.displayName,
                                        value: config.name
                                    },
                                ] }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )
            } else {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                required={ config?.required }
                                value={ initialValue?.value }
                                requiredErrorMessage={ "Provide  " + config?.displayName }
                                placeholder={ "Enter  " + config?.displayName }
                                type={ (config?.type === CustomTypeEnum.INTEGER) ? "number" : "text" }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )
            }
        });

    const generateFormElements = (() => {
        // return metadata?.properties.map((config) => {
        //     return createInputComponent(config);
        // })
        // const configs: CustomInboundProtocolPropertyInterface[] = metaDataHard?.properties;
        if (metadata) {
            const configs: CustomInboundProtocolPropertyInterface[] = metadata?.properties;
            if (configs.length > 0) {
                configs.sort(
                    (a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            }
            return configs.map((config) => {
                const initialValue: PropertyModelInterface = initialValues?.properties.find((prop) => prop.key === config.name);
                if (initialValue) {
                    return createInputComponent(config, initialValue);
                } else {
                    return (createInputComponent(config));
                }

            })
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
                allowedOptions.push({ text: ele, value: ele, key: options.indexOf(ele) });
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
        for (const [key, value] of values) {
            let property: SubmitFormCustomPropertiesInterface = undefined;
            if (value instanceof Array) {
                property = {
                    key: key,
                    value: value.length > 0 ? true : false
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
                    name: protocolName,
                    configName: protocolName,
                    properties: [
                        ...valueProperties
                    ]
                }
            }
        }
    };

    useEffect(() => {
        if (metadata) {
            generateFormElements();
        }
    }, [metadata]);

    return (metadata
            ?
            <Forms
                onSubmit={ (values) => {
                    onSubmit(updateConfiguration(values));
                    // console.log(updateConfiguration(values))
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    { generateFormElements() }
                </Grid>
            </Forms>
            : <ContentLoader/>
    );
};
