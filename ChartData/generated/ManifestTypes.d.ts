/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    chartType: ComponentFramework.PropertyTypes.EnumProperty<"radar" | "bar" | "pie" | "line" | "doughnut">;
    chartTitle: ComponentFramework.PropertyTypes.StringProperty;
    value: ComponentFramework.PropertyTypes.StringProperty;
    smartGridDataSet: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
}
