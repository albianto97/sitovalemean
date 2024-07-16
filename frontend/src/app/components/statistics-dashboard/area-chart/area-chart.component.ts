import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; // ApexMarkers;
  stroke: any; // ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

declare global {
  interface Window {
    Apex: any;
  }
}

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit, OnChanges {
  @Input() total: number = 0;
  @Input() data!: number[];
  @Input() label: string = '';
  public chartOptions: Partial<ChartOptions> | undefined;
  public chartAreaSparkline1Options: Partial<ChartOptions> | undefined;

  public commonAreaSparlineOptions: Partial<ChartOptions> = {
    chart: {
      type: "area",
      height: 160,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      curve: "straight"
    },
    fill: {
      opacity: 0.3
    },
    yaxis: {
      min: 0
    }
  };

  public commonLineSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: "line",
      width: 100,
      height: 35,
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  public commonBarSparklineOptions: Partial<ChartOptions> = {
    chart: {
      type: "bar",
      width: 100,
      height: 35,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "80%"
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  constructor() {}

  // Metodo chiamato quando i valori di input cambiano
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['total']) {
      this.initializeGraph();
    }
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.initializeGraph();
  }

  // Metodo per inizializzare il grafico
  initializeGraph(): void {
    window.Apex = {
      stroke: {
        width: 3
      },
      markers: {
        size: 0
      },
      tooltip: {
        fixed: {
          enabled: true
        }
      }
    };

    this.chartAreaSparkline1Options = {
      series: [
        {
          name: this.label,
          data: this.data
        }
      ],
      colors: ["#DCE6EC"],
      title: {
        text: "€" + this.total.toFixed(2),
        offsetX: 0,
        style: {
          fontSize: "24px"
        }
      },
      subtitle: {
        text: this.label,
        offsetX: 0,
        style: {
          fontSize: "14px"
        }
      }
    };
  }

}
