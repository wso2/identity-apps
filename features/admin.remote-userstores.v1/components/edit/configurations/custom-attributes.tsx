/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import { Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { EmptyPlaceholder, Heading, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Header, Segment } from "semantic-ui-react";

/**
 * Interface for the custom attribute mappings component props.
 */
interface CustomAttributeMappingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The list of custom attributes.
     */
    attributesList: Claim[];
    /**
     * The function to resolve the mapped attribute.
     */
    resolveMappedAttribute: (attribute: Claim) => string;
    /**
     * Whether the component is read-only.
     */
    isReadOnly?: boolean
}

/**
 * Custom attribute mappings component for the remote user store edit page.
 */
const CustomAttributeMappings: FunctionComponent<CustomAttributeMappingsPropsInterface> = (
    {
        attributesList,
        resolveMappedAttribute,
        isReadOnly = false,
        ["data-componentid"]: componentId = "custom-attribute-mappings"
    }: CustomAttributeMappingsPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const validateRequiredField = (value: string) => {
        if (!value) {
            return t("remoteUserStores:form.fields.attributes.validation.required");
        }

        return undefined;
    };

    return (
        <div>
            <Heading as="h5">
                { t("remoteUserStores:pages.edit.configurations.attributes.custom.heading") }
            </Heading>
            <Segment className="attribute-mapping-section" padded="very">
                { attributesList?.length === 0 && (
                    <EmptyPlaceholder
                        title={
                            t("remoteUserStores:pages.edit.configurations.attributes.custom.emptyPlaceholder.heading") }
                        subtitle={
                            [ t("remoteUserStores:pages.edit.configurations."
                                + "attributes.custom.emptyPlaceholder.description") ]
                        }
                        data-componentid={ `${componentId}-empty-placeholder` }
                    />
                ) }
                { attributesList?.length > 0 && (
                    <Stack spacing={ 2 } data-componentid={ `${componentId}-grid` }>
                        {
                            attributesList?.map((attribute: Claim, index: number) => {
                                // http://wso2.org/claims/emailaddress type of name
                                // is not supported by React Final Form field. Hence encoding.
                                const fieldName: string = encodeURIComponent(attribute.claimURI);

                                return (
                                    <Grid
                                        key={ index }
                                        container
                                    >
                                        <Grid xs={ 12 } lg={ 6 } xl={ 5 }>
                                            <Header.Content>
                                                { attribute?.displayName }
                                                <Text
                                                    display="inline"
                                                    styles={ { color: "red" } }
                                                >
                                            *
                                                </Text>
                                                <Header.Subheader>
                                                    <code
                                                        className={
                                                            "inline-code compact transparent"
                                                        }
                                                    >
                                                        { attribute?.claimURI }
                                                    </code>
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Grid>
                                        <Grid xs={ 6 } lg={ 6 } xl={ 5 }>
                                            <FinalFormField
                                                FormControlProps={ {
                                                    margin: "dense"
                                                } }
                                                data-componentid={ `${componentId}-${attribute.claimURI}-input` }
                                                name={ fieldName }
                                                component={ TextFieldAdapter }
                                                initialValue={ resolveMappedAttribute(attribute) }
                                                disabled={ isReadOnly }
                                                validate={ validateRequiredField }
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            })
                        }
                    </Stack>
                ) }
            </Segment>
        </div>
    );
};

export default CustomAttributeMappings;
