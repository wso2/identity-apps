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
    if (!xml || typeof xml !== "string") {
        console.warn("Invalid XML input for formatting.");
        return xml || "";
    }

    const PADDING: string = " ".repeat(4); // Indentation level
    const regex: RegExp = /(>)(<)(\/*)/g;

    try {
        // Add line breaks between tags
        const formatted = xml.replace(regex, "$1\n$2$3");

        // Detect if already formatted (basic check for line breaks and indentation)
        const alreadyFormatted = formatted.split("\n").some((line) => line.startsWith(PADDING));

        if (alreadyFormatted) {
            return xml; // Return unmodified if already formatted
        }

        let pad = 0;

        return formatted
            .split("\n")
            .map((line: string) => {
                if (line.match(/<\/\w/)) pad -= 1;

                const indent = PADDING.repeat(Math.max(pad, 0));
                const formattedLine = `${indent}${line}`;

                if (line.match(/<\w[^>]*[^/]>.*$/)) pad += 1;

                return formattedLine;
            })
            .join("\n");
    } catch (error) {
        console.error("Error formatting XML:", error);
        return xml; // Return raw XML in case of errors
    }
};

export const unformatXML = (xml: string): string => {
    if (!xml || typeof xml !== "string") {
        console.warn("Invalid XML input for unformatting.");
        return xml || "";
    }

    try {
        // Remove all line breaks, tabs, and excessive spaces
        return xml
            .replace(/>\s+</g, "><") // Remove spaces between tags
            .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
            .trim(); // Remove leading/trailing spaces
    } catch (error) {
        console.error("Error unformatting XML:", error);
        return xml; // Return the original XML if unformatting fails
    }
};

