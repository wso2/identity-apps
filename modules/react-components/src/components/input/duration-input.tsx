import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, useState } from "react";
import { Dropdown, Input, StrictDropdownItemProps, StrictDropdownProps, StrictInputProps } from "semantic-ui-react";

export interface DurationInputProps extends StrictInputProps, IdentifiableComponentInterface {
    defaultValue: string;
    /**
     * Give finer control to the parent to change dropdown
     * behaviour without pass-through props.
     */
    dropdownProps?: StrictDropdownProps;
    options: Array<StrictDropdownItemProps>;
    placeholder?: string;
}

export const DurationInput: FC<DurationInputProps> = (props) => {

    const {
        defaultValue,
        options,
        [ "data-componentid" ]: testId,
        ...rest
    } = props;

    const [ unit, setUnit ] = useState<string>();

    return (
        <Input
            data-componentid={ testId }
            type="number"
            action={ (
                <Dropdown
                    button
                    floating
                    options={ options }
                    defaultValue={ defaultValue }/>
            ) }
            icon="hourglass start"
            iconPosition="left"
            placeholder="Search..."
            { ...rest }
        />
    );

};

export enum DurationInputOption {
    SECONDS,
    MINUTES,
    HOURS,
    DAYS,
    MONTHS
}

const DURATION_OPTIONS_MAPPINGS: {
    [ key: string ]: {
        key: string;
        text: string;
        value: string;
    } & StrictDropdownItemProps
} = {
    [ DurationInputOption.SECONDS ]: {
        key: "option-seconds",
        text: "Seconds",
        value: "seconds"
    },
    [ DurationInputOption.MINUTES ]: {
        key: "option-minutes",
        text: "Minutes",
        value: "minutes"
    },
    [ DurationInputOption.HOURS ]: {
        key: "option-hours",
        text: "Hours",
        value: "hours"
    },
    [ DurationInputOption.DAYS ]: {
        key: "option-days",
        text: "Days",
        value: "days"
    },
    [ DurationInputOption.MONTHS ]: {
        key: "option-months",
        text: "Months",
        value: "months"
    }
};

