/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { ThemeContext, ThemeTypes } from "@wso2is/react-components";
import { Theme, ThemeLessIndex, Themes, defaultThemeVariables } from "@wso2is/theme";
import React, { ChangeEvent, ReactElement, useContext, useState } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { Button, Card, Divider, Form, Grid, Header, Image, Label } from "semantic-ui-react";

/**
 * Util method to convert hex color code string to RGBA color object.
 *
 * @param {string} hex - Color code. E.g. "#000000"
 * @param {number} [alpha] - Alpha (opacity) value. E.g. 0-1
 * 
 * @returns {RGBColor} RGBA color value.
 */
const hexToRGB = (hex: string, alpha?: number): RGBColor => {
    return {
        a: alpha || 1,
        b: parseInt(hex.slice(5, 7), 16),
        g: parseInt(hex.slice(3, 5), 16),
        r: parseInt(hex.slice(1, 3), 16)
    } as RGBColor;
};

/**
 * ColorPicker Component Interface.
 *
 * @interface ColorPickerInterface.
 */
interface ColorPickerInterface {
    inputColor: string;
    inputOnChangeHandler: (hexValue: string) => void;
    name: string;
    placeholder: string;
}

/**
 * ColorPicker ReactComponent.
 *
 * @param {RGBColor} { inputColor } - Input color.
 * @param {(hexValue: string) => void} { inputOnChangeHandler } - Input value change handler.
 * 
 * @returns {ReactElement} - Color Picker component.
 */
const ColorPicker: React.FunctionComponent<ColorPickerInterface> = ({
    inputColor,
    inputOnChangeHandler
}): ReactElement => {

    const [ value, setValue ] = useState({
        color: {
            hex: inputColor,
            rgb: hexToRGB(inputColor)   
        },
        displayColorPicker: false
    });

    /**
     * Method to show ColorPicker component onClick.
     */ 
    const handleClick = () => {
        setValue({ ...value, displayColorPicker: !value.displayColorPicker });
    };

    /**
     * Method to hide ColorPicker component onOutsideClick.
     */
    const handleClose = () => {
        setValue({ ...value, displayColorPicker: false });
    };

    /**
     * Method to update the state with the selected color from ColorPicker component.
     *
     * @param {ColorResult} color - Color object returning from the ColorPicker component.
     */
    const handleChange = (color: ColorResult) => {
        setValue({
            ...value,
            color: {
                ...color,
                hex: color.hex,
                rgb: color.rgb
            }
        });

        inputOnChangeHandler(color.hex);
    };

    /**
     * Method to update the state with user given color input.
     *
     * @param {any} e - Input element onChange event.
     */
    const handleInputChange = (e: any) => {
        setValue({
            ...value,
            color: {
                ...e.target.value,
                hex: e.target.value,
                rgb: hexToRGB(e.target.value)
            }
        });

        inputOnChangeHandler(e.target.value);
    };

    return (
        <div className="ui input labeled react-color">
            <Label
                style={ {
                    "backgroundColor": `rgba(
                        ${ value.color.rgb.r },
                        ${ value.color.rgb.g },
                        ${ value.color.rgb.b },
                        ${ value.color.rgb.a })`
                } }
                onClick={ handleClick }
            >
            </Label>
            <input value={ value.color.hex } onChange={ handleInputChange } />
            { value.displayColorPicker ? 
                <div className="ui react-color-popover">
                    <div className="ui react-color-cover" onClick={ handleClose } />
                    <SketchPicker color={ hexToRGB(inputColor) } onChangeComplete={ handleChange } />
                </div>
                : null
            }
        </div>
    );
};

/**
 * Theme style input form.
 *
 * @returns {ReactElement} - Style edit form component.
 */
const CSSForm = (): ReactElement => {
    const [ themeOptions, setThemeOptions ] = useState({});
    const { setCSS } = useContext(ThemeContext);

    /**
     * Style Variable Input ReactHook.
     *
     * @param {string} initialValue - Default value set in the default theme less.
     * @param {string} input - Input name.
     * @param {string} [type] - Input type. E.g. "color"
     *
     * @returns {inputProps}
     */
    const useStyleInput = (initialValue: string, input: string, type?: string) => {

        const [ value, setValue ] = useState(initialValue);

        /**
         * Update state with input onChange value
         *
         * @param {any} e - onChange event
         */
        const handleChange = (e: any) => {
            setValue(e.target.value);
        };

        const inputProps = {
            name: input,
            onChange: handleChange,
            placeholder: ("E.g. " + initialValue),
            value
        };

        /**
         * Update state with ColorPicker on change
         *
         * @param {string} hexValue
         */
        const handleColorPickerOnChange = (hexValue: string) => {
            setValue(hexValue);
            setThemeOptions({ ...themeOptions, [`@${input}`]: value });
        };

        const colorChildren = () => {
            return (
                <ColorPicker
                    name={ input }
                    placeholder={ "E.g. " + initialValue }
                    inputColor={ value }
                    inputOnChangeHandler={ handleColorPickerOnChange }
                />
            );
        };

        if (type !== undefined && type === "color") {
            return {
                children: colorChildren()
            };
        }

        return inputProps;
    };
    
    const primaryColor = useStyleInput(defaultThemeVariables["primaryColor"], "primaryColor", "color");
    const textColor = useStyleInput(defaultThemeVariables["textColor"], "textColor", "color");
    const pageBackground = useStyleInput(defaultThemeVariables["pageBackground"], "pageBackground", "color");

    const handleCompileTheme = () => {
        Theme.compile(ThemeLessIndex("default"), { modifyVars: themeOptions })
            .then((styles) => {
                setCSS(styles);
            });
    };

    return (
        <Form>
            <Form.Field>
                <label>App Primary Color</label>
                <Grid columns={ 12 }>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Input { ...primaryColor } />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form.Field>
            <Form.Field>
                <label>App Text Color</label>
                <Grid columns={ 12 }>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Input { ...textColor } />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form.Field>
            <Form.Field>
                <label>App Background Color</label>
                <Grid columns={ 12 }>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Input { ...pageBackground } />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form.Field>

            <Button onClick={ () => handleCompileTheme() }>Update</Button>
        </Form>
    );
};

