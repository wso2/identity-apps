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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { history } from "../../../helpers";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../../../constants";
import { Forms, Field } from "@wso2is/forms";
import { Grid, Button, DropdownItemProps } from "semantic-ui-react";
import * as CountryLanguage from "country-language";
import { CodeEditor } from "@wso2is/react-components";

export const AddLocaleTemplate: FunctionComponent = (): ReactElement => {

    const [ templateTypeId, setTemplateTypeId ] = useState<string>('');
    const [ localeList, setLocaleList ] = useState<DropdownItemProps[]>([]);

    /**
     * Util to handle back button event.
     */
    const handleBackButtonClick = () => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const templateTypeId = path[ path.length - 2 ];

        setTemplateTypeId(templateTypeId);

        const locales: string[] = CountryLanguage.getLocales(true);
        const localeDropDown: DropdownItemProps[] = [];

        locales.forEach((locale, index) => {
            const countryCode = locale.split("-")[1];
            const languageCode = locale.split("-")[0];

            const language = CountryLanguage.getLanguage(languageCode).name;
            const country = CountryLanguage.getCountry(countryCode).name;

            localeDropDown.push({
                key: index,
                value: locale,
                text: country ? language + " (" + country + ")" : language,
                active: locale === "en-US",
                selected: locale === "en-US"
            })
        });

        setLocaleList(localeDropDown);

    }, [localeList.length]);

    return (
        <Forms 
            onSubmit={ (values) => {
                console.log(values)
            } }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                        <Field
                            type="dropdown"
                            label="Locale "
                            name="locale"
                            children={ localeList ? localeList : [] }
                            placeholder="Domain"
                            requiredErrorMessage="Select Domain"
                            required={ true }
                            element={ <div></div> }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                        <Field
                            name={ "emailSubject" }
                            label={ "Subject" }
                            required={ true }
                            requiredErrorMessage={ "Email Subject is required" }
                            placeholder={ "Enter your Email Subject" }
                            type="text"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 12 }>
                        <CodeEditor
                            lint
                            language="javascript"
                            sourceCode={ "" }
                            options={ {
                                lineWrapping: true
                            } }
                            onChange={ (editor, data, value) => {
                                console.log();
                            } }
                            theme={  "dark" }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            Add Locale Template
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
}
