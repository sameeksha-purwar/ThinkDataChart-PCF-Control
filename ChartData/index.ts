import {IInputs, IOutputs} from "./generated/ManifestTypes";
import 'chart.js';
import { Chart, CategoryScale, LinearScale, BarController,
     BarElement, LineController, LineElement ,
     PieController,ArcElement,PointElement,ChartTypeRegistry,
      RadarController,RadialLinearScale } from "chart.js";
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);


export class ThinkChartData implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private contextObj: ComponentFramework.Context<IInputs>;
    private chartContainer: HTMLDivElement;
    private _chart: Chart;
    private statuselement: string[] = []; 
    private countvalues:number[]=[];
    private value: string; 
    private chartType: keyof ChartTypeRegistry; 

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.contextObj = context;
        this.chartContainer = document.createElement("div");
        container.appendChild(this.chartContainer);
        Chart.register(CategoryScale, LinearScale, BarController, BarElement,LineController, LineElement,PieController,ArcElement,PointElement,RadarController,RadialLinearScale);
        this.value = context.parameters.value.raw || "statuscode";
        this.chartType = (context.parameters.chartType.raw as keyof ChartTypeRegistry);

        this.updateView(context);
    }
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.statuselement = [];
    this.countvalues = [];
        this.contextObj = context;
        if (!context.parameters.smartGridDataSet.loading) {
            const gridParam = context.parameters.smartGridDataSet;
            const statusCountMap = new Map<string, number>();

            gridParam.sortedRecordIds.forEach((recordId: string | number) => {
                const statusValue = gridParam.records[recordId].getFormattedValue(this.value);
                let currentValue = statusCountMap.get(statusValue) || 0;
                currentValue += 1; 
                statusCountMap.set(statusValue,currentValue);
            });
            statusCountMap.forEach((countValue, status) => {
                this.statuselement.push(status)
                this.countvalues.push(countValue);
        });
        this.renderChart(context);
    }}
    private renderChart(context: ComponentFramework.Context<IInputs>): void {
        this.chartContainer.innerHTML = ''; 
        this.chartContainer.id = "chartContainer";
        const heading = document.createElement('h2');
        heading.textContent = context.parameters.chartTitle.raw; 
        this.chartContainer.appendChild(heading);
        const canvas = document.createElement('canvas');
       
        this.chartContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        if (ctx) {
			if (this._chart) {
				this._chart.destroy();
			}
			const uniqueStatus = Array.from(new Set(this.statuselement));
            this._chart = new Chart(ctx, {
                type: this.chartType,
                data: {
                    labels: uniqueStatus,
                    datasets: [{
                        label: 'Opportunity Status', // Label for the dataset
                        data:this.countvalues ,
                        backgroundColor: [ 'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',],
                        borderColor: [ 'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',],
                        borderWidth:1,
                        fill:true,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        datalabels: this.chartType === 'doughnut' || this.chartType === 'pie'?{
                            anchor: 'center',
                            align: 'end',
                            color: 'black',
                            display: 'auto',
                            font: {
                                weight: 'bold',
                                size: 16,
                            },
                            formatter: (value,ctx) => {
                                const label=ctx.chart.data.labels
                                if(label){
                                    const labeldata=label[ctx.dataIndex]
                                    return labeldata + '\n' +'  '+ value; 

                                }
                                return value

                            },
                            offset: -6,
                        }: 
                        {
                            anchor: 'end',
                            align: 'end',
                            color: 'black',
                            display: 'auto',
                            font: {
                                weight: 'bold',
                                size: 16,
                            },
                            formatter: (value) => value,
                            offset: -13,
                        }
                    }
                }
            });
        } else {
            console.error("Canvas context is null.");
        }
    }
    public getOutputs(): IOutputs {
        return {};
    }
    public destroy(): void {
        if (this._chart) {
            this._chart.destroy();
        }
    }
}
