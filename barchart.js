document.addEventListener("DOMContentLoaded", () => {
	console.log("We are now alive");

	containerHeight = window.innerHeight - 50;
	containerWidth = window.innerWidth - 50;
	containerPadding = 20;

	getData().then((data) => {
		let container = createContainer(containerHeight, containerWidth);
		let scaleArray = createScales(
			data.data,
			containerHeight,
			containerWidth,
			containerPadding
		);
		//createAxis(scaleArray, data.data);
		createBars(
			scaleArray,
			data.data,
			containerHeight,
			containerWidth,
			containerPadding
		);
	});
});

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
		.domain([yMax, 0])
		.range([containerHeight - containerPadding, containerPadding]);

	let xScale = d3.scaleLinear();

	xScale
		.domain([0, dataset.length])
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

	console.log(xScale(275), dataset.length);

	let columnWidth = (containerWidth - containerPadding * 2) / dataset.length;
	let barWidth = columnWidth - 3;

	d3.select("svg")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("width", barWidth)
		.attr("height", (d) => yScale(d[1]) - containerPadding)
		.attr("x", (d, i) => xScale(i))
		.attr("y", (d) => containerHeight - yScale(d[1]))
		.attr("fill", "blue");
}