/**
 * Customize Page.
 *
 * @return {ReactElement} - Customize page.
 */
const CustomizePage = (): ReactElement => {

    const { setAppName, setCopyrightText, setLogo, setProductName, setTheme, state } = useContext(ThemeContext);


    /**
     * Application Theme change state update method.
     *
     * @param {ThemeTypes} theme.
     */
    const handleThemeSelect = (theme: ThemeTypes) => {
        setTheme(theme);
    };

    /**
     * Product Name change state update method.
     *
     * @param {ChangeEvent} e - Input onChange event.
     * @param {{ value: string }} { value } - User input value.
     */
    const handleProductNameChange = (e: ChangeEvent, { value }: { value: string }) => {
        setProductName(value);
    };

    /**
     * Product Logo change state update method.
     *
     * @param {ChangeEvent} e - Input onChange event.
     * @param {{ value: string }} { value } - User input value.
     */
    const handleLogoChange = (e: ChangeEvent, { value }: { value: string }) => {
        setLogo(value);
    };

    /**
     * Application Copyright Text change state update method.
     *
     * @param {ChangeEvent} e - Input onChange event.
     * @param {{ value: string }} { value } - User input value.
     */
    const handleCopyrightTextChange = (e: ChangeEvent, { value }: { value: string }) => {
        setCopyrightText(value);
    };

    /**
     * Application Name change state update method.
     *
     * @param {ChangeEvent} e - Input onChange event.
     * @param {{ value: string }} { value } - User input value.
     */
    const handleAppNameChange = (e: ChangeEvent, { value }: { value: string }) => {
        setAppName(value);
    };

    return (
        <>
            <Header className="page-header" as="h1">
                Application Appearance Settings
                <Header.Subheader className="sub-header">
                    Use below fields to change appearance of the application.
                </Header.Subheader>
            </Header>

            <Divider hidden />

            <Header as="h3" className="sub-header">Theme</Header>
            <Divider />

            <Card.Group itemsPerRow={ 9 }>
                { 
                    Themes.map((theme, index) => {
                        return (
                            <Card key={ index } link onClick={ () => handleThemeSelect(theme) }>
                                <Image src={ `themes-less/themes/${theme}/preview.jpg` } wrapped ui={ false } />
                                <Card.Content>
                                    <Card.Header>{ theme }</Card.Header>
                                </Card.Content>
                            </Card>
                        );
                    })
                }
            </Card.Group>

            <Divider hidden />

            <Header as="h3" className="sub-header">Theme colors</Header>
            <Divider />

            <CSSForm />

            <Header as="h3" className="sub-header">Customize application identity</Header>
            <Divider />

            <Form>
                <Form.Field>
                    <label>Application Name</label>
                    <Grid columns={ 4 }>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    value={ state.appName }
                                    onChange={ handleAppNameChange }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form.Field>
                <Form.Field>
                    <label>Product Name</label>
                    <Grid columns={ 4 }>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    value={ state.productName }
                                    onChange={ handleProductNameChange }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form.Field>
                <Form.Field>
                    <label>Product Logo URL</label>
                    <Grid columns={ 4 }>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    value={ state.logo }
                                    onChange={ handleLogoChange }
                                />
                            </Grid.Column>
                            { state.logo && state.logo !== "" &&
                                <Grid.Column>
                                    <img src={ state.logo } style={ { maxHeight: 25 } } />
                                </Grid.Column>
                            }
                        </Grid.Row>
                    </Grid>
                </Form.Field>
                <Form.Field>
                    <label>Copyright Text Name</label>
                    <Grid columns={ 4 }>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    value={ state.copyrightText }
                                    onChange={ handleCopyrightTextChange }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form.Field>
            </Form>
        </>
    );
};

/* 
 * Color Picker Default Props.
 */
ColorPicker.defaultProps = {
    inputColor: "#000000",
    inputOnChangeHandler: () => { return; },
    name: "",
    placeholder: ""
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomizePage;
