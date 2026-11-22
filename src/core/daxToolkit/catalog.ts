import { DaxCategoryMeta, DaxTemplate } from './types';

export const DAX_CATEGORIES: DaxCategoryMeta[] = [
  {
    id: 'time-intelligence',
    label: 'Time Intelligence',
    description: 'YTD, MTD, YoY growth, rolling moving averages, and prior period comparisons.',
    iconName: 'Calendar',
  },
  {
    id: 'conditional-formatting',
    label: 'Conditional Formatting',
    description: 'Hex color codes for visual element conditional formatting by rule, threshold, or contrast.',
    iconName: 'Palette',
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
    id: 'rankings-pareto',
    label: 'Rankings & Pareto',
    description: 'Dynamic Top N, 80/20 cumulative contribution, and Category % of Total.',
    iconName: 'Award',
  },
  {
    id: 'metric-switching',
    label: 'Metric Switchers & Advanced Analytics',
    description: 'Disconnected slicer tables, CAGR, retention, churn, and multi-currency models.',
    iconName: 'Sliders',
  },
];

export const DAX_CATALOG: DaxTemplate[] = [
  // =========================================================================
  // 1. TIME INTELLIGENCE (12 Measures)
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
    description: 'Accumulates measure from start of current calendar quarter to current date context.',
    difficulty: 'Beginner',
    tags: ['QTD', 'quarter', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Quarterly Executive Card',
      formatString: '$#,##0',
      performanceNote: 'Uses built-in storage engine quarterly cache.',
      bestPractice: 'Date table must span full calendar years.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Revenue QTD', defaultValue: 'Revenue QTD', description: 'Measure name', type: 'text' },
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
    description: 'Calculates the base measure for the exact same timeframe one year prior.',
    difficulty: 'Intermediate',
    tags: ['SPLY', 'prior-year', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Line chart secondary series or Card comparison',
      formatString: '$#,##0',
      performanceNote: 'SAMEPERIODLASTYEAR translates into a clean CALCULATETABLE internally.',
      bestPractice: 'Verify leap years (Feb 29) handling in your Date table.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Prior Year', defaultValue: 'Sales Prior Year', description: 'Measure name', type: 'text' },
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
    name: 'Year-over-Year (YoY) Variance',
    category: 'time-intelligence',
    description: 'Absolute delta between Current Year and Prior Year values.',
    difficulty: 'Intermediate',
    tags: ['YoY', 'variance', 'delta', 'annual'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Waterfall chart or KPI card delta callout',
      formatString: '+$#,##0;-$#,##0;$0',
      performanceNote: 'Evaluates base measure twice in memory; cached by DAX VertiPaq engine.',
      bestPractice: 'Use strict variable caching to avoid duplicate evaluation.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales YoY Variance', defaultValue: 'Sales YoY Variance', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Current measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Current = {{base_measure}}
VAR _Prior =
    CALCULATE(
        {{base_measure}},
        SAMEPERIODLASTYEAR({{date_column}})
    )
VAR _Variance =
    IF(
        NOT ISBLANK(_Current) && NOT ISBLANK(_Prior),
        _Current - _Prior,
        BLANK()
    )
RETURN
    _Variance`,
  },
  {
    id: 'yoy-growth-pct',
    name: 'Year-over-Year (YoY) Growth %',
    category: 'time-intelligence',
    description: 'Percentage growth vs the same period last year with safe division guard.',
    difficulty: 'Intermediate',
    tags: ['YoY', 'growth', 'percentage', 'SPLY'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'KPI visual small callout or Matrix table column',
      formatString: '+0.0%;-0.0%;0.0%',
      performanceNote: 'DIVIDE prevents divide-by-zero errors without expensive IF checks.',
      bestPractice: 'Always format with explicit positive sign (+0.0%) for clarity.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales YoY %', defaultValue: 'Sales YoY %', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Current measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Current = {{base_measure}}
VAR _Prior =
    CALCULATE(
        {{base_measure}},
        SAMEPERIODLASTYEAR({{date_column}})
    )
RETURN
    DIVIDE(
        _Current - _Prior,
        _Prior,
        BLANK()
    )`,
  },
  {
    id: 'rolling-30d-avg',
    name: 'Rolling 30-Day Moving Average',
    category: 'time-intelligence',
    description: 'Smoothed moving average calculated over a rolling 30 calendar day window.',
    difficulty: 'Intermediate',
    tags: ['rolling', 'moving-average', 'smoothing', 'trend'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Line chart overlaid on daily bar chart',
      formatString: '#,##0.0',
      performanceNote: 'DATESINPERIOD works in formula engine; filter table carefully.',
      bestPractice: 'Use MAX on the date column to anchor the window end.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales 30D Moving Avg', defaultValue: 'Sales 30D Moving Avg', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Daily measure to smooth', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _LastDate = MAX({{date_column}})
VAR _Period =
    DATESINPERIOD(
        {{date_column}},
        _LastDate,
        -30,
        DAY
    )
RETURN
    AVERAGEX(
        _Period,
        {{base_measure}}
    )`,
  },
  {
    id: 'rolling-3m-sum',
    name: 'Rolling 3-Month Moving Sum',
    category: 'time-intelligence',
    description: 'Trailing 3-month cumulative volume for quarterly smoothing.',
    difficulty: 'Intermediate',
    tags: ['rolling', 'trailing', '3-month', 'sum'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Area chart or Monthly Bar chart',
      formatString: '$#,##0',
      performanceNote: 'Optimized calculation using DATESINPERIOD with MONTH intervals.',
      bestPractice: 'Filter out dates with no actual sales to avoid trailing zero tails.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Rolling 3M', defaultValue: 'Sales Rolling 3M', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _LastDate = MAX({{date_column}})
RETURN
    CALCULATE(
        {{base_measure}},
        DATESINPERIOD(
            {{date_column}},
            _LastDate,
            -3,
            MONTH
        )
    )`,
  },
  {
    id: 'pop-dateadd',
    name: 'Period-over-Period (Custom DATEADD)',
    category: 'time-intelligence',
    description: 'Flexible prior period calculation shifting backwards by N months or quarters.',
    difficulty: 'Intermediate',
    tags: ['DATEADD', 'prior-period', 'time-intelligence'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Matrix comparison table or trendline',
      formatString: '$#,##0',
      performanceNote: 'DATEADD maintains contiguous date intervals in VertiPaq.',
      bestPractice: 'Select interval carefully: MONTH, QUARTER, or YEAR.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Prior Month', defaultValue: 'Sales Prior Month', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Measure to evaluate', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
      { id: 'shift_count', label: 'Interval Count', placeholder: '-1', defaultValue: '-1', description: 'Number of intervals to shift backwards', type: 'number' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    CALCULATE(
        {{base_measure}},
        DATEADD({{date_column}}, {{shift_count}}, MONTH)
    )
RETURN
    _Result`,
  },
  {
    id: 'fiscal-ytd',
    name: 'Fiscal Year-to-Date (FYTD)',
    category: 'time-intelligence',
    description: 'Year-to-date calculation for companies with a non-December fiscal year end.',
    difficulty: 'Advanced',
    tags: ['fiscal', 'FYTD', 'accounting', 'year-end'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Executive Card or Fiscal P&L Matrix',
      formatString: '$#,##0',
      performanceNote: 'Passes the fiscal year end date string (e.g. "06-30" or "03-31") to TOTALYTD.',
      bestPractice: 'Confirm date string format matches MM-DD format.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales FYTD', defaultValue: 'Sales FYTD', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
      { id: 'fiscal_end', label: 'Fiscal End Date (MM-DD)', placeholder: '"06-30"', defaultValue: '"06-30"', description: 'Month and day fiscal year ends', type: 'text' },
    ],
    templateDax: `{{measure_name}} =
VAR _Result =
    TOTALYTD(
        {{base_measure}},
        {{date_column}},
        {{fiscal_end}}
    )
RETURN
    _Result`,
  },
  {
    id: 'working-days-between-dates',
    name: 'Working Business Days (Excl. Weekends)',
    category: 'time-intelligence',
    description: 'Calculates active business working days between two dates, excluding Saturdays and Sundays.',
    difficulty: 'Intermediate',
    tags: ['working-days', 'business-days', 'calendar', 'workdays'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Table / Matrix column or KPI card',
      formatString: '#,##0 "days"',
      performanceNote: 'Filters calendar table in memory; runs in sub-10ms for typical ranges.',
      bestPractice: 'Connect to an official Date dimension where IsWorkingDay or DayOfWeek is marked.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Working Days Elapsed', defaultValue: 'Working Days Elapsed', description: 'Measure name', type: 'text' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
      { id: 'day_of_week_column', label: 'Day of Week Column (1-7)', placeholder: "'Date'[DayOfWeek]", defaultValue: "'Date'[DayOfWeek]", description: '1=Sun, 7=Sat or 2-6=Mon-Fri', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _StartDate = MIN({{date_column}})
VAR _EndDate = MAX({{date_column}})
VAR _WorkDays =
    COUNTROWS(
        FILTER(
            ALL({{date_column}}, {{day_of_week_column}}),
            {{date_column}} >= _StartDate
                && {{date_column}} <= _EndDate
                && NOT {{day_of_week_column}} IN { 1, 7 }
        )
    )
RETURN
    _WorkDays`,
  },
  {
    id: 'same-period-last-quarter-qoq',
    name: 'Quarter-over-Quarter (QoQ) Growth %',
    category: 'time-intelligence',
    description: 'Compares active quarterly context against the preceding quarter using DATEADD.',
    difficulty: 'Intermediate',
    tags: ['QoQ', 'quarter', 'growth', 'comparison'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Quarterly breakdown card or bar chart data label',
      formatString: '+0.0%;-0.0%;0.0%',
      performanceNote: 'Shifts 1 QUARTER backwards cleanly using VertiPaq internal index.',
      bestPractice: 'Use DIVIDE with explicit zero or BLANK fallback.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales QoQ %', defaultValue: 'Sales QoQ %', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Base measure to compare', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Current = {{base_measure}}
VAR _PriorQuarter =
    CALCULATE(
        {{base_measure}},
        DATEADD({{date_column}}, -1, QUARTER)
    )
RETURN
    DIVIDE(
        _Current - _PriorQuarter,
        _PriorQuarter,
        BLANK()
    )`,
  },

  // =========================================================================
  // 2. CONDITIONAL FORMATTING & COLOR RULES (10 Measures)
  // =========================================================================
  {
    id: 'color-hex-status',
    name: 'KPI 3-State Traffic Light Hex (Background / Font)',
    category: 'conditional-formatting',
    description: 'Outputs hex codes (#10B981 Green, #F59E0B Amber, #EF4444 Red) for conditional formatting.',
    difficulty: 'Beginner',
    tags: ['color', 'conditional-formatting', 'hex', 'traffic-light', 'status'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Table / Matrix cell background or New Card accent',
      performanceNote: 'Returns string literal; evaluated instantly per row.',
      bestPractice: 'Select "Field value" in Power BI Conditional Formatting dialog.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'KPI Status Color', defaultValue: 'KPI Status Color', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target benchmark', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Ratio = DIVIDE(_Actual, _Target, 0)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Actual), BLANK(),
        _Ratio >= 1.00, "#10B981",  // Emerald Green
        _Ratio >= 0.90, "#F59E0B",  // Amber Warning
        "#EF4444"                   // Rose Alert
    )`,
  },
  {
    id: 'cf-font-contrast-switcher',
    name: 'Dynamic Font Contrast Color (Dark vs Light Text)',
    category: 'conditional-formatting',
    description: 'Switches font color (#1E293B Dark Charcoal vs #FFFFFF Crisp White) for WCAG compliance on dynamic cell backgrounds.',
    difficulty: 'Intermediate',
    tags: ['font-color', 'contrast', 'accessibility', 'text-color', 'wcag'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Table or Matrix Cell Font Color (Conditional Formatting > Field Value)',
      performanceNote: 'Pure logical comparison, executes in 0ms.',
      bestPractice: 'Pair with saturated background colors to guarantee readable text.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Dynamic Font Color', defaultValue: 'Dynamic Font Color', description: 'Measure name', type: 'text' },
      { id: 'status_measure', label: 'Background / Status Metric', placeholder: '[Variance %]', defaultValue: '[Variance %]', description: 'Metric governing brightness', type: 'measure' },
      { id: 'threshold', label: 'Dark Background Threshold', placeholder: '0.10', defaultValue: '0.10', description: 'Threshold where dark background triggers white text', type: 'number' },
    ],
    templateDax: `{{measure_name}} =
VAR _Metric = {{status_measure}}
RETURN
    IF(
        _Metric >= {{threshold}} || _Metric < -0.15,
        "#FFFFFF",  // Light text on strong dark/saturated background
        "#1E293B"   // Dark slate text on light background
    )`,
  },
  {
    id: 'cf-data-bar-color',
    name: 'Data Bar Fill & Polarity Hex (Positive vs Negative)',
    category: 'conditional-formatting',
    description: 'Returns vibrant brand colors for positive gains vs muted or red alerts for negative deficits.',
    difficulty: 'Beginner',
    tags: ['data-bar', 'polarity', 'positive-negative', 'bar-color'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Bar Chart, Waterfall, or Matrix Data Bars',
      performanceNote: 'Instantaneous evaluation on numeric sign.',
      bestPractice: 'Use #34D399 (Mint) or #38BDF8 (Sky Blue) for positives, #F87171 for negatives.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Variance Bar Color', defaultValue: 'Variance Bar Color', description: 'Measure name', type: 'text' },
      { id: 'value_measure', label: 'Value Measure', placeholder: '[Net Variance]', defaultValue: '[Net Variance]', description: 'Numeric value to evaluate', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{value_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Val), BLANK(),
        _Val > 0, "#10B981",   // Emerald Green positive
        _Val < 0, "#EF4444",   // Coral Red negative
        "#94A3B8"              // Slate Neutral zero
    )`,
  },
  {
    id: 'divergent-gradient-hex',
    name: 'Gradient Divergent Heatmap Hex',
    category: 'conditional-formatting',
    description: 'Divergent 5-stop color gradient for matrices and heatmaps based on normalized range.',
    difficulty: 'Intermediate',
    tags: ['gradient', 'divergent', 'heatmap', 'matrix'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Matrix heatmap cells or table background',
      performanceNote: 'Quantizes continuous values into 5 discrete hex steps.',
      bestPractice: 'Anchor center at 0% or target baseline.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Heatmap Hex', defaultValue: 'Heatmap Hex', description: 'Measure name', type: 'text' },
      { id: 'variance_measure', label: 'Variance Measure', placeholder: '[Sales YoY %]', defaultValue: '[Sales YoY %]', description: 'Percentage metric', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{variance_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Val), BLANK(),
        _Val >=  0.15, "#10B981",  // Strong positive
        _Val >=  0.05, "#6EE7B7",  // Soft positive
        _Val >= -0.05, "#F3F4F6",  // Neutral / baseline
        _Val >= -0.15, "#FCA5A5",  // Soft negative
        "#EF4444"                  // Strong negative
    )`,
  },
  {
    id: 'cf-status-pill-badge',
    name: 'Status Pill Badge Background Color (Text Statuses)',
    category: 'conditional-formatting',
    description: 'Maps categorical stage names (Completed, Active, In Progress, On Hold, Cancelled) to corporate pastel tints.',
    difficulty: 'Beginner',
    tags: ['status-pill', 'badge', 'categorical', 'pipeline'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Table column "Project Status" cell background with pill styling',
      performanceNote: 'Zero calculation overhead; uses exact text matching.',
      bestPractice: 'Always supply a default gray tint for unexpected strings.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Stage Badge Color', defaultValue: 'Stage Badge Color', description: 'Measure name', type: 'text' },
      { id: 'status_column', label: 'Status Column', placeholder: "SELECTEDVALUE('Project'[Status])", defaultValue: "SELECTEDVALUE('Project'[Status])", description: 'Text column value', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Status = UPPER(TRIM({{status_column}}))
RETURN
    SWITCH(
        _Status,
        "COMPLETED",   "#D1FAE5",  // Soft Mint
        "APPROVED",    "#D1FAE5",
        "IN PROGRESS", "#DBEAFE",  // Soft Blue
        "ACTIVE",      "#DBEAFE",
        "ON HOLD",     "#FEF3C7",  // Soft Amber
        "PENDING",     "#FEF3C7",
        "CANCELLED",   "#FEE2E2",  // Soft Rose
        "BLOCKED",     "#FEE2E2",
        "#F1F5F9"                  // Slate default
    )`,
  },
  {
    id: 'cf-target-achievement-color',
    name: 'Target Achievement 4-Tier Color Scale',
    category: 'conditional-formatting',
    description: '4-level executive tiering: Super-Achieved (>110%), Target Met (100-110%), Near Target (90-99%), Off Track (<90%).',
    difficulty: 'Intermediate',
    tags: ['achievement', 'attainment', 'tiers', 'kpi'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Executive Gauge, Donut chart slices, or Card callout borders',
      performanceNote: 'Single DIVIDE call stored in local variable.',
      bestPractice: 'Aligns with Stephen Few and IBCS executive reporting standards.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Attainment Color', defaultValue: 'Attainment Color', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Actual Revenue]', defaultValue: '[Actual Revenue]', description: 'Actual measure', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Target Revenue]', defaultValue: '[Target Revenue]', description: 'Target benchmark', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Pct = DIVIDE(_Actual, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Pct), BLANK(),
        _Pct >= 1.10, "#8B5CF6",  // Royal Purple - Super Exceeded (>110%)
        _Pct >= 1.00, "#10B981",  // Emerald Green - Met Target (100-110%)
        _Pct >= 0.90, "#FBBF24",  // Warm Amber - Near Target (90-99%)
        "#F43F5E"                 // Rose Alert - Behind Plan (<90%)
    )`,
  },
  {
    id: 'cf-trend-direction-color',
    name: 'Trend Direction Indicator Color (MoM / WoW)',
    category: 'conditional-formatting',
    description: 'Evaluates short-term velocity and supplies directional highlight color.',
    difficulty: 'Beginner',
    tags: ['trend', 'direction', 'velocity', 'mom'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Icon visual, Callout font color, or Trendline endpoint',
      performanceNote: 'Instantly categorizes positive vs negative momentum.',
      bestPractice: 'Set a neutral tolerance band (±0.5%) to avoid color flickering on flat noise.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Trend Color', defaultValue: 'Trend Color', description: 'Measure name', type: 'text' },
      { id: 'delta_measure', label: 'Delta / Variance Measure', placeholder: '[Sales MoM Growth %]', defaultValue: '[Sales MoM Growth %]', description: 'Growth percentage', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Delta = {{delta_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Delta), BLANK(),
        _Delta >  0.005, "#10B981", // Upward trend (+0.5%+)
        _Delta < -0.005, "#EF4444", // Downward trend (-0.5%-)
        "#64748B"                  // Flat trend
    )`,
  },
  {
    id: 'cf-outlier-anomaly-highlight',
    name: 'Statistical Outlier / Anomaly Highlight Hex',
    category: 'conditional-formatting',
    description: 'Highlights values exceeding 2 standard deviations from the group mean with an alert color.',
    difficulty: 'Advanced',
    tags: ['outlier', 'anomaly', 'statistics', 'stdev'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Scatter chart dot fill, Matrix row highlight, or Bar chart',
      performanceNote: 'Calculates STDEVX.P across the visible entity table.',
      bestPractice: 'Wrap with ALLSELECTED to maintain user slicer context.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Outlier Highlight Hex', defaultValue: 'Outlier Highlight Hex', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Transaction Amount]', defaultValue: '[Transaction Amount]', description: 'Metric to inspect', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Customer'[Customer ID]", defaultValue: "'Customer'[Customer ID]", description: 'Dimension column being evaluated', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{base_measure}}
VAR _Mean =
    AVERAGEX(
        ALLSELECTED({{entity_column}}),
        {{base_measure}}
    )
VAR _StdDev =
    STDEVX.P(
        ALLSELECTED({{entity_column}}),
        {{base_measure}}
    )
VAR _IsAnomaly =
    ABS(_Val - _Mean) > (2 * _StdDev)
RETURN
    IF(
        _IsAnomaly,
        "#F43F5E",  // Alert Anomaly Red
        BLANK()     // Normal (inherit default visual style)
    )`,
  },
  {
    id: 'cf-card-callout-accent',
    name: 'Card Callout Accent Border / Glow Color',
    category: 'conditional-formatting',
    description: 'Calculates dynamic accent color for New Card visual card outline or container shadow.',
    difficulty: 'Beginner',
    tags: ['card-accent', 'border', 'glow', 'new-card'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'New Card Visual > Cards > Shape Fill or Accent Bar',
      performanceNote: 'Executes once per card visual.',
      bestPractice: 'Use subtle 20% opacity or pastel tones so the report remains clean.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Card Accent Color', defaultValue: 'Card Accent Color', description: 'Measure name', type: 'text' },
      { id: 'score_measure', label: 'Health Score Measure', placeholder: '[NPS Score]', defaultValue: '[NPS Score]', description: 'Metric governing card mood', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Score = {{score_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Score), "#CBD5E1",
        _Score >= 70, "#34D399",  // Vibrant Mint
        _Score >= 50, "#38BDF8",  // Clean Sky Blue
        _Score >= 30, "#FBBF24",  // Warm Amber
        "#FB7185"                 // Soft Crimson
    )`,
  },
  {
    id: 'cf-risk-severity-matrix',
    name: 'Risk & Severity Matrix Color (Impact x Likelihood)',
    category: 'conditional-formatting',
    description: 'Maps risk levels (Low, Medium, High, Critical) based on 2-dimensional score cross-product.',
    difficulty: 'Intermediate',
    tags: ['risk', 'severity', 'governance', 'audit'],
    outputType: 'Color Hex',
    powerBiTips: {
      recommendedVisual: 'Audit matrix, Issue log, or IT Ops status board',
      performanceNote: 'Simple arithmetic product.',
      bestPractice: 'Aligns with standard ISO 31000 risk heatmaps.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Risk Hex Color', defaultValue: 'Risk Hex Color', description: 'Measure name', type: 'text' },
      { id: 'impact_measure', label: 'Impact Score (1-5)', placeholder: '[Avg Impact]', defaultValue: '[Avg Impact]', description: 'Impact rating 1 to 5', type: 'measure' },
      { id: 'likelihood_measure', label: 'Likelihood Score (1-5)', placeholder: '[Avg Likelihood]', defaultValue: '[Avg Likelihood]', description: 'Likelihood rating 1 to 5', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Impact = {{impact_measure}}
VAR _Likelihood = {{likelihood_measure}}
VAR _Score = _Impact * _Likelihood
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Impact) || ISBLANK(_Likelihood), BLANK(),
        _Score >= 16, "#DC2626",  // Critical Red (16-25)
        _Score >= 10, "#EA580C",  // High Orange (10-15)
        _Score >= 5,  "#F59E0B",  // Medium Yellow (5-9)
        "#10B981"                 // Low Green (1-4)
    )`,
  },

  // =========================================================================
  // 3. DYNAMIC TITLES & TEXT (8 Measures)
  // =========================================================================
  {
    id: 'slicer-aware-title',
    name: 'Slicer-Aware Visual Title (Single Select Fallback)',
    category: 'dynamic-titles',
    description: 'Generates dynamic chart titles that adapt to user slicer filter selections with a fallback default.',
    difficulty: 'Beginner',
    tags: ['title', 'slicer', 'dynamic-title', 'text'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Visual Title property (Title > fx function)',
      performanceNote: 'SELECTEDVALUE is evaluated once per visual render.',
      bestPractice: 'Always supply a clean fallback string like "All Regions" or "Global".',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Chart Title Sales', defaultValue: 'Chart Title Sales', description: 'Measure name', type: 'text' },
      { id: 'base_title', label: 'Base Title Prefix', placeholder: '"Sales Performance - "', defaultValue: '"Sales Performance - "', description: 'Text preceding the selection', type: 'text' },
      { id: 'filter_column', label: 'Slicer Column', placeholder: "'Geography'[Region]", defaultValue: "'Geography'[Region]", description: 'Column being sliced', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Selected =
    SELECTEDVALUE(
        {{filter_column}},
        "All Regions"
    )
RETURN
    {{base_title}} & _Selected`,
  },
  {
    id: 'title-multi-select-slicer',
    name: 'Multi-Select Slicer Dynamic Title ("A, B and N others")',
    category: 'dynamic-titles',
    description: 'Intelligently formats multiple slicer choices: shows single name, two names, or "Category A, B and 3 others".',
    difficulty: 'Intermediate',
    tags: ['title', 'multi-select', 'CONCATENATEX', 'slicer-header'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Top banner title or visual subtitle',
      performanceNote: 'Uses CONCATENATEX over TOPN to cap string length and prevent sluggish UI.',
      bestPractice: 'Fall back to "All [Entities]" when ISFILTERED is false.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Header Multi Title', defaultValue: 'Header Multi Title', description: 'Measure name', type: 'text' },
      { id: 'entity_column', label: 'Slicer Column', placeholder: "'Product'[Category]", defaultValue: "'Product'[Category]", description: 'The sliced dimension column', type: 'column' },
      { id: 'prefix_text', label: 'Title Prefix', placeholder: '"Revenue Overview for "', defaultValue: '"Revenue Overview for "', description: 'Leading label', type: 'text' },
    ],
    templateDax: `{{measure_name}} =
VAR _SelectedCount = COUNTROWS(VALUES({{entity_column}}))
VAR _TotalCount = COUNTROWS(ALL({{entity_column}}))
VAR _Top2 =
    CONCATENATEX(
        TOPN(2, VALUES({{entity_column}}), {{entity_column}}, ASC),
        {{entity_column}},
        ", "
    )
VAR _Remainder = _SelectedCount - 2
RETURN
    {{prefix_text}} &
    SWITCH(
        TRUE(),
        NOT ISFILTERED({{entity_column}}), "All Categories",
        _SelectedCount = 1, SELECTEDVALUE({{entity_column}}),
        _SelectedCount = 2, _Top2,
        _Top2 & " and " & _Remainder & " others"
    )`,
  },
  {
    id: 'date-range-subtitle',
    name: 'Dynamic Date Range Subtitle',
    category: 'dynamic-titles',
    description: 'Formats currently filtered calendar window (e.g. "Showing: Jan 01, 2024 to Oct 31, 2024").',
    difficulty: 'Beginner',
    tags: ['date-range', 'subtitle', 'context', 'dates'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Report page banner or visual subtitle',
      performanceNote: 'Zero table scan: uses MIN/MAX over active Date filter context.',
      bestPractice: 'Format dates in corporate standard (e.g. "mmm dd, yyyy").',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Date Window Subtitle', defaultValue: 'Date Window Subtitle', description: 'Measure name', type: 'text' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _MinDate = MIN({{date_column}})
VAR _MaxDate = MAX({{date_column}})
RETURN
    "Showing: " &
    FORMAT(_MinDate, "mmm dd, yyyy") &
    " to " &
    FORMAT(_MaxDate, "mmm dd, yyyy")`,
  },
  {
    id: 'title-period-comparison',
    name: 'Period Comparison Header ("Q3 2024 vs Prior Year Q3 2023")',
    category: 'dynamic-titles',
    description: 'Dynamic subtitle highlighting active quarter or month compared to same period in the prior year.',
    difficulty: 'Intermediate',
    tags: ['period-comparison', 'header', 'quarterly', 'prior-year'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Executive KPI Visual Subtitle',
      performanceNote: 'Evaluates year and quarter indices in current filter context.',
      bestPractice: 'Ensure the Date table has Year and Quarter fields.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Comparison Subtitle', defaultValue: 'Comparison Subtitle', description: 'Measure name', type: 'text' },
      { id: 'year_column', label: 'Year Column', placeholder: "'Date'[Year]", defaultValue: "'Date'[Year]", description: 'Calendar Year column', type: 'column' },
      { id: 'quarter_column', label: 'Quarter Column', placeholder: "'Date'[Quarter]", defaultValue: "'Date'[Quarter]", description: 'Calendar Quarter column (e.g. Q3)', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Year = SELECTEDVALUE({{year_column}}, YEAR(TODAY()))
VAR _Quarter = SELECTEDVALUE({{quarter_column}}, "Full Year")
VAR _PriorYear = _Year - 1
RETURN
    "Performance Period: " & _Quarter & " " & _Year & " vs " & _Quarter & " " & _PriorYear`,
  },
  {
    id: 'kpi-card-summary-text',
    name: 'KPI Card Narrative Callout Text',
    category: 'dynamic-titles',
    description: 'Generates conversational status sentence for executive cards (e.g. "Ahead of Target by $42,500 (+12.4%)").',
    difficulty: 'Intermediate',
    tags: ['KPI', 'narrative', 'card', 'callout', 'executive'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Card Visual Subtitle or Text Box',
      performanceNote: 'Combines multiple scalar variables cleanly.',
      bestPractice: 'Use Unicode directional symbols for rapid comprehension.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Revenue Card Narrative', defaultValue: 'Revenue Card Narrative', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target value', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Delta = _Actual - _Target
VAR _Pct = DIVIDE(_Delta, _Target)
VAR _Direction = IF(_Delta >= 0, "Ahead of Plan", "Behind Plan")
VAR _Arrow = IF(_Delta >= 0, "▲ ", "▼ ")
RETURN
    _Arrow & _Direction & " by " &
    FORMAT(ABS(_Delta), "$#,##0") &
    " (" & FORMAT(_Pct, "+0.0%;-0.0%;0.0%") & ")"`,
  },
  {
    id: 'title-drilldown-breadcrumb',
    name: 'Hierarchical Drilldown Breadcrumb Path',
    category: 'dynamic-titles',
    description: 'Tracks user drilldown levels through Country > Region > Store and reflects location in visual header.',
    difficulty: 'Intermediate',
    tags: ['drilldown', 'breadcrumb', 'hierarchy', 'navigation'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Top left report breadcrumb bar',
      performanceNote: 'Uses ISINSCOPE to detect active hierarchy level.',
      bestPractice: 'Order ISINSCOPE branches from innermost to outermost level.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Hierarchy Breadcrumb', defaultValue: 'Hierarchy Breadcrumb', description: 'Measure name', type: 'text' },
      { id: 'level1_col', label: 'Top Level Column', placeholder: "'Geo'[Country]", defaultValue: "'Geo'[Country]", description: 'Top level (e.g. Country)', type: 'column' },
      { id: 'level2_col', label: 'Middle Level Column', placeholder: "'Geo'[Region]", defaultValue: "'Geo'[Region]", description: 'Middle level (e.g. State/Region)', type: 'column' },
      { id: 'level3_col', label: 'Lowest Level Column', placeholder: "'Geo'[City]", defaultValue: "'Geo'[City]", description: 'Lowest level (e.g. City)', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
SWITCH(
    TRUE(),
    ISINSCOPE({{level3_col}}),
        SELECTEDVALUE({{level1_col}}, "Global") & " > " &
        SELECTEDVALUE({{level2_col}}, "Region") & " > " &
        SELECTEDVALUE({{level3_col}}),
    ISINSCOPE({{level2_col}}),
        SELECTEDVALUE({{level1_col}}, "Global") & " > " &
        SELECTEDVALUE({{level2_col}}),
    ISINSCOPE({{level1_col}}),
        SELECTEDVALUE({{level1_col}}),
    "Enterprise Overview (All Locations)"
)`,
  },
  {
    id: 'title-currency-context',
    name: 'Currency & Unit Context Subtitle',
    category: 'dynamic-titles',
    description: 'Displays current reporting currency and scaling unit (e.g. "Amounts displayed in Millions USD ($M)").',
    difficulty: 'Beginner',
    tags: ['currency', 'units', 'scaling', 'subtitle'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Report Canvas Header Subtitle',
      performanceNote: 'Zero performance impact.',
      bestPractice: 'Essential for financial dashboards to eliminate unit ambiguity.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Currency Unit Label', defaultValue: 'Currency Unit Label', description: 'Measure name', type: 'text' },
      { id: 'curr_col', label: 'Currency Column', placeholder: "'Currency'[Code]", defaultValue: "'Currency'[Code]", description: 'Selected currency code', type: 'column' },
      { id: 'scale_text', label: 'Scale Descriptor', placeholder: '"Millions"', defaultValue: '"Millions"', description: 'Scale text (Thousands, Millions)', type: 'text' },
    ],
    templateDax: `{{measure_name}} =
VAR _Curr = SELECTEDVALUE({{curr_col}}, "USD")
RETURN
    "Values in " & {{scale_text}} & " " & _Curr & " • Standard Exchange Rate"`,
  },
  {
    id: 'title-top-n-dynamic-header',
    name: 'Top N Dynamic Header with Share of Total',
    category: 'dynamic-titles',
    description: 'Header stating: "Top 5 Products represent $1.2M (64.2% of Total Sales)".',
    difficulty: 'Advanced',
    tags: ['top-n', 'share-of-total', 'header', 'summary'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Top N Bar Chart Title',
      performanceNote: 'Uses CALCULATE with ALLSELECTED for accurate denominator.',
      bestPractice: 'Dynamically updates when user adjusts the Top N parameter slider.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Top N Summary Title', defaultValue: 'Top N Summary Title', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Evaluated metric', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Product'[Name]", defaultValue: "'Product'[Name]", description: 'Entity dimension', type: 'column' },
      { id: 'top_count', label: 'Top N Count', placeholder: '5', defaultValue: '5', description: 'Number of top items', type: 'number' },
    ],
    templateDax: `{{measure_name}} =
VAR _TopTotal =
    CALCULATE(
        {{base_measure}},
        TOPN({{top_count}}, ALLSELECTED({{entity_column}}), {{base_measure}}, DESC)
    )
VAR _GrandTotal =
    CALCULATE(
        {{base_measure}},
        ALLSELECTED({{entity_column}})
    )
VAR _Share = DIVIDE(_TopTotal, _GrandTotal)
RETURN
    "Top " & {{top_count}} & " Leaders: " &
    FORMAT(_TopTotal, "$#,##0") &
    " (" & FORMAT(_Share, "0.0%") & " of Total)"`,
  },

  // =========================================================================
  // 4. KPI & VARIANCE LOGIC (8 Measures)
  // =========================================================================
  {
    id: 'variance-to-target',
    name: 'Variance to Target (Actual - Target)',
    category: 'kpi-logic',
    description: 'Standard absolute delta between Actual and Target values with null checking.',
    difficulty: 'Beginner',
    tags: ['variance', 'target', 'actual', 'delta'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Variance waterfall or KPI card',
      formatString: '+$#,##0;-$#,##0;$0',
      performanceNote: 'Both inputs are simple scalar measures.',
      bestPractice: 'Blank out result if Actual is empty to avoid phantom variances.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Variance', defaultValue: 'Sales Variance', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target value', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
RETURN
    IF(
        NOT ISBLANK(_Actual) && NOT ISBLANK(_Target),
        _Actual - _Target,
        BLANK()
    )`,
  },
  {
    id: 'target-variance-pct',
    name: 'Target Variance % (Actual vs Target Ratio)',
    category: 'kpi-logic',
    description: 'Percentage over/under budget or plan with safe division.',
    difficulty: 'Beginner',
    tags: ['target', 'variance-pct', 'budget', 'plan'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Executive KPI Badge, Bullet Graph, or Bar Chart',
      formatString: '+0.0%;-0.0%;0.0%',
      performanceNote: 'Single DIVIDE call executed inside VertiPaq engine.',
      bestPractice: 'Apply conditional formatting to this measure for instant red/green signals.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales vs Target %', defaultValue: 'Sales vs Target %', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target value', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
RETURN
    DIVIDE(_Actual - _Target, _Target, BLANK())`,
  },
  {
    id: 'kpi-status-flag',
    name: 'KPI Status Flag (1, 0, -1 Indicator)',
    category: 'kpi-logic',
    description: 'Numeric flag for sorting, filtering, or powering custom icon rules in visual formatting.',
    difficulty: 'Beginner',
    tags: ['KPI', 'flag', 'status', 'indicator'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Table icon formatting or slicer filtering',
      formatString: '0',
      performanceNote: 'Integer results compress tightly in memory.',
      bestPractice: 'Use 1 for Green/Good, 0 for Warning/Amber, -1 for Alert/Red.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'KPI Status Flag', defaultValue: 'KPI Status Flag', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target value', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _VariancePct = DIVIDE(_Actual - _Target, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Actual), BLANK(),
        _VariancePct >= 0.00,  1,  // Met or exceeded
        _VariancePct >= -0.05, 0,  // Within 5% tolerance
        -1                         // Off track (>5% deficit)
    )`,
  },
  {
    id: 'unicode-kpi-badge',
    name: 'Unicode KPI Badge & Trend Arrow (▲ / ▼ / ▶)',
    category: 'kpi-logic',
    description: 'Combines directional Unicode glyph with formatted percent delta for compact tables.',
    difficulty: 'Beginner',
    tags: ['unicode', 'arrow', 'badge', 'compact', 'kpi'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Table or Matrix column next to primary measure',
      performanceNote: 'Pure text synthesis; no extra calculation load.',
      bestPractice: 'Pairs beautifully with font color conditional formatting.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'KPI Badge Text', defaultValue: 'KPI Badge Text', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Sales Actual]', defaultValue: '[Sales Actual]', description: 'Actual value', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Target value', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
VAR _Variance = DIVIDE(_Actual - _Target, _Target)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Variance), "—",
        _Variance >= 0.02,  "▲ " & FORMAT(_Variance, "+0.0%"),
        _Variance <= -0.02, "▼ " & FORMAT(_Variance, "0.0%"),
        "▶ " & FORMAT(_Variance, "0.0%")
    )`,
  },
  {
    id: 'month-pace-projection',
    name: 'Month-End Run-Rate Projection',
    category: 'kpi-logic',
    description: 'Extrapolates current MTD performance to predict month-end closing total based on days elapsed.',
    difficulty: 'Advanced',
    tags: ['run-rate', 'pace', 'projection', 'forecast', 'MTD'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Bullet graph target or monthly pace card',
      formatString: '$#,##0',
      performanceNote: 'Calculates day counts dynamically from calendar.',
      bestPractice: 'Only evaluate for the currently active calendar month.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Month Run Rate', defaultValue: 'Sales Month Run Rate', description: 'Measure name', type: 'text' },
      { id: 'mtd_measure', label: 'MTD Measure', placeholder: '[Sales MTD]', defaultValue: '[Sales MTD]', description: 'Month-to-date base measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Today = TODAY()
VAR _CurrentMonth = MONTH(_Today)
VAR _CurrentYear = YEAR(_Today)
VAR _DaysInMonth =
    DAY(EOMONTH(_Today, 0))
VAR _DaysElapsed =
    DAY(_Today)
VAR _MTD = {{mtd_measure}}
VAR _RunRate =
    DIVIDE(_MTD, _DaysElapsed) * _DaysInMonth
RETURN
    IF(
        SELECTEDVALUE({{date_column}}) <= _Today,
        _RunRate,
        BLANK()
    )`,
  },
  {
    id: 'goal-achievement-index',
    name: 'Goal Achievement Index (100 = Target Met)',
    category: 'kpi-logic',
    description: 'Normalized index where 100 represents 100% target realization; 115 represents 15% outperformance.',
    difficulty: 'Beginner',
    tags: ['index', 'goal', 'achievement', 'benchmark'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'KPI Gauge or Horizontal Bar Chart with 100 benchmark line',
      formatString: '#,##0.0 "idx"',
      performanceNote: 'Multiplies safe division by 100.',
      bestPractice: 'Ideal for cross-departmental normalized scoring.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Achievement Index', defaultValue: 'Achievement Index', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Measure', placeholder: '[Total Revenue]', defaultValue: '[Total Revenue]', description: 'Actual volume', type: 'measure' },
      { id: 'target_measure', label: 'Target Measure', placeholder: '[Budget Revenue]', defaultValue: '[Budget Revenue]', description: 'Budget goal', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Target = {{target_measure}}
RETURN
    DIVIDE(_Actual, _Target) * 100`,
  },
  {
    id: 'burndown-remaining-pct',
    name: 'Burn-Down % Remaining (Quota / Sprint)',
    category: 'kpi-logic',
    description: 'Tracks remaining quota deficit or remaining workload % toward a fixed milestone.',
    difficulty: 'Beginner',
    tags: ['burndown', 'quota', 'remaining', 'sprint'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Donut chart (Completed vs Remaining) or Progress Bar',
      formatString: '0.0%',
      performanceNote: 'Clamped between 0% and 100% to prevent negative overflow.',
      bestPractice: 'Use for sales quota tracking or agile velocity dashboards.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Quota Remaining %', defaultValue: 'Quota Remaining %', description: 'Measure name', type: 'text' },
      { id: 'actual_measure', label: 'Actual Achieved', placeholder: '[Sales Closed]', defaultValue: '[Sales Closed]', description: 'Current progress', type: 'measure' },
      { id: 'quota_measure', label: 'Total Quota / Goal', placeholder: '[Sales Target]', defaultValue: '[Sales Target]', description: 'Full target amount', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Actual = {{actual_measure}}
VAR _Quota = {{quota_measure}}
VAR _Remaining = _Quota - _Actual
VAR _PctRemaining = DIVIDE(_Remaining, _Quota)
RETURN
    MAX(0, _PctRemaining)`,
  },
  {
    id: 'normalized-benchmark-index',
    name: 'Benchmark Index vs Organization Average (Base = 100)',
    category: 'kpi-logic',
    description: 'Indexes each entity against the overall fleet/company average (Average = 100).',
    difficulty: 'Intermediate',
    tags: ['benchmark', 'index', 'fleet-average', 'comparison'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Tornado / Diverging bar chart with reference line at 100',
      formatString: '#,##0.0',
      performanceNote: 'Uses ALLSELECTED to compute company baseline once per visual.',
      bestPractice: 'Values above 100 indicate above-average performance.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Benchmark Index', defaultValue: 'Sales Benchmark Index', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Metric being benchmarked', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Store'[Store Name]", defaultValue: "'Store'[Store Name]", description: 'Dimension entity', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _EntityVal = {{base_measure}}
VAR _AvgVal =
    AVERAGEX(
        ALLSELECTED({{entity_column}}),
        {{base_measure}}
    )
RETURN
    DIVIDE(_EntityVal, _AvgVal) * 100`,
  },

  // =========================================================================
  // 5. RANKINGS & PARETO (8 Measures)
  // =========================================================================
  {
    id: 'top-n-rank',
    name: 'Dynamic Rank (RANKX with Context Guard)',
    category: 'rankings-pareto',
    description: 'Calculates dynamic rank of entities with blank handling and ties prevention.',
    difficulty: 'Intermediate',
    tags: ['rank', 'RANKX', 'top-n', 'order'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Table / Matrix column or filter pane',
      formatString: '#,##0',
      performanceNote: 'Use ALLSELECTED instead of ALL to preserve outer slicers.',
      bestPractice: 'Add an IF check to return BLANK() if base measure is blank.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Product Sales Rank', defaultValue: 'Product Sales Rank', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Metric to rank by', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Product'[Product Name]", defaultValue: "'Product'[Product Name]", description: 'Dimension to rank', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{base_measure}}
RETURN
    IF(
        NOT ISBLANK(_Val),
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
    description: 'Cumulative % of total running sum for Pareto 80/20 ABC analysis.',
    difficulty: 'Advanced',
    tags: ['pareto', '80-20', 'cumulative', 'abc-analysis'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Pareto dual-axis chart (Bars = Sales, Line = Cumulative %)',
      formatString: '0.0%',
      performanceNote: 'Filters table by values greater than or equal to current row.',
      bestPractice: 'Add secondary reference line at 80% on the secondary Y-axis.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Cumulative %', defaultValue: 'Sales Cumulative %', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Metric to analyze', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Product'[Product Name]", defaultValue: "'Product'[Product Name]", description: 'Dimension to evaluate', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentVal = {{base_measure}}
VAR _GrandTotal =
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
    DIVIDE(_Cumulative, _GrandTotal, BLANK())`,
  },
  {
    id: 'pct-of-total',
    name: 'Category % of Total',
    category: 'rankings-pareto',
    description: 'Calculates each row contribution as a share of the grand total using ALLSELECTED.',
    difficulty: 'Beginner',
    tags: ['pct-of-total', 'share', 'contribution', 'proportion'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Matrix column or Bar chart data label',
      formatString: '0.0%',
      performanceNote: 'ALLSELECTED maintains user filter context while clearing current row.',
      bestPractice: 'Validate that the sum of rows equals 100%.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales % of Total', defaultValue: 'Sales % of Total', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Numerator measure', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Product'[Category]", defaultValue: "'Product'[Category]", description: 'Grouping column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Numerator = {{base_measure}}
VAR _Denominator =
    CALCULATE(
        {{base_measure}},
        ALLSELECTED({{entity_column}})
    )
RETURN
    DIVIDE(_Numerator, _Denominator, BLANK())`,
  },
  {
    id: 'top-5-and-others',
    name: 'Top 5 + "Others" Dynamic Grouping',
    category: 'rankings-pareto',
    description: 'Keeps top 5 entities intact and automatically aggregates all remaining entities into "Others".',
    difficulty: 'Advanced',
    tags: ['top-5', 'others', 'grouping', 'pareto'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Donut chart or Bar chart with high-cardinality data',
      formatString: '$#,##0',
      performanceNote: 'Requires a disconnected entity table containing the extra "Others" row.',
      bestPractice: 'Set up an extended table with an "Others" category record.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Top 5 + Others', defaultValue: 'Sales Top 5 + Others', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Measure to group', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'ProductGroup'[Entity]", defaultValue: "'ProductGroup'[Entity]", description: 'Disconnected entity column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _Selected = SELECTEDVALUE({{entity_column}})
VAR _Top5Table =
    TOPN(5, ALL({{entity_column}}), {{base_measure}}, DESC)
VAR _IsTop5 =
    _Selected IN SELECTCOLUMNS(_Top5Table, "Entity", {{entity_column}})
VAR _Top5Sum =
    CALCULATE({{base_measure}}, KEEPFILTERS(_Top5Table))
VAR _AllSum =
    CALCULATE({{base_measure}}, ALL({{entity_column}}))
RETURN
    SWITCH(
        TRUE(),
        _IsTop5, {{base_measure}},
        _Selected = "Others", _AllSum - _Top5Sum,
        BLANK()
    )`,
  },
  {
    id: 'pareto-abc-classification',
    name: 'Pareto ABC Classification (A=70%, B=20%, C=10%)',
    category: 'rankings-pareto',
    description: 'Classifies products or customers into Class A (Top 70%), Class B (Next 20%), or Class C (Bottom 10%).',
    difficulty: 'Advanced',
    tags: ['pareto', 'abc', 'classification', 'inventory'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Matrix table column or visual color grouping',
      performanceNote: 'Computes cumulative share in context transition.',
      bestPractice: 'Class A items should receive 80% of executive operational focus.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Product ABC Class', defaultValue: 'Product ABC Class', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Volume metric', type: 'measure' },
      { id: 'entity_column', label: 'Entity Column', placeholder: "'Product'[Product Key]", defaultValue: "'Product'[Product Key]", description: 'Item key', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentVal = {{base_measure}}
VAR _GrandTotal =
    CALCULATE({{base_measure}}, ALLSELECTED({{entity_column}}))
VAR _CumTotal =
    CALCULATE(
        {{base_measure}},
        FILTER(
            ALLSELECTED({{entity_column}}),
            {{base_measure}} >= _CurrentVal
        )
    )
VAR _CumPct = DIVIDE(_CumTotal, _GrandTotal)
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_CurrentVal), BLANK(),
        _CumPct <= 0.70, "Class A (Top 70%)",
        _CumPct <= 0.90, "Class B (Next 20%)",
        "Class C (Tail 10%)"
    )`,
  },
  {
    id: 'dense-rank-within-category',
    name: 'Dense Rank within Parent Category (ALLEXCEPT)',
    category: 'rankings-pareto',
    description: 'Ranks items strictly within their parent group or department, restarting at 1 for each category.',
    difficulty: 'Intermediate',
    tags: ['dense-rank', 'category-rank', 'allexcept', 'sub-group'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Hierarchical Matrix table with Category > Product rows',
      formatString: '#,##0',
      performanceNote: 'ALLEXCEPT efficiently scopes ranking context to the category slice.',
      bestPractice: 'Always specify DENSE in the 5th parameter of RANKX.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Rank in Category', defaultValue: 'Rank in Category', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Metric to rank', type: 'measure' },
      { id: 'category_col', label: 'Category Column', placeholder: "'Product'[Category]", defaultValue: "'Product'[Category]", description: 'Parent group column', type: 'column' },
      { id: 'item_table', label: 'Product Table', placeholder: "'Product'", defaultValue: "'Product'", description: 'Entity table to evaluate', type: 'table' },
    ],
    templateDax: `{{measure_name}} =
IF(
    NOT ISBLANK({{base_measure}}),
    RANKX(
        ALLEXCEPT({{item_table}}, {{category_col}}),
        {{base_measure}},
        ,
        DESC,
        Dense
    )
)`,
  },
  {
    id: 'bottom-n-underperformers',
    name: 'Bottom N Underperformers Flag',
    category: 'rankings-pareto',
    description: 'Identifies the worst N performing accounts or stores (Ranked ascending by revenue).',
    difficulty: 'Intermediate',
    tags: ['bottom-n', 'underperformers', 'filter', 'risk'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Visual-level filter pane on "At Risk Accounts" table',
      formatString: '0',
      performanceNote: 'Uses RANKX with ASC ordering to tag the bottom tail.',
      bestPractice: 'Set visual filter to `Bottom N Flag = 1`.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Is Bottom 10 Flag', defaultValue: 'Is Bottom 10 Flag', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Evaluation metric', type: 'measure' },
      { id: 'entity_col', label: 'Entity Column', placeholder: "'Customer'[Customer Name]", defaultValue: "'Customer'[Customer Name]", description: 'Dimension column', type: 'column' },
      { id: 'bottom_n', label: 'Bottom Count', placeholder: '10', defaultValue: '10', description: 'Count of bottom items', type: 'number' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{base_measure}}
VAR _RankAsc =
    IF(
        NOT ISBLANK(_Val),
        RANKX(
            ALLSELECTED({{entity_col}}),
            {{base_measure}},
            ,
            ASC,
            Dense
        )
    )
RETURN
    IF(_RankAsc <= {{bottom_n}} && NOT ISBLANK(_RankAsc), 1, 0)`,
  },
  {
    id: 'customer-clv-percentile',
    name: 'Customer Percentile Ranking (0 to 100%)',
    category: 'rankings-pareto',
    description: 'Computes exact percentile rank of an entity across the entire customer base.',
    difficulty: 'Advanced',
    tags: ['percentile', 'clv', 'ranking', 'distribution'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Customer 360 profile card or Scatter chart X-axis',
      formatString: '0.0%',
      performanceNote: 'COUNTROWS comparison over active entity population.',
      bestPractice: 'Use to identify the top 5% most valuable accounts.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Customer Percentile', defaultValue: 'Customer Percentile', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Customer Lifetime Revenue]', defaultValue: '[Customer Lifetime Revenue]', description: 'Metric', type: 'measure' },
      { id: 'customer_col', label: 'Customer Column', placeholder: "'Customer'[Customer ID]", defaultValue: "'Customer'[Customer ID]", description: 'Customer identifier', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentVal = {{base_measure}}
VAR _TotalEntities =
    COUNTROWS(ALLSELECTED({{customer_col}}))
VAR _EntitiesBelow =
    COUNTROWS(
        FILTER(
            ALLSELECTED({{customer_col}}),
            {{base_measure}} < _CurrentVal
        )
    )
RETURN
    IF(
        NOT ISBLANK(_CurrentVal),
        DIVIDE(_EntitiesBelow, _TotalEntities, 0)
    )`,
  },

  // =========================================================================
  // 6. METRIC SWITCHERS & ADVANCED ANALYTICS (10 Measures)
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
  {
    id: 'cagr-multi-year',
    name: 'CAGR (Compound Annual Growth Rate)',
    category: 'metric-switching',
    description: 'Calculates annualized compound growth rate over multi-year horizons: ((End / Start) ^ (1/N)) - 1.',
    difficulty: 'Advanced',
    tags: ['CAGR', 'compound-growth', 'annualized', 'investment'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Executive Strategy Card or 5-Year Trend Summary',
      formatString: '+0.0%;-0.0%;0.0%',
      performanceNote: 'Guards against division by zero and negative root errors.',
      bestPractice: 'Only compute when N years elapsed is at least 1.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Revenue 3Y CAGR', defaultValue: 'Revenue 3Y CAGR', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Annual volume measure', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
      { id: 'year_count', label: 'Number of Years', placeholder: '3', defaultValue: '3', description: 'Lookback horizon in years', type: 'number' },
    ],
    templateDax: `{{measure_name}} =
VAR _EndVal = {{base_measure}}
VAR _StartVal =
    CALCULATE(
        {{base_measure}},
        DATEADD({{date_column}}, -{{year_count}}, YEAR)
    )
VAR _Years = {{year_count}}
RETURN
    IF(
        _StartVal > 0 && _EndVal > 0,
        (_EndVal / _StartVal) ^ (1 / _Years) - 1,
        BLANK()
    )`,
  },
  {
    id: 'customer-retention-rate',
    name: 'Customer Retention Rate %',
    category: 'metric-switching',
    description: 'Measures % of customers who ordered in prior period that returned to order in the active period.',
    difficulty: 'Advanced',
    tags: ['retention', 'cohort', 'churn', 'customers'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Cohort Retention Matrix or Monthly Retention Trend Line',
      formatString: '0.0%',
      performanceNote: 'Uses INTERSECT to compute shared customer set efficiently.',
      bestPractice: 'Essential SaaS and eCommerce health indicator.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Customer Retention %', defaultValue: 'Customer Retention %', description: 'Measure name', type: 'text' },
      { id: 'customer_col', label: 'Customer Column', placeholder: "'Sales'[Customer ID]", defaultValue: "'Sales'[Customer ID]", description: 'Customer identifier', type: 'column' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Calendar date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _CurrentCustomers = VALUES({{customer_col}})
VAR _PriorCustomers =
    CALCULATE(
        VALUES({{customer_col}}),
        DATEADD({{date_column}}, -1, MONTH)
    )
VAR _RetainedCount =
    COUNTROWS(INTERSECT(_CurrentCustomers, _PriorCustomers))
VAR _PriorCount = COUNTROWS(_PriorCustomers)
RETURN
    DIVIDE(_RetainedCount, _PriorCount, BLANK())`,
  },
  {
    id: 'customer-churn-rate',
    name: 'Customer Churn Rate %',
    category: 'metric-switching',
    description: 'Percentage of prior period customers who made zero purchases in the current period.',
    difficulty: 'Advanced',
    tags: ['churn', 'attrition', 'customers', 'retention'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Executive Churn Alert Card or Area Chart',
      formatString: '0.0%',
      performanceNote: 'Computed as 1 minus Retention Rate.',
      bestPractice: 'Highlight in red whenever churn rises above acceptable threshold.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Customer Churn %', defaultValue: 'Customer Churn %', description: 'Measure name', type: 'text' },
      { id: 'retention_measure', label: 'Retention Measure', placeholder: '[Customer Retention %]', defaultValue: '[Customer Retention %]', description: 'Base retention rate measure', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Retention = {{retention_measure}}
RETURN
    IF(
        NOT ISBLANK(_Retention),
        1 - _Retention,
        BLANK()
    )`,
  },
  {
    id: 'market-basket-co-purchase',
    name: 'Market Basket Co-Purchase Affinity %',
    category: 'metric-switching',
    description: 'Calculates the % of orders containing Product A that also include Product B.',
    difficulty: 'Advanced',
    tags: ['market-basket', 'cross-sell', 'affinity', 'orders'],
    outputType: 'Percentage',
    powerBiTips: {
      recommendedVisual: 'Matrix cross-tabulation table with Product A on rows and Product B on columns',
      formatString: '0.0%',
      performanceNote: 'Evaluates transaction intersection using CALCULATETABLE and TREATAS.',
      bestPractice: 'Requires a secondary disconnected product dimension for the comparison axis.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Basket Affinity %', defaultValue: 'Basket Affinity %', description: 'Measure name', type: 'text' },
      { id: 'order_col', label: 'Order ID Column', placeholder: "'Sales'[Order ID]", defaultValue: "'Sales'[Order ID]", description: 'Transaction identifier', type: 'column' },
      { id: 'product_col', label: 'Primary Product Column', placeholder: "'Product'[Product Name]", defaultValue: "'Product'[Product Name]", description: 'Product on rows', type: 'column' },
      { id: 'compare_product_col', label: 'Secondary Product Column', placeholder: "'ProductCompare'[Product Name]", defaultValue: "'ProductCompare'[Product Name]", description: 'Disconnected product on columns', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _OrdersWithA = VALUES({{order_col}})
VAR _SelectedB = SELECTEDVALUE({{compare_product_col}})
VAR _OrdersWithB =
    CALCULATETABLE(
        VALUES({{order_col}}),
        ALL({{product_col}}),
        TREATAS({ _SelectedB }, {{product_col}})
    )
VAR _JointOrders =
    COUNTROWS(INTERSECT(_OrdersWithA, _OrdersWithB))
VAR _TotalA = COUNTROWS(_OrdersWithA)
RETURN
    DIVIDE(_JointOrders, _TotalA, BLANK())`,
  },
  {
    id: 'rolling-12m-active-customers',
    name: 'Rolling 12-Month Active Customers',
    category: 'metric-switching',
    description: 'Distinct count of customers who have transacted in the trailing 365 days from the active date.',
    difficulty: 'Intermediate',
    tags: ['active-customers', 'rolling-12m', 'distinctcount', 'cohort'],
    outputType: 'Integer',
    powerBiTips: {
      recommendedVisual: 'Monthly Active User (MAU) line chart',
      formatString: '#,##0',
      performanceNote: 'DATESINPERIOD handles the calendar shift cleanly.',
      bestPractice: 'Avoid calculating on empty future dates.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Active Customers L12M', defaultValue: 'Active Customers L12M', description: 'Measure name', type: 'text' },
      { id: 'customer_col', label: 'Customer Column', placeholder: "'Sales'[Customer ID]", defaultValue: "'Sales'[Customer ID]", description: 'Customer ID column', type: 'column' },
      { id: 'date_col', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _MaxDate = MAX({{date_col}})
RETURN
    CALCULATE(
        DISTINCTCOUNT({{customer_col}}),
        DATESINPERIOD({{date_col}}, _MaxDate, -12, MONTH)
    )`,
  },
  {
    id: 'dynamic-customer-segmentation',
    name: 'Dynamic Customer Tiering (Diamond, Platinum, Gold, Silver)',
    category: 'metric-switching',
    description: 'Classifies accounts on the fly into spend tiers based on lifetime purchase volume.',
    difficulty: 'Intermediate',
    tags: ['tiering', 'segmentation', 'rfm', 'vip'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Customer detail table column or loyalty donut visual',
      performanceNote: 'Evaluates base measure once per customer row.',
      bestPractice: 'Align tiers with marketing loyalty thresholds.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Customer Spend Tier', defaultValue: 'Customer Spend Tier', description: 'Measure name', type: 'text' },
      { id: 'spend_measure', label: 'Customer Spend Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Evaluated customer spend', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Spend = {{spend_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Spend), "No Orders",
        _Spend >= 100000, "💎 Diamond VIP ($100k+)",
        _Spend >=  50000, "🥇 Platinum ($50k-$100k)",
        _Spend >=  10000, "🥈 Gold ($10k-$50k)",
        "🥉 Silver (<$10k)"
    )`,
  },
  {
    id: 'moving-median-window',
    name: 'Moving Median (MEDIANX over Rolling Window)',
    category: 'metric-switching',
    description: 'Robust central tendency metric resistant to extreme outlier distortion.',
    difficulty: 'Advanced',
    tags: ['median', 'MEDIANX', 'rolling', 'robust-statistics'],
    outputType: 'Currency / Number',
    powerBiTips: {
      recommendedVisual: 'Line chart comparing Average vs Median over time',
      formatString: '$#,##0',
      performanceNote: 'MEDIANX sorts items in memory; scope rolling date window appropriately.',
      bestPractice: 'Ideal for real estate prices, salaries, and order basket sizes.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Median Order Size 30D', defaultValue: 'Median Order Size 30D', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Avg Order Value]', defaultValue: '[Avg Order Value]', description: 'Metric to evaluate', type: 'measure' },
      { id: 'date_column', label: 'Date Column', placeholder: "'Date'[Date]", defaultValue: "'Date'[Date]", description: 'Date column', type: 'column' },
    ],
    templateDax: `{{measure_name}} =
VAR _LastDate = MAX({{date_column}})
VAR _Window =
    DATESINPERIOD({{date_column}}, _LastDate, -30, DAY)
RETURN
    MEDIANX(
        _Window,
        {{base_measure}}
    )`,
  },
  {
    id: 'dynamic-unit-formatter-measure',
    name: 'Dynamic Unit Formatter ($1.2M, $450K, $320)',
    category: 'metric-switching',
    description: 'Automatically formats large numbers into human-readable compact notation (B, M, K).',
    difficulty: 'Beginner',
    tags: ['unit-formatting', 'compact-numbers', 'millions', 'billions', 'text'],
    outputType: 'Text / String',
    powerBiTips: {
      recommendedVisual: 'Executive KPI Cards where standard Power BI auto-units look clunky',
      performanceNote: 'Simple mathematical magnitude threshold comparison.',
      bestPractice: 'Use in card subtitles or matrix summary headers.',
    },
    parameters: [
      { id: 'measure_name', label: 'Measure Name', placeholder: 'Sales Compact Text', defaultValue: 'Sales Compact Text', description: 'Measure name', type: 'text' },
      { id: 'base_measure', label: 'Base Measure', placeholder: '[Total Sales]', defaultValue: '[Total Sales]', description: 'Numeric measure', type: 'measure' },
    ],
    templateDax: `{{measure_name}} =
VAR _Val = {{base_measure}}
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(_Val), "—",
        ABS(_Val) >= 1000000000, FORMAT(_Val / 1000000000, "$#,##0.0") & "B",
        ABS(_Val) >= 1000000,    FORMAT(_Val / 1000000, "$#,##0.0") & "M",
        ABS(_Val) >= 1000,       FORMAT(_Val / 1000, "$#,##0.0") & "K",
        FORMAT(_Val, "$#,##0")
    )`,
  },
];
