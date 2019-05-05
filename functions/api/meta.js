export function onRequestGet(context) {
	const data ={}
	return new Response(JSON.stringify(data), {
		headers: {
			"content-type": "application/json",
		},
		status: 200,
	})
}