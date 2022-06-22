/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { Button, ButtonGroupProps, ButtonProps, Popup } from "semantic-ui-react";

// These interface names are confusing?!
// FIXME: {@link StrictSwitcher} properties makes no sense since there's optional!
//        Same case for {@link StrictSwitcherOption}

interface StrictSwitcher {
    /**
     * You can specify maximum of 3 options and a minimum of 2 options.
     * Optionally you can edit the interface props to support your use-case.
     * However, you should consider making the button group `vertical` or
     * `compact` based on the space it takes.
     */
    options: [ SwitcherOptionProps, SwitcherOptionProps, SwitcherOptionProps? ];
    /**
     * This function callback will trigger each time when the value
     * changes in the toggle group.
     *
     * @param selectedValue will return all the props you have passed
     * to this interface and the current state of the option itself.
     */
    onChange?: (selectedValue: SwitcherOptionProps) => void;
    /**
     * The initial selected value. This is different from default option
     * value. Where default option specify the sort order and the selected
     * value describes the initial selected value.
     */
    selectedValue?: string;
}

interface StrictSwitcherOption {
    /**
     * The item value for the switcher option.
     * Usually this should be unique for every option
     * in the switcher.
     */
    value: string;
    /**
     * The label of this option. This is usually a
     * readable string that can be rendered to the screen.
     */
    label: string;
    /**
     * Determines whether this switch option is disabled or not.
     * If theres only two options available and one of them are
     * disabled then the other value will be selected by default
     * if the switcher marked as required.
     */
    disabled?: boolean;
    /**
     * {@link onSelect} will be triggered when this button
     * state has been changed to active.
     *
     * @param self
     */
    onSelect?: (self: StrictSwitcherOption) => void;
    /**
     * Disabled popup content.
     */
    disabledMessage?: string;
}

/**
 * Switcher props intersected with {@link ButtonGroupProps}
 * to enable more configuration options to the exposing
 * interface.
 */
export type SwitcherProps = PropsWithChildren<StrictSwitcher & ButtonGroupProps & IdentifiableComponentInterface>;

/**
 * Example on extended ButtonProps
 * ===============================
 *
 * Optionally specify an icon to give the individual
 * selection to give more accessibility. For available
 * icons refer: {@link https://react.semantic-ui.com/elements/icon/}
 *
 * This can be done through ...rest props as well. However,
 * this property is explicitly added to this interface to
 * give more clarity. Same goes to {@link color} as well.
 *
 * Example: { ... icon: 'file' }
 *
 * Optionally specify the color to each of the {@link StrictSwitcherOption}
 * to distinguish from other options. For a color palette refer:
 * {@link https://react.semantic-ui.com/elements/button/#types-basic-shorthand}
 *
 * Example: { ... color: 'grey' }
 *
 * Optionally specify the label position of the labeled
 * icon button. It can be either left or right depending on the
 * option. By default {@link Switcher} has enabled the
 * {@link StrictButtonGroupProps.labeled} property to {@code true}.
 *
 * Example: { ... labelPosition?: 'right' | 'left' }
 */
export type SwitcherOptionProps = StrictSwitcherOption & ButtonProps & IdentifiableComponentInterface;

type OptionMouseEventAlias = React.MouseEvent<HTMLButtonElement>;

const FIRST_ELEMENT_INDEX: number = 0;
const EMPTY_OBJECT: Record<string, any> = {};

/**
 * @pure check every option has icon value in place.
 * @param options {SwitcherOptionProps[]}
 */
const canButtonGroupHaveIcons = (options: SwitcherOptionProps[]): boolean => {
    return options.every((optionHas) => Boolean(optionHas?.icon));
};

/**
 * This is a dynamic switcher component that offers below
 * functionality:-
 *
 *  1) Given the options, it can render a grouped set of
 *     buttons that is selectable.
 *
 *  2) A {@link StrictSwitcher.defaultOptionValue} value
 *     can be set to enforce the matching value to be
 *     selected initially. If the defaultOptionValue is
 *     unavailable the first element will be the default.
 *
 *  3) Support three switch options. Optionally this can be
 *     adjusted if the use-case requires more options. Ideally
 *     it should be little because its a group and overflows
 *     will not be handle by this component at this time.
 *
 *  4) Fire a initial event for the default value. This will
 *     be triggered when provided/not-provided {@link defaultOptionValue}
 *     nonetheless.
 *
 * How can I use this interface? As a example refer below block.
 *
 *  <Switcher
 *      defaultOptionValue="option2"
 *      onChange={ (selectedOption: SwitcherOptionProps) => {
 *          // Will be triggered initially and on value change.
 *          console.log(selectedOption.value);
 *      } }
 *      options={ [
 *          {
 *              value: "option1",
 *              label: "My option 1",
 *              icon: "cogs"
 *          },
 *          {
 *              value: "option2",
 *              label: "My option 2",
 *              icon: "file"
 *          }
 *      ] }
 *  />
 *
 * @param props {SwitcherProps}
 * @constructor
 */
