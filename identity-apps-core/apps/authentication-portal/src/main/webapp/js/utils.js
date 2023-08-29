/*
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";

/**
 * Scrolls to a target element with an offset.
 *
 * This function scrolls the page to a specified target element while applying an optional offset value.
 * If no offset is provided, the offset value is either calculated based on the specified offsetCalElementID
 * or set to zero if offsetCalElementID is not provided.
 *
 * @param {Event} event - The event triggering the scroll.
 * @param {number} offset - The optional offset value to apply during scrolling.
 * @param {string} offsetCalElementID - The ID of the element to calculate the offset from (if offset is not provided).
 */
function scrollToTargetElementWithOffset(event, offset, offsetCalElementID) {
    event.preventDefault();

    // Find the required offset
    if (offset == null) {
        if (offsetCalElementID != null) {
            var offsetElement = document.getElementById(offsetCalElementID);
            offset = offsetElement.getBoundingClientRect().top; // Distance from top to the offsetElement is the offset
        } else {
            offset = 0;
        }
    }

    // Find the target element position
    var targetElement = document.getElementById(event.target.getAttribute('href').slice(1));
    var targetElementPosition = targetElement.getBoundingClientRect().top;
    var offsetPosition = targetElementPosition - offset;

    // Scroll to a target element with the offset
    window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
    });
}
