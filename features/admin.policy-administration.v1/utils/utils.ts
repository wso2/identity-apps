/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.
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

export const formatXML = (xml: string): string => {
    const PADDING: string = " ".repeat(4); // Customize the indentation.
    const regex: RegExp = /(>)(<)(\/*)/g;
    const formatted: string = xml.replace(regex, "$1\n$2$3");
    let pad: number = 0;

    return formatted
        .split("\n")
        .map((line: string) => {
            if (line.match(/<\/\w/)) pad -= 1;

            const indent: string = PADDING.repeat(pad);
            const formattedLine: string = `${indent}${line}`;

            if (line.match(/<\w[^>]*[^/]>.*$/)) pad += 1;

            return formattedLine;
        })
        .join("\n");
};
