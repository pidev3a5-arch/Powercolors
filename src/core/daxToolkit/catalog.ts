import { DaxCategoryMeta, DaxTemplate } from './types';

export const DAX_CATEGORIES: DaxCategoryMeta[] = [
  {
    id: 'time-intelligence',
    label: 'Time Intelligence',
    description: 'YTD, MTD, YoY growth, rolling moving averages, and prior period comparisons.',
    iconName: 'Calendar',
  },
  {
    id: 'rankings-pareto',
    label: 'Rankings & Pareto',
    description: 'Dynamic Top N, 80/20 cumulative contribution, and Category % of Total.',
    iconName: 'Award',
  },
  {
    id: 'dynamic-titles',
    label: 'Dynamic Titles & Text',
    description: 'Header text reflecting active slicers, date ranges, and selected metrics.',
    iconName: 'Type',
  },
  {
    id: 'kpi-logic',
    label: 'KPI & Variance Logic',
    description: 'Actual vs Target variances, status flags, Unicode arrows, and run-rates.',
    iconName: 'Target',
  },
  {
    id: 'conditional-formatting',
    label: 'Conditional Formatting',
    description: 'Hex color codes for visual element conditional formatting by rule or threshold.',
    iconName: 'Palette',
  },
  {
    id: 'metric-switching',
    label: 'Metric & Currency Switchers',
    description: 'Disconnected slicer tables driving multi-metric or multi-currency charts.',
    iconName: 'Sliders',
  },
];

