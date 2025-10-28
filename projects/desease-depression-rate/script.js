let data = undefined;

// Set up the visualization
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
const transitionDuration = 200;

const svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const xScale = d3.scaleLinear()
  .range([0, width]);

const yScale = d3.scaleLinear()
  .range([height, 0]);

// Add axes
const xAxis = svg.append("g")
  .attr("transform", `translate(0,${height})`);

const yAxis = svg.append("g");

// Add labels
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 10)
  .style("text-anchor", "middle")
  .text("Disease Prevalence (%)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 15)
  .style("text-anchor", "middle")
  .text("Depression Rate (%)");

// Set up bar chart
const barSvg = d3.select("#barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 150 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize year
let currentYear = 2019;

function updateButtonStyles() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Reset both buttons
  prevBtn.disabled = false;
  nextBtn.disabled = false;

  // Disable and style prev button if year is 2019
  if (currentYear === 2019) {
    prevBtn.disabled = true;
  }

  // Disable and style next button if year is 2022
  if (currentYear === 2022) {
    nextBtn.disabled = true;
  }
}

// Function to update the visualization
function updateVisualization() {

  // Clear existing bar chart
  barSvg.selectAll("*").remove();

  const yearData = data[currentYear];

  // Update scales
  xScale.domain([0, 100]);
  yScale.domain([0, d3.max(yearData, d => d.depressionRate)]);

  // Update axes
  xAxis.transition().duration(transitionDuration).call(d3.axisBottom(xScale));
  yAxis.transition().duration(transitionDuration).call(d3.axisLeft(yScale));

  // Update points
  const points = svg.selectAll("circle")
    .data(yearData, d => d.disease);

  points.enter()
    .append("circle")
    .attr("cx", d => xScale(d.prevalence))
    .attr("cy", d => yScale(d.depressionRate))
    .attr("r", 10)
    .attr("fill", d => colorScale(d.disease))
    .on("click", showBarChart)
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 13)
        .attr("fill", "black");
    })
    .on("mouseout", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 10)
        .attr("fill", d => colorScale(d.disease));
    })
    .merge(points)
    .transition()
    .duration(transitionDuration)
    .attr("cx", d => xScale(d.prevalence))
    .attr("cy", d => yScale(d.depressionRate));

  points.exit()
    .transition()
    .duration(transitionDuration)
    .attr("r", 0)
    .remove();

  // Update annotations
  const sorted = yearData.sort((a, b) => b.prevalence - a.prevalence);
  const annotations = sorted.map((d, i) => ({
    note: {
      wrap: "none",
      label: d.disease
    },
    x: xScale(d.prevalence),
    y: yScale(d.depressionRate),
    dy: (i + 1) * 22,
    dx: 10
  }));

  const makeAnnotations = d3.annotation()
    .annotations(annotations);

  svg.selectAll(".annotation-group").remove();
  svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);

  // Update year title
  d3.select("#currentYear").text(currentYear);

  // Update button styles
  updateButtonStyles();
}

function showBarChart(_, d) {
  const barHeight = 30;

  // Clear previous bar chart
  barSvg.selectAll("*").remove();

  // Sort details from high to low
  const sortedDetails = d.details.sort((a, b) => b.value - a.value);

  // Set up scales for bar chart
  const xBarScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  const yBarScale = d3.scaleBand()
    .domain(sortedDetails.map(detail => detail.name))
    .range([0, barHeight * sortedDetails.length])
    .padding(0.1);

  // Add bars
  barSvg.selectAll(".bar")
    .data(sortedDetails)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", detail => yBarScale(detail.name))
    .attr("height", yBarScale.bandwidth())
    .attr("fill", colorScale(d.disease))
    .attr("width", 0) // Start with width 0
    .transition() // Add transition
    .duration(transitionDuration)
    .attr("width", detail => xBarScale(detail.value)); // Animate to full width

  // Add labels on the left
  barSvg.selectAll(".label")
    .data(sortedDetails)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", 10)
    .attr("y", detail => yBarScale(detail.name) + yBarScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    //.attr("text-anchor", "end")
    .text(detail => detail.name)
    .style("opacity", 0) // Start with opacity 0
    .transition()
    .duration(transitionDuration)
    .style("opacity", 1); // Fade in to full opacity

  // Add x-axis
  const xAxis = barSvg.append("g")
    .attr("transform", `translate(0, ${yBarScale.range()[1]})`)
    .call(d3.axisBottom(xBarScale).ticks(5).tickFormat(d => d + "%"));

  xAxis.style("opacity", 0) // Start with opacity 0
    .transition()
    .duration(transitionDuration)
    .style("opacity", 1); // Fade in to full opacity

  // Add title
  barSvg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(`Contributors to ${d.disease} in ${currentYear}`)
    .style("opacity", 0) // Start with opacity 0
    .transition()
    .duration(transitionDuration)
    .style("opacity", 1); // Fade in to full opacity
}

// Event listeners for buttons
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentYear > 2019) {
    currentYear--;
    updateVisualization();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentYear < 2022) {
    currentYear++;
    updateVisualization();
  }
});

// Initial update
d3
  .json('./data.json')
  .then((loadedData) => {
    data = loadedData;
    updateVisualization();
    updateButtonStyles();
  });
