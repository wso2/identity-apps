/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

module.exports = function() {
    function PreProcessor(options) {
        this.options = options || {};
    }

    function replaceVar(src, replaceVar, replaceValue) {
        var regex = "(?<=" + replaceVar + "?.:).*;";
        return src.replace(new RegExp(regex, "g"), " '" + replaceValue + "';");
    }

    PreProcessor.prototype.process = function(src, extra) {
        var fileElements = extra.fileInfo.filename.split('/');
        var newSrc = src;

        Object.keys(this.options).forEach(option => {
            var optionValue = this.options[option];

            if (typeof optionValue === 'object' && optionValue !== null) {
                if (fileElements[fileElements.length - 1] == optionValue.file) {
                    newSrc = replaceVar(src, option, optionValue.value);
                }
            } else if (typeof optionValue === 'string' && optionValue !== null) {
                newSrc = replaceVar(src, option, optionValue);
            };
        });

        return newSrc;
    };

    return PreProcessor;
}
