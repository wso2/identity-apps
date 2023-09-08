/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import { LogsConstants } from "../constants";

const TIME_ZONE_DATA: Array<{key: number, text: string, value: string}> = LogsConstants.TIME_ZONE_DATA;

/**
 * Interface for time zone selector component
 */
interface TimeZoneSelectorPropsInterface extends IdentifiableComponentInterface {
    getTimeZone: (value: string) => void;
    selectedTimeZone: string;
}

/**
 * Dropdown component to select time zone
 * @param props - TimeZoneSelectorDropdown props
 * @returns React functional component
 */
const TimeZoneSelectorDropdown = (props: TimeZoneSelectorPropsInterface): ReactElement => {
    const { getTimeZone, selectedTimeZone } = props;
    const { t } = useTranslation();

    const handleDropdownChange = (e: React.SyntheticEvent<HTMLElement>, { value }: { value: string }): void => {
        getTimeZone(value);
    };

    return (
        <Dropdown
            search
            selection
            placeholder={
                t("extensions:develop.monitor.filter." +
                    "dropdowns.timeZone.placeholder")
            }
            value={ selectedTimeZone }
            options={ TIME_ZONE_DATA }
            onChange={ handleDropdownChange }
        />
    );
};

export default TimeZoneSelectorDropdown;
