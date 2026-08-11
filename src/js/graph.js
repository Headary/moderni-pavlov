/**
 * graph.js - Budget Chart Renderer for Moderní Pavlov
 * Reads budget data from data-budget-chart attribute of div#budgetChart
 * and renders a horizontal bar chart using Chart.js with bar labels (name & percentage).
 */
(function () {
    function formatCurrency(value) {
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            maximumFractionDigits: 2,
        }).format(value);
    }

    function formatMillions(value) {
        if (Math.abs(value) >= 1000000) {
            return (value / 1000000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) + ' mil. Kč';
        }
        return value.toLocaleString('cs-CZ') + ' Kč';
    }

    function extractRadekData(inputData) {
        if (!inputData) return [];
        if (typeof inputData === 'string') {
            try {
                inputData = JSON.parse(inputData);
            } catch (e) {
                console.error('[graph.js] Error parsing budget data JSON:', e);
                return [];
            }
        }
        if (Array.isArray(inputData)) return inputData;
        if (Array.isArray(inputData.Radek)) return inputData.Radek;
        if (inputData.RekapitulacePrijmyVydaje && Array.isArray(inputData.RekapitulacePrijmyVydaje.Radek)) {
            return inputData.RekapitulacePrijmyVydaje.Radek;
        }
        return [];
    }

    function renderBudgetChart(containerOrCanvas, rawData, customOptions) {
        let container = typeof containerOrCanvas === 'string'
            ? document.getElementById(containerOrCanvas) || document.querySelector(containerOrCanvas)
            : containerOrCanvas;

        if (!container) {
            container = document.getElementById('budgetChart') || document.querySelector('[data-budget-chart]');
        }

        if (!container) {
            console.error('[graph.js] Target element for budget chart not found.');
            return null;
        }

        // If rawData is not passed directly, try reading from data-budget-chart attribute
        if (!rawData) {
            const attrData = container.getAttribute('data-budget-chart');
            if (attrData) {
                rawData = attrData;
            }
        }

        const radek = extractRadekData(rawData);
        if (!radek.length) {
            console.warn('[graph.js] No budget Radek data found to render chart.');
            return null;
        }

        // Locate or create canvas element inside target element if container is div
        let canvas;
        if (container.tagName.toLowerCase() === 'canvas') {
            canvas = container;
        } else {
            canvas = container.querySelector('canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                container.appendChild(canvas);
            }
        }

        const item4050 = radek.find(function (r) { return String(r.RadekCislo).trim() === '4050'; }) || {};
        const item4240 = radek.find(function (r) { return String(r.RadekCislo).trim() === '4240'; }) || {};

        const parseNum = function (val) { return parseFloat(val) || 0; };

        const prijmy = {
            code: '4050',
            name: 'Příjmy celkem',
            schvaleny: parseNum(item4050.RozpocetSchvaleny),
            poZmenach: parseNum(item4050.RozpocetPoZmenach),
            vysledek: parseNum(item4050.Vysledek),
        };

        const vydaje = {
            code: '4240',
            name: 'Výdaje celkem',
            schvaleny: parseNum(item4240.RozpocetSchvaleny),
            poZmenach: parseNum(item4240.RozpocetPoZmenach),
            vysledek: parseNum(item4240.Vysledek),
        };

        prijmy.pct = prijmy.poZmenach > 0 ? (prijmy.vysledek / prijmy.poZmenach) * 100 : 0;
        vydaje.pct = vydaje.poZmenach > 0 ? (vydaje.vysledek / vydaje.poZmenach) * 100 : 0;

        // Shades of Green for Příjmy, Red for Výdaje
        const colors = {
            schvaleny: {
                bg: ['rgba(34, 197, 94, 0.45)', 'rgba(239, 68, 68, 0.45)'],
                border: ['#16a34a', '#dc2626'],
            },
            poZmenach: {
                bg: ['rgba(34, 197, 94, 0.75)', 'rgba(239, 68, 68, 0.75)'],
                border: ['#16a34a', '#dc2626'],
            },
            vysledek: {
                bg: ['rgba(21, 128, 61, 1.0)', 'rgba(185, 28, 28, 1.0)'],
                border: ['#14532d', '#7f1d1d'],
            },
        };

        const ChartLib = window.Chart;
        if (!ChartLib) {
            console.error('[graph.js] Chart.js (window.Chart) is not loaded.');
            return null;
        }

        const options = customOptions || {};

        // Custom plugin to render name and percentage labels directly on the bars
        const barLabelsPlugin = {
            id: 'barLabelsPlugin',
            afterDatasetsDraw: function (chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = 'bold 11px sans-serif';

                const shortNames = ['Schválený', 'Po změnách', 'Výsledek'];

                chart.data.datasets.forEach(function (dataset, datasetIndex) {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (meta.hidden) return;

                    meta.data.forEach(function (bar, dataIndex) {
                        const item = dataIndex === 0 ? prijmy : vydaje;
                        const val = dataset.data[dataIndex];
                        if (val === undefined || val === null) return;

                        let pctText = '';
                        if (item.poZmenach > 0) {
                            const pct = (val / item.poZmenach) * 100;
                            pctText = pct.toFixed(1).replace('.', ',') + ' %';
                        }

                        const name = shortNames[datasetIndex] || dataset.label;
                        const labelText = name + ' (' + pctText + ')';

                        const barWidth = Math.abs(bar.x - bar.base);
                        const textWidth = ctx.measureText(labelText).width;

                        if (barWidth > textWidth + 20) {
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(labelText, bar.x - 8, bar.y);
                        } else {
                            ctx.fillStyle = '#222222';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(labelText, bar.x + 6, bar.y);
                        }
                    });
                });

                ctx.restore();
            }
        };

        const chartConfig = {
            type: 'bar',
            data: {
                labels: [
                    'Příjmy celkem (' + prijmy.code + ')',
                    'Výdaje celkem (' + vydaje.code + ')',
                ],
                datasets: [
                    {
                        label: 'Rozpočet schválený',
                        data: [prijmy.schvaleny, vydaje.schvaleny],
                        backgroundColor: colors.schvaleny.bg,
                        borderColor: colors.schvaleny.border,
                        borderWidth: 1.5,
                        borderRadius: 4,
                    },
                    {
                        label: 'Rozpočet po změnách',
                        data: [prijmy.poZmenach, vydaje.poZmenach],
                        backgroundColor: colors.poZmenach.bg,
                        borderColor: colors.poZmenach.border,
                        borderWidth: 1.5,
                        borderRadius: 4,
                    },
                    {
                        label: 'Výsledek od počátku roku',
                        data: [prijmy.vysledek, vydaje.vysledek],
                        backgroundColor: colors.vysledek.bg,
                        borderColor: colors.vysledek.border,
                        borderWidth: 1.5,
                        borderRadius: 4,
                    },
                ],
            },
            plugins: [barLabelsPlugin],
            options: Object.assign({
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        right: 90,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Rekapitulace příjmů a výdajů rozpočtu',
                        font: { size: 16, weight: 'bold' },
                        padding: { top: 10, bottom: 5 },
                    },
                    subtitle: {
                        display: true,
                        text: 'Plnění příjmů: ' + prijmy.pct.toFixed(2).replace('.', ',') + ' % | Plnění výdajů: ' + vydaje.pct.toFixed(2).replace('.', ',') + ' % (Výsledek / Rozpočet po změnách)',
                        font: { size: 13 },
                        padding: { bottom: 15 },
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const rawValue = context.raw;
                                const formattedValue = formatCurrency(rawValue);
                                const datasetLabel = context.dataset.label || '';
                                let line = datasetLabel + ': ' + formattedValue;

                                const item = context.dataIndex === 0 ? prijmy : vydaje;
                                if (item.poZmenach > 0) {
                                    const pct = (rawValue / item.poZmenach) * 100;
                                    line += ' (' + pct.toFixed(2).replace('.', ',') + ' % z rozpočtu po změnách)';
                                }

                                return line;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) { return formatMillions(value); },
                        },
                        title: {
                            display: true,
                            text: 'Částka v Kč',
                            font: { weight: 'bold' },
                        },
                    },
                    y: {
                        ticks: {
                            font: { size: 13, weight: 'bold' },
                        },
                    },
                },
            }, options),
        };

        return new ChartLib(canvas, chartConfig);
    }

    // Expose global functions to window
    window.renderBudgetChart = renderBudgetChart;
    window.extractRadekData = extractRadekData;

    // Auto-run on DOMContentLoaded if budgetChart element is present
    document.addEventListener('DOMContentLoaded', function () {
        const budgetElem = document.getElementById('budgetChart') || document.querySelector('[data-budget-chart]');
        if (budgetElem) {
            renderBudgetChart(budgetElem);
        }
    });
})();
