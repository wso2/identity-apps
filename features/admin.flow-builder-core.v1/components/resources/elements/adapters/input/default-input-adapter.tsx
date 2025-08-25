/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Code from "@oxygen-ui/react/Code";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../../hooks/use-required-fields";
import { CommonElementFactoryPropsInterface } from "../../common-element-factory";
import Hint from "../../hint";
import PlaceholderComponent from "../placeholder-component";

/**
 * Props interface of {@link DefaultInputAdapter}
 */
export type DefaultInputAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Fallback adapter for the inputs.
 *
 * @param props - Props injected to the component.
 * @returns The DefaultInputAdapter component.
 */
export const DefaultInputAdapter: FunctionComponent<DefaultInputAdapterPropsInterface> = ({
    resource
}: DefaultInputAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.input.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the input field with ID <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.input.label"),
                name: "label"
            },
            {
                errorMessage: t("flows:core.validation.fields.input.identifier"),
                name: "identifier"
            }
        ];
    }, []);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    return (
        <TextField
            fullWidth
            className={ resource.config?.className }
            defaultValue={ resource.config?.defaultValue }
            helperText={ (
                resource.config?.hint && <Hint hint={ resource.config?.hint } />
            ) }
            inputProps={ {
                maxLength: resource.config?.maxLength,
                minLength: resource.config?.minLength
            } }
            label={ <PlaceholderComponent value={ resource.config?.label } /> }
            multiline={ resource.config?.multiline }
            placeholder={ resource.config?.placeholder || "" }
            required={ resource.config?.required }
            InputLabelProps={ {
                required: resource.config?.required
            } }
            type={ resource.config?.type }
            style={ resource.config?.styles }
            autoComplete={ resource.config?.type === "password" ? "new-password" : "off" }
        />
    );
};

export default DefaultInputAdapter;
