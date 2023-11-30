export async function POST(request: Request) {
  console.log("current time", new Date().toLocaleTimeString());
  console.log("request.json()", await request.json());
  return new Response("Hello world!");
}
