/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement } from "react";
import { Placeholder } from "semantic-ui-react";

/**
 * Proptypes for the common fragment of login screen skeleton.
 */
export type CommonFragmentInterface = IdentifiableComponentInterface;

/**
 * Common fragment component for the branding preview of Sign In box.
 *
 * @param props - Props injected to the component.
 * @returns Common fragment component.
 */
const CommonFragment: FunctionComponent<CommonFragmentInterface> = (
    props: CommonFragmentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    return (
        <div data-componentid={ componentId }>
            <h3 className="ui header"></h3>

            <div className="segment-form">
                <div className="ui large form">
                    <div className="field m-0">
                        <Placeholder style={ { animation: "unset", height: "35px", width: "310px" } }>
                            <Placeholder.Image />
                        </Placeholder>
                    </div>

                    <div className="field mt-3 mb-0">
                        <Placeholder style={ { animation: "unset", height: "35px", width: "310px" } }>
                            <Placeholder.Image />
                        </Placeholder>
                    </div>

                    <div className="buttons mt-2">
                        <div className="field external-link-container text-small">
                            <Placeholder style={ { animation: "unset", height: "10px", width: "100px" } }>
                                <Placeholder.Image />
                            </Placeholder>
                        </div>
                    </div>

                    <div className="ui divider hidden"></div>

                    <div className="field external-link-container text-small">
                        <Placeholder style={ { animation: "unset", height: "20px", width: "200px" } }>
                            <Placeholder.Image />
                        </Placeholder>
                    </div>
                    <input
                        type="hidden"
                        name="sessionDataKey"
                    />
                    <div className="mt-0">
                        <div className="buttons">
                            <Placeholder style={ { animation: "unset", height: "40px", width: "315px" } }>
                                <Placeholder.Image />
                            </Placeholder>
                        </div>
                    </div>
                    <div className="mt-0">
                        <div className="buttons">
                            <Placeholder style={ { animation: "unset", height: "40px", width: "315px" } }>
                                <Placeholder.Image />
                            </Placeholder>
                        </div>
                    </div>
                </div>
                <div className="ui horizontal divider">
                    <Placeholder style={ { animation: "unset", height: "10px", width: "315px" } }>
                        <Placeholder.Image />
                    </Placeholder>
                </div>
                <div className="field">
                    <div className="ui vertical ui center aligned segment form">
                        <div className="social-login blurring social-dimmer">
                            <div className="field">
                                <Placeholder style={ { animation: "unset", height: "40px", width: "315px" } }>
                                    <Placeholder.Image />
                                </Placeholder>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
CommonFragment.defaultProps = {
    "data-componentid": "branding-preview-common-fragment"
};

export default CommonFragment;
