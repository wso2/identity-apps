/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

 import { TestableComponentInterface } from "@wso2is/core/models";
 import classNames from "classnames";
 import React, { FunctionComponent, ReactElement } from "react";
 import { Card, CardProps, Popup } from "semantic-ui-react";
 import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
 
 /**
  * Proptypes for the app switch card component.
  */
 export interface AppSwitchCardPropsInterface extends TestableComponentInterface {
     /**
      * Card Background color.
      */
     background?: "transparent" | "default";
     /**
      * If a bottom margin should be added.
      */
     bottomMargin?: boolean;
     /**
      * Additional classes.
      */
     className?: string;
     /**
      * Id for the card.
      */
     id?: string;
     /**
      * Image to be displayed.
      */
     image: any;
     /**
      * Icon options.
      */
     imageOptions?: Omit<GenericIconProps, "icon" | "size">;
     /**
      * Size of the image.
      */
     imageSize?: GenericIconSizes;
     /**
      * Label of the card.
      */
     label: string;
     /**
      * Label ellipsis.
      */
     labelEllipsis?: boolean;
     /**
      * On click callback for the element.
      */
     onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void;     
 }
 
 /**
  * App switch card component.
  *
  * @param {AppSwitchCardPropsInterface} props - Props injected to the components.
  *
  * @return {React.ReactElement}
  */
 export const AppSwitchCard: FunctionComponent<AppSwitchCardPropsInterface> = (
     props: AppSwitchCardPropsInterface
 ): ReactElement => {
 
     const {
         background,
         bottomMargin,
         className,
         id,
         image,
         imageOptions,
         imageSize,
         label,
         labelEllipsis,
         onClick,
         [ "data-testid" ]: testId
     } = props;
 
     const wrapperClasses = classNames(
         "app-switch-card-wrapper",
         className
     );
 
     const cardClasses = classNames(
         "app-switch-card",
         {
             [ `background-${ background }` ]: background
         }
     );
  
     return (
         <div className={ wrapperClasses } data-testid={ `${ testId }-wrapper` }>
             <Card
                 id={ id }
                 as="div"
                 className={ cardClasses }
                 onClick={ onClick }
                 link={ false }
                 data-testid={ `${ testId }-card` }
             >
                 <Card.Content className="card-image-container">
                     <GenericIcon
                         className="card-image"
                         size={ imageSize }
                         icon={ image }
                         data-testid={ `${ testId }-image` }
                         square
                         transparent
                         { ...imageOptions }
                     />
                 </Card.Content>
             </Card>
             <Popup
                 disabled={ !labelEllipsis }
                 trigger={ <div className={ "card-label" }>{ label }</div> }
                 position="bottom center"
                 content={ label }
                 data-testid={ `${ testId }-label` }
                 inverted
             />
         </div>
     );
 };
 
 /**
  * Default props for the app switch card component.
  */
AppSwitchCard.defaultProps = {
     background: "default",
     bottomMargin: true,
     "data-testid": "app-switch-card",
     imageSize: "mini",
     onClick: () => null
 };

