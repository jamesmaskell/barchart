document.addEventListener("DOMContentLoaded", () => {
	console.log("We are now alive");

	containerHeight = window.innerHeight - 200;
	containerWidth = window.innerWidth - 200;
	containerPadding = 50;

	getData().then((data) => {
		let container = createContainer(containerHeight, containerWidth);
		let scaleArray = createScales(
			data.data,
			containerHeight,
			containerWidth,
			containerPadding
		);
		createAxis(scaleArray, containerHeight, containerPadding);
		createBars(
			scaleArray,
			data.data,
			containerHeight,
			containerWidth,
			containerPadding
		);
	});
});

function createAxis(scaleArray, containerHeight, containerPadding) {
	let xScale = scaleArray[0];
	let yScale = scaleArray[1];

	let yAxis = d3.axisLeft(yScale);
	let xAxis = d3.axisBottom(xScale);

	d3.select("svg")
		.append("g")
		.attr("id", "y-axis")
		.attr("transform", "translate(" + containerPadding + ",0)")
		.call(yAxis);
	d3.select("svg")
		.append("g")
		.attr("id", "x-axis")
		.attr(
			"transform",
			"translate(0," + (containerHeight - containerPadding) + ")"
		)
		.call(xAxis);
}

function getData() {
	let url =
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
	return fetch(url).then((response) => response.json());
}

function createScales(
	dataset,
	containerHeight,
	containerWidth,
	containerPadding
) {
	let yMax = d3.max(dataset, (d) => d[1]);
	let yScale = d3.scaleLinear();
	yScale
		.domain([0, yMax])
		.range([containerHeight - containerPadding, containerPadding]);

	let xScale = d3.scaleTime();

	console.log(d3.min(dataset, (d) => d[0]));

	let xMin = d3.min(dataset, (d) => d[0]);
	let xMax = d3.max(dataset, (d) => d[0]);

	xScale
		.domain([new Date(xMin), new Date(xMax)])
		.range([containerPadding, containerWidth - containerPadding]);

	return [xScale, yScale];
}

function createContainer(containerHeight, containerWidth) {
	d3.select("body")
		.append("svg")
		.attr("width", containerWidth)
		.attr("height", containerHeight);
}

function createBars(
	scaleArray,
	dataset,
	containerHeight,
	containerWidth,
	containerPadding
) {
	let xScale = scaleArray[0];
	let yScale = scaleArray[1];

	let columnWidth = (containerWidth - containerPadding * 2) / dataset.length;
	let barWidth = columnWidth - 2;

	console.log(xScale(243.1));
	console.log(xScale(14000));

	d3.select("svg")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.attr("width", 3)
		.attr("height", (d) => containerHeight - yScale(d[1]) - containerPadding)
		.attr("x", (d) => xScale(new Date(d[0])))
		.attr("y", (d) => yScale(d[1]))
		.attr("fill", "blue")
		.append("title")
		.text((d) => d[0]);
}
