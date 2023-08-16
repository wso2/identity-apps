/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