export const Switcher: FC<SwitcherProps> = (props: SwitcherProps): ReactElement => {

    const {
        disabledMessage,
        selectedValue,
        options,
        onChange,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const [ selectedOption, setSelectedOption ] = useState<SwitcherOptionProps>();

    /**
     * Trigger the initial event. This makes sure parent gets notified
     * initially when the component renders successfully and allow the
     * parent to know the initial value.
     */
    useEffect(() => {
        triggerInitial();
    }, []);

    /**
     * Whenever parent changes this value make sure to update
     * it as necessary.
     */
    useEffect(() => {
        triggerInitial();
    }, [ selectedValue ]);

    const triggerInitial = () => {
        // If user didn't provide a value for {@link selectedValue}
        // try to set the first option as the default value.
        let specifiedDefault = options.find(({ value }) => value === selectedValue);

        if (!specifiedDefault) {
            specifiedDefault = options[FIRST_ELEMENT_INDEX];
        }
        if (onChange) {
            onChange(specifiedDefault);
            setSelectedOption(specifiedDefault);
        }
    };

    /**
     * On {@link SwitcherOptionProps} button click this function will
     * be triggered with the event and the data passed to the
     * {@link Button} element. It uses the {@code data.value}
     * to access the event source value.
     *
     * @param event {OptionMouseEventAlias} alias for {@link React.MouseEvent}
     * @param data {ButtonProps} passed props for the button element.
     */
    const onSwitchOptionButtonClick = (event: OptionMouseEventAlias, data: SwitcherOptionProps) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (onChange) {
            onChange(data);
        } else {
            // If the onChange is present then onSelect will never
            // be called. This is because onChange pretty much offer
            // the same functionality. Hence, no need to invoke two
            // handlers at the same time.
            const fromActiveState = data.active;

            if (!fromActiveState && data?.onSelect) {
                data.onSelect(data);
            }
        }
        setSelectedOption(data);
    };

    return (
        <Button.Group
            labeled
            basic
            icon={ canButtonGroupHaveIcons(options) }
            widths={ options.length }
            data-componentid={ componentId }
            { ...(rest ?? EMPTY_OBJECT) }
        >
            { options.map((opt: SwitcherOptionProps, index: number): ReactElement => {
                const {
                    value,
                    label,
                    disabled,
                    "data-componentid": optionComponentId,
                    ...optRest
                } = opt;

                if (disabled) {
                    return (
                        <Popup
                            content={ disabledMessage ?? DEFAULT_DISABLED_MESSAGE }
                            // Why a <div> wrapping the button? Well, buttons doesn't
                            // trigger hovers when they're disabled...
                            // Popup only triggers: {hover, click, focus} events.
                            // https://react.semantic-ui.com/modules/popup/
                            // https://github.com/Semantic-Org/Semantic-UI-React/issues/1413
                            trigger={ (
                                <div>
                                    <Button
                                        style={ STYLED_BUTTON }
                                        disabled
                                        key={ index }
                                        value={ value }
                                        content={ label }
                                        onClick={ OPERATION_PASS }
                                        data-componentid={ `${ optionComponentId }-disabled` }
                                    />
                                </div>
                            ) }
                            data-componentid={ `${ optionComponentId }-popup` }
                        />
                    );
                }

                return (
                    <Button
                        key={ index }
                        value={ value }
                        content={ label }
                        active={ selectedOption?.value === value }
                        disabled={ Boolean(disabled) }
                        onClick={ onSwitchOptionButtonClick }
                        data-componentid={ optionComponentId }
                        { ...(optRest ?? EMPTY_OBJECT) }
                    />
                ) as ReactElement;
            }) }
        </Button.Group>
    );

};

/**
 * Default props for the component.
 */
Switcher.defaultProps = {
    "data-componentid": "switcher"
};

// Component constants

const DEFAULT_DISABLED_MESSAGE = "This action is disabled.";
const STYLED_BUTTON = { height: "100%" };

const OPERATION_PASS = (
    event: React.MouseEvent<HTMLButtonElement>
): void => {
    event?.preventDefault();
    event?.stopPropagation();
};