export const DAX_CATALOG: DaxTemplate[] = [
  // =========================================================================
  // 1. TIME INTELLIGENCE
  // =========================================================================
  {
    id: 'ytd-measure',
    name: 'Year-to-Date (YTD)',
    category: 'time-intelligence',
    description: 'Standard calendar YTD accumulation utilizing TOTALYTD with context transition.',
    difficulty: 'Beginner',
    tags: ['YTD', 'time-intelligence', 'dates', 'total'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Card, KPI visual, or Line chart',
      formatString: '$#,##0;($#,##0);"-"',
      performanceNote: 'TOTALYTD is highly optimized for contiguous Date dimension tables.',
      bestPractice: 'Always pass a marked Date table column to the second argument.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales YTD', defaultValue: 'Sales YTD', description: 'Name of the calculated measure', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'The numeric measure to accumulate', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Contiguous calendar date field', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    TOTALYTD(
        {{base_measure}},
        {{date_column}}
    )
RETURN
    _Result`,
  },
  {
    id: 'mtd-measure',
    name: 'Month-to-Date (MTD)',
    category: 'time-intelligence',
    description: 'Month-to-date accumulation from the 1st of the active month to current date.',
    difficulty: 'Beginner',
    tags: ['MTD', 'month', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Executive BAN Card',
      formatString: '#,##0',
      performanceNote: 'Instant evaluation on DirectQuery and Import models.',
      bestPractice: 'Ensure the Date table has no gaps or duplicate dates.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Orders MTD', defaultValue: 'Orders MTD', description: 'Name of the calculated measure', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Orders]', defaultValue: '[Total Orders]', description: 'Base measure to aggregate', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    TOTALMTD(
        {{base_measure}},
        {{date_column}}
    )
RETURN
    _Result`,
  },
  {
    id: 'qtd-measure',
    name: 'Quarter-to-Date (QTD)',
    category: 'time-intelligence',
    description: 'Accumulates data from the beginning of the active quarter to current date.',
    difficulty: 'Beginner',
    tags: ['QTD', 'quarter', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Area or Line Chart',
      formatString: '$#,##0',
      performanceNote: 'Uses internal QTD date ranges mapped from your Date table.',
      bestPractice: 'Works seamlessly with standard 4-quarter calendars.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Revenue QTD', defaultValue: 'Revenue QTD', description: 'Name of the calculated measure', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Revenue]', defaultValue: '[Total Revenue]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    TOTALQTD(
        {{base_measure}},
        {{date_column}}
    )
RETURN
    _Result`,
  },
  {
    id: 'sply-measure',
    name: 'Same Period Last Year (SPLY)',
    category: 'time-intelligence',
    description: 'Evaluates the base measure for the identical period shifted by exactly 1 year.',
    difficulty: 'Intermediate',
    tags: ['SPLY', 'prior-year', 'comparison', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Clustered Column or Dual-Line Chart',
      formatString: '$#,##0',
      performanceNote: 'SAMEPERIODLASTYEAR leverages formula engine caching efficiently.',
      bestPractice: 'Ensure your Date dimension covers the full previous calendar year.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales SPLY', defaultValue: 'Sales SPLY', description: 'Name of the measure', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Current period measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    CALCULATE(
        {{base_measure}},
        SAMEPERIODLASTYEAR({{date_column}})
    )
RETURN
    _Result`,
  },
  {
    id: 'yoy-variance-measure',
    name: 'Year-over-Year (YoY) Change',
    category: 'time-intelligence',
    description: 'Computes the absolute difference between the current period and same period last year.',
    difficulty: 'Intermediate',
    tags: ['YoY', 'variance', 'growth', 'delta'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Waterfall chart or KPI Card',
      formatString: '+$#,##0;-$#,##0;"$0"',
      performanceNote: 'Stores SPLY in a VAR so the prior year measure is evaluated only once.',
      bestPractice: 'Use a conditional format color to highlight positive vs negative deltas.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales YoY Change', defaultValue: 'Sales YoY Change', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Current = {{base_measure}}
VAR _Prior =
    CALCULATE(
        {{base_measure}},
        SAMEPERIODLASTYEAR({{date_column}})
    )
VAR _YoYDelta =
    IF(
        NOT ISBLANK(_Current) && NOT ISBLANK(_Prior),
        _Current - _Prior
    )
RETURN
    _YoYDelta`,
  },
  {
    id: 'yoy-growth-pct',
    name: 'Year-over-Year (YoY) Growth %',
    category: 'time-intelligence',
    description: 'Percentage growth vs prior year, safely guarded against zero-division.',
    difficulty: 'Intermediate',
    tags: ['YoY %', 'percentage', 'growth', 'time-intelligence'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'KPI visual subtitle or Table / Matrix',
      formatString: '+0.0%;-0.0%;"0.0%"',
      performanceNote: 'Uses DIVIDE to gracefully return BLANK() if prior year is 0 or null.',
      bestPractice: 'Set format string with explicit plus and minus signs for clarity.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales YoY %', defaultValue: 'Sales YoY %', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Current = {{base_measure}}
VAR _Prior =
    CALCULATE(
        {{base_measure}},
        SAMEPERIODLASTYEAR({{date_column}})
    )
VAR _YoYPct =
    DIVIDE(_Current - _Prior, _Prior)
RETURN
    _YoYPct`,
  },
  {
    id: 'rolling-30d-avg',
    name: '30-Day Rolling Moving Average',
    category: 'time-intelligence',
    description: 'Smooths out weekend or daily fluctuations with a 30-day backward rolling window.',
    difficulty: 'Intermediate',
    tags: ['rolling', 'moving-average', 'trend', 'smoothing'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Line chart with daily date on X-axis',
      formatString: '#,##0.0',
      performanceNote: 'DATESINPERIOD runs efficiently inside storage engine.',
      bestPractice: 'Check that MAX(Date) is not in the future.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales 30D Moving Avg', defaultValue: 'Sales 30D Moving Avg', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Measure to smooth', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _LastDate = MAX({{date_column}})
VAR _RollingPeriod =
    DATESINPERIOD(
        {{date_column}},
        _LastDate,
        -30,
        DAY
    )
VAR _Result =
    CALCULATE(
        AVERAGEX(
            VALUES({{date_column}}),
            {{base_measure}}
        ),
        _RollingPeriod
    )
RETURN
    _Result`,
  },
  {
    id: 'rolling-3m-sum',
    name: '3-Month Rolling Total',
    category: 'time-intelligence',
    description: 'Rolling 3-month trailing total for quarterly smoothing and seasonality tracking.',
    difficulty: 'Intermediate',
    tags: ['rolling', '3-month', 'trailing', 'trend'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Clustered Column or Area Chart',
      formatString: '$#,##0',
      performanceNote: 'Calculates over an explicit DATESINPERIOD set.',
      bestPractice: 'Ensure the Date table has marked Month periods.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales 3M Rolling', defaultValue: 'Sales 3M Rolling', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Measure to sum', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _LastDate = MAX({{date_column}})
VAR _Period =
    DATESINPERIOD(
        {{date_column}},
        _LastDate,
        -3,
        MONTH
    )
RETURN
    CALCULATE({{base_measure}}, _Period)`,
  },
  {
    id: 'pop-dateadd',
    name: 'Prior Month Comparison (DATEADD)',
    category: 'time-intelligence',
    description: 'Flexible period-over-period comparison shifting by -1 Month using DATEADD.',
    difficulty: 'Beginner',
    tags: ['MoM', 'DATEADD', 'prior-period', 'month'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Table or Card',
      formatString: '$#,##0',
      performanceNote: 'Works across partial months with proportional date mapping.',
      bestPractice: 'Replace MONTH with DAY or YEAR as required.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Prior Month', defaultValue: 'Sales Prior Month', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
CALCULATE(
    {{base_measure}},
    DATEADD({{date_column}}, -1, MONTH)
)`,
  },
  {
    id: 'fiscal-ytd',
    name: 'Fiscal Year-to-Date (FYTD)',
    category: 'time-intelligence',
    description: 'Fiscal Year YTD calculation with custom fiscal year ending month (e.g., June 30 or March 31).',
    difficulty: 'Intermediate',
    tags: ['fiscal', 'FYTD', 'fiscal-year', 'custom-year'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Fiscal Progress Bar or KPI',
      formatString: '$#,##0',
      performanceNote: 'Second string argument "06-30" defines the fiscal year end date.',
      bestPractice: 'Update the year-end date string to match your organization fiscal calendar.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales FYTD', defaultValue: 'Sales FYTD', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
      { id: 'fiscal_end', label: 'Fiscal End Date (MM-DD)', placeholder: '06-30', defaultValue: '06-30', description: 'Month and day when fiscal year ends', type: 'text' },
    ],
    templateDax: `{{measure_name}} =
TOTALYTD(
    {{base_measure}},
    {{date_column}},
    "{{fiscal_end}}"
)`,
  },

  // =========================================================================
  // 2. RANKINGS & PARETO ANALYSIS
  // =========================================================================
  {
    id: 'top-n-rank',
    name: 'Dense Rank by Measure (RANKX)',
    category: 'rankings-pareto',
    description: 'Calculates dynamic rank of each dimension member without skipping rank numbers.',
    difficulty: 'Intermediate',
    tags: ['RANKX', 'ranking', 'dense', 'top-n'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Table or Matrix row number column',
      formatString: '#,##0',
      performanceNote: 'Uses ALLSELECTED to ensure ranking respects active page slicers.',
      bestPractice: 'Check NOT ISBLANK(base_measure) so rows with no activity are unranked.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Customer Rank', defaultValue: 'Customer Rank', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Metric to rank by', type: 'measure' },
      { id: 'entity_column', label: 'Dimension Column', placeholder: "'Customer'[Customer Name]", defaultValue: "'Customer'[Customer Name]", description: 'Column being ranked', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
IF(
    NOT ISBLANK({{base_measure}}),
    RANKX(
        ALLSELECTED({{entity_column}}),
        {{base_measure}},
        ,
        DESC,
        Dense
    )
)`,
  },
  {
    id: 'pareto-cumulative-pct',
    name: 'Pareto 80/20 Cumulative %',
    category: 'rankings-pareto',
    description: 'Computes running cumulative % of total for Pareto analysis to identify key drivers.',
    difficulty: 'Advanced',
    tags: ['pareto', '80-20', 'cumulative', 'running-total'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Pareto Line + Clustered Column Combo visual',
      formatString: '0.0%',
      performanceNote: 'Evaluates current value and sums all peers with greater or equal value.',
      bestPractice: 'Add a 80% reference line on your chart to spotlight the vital 20% drivers.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Pareto Cumulative %', defaultValue: 'Pareto Cumulative %', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Measure', type: 'measure' },
      { id: 'entity_column', label: 'Dimension Column', placeholder: "'Product'[Category]", defaultValue: "'Product'[Category]", description: 'Category column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentVal = {{base_measure}}
VAR _TotalAll =
    CALCULATE(
        {{base_measure}},
        ALLSELECTED({{entity_column}})
    )
VAR _Cumulative =
    CALCULATE(
        {{base_measure}},
        FILTER(
            ALLSELECTED({{entity_column}}),
            {{base_measure}} >= _CurrentVal
        )
    )
RETURN
    DIVIDE(_Cumulative, _TotalAll)`,
  },
  {
    id: 'pct-of-total',
    name: '% Contribution of Total (ALLSELECTED)',
    category: 'rankings-pareto',
    description: 'Calculates the percentage contribution of the current row against the filtered total.',
    difficulty: 'Beginner',
    tags: ['contribution', 'percentage', 'share-of-wallet', 'total'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Matrix, Donut, or Bar chart',
      formatString: '0.0%',
      performanceNote: 'ALLSELECTED preserves external filters while removing row grouping.',
      bestPractice: 'Display beside the raw value column in tables.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: '% of Total Sales', defaultValue: '% of Total Sales', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'entity_column', label: 'Dimension Column', placeholder: "'Product'[Category]", defaultValue: "'Product'[Category]", description: 'Categorical column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _RowVal = {{base_measure}}
VAR _Total =
    CALCULATE(
        {{base_measure}},
        ALLSELECTED({{entity_column}})
    )
RETURN
    DIVIDE(_RowVal, _Total)`,
  },
  {
    id: 'top-5-and-others',
    name: 'Top 5 + "Others" Grouping',
    category: 'rankings-pareto',
    description: 'Returns the measure value for Top 5 items, and rolls all remaining into "Others".',
    difficulty: 'Advanced',
    tags: ['top-5', 'others', 'grouping', 'pareto'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Bar Chart or Donut Chart with clean legends',
      formatString: '$#,##0',
      performanceNote: 'Requires a disconnected Category table containing the "Others" row.',
      bestPractice: 'Prevents messy visuals with 50+ tiny unreadable slices.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Top 5 & Others', defaultValue: 'Sales Top 5 & Others', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'entity_column', label: 'Dimension Column', placeholder: "'Customer'[Customer Name]", defaultValue: "'Customer'[Customer Name]", description: 'Customer column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Rank =
    RANKX(
        ALLSELECTED({{entity_column}}),
        {{base_measure}},
        ,
        DESC
    )
VAR _Top5Total =
    CALCULATE(
        {{base_measure}},
        FILTER(
            ALLSELECTED({{entity_column}}),
            RANKX(ALLSELECTED({{entity_column}}), {{base_measure}}, , DESC) <= 5
        )
    )
VAR _AllTotal =
    CALCULATE(
        {{base_measure}},
        ALLSELECTED({{entity_column}})
    )
RETURN
    IF(
        _Rank <= 5,
        {{base_measure}},
        IF(
            SELECTEDVALUE({{entity_column}}) = "Others",
            _AllTotal - _Top5Total,
            BLANK()
        )
    )`,
  },

  // =========================================================================
  // 3. DYNAMIC TITLES & TEXT
  // =========================================================================
  {
    id: 'slicer-aware-title',
    name: 'Slicer-Aware Dynamic Chart Title',
    category: 'dynamic-titles',
    description: 'Generates an informative title displaying which filters are currently applied on the page.',
    difficulty: 'Intermediate',
    tags: ['dynamic-title', 'slicer', 'ISFILTERED', 'CONCATENATEX'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Visual Title fx (Conditional Formatting by field value)',
      formatString: 'Text',
      performanceNote: 'Evaluates in milliseconds; binds to Visual Title in Format pane.',
      bestPractice: 'Caps multi-select at 3 items to avoid overflowing card headers.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Title - Sales by Region', defaultValue: 'Title - Sales by Region', description: 'Title measure name', type: 'text' },
      { id: 'base_title', label: 'Base Title Text', placeholder: 'Monthly Sales Revenue', defaultValue: 'Monthly Sales Revenue', description: 'Static title prefix', type: 'text' },
      { id: 'filter_column', label: 'Filter Column', placeholder: "'Geography'[Region]", defaultValue: "'Geography'[Region]", description: 'Slicer field to reflect', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _IsFiltered = ISFILTERED({{filter_column}})
VAR _SelectedCount = COUNTROWS(VALUES({{filter_column}}))
VAR _ItemList =
    CONCATENATEX(
        TOPN(3, VALUES({{filter_column}})),
        {{filter_column}},
        ", "
    )
VAR _Suffix =
    SWITCH(
        TRUE(),
        NOT _IsFiltered, " (All Regions)",
        _SelectedCount = 1, " for " & SELECTEDVALUE({{filter_column}}),
        _SelectedCount <= 3, " for " & _ItemList,
        " for " & _ItemList & " & more (" & _SelectedCount & " selected)"
    )
RETURN
    "{{base_title}}" & _Suffix`,
  },
  {
    id: 'date-range-subtitle',
    name: 'Active Date Range Subtitle',
    category: 'dynamic-titles',
    description: 'Formats a clean subtitle showing the exact calendar range currently in scope.',
    difficulty: 'Beginner',
    tags: ['date-range', 'subtitle', 'header', 'formatting'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Card or visual Subtitle fx',
      formatString: 'Text',
      performanceNote: 'Extracts MIN and MAX dates from current filter context.',
      bestPractice: 'Formats dates consistently as "MMM dd, yyyy".',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Subtitle - Active Period', defaultValue: 'Subtitle - Active Period', description: 'Subtitle measure', type: 'text' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date field', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _MinDate = MIN({{date_column}})
VAR _MaxDate = MAX({{date_column}})
RETURN
    "Period: " & FORMAT(_MinDate, "MMM dd, yyyy") & " - " & FORMAT(_MaxDate, "MMM dd, yyyy")`,
  },
  {
    id: 'kpi-card-summary-text',
    name: 'KPI Card Summary Sentence',
    category: 'dynamic-titles',
    description: 'Writes a natural language summary sentence: e.g. "Up +14.2% vs target of $1.2M".',
    difficulty: 'Intermediate',
    tags: ['KPI', 'summary', 'natural-language', 'card'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'New Card Visual (Subtitle / Callout field)',
      formatString: 'Text',
      performanceNote: 'Zero performance overhead; provides instant executive context.',
      bestPractice: 'Use bold or color styling in new card visual settings.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'KPI Summary Text', defaultValue: 'KPI Summary Text', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Actual measure', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target measure', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Variance = _Actual - _Target
VAR _VariancePct = DIVIDE(_Variance, _Target)
VAR _Direction = IF(_Variance >= 0, "▲ Ahead by ", "▼ Behind by ")
RETURN
    _Direction & FORMAT(ABS(_VariancePct), "0.0%") & " vs Target (" & FORMAT(_Target, "$#,##0") & ")"`,
  },

  // =========================================================================
  // 4. KPI & VARIANCE LOGIC
  // =========================================================================
  {
    id: 'variance-to-target',
    name: 'Target Variance (Absolute & %)',
    category: 'kpi-logic',
    description: 'Calculates both absolute variance and percentage to target with safety checks.',
    difficulty: 'Beginner',
    tags: ['variance', 'target', 'budget', 'KPI'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'KPI Visual or Table cell',
      formatString: '+0.0%;-0.0%;"0.0%"',
      performanceNote: 'Single DIVIDE call avoids redundant iterations.',
      bestPractice: 'Pair with conditional color formatting (green when >= 0, red when < 0).',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Var to Target %', defaultValue: 'Sales Var to Target %', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Revenue]', defaultValue: '[Total Revenue]', description: 'Actual metric', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Revenue Target]', defaultValue: '[Revenue Target]', description: 'Target metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
RETURN
    DIVIDE(_Actual - _Target, _Target)`,
  },
  {
    id: 'kpi-status-flag',
    name: '3-State KPI Status Indicator (-1, 0, 1)',
    category: 'kpi-logic',
    description: 'Outputs 1 (Good), 0 (Warning / Near Target), or -1 (Bad) for rule-based formatting.',
    difficulty: 'Beginner',
    tags: ['status', 'traffic-light', 'indicator', 'KPI'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Conditional Formatting Rule or SVG Status icon',
      formatString: '0',
      performanceNote: 'Evaluates simple thresholds inside formula engine.',
      bestPractice: 'Use a +/- 5% band for neutral warning status.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales KPI Status', defaultValue: 'Sales KPI Status', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Actual metric', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Pct = DIVIDE(_Actual, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Actual) || ISBLANK(_Target), BLANK(),
        _Pct >= 1.00, 1,    // Met or Exceeded Target (Good)
        _Pct >= 0.90, 0,    // Within 10% tolerance (Warning)
        -1                  // Significantly below Target (Alert)
    )`,
  },
  {
    id: 'unicode-kpi-badge',
    name: 'Unicode Arrow Status Badge (▲ / ▼ / ▬)',
    category: 'kpi-logic',
    description: 'Returns clean Unicode symbols (▲, ▼, ▬) formatted alongside the variance percentage.',
    difficulty: 'Beginner',
    tags: ['unicode', 'arrow', 'badge', 'card'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Table column, Matrix cell, or Card subtitle',
      formatString: 'Text',
      performanceNote: 'Zero graphic rendering overhead compared to images.',
      bestPractice: 'Works reliably on all Windows, macOS, and mobile Power BI apps.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Trend Badge', defaultValue: 'Sales Trend Badge', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Actual metric', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _VarPct = DIVIDE(_Actual - _Target, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_VarPct), "-",
        _VarPct > 0.005, "▲ " & FORMAT(_VarPct, "+0.0%"),
        _VarPct < -0.005, "▼ " & FORMAT(_VarPct, "0.0%"),
        "▬ 0.0%"
    )`,
  },
  {
    id: 'month-pace-projection',
    name: 'Month-End Run Rate / Pace Projection',
    category: 'kpi-logic',
    description: 'Projects expected month-end finish based on current daily pace and remaining days.',
    difficulty: 'Intermediate',
    tags: ['run-rate', 'pace', 'projection', 'forecast'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Gauge or Bullet chart with Target Marker',
      formatString: '$#,##0',
      performanceNote: 'Computes elapsed vs total days in active month.',
      bestPractice: 'Only project for current in-progress month.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Month-End Projection', defaultValue: 'Sales Month-End Projection', description: 'Measure name', type: 'text' },
      { id: 'mtd_measure', label: 'MTD Measure', placeholder: '[Sales MTD]', defaultValue: '[Sales MTD]', description: 'Current MTD actuals', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date field', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentDate = TODAY()
VAR _DaysInMonth = DAY(EOMONTH(_CurrentDate, 0))
VAR _DaysPassed = DAY(_CurrentDate)
VAR _MTD = {{mtd_measure}}
VAR _DailyPace = DIVIDE(_MTD, _DaysPassed)
RETURN
    _DailyPace * _DaysInMonth`,
  },

  // =========================================================================
  // 5. CONDITIONAL FORMATTING
  // =========================================================================
  {
    id: 'color-hex-status',
    name: 'Threshold Hex Color for Bars & Text',
    category: 'conditional-formatting',
    description: 'Outputs hex codes (#10B981, #F59E0B, #EF4444) to drive visual conditional formatting by Field Value.',
    difficulty: 'Beginner',
    tags: ['color', 'hex', 'conditional-formatting', 'field-value'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Format visual -> Colors -> fx -> Format style: Field Value',
      formatString: 'Text',
      performanceNote: 'Field Value conditional formatting is faster than manual rules in Power BI.',
      bestPractice: 'Use theme-harmonized hex values matching your PowerLab theme.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Color - Sales Variance', defaultValue: 'Color - Sales Variance', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Actual metric', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Pct = DIVIDE(_Actual, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Actual) || ISBLANK(_Target), "#94A3B8", // Slate Gray for missing data
        _Pct >= 1.00, "#10B981",                         // Emerald Green (Met Target)
        _Pct >= 0.90, "#F59E0B",                         // Amber (Near Target)
        "#EF4444"                                        // Rose Red (Behind Target)
    )`,
  },
  {
    id: 'divergent-gradient-hex',
    name: 'Positive / Negative Binary Hex Color',
    category: 'conditional-formatting',
    description: 'Quick binary hex switcher for variance bars (Green for profit, Red for loss).',
    difficulty: 'Beginner',
    tags: ['color', 'hex', 'binary', 'variance'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Bar Chart or Waterfall color fx',
      formatString: 'Text',
      performanceNote: 'Instant conditional formatting evaluated per data point.',
      bestPractice: 'Set neutral color for zero change.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Color - Profit/Loss', defaultValue: 'Color - Profit/Loss', description: 'Measure name', type: 'text' },
      { id: 'variance_measure', label: 'Variance Measure', placeholder: '[Profit Variance]', defaultValue: '[Profit Variance]', description: 'Variance metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{variance_measure}}
RETURN
    IF(
        _Val >= 0,
        "#059669", // Dark Emerald Green (Passes WCAG 3.0:1)
        "#DC2626"  // Vivid Crimson Red
    )`,
  },

  // =========================================================================
  // 6. METRIC & CURRENCY SWITCHING
  // =========================================================================
  {
    id: 'metric-switcher-measure',
    name: 'Dynamic Metric Switcher (SWITCH + SELECTEDVALUE)',
    category: 'metric-switching',
    description: 'Single measure that switches what chart displays based on a slicer selection.',
    difficulty: 'Intermediate',
    tags: ['switcher', 'SWITCH', 'SELECTEDVALUE', 'dynamic-measure'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Single chart serving 4+ metrics with a single button slicer',
      formatString: '#,##0',
      performanceNote: 'Replaces 4 redundant report pages with a single dynamic view.',
      bestPractice: 'Create a simple disconnected table `MetricPicker[Metric Name]` for the slicer.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Dynamic Selected Metric', defaultValue: 'Dynamic Selected Metric', description: 'Measure name', type: 'text' },
      { id: 'slicer_column', label: 'Slicer Column', placeholder: "'MetricPicker'[Metric Name]", defaultValue: "'MetricPicker'[Metric Name]", description: 'Disconnected slicer column', type: 'column' },
      { id: 'metric1', label: 'Option 1 Measure', placeholder: '[Total Revenue]', defaultValue: '[Total Revenue]', description: 'First option', type: 'measure' },
      { id: 'metric2', label: 'Option 2 Measure', placeholder: '[Total Orders]', defaultValue: '[Total Orders]', description: 'Second option', type: 'measure' },
      { id: 'metric3', label: 'Option 3 Measure', placeholder: '[Total Profit]', defaultValue: '[Total Profit]', description: 'Third option', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Selection = SELECTEDVALUE({{slicer_column}}, "Revenue")
RETURN
    SWITCH(
        _Selection,
        "Revenue", {{metric1}},
        "Orders", {{metric2}},
        "Profit", {{metric3}},
        {{metric1}}
    )`,
  },
  {
    id: 'currency-converter-switcher',
    name: 'Multi-Currency Dynamic Converter',
    category: 'metric-switching',
    description: 'Converts base currency values (e.g. USD) into EUR, GBP, or JPY based on live exchange rate selection.',
    difficulty: 'Advanced',
    tags: ['currency', 'exchange-rate', 'FX', 'conversion'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Global currency slicer at top of executive dashboard',
      formatString: '#,##0',
      performanceNote: 'Multiplies base measure by the selected currency spot rate.',
      bestPractice: 'Default to base corporate reporting currency if no slicer is selected.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Converted', defaultValue: 'Sales Converted', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure (USD)', placeholder: '[Sales USD]', defaultValue: '[Sales USD]', description: 'Base measure in native currency', type: 'measure' },
      { id: 'currency_column', label: 'Currency Column', placeholder: "'Currency'[Currency Code]", defaultValue: "'Currency'[Currency Code]", description: 'Currency selector column', type: 'column' },
      { id: 'rate_measure', label: 'Exchange Rate Measure', placeholder: '[FX Rate]', defaultValue: '[FX Rate]', description: 'Exchange rate multiplier', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _SelectedCurrency = SELECTEDVALUE({{currency_column}}, "USD")
VAR _BaseVal = {{base_measure}}
VAR _Rate =
    IF(
        _SelectedCurrency = "USD",
        1.0,
        {{rate_measure}}
    )
RETURN
    _BaseVal * _Rate`,
  },
];
