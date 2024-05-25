/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps, Form, Select } from "semantic-ui-react";

/**
 * Prop types for the language dropdown component.
 */
export interface ScreenDropdownPropsInterface extends IdentifiableComponentInterface {
    /**
     * Default screen.
     */
    defaultScreen: PreviewScreenType;
    /**
     * Callback to be called when the screen is changed.
     * @param locale - selected locale for template
     */
    onChange: (screen: string) => void;
    /**
     * Supported screens.
     * @example ["login", "consent"]
     */
    screens: string[];
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
const ScreenDropdown: FunctionComponent<ScreenDropdownPropsInterface> = (
    props: ScreenDropdownPropsInterface
): ReactElement => {
    const { onChange, defaultScreen, screens, required, ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const [ selectedScreen, setSelectedScreen ] = useState<PreviewScreenType>(defaultScreen);

    useEffect(() => {
        setSelectedScreen(defaultScreen);
        onChange(defaultScreen);
    }, [ defaultScreen ]);

    const supportedScreens: {
        key: string;
        text: string;
        value: string;
    }[] = useMemo(() => {
        if (!screens) {
            return [];
        }

        return screens.map((screen: string) => {
            return {
                key: screen,
                text: t(`branding:screens.${ screen }`),
                value: screen
            };
        });
    }, [ screens ]);

    return (
        <Form.Field
            control={ Select }
            ariaLabel="Branding text customization screen selection"
            className="dropdown branding-preference-custom-text-screen-dropdown"
            name="screen"
            label={ t("branding:brandingCustomText.screenSelectDropdown.label") }
            options={ supportedScreens }
            required={ required }
            data-componentid={ componentId }
            placeholder={ t("branding:brandingCustomText.screenSelectDropdown.placeholder") }
            defaultValue={ supportedScreens[0]?.text }
            value={ selectedScreen }
            onChange={ (
                _: React.SyntheticEvent<HTMLElement, Event>,
                { value }: DropdownProps
            ) => {
                setSelectedScreen(value as PreviewScreenType);
                onChange(value as PreviewScreenType);
            } }
        />
    );
};

/**
 * Default props for the component.
 */
ScreenDropdown.defaultProps = {
    "data-componentid": "screen-dropdown",
    required: false
};

export default ScreenDropdown;
