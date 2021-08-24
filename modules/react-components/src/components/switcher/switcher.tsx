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
     * The default value should map to one of the provided options.
     * Otherwise, it will always set the default value as the first
     * option that passed to this.
     */
    defaultOptionValue?: string;
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
export type SwitcherProps = PropsWithChildren<StrictSwitcher & ButtonGroupProps>;

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
export type SwitcherOptionProps = StrictSwitcherOption & ButtonProps;

type OptionMouseEventAlias = React.MouseEvent<HTMLButtonElement>;

const FIRST_ELEMENT_INDEX: number = 0;
const EMPTY_OBJECT: {} = {};

/**
 * @pure check every option has icon value in place.
 * @param options {SwitcherOptionProps[]}
 */
const canButtonGroupHaveIcons = (options: SwitcherOptionProps[]): boolean => {
    return options.every((optionHas) => Boolean(optionHas?.icon));
};

/**
 * @pure This function will find and return the specified target value.
 * @param options {SwitcherOptionProps[]}
 * @param targetDefaultValue {SwitcherOptionProps.value}
 */
const findTheDefaultOption = (
    options: SwitcherOptionProps[],
    targetDefaultValue: string
): SwitcherOptionProps | undefined => {
    return options.find((opt: SwitcherOptionProps) => (opt.value === targetDefaultValue));
};

/**
 * @impure Swap the given default option into position.
 * @param options {SwitcherOptionProps[]}
 * @param defaultOption {SwitcherOptionProps}
 */
const swapFirstForDefault = (
    options: SwitcherOptionProps[],
    defaultOption: SwitcherOptionProps
): void => {
    const defaultOptionIndex = options.findIndex(o => o.value === defaultOption.value);
    const firstOption: SwitcherOptionProps = options[ FIRST_ELEMENT_INDEX ];
    options[ FIRST_ELEMENT_INDEX ] = options[ defaultOptionIndex ];
    options[ defaultOptionIndex ] = firstOption;
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
        defaultOptionValue,
        disabledMessage,
        selectedValue,
        options,
        onChange,
        ...rest
    } = props;

    /**
     * Find the default value first. This should be provided from the
     * interface consumer. However, if the default value is not present
     * then below operation will result in undefined.
     */
    const specifiedDefaultOption: SwitcherOptionProps | undefined = findTheDefaultOption(
        options,
        defaultOptionValue
    );
    /**
     * As a UI/UX practice always sort the default option
     * to be the first element in a group of elements.
     *
     * So, before rendering the elements we pre-swap the {@link options} in
     * place to make sure this operation applies before any side effects.
     * This will only apply if {@link specifiedDefaultOption} is truthy.
     * Otherwise {@link options[FIRST_ELEMENT_INDEX] } will be the default
     * value as specified in the useState initial value.
     */
    if (specifiedDefaultOption) {
        swapFirstForDefault(options, specifiedDefaultOption);
    }
    /**
     * As described in the interface docs. The first element will be
     * selected by default if selectedto ensure we have a value to trigger the
     * initial event.
     */
    const [ selectedOption, setSelectedOption ] = useState<SwitcherOptionProps>(
        options.find(({ value }) => value === selectedValue) ??
        specifiedDefaultOption ??
        options[ FIRST_ELEMENT_INDEX ]
    );

    useEffect(() => {
        /**
         * Trigger the initial event. This makes sure parent gets notified
         * initially when the component renders successfully and allow the
         * parent to know the initial value.
         */
        if (onChange)
            onChange(selectedOption);
    });

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
            { ...(rest ?? EMPTY_OBJECT) }
        >
            { options.map((opt: SwitcherOptionProps, index: number): ReactElement => {
                const { value, label, disabled, ...optRest } = opt;
                if (disabled) {
                    return (
                        <Popup
                            content={ disabledMessage ?? "This action is disabled." }
                            // Why a <span> wrapping the button? Well, buttons doesn't
                            // trigger hovers when they're disabled...
                            // Popup only triggers: {hover, click, focus} events.
                            // https://react.semantic-ui.com/modules/popup/
                            // https://github.com/Semantic-Org/Semantic-UI-React/issues/1413
                            trigger={
                                <div>
                                    <Button
                                        style={ { height: "100%" } }
                                        disabled
                                        key={ index }
                                        value={ value }
                                        content={ label }
                                        onClick={ OPERATION_PASS }
                                    />
                                </div>
                            }
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
                        { ...(optRest ?? EMPTY_OBJECT) }
                    />
                ) as ReactElement;
            }) }
        </Button.Group>
    );

};

const OPERATION_PASS = (
    event: React.MouseEvent<HTMLButtonElement>
): void => {
    event?.preventDefault();
    event?.stopPropagation();
};
