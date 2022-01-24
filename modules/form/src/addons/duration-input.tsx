/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FC, ReactElement, useEffect, useState } from "react";
import { Dropdown, DropdownItemProps, Input, StrictFormDropdownProps, StrictFormInputProps } from "semantic-ui-react";

export interface DurationInputProps extends StrictFormInputProps {
    "data-componentid"?: string;
    defaultValues: {
        unit: UnitOfTime;
        duration: number;
    };
    dropdownProps?: StrictFormDropdownProps;
    onValuesChange: (value: number, unit: UnitOfTime) => void;
    options: Array<DropdownItemProps>;
    placeholder?: string;
}


type DurationOptionsMappingType = {
    [ key: string ]: {
        key: string;
        text: string;
        value: string;
    } & DropdownItemProps
};

export enum UnitOfTime {
    SECONDS = "SECONDS",
    MINUTES = "MINUTES",
    HOURS = "HOURS",
    DAYS = "DAYS",
    MONTHS = "MONTHS"
}

export const DURATION_MAPPINGS: DurationOptionsMappingType = {
    [ UnitOfTime.SECONDS ]: {
        key: "option-seconds",
        text: "Seconds",
        value: UnitOfTime.SECONDS.toString()
    },
    [ UnitOfTime.MINUTES ]: {
        key: "option-minutes",
        text: "Minutes",
        value: UnitOfTime.MINUTES.toString()
    },
    [ UnitOfTime.HOURS ]: {
        key: "option-hours",
        text: "Hours",
        value: UnitOfTime.HOURS.toString()
    },
    [ UnitOfTime.DAYS ]: {
        key: "option-days",
        text: "Days",
        value: UnitOfTime.DAYS.toString()
    },
    [ UnitOfTime.MONTHS ]: {
        key: "option-months",
        text: "Months",
        value: UnitOfTime.MONTHS.toString()
    }
};

/**
 * Converts a string type to {@link UnitOfTime}
 * @param str {string} probably string values of UnitOfTime.
 */
export const getUnitEnumByStringValue = (str: string): UnitOfTime => {
    switch (str.toUpperCase()) {
        case UnitOfTime.SECONDS.toString():
            return UnitOfTime.SECONDS;
        case UnitOfTime.MINUTES.toString():
            return UnitOfTime.MINUTES;
        case UnitOfTime.HOURS.toString():
            return UnitOfTime.HOURS;
        case UnitOfTime.DAYS.toString():
            return UnitOfTime.DAYS;
        case UnitOfTime.MONTHS.toString():
            return UnitOfTime.MONTHS;
    }
};

/**
 * Static configurations.
 */
export const DEFAULT_OPTION = DURATION_MAPPINGS[ UnitOfTime.SECONDS.toString() ];
export const DEFAULT_DURATION = 3600;
export const DEFAULT_UNIT = UnitOfTime.SECONDS;


export const DurationInput: FC<DurationInputProps> = (props): ReactElement => {

    const {
        defaultValues: { unit, duration },
        options,
        dropdownProps,
        placeholder,
        onValuesChange,
        [ "data-componentid" ]: testId,
        ...rest
    } = props as DurationInputProps;

    const [ unitOfTime, setUnitOfTime ] = useState<UnitOfTime>(unit ?? DEFAULT_UNIT);
    const [ unitDuration, setUnitDuration ] = useState<number>(duration ?? DEFAULT_DURATION);

    /**
     * Whenever {@code unitDuration} or {@code unitOfTime} gets changed,
     * call {@link onValuesChange} with the updated values.
     */
    useEffect(() => {
        onValuesChange(unitDuration, unitOfTime);
    }, [ unitOfTime, unitDuration ]);

    return (
        <Input
            data-testid={ testId }
            data-componentid={ testId }
            type="number"
            action={ (
                <Dropdown
                    button
                    floating
                    onChange={ (event, data) => {
                        setUnitOfTime(getUnitEnumByStringValue(String(data.value)));
                    } }
                    options={ options }
                    defaultValue={ unitOfTime?.toString() ?? DEFAULT_OPTION.value }
                    { ...dropdownProps }
                />
            ) }
            icon="hourglass start"
            iconPosition="left"
            placeholder={ placeholder ?? "Enter a Value" }
            { ...rest }
            onChange={ (event, data) => {
                event?.preventDefault();
                setUnitDuration(Number(data.value));
            } }
        />
    );

};

/**
 * Default properties of DurationInput
 */
DurationInput.defaultProps = {
    "data-componentid": "duration-dropdown",
    defaultValues: {
        duration: DEFAULT_DURATION,
        unit: DEFAULT_UNIT
    }
};
