import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from '../area-chart/area-chart.component';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})
export class ColumnChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() dataToView: any;
  @Input() name: string = '';
  @Input() yTitle: string = '';

  constructor() {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    // Inizializza le opzioni del grafico
    this.chartOptions = {
      series: [
        {
          name: this.name,
          data: this.dataToView.values
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.dataToView.labels
      },
      yaxis: {
        title: {
          text: this.yTitle
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val.toString();
          }
        }
      }
    };
  }
}
