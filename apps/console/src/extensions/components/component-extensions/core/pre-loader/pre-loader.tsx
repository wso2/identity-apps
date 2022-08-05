/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Pre loader component props interface.
 */
type PreLoaderPropsInterface = TestableComponentInterface;

/**
 * Pre-Loader for the application.
 *
 * @param {PreLoaderPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const PreLoader: FunctionComponent<PreLoaderPropsInterface> = (
    props: PreLoaderPropsInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    return (
        <div className="pre-loader-wrapper" data-testid={ `${ testId }-wrapper` }>
            <div className="trifacta-pre-loader" data-testid={ testId }>
                <svg data-testid={ `${ testId }-svg` } xmlns="http://www.w3.org/2000/svg" width="67.56" height="58.476"
                     viewBox="0 0 67.56 58.476">
                    <g id="logo-only" transform="translate(-424.967 -306)">
                        <path id="_3" data-name="3"
                              d="M734.291,388.98l6.194,10.752-6.868,11.907h13.737l6.226,10.751H714.97Z"
                              transform="translate(-261.054 -82.98)" fill="#ff7300"/>
                        <path id="_2" data-name="2"
                              d="M705.95,422.391l6.227-10.751h13.736l-6.867-11.907,6.193-10.752,19.321,33.411Z"
                              transform="translate(-280.983 -82.98)" fill="#ff7300"/>
                        <path id="_1" data-name="1"
                              d="M736.65,430.2l-6.868-11.907-6.9,11.907H710.46l19.322-33.411L749.071,430.2Z"
                              transform="translate(-271.019 -65.725)" fill="#000"/>
                    </g>
                </svg>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
PreLoader.defaultProps = {
    "data-testid": "pre-loader"
};
