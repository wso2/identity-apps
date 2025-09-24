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

import Checkbox from "@oxygen-ui/react/Checkbox";
import Code from "@oxygen-ui/react/Code";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../../hooks/use-required-fields";
import { CommonElementFactoryPropsInterface } from "../../common-element-factory";
import Hint from "../../hint";
import PlaceholderComponent from "../placeholder-component";

/**
 * Props interface of {@link CheckboxAdapter}
 */
export type CheckboxAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Checkbox component.
 *
 * @param props - Props injected to the component.
 * @returns The CheckboxAdapter component.
 */
export const CheckboxAdapter: FunctionComponent<CheckboxAdapterPropsInterface> = ({
    resource
}: CheckboxAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.checkbox.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the checkbox field with ID{ " " }
                <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.checkbox.label"),
                name: "label"
            },
            {
                errorMessage: t("flows:core.validation.fields.checkbox.identifier"),
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
        <div>
            <FormControlLabel
                control={ <Checkbox defaultChecked /> }
                className={ resource.config?.className }
                defaultValue={ resource.config?.defaultValue }
                label={ <PlaceholderComponent value={ resource.config?.label } /> }
                placeholder={ resource.config?.placeholder || "" }
                required={ resource.config?.required }
                style={ resource.config?.styles }
            />
            {
                resource.config?.hint && (
                    <FormHelperText>
                        <Hint hint={ resource.config?.hint } />
                    </FormHelperText>
                )
            }
        </div>
    );
};

export default CheckboxAdapter;
