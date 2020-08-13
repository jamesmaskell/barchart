document.addEventListener("DOMContentLoaded", () => {
	console.log("We are now alive");

	getData().then((data) => {
		createContainer();
		createBars(data.data);
	});
});

function getData() {
	let url =
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
	return fetch(url).then((response) => response.json());
}

function createContainer() {
	d3.select("body").append("svg").attr("width", 1280).attr("height", 960);
}

function createBars(dataset) {
	d3.select("svg")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("width", 2)
		.attr("height", (d) => d[1] / 19)
		.attr("x", (d, i) => i * 4)
		.attr("y", (d) => 960 - d[1] / 19)
		.attr("fill", "blue");
}
