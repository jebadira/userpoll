declare interface IUserPollStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  PropertyPanePollLabel : string;
  PropertyPaneLibraryLabel: string;

}

declare module 'userPollStrings' {
  const strings: IUserPollStrings;
  export = strings;
}
