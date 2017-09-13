import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import * as strings from 'userPollStrings';
//var PollContainer = require("./dist/scripts/main.bundle.js");
import * as PollContainer from './dist/scripts/7b7b360225a24f25928d8c1b67aa74b1.js';
import { IUserPollWebPartProps } from './IUserPollWebPartProps';

export default class UserPollWebPart extends BaseClientSideWebPart<IUserPollWebPartProps> {

  public render(): void {
    const element = React.createElement(
      PollContainer.default,
      {
        description: this.properties.description,
        context : this.context,
        poll : this.properties.poll,
        library : this.properties.library
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    debugger;
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("library", {
                  label : strings.PropertyPaneLibraryLabel
                }),
                PropertyPaneTextField("poll", {
                  label: strings.PropertyPanePollLabel,
                  
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
