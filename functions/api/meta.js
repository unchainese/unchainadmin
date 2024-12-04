export function onRequestGet(context) {
	const id =  crypto.randomUUID()
	const data ={id}
	return new Response(JSON.stringify(data), {
		headers: {
			"content-type": "application/json",
		},
		status: 200,
	})
}