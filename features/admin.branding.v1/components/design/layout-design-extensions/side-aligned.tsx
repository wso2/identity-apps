/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { Field } from "@wso2is/form";
import {  Heading } from "@wso2is/react-components";
import React, { Fragment, ReactElement } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { LayoutDesignExtensionInterface } from "./layout-design-extension-component-interface";
import { BrandingPreferencesConstants } from "../../../constants";

/**
 * Renders the layout design extension form fields for the headings section.
 * @returns Extension fields.
 */
export const renderHeadingsExtensionFields = ({
    initialValues,
    layout,
    setLayout,
    readOnly,
    t,
    ["data-componentid"]: componentId
}: LayoutDesignExtensionInterface): ReactElement => {

    return (
        <Fragment>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.layout.headings.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference side aligned layout product tag line input field"
                        inputType="default"
                        name={ "layout.productTagLine" }
                        label={
                            t("extensions:develop.branding.forms.design.layout.headings.fields.productTagline.label")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design"
                                + ".layout.headings.fields.productTagline.placeholder")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.layout.headings.fields.productTagline.hint")
                        }
                        required={ false }
                        value={ initialValues.layout.productTagLine }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.PRODUCT_TAGLINE_TEXT_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.PRODUCT_TAGLINE_TEXT_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-product-tag-line-text` }
                        listen={ (value: string) => {
                            setLayout({
                                ...layout,
                                productTagLine: value
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    );
};
