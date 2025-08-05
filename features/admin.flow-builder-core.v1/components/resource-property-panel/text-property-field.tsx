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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import startCase from "lodash-es/startCase";
import React, { ChangeEvent, FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import I18nConfigurationCard from "./i18n-configuration-card";
import { Resource } from "../../models/resources";
import "./text-property-field.scss";

/**
 * Props interface of {@link TextPropertyField}
 */
export interface TextPropertyFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource associated with the property.
     */
    resource: Resource;
    /**
     * The key of the property.
     */
    propertyKey: string;
    /**
     * The value of the property.
     */
    propertyValue: string;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
    /**
     * Additional props.
     */
    [ key: string ]: any;
}

/**
 * Text property field component for rendering text input fields.
 *
 * @param props - Props injected to the component.
 * @returns The TextPropertyField component.
 */
const TextPropertyField: FunctionComponent<TextPropertyFieldPropsInterface> = ({
    "data-componentid": componentId = "text-property-field",
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: TextPropertyFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const [ isI18nCardOpen, setIsI18nCardOpen ] = useState<boolean>(false);
    const iconButtonRef: React.RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

    /**
     * Handles the toggle of the i18n configuration card.
     */
    const handleI18nToggle = () => {
        setIsI18nCardOpen(!isI18nCardOpen);
    };

    /**
     * Handles the closing of the i18n configuration card.
     */
    const handleI18nClose = () => {
        setIsI18nCardOpen(false);
    };

    return (
        <Box className="flow-builder-resource-property-panel-text-field">
            <TextField
                fullWidth
                label={ startCase(propertyKey) }
                defaultValue={ propertyValue }
                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                    onChange(`config.${propertyKey}`, e.target.value, resource)
                }
                placeholder={ t("flows:core.elements.textPropertyField.placeholder",
                    { propertyName: startCase(propertyKey) }) }
                data-componentid={ `${componentId}-${propertyKey}` }
                InputProps={ {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip
                                title={
                                    t("flows:core.elements.textPropertyField.tooltip.configureTranslation")
                                }
                            >
                                <IconButton
                                    ref={ iconButtonRef }
                                    onClick={ handleI18nToggle }
                                    size="small"
                                    aria-label={
                                        t("flows:core.elements.textPropertyField.tooltip.configureTranslation")
                                    }
                                    aria-pressed={ isI18nCardOpen }
                                    className="flow-builder-resource-property-panel-i18n icon-button"
                                >
                                    <PlusIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                } }
                { ...rest }
            />
            {
                isI18nCardOpen && (
                    <I18nConfigurationCard
                        open={ isI18nCardOpen }
                        anchorEl={ iconButtonRef.current }
                        propertyKey={ propertyKey }
                        onClose={ handleI18nClose }
                        data-componentid={ `${componentId}-i18n-card` }
                    />
                )
            }
        </Box>
    );
};

export default TextPropertyField;
