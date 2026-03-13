import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex items-center justify-center" style="height:200px">
      <canvas #chartCanvas></canvas>
      <div *ngIf="centerLabel" class="absolute pointer-events-none text-center">
        <p class="text-2xl font-extrabold text-slate-800 dark:text-white tabular-nums">{{ centerValue }}</p>
        <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ centerLabel }}</p>
      </div>
    </div>
  `,
})
export class DoughnutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = [];
  @Input() centerLabel = '';
  @Input() centerValue: string | number = '';

  private chart: Chart<'doughnut'> | null = null;

  ngAfterViewInit() {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.data;
      this.chart.data.datasets[0].backgroundColor = this.colors;
      this.chart.update('none');
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart() {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors,
            borderWidth: 2,
            borderColor: 'transparent',
            hoverBorderColor: 'white',
            hoverOffset: 4,
          },
        ],
      } as ChartData<'doughnut'>,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 600,
        },
      } as ChartOptions<'doughnut'>,
    });
  }
}
