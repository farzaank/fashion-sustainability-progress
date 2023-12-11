/*
// Load and process the data
d3.csv("path_to_your_csv.csv").then(function (data) {
	// Dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 30, left: 60 },
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// Append the svg object to the body of the page
	const svg = d3
		.select("svg")
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Reshape the data
	let reshapedData = [];
	let yearSums = {};
	let yearCounts = {};
	data.forEach((d) => {
		for (let year = 2019; year <= 2023; year++) {
			let value = +d[year + " s2"];
			reshapedData.push({
				name: d.name,
				year: year,
				value: value,
			});
			yearSums[year] = (yearSums[year] || 0) + value;
			yearCounts[year] = (yearCounts[year] || 0) + 1;
		}
	});
    

	// Calculate averages
	let averages = [];
	for (let year = 2019; year <= 2023; year++) {
		averages.push({
			year: year,
			value: yearSums[year] / yearCounts[year],
		});
	}

	// Group the data by name
	let groupedData = d3.group(reshapedData, (d) => d.name);

	// Color scale
	const color = d3
		.scaleOrdinal()
		.domain(groupedData.keys())
		.range(d3.schemeCategory10);

	// X scale and axis
	const x = d3.scaleLinear().domain([2019, 2023]).range([0, width]);

	svg
		.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(
			d3
				.axisBottom(x)
				.ticks(5) // Explicitly setting 5 ticks for 5 years
				.tickFormat(d3.format("d"))
		);

	// Y scale and axis
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(reshapedData, (d) => d.value)])
		.range([height, 0]);
	svg.append("g").call(d3.axisLeft(y));

	// Line generator
	const line = d3
		.line()
		.x((d) => x(d.year))
		.y((d) => y(d.value));

	// Draw the lines for each name
	svg
		.selectAll(".line")
		.data(groupedData)
		.enter()
		.append("path")
		.attr("class", "line")
		.attr("d", (d) => line(d[1]))
		.attr("fill", "none")
		.attr("stroke", (d) => color(d[0]))
		.attr("stroke-width", 2.5)
		.on("mouseover", function (event, d) {
			tooltip.transition().duration(200).style("opacity", 1);
			tooltip
				.html(d[0]) // Displaying the name on the tooltip
				.style("left", event.pageX + "px")
				.style("top", event.pageY + "px");
		})
		.on("mousemove", function (event, d) {
			tooltip
				.style("left", event.pageX + "px")
				.style("top", event.pageY + "px");
		})
		.on("mouseout", function (d) {
			tooltip.transition().duration(500).style("opacity", 0);
		});

	// Draw the average line
	svg
		.append("path")
		.datum(averages)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 4)
		.attr("stroke-dasharray", "5,5")
		.attr("d", line)
		.on("mouseover", function (event, d) {
			tooltip.transition().duration(200).style("opacity", 1);
			tooltip
				.html("Average") // Displaying the name on the tooltip
				.style("left", event.pageX + "px")
				.style("top", event.pageY + "px");
		})
		.on("mousemove", function (event, d) {
			tooltip
				.style("left", event.pageX + "px")
				.style("top", event.pageY + "px");
		})
		.on("mouseout", function (d) {
			tooltip.transition().duration(500).style("opacity", 0);
		});

	console.log(averages);

	// Tooltip
	const tooltip = d3
		.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px")
		.style("position", "absolute");

	// Add the tooltip logic here (mouseover, mousemove, mouseout events)
});

*/

// Load and process the data
d3.csv("path_to_your_csv.csv").then(function (data) {
	// Dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 30, left: 60 },
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// Append the svg object to the body of the page
	const svg = d3
		.select("svg")
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// X scale and axis
	const x = d3.scaleLinear().domain([2019, 2023]).range([0, width]);

	svg
		.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(
			d3
				.axisBottom(x)
				.ticks(5) // Explicitly setting 5 ticks for 5 years
				.tickFormat(d3.format("d"))
		);
	// Y scale and axis
	const y = d3
		.scaleLinear()
		.domain([0, 1]) // Initial domain, will be updated
		.range([height, 0]);
	const yAxis = svg.append("g").call(d3.axisLeft(y));

	// Line generator
	const line = d3
		.line()
		.x((d) => x(d.year))
		.y((d) => y(d.value));

	// Line generator for average line
	const avgLine = d3
		.line()
		.x((d) => x(d.year))
		.y((d) => y(d.avgValue));

	// Function to update the chart
	function updateChart(selectedCategory) {
		// Reshape data for the selected category
		let reshapedData = [];
		data.forEach((d) => {
			for (let year = 2019; year <= 2023; year++) {
				reshapedData.push({
					name: d.name,
					year: year,
					category: selectedCategory,
					value: +d[year + " " + selectedCategory],
				});
			}
		});

		// Update Y scale domain
		y.domain([0, d3.max(reshapedData, (d) => d.value)]);
		yAxis.transition().call(d3.axisLeft(y));

		// Group the data by name
		let groupedData = d3.group(reshapedData, (d) => d.name);

		// Draw the lines
		const lines = svg
			.selectAll(".line-group")
			.data(groupedData)
			.join("g")
			.attr("class", "line-group")
			.on("mouseover", function (event, d) {
				tooltip.transition().duration(200).style("opacity", 1);
				tooltip
					.html(d[0]) // Displaying the name on the tooltip
					.style("left", event.pageX + "px")
					.style("top", event.pageY + "px");
			})
			.on("mousemove", function (event, d) {
				tooltip
					.style("left", event.pageX + "px")
					.style("top", event.pageY + "px");
			})
			.on("mouseout", function (d) {
				tooltip.transition().duration(500).style("opacity", 0);
			});

		lines
			.selectAll(".line")
			.data((d) => [d])
			.join("path")
			.attr("class", "line")
			.transition()
			.attr("d", (d) => line(d[1]))
			.attr("fill", "none")
			.attr("stroke", (d) => color(d[0]))
			.attr("stroke-width", 2.5);

		// Calculate and draw the average line
		// ... [average calculation and drawing logic as previously described]
		let yearSums = {},
			yearCounts = {};
		reshapedData.forEach((d) => {
			if (!yearSums[d.year]) {
				yearSums[d.year] = 0;
				yearCounts[d.year] = 0;
			}
			yearSums[d.year] += d.value;
			yearCounts[d.year]++;
		});

		let averages = Object.keys(yearSums).map((year) => ({
			year: +year,
			avgValue: yearSums[year] / yearCounts[year],
		}));

		svg
			.selectAll(".average-line")
			.data([averages])
			.join("path")
			.attr("class", "average-line")
			.transition()
			.attr("d", avgLine)
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("stroke-dasharray", "5,5");

		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")
			.style("position", "absolute");
	}

	// Event listener for the dropdown menu
	d3.select("#categorySelector").on("change", function (event) {
		updateChart(this.value);
	});

	// Initial chart display
	updateChart("s3");
});
