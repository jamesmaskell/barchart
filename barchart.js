document.addEventListener("DOMContentLoaded", () => {
	containerHeight = window.innerHeight - 200;
	containerWidth = window.innerWidth - 200;
	containerPadding = 50;

	getData().then((data) => {
		let container = createContainer(containerHeight, containerWidth);
		let scaleArray = createScales(data.data, containerHeight, containerWidth, containerPadding);
		createAxis(scaleArray, containerHeight, containerPadding);
		createBars(scaleArray, data.data, containerHeight, containerWidth, containerPadding);
	});
});

function createContainer(containerHeight, containerWidth) {
	d3.select("body").append("svg").attr("width", containerWidth).attr("height", containerHeight);
}

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
		.attr("transform", "translate(0," + (containerHeight - containerPadding) + ")")
		.call(xAxis);
}

function getData() {
	let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
	return fetch(url).then((response) => response.json());
}

function createScales(dataset, containerHeight, containerWidth, containerPadding) {
	let yMax = d3.max(dataset, (d) => d[1]);
	let yScale = d3.scaleLinear();
	yScale.domain([0, yMax]).range([containerHeight - containerPadding, containerPadding]);

	let xScale = d3.scaleTime();
	let xMin = d3.min(dataset, (d) => d[0]);
	let xMax = d3.max(dataset, (d) => d[0]);
	let date = new Date(xMax);
	date.setDate(date.getDate() + 92);
	xScale.domain([new Date(xMin), date]).range([containerPadding, containerWidth - containerPadding]);

	return [xScale, yScale];
}

function createBars(scaleArray, dataset, containerHeight, containerWidth, containerPadding) {
	let xScale = scaleArray[0];
	let yScale = scaleArray[1];

	let barWidth = (containerWidth - containerPadding * 2) / dataset.length + 0.5;
	let xAxisYPosition = containerHeight - containerPadding;

	d3.select("svg")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.attr("width", barWidth)
		.attr("height", (d) => xAxisYPosition - yScale(d[1]))
		.attr("x", (d) => xScale(new Date(d[0])))
		.attr("y", (d) => yScale(d[1]))
		.attr("fill", "blue")
		.on("mouseover", function (d, i) {
			addTooltipBox(xScale, yScale, d);
			addTooltipText(this, xScale, yScale, d, containerWidth);
		})
		.on("mouseout", removeTooltip);
}

function addTooltipBox(xScale, yScale, d, containerWidth) {
	console.log(d);
	d3.select("svg")
		.append("rect")
		.attr("id", "tooltip-box")
		.attr("x", xScale(new Date(d[0])) - 231)
		.attr("y", yScale(d[1]) - 50)
		.attr("width", 231)
		.attr("height", 50)
		.attr("fill", "yellow");
}

function addTooltipText(e, xScale, yScale, d, containerWidth) {
	d3.select(e).attr("fill", "red");

	if (xScale(new Date(d[0])) - 116 + 231 > containerWidth) {
		tooltipXPos = containerWidth - 231;
	} else {
		tooltipXPos = xScale(new Date(d[0])) - 116;
	}

	d3.select("svg").append("text").text(`Quarter: ${d[0]} GDP: ${d[1]}`).attr("id", "tooltip").attr("x", tooltipXPos).attr("y", yScale(d[1])).attr("data-date", d[0]).attr("data-gdp", d[1]);
}

function removeTooltip(d, i) {
	d3.select(this).attr("fill", "blue");
	d3.select("#tooltip").remove();
	d3.select("#tooltip-box").remove();
}
