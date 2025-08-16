/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Since we are using Chart.js from a CDN, we declare it to TypeScript.
declare var Chart: any;

interface ChartData {
    type: string;
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
        fill?: boolean;
        tension?: number;
    }[];
}

interface SectionData {
    title: string;
    narrative: string;
    chartData: ChartData;
}

interface StoryData {
    discovery: SectionData;
    origin: SectionData;
    crisis: SectionData;
    nexus: SectionData;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderStory();
});

async function fetchAndRenderStory() {
    try {
        const response = await fetch('data/story_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: StoryData = await response.json();

        renderSection('discovery', data.discovery);
        renderSection('origin', data.origin);
        renderSection('crisis', data.crisis);
        renderSection('nexus', data.nexus);

    } catch (error) {
        console.error("Failed to load story data:", error);
        // Display an error message to the user
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<div class="text-center text-red-500">Error loading story data. Please try again later.</div>`;
        }
    }
}

function renderSection(id: string, sectionData: SectionData) {
    const titleEl = document.getElementById(`${id}-title`);
    const narrativeEl = document.getElementById(`${id}-narrative`);
    const chartEl = document.getElementById(`${id}-chart`) as HTMLCanvasElement;

    if (titleEl) titleEl.textContent = sectionData.title;
    if (narrativeEl) narrativeEl.textContent = sectionData.narrative;
    if (chartEl) {
        createChart(chartEl, sectionData.chartData);
    }
}

function createChart(canvas: HTMLCanvasElement, chartData: ChartData) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Common styling for a dark, futuristic theme
    const options: any = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#9ca3af', // gray-400
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            },
            tooltip: {
                titleFont: { family: "'Orbitron', sans-serif" },
                bodyFont: { family: "'Inter', sans-serif" },
            }
        },
        scales: {
            x: {
                ticks: { color: '#6b7280' /* gray-500 */, font: { family: "'Inter', sans-serif" } },
                grid: { color: '#374151' /* gray-700 */ }
            },
            y: {
                ticks: { color: '#6b7280' /* gray-500 */, font: { family: "'Inter', sans-serif" } },
                grid: { color: '#374151' /* gray-700 */ }
            }
        }
    };
    
    // Specific options for radar charts
    if (chartData.type === 'radar') {
        options.scales = {
            r: {
                angleLines: { color: '#374151' },
                grid: { color: '#374151' },
                pointLabels: {
                    color: '#9ca3af',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                },
                ticks: {
                    color: '#6b7280',
                    backdropColor: 'transparent'
                }
            }
        };
    }
    
    // Specific options for doughnut charts (remove scales)
    if (chartData.type === 'doughnut') {
       delete options.scales;
    }


    new Chart(ctx, {
        type: chartData.type,
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets,
        },
        options: options
    });
}
