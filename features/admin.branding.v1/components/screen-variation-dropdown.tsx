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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps, Form, Select } from "semantic-ui-react";
import useBrandingPreference from "../hooks/use-branding-preference";
import { PreviewScreenType, PreviewScreenVariationType } from "../models/branding-preferences";
import { BASE_DISPLAY_VARIATION } from "../models/custom-text-preference";

/**
 * Prop types for the screen variation dropdown component.
 */
export interface ScreenVariationDropdownPropsInterface extends IdentifiableComponentInterface {
    /**
     * Current selected screen type.
     */
    selectedScreen: PreviewScreenType;
    /**
     * Callback to be called when the screen variation is changed.
     */
    onChange: (screenVariation: string) => void;
    /**
     * Should the dropdown render as a required field.
     */
    required?: boolean;
}

/**
 * Dropdown component to select the screen.
 *
 * @param props - Props injected to the component.
 * @returns Screen dropdown component.
 */
const ScreenVariationDropdown: FunctionComponent<ScreenVariationDropdownPropsInterface> = (
    props: ScreenVariationDropdownPropsInterface
): ReactElement => {
    const {
        onChange,
        selectedScreen,
        required,
        ["data-componentid"]: componentId
    } = props;

    const { getScreenVariations } = useBrandingPreference();

    const { t } = useTranslation();

    const [ screenVariations, setScreenVariations ] = useState<PreviewScreenVariationType[]>();
    const [ selectedScreenVariation, setSelectedScreenVariation ]
        = useState<PreviewScreenVariationType>();

    /**
     * Update the variations accordingly on selected screen change.
     */
    useEffect(() => {
        setSelectedScreenVariation(BASE_DISPLAY_VARIATION[selectedScreen]);
        setScreenVariations(getScreenVariations(selectedScreen));
        onChange(BASE_DISPLAY_VARIATION[selectedScreen]);
    }, [ selectedScreen ]);

    const supportedScreenVariations: {
        key: string;
        text: string;
        value: string;
    }[] = useMemo(() => {
        if (!screenVariations) {
            return [];
        }

        return screenVariations.map((variation: string) => {
            return {
                key: variation,
                text: t(`branding:variations.${ variation }`),
                value: variation
            };
        });
    }, [ screenVariations ]);

    return (
        (screenVariations?.length > 1 && (
            <Form.Field
                control={ Select }
                ariaLabel="Branding text customization screen selection"
                className="dropdown branding-preference-custom-text-screen-dropdown"
                name="screen-variation"
                label={ t("branding:brandingCustomText.screenSelectVariationDropdown.label") }
                options={ supportedScreenVariations }
                required={ required }
                data-componentid={ componentId }
                placeholder={ t("branding:brandingCustomText.screenSelectVariationDropdown.placeholder") }
                defaultValue={ supportedScreenVariations[0]?.text }
                value={ selectedScreenVariation }
                onChange={ (
                    _: React.SyntheticEvent<HTMLElement, Event>,
                    { value }: DropdownProps
                ) => {
                    setSelectedScreenVariation(value as PreviewScreenVariationType);
                    onChange(value as PreviewScreenVariationType);
                } }
            />)
        ));
};

/**
 * Default props for the component.
 */
ScreenVariationDropdown.defaultProps = {
    "data-componentid": "screen-variation-dropdown",
    required: false
};

export default ScreenVariationDropdown;
