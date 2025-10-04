function status(request, response) {
  response.status(200).json({ response: "Working fine" });
}

export default status;
