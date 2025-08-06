/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React from "react";
import { Image } from "semantic-ui-react";
import "./image-field-adapter.css";

const ImageFieldAdapter = ({ component }) => {
    const { variant, config } = component;

    switch (variant) {
        case "IMAGE_BLOCK":
            return (
                <div className="image-container">
                    <Image
                        src={ config.src }
                        alt={ config.alt || "Image" }
                        className="responsive-image"
                        fluid
                    />
                </div>
            );
        default:
            return null;
    }
};

ImageFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired
};

export default ImageFieldAdapter;
