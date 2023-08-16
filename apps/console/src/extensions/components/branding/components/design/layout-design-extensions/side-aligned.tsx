/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Field } from "@wso2is/form";
import {  Heading } from "@wso2is/react-components";
import React, { Fragment, ReactElement } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { LayoutDesignExtensionInterface } from "./layout-design-extension-component-interface";
import { BrandingPreferencesConstants } from "../../../constants";

/**
 * Renders the layout design extension form fields for the headings section.
 * @returns {React.ReactElement}
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
