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

import { Button, Divider, Form, Grid, Header, Label } from "semantic-ui-react";
import React, { ReactElement, useContext, useState } from "react";
import { RGBColor, SketchPicker } from "react-color";
import { defaultThemeVariables } from "@wso2is/theme";
import { ThemeContext } from "@wso2is/react-components";

/**
 * Util method to convert hex color code string to RGBA color object.
 *
 * @param {string} hex - Color code. E.g. "#000000"
 * @param {number} [alpha] - Alpha (opacity) value. E.g. 0-1
 * 
 * @returns {object} RGBA color value
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
 * @interface ColorPickerProps.
 */
interface ColorPickerProps {
    inputColor: string;
    inputOnChangeHandler: (hexValue: string) => void;
    name: string;
    placeholder: string;
}

/**
 * ColorPicker ReactComponent.
 *
 * @param {RGBColor} { inputColor } - Input color.
 * 
 * @returns {ReactElement}
 */
const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({
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

    const handleClick = () => {
        setValue({ ...value, displayColorPicker: !value.displayColorPicker });
    };

    const handleClose = () => {
        setValue({ ...value, displayColorPicker: false });
    };

    const handleChange = (color) => {
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

    const handleInputChange = (e) => {
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
            <input value={ value.color.hex } onChange={ (e) => { handleInputChange(e) } } />
            { value.displayColorPicker ? 
                <div className="ui react-color-popover">
                    <div className="ui react-color-cover" onClick={ handleClose } />
                    <SketchPicker color={ hexToRGB(inputColor) } onChange={ handleChange } />
                </div>
                : null
            }
        </div>
    );
};

const CSSForm = (): ReactElement => {
    const [ themeOptions, setThemeOptions ] = useState({});
    const { compile } = useContext(ThemeContext);

    const handleColorInputChange = (input, value) => {
        setThemeOptions({...themeOptions, ["@" + input]: value });
    };

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

        const handleChange = (e) => {
            setValue(e.target.value);
            handleColorInputChange(input, value);
        };

        const inputProps = {
            name: input,
            onChange: handleChange,
            placeholder: ("E.g. " + initialValue),
            value
        };

        const handleColorPickerOnChange = (hexValue: string) => {
            setValue(hexValue);
        };

        const colorChildren = () => {
            return (
                <>
                    <ColorPicker
                        name={ input }
                        placeholder={ "E.g. " + initialValue }
                        inputColor={ value }
                        inputOnChangeHandler={ handleColorPickerOnChange }
                    />
                </>
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
    const pageBackground = useStyleInput(defaultThemeVariables["pageBackground"], "pageBackground", "color");

    const handleCompileTheme = async () => {
        await compile(themeOptions);
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
 * @return {ReactElement}
 */
export const CustomizePage = (): ReactElement => {

    const { setAppName, setCopyrightText, setLogo, setProductName, setTheme, state } = useContext(ThemeContext);

    const handleToggleTheme = () => {
        if (state.theme === "dark") {
            setTheme("default");
        }
        else {
            setTheme("dark");
        }
    };

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };

    const handleLogoChange = (e) => {
        setLogo(e.target.value);
    };

    const handleCopyrightTextChange = (e) => {
        setCopyrightText(e.target.value);
    };

    const handleAppNameChange = (e) => {
        setAppName(e.target.value);
    };

    return (
        <>
            <Header className="page-header" as="h1">
                Customize Application
                <Header.Subheader className="sub-header">
                    Use below fields to customize the theme
                </Header.Subheader>
            </Header>

            <Divider hidden />

            <Header as="h3" className="sub-header">Change base theme</Header>
            <Divider />

            <Button onClick={ () => handleToggleTheme() }>Toggle Theme</Button>

            <Divider hidden />

            <Header as="h3" className="sub-header">Change theme colors</Header>
            <Divider />

            <CSSForm />

            <Header as="h3" className="sub-header">Change product details</Header>
            <Divider />

            <Form>
                <Form.Field>
                    <label>Application Name</label>
                    <Grid columns={ 4 }>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    value={ state.appName }
                                    onChange={ (e) => handleAppNameChange(e) }
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
                                    onChange={ (e) => handleProductNameChange(e) }
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
                                    onChange={ (e) => handleLogoChange(e) }
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
                                    onChange={ (e) => handleCopyrightTextChange(e) }
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
    inputOnChangeHandler: () => { return },
    name: "",
    placeholder: ""
}
