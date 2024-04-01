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
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, Form, Icon, Input, Portal, Segment } from "semantic-ui-react";
import TimeZoneSelectorDropdown from "./time-zone-selector-dropdown";
import { LogsConstants } from "../constants/logs-constants";

/**
 * Props interface for TimeRangeSelectorDropdown component
 */
interface TimeRangeSelectorInterface 
    extends IdentifiableComponentInterface {
    setFromTime: (value: string) => void;
    setToTime: (value: string) => void;
    setTimeRange: (value: number) => void;
}

/**
 * Time range selection dropdown for filtering diagnostic logs
 * @param props - TimeRangeSelectorDropdown props
 * @returns React functional component
 */
const TimeRangeSelectorDropdown = (props: TimeRangeSelectorInterface):ReactElement => {
    const {
        ["data-componentid"]: componentId,
        setToTime, setFromTime,
        setTimeRange
    } = props;

    const [ open, setOpen ] = useState<boolean>(false);
    const [ startDate, setStartDate ] = useState<string>("");
    const [ endDate, setEndDate ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<string>("");
    const [ endTime, setEndTime ] = useState<string>("");
    const [ selectedRange, setSelectedRange ] = useState<number>(0.25);
    const [ prevSelectedRange, setPrevSelectedRange ] = useState<number>(0.25);
    const [ timeZone, setTimeZone ] = useState<string>("+0000");
    const [ isTimeRangeDropdownOpen, setIsTimeRangeDropdownOpen ] = useState<boolean | undefined>(
        undefined
    );

    const { t } = useTranslation();

    const currentDate: Date = new Date();
    const maxDate: Date = new Date();
    const minDate: Date = new Date(currentDate.setDate(currentDate.getDate() - 60));

    /**
     * Converts a date value to a formatted string value.
     * @param date - Date
     * @returns formatted date string
     */
    const convertDateString = (date: Date): string => {
        return date
            .toLocaleDateString("en-GB")
            .split("/")
            .reverse()
            .join("-");
    };

    /**
     * Handles the time range according to the dropdown.
     */
    const handleTimeRange = (e: React.SyntheticEvent<HTMLElement>, { value }: { value: number }): void => {
        setTimeRange(value);
        setSelectedRange(value);

        if (value === -1) {
            setOpen(true);

            return;
        }

        setPrevSelectedRange(value);

        /**
         * Clear custom data.
         */
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");

        /**
         * Number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
         */
        const current: number = new Date().getTime();

        setToTime(current.toString());
        /**
         * Set start time by subtracting the time range selected.
         */
        setFromTime((current - 3600*1000*value).toString());
    };

    /**
     * Handles custom time range input.
     */
    const handleCustomRangeSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const fromTime: string = new Date(`${startDate}T${startTime}${timeZone}`).getTime().toString();
        const toTime: string = new Date(`${endDate}T${endTime}${timeZone}`).getTime().toString();

        setFromTime(fromTime);
        setToTime(toTime);
        setOpen(false);
    };

    /**
     * Handles custom input close action.
     */
    const handleExternalPortalClose = (): void => {
        if (!(startTime && endTime && startDate && endDate)) {
            setSelectedRange(prevSelectedRange);
        }
        setOpen(false);
    };

    return (
        <div className="time-range-selector-wrapper">
            <Dropdown
                scrolling
                pointing="top right"
                open={ isTimeRangeDropdownOpen }
                options={ LogsConstants.TIMERANGE_DROPDOWN_OPTIONS }
                onOpen={ () => setIsTimeRangeDropdownOpen(true) }
                onClose={ () => setIsTimeRangeDropdownOpen(false) }
                onChange={ handleTimeRange }
                onClick={ handleExternalPortalClose }
                value={ selectedRange }
                data-componentid={ `${componentId}-timerange-dropdown` }
            />
            <span hidden={ selectedRange !== -1 }>
                <Icon
                    name={ open ? "close" : "calendar alternate" }
                    className="icon-btn"
                    color="grey"
                    onClick={ open ? handleExternalPortalClose : () => setOpen(!open) }
                />
            </span>
            <Portal
                onOpen={ () => setOpen(true) }
                open={ open } >
                <Segment className="custom-portal-wrapper">
                    <div
                        className="main-container"
                        onClick={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                            e.stopPropagation()
                        }
                    >
                        <Form
                            className="date-picker-form"
                            onSubmit={ handleCustomRangeSubmit }
                        >
                            <Form.Group>
                                <Form.Field width={ 16 }>
                                    <label>
                                        {
                                            t("extensions:develop.monitor.filter." +
                                                "dropdowns.timeRange.custom.labels.timeZone")
                                        }
                                    </label>
                                    <TimeZoneSelectorDropdown
                                        getTimeZone={ setTimeZone }
                                        selectedTimeZone = { timeZone }
                                    />
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width={ 16 }>
                                    <label>
                                        {
                                            t("extensions:develop.monitor.filter." +
                                                "dropdowns.timeRange.custom.labels.from")
                                        }
                                    </label>
                                    <div className="date-time-picker-row">
                                        <div>
                                            <Input
                                                className="date-input"
                                                type="date"
                                                value={ startDate }
                                                min={ convertDateString(minDate) }
                                                max={ convertDateString(maxDate) }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setStartDate(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                className="time-input"
                                                type="time"
                                                value={ startTime }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setStartTime(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width={ 16 }>
                                    <label>
                                        {
                                            t("extensions:develop.monitor.filter." +
                                                "dropdowns.timeRange.custom.labels.to")
                                        }
                                    </label>
                                    <div className="date-time-picker-row">
                                        <div>
                                            <Input
                                                className="date-input"
                                                type="date"
                                                min={
                                                    startDate ||
                                                        convertDateString(minDate)
                                                }
                                                max={ convertDateString(maxDate) }
                                                value={ endDate }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setEndDate(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                className="time-input"
                                                type="time"
                                                value={ endTime }
                                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setEndTime(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width={ 16 }>
                                    <Button fluid icon="check" type="submit" />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </div>
                </Segment>
            </Portal>
        </div>
    );
};

export default TimeRangeSelectorDropdown;
