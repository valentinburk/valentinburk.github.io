# Disease Effect on Depression Rate Visualization

This project presents a narrative visualization of the effect various diseases have on depression rates in the United States from 2019 to 2022.

## Project Overview

### Key Message

This visualization communicates the complex effect of various diseases on depression rates in the United States. It highlights:

- Which health conditions have biggest effect on depression rates
- How this effect have evolved from 2019 to 2022
- The multifaceted nature of each disease through detailed breakdowns
- Varying prevalence of different diseases and their relative impact on public health

### Narrative Structure

The visualization follows an interactive slideshow structure, providing:

- Guided navigation through years (2019-2022) using "Previous Year" and "Next Year" buttons
- A consistent main view (scatterplot) for each year
- Interactive exploration within each year's data
- Freedom to move between years and interact with individual data points

### Visual Elements

#### Main Visualization

- Primary structure: Scatterplot
- X-axis: Disease prevalence
- Y-axis: Depression rate
- Each disease represented by a colored circle

#### Detailed View

- Secondary structure: Bar chart
- Triggered by clicking on a disease point
- Shows breakdown of factors contributing to the selected disease

### Scene Organization

- Scenes are defined by years (2019-2022)
- Chronological ordering to:
  - Provide natural progression through data
  - Allow easy identification of trends over time
  - Build context as viewers progress
  - Reflect authentic data collection and analysis timeline

### Annotation Approach

- Text labels connected to each data point on the scatterplot
- Consistent style and positioning relative to data points
- Minimal design to avoid cluttering the visualization
- Annotations move with data points between years to highlight changes

### Parametric Design

#### Main Parameters

1. Year (2019, 2020, 2021, 2022)
2. Selected disease (for detailed view)

#### Visualization States

1. Main view (scatterplot for a specific year)
2. Detailed view (main view + bar chart for a selected disease)

### User Interaction

#### Key Triggers

1. Year navigation buttons
2. Disease point selection
3. Hover interactions

#### User Affordances

- Styled buttons for year navigation
- Cursor changes for interactive elements
- Visual feedback on hover for disease points

## How to Use

1. Navigate through years using the "Previous Year" and "Next Year" buttons
2. Click on any disease circle to see a detailed breakdown of contributing factors
3. Hover over circles for more information

## Data Source

Data is sourced from the  **U.S. Chronic Disease Indicators**: https://catalog.data.gov/dataset/u-s-chronic-disease-indicators

## Technologies Used

- D3.js for data visualization
- HTML/CSS for structure and styling
- JavaScript for interactivity
