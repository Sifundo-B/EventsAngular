import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  totalSales: number = 0;
  salesByEvent: { [key: string]: number } = {};
  ticketsRemainingByEvent: { [key: string]: number } = {};

  userTickets: any[] = [];
  today: string = new Date().toISOString().substring(0, 3);
  private salesChart: Chart | null = null;
  private ticketsChart: Chart | null = null;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Set default date range (e.g., last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.startDate = sevenDaysAgo.toISOString().substring(0, 10);
    this.endDate = today.toISOString().substring(0, 10);

    this.authService.getUserId().subscribe(
      (organizerId) => {
        this.fetchAnalytics(organizerId);
        this.fetchUserTicketHistory(organizerId);

        // Listen for analytics refresh events
        this.analyticsService.analytics$.subscribe(() => {
          this.fetchAnalytics(organizerId);
        });
      },
      (error) => {
        console.error('Failed to fetch user ID', error);
      }
    );
  }

  fetchAnalytics(organizerId: number): void {
    if (this.startDate && this.endDate) {
      const formattedStartDate = new Date(this.startDate).toISOString();
      const formattedEndDate = new Date(this.endDate).toISOString();

      this.analyticsService.getSalesAnalytics(organizerId, formattedStartDate, formattedEndDate).subscribe(
        data => {
          this.totalSales = data.totalSales || 0;
          this.salesByEvent = data.salesByEvent || {};
          this.ticketsRemainingByEvent = data.ticketsRemainingByEvent || {};

          this.updateCharts();
        },
        error => {
          console.error('Error fetching sales analytics', error);
        }
      );
    } else {
      console.warn('Start date and end date must be set');
    }
  }

  fetchUserTicketHistory(userId: number): void {
    this.analyticsService.getUserTicketHistory(userId).subscribe(
      data => {
        this.userTickets = data || [];
      },
      error => {
        console.error('Error fetching ticket history', error);
      }
    );
  }

  updateAnalytics(): void {
    this.authService.getUserId().subscribe(
      (organizerId) => {
        this.fetchAnalytics(organizerId);
      },
      (error) => {
        console.error('Failed to fetch user ID', error);
      }
    );
  }

  private updateCharts(): void {
    this.renderLineChart(
      'salesByEventChart',
      this.salesByEvent,
      'Sales by Event',
      this.salesChart
    );

    this.renderLineChart(
      'ticketsRemainingByEventChart',
      this.ticketsRemainingByEvent,
      'Tickets Remaining by Event',
      this.ticketsChart
    );
  }

  private renderLineChart(
    canvasId: string,
    data: { [key: string]: number },
    label: string,
    chartInstance: Chart | null
  ): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: values,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Event',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Count',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    const newChartInstance = new Chart(canvas, chartConfig);

    if (label === 'Sales by Event') {
      this.salesChart = newChartInstance;
    } else if (label === 'Tickets Remaining by Event') {
      this.ticketsChart = newChartInstance;
    }
  }
}
