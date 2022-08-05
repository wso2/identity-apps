/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { render, screen } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { BrandingPreferenceMeta, PredefinedThemes } from "../../../meta";
import { ThemeSwatch } from "../theme-swatch";

describe("Test if the Theme Swatch component  is working as expected", () => {

    it("<ThemeSwatch /> renders properly", () => {
        render(
            <ThemeSwatch
                colors={ BrandingPreferenceMeta.getThemeSwatchConfigs(PredefinedThemes.LIGHT).colors }
                onClick={ () => null }
            />
        );

        expect(screen.getByTestId("theme-swatch")).toBeInTheDocument();
    });

    it("<ThemeSwatch /> matches snapshot", () => {
        const { container } = render(
            <ThemeSwatch
                colors={ BrandingPreferenceMeta.getThemeSwatchConfigs(PredefinedThemes.LIGHT).colors }
                onClick={ () => null }
            />
        );

        expect(container).toMatchSnapshot();
    });
});
